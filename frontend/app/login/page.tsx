'use client'

import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Cross } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = await login(email, password)

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.message || 'Login gagal. Periksa email dan password.')
    }

    setIsSubmitting(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">
          <div className="login-card__logo-icon">
            <Cross size={28} />
          </div>
          <h1>PharmaFlow</h1>
        </div>
        <p className="login-card__subtitle">
          Masuk ke dashboard apotek Anda
        </p>

        {error && (
          <div className="login-card__error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="login-card__input"
              placeholder="admin@pharmaflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="login-card__input"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="login-card__btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18 }} />
                Memproses...
              </>
            ) : (
              'Masuk ke Dashboard'
            )}
          </button>
        </form>

        <div className="login-card__footer">
          PharmaFlow v1.0 &copy; 2026 — Pharmacy Inventory & POS
        </div>
      </div>
    </div>
  )
}
