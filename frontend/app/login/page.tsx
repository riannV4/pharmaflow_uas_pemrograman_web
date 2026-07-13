'use client'

import React, { useState, FormEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { motion } from 'framer-motion'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, getDefaultRoute } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = await login(email, password)

    if (result.success) {
      router.push(getDefaultRoute())
    } else {
      setError(result.message || 'Login gagal. Periksa email dan password.')
    }

    setIsSubmitting(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  }

  return (
    <div className="login-page">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
      >
        <motion.div
          className="login-card__logo"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="login-card__logo-icon"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Image
              src="/pharmaflow_logo.svg"
              alt="PharmaFlow Logo"
              width={32}
              height={32}
              priority
            />
          </motion.div>
          <motion.h1 variants={itemVariants} style={{ margin: 0 }}>
            PharmaFlow
          </motion.h1>
        </motion.div>

        <motion.p
          className="login-card__subtitle"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          Masuk ke dashboard apotek Anda
        </motion.p>

        {error && (
          <motion.div
            className="login-card__error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle size={16} style={{ marginRight: '0.5rem' }} />
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <label htmlFor="email">Email</label>
            <motion.input
              id="email"
              type="email"
              className="login-card__input"
              placeholder="admin@pharmaflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password">Password</label>
            <motion.input
              id="password"
              type="password"
              className="login-card__input"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.div>

          <motion.button
            type="submit"
            className="login-card__btn"
            disabled={isSubmitting}
            variants={itemVariants}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <>
                <Loader2
                  size={18}
                  style={{
                    marginRight: '0.5rem',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                Memproses...
              </>
            ) : (
              'Masuk ke Dashboard'
            )}
          </motion.button>
        </motion.form>

        <motion.div
          className="login-card__footer"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          PharmaFlow v1.0 &copy; 2026 — Pharmacy Inventory & POS
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
