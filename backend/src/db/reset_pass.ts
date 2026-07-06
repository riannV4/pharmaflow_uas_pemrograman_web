import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config()
const sql = neon(process.env.DATABASE_URL!)

async function resetPassword() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    // Update admin user
    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword} 
      WHERE email = 'admin@pharmaflow.com'
    `
    console.log('Password for admin@pharmaflow.com reset to: admin123')
    
    // Also update roles if they use pharmacist/cashier instead of apoteker/kasir
    await sql`
      UPDATE users SET role = 'apoteker' WHERE role = 'pharmacist'
    `
    await sql`
      UPDATE users SET role = 'kasir' WHERE role = 'cashier'
    `
    console.log('Roles updated to apoteker/kasir')
    
  } catch (e) {
    console.error(e)
  }
}
resetPassword()
