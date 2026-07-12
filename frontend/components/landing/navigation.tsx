'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      animate={{
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/pharmaflow_logo.svg"
              alt="PharmaFlow Logo"
              width={36}
              height={36}
              style={{
                borderRadius: 8,
              }}
              priority
            />
          </motion.div>
          <div>
            <h1
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.025em',
                margin: 0,
                fontFamily: 'var(--font-sans)',
              }}
            >
              PharmaFlow
            </h1>
          </div>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
          <motion.a
            href="#features"
            whileHover={{ color: '#059669' }}
            className="nav-link-desktop"
            style={{
              color: '#475569',
              textDecoration: 'none',
              fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              transition: 'color 0.2s ease',
            }}
          >
            Fitur
          </motion.a>
          <motion.a
            href="#roles"
            whileHover={{ color: '#059669' }}
            className="nav-link-desktop"
            style={{
              color: '#475569',
              textDecoration: 'none',
              fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              transition: 'color 0.2s ease',
            }}
          >
            Akses
          </motion.a>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/login"
              style={{
                padding: 'clamp(0.4rem, 1vw, 0.5rem) clamp(0.75rem, 2vw, 1.25rem)',
                background: 'linear-gradient(135deg, #059669, #0d9488)',
                color: 'white',
                borderRadius: 8,
                fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
              }}
            >
              Masuk
            </Link>
          </motion.div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .nav-link-desktop {
            display: none;
          }
        }
      `}</style>
    </motion.nav>
  )
}
