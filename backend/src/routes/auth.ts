import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { sql } from '../db/index.js'
import { authMiddleware, type JwtPayload } from '../middleware/auth.js'

const auth = new Hono()

/**
 * Helper: encode JWT_SECRET ke Uint8Array untuk jose
 */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || '***REMOVED***'
  return new TextEncoder().encode(secret)
}

/**
 * POST /api/auth/login
 * Login dengan email & password
 */
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ success: false, message: 'Email dan password harus diisi.' }, 400)
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email} AND is_active = true LIMIT 1`

    if (users.length === 0) {
      return c.json({ success: false, message: 'Email atau password salah.' }, 401)
    }

    const user = users[0]
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return c.json({ success: false, message: 'Email atau password salah.' }, 401)
    }

    // Generate JWT token (8 jam expiry)
    const payload: JwtPayload = {
      userId: String(user.id),
      email: user.email,
      role: user.role,
      name: user.name,
    }

    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('8h')
      .setIssuedAt()
      .sign(getJwtSecret())

    return c.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

/**
 * POST /api/auth/register
 * Register user baru (admin only)
 */
auth.post('/register', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user')
    if (currentUser.role !== 'admin') {
      return c.json({ success: false, message: 'Hanya admin yang dapat mendaftarkan user baru.' }, 403)
    }

    const { name, email, password, role } = await c.req.json()

    if (!name || !email || !password || !role) {
      return c.json({ success: false, message: 'Semua field harus diisi.' }, 400)
    }

    if (!['admin', 'apoteker', 'kasir'].includes(role)) {
      return c.json({ success: false, message: 'Role harus admin, apoteker, atau kasir.' }, 400)
    }

    // Check existing email
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return c.json({ success: false, message: 'Email sudah terdaftar.' }, 409)
    }

    // Hash password (salt factor 10)
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await sql`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role})
      RETURNING id, name, email, role, created_at
    `

    return c.json({ success: true, data: result[0] }, 201)
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

/**
 * GET /api/auth/me
 * Get current user info dari token
 */
auth.get('/me', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const result = await sql`
      SELECT id, name, email, role, is_active, created_at
      FROM users WHERE id = ${user.userId}
    `

    if (result.length === 0) {
      return c.json({ success: false, message: 'User tidak ditemukan.' }, 404)
    }

    return c.json({ success: true, data: result[0] })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

/**
 * GET /api/auth/users
 * List all users (admin only)
 */
auth.get('/users', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user')
    if (currentUser.role !== 'admin') {
      return c.json({ success: false, message: 'Akses ditolak.' }, 403)
    }

    const result = await sql`
      SELECT id, name, email, role, is_active, created_at
      FROM users ORDER BY created_at DESC
    `

    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

/**
 * PUT /api/auth/users/:id
 * Update user (admin only)
 */
auth.put('/users/:id', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user')
    if (currentUser.role !== 'admin') {
      return c.json({ success: false, message: 'Akses ditolak.' }, 403)
    }

    const id = c.req.param('id')
    const { name, email, role, is_active, password } = await c.req.json()

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      const result = await sql`
        UPDATE users SET name = ${name}, email = ${email}, role = ${role},
        is_active = ${is_active}, password_hash = ${hashedPassword}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, name, email, role, is_active
      `
      return c.json({ success: true, data: result[0] })
    } else {
      const result = await sql`
        UPDATE users SET name = ${name}, email = ${email}, role = ${role},
        is_active = ${is_active}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, name, email, role, is_active
      `
      return c.json({ success: true, data: result[0] })
    }
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

/**
 * DELETE /api/auth/users/:id
 * Delete user (admin only)
 */
auth.delete('/users/:id', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user')
    if (currentUser.role !== 'admin') {
      return c.json({ success: false, message: 'Akses ditolak.' }, 403)
    }

    const id = c.req.param('id')

    if (id === currentUser.userId) {
      return c.json({ success: false, message: 'Tidak bisa menghapus akun sendiri.' }, 400)
    }

    await sql`DELETE FROM users WHERE id = ${id}`

    return c.json({ success: true, message: 'User berhasil dihapus.' })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

export default auth
