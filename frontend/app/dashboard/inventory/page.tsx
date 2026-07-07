'use client'

import { useState, useEffect } from 'react'
import { api, formatCurrency } from '@/lib/api'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import { AnimatedRow, AnimatedModal } from '@/components/animations'

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState({
    name: '', code: '', category_id: '', unit: 'tablet', price_buy: '', price_sell: '', stock_min: '10', description: ''
  })

  useEffect(() => {
    loadData()
    loadCategories()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 300)
    return () => clearTimeout(timer)
  }, [search, filterCategory])

  const loadData = async () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterCategory) params.set('category_id', filterCategory)

    const res = await api(`/api/medicines?${params}`)
    if (res.success) setMedicines(res.data as any[])
    setLoading(false)
  }

  const loadCategories = async () => {
    const res = await api('/api/categories')
    if (res.success) setCategories(res.data as any[])
  }

  const openAdd = () => {
    setEditItem(null)
    setForm({ name: '', code: '', category_id: '', unit: 'tablet', price_buy: '', price_sell: '', stock_min: '10', description: '' })
    setShowModal(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({
      name: item.name,
      code: item.code,
      category_id: item.category_id || '',
      unit: item.unit,
      price_buy: String(item.price_buy || 0),
      price_sell: String(item.price_sell),
      stock_min: String(item.stock_min),
      description: item.description || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      ...form,
      price_buy: Number(form.price_buy || 0),
      price_sell: Number(form.price_sell),
      stock_min: Number(form.stock_min),
      category_id: form.category_id || null,
    }

    let res
    if (editItem) {
      res = await api(`/api/medicines/${editItem.id}`, { method: 'PUT', body })
    } else {
      res = await api('/api/medicines', { method: 'POST', body })
    }

    if (res.success) {
      setShowModal(false)
      loadData()
    } else {
      alert(res.message)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus obat "${name}"?`)) return
    const res = await api(`/api/medicines/${id}`, { method: 'DELETE' })
    if (res.success) loadData()
    else alert(res.message)
  }

  const getStockBadge = (stock: number, minStock: number) => {
    if (stock === 0) return <span className="badge badge--rose">Habis</span>
    if (stock < minStock) return <span className="badge badge--amber">Menipis</span>
    return <span className="badge badge--emerald">Aman</span>
  }

  return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Manajemen Inventaris</h1>
            <p className="page-header__desc">Kelola data obat apotek Anda</p>
          </div>
          <div className="page-header__actions">
            <button className="btn btn--primary" onClick={openAdd}>
              <Plus size={18} /> Tambah Obat
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <input
            type="text"
            className="form-input form-input--search"
            placeholder="Cari nama atau kode obat..."
            style={{ maxWidth: 320 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            style={{ maxWidth: 200 }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Obat</th>
                <th>Kategori</th>
                <th>Unit</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Min. Stok</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                if (loading) {
                  return Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j}><div className="skeleton" style={{ height: 16, width: '80%' }} /></td>
                      ))}
                    </tr>
                  ))
                }
                if (medicines.length === 0) {
                  return (
                    <tr>
                      <td colSpan={9}>
                        <div className="empty-state">
                          <Package size={40} className="empty-state__icon" />
                          <p className="empty-state__title">Belum ada data obat</p>
                          <p className="empty-state__desc">Klik tombol &quot;Tambah Obat&quot; untuk menambahkan</p>
                        </div>
                      </td>
                    </tr>
                  )
                }
                return medicines.map((med, idx) => (
                  <AnimatedRow key={med.id} index={idx}>
                    <td><code style={{ fontSize: '0.8rem', background: 'var(--surface-3)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>{med.code}</code></td>
                    <td style={{ fontWeight: 600 }}>{med.name}</td>
                    <td>{med.category_name || '—'}</td>
                    <td>{med.unit}</td>
                    <td>{formatCurrency(Number(med.price_sell))}</td>
                    <td style={{ fontWeight: 600 }}>{med.stock_total}</td>
                    <td>{med.stock_min}</td>
                    <td>{getStockBadge(med.stock_total, med.stock_min)}</td>
                    <td>
                      <div className="table__actions">
                        <button className="btn btn--ghost btn--icon" onClick={() => openEdit(med)} title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button className="btn btn--ghost btn--icon" onClick={() => handleDelete(med.id, med.name)} title="Hapus"
                          style={{ color: 'var(--danger)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </AnimatedRow>
                ))
              })()}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <AnimatedModal onClose={() => setShowModal(false)}>
            <div className="modal__header">
              <h3 className="modal__title">{editItem ? 'Edit Obat' : 'Tambah Obat Baru'}</h3>
              <button className="btn btn--ghost btn--icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                  <div className="form-group">
                    <label>Nama Obat *</label>
                    <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Kode Obat *</label>
                    <input className="form-input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Kategori</label>
                    <select className="form-select" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                      <option value="">Tanpa Kategori</option>
                      {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Unit *</label>
                    <select className="form-select" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                      <option value="tablet">Tablet</option>
                      <option value="kapsul">Kapsul</option>
                      <option value="botol">Botol</option>
                      <option value="tube">Tube</option>
                      <option value="sachet">Sachet</option>
                      <option value="ampul">Ampul</option>
                      <option value="strip">Strip</option>
                      <option value="box">Box</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Harga Beli (Rp)</label>
                    <input className="form-input" type="number" value={form.price_buy} onChange={(e) => setForm({ ...form, price_buy: e.target.value })} min="0" />
                  </div>
                  <div className="form-group">
                    <label>Harga Jual (Rp) *</label>
                    <input className="form-input" type="number" value={form.price_sell} onChange={(e) => setForm({ ...form, price_sell: e.target.value })} required min="0" />
                  </div>
                  <div className="form-group">
                    <label>Min. Stok</label>
                    <input className="form-input" type="number" value={form.stock_min} onChange={(e) => setForm({ ...form, stock_min: e.target.value })} min="0" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <input className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn--primary">{editItem ? 'Simpan' : 'Tambah'}</button>
              </div>
            </form>
          </AnimatedModal>
        )}
      </div>
  )
}