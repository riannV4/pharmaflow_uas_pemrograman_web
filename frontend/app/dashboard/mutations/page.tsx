'use client'

import { useState, useEffect } from 'react'
import { api, formatDateTime } from '@/lib/api'
import { ArrowLeftRight } from 'lucide-react'
import { FadeIn, AnimatedRow } from '@/components/animations'

export default function MutationsPage() {
  const [mutations, setMutations] = useState<any[]>([])
  const [medicines, setMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterMedicine, setFilterMedicine] = useState('')
  const [filterType, setFilterType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    loadMedicines()
  }, [])

  useEffect(() => {
    loadMutations()
  }, [filterMedicine, filterType, startDate, endDate])

  const loadMutations = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterMedicine) params.set('medicine_id', filterMedicine)
    if (filterType) params.set('type', filterType)
    if (startDate) params.set('start_date', startDate)
    if (endDate) params.set('end_date', endDate)

    const res = await api(`/api/stock-mutations?${params}`)
    if (res.success) setMutations(res.data as any[])
    setLoading(false)
  }

  const loadMedicines = async () => {
    const res = await api('/api/medicines')
    if (res.success) setMedicines(res.data as any[])
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'in':
        return <span className="badge badge--emerald">Masuk (Restock)</span>
      case 'out':
        return <span className="badge badge--blue">Keluar (Penjualan)</span>
      default:
        return <span className="badge badge--gray">{type}</span>
    }
  }

  return (
    <FadeIn>
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Log Mutasi Stok</h1>
            <p className="page-header__desc">Pantau semua aktivitas masuk/keluarnya obat</p>
          </div>
        </div>

        <div className="toolbar">
          <select className="form-select" style={{ maxWidth: 220 }} value={filterMedicine}
            onChange={(e) => setFilterMedicine(e.target.value)}>
            <option value="">Semua Obat</option>
            {medicines.map((m: any) => (
              <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
            ))}
          </select>

          <select className="form-select" style={{ maxWidth: 180 }} value={filterType}
            onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Semua Jenis Mutasi</option>
            <option value="in">Masuk (Restock)</option>
            <option value="out">Keluar (Penjualan)</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="date" className="form-input" style={{ width: 140 }} value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span style={{ color: 'var(--text-tertiary)' }}>—</span>
            <input type="date" className="form-input" style={{ width: 140 }} value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Obat</th>
                <th>Kode</th>
                <th>Batch</th>
                <th>Jenis</th>
                <th>Qty</th>
                <th>Catatan / Alasan</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                if (loading) {
                  return Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j}><div className="skeleton" style={{ height: 16, width: j === 1 ? '90%' : '60%' }} /></td>
                      ))}
                    </tr>
                  ))
                }
                if (mutations.length === 0) {
                  return (
                    <tr>
                      <td colSpan={8}>
                        <div className="empty-state">
                          <ArrowLeftRight size={40} className="empty-state__icon" />
                          <p className="empty-state__title">Data Mutasi Kosong</p>
                          <p className="empty-state__desc">Belum ada riwayat mutasi stok untuk filter ini.</p>
                        </div>
                      </td>
                    </tr>
                  )
                }
                return mutations.map((m, idx) => (
                  <AnimatedRow key={m.id} index={idx}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(m.created_at)}</td>
                    <td style={{ fontWeight: 600 }}>{m.medicine_name}</td>
                    <td><code style={{ fontSize: '0.8rem', background: 'var(--surface-3)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>{m.medicine_code}</code></td>
                    <td>{m.batch_number || '—'}</td>
                    <td>{getTypeBadge(m.type)}</td>
                    <td style={{
                      fontWeight: 700,
                      color: m.type === 'in' ? 'var(--primary-600)' : 'var(--danger)'
                    }}>
                      {m.type === 'in' ? '+' : '-'}{m.quantity}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{m.note || m.reason || '—'}</td>
                    <td>{m.user_name || 'Sistem'}</td>
                  </AnimatedRow>
                ))
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </FadeIn>
  )
}