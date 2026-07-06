import { Hono } from 'hono';
import { sql } from '../db/index.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
const categories = new Hono();
categories.use('/*', authMiddleware);
/**
 * GET /api/categories
 * List semua kategori
 */
categories.get('/', async (c) => {
    try {
        const result = await sql `
      SELECT c.*, COUNT(m.id)::int as medicine_count
      FROM categories c
      LEFT JOIN medicines m ON c.id = m.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
        return c.json({ success: true, data: result });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * POST /api/categories
 * Tambah kategori baru
 */
categories.post('/', requireRole('admin', 'apoteker'), async (c) => {
    try {
        const { name, description } = await c.req.json();
        if (!name) {
            return c.json({ success: false, message: 'Nama kategori harus diisi.' }, 400);
        }
        const existing = await sql `SELECT id FROM categories WHERE name = ${name}`;
        if (existing.length > 0) {
            return c.json({ success: false, message: 'Kategori sudah ada.' }, 409);
        }
        const result = await sql `
      INSERT INTO categories (name, description)
      VALUES (${name}, ${description || null})
      RETURNING *
    `;
        return c.json({ success: true, data: result[0] }, 201);
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * PUT /api/categories/:id
 * Update kategori
 */
categories.put('/:id', requireRole('admin', 'apoteker'), async (c) => {
    try {
        const id = c.req.param('id');
        const { name, description } = await c.req.json();
        const result = await sql `
      UPDATE categories SET name = ${name}, description = ${description || null}
      WHERE id = ${id}
      RETURNING *
    `;
        if (result.length === 0) {
            return c.json({ success: false, message: 'Kategori tidak ditemukan.' }, 404);
        }
        return c.json({ success: true, data: result[0] });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * DELETE /api/categories/:id
 * Hapus kategori
 */
categories.delete('/:id', requireRole('admin'), async (c) => {
    try {
        const id = c.req.param('id');
        await sql `DELETE FROM categories WHERE id = ${id}`;
        return c.json({ success: true, message: 'Kategori berhasil dihapus.' });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
export default categories;
