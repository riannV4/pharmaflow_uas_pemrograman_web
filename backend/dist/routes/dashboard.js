import { Hono } from 'hono';
import { sql } from '../db/index.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
const dashboard = new Hono();
dashboard.use('/*', authMiddleware);
/**
 * GET /api/dashboard/summary
 */
dashboard.get('/summary', requireRole('admin'), async (c) => {
    try {
        const revenueToday = await sql `
      SELECT COALESCE(SUM(net_amount), 0)::numeric as total
      FROM sales WHERE created_at::date = CURRENT_DATE
    `;
        const revenueMonth = await sql `
      SELECT COALESCE(SUM(net_amount), 0)::numeric as total
      FROM sales 
      WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)
    `;
        const txToday = await sql `
      SELECT COUNT(*)::int as count FROM sales 
      WHERE created_at::date = CURRENT_DATE
    `;
        const totalMedicines = await sql `
      SELECT COUNT(*)::int as count FROM medicines
    `;
        const lowStock = await sql `
      SELECT COUNT(*)::int as count 
      FROM medicines
      WHERE stock_total < stock_min
    `;
        const expiring = await sql `
      SELECT COUNT(*)::int as count FROM medicine_batches 
      WHERE stock_qty > 0 AND expiry_date <= CURRENT_DATE + INTERVAL '90 days'
    `;
        return c.json({
            success: true,
            data: {
                revenue_today: Number(revenueToday[0].total),
                revenue_month: Number(revenueMonth[0].total),
                transactions_today: txToday[0].count,
                total_medicines: totalMedicines[0].count,
                low_stock_count: lowStock[0].count,
                expiring_count: expiring[0].count,
            },
        });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * GET /api/dashboard/revenue
 */
dashboard.get('/revenue', requireRole('admin'), async (c) => {
    try {
        const period = c.req.query('period') || 'daily';
        let result;
        if (period === 'monthly') {
            result = await sql `
        SELECT 
          TO_CHAR(date_trunc('month', created_at), 'YYYY-MM') as label,
          COALESCE(SUM(net_amount), 0)::numeric as total,
          COUNT(*)::int as count
        FROM sales
        WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY date_trunc('month', created_at)
        ORDER BY date_trunc('month', created_at)
      `;
        }
        else {
            result = await sql `
        SELECT 
          TO_CHAR(created_at::date, 'YYYY-MM-DD') as label,
          COALESCE(SUM(net_amount), 0)::numeric as total,
          COUNT(*)::int as count
        FROM sales
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY created_at::date
        ORDER BY created_at::date
      `;
        }
        return c.json({ success: true, data: result });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * GET /api/dashboard/top-medicines
 */
dashboard.get('/top-medicines', requireRole('admin'), async (c) => {
    try {
        const result = await sql `
      SELECT m.name, m.code, m.unit,
        SUM(si.quantity)::int as total_sold,
        SUM(si.subtotal)::numeric as total_revenue
      FROM sale_items si
      JOIN medicines m ON si.medicine_id = m.id
      JOIN sales s ON si.sale_id = s.id
      WHERE s.created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY m.id, m.name, m.code, m.unit
      ORDER BY total_sold DESC
      LIMIT 10
    `;
        return c.json({ success: true, data: result });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
/**
 * GET /api/dashboard/alerts
 */
dashboard.get('/alerts', requireRole('admin'), async (c) => {
    try {
        const lowStock = await sql `
      SELECT id, name, code, unit, stock_min as min_stock, stock_total as total_stock
      FROM medicines
      WHERE stock_total < stock_min
      ORDER BY stock_total ASC
    `;
        const expiring = await sql `
      SELECT b.id, b.batch_number, b.stock_qty as quantity, b.expiry_date,
        m.name as medicine_name, m.code as medicine_code
      FROM medicine_batches b
      JOIN medicines m ON b.medicine_id = m.id
      WHERE b.stock_qty > 0 
        AND b.expiry_date <= CURRENT_DATE + INTERVAL '90 days'
      ORDER BY b.expiry_date ASC
    `;
        const now = new Date();
        const enrichedExpiring = expiring.map((batch) => {
            const expiryDate = new Date(batch.expiry_date);
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            let expiry_status = 'warning';
            if (daysUntilExpiry <= 0)
                expiry_status = 'expired';
            else if (daysUntilExpiry <= 30)
                expiry_status = 'critical';
            return { ...batch, days_until_expiry: daysUntilExpiry, expiry_status };
        });
        return c.json({
            success: true,
            data: { low_stock: lowStock, expiring: enrichedExpiring },
        });
    }
    catch (error) {
        return c.json({ success: false, message: error.message }, 500);
    }
});
export default dashboard;
