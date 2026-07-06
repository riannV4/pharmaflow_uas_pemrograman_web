import { Hono } from 'hono';
import { sql } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';
const stockMutations = new Hono();
stockMutations.use('/*', authMiddleware);
/**
 * GET /api/stock-mutations
 */
stockMutations.get('/', async (c) => {
    try {
        const medicineId = c.req.query('medicine_id') || '';
        const type = c.req.query('type') || '';
        const startDate = c.req.query('start_date') || '';
        const endDate = c.req.query('end_date') || '';
        let query = `
      SELECT sl.*, sl.reason as note, m.name as medicine_name, m.code as medicine_code
      FROM stock_logs sl
      JOIN medicines m ON sl.medicine_id = m.id
      WHERE 1=1
    `;
        const params = [];
        if (medicineId) {
            params.push(medicineId);
            query += ` AND sl.medicine_id = $${params.length}`;
        }
        if (type) {
            params.push(type);
            query += ` AND sl.type = $${params.length}`;
        }
        if (startDate && endDate) {
            params.push(startDate, endDate);
            query += ` AND sl.created_at::date >= $${params.length - 1} AND sl.created_at::date <= $${params.length}`;
        }
        query += ` ORDER BY sl.created_at DESC LIMIT 200`;
        // Wait, using raw query builder with Neon is tedious, let's use the tagged template
        let result;
        if (medicineId && type) {
            result = await sql `
        SELECT sl.*, sl.reason as note, m.name as medicine_name, m.code as medicine_code
        FROM stock_logs sl
        JOIN medicines m ON sl.medicine_id = m.id
        WHERE sl.medicine_id = ${medicineId} AND sl.type = ${type}
        ORDER BY sl.created_at DESC LIMIT 200
      `;
        }
        else if (medicineId) {
            result = await sql `
        SELECT sl.*, sl.reason as note, m.name as medicine_name, m.code as medicine_code
        FROM stock_logs sl
        JOIN medicines m ON sl.medicine_id = m.id
        WHERE sl.medicine_id = ${medicineId}
        ORDER BY sl.created_at DESC LIMIT 200
      `;
        }
        else if (type) {
            result = await sql `
        SELECT sl.*, sl.reason as note, m.name as medicine_name, m.code as medicine_code
        FROM stock_logs sl
        JOIN medicines m ON sl.medicine_id = m.id
        WHERE sl.type = ${type}
        ORDER BY sl.created_at DESC LIMIT 200
      `;
        }
        else {
            result = await sql `
        SELECT sl.*, sl.reason as note, m.name as medicine_name, m.code as medicine_code
        FROM stock_logs sl
        JOIN medicines m ON sl.medicine_id = m.id
        ORDER BY sl.created_at DESC LIMIT 200
      `;
        }
        // Map `user_name` to "Sistem" if not available (no user_id in stock_logs)
        const mapped = result.map((r) => ({
            ...r,
            user_name: 'Sistem'
        }));
        return c.json({ success: true, data: mapped });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
export default stockMutations;
