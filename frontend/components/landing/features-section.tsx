'use client'

import { motion } from 'framer-motion'
import {
  ShoppingCart,
  Boxes,
  Package,
  BarChart3,
  AlertTriangle,
  Shield,
} from 'lucide-react'

const FEATURES = [
  {
    icon: ShoppingCart,
    title: 'POS Cepat & Akurat',
    desc: 'Antarmuka kasir kilat dengan pencarian obat real-time, kalkulasi otomatis, dan cetak invoice instan.',
    color: '#059669',
  },
  {
    icon: Boxes,
    title: 'Multi-Batch Tracking',
    desc: 'Pelacakan obat berdasarkan nomor batch dan tanggal kedaluwarsa menggunakan sistem FEFO (First Expired First Out).',
    color: '#0d9488',
  },
  {
    icon: Package,
    title: 'Manajemen Inventaris',
    desc: 'CRUD data obat lengkap dengan manajemen unit, kategori, dan alert stok minimum otomatis.',
    color: '#3b82f6',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analitik',
    desc: 'Grafik pendapatan harian/bulanan, obat terlaris, dan daftar alarm obat kritis yang mudah dipahami.',
    color: '#8b5cf6',
  },
  {
    icon: AlertTriangle,
    title: 'Expired Date Alert',
    desc: 'Indikator otomatis: kuning untuk peringatan (<90 hari), merah untuk kritis (<30 hari). Zero kasus obat kedaluwarsa terjual.',
    color: '#f59e0b',
  },
  {
    icon: Shield,
    title: 'Keamanan Terjamin',
    desc: 'Autentikasi JWT dengan password hashing Bcrypt, RBAC 3-level akses, dan audit log lengkap.',
    color: '#ef4444',
  },
]

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
    transition: { duration: 0.6 },
  },
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: '5rem 2rem',
        background: 'white',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Fitur Unggulan
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
            Solusi lengkap untuk mengelola apotek Anda dengan efisien dan akurat
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              style={{
                padding: '1.75rem',
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${feature.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <feature.icon size={24} color={feature.color} />
              </motion.div>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
