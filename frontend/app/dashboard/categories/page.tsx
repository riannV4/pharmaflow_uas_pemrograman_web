'use client'

import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Plus, Pencil, Trash2, Tags } from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState({ name: '', description: '' })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const res = await api('/api/categories')
    if (res.success) setCategories(res.data as any[])
    setLoading(false)
  }

  const openAdd = () => {
    setEditItem(null)
    setForm({ name: '', description: '' })
    setShowModal(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({ name: item.name, description: item.description || '' })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let res
    if (editItem) {
      res = await api(`/api/categories/${editItem.id}`, { method: 'PUT', body: form })
    } else {
      res = await api('/api/categories', { method: 'POST', body: form })
    }
    if (res.success) { setShowModal(false); loadData() }
    else alert(res.message)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return
    const res = await api(`/api/categories/${id}`, { method: 'DELETE' })
    if (res.success) loadData()
    else alert(res.message)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Kategori Obat</h1>
          <p className="page-header__desc">Kelola kategori untuk pengelompokan obat</p>
        </div>
        <button className="btn btn--primary" onClick={openAdd}>
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nama Kategori</th>
              <th>Deskripsi</th>
              <th>Jumlah Obat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {[1, 2, 3, 4].map((j) => (
                    <td key={j}><div className="skeleton" style={{ height: 16, width: '70%' }} /></td>
                  ))}
                </tr>
              ))
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="empty-state">
                    <Tags size={40} className="empty-state__icon" />
                    <p className="empty-state__title">Belum ada kategori</p>
                    <p className="empty-state__desc">Tambahkan kategori untuk mengelompokkan obat</p>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ fontWeight: 600 }}>{cat.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{cat.description || '—'}</td>
                  <td>
                    <span className="badge badge--blue badge--lg">{cat.medicine_count} obat</span>
                  </td>
                  <td>
                    <div className="table__actions">
                      <button className="btn btn--ghost btn--icon" onClick={() => openEdit(cat)} title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button className="btn btn--ghost btn--icon" onClick={() => handleDelete(cat.id, cat.name)} title="Hapus"
                        style={{ color: 'var(--danger)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{editItem ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
              <button className="btn btn--ghost btn--icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                <div className="form-group">
                  <label>Nama Kategori *</label>
                  <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
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
          </div>
        </div>
      )}
    </div>
  )
}
