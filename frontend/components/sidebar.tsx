'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  ShoppingCart,
  ArrowLeftRight,
  Users,
  ChevronLeft,
  ChevronRight,
  Cross,
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const allMenuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
  { href: '/dashboard/inventory', label: 'Inventaris', icon: Package, roles: ['admin', 'apoteker'] },
  { href: '/dashboard/categories', label: 'Kategori', icon: Tags, roles: ['admin', 'apoteker'] },
  { href: '/dashboard/batches', label: 'Batch & Expired', icon: Layers, roles: ['admin', 'apoteker'] },
  { href: '/dashboard/pos', label: 'Kasir (POS)', icon: ShoppingCart, roles: ['admin', 'kasir'] },
  { href: '/dashboard/mutations', label: 'Mutasi Stok', icon: ArrowLeftRight, roles: ['admin', 'apoteker', 'kasir'] },
  { href: '/dashboard/users', label: 'Kelola Users', icon: Users, roles: ['admin'] },
]

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const menuItems = allMenuItems.filter(
    (item) => user && item.roles.includes(user.role)
  )

  return (
    <aside
      className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}
    >
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <Cross size={collapsed ? 20 : 24} />
        </div>
        {!collapsed && (
          <div className="sidebar__logo-text">
            <h1>PharmaFlow</h1>
            <span>Pharmacy SaaS</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Toggle Button */}
      <button className="sidebar__toggle" onClick={onToggle}>
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  )
}
