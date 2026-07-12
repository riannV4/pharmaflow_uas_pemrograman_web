'use client'

import { motion } from 'framer-motion'
import { Shield, Pill, Receipt, CheckCircle2 } from 'lucide-react'

const ROLES = [
  {
    name: 'Admin',
    desc: 'Kontrol penuh atas seluruh sistem, mengelola akun karyawan, laporan keuangan, dan audit stok.',
    access: ['Manajemen User', 'Laporan Keuangan', 'Audit Stok', 'Dashboard Analitik'],
    icon: Shield,
  },
  {
    name: 'Apoteker',
    desc: 'Fokus pada pengelolaan master data obat, verifikasi stok masuk, dan pengaturan batch produk.',
    access: ['Master Data Obat', 'Kategori Produk', 'Batch Tracking', 'Log Mutasi Stok'],
    icon: Pill,
  },
  {
    name: 'Kasir',
    desc: 'Antarmuka transaksi kasir kilat, melayani checkout pasien, dan mencetak struk belanja.',
    access: ['POS Interface', 'Cetak Invoice', 'Pembayaran', 'Riwayat Transaksi'],
    icon: Receipt,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export function RolesSection() {
  return (
    <section
      id="roles"
      style={{
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)',
        background: '#f0fdf4',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Akses Berbasis Peran (RBAC)
          </h2>
          <p style={{ 
            fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', 
            color: '#64748b', 
            maxWidth: 600, 
            margin: '0 auto',
            padding: '0 1rem',
          }}>
            Tiga peran utama dengan hak akses yang terkontrol untuk keamanan data
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(1rem, 2vw, 1.5rem)',
          }}
        >
          {ROLES.map((role, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              style={{
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                borderRadius: 16,
                background: 'white',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #059669, #0d9488)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                }}
              >
                <role.icon size={28} color="white" />
              </motion.div>
              <h3
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {role.name}
              </h3>
              <p style={{ 
                fontSize: 'clamp(0.85rem, 1.8vw, 0.9rem)', 
                color: '#64748b', 
                marginBottom: '1.25rem', 
                lineHeight: 1.6 
              }}>
                {role.desc}
              </p>
              <motion.div
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {role.access.map((item, j) => (
                  <motion.span
                    key={j}
                    variants={itemVariants}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.75rem',
                      background: '#ecfdf5',
                      color: '#059669',
                      borderRadius: 999,
                      fontSize: 'clamp(0.7rem, 1.5vw, 0.78rem)',
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle2 size={12} />
                    {item}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
