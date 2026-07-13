'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from './api'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  getDefaultRoute: () => string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Restore session from localStorage
    const storedToken = localStorage.getItem('pharmaflow_token')
    const storedUser = localStorage.getItem('pharmaflow_user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })

    if (res.success && res.data) {
      const { token: newToken, user: newUser } = res.data as any
      setToken(newToken)
      setUser(newUser)
      localStorage.setItem('pharmaflow_token', newToken)
      localStorage.setItem('pharmaflow_user', JSON.stringify(newUser))
      return { success: true }
    }

    return { success: false, message: res.message }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('pharmaflow_token')
    localStorage.removeItem('pharmaflow_user')
  }, [])

  const getDefaultRoute = useCallback(() => {
    if (!user) return '/login'
    switch (user.role) {
      case 'admin':
        return '/dashboard'
      case 'apoteker':
        return '/dashboard/inventory'
      case 'kasir':
        return '/dashboard/pos'
      default:
        return '/dashboard'
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, getDefaultRoute }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export type AuthContextTypeWithDefaultRoute = AuthContextType & { getDefaultRoute: () => string }
