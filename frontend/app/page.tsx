'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect based on role
        if (user.role === 'kasir') {
          router.push('/dashboard/pos')
        } else {
          router.push('/dashboard')
        }
      } else {
        router.push('/login')
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="login-page">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto' }} />
        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '1rem', fontSize: '0.9rem' }}>
          Memuat PharmaFlow...
        </p>
      </div>
    </div>
  )
}
