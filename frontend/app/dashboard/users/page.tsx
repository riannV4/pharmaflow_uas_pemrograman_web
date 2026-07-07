'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Plus, Pencil, Trash2, UsersIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { AnimatedRow, AnimatedModal } from '@/components/animations'

export default function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)

  const [form, setForm] = useState({
    name: '', email: '', role: 'apoteker', password: '', is_active: true
  })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const res = await api('/api/auth/users')
    if (res.success) setUsers(res.data as any[])
    setLoading(false)
  }

  const openAdd = () => {
    setEditItem(null)
    setForm({ name: '', email: '', role: 'apoteker', password: '', is_active: true })
    setShowModal(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({
      name: item.name,
      email: item.email,
      role: item.role,
      password: '',
      is_active: item.is_active
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let res
    if (editItem) {
      const updateData = { ...form }
      if (!updateData.password) delete (updateData as any).password
      res = await api(`/api/auth/users/${editItem.id}`, { method: 'PUT', body: updateData })
    } else {
      if (!form.password) return alert('Password wajib diisi untuk user baru.')
      res = await api('/api/auth/register', { method: 'POST', body: form })
    }

    if (res.success) {
      setShowModal(false)
      loadData()
    } else {
      alert(res.message)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (String(id) === String(user?.id)) {
      alert("Tidak dapat menghapus akun Anda sendiri.")
      return
    }
    if (!confirm(`Hapus pengguna "${name}"?`)) return

    const res = await api(`/api/auth/users/${id}`, { method: 'DELETE' })
    if (res.success) loadData()
    else alert(res.message)
  }

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin': return <span className="badge badge--emerald badge--lg">Admin</span>
      case 'apoteker': return <span className="badge badge--blue badge--lg">Apoteker</span>
      case 'kasir': return <span className="badge badge--amber badge--lg">Kasir</span>
      default: return <span className="badge badge--gray badge--lg">{role}</span>
    }
  }

  return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Kelola Akses Karyawan</h1>
            <p className="page-header__desc">Manajemen akun pengguna dan hak akses sistem</p>
          </div>
          <button className="btn btn--primary" onClick={openAdd}>
            <Plus size={18} /> Tambah User
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nama Lengkap</th>
                <th>Email / Username</th>
                <th>Role (Hak Akses)</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                if (loading) {
                  return Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5].map((j) => (
                        <td key={j}><div className="skeleton" style={{ height: 16, width: '70%' }} /></td>
                      ))}
                    </tr>
                  ))
                }
                if (users.length === 0) {
                  return (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty-state">
                          <UsersIcon size={40} className="empty-state__icon" />
                          <p className="empty-state__title">Belum ada user</p>
                        </div>
                      </td>
                    </tr>
                  )
                }
                return users.map((u, idx) => (
                  <AnimatedRow key={u.id} index={idx}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>
                      {u.is_active ?
                        <span className="badge badge--emerald">Aktif</span> :
                        <span className="badge badge--rose">Nonaktif</span>
                      }
                    </td>
                    <td>
                      <div className="table__actions">
                        <button className="btn btn--ghost btn--icon" onClick={() => openEdit(u)} title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn btn--ghost btn--icon"
                          onClick={() => handleDelete(u.id, u.name)}
                          title="Hapus"
                          disabled={String(u.id) === String(user?.id)}
                          style={{ color: String(u.id) === String(user?.id) ? 'var(--text-tertiary)' : 'var(--danger)' }}>
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

        {showModal && (
          <AnimatedModal onClose={() => setShowModal(false)}>
            <div className="modal__header">
              <h3 className="modal__title">{editItem ? 'Edit User' : 'Tambah User Baru'}</h3>
              <button className="btn btn--ghost btn--icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                <div className="form-group">
                  <label>Nama Lengkap *</label>
                  <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Role (Akses) *</label>
                  <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
                    <option value="admin">Admin (Pemilik)</option>
                    <option value="apoteker">Apoteker (Pharmacist)</option>
                    <option value="kasir">Kasir (Cashier)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Password {editItem && '(Kosongkan jika tidak ingin mengubah)'}</label>
                  <input className="form-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editItem} />
                </div>
                {editItem && (
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                    <label htmlFor="is_active" style={{ marginBottom: 0 }}>Akun Aktif (Dapat Login)</label>
                  </div>
                )}
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