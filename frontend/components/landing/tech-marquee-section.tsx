'use client'

import { motion } from 'framer-motion'
import { InfiniteMarquee } from '@/components/infinite-marquee'
import {
  Code2,
  Zap,
  Database,
  Lock,
  Shield,
  Cloud,
  Palette,
  FileCode,
} from 'lucide-react'

interface TechItem {
  label: string
  icon: React.ComponentType<{ size: number; color: string }>
  color: string
}

const MARQUEE_ITEMS: TechItem[] = [
  { label: 'Next.js', icon: Code2, color: '#000000' },
  { label: 'Hono', icon: Zap, color: '#FF7900' },
  { label: 'Neon DB', icon: Database, color: '#00E5FF' },
  { label: 'JWT', icon: Lock, color: '#059669' },
  { label: 'Bcrypt', icon: Shield, color: '#0d9488' },
  { label: 'Vercel', icon: Cloud, color: '#000000' },
  { label: 'Tailwind', icon: Palette, color: '#06B6D4' },
  { label: 'TypeScript', icon: FileCode, color: '#3178C6' },
]

export function TechMarqueeSection() {
  const marqueeItems = MARQUEE_ITEMS.map((tech, i) => {
    const IconComponent = tech.icon
    return (
      <motion.div
        key={i}
        whileHover={{ scale: 1.05, y: -4 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
          padding: 'clamp(0.6rem, 1.5vw, 0.75rem) clamp(1rem, 2.5vw, 1.5rem)',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          whiteSpace: 'nowrap',
        }}
      >
        <IconComponent size={20} color={tech.color} />
        <span
          style={{
            fontWeight: 600,
            color: '#0f172a',
            fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {tech.label}
        </span>
      </motion.div>
    )
  })

  return (
    <section style={{ padding: 'clamp(1.5rem, 3vw, 2rem) clamp(0.5rem, 2vw, 1rem)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vw, 2rem)', padding: '0 1rem' }}>
        <h3
          style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            fontWeight: 600,
            color: '#64748b',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Teknologi yang Kami Gunakan
        </h3>
      </div>
      <InfiniteMarquee items={marqueeItems} speed={80} pauseOnHover={true} />
    </section>
  )
}
