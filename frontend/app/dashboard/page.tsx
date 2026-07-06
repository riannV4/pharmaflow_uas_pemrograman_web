'use client'

import React, { useState, useEffect } from 'react'
import { api, formatCurrency } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function DashboardPage() {
  const { user } = useAuth()
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
      <div className="stat-grid">
        <div className="stat-card stat-card--emerald">
          <div className="stat-card__icon stat-card__icon--emerald">
            <DollarSign size={22} />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__label">Pendapatan Hari Ini</div>
            <div className="stat-card__value">{formatCurrency(summary?.revenue_today || 0)}</div>
          </div>
        </div>

        <div className="stat-card stat-card--blue">
          <div className="stat-card__icon stat-card__icon--blue">
            <ShoppingCart size={22} />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__label">Transaksi Hari Ini</div>
            <div className="stat-card__value">{summary?.transactions_today || 0}</div>
          </div>
        </div>

        <div className="stat-card stat-card--amber">
          <div className="stat-card__icon stat-card__icon--amber">
            <Package size={22} />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__label">Total Obat</div>
            <div className="stat-card__value">{summary?.total_medicines || 0}</div>
          </div>
        </div>

        <div className="stat-card stat-card--rose">
          <div className="stat-card__icon stat-card__icon--rose">
            <AlertTriangle size={22} />
          </div>
          <div className="stat-card__info">
            <div className="stat-card__label">Stok Menipis</div>
            <div className="stat-card__value">{summary?.low_stock_count || 0}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-grid">
        {/* Revenue Chart */}
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
                />
                <Bar dataKey="total" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Medicines */}
        <div className="card">
          <div className="card__header">
            <div>
              <h3 className="card__title">Obat Terlaris</h3>
              <p className="card__subtitle">30 hari terakhir</p>
            </div>
            <Package size={20} style={{ color: 'var(--primary)' }} />
          </div>
          {topMedicines.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__desc">Belum ada data penjualan</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {topMedicines.slice(0, 5).map((med: any, idx: number) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                  background: idx === 0 ? 'var(--primary-50)' : 'transparent'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: idx === 0 ? 'var(--primary)' : 'var(--surface-3)',
                      color: idx === 0 ? 'white' : 'var(--text-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700
                    }}>{idx + 1}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{med.name}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                    {med.total_sold} {med.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
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
            alerts.low_stock.slice(0, 5).map((item: any) => (
              <div key={item.id} className="alert-card alert-card--warning">
                <AlertTriangle size={18} />
                <div className="alert-card__text">
                  <strong>{item.name}</strong> — Stok: {item.total_stock} / Min: {item.min_stock}
                </div>
                <span className="badge badge--amber badge--lg">{item.code}</span>
              </div>
            ))
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
            alerts.expiring.slice(0, 5).map((item: any) => (
              <div
                key={item.id}
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}
