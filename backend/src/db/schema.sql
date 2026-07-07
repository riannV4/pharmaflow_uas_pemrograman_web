-- ============================================================
-- PharmaFlow SaaS - Database Schema
-- ============================================================
-- Sistem Informasi Apotek dengan metode FEFO (First Expired, First Out)
-- Database: PostgreSQL (Neon DB)
-- ============================================================
-- Catatan: Jalankan file ini DI DIAGRAM/SQL Editor Neon DB atau
-- gunakan migrate.ts yang membaca file ini secara otomatis.
-- ============================================================

-- ===========================
-- 1. USERS (Pengguna Sistem)
-- ===========================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'apoteker', 'kasir')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================
-- 2. CATEGORIES (Kategori Obat)
-- ===========================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

-- ===========================
-- 3. MEDICINES (Obat / Produk)
-- ===========================
CREATE TABLE IF NOT EXISTS medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    unit VARCHAR(50) NOT NULL,
    price_buy NUMERIC(12, 2) NOT NULL DEFAULT 0,
    price_sell NUMERIC(12, 2) NOT NULL,
    stock_min INTEGER NOT NULL DEFAULT 10,
    stock_total INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================
-- 4. MEDICINE BATCHES (Batch Stok)
-- ===========================
CREATE TABLE IF NOT EXISTS medicine_batches (
    id SERIAL PRIMARY KEY,
    medicine_id INTEGER NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    batch_number VARCHAR(100) NOT NULL,
    stock_qty INTEGER NOT NULL DEFAULT 0,
    expiry_date DATE NOT NULL
);

-- ===========================
-- 5. SALES (Transaksi Penjualan)
-- ===========================
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL DEFAULT 'Umum',
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    net_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'cash',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================
-- 6. SALE ITEMS (Detail Item Transaksi)
-- ===========================
CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    medicine_id INTEGER NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    batch_number VARCHAR(100),
    quantity INTEGER NOT NULL,
    price_per_unit NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- ===========================
-- 7. STOCK LOGS (Riwayat Stok)
-- ===========================
CREATE TABLE IF NOT EXISTS stock_logs (
    id SERIAL PRIMARY KEY,
    medicine_id INTEGER NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    batch_number VARCHAR(100),
    type VARCHAR(10) NOT NULL CHECK (type IN ('in', 'out')),
    quantity INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ============================================================
-- INDEXES (Optimasi Query)
-- ============================================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Medicines
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category_id);
CREATE INDEX IF NOT EXISTS idx_medicines_code ON medicines(code);
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);

-- Medicine Batches
CREATE INDEX IF NOT EXISTS idx_batches_medicine ON medicine_batches(medicine_id);
CREATE INDEX IF NOT EXISTS idx_batches_expiry ON medicine_batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_batches_medicine_stock ON medicine_batches(medicine_id, stock_qty, expiry_date);

-- Sales
CREATE INDEX IF NOT EXISTS idx_sales_user ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_created ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_invoice ON sales(invoice_number);

-- Sale Items
CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_medicine ON sale_items(medicine_id);

-- Stock Logs
CREATE INDEX IF NOT EXISTS idx_stock_logs_medicine ON stock_logs(medicine_id);
CREATE INDEX IF NOT EXISTS idx_stock_logs_type ON stock_logs(type);
CREATE INDEX IF NOT EXISTS idx_stock_logs_created ON stock_logs(created_at);
