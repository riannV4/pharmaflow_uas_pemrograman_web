'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Sidebar from '@/components/sidebar'
import Header from '@/components/header'
import { motion } from 'framer-motion'
import PageTransitionWrapper from '@/components/page-transition-wrapper'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, getDefaultRoute } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    } else if (!isLoading && user && pathname === '/dashboard') {
      const defaultRoute = getDefaultRoute()
      if (defaultRoute !== '/dashboard') {
        router.replace(defaultRoute)
      }
    }
  }, [user, isLoading, router, pathname, getDefaultRoute])

  if (isLoading) {
    return (
      <motion.div
        className="login-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: 'center' }}>
          <motion.div
            className="spinner"
            style={{ margin: '0 auto', borderTopColor: '#34d399', borderColor: 'rgba(255,255,255,0.2)' }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          />
          <motion.p
            style={{ color: 'rgba(255,255,255,0.7)', marginTop: '1rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Memuat dashboard...
          </motion.p>
        </div>
      </motion.div>
    )
  }

  if (!user) return null

  return (
    <motion.div
      className="dashboard-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <motion.div
        className={`dashboard-content ${sidebarCollapsed ? 'dashboard-content--collapsed' : ''}`}
        layout
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Header />
        <main className="dashboard-main">
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </main>
      </motion.div>
    </motion.div>
  )
}
