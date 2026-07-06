import type { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || '***REMOVED***'

export interface JwtPayload {
  userId: string
  email: string
  role: string
  name: string
}

// Extend Hono context to carry user data
declare module 'hono' {
  interface ContextVariableMap {
    user: JwtPayload
  }
}

/**
 * JWT Authentication Middleware
 * Verifies Bearer token from Authorization header
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, message: 'Token tidak ditemukan. Silakan login.' }, 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    c.set('user', decoded)
    await next()
  } catch (error) {
    return c.json({ success: false, message: 'Token tidak valid atau sudah kedaluwarsa.' }, 401)
  }
}

/**
 * Role-based access guard
 * Usage: requireRole('admin', 'apoteker')
 */
export const requireRole = (...roles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user')

    if (!user) {
      return c.json({ success: false, message: 'Autentikasi diperlukan.' }, 401)
    }

    if (!roles.includes(user.role)) {
      return c.json({ 
        success: false, 
        message: `Akses ditolak. Hanya role ${roles.join(', ')} yang diizinkan.` 
      }, 403)
    }

    await next()
  }
}

export { JWT_SECRET }
