'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Activity, ChevronRight } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' as const },
  },
}

export function HeroSection() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem 4rem',
        background: 'linear-gradient(180deg, #064e3b 0%, #0d9488 50%, #059669 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Circles */}
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'rgba(52, 211, 153, 0.15)',
          top: -200,
          right: -200,
        }}
      />
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(13, 148, 136, 0.1)',
          bottom: -100,
          left: -100,
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: 900,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '2rem',
            color: '#d1fae5',
            fontSize: '0.85rem',
            fontWeight: 500,
          }}
        >
          <Activity size={16} />
          Pharmacy Management SaaS Platform
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Manajemen Apotek
          <br />
          <span style={{ color: '#a7f3d0' }}>Lebih Cepat & Akurat</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: 650,
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}
        >
          Platform SaaS manajemen inventaris dan Point of Sale yang dirancang khusus untuk
          apotek modern. Kelola stok obat, batch tracking, dan transaksi kasir dalam satu
          sistem terintegrasi.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          style={{ 
            display: 'flex', 
            gap: 'clamp(0.75rem, 2vw, 1rem)', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            padding: '0 1rem',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/login"
              style={{
                padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.25rem, 3vw, 2rem)',
                background: 'white',
                color: '#064e3b',
                borderRadius: 12,
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              Mulai Sekarang
              <ChevronRight size={20} />
            </Link>
          </motion.div>
          <motion.a
            href="#features"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.25rem, 3vw, 2rem)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              borderRadius: 12,
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Pelajari Fitur
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 'clamp(1rem, 3vw, 2rem)',
            marginTop: 'clamp(2rem, 4vw, 4rem)',
            padding: 'clamp(1rem, 3vw, 2rem)',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {[
            { value: '<100ms', label: 'Pencarian Obat' },
            { value: '<1.5s', label: 'Waktu Transaksi' },
            { value: '100%', label: 'Akurasi Stok' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#a7f3d0' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)', color: 'rgba(255,255,255,0.7)' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
