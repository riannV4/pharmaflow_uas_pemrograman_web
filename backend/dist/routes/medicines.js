import { Hono } from 'hono';
import { sql } from '../db/index.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
const medicines = new Hono();
medicines.use('/*', authMiddleware);
/**
 * GET /api/medicines
 * List semua obat (dengan search & filter)
 */
medicines.get('/', async (c) => {
    try {
        const search = c.req.query('search') || '';
        const categoryId = c.req.query('category_id') || '';
        const lowStock = c.req.query('low_stock') || '';
        let result;
        if (search && categoryId) {
            result = await sql `
        SELECT m.*, c.name as category_name
        FROM medicines m
        LEFT JOIN categories c ON m.category_id = c.id
        WHERE (m.name ILIKE ${'%' + search + '%'} OR m.code ILIKE ${'%' + search + '%'})
          AND m.category_id = ${categoryId}
        ORDER BY m.name ASC
      `;
        }
        else if (search) {
            result = await sql `
        SELECT m.*, c.name as category_name
        FROM medicines m
        LEFT JOIN categories c ON m.category_id = c.id
        WHERE m.name ILIKE ${'%' + search + '%'} OR m.code ILIKE ${'%' + search + '%'}
        ORDER BY m.name ASC
      `;
        }
        else if (categoryId) {
            result = await sql `
        SELECT m.*, c.name as category_name
        FROM medicines m
        LEFT JOIN categories c ON m.category_id = c.id
        WHERE m.category_id = ${categoryId}
        ORDER BY m.name ASC
      `;
        }
        else {
            result = await sql `
        SELECT m.*, c.name as category_name
        FROM medicines m
        LEFT JOIN categories c ON m.category_id = c.id
        ORDER BY m.name ASC
      `;
        }
        // Filter low stock if requested
        if (lowStock === 'true') {
            result = result.filter((m) => m.stock_total < m.stock_min);
        }
        return c.json({ success: true, data: result });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * GET /api/medicines/:id
 * Detail obat + batches
 */
medicines.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const medicine = await sql `
      SELECT m.*, c.name as category_name
      FROM medicines m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.id = ${id}
    `;
        if (medicine.length === 0) {
            return c.json({ success: false, message: 'Obat tidak ditemukan.' }, 404);
        }
        const batches = await sql `
      SELECT * FROM medicine_batches 
      WHERE medicine_id = ${id} AND stock_qty > 0
      ORDER BY expiry_date ASC
    `;
        return c.json({
            success: true,
            data: { ...medicine[0], batches },
        });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * POST /api/medicines
 * Tambah obat baru (admin, apoteker)
 */
medicines.post('/', requireRole('admin', 'apoteker'), async (c) => {
    try {
        const { name, code, category_id, unit, price_buy, price_sell, stock_min, description } = await c.req.json();
        if (!name || !code || !unit || price_sell === undefined) {
            return c.json({ success: false, message: 'Nama, kode, unit, dan harga jual harus diisi.' }, 400);
        }
        // Check duplicate code
        const existing = await sql `SELECT id FROM medicines WHERE code = ${code}`;
        if (existing.length > 0) {
            return c.json({ success: false, message: 'Kode obat sudah terdaftar.' }, 409);
        }
        const result = await sql `
      INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description)
      VALUES (${name}, ${code}, ${category_id || null}, ${unit}, ${price_buy || 0}, ${price_sell}, ${stock_min || 10}, 0, ${description || null})
      RETURNING *
    `;
        return c.json({ success: true, data: result[0] }, 201);
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * PUT /api/medicines/:id
 * Update obat (admin, apoteker)
 */
medicines.put('/:id', requireRole('admin', 'apoteker'), async (c) => {
    try {
        const id = c.req.param('id');
        const { name, code, category_id, unit, price_buy, price_sell, stock_min, description } = await c.req.json();
        const result = await sql `
      UPDATE medicines SET
        name = ${name}, code = ${code}, category_id = ${category_id || null},
        unit = ${unit}, price_buy = ${price_buy || 0}, price_sell = ${price_sell}, stock_min = ${stock_min || 10},
        description = ${description || null}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
        if (result.length === 0) {
            return c.json({ success: false, message: 'Obat tidak ditemukan.' }, 404);
        }
        return c.json({ success: true, data: result[0] });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * DELETE /api/medicines/:id
 * Hapus obat (admin only)
 */
medicines.delete('/:id', requireRole('admin'), async (c) => {
    try {
        const id = c.req.param('id');
        await sql `DELETE FROM medicines WHERE id = ${id}`;
        return c.json({ success: true, message: 'Obat berhasil dihapus.' });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
export default medicines;
