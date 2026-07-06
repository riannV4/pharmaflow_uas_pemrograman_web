'use client'

import React from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { LogOut, User, Bell } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const roleBadge: Record<string, { label: string; className: string }> = {
    admin: { label: 'Admin', className: 'badge badge--emerald' },
    apoteker: { label: 'Apoteker', className: 'badge badge--blue' },
    kasir: { label: 'Kasir', className: 'badge badge--amber' },
  }

  const badge = user ? roleBadge[user.role] : null

  return (
    <header className="topbar">
      <div className="topbar__left">
        <h2 className="topbar__title">
          Selamat Datang, <span>{user?.name || 'User'}</span>
        </h2>
      </div>

      <div className="topbar__right">
        <button className="topbar__icon-btn" title="Notifikasi">
          <Bell size={20} />
        </button>

        <div className="topbar__user">
          <div className="topbar__avatar">
            <User size={18} />
          </div>
          <div className="topbar__user-info">
            <span className="topbar__user-name">{user?.name}</span>
            {badge && <span className={badge.className}>{badge.label}</span>}
          </div>
        </div>

        <button className="topbar__logout" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </header>
  )
}
