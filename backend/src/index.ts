import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config()

const app = new Hono()

// Mengizinkan frontend mengakses API
app.use('/*', cors({
  origin: 'http://localhost:3000',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

// Inisialisasi Neon DB Client
const sql = neon(process.env.DATABASE_URL!)

app.get('/', (c) => {
  return c.json({ message: 'Hello from Hono Backend!' })
})

// Contoh endpoint mengambil data dari Neon DB
app.get('/users', async (c) => {
  try {
    // Ganti 'users' dengan nama tabel di Neon
    const result = await sql`SELECT * FROM users LIMIT 10` 
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

const port = Number(process.env.PORT) || 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})