import type { Context, Next } from 'hono'
import { jwtVerify } from 'jose'

export interface JwtPayload {
  userId: string
  email: string
  role: string
  name: string
}

/**
 * Helper: ambil JWT_SECRET dari env, encode ke Uint8Array (format yang dibutuhkan jose)
 */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || '***REMOVED***'
  return new TextEncoder().encode(secret)
}

// Extend Hono context untuk menyimpan data user
declare module 'hono' {
  interface ContextVariableMap {
    user: JwtPayload
  }
}

/**
 * JWT Authentication Middleware
 * Memverifikasi Bearer token dari Authorization header menggunakan jose (edge-compatible)
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, message: 'Token tidak ditemukan. Silakan login.' }, 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    c.set('user', payload as unknown as JwtPayload)
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
        message: `Akses ditolak. Hanya role ${roles.join(', ')} yang diizinkan.`,
      }, 403)
    }

    await next()
  }
}
