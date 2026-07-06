'use client'

import React, { useState, useEffect, useRef } from 'react'
import { api, formatCurrency, formatDateTime } from '@/lib/api'
import { Search, ShoppingCart, Trash2, Printer, Plus, Minus, CreditCard, ChevronRight } from 'lucide-react'

export default function PosPage() {
  const [search, setSearch] = useState('')
  const [medicines, setMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [discount, setDiscount] = useState<number>(0)
  const [customerName, setCustomerName] = useState('Umum')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Invoice state for printing
  const [invoice, setInvoice] = useState<any>(null)

  useEffect(() => {
    // Focus search on mount
    searchInputRef.current?.focus()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 2) searchMedicines()
      else if (search.length === 0) setMedicines([])
    }, 200) // Fast 200ms debounce as per PRD "100ms latency" requirement
    return () => clearTimeout(timer)
  }, [search])

  const searchMedicines = async () => {
    setLoading(true)
    const res = await api(`/api/medicines?search=${encodeURIComponent(search)}`)
    if (res.success) {
      // Filter out medicines with zero stock
      const available = (res.data as any[]).filter(m => m.stock_total > 0)
      setMedicines(available)
    }
    setLoading(false)
  }

  const addToCart = (med: any) => {
    const existingIndex = cart.findIndex(item => item.id === med.id)
    
    if (existingIndex >= 0) {
      const newCart = [...cart]
      if (newCart[existingIndex].qty < med.stock_total) {
        newCart[existingIndex].qty += 1
        setCart(newCart)
      } else {
        alert('Stok tidak mencukupi!')
      }
    } else {
      setCart([...cart, { ...med, qty: 1 }])
    }
    setSearch('') // Reset search after adding
    searchInputRef.current?.focus()
  }

  const updateCartQty = (id: string, delta: number) => {
    const newCart = [...cart]
    const index = newCart.findIndex(item => item.id === id)
    if (index >= 0) {
      const newQty = newCart[index].qty + delta
      if (newQty <= 0) {
        newCart.splice(index, 1)
      } else if (newQty > newCart[index].stock_total) {
        alert('Stok tidak mencukupi!')
      } else {
        newCart[index].qty = newQty
      }
      setCart(newCart)
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price_sell) * item.qty), 0)
  const netAmount = Math.max(0, subtotal - discount)

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('Keranjang kosong.')
    setIsCheckingOut(true)

    const payload = {
      items: cart.map(item => ({ medicine_id: item.id, quantity: item.qty })),
      discount: discount,
      payment_method: paymentMethod,
      customer_name: customerName
    }

    const res = await api('/api/transactions', { method: 'POST', body: payload })
    
    if (res.success) {
      setInvoice(res.data)
      setCart([])
      setDiscount(0)
      setCustomerName('Umum')
    } else {
      alert(res.message)
    }
    setIsCheckingOut(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const startNewTransaction = () => {
    setInvoice(null)
    searchInputRef.current?.focus()
  }

  return (
    <div className="pos-layout">
      {/* Left side: Products search and list */}
      <div className="pos-products">
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 className="page-header__title" style={{ fontSize: '1.25rem' }}>Kasir Kilat (POS)</h2>
          <p className="page-header__desc">Scan barcode atau cari nama obat (FEFO otomatis)</p>
        </div>

        <div className="toolbar" style={{ marginBottom: '1.5rem' }}>
          <input
            ref={searchInputRef}
            type="text"
            className="form-input form-input--search"
            placeholder="Ketik barcode atau nama obat..."
            style={{ width: '100%', maxWidth: 'none', padding: '1rem 1rem 1rem 3rem', fontSize: '1.1rem', borderRadius: 'var(--radius-lg)' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={invoice !== null}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner" style={{ margin: '0 auto', borderColor: 'var(--primary-200)', borderTopColor: 'var(--primary)' }}></div>
          </div>
        ) : (
          <div className="pos-products-grid">
            {medicines.map(med => (
              <div key={med.id} className="pos-product-card" onClick={() => addToCart(med)}>
                <div className="pos-product-card__icon">
                  <Plus size={20} />
                </div>
                <div className="pos-product-card__info">
                  <div className="pos-product-card__name">{med.name}</div>
                  <div className="pos-product-card__meta">
                    {med.code} • Stok: <strong style={{ color: 'var(--primary-700)' }}>{med.stock_total}</strong>
                  </div>
                </div>
                <div className="pos-product-card__price">
                  {formatCurrency(Number(med.price_sell))}
                </div>
              </div>
            ))}
            
            {search.length > 0 && medicines.length === 0 && !loading && (
              <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                Obat tidak ditemukan atau stok habis.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side: Cart or Invoice */}
      {invoice ? (
        <div className="pos-cart" style={{ background: '#fff', border: '1px dashed var(--border)' }}>
          <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }} className="invoice" id="printable-invoice">
            <div className="invoice__header">
              <h2 style={{ fontSize: '1.4rem' }}>Apotek PharmaFlow</h2>
              <p>Jl. Sehat Selalu No. 99, Jakarta</p>
              <p>Kasir: {invoice.transaction.user_id} {/* Should be username but user_id in this mockup */}</p>
              <p>{formatDateTime(invoice.transaction.created_at)}</p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>No. Invoice:</strong> {invoice.transaction.invoice_number}<br/>
              <strong>Pelanggan:</strong> {invoice.transaction.customer_name}
            </div>

            <div className="invoice__divider"></div>
            
            {invoice.items.map((item: any, idx: number) => (
              <div key={idx} style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 600 }}>{item.medicine_name}</div>
                <div className="invoice__row">
                  <span>{item.quantity} x {formatCurrency(Number(item.price))}</span>
                  <span>{formatCurrency(Number(item.subtotal))}</span>
                </div>
                {item.batchAllocations && item.batchAllocations.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.15rem' }}>
                    [Batch FEFO: {item.batchAllocations.map((b: any) => `${b.batch_number}(${b.qty})`).join(', ')}]
                  </div>
                )}
              </div>
            ))}

            <div className="invoice__divider"></div>
            
            <div className="invoice__row">
              <span>Subtotal</span>
              <span>{formatCurrency(Number(invoice.summary.subtotal))}</span>
            </div>
            <div className="invoice__row">
              <span>Diskon</span>
              <span>- {formatCurrency(Number(invoice.summary.discount))}</span>
            </div>
            
            <div className="invoice__divider"></div>
            
            <div className="invoice__row invoice__total">
              <span>Total Akhir</span>
              <span>{formatCurrency(Number(invoice.summary.total))}</span>
            </div>
            <div className="invoice__row" style={{ marginTop: '0.5rem' }}>
              <span>Metode Bayar</span>
              <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{invoice.transaction.payment_method}</span>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem', fontWeight: 600 }}>
              Terima Kasih & Semoga Lekas Sembuh!
            </div>
          </div>
          
          <div className="pos-cart__footer" style={{ display: 'flex', gap: '1rem', background: '#f8fafc' }}>
             <button className="btn btn--secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={handlePrint}>
              <Printer size={18} /> Cetak Struk
            </button>
            <button className="btn btn--primary" style={{ flex: 1, justifyContent: 'center' }} onClick={startNewTransaction}>
              Transaksi Baru <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="pos-cart">
          <div className="pos-cart__header">
            <h3>🛒 Keranjang Belanja</h3>
          </div>
          
          <div className="pos-cart__items">
            {cart.length === 0 ? (
              <div className="empty-state" style={{ height: '100%' }}>
                <ShoppingCart size={48} className="empty-state__icon" style={{ opacity: 0.2 }} />
                <p className="empty-state__desc">Belum ada obat yang ditambahkan</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="pos-cart__item">
                  <div className="pos-cart__item-info">
                    <div className="pos-cart__item-name" title={item.name}>{item.name}</div>
                    <div className="pos-cart__item-price">{formatCurrency(Number(item.price_sell))}</div>
                  </div>
                  <div className="pos-cart__item-qty">
                    <button onClick={() => updateCartQty(item.id, -1)}><Minus size={14} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, 1)}><Plus size={14} /></button>
                  </div>
                  <div className="pos-cart__item-subtotal">
                    {formatCurrency(Number(item.price_sell) * item.qty)}
                  </div>
                  <button className="btn btn--ghost btn--icon" style={{ color: 'var(--danger)' }} onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="pos-cart__footer">
            <div className="pos-cart__summary">
              <div className="discount-input">
                <label>Nama Pelanggan:</label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              </div>
              <div className="discount-input">
                <label>Metode Bayar:</label>
                <select className="form-select" style={{ flex: 1, padding: '0.4rem 0.6rem' }} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option value="cash">Tunai (Cash)</option>
                  <option value="debit">Debit Card</option>
                  <option value="qris">QRIS / E-Wallet</option>
                </select>
              </div>
              <div className="discount-input">
                <label>Diskon (Rp):</label>
                <input type="number" min="0" value={discount || ''} onChange={e => setDiscount(Number(e.target.value) || 0)} />
              </div>

              <div className="pos-cart__summary-row mt-2">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="pos-cart__summary-row pos-cart__summary-row--total">
                <span>Total Akhir</span>
                <span style={{ color: 'var(--primary-dark)' }}>{formatCurrency(netAmount)}</span>
              </div>
            </div>

            <button 
              className="pos-cart__checkout-btn" 
              disabled={cart.length === 0 || isCheckingOut}
              onClick={handleCheckout}
            >
              {isCheckingOut ? (
                <><div className="spinner" style={{ width: 16, height: 16 }}></div> Memproses...</>
              ) : (
                <><CreditCard size={18} /> Selesaikan Pembayaran</>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Hidden print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #printable-invoice, #printable-invoice * { visibility: visible; }
          #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; padding: 0; background: white; }
          .sidebar, .topbar { display: none !important; }
          @page { margin: 0; size: 80mm 297mm; }
        }
      `}} />
    </div>
  )
}
