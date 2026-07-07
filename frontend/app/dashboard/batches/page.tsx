'use client'

import { useState, useEffect } from 'react'
import { api, formatDate } from '@/lib/api'
import { Plus, Layers } from 'lucide-react'
import { AnimatedRow, AnimatedModal } from '@/components/animations'

export default function BatchesPage() {
  const [batches, setBatches] = useState<any[]>([])
  const [medicines, setMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterMedicine, setFilterMedicine] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    medicine_id: '', batch_number: '', quantity: '', expiry_date: ''
  })

  useEffect(() => {
    loadMedicines()
  }, [])

  useEffect(() => {
    loadBatches()
  }, [filterMedicine, filterStatus])

  const loadBatches = async () => {
    const params = new URLSearchParams()
    if (filterMedicine) params.set('medicine_id', filterMedicine)
    if (filterStatus) params.set('status', filterStatus)

    const res = await api(`/api/batches?${params}`)
    if (res.success) setBatches(res.data as any[])
    setLoading(false)
  }

  const loadMedicines = async () => {
    const res = await api('/api/medicines')
    if (res.success) setMedicines(res.data as any[])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = { ...form, quantity: Number(form.quantity) }
    const res = await api('/api/batches', { method: 'POST', body })
    if (res.success) {
      setShowModal(false)
      setForm({ medicine_id: '', batch_number: '', quantity: '', expiry_date: '' })
      loadBatches()
    } else {
      alert(res.message)
    }
  }

  const getExpiryBadge = (status: string, days: number) => {
    switch (status) {
      case 'expired':
        return <span className="badge badge--rose badge--lg">⛔ Expired</span>
      case 'critical':
        return <span className="badge badge--rose badge--lg">🔴 {days} hari</span>
      case 'warning':
        return <span className="badge badge--amber badge--lg">🟡 {days} hari</span>
      default:
        return <span className="badge badge--emerald badge--lg">✅ {days} hari</span>
    }
  }

  return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Batch & Tracking Expired</h1>
            <p className="page-header__desc">Kelola batch obat dan pantau tanggal kedaluwarsa (FEFO System)</p>
          </div>
          <button className="btn btn--primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Restock Batch
          </button>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap',
          fontSize: '0.8rem', color: 'var(--text-secondary)'
        }}>
          <span>🟢 Aman (&gt;90 hari)</span>
          <span>🟡 Peringatan (30-90 hari)</span>
          <span>🔴 Kritis (&lt;30 hari)</span>
          <span>⛔ Expired</span>
        </div>

        <div className="toolbar">
          <select className="form-select" style={{ maxWidth: 250 }} value={filterMedicine}
            onChange={(e) => setFilterMedicine(e.target.value)}>
            <option value="">Semua Obat</option>
            {medicines.map((m: any) => (
              <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
            ))}
          </select>
          <select className="form-select" style={{ maxWidth: 180 }} value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="safe">Aman</option>
            <option value="warning">Peringatan</option>
            <option value="critical">Kritis</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Obat</th>
                <th>Kode</th>
                <th>No. Batch</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Tgl. Expired</th>
                <th>Sisa Waktu</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                if (loading) {
                  return Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j}><div className="skeleton" style={{ height: 16, width: '80%' }} /></td>
                      ))}
                    </tr>
                  ))
                }
                if (batches.length === 0) {
                  return (
                    <tr>
                      <td colSpan={8}>
                        <div className="empty-state">
                          <Layers size={40} className="empty-state__icon" />
                          <p className="empty-state__title">Tidak ada batch</p>
                          <p className="empty-state__desc">Klik &quot;Restock Batch&quot; untuk menambahkan</p>
                        </div>
                      </td>
                    </tr>
                  )
                }
                return batches.map((batch, idx) => (
                  <AnimatedRow key={batch.id} index={idx} style={{
                    background: batch.expiry_status === 'expired' ? 'rgba(239,68,68,0.04)' :
                      batch.expiry_status === 'critical' ? 'rgba(239,68,68,0.02)' :
                        batch.expiry_status === 'warning' ? 'rgba(245,158,11,0.02)' : 'transparent'
                  }}>
                    <td style={{ fontWeight: 600 }}>{batch.medicine_name}</td>
                    <td><code style={{ fontSize: '0.8rem', background: 'var(--surface-3)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>{batch.medicine_code}</code></td>
                    <td>{batch.batch_number}</td>
                    <td style={{ fontWeight: 600 }}>{batch.stock_qty}</td>
                    <td>{batch.medicine_unit}</td>
                    <td>{formatDate(batch.expiry_date)}</td>
                    <td>{batch.days_until_expiry <= 0 ? 'Lewat' : `${batch.days_until_expiry} hari`}</td>
                    <td>{getExpiryBadge(batch.expiry_status, batch.days_until_expiry)}</td>
                  </AnimatedRow>
                ))
              })()}
            </tbody>
          </table>
        </div>

        {/* Restock Modal */}
        {showModal && (
          <AnimatedModal onClose={() => setShowModal(false)}>
            <div className="modal__header">
              <h3 className="modal__title">Restock — Tambah Batch Baru</h3>
              <button className="btn btn--ghost btn--icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                <div className="form-group">
                  <label>Obat *</label>
                  <select className="form-select" value={form.medicine_id}
                    onChange={(e) => setForm({ ...form, medicine_id: e.target.value })} required>
                    <option value="">Pilih Obat</option>
                    {medicines.map((m: any) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                  <div className="form-group">
                    <label>Nomor Batch *</label>
                    <input className="form-input" value={form.batch_number}
                      onChange={(e) => setForm({ ...form, batch_number: e.target.value })} required placeholder="e.g. BN-2026-0001" />
                  </div>
                  <div className="form-group">
                    <label>Jumlah (Qty) *</label>
                    <input className="form-input" type="number" value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })} required min="1" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Tanggal Kedaluwarsa *</label>
                  <input className="form-input" type="date" value={form.expiry_date}
                    onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} required />
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn--primary">Simpan Batch</button>
              </div>
            </form>
          </AnimatedModal>
        )}
      </div>
  )
}