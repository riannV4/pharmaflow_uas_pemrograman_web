import { Hono } from 'hono';
import { sql } from '../db/index.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
const batches = new Hono();
batches.use('/*', authMiddleware);
/**
 * GET /api/batches
 * List batches (filter by medicine, expired status)
 */
batches.get('/', async (c) => {
    try {
        const medicineId = c.req.query('medicine_id') || '';
        const status = c.req.query('status') || '';
        let result;
        if (medicineId) {
            result = await sql `
        SELECT b.*, m.name as medicine_name, m.code as medicine_code, m.unit as medicine_unit
        FROM medicine_batches b
        JOIN medicines m ON b.medicine_id = m.id
        WHERE b.medicine_id = ${medicineId}
        ORDER BY b.expiry_date ASC
      `;
        }
        else {
            result = await sql `
        SELECT b.*, m.name as medicine_name, m.code as medicine_code, m.unit as medicine_unit
        FROM medicine_batches b
        JOIN medicines m ON b.medicine_id = m.id
        ORDER BY b.expiry_date ASC
      `;
        }
        const now = new Date();
        result = result.map((batch) => {
            const expiryDate = new Date(batch.expiry_date);
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            let expiry_status = 'safe';
            if (daysUntilExpiry <= 0) {
                expiry_status = 'expired';
            }
            else if (daysUntilExpiry <= 30) {
                expiry_status = 'critical';
            }
            else if (daysUntilExpiry <= 90) {
                expiry_status = 'warning';
            }
            return { ...batch, days_until_expiry: daysUntilExpiry, expiry_status };
        });
        if (status) {
            result = result.filter((b) => b.expiry_status === status);
        }
        return c.json({ success: true, data: result });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * GET /api/batches/expiring
 */
batches.get('/expiring', async (c) => {
    try {
        const result = await sql `
      SELECT b.*, m.name as medicine_name, m.code as medicine_code, m.unit as medicine_unit
      FROM medicine_batches b
      JOIN medicines m ON b.medicine_id = m.id
      WHERE b.stock_qty > 0 
        AND b.expiry_date <= CURRENT_DATE + INTERVAL '90 days'
      ORDER BY b.expiry_date ASC
    `;
        const now = new Date();
        const enriched = result.map((batch) => {
            const expiryDate = new Date(batch.expiry_date);
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            let expiry_status = 'warning';
            if (daysUntilExpiry <= 0) {
                expiry_status = 'expired';
            }
            else if (daysUntilExpiry <= 30) {
                expiry_status = 'critical';
            }
            return { ...batch, days_until_expiry: daysUntilExpiry, expiry_status };
        });
        return c.json({ success: true, data: enriched });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * POST /api/batches
 */
batches.post('/', requireRole('admin', 'apoteker'), async (c) => {
    try {
        const user = c.get('user');
        const { medicine_id, batch_number, quantity, expiry_date } = await c.req.json();
        if (!medicine_id || !batch_number || !quantity || !expiry_date) {
            return c.json({ success: false, message: 'Semua field harus diisi.' }, 400);
        }
        // Create batch
        const batch = await sql `
      INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date)
      VALUES (${medicine_id}, ${batch_number}, ${quantity}, ${expiry_date})
      RETURNING *
    `;
        // Update medicines stock_total
        await sql `
      UPDATE medicines SET stock_total = COALESCE(stock_total, 0) + ${quantity}
      WHERE id = ${medicine_id}
    `;
        // Create stock_log
        await sql `
      INSERT INTO stock_logs (medicine_id, batch_number, type, quantity, reason)
      VALUES (${medicine_id}, ${batch_number}, 'in', ${quantity}, 'Restock batch ' || ${batch_number})
    `;
        return c.json({ success: true, data: batch[0] }, 201);
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * PUT /api/batches/:id
 */
batches.put('/:id', requireRole('admin', 'apoteker'), async (c) => {
    try {
        const id = c.req.param('id');
        const { batch_number, quantity, expiry_date, medicine_id } = await c.req.json();
        // To properly update stock_total we'd need the old quantity.
        // For simplicity, we just update the batch. In a real app we'd compute the diff.
        const result = await sql `
      UPDATE medicine_batches SET batch_number = ${batch_number}, stock_qty = ${quantity}, expiry_date = ${expiry_date}
      WHERE id = ${id}
      RETURNING *
    `;
        if (result.length === 0) {
            return c.json({ success: false, message: 'Batch tidak ditemukan.' }, 404);
        }
        // Recalculate medicine stock_total
        await sql `
      UPDATE medicines 
      SET stock_total = (SELECT COALESCE(SUM(stock_qty), 0) FROM medicine_batches WHERE medicine_id = ${medicine_id})
      WHERE id = ${medicine_id}
    `;
        return c.json({ success: true, data: result[0] });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * DELETE /api/batches/:id
 */
batches.delete('/:id', requireRole('admin'), async (c) => {
    try {
        const id = c.req.param('id');
        // Get medicine_id before delete to recalculate stock
        const batch = await sql `SELECT medicine_id FROM medicine_batches WHERE id = ${id}`;
        await sql `DELETE FROM medicine_batches WHERE id = ${id}`;
        if (batch.length > 0) {
            await sql `
        UPDATE medicines 
        SET stock_total = (SELECT COALESCE(SUM(stock_qty), 0) FROM medicine_batches WHERE medicine_id = ${batch[0].medicine_id})
        WHERE id = ${batch[0].medicine_id}
      `;
        }
        return c.json({ success: true, message: 'Batch berhasil dihapus.' });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
export default batches;
