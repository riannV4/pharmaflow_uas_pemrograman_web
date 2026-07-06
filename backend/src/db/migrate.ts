import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

const sql = neon(process.env.DATABASE_URL)

async function migrate() {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const schemaPath = path.join(__dirname, 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    
    console.log('Memulai migrasi database ke Neon DB...')
    
    // Split by semicolon and filter empty queries
    const queries = schema
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0)

    for (let i = 0; i < queries.length; i++) {
      const q = queries[i]
      try {
        await sql.query(q)
        console.log(`Berhasil mengeksekusi query ${i + 1}/${queries.length}`)
      } catch (err: any) {
        console.error(`Gagal mengeksekusi query ${i + 1}: ${err.message}`)
        console.error(`Query: ${q.substring(0, 50)}...`)
      }
    }
    
    console.log('✅ Migrasi database selesai!')
  } catch (error) {
    console.error('❌ Gagal membaca file schema.sql:', error)
  }
}

migrate()
