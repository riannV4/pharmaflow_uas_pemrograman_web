import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import * as dotenv from 'dotenv';
// Import routes
import auth from './routes/auth.js';
import medicines from './routes/medicines.js';
import categories from './routes/categories.js';
import batches from './routes/batches.js';
import transactions from './routes/transactions.js';
import dashboard from './routes/dashboard.js';
import stockMutations from './routes/stock-mutations.js';
dotenv.config();
const app = new Hono();
// Mengizinkan frontend mengakses API
app.use('/*', cors({
    origin: 'http://localhost:3000',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));
// Health check
app.get('/', (c) => {
    return c.json({
        message: 'PharmaFlow API Server',
        version: '1.0.0',
        status: 'running'
    });
});
// Mount routes
app.route('/api/auth', auth);
app.route('/api/medicines', medicines);
app.route('/api/categories', categories);
app.route('/api/batches', batches);
app.route('/api/transactions', transactions);
app.route('/api/dashboard', dashboard);
app.route('/api/stock-mutations', stockMutations);
const port = Number(process.env.PORT) || 3001;
console.log(`🏥 PharmaFlow API Server running on http://localhost:${port}`);
serve({
    fetch: app.fetch,
    port
});
