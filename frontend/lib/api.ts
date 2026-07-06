const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ApiOptions {
  method?: string
  body?: any
  token?: string
}

export async function api<T = any>(endpoint: string, options: ApiOptions = {}): Promise<{ success: boolean; data?: T; message?: string }> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  } else if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('pharmaflow_token')
    if (storedToken) {
      headers['Authorization'] = `Bearer ${storedToken}`
    }
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await res.json()

    if (!res.ok) {
      // If 401, clear token
      if (res.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('pharmaflow_token')
        localStorage.removeItem('pharmaflow_user')
        window.location.href = '/login'
      }
      return { success: false, message: data.message || 'Terjadi kesalahan.' }
    }

    return data
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal terhubung ke server.' }
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
