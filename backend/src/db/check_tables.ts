import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config()
const sql = neon(process.env.DATABASE_URL!)

async function check() {
  const tables = [
    'users', 'categories', 'medicines', 'medicine_batches', 'sales', 'sale_items', 'stock_logs'
  ]
  
  for (const t of tables) {
    const cols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = ${t}
    `
    console.log(`\nTable ${t}:`)
    cols.forEach((c: any) => console.log(`  - ${c.column_name} (${c.data_type})`))
  }
}
check()
