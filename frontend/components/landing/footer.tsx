'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function Footer() {
  return (
    <footer
      style={{
        padding: '2.5rem 2rem',
        background: '#020617',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <Image
              src="/pharmaflow_logo.svg"
              alt="PharmaFlow Logo"
              width={28}
              height={28}
              style={{
                borderRadius: 6,
              }}
              priority
            />
          </motion.div>
          <span
            style={{
              color: 'white',
              fontWeight: 700,
              fontSize: '0.95rem',
              fontFamily: 'var(--font-sans)',
            }}
          >
            PharmaFlow
          </span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} PharmaFlow. All rights reserved.
        </p>
        <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.5rem' }}>
          Built with Next.js, Hono & Neon DB
        </p>
      </motion.div>
    </footer>
  )
}
