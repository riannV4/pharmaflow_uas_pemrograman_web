import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config()
const sql = neon(process.env.DATABASE_URL!)

async function check() {
  try {
    const users = await sql`SELECT id, email, name, role, is_active FROM users`
    console.log('Users in database:', users)
  } catch (e) {
    console.error(e)
  }
}
check()
