import { Hono } from 'hono';
import { sql } from '../db/index.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
const transactions = new Hono();
transactions.use('/*', authMiddleware);
/**
 * POST /api/transactions
 * Buat transaksi baru dengan logika FEFO
 */
transactions.post('/', requireRole('kasir', 'admin'), async (c) => {
    try {
        const user = c.get('user');
        const { items, discount = 0, payment_method = 'cash', customer_name = 'Umum' } = await c.req.json();
        if (!items || items.length === 0) {
            return c.json({ success: false, message: 'Keranjang belanja tidak boleh kosong.' }, 400);
        }
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const countResult = await sql `
      SELECT COUNT(*)::int as count FROM sales 
      WHERE created_at::date = CURRENT_DATE
    `;
        const invoiceSeq = String((countResult[0].count || 0) + 1).padStart(4, '0');
        const invoiceNumber = `INV-${dateStr}-${invoiceSeq}`;
        let totalAmount = 0;
        const processedItems = [];
        for (const item of items) {
            const { medicine_id, quantity } = item;
            const medicine = await sql `SELECT * FROM medicines WHERE id = ${medicine_id}`;
            if (medicine.length === 0) {
                return c.json({ success: false, message: `Obat dengan ID ${medicine_id} tidak ditemukan.` }, 404);
            }
            const price = Number(medicine[0].price_sell);
            const subtotal = price * quantity;
            const availableBatches = await sql `
        SELECT * FROM medicine_batches 
        WHERE medicine_id = ${medicine_id} 
          AND stock_qty > 0 
          AND expiry_date > CURRENT_DATE
        ORDER BY expiry_date ASC
      `;
            const totalAvailable = availableBatches.reduce((sum, b) => sum + b.stock_qty, 0);
            if (totalAvailable < quantity) {
                return c.json({
                    success: false,
                    message: `Stok ${medicine[0].name} tidak mencukupi. Tersedia: ${totalAvailable}, dibutuhkan: ${quantity}.`,
                }, 400);
            }
            let remainingQty = quantity;
            const batchAllocations = [];
            for (const batch of availableBatches) {
                if (remainingQty <= 0)
                    break;
                const allocateQty = Math.min(remainingQty, batch.stock_qty);
                batchAllocations.push({ batch_number: batch.batch_number, qty: allocateQty, batch_id: batch.id });
                remainingQty -= allocateQty;
            }
            processedItems.push({
                medicine_id,
                medicine_name: medicine[0].name,
                price,
                quantity,
                subtotal,
                batchAllocations,
            });
            totalAmount += subtotal;
        }
        const netAmount = totalAmount - Number(discount);
        const transaction = await sql `
      INSERT INTO sales (invoice_number, user_id, customer_name, total_amount, discount, net_amount, payment_method)
      VALUES (${invoiceNumber}, ${user.userId}, ${customer_name}, ${totalAmount}, ${discount}, ${netAmount}, ${payment_method})
      RETURNING *
    `;
        const transactionId = transaction[0].id;
        for (const item of processedItems) {
            for (const alloc of item.batchAllocations) {
                await sql `
          INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal)
          VALUES (${transactionId}, ${item.medicine_id}, ${alloc.batch_number}, ${alloc.qty}, ${item.price}, ${item.price * alloc.qty})
        `;
                await sql `
          UPDATE medicine_batches SET stock_qty = stock_qty - ${alloc.qty}
          WHERE id = ${alloc.batch_id}
        `;
                // Update medicine stock_total
                await sql `
          UPDATE medicines SET stock_total = COALESCE(stock_total, 0) - ${alloc.qty}
          WHERE id = ${item.medicine_id}
        `;
                await sql `
          INSERT INTO stock_logs (medicine_id, batch_number, type, quantity, reason)
          VALUES (${item.medicine_id}, ${alloc.batch_number}, 'out', ${alloc.qty}, ${'Penjualan ' + invoiceNumber})
        `;
            }
        }
        return c.json({
            success: true,
            data: {
                transaction: transaction[0],
                items: processedItems,
                summary: {
                    subtotal: totalAmount,
                    discount: Number(discount),
                    total: netAmount,
                },
            },
        });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * GET /api/transactions
 */
transactions.get('/', async (c) => {
    try {
        const startDate = c.req.query('start_date');
        const endDate = c.req.query('end_date');
        let result;
        if (startDate && endDate) {
            result = await sql `
        SELECT s.*, u.name as cashier_name,
          COUNT(si.id)::int as item_count
        FROM sales s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN sale_items si ON s.id = si.sale_id
        WHERE s.created_at::date >= ${startDate} AND s.created_at::date <= ${endDate}
        GROUP BY s.id, u.name
        ORDER BY s.created_at DESC
      `;
        }
        else {
            result = await sql `
        SELECT s.*, u.name as cashier_name,
          COUNT(si.id)::int as item_count
        FROM sales s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN sale_items si ON s.id = si.sale_id
        GROUP BY s.id, u.name
        ORDER BY s.created_at DESC
        LIMIT 100
      `;
        }
        // Map `s.net_amount` to `total` for frontend compatibility
        const mapped = result.map((r) => ({
            ...r,
            total: r.net_amount
        }));
        return c.json({ success: true, data: mapped });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * GET /api/transactions/:id
 */
transactions.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const transaction = await sql `
      SELECT s.*, u.name as cashier_name
      FROM sales s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ${id}
    `;
        if (transaction.length === 0) {
            return c.json({ success: false, message: 'Transaksi tidak ditemukan.' }, 404);
        }
        const items = await sql `
      SELECT si.*, m.name as medicine_name, m.code as medicine_code, m.unit as medicine_unit
      FROM sale_items si
      JOIN medicines m ON si.medicine_id = m.id
      WHERE si.sale_id = ${id}
    `;
        // Map fields for frontend compatibility
        const transactionMapped = {
            ...transaction[0],
            total: transaction[0].net_amount
        };
        const itemsMapped = items.map((i) => ({
            ...i,
            price: i.price_per_unit
        }));
        return c.json({
            success: true,
            data: { ...transactionMapped, items: itemsMapped },
        });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
export default transactions;
