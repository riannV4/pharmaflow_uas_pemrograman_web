import { Hono } from 'hono'
import { cors } from 'hono/cors'

// Import routes
import auth from './routes/auth.js'
import medicines from './routes/medicines.js'
import categories from './routes/categories.js'
import batches from './routes/batches.js'
import transactions from './routes/transactions.js'
import dashboard from './routes/dashboard.js'
import stockMutations from './routes/stock-mutations.js'

const app = new Hono()

// CORS — mengizinkan frontend mengakses API
// CORS_ORIGIN di-set via wrangler.toml vars atau .dev.vars
app.use('/*', cors({
  origin: (c) => {
    return process.env.CORS_ORIGIN || 'http://localhost:3000'
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check
app.get('/', (c) => {
  return c.json({
    message: 'PharmaFlow API Server',
    version: '1.0.0',
    status: 'running',
  })
})

// Mount routes
app.route('/api/auth', auth)
app.route('/api/medicines', medicines)
app.route('/api/categories', categories)
app.route('/api/batches', batches)
app.route('/api/transactions', transactions)
app.route('/api/dashboard', dashboard)
app.route('/api/stock-mutations', stockMutations)

// ─────────────────────────────────────────────
// Cloudflare Workers entry point
// Ekspor default app — Wrangler akan menangani sisanya
// Tidak perlu `serve()` seperti di Node.js
// ─────────────────────────────────────────────
export default app
