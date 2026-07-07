'use client'

import { useState, useEffect } from 'react'
import { api, formatCurrency } from '@/lib/api'
import { motion } from 'framer-motion'
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  PieChart,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts'
import { StaggerContainer, StaggerItem, SlideUp, AnimatedCounter } from '@/components/animations'

const PIE_COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null)
  const [revenue, setRevenue] = useState<any[]>([])
  const [topMedicines, setTopMedicines] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any>({ low_stock: [], expiring: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    const [sumRes, revRes, topRes, alertRes] = await Promise.all([
      api('/api/dashboard/summary'),
      api('/api/dashboard/revenue'),
      api('/api/dashboard/top-medicines'),
      api('/api/dashboard/alerts'),
    ])

    if (sumRes.success) setSummary(sumRes.data)
    if (revRes.success) setRevenue(revRes.data as any[])
    if (topRes.success) setTopMedicines(topRes.data as any[])
    if (alertRes.success) setAlerts(alertRes.data)
    setLoading(false)
  }

  // Build pie data from top medicines
  const pieData = topMedicines.slice(0, 6).map((m: any, i: number) => ({
    name: m.name,
    value: Number(m.total_sold),
    color: PIE_COLORS[i % PIE_COLORS.length],
  }))

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Dashboard</h1>
            <p className="page-header__desc">Ringkasan performa apotek</p>
          </div>
        </div>
        <div className="stat-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ width: 44, height: 44 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: '40%', height: 24 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Dashboard</h1>
            <p className="page-header__desc">Ringkasan performa apotek hari ini</p>
          </div>
        </div>

      {/* Stat Cards */}
      <StaggerContainer className="stat-grid">
        <StaggerItem>
          <div className="stat-card stat-card--emerald">
            <div className="stat-card__icon stat-card__icon--emerald">
              <DollarSign size={22} />
            </div>
            <div className="stat-card__info">
              <div className="stat-card__label">Pendapatan Hari Ini</div>
              <div className="stat-card__value">
                <AnimatedCounter value={summary?.revenue_today || 0} />
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="stat-card stat-card--blue">
            <div className="stat-card__icon stat-card__icon--blue">
              <ShoppingCart size={22} />
            </div>
            <div className="stat-card__info">
              <div className="stat-card__label">Transaksi Hari Ini</div>
              <div className="stat-card__value">
                <AnimatedCounter value={summary?.transactions_today || 0} suffix="" />
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="stat-card stat-card--amber">
            <div className="stat-card__icon stat-card__icon--amber">
              <Package size={22} />
            </div>
            <div className="stat-card__info">
              <div className="stat-card__label">Total Obat</div>
              <div className="stat-card__value">
                <AnimatedCounter value={summary?.total_medicines || 0} suffix="" />
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="stat-card stat-card--rose">
            <div className="stat-card__icon stat-card__icon--rose">
              <AlertTriangle size={22} />
            </div>
            <div className="stat-card__info">
              <div className="stat-card__label">Stok Menipis</div>
              <div className="stat-card__value">
                <AnimatedCounter value={summary?.low_stock_count || 0} suffix="" />
              </div>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Charts */}
      <SlideUp delay={0.2}>
        <div className="chart-grid">
          {/* Revenue Bar Chart */}
          <div className="card">
            <div className="card__header">
              <div>
                <h3 className="card__title">Pendapatan 7 Hari Terakhir</h3>
                <p className="card__subtitle">Revenue harian</p>
              </div>
              <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(Number(value))}
                    labelStyle={{ fontWeight: 600 }}
                    cursor={{ fill: 'rgba(5, 150, 105, 0.08)' }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#059669"
                    radius={[6, 6, 0, 0]}
                    animationBegin={300}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Medicines + Pie Chart */}
          <div className="card">
            <div className="card__header">
              <div>
                <h3 className="card__title">Obat Terlaris</h3>
                <p className="card__subtitle">30 hari terakhir</p>
              </div>
              <PieChart size={20} style={{ color: 'var(--primary)' }} />
            </div>
            {topMedicines.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state__desc">Belum ada data penjualan</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Donut Chart */}
                <div style={{ width: 140, height: 140, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={32}
                        outerRadius={58}
                        dataKey="value"
                        animationBegin={400}
                        animationDuration={1000}
                        animationEasing="ease-out"
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                {/* Ranked List */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {topMedicines.slice(0, 5).map((med: any, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.08, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)',
                        background: idx === 0 ? 'var(--primary-50)' : 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: idx === 0 ? 'var(--primary)' : 'var(--surface-3)',
                          color: idx === 0 ? 'white' : 'var(--text-secondary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.65rem', fontWeight: 700
                        }}>{idx + 1}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{med.name}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                        {med.total_sold} {med.unit}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SlideUp>

      {/* Alerts Section */}
      <SlideUp delay={0.3}>
        <div className="chart-grid">
          {/* Low Stock Alerts */}
          <div className="card">
            <div className="card__header">
              <div>
                <h3 className="card__title">⚠️ Stok Menipis</h3>
                <p className="card__subtitle">Obat di bawah batas minimum stok</p>
              </div>
            </div>
            {alerts.low_stock.length === 0 ? (
              <div className="empty-state" style={{ padding: '1.5rem' }}>
                <p className="empty-state__desc">Semua stok aman ✅</p>
              </div>
            ) : (
              <StaggerContainer>
                {alerts.low_stock.slice(0, 5).map((item: any) => (
                  <StaggerItem key={item.id}>
                    <div className="alert-card alert-card--warning">
                      <AlertTriangle size={18} />
                      <div className="alert-card__text">
                        <strong>{item.name}</strong> — Stok: {item.total_stock} / Min: {item.min_stock}
                      </div>
                      <span className="badge badge--amber badge--lg">{item.code}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>

          {/* Expiring Alerts */}
          <div className="card">
            <div className="card__header">
              <div>
                <h3 className="card__title">🕐 Mendekati Expired</h3>
                <p className="card__subtitle">Batch obat kedaluwarsa ≤ 90 hari</p>
              </div>
            </div>
            {alerts.expiring.length === 0 ? (
              <div className="empty-state" style={{ padding: '1.5rem' }}>
                <p className="empty-state__desc">Tidak ada obat mendekati expired ✅</p>
              </div>
            ) : (
              <StaggerContainer>
                {alerts.expiring.slice(0, 5).map((item: any) => (
                  <StaggerItem key={item.id}>
                    <div
                      className={`alert-card ${item.expiry_status === 'critical' || item.expiry_status === 'expired' ? 'alert-card--critical' : 'alert-card--warning'}`}
                    >
                      <Clock size={18} />
                      <div className="alert-card__text">
                        <strong>{item.medicine_name}</strong> — Batch: {item.batch_number}
                        <br />
                        <span style={{ fontSize: '0.78rem' }}>
                          {item.days_until_expiry <= 0
                            ? '⛔ SUDAH EXPIRED'
                            : `${item.days_until_expiry} hari lagi`}
                        </span>
                      </div>
                      <span className={`badge ${item.expiry_status === 'critical' || item.expiry_status === 'expired' ? 'badge--rose' : 'badge--amber'} badge--lg`}>
                        {item.expiry_status === 'expired' ? 'Expired' : item.expiry_status === 'critical' ? 'Kritis' : 'Warning'}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </div>
      </SlideUp>
    </div>
  )
}