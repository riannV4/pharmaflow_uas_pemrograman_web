'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, ChevronRight } from 'lucide-react'

export function CTASection() {
  return (
    <section
      style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(135deg, #064e3b, #0d9488)',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{ maxWidth: 700, margin: '0 auto' }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ marginBottom: '1.5rem' }}
        >
          <Clock size={48} color="#a7f3d0" style={{ margin: '0 auto' }} />
        </motion.div>

        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.025em',
            marginBottom: '1rem',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Siap Modernisasi Apotek Anda?
        </h2>

        <p
          style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '2rem',
            lineHeight: 1.7,
          }}
        >
          Bergabung dengan apotek modern yang telah beralih ke sistem digital.
          Mulai kelola inventaris dan transaksi dengan lebih efisien.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2.5rem',
              background: 'white',
              color: '#064e3b',
              borderRadius: 12,
              fontSize: '1.1rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Mulai Gratis
            <ChevronRight size={22} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
