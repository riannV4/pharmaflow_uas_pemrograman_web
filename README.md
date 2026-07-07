# PharmaFlow — Pharmacy Inventory & POS SaaS

Aplikasi **Sistem Informasi Apotek (SIA)** berbasis SaaS untuk manajemen inventaris obat, sistem kasir (Point of Sale) terintegrasi, dan metode alokasi stok **FEFO (First Expired, First Out)**.

---

## 🚀 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Backend** | Hono Framework 4, Node.js, TypeScript |
| **Database** | Neon DB (Serverless PostgreSQL) |
| **Autentikasi** | JWT (jsonwebtoken) + bcryptjs |
| **Styling** | Tailwind CSS v4 + Custom Design System (CSS Variables) |
| **Icons** | Lucide React |
| **Charts** | Recharts (Bar Chart, Pie/Donut Chart) |
| **Animasi** | Framer Motion 12 (page transitions, stagger, modal, counter) |

---

## ✨ Fitur Utama

### 1. 📊 Dashboard Analitik
- Ringkasan performa harian: pendapatan hari ini, total transaksi, jumlah obat, stok menipis
- Grafik batang pendapatan 7 hari terakhir
- Donut chart obat terlaris (6 teratas dalam 30 hari)
- Sistem peringatan: stok menipis (di bawah minimum) dan batch mendekati kedaluwarsa (kritis ≤30 hari, warning 30-90 hari)

### 2. 🛒 Sistem Kasir Kilat (Point of Sale)
- Pencarian obat real-time dengan latensi rendah
- Pengurangan stok otomatis berdasarkan **FEFO** (batch dengan expired terdekat dialokasikan pertama)
- Panel belanja dengan input diskon, nama pelanggan, dan metode pembayaran
- 3 metode pembayaran: **Tunai (Cash)**, **Debit Card**, **QRIS/E-Wallet**
- Cetak struk belanja elektronik — layout 80mm untuk printer thermal (`@media print`)
- Nomor invoice otomatis format `INV-YYYYMMDD-NNNN` (sequence harian)

### 3. 💊 Manajemen Inventaris Obat
- CRUD data obat (nama, kode, unit, harga beli, harga jual, stok minimum)
- Pencarian obat berdasarkan nama/kode
- Filter berdasarkan kategori obat
- Indikator visual status stok: **Aman** (hijau), **Menipis** (kuning), **Habis** (merah)

### 4. 📦 Manajemen Batch & Tracking Kedaluwarsa
- Pelacakan stok per batch untuk setiap pemasokan (restock)
- Indikator visual masa kedaluwarsa: Aman (>90 hari), Peringatan (30-90 hari), Kritis (<30 hari), Expired
- Filter berdasarkan obat dan status expired
- Sistem **FEFO (First Expired, First Out)** untuk alokasi stok otomatis saat transaksi

### 5. 📋 Log Mutasi Stok
- Pencatatan otomatis setiap mutasi: **Masuk (Restock)** dan **Keluar (Penjualan)**
- Filter multikriteria: obat, jenis mutasi, rentang tanggal
- Riwayat lengkap dengan informasi batch, user, dan catatan

### 6. 👥 Manajemen Akses Karyawan (RBAC)
- Tiga level hak akses:

| Role | Akses |
|------|-------|
| **Admin** (Pemilik) | Semua menu — Dashboard, Inventaris, Kategori, Batch, POS, Mutasi, Kelola Users |
| **Apoteker** (Staf Gudang) | Inventaris, Kategori, Batch, Mutasi Stok |
| **Kasir** (Staf Penjualan) | POS (Kasir), Mutasi Stok |

- Sidebar navigasi menyesuaikan otomatis berdasarkan role
- Redirect otomatis: role `kasir` langsung ke halaman POS saat login
- Proteksi: tidak bisa menghapus akun sendiri

---

## 📁 Struktur Folder Proyek

```text
pharmaflow_saas/
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Entrypoint Hono (CORS, routes, server)
│   │   ├── middleware/
│   │   │   └── auth.ts                 # JWT verify + RBAC guard
│   │   ├── db/
│   │   │   ├── index.ts                # Koneksi Neon DB (neon serverless)
│   │   │   ├── schema.sql              # DDL: 7 tabel + indexes
│   │   │   ├── seed.sql                # Data demo: users, kategori, obat, batch, transaksi
│   │   │   ├── migrate.ts              # Script migrasi schema ke DB
│   │   │   ├── reset_pass.ts           # Script reset password admin
│   │   │   ├── check_tables.ts         # Script cek struktur tabel
│   │   │   └── check_users.ts          # Script cek daftar users
│   │   └── routes/
│   │       ├── auth.ts                 # Login, register, CRUD users
│   │       ├── medicines.ts            # CRUD obat + search/filter
│   │       ├── categories.ts           # CRUD kategori
│   │       ├── batches.ts              # CRUD batch + filter expired
│   │       ├── transactions.ts         # Transaksi POS + FEFO allocation
│   │       ├── dashboard.ts            # Summary, revenue, top medicines, alerts
│   │       └── stock-mutations.ts      # Log mutasi stok
│   ├── .env                            # DATABASE_URL + JWT_SECRET
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (font Inter Tight, AuthProvider)
│   │   ├── page.tsx                    # Root — redirect berdasarkan auth & role
│   │   ├── globals.css                 # Tailwind v4 + Custom Design System
│   │   ├── login/
│   │   │   └── page.tsx                # Halaman login
│   │   └── dashboard/
│   │       ├── layout.tsx              # Layout dashboard (sidebar, header, auth guard)
│   │       ├── page.tsx                # Dashboard analitik
│   │       ├── inventory/page.tsx      # Manajemen inventaris obat
│   │       ├── categories/page.tsx     # Kategori obat
│   │       ├── batches/page.tsx        # Batch & tracking expired
│   │       ├── pos/page.tsx            # Point of Sale (kasir)
│   │       ├── mutations/page.tsx      # Log mutasi stok
│   │       └── users/page.tsx          # Kelola akses karyawan
│   ├── components/
│   │   ├── sidebar.tsx                 # Sidebar navigasi (role-based menu)
│   │   ├── header.tsx                  # Topbar (user info, role badge, logout)
│   │   ├── animations.tsx              # Komponen animasi reusable (FadeIn, Stagger, dll)
│   │   └── page-transition-wrapper.tsx # AnimatePresence wrapper untuk transisi halaman
│   ├── lib/
│   │   ├── api.ts                      # API client + formatters (currency, date)
│   │   └── auth-context.tsx            # React Context autentikasi
│   └── package.json
│
├── project/
│   ├── prd.md                          # Product Requirement Document
│   └── workflow.md                     # Alur bisnis & pengembangan
│
└── README.md
```

---

## 🗄️ Skema Database (7 Tabel)

| Tabel | Fungsi |
|-------|--------|
| **users** | Nama, email, password_hash, role (admin/apoteker/kasir), is_active |
| **categories** | Nama kategori, deskripsi |
| **medicines** | Kode, nama, unit, harga beli/jual, stok_min, stok_total, relasi ke kategori |
| **medicine_batches** | Batch_number, stock_qty, expiry_date, relasi ke obat |
| **sales** | Invoice_number, total, diskon, net_amount, metode_bayar, relasi ke user (kasir) |
| **sale_items** | Detail item per transaksi: batch_number, quantity, subtotal |
| **stock_logs** | Log mutasi: type (in/out), quantity, reason, relasi ke obat & batch |

> **Seed data** tersedia dengan 6 user demo, 15 kategori, 72 obat, 94+ batch entries, dan 12 transaksi.

---

## 🛠️ Instalasi & Cara Menjalankan

### Prasyarat
- Node.js 18+ (direkomendasikan 20+)
- Akun [Neon DB](https://neon.tech) / Koneksi PostgreSQL
- Package manager: `npm`

### Langkah 1: Kloning Repositori
```bash
git clone <url-repositori>
cd pharmaflow_saas
```

### Langkah 2: Setup Backend
1. Masuk ke direktori backend dan install dependensi:
   ```bash
   cd backend
   npm install
   ```
2. Buat file `.env`:
   ```env
   DATABASE_URL=postgresql://neondb_owner:...@ep-damp-recipe-...neon.tech/neondb?sslmode=require
   JWT_SECRET=super_secret_key_pharmaflow_2026
   PORT=3001
   ```
3. Jalankan migrasi database (opsional — untuk membuat tabel):
   ```bash
   npx tsx src/db/migrate.ts
   ```
4. Jalankan server backend:
   ```bash
   npm run dev
   ```
   Server berjalan di `http://localhost:3001`.

### Langkah 3: Setup Frontend
1. Buka terminal baru, masuk ke direktori frontend:
   ```bash
   cd frontend
   npm install
   ```
2. (Opsional) Buat `.env.local` jika endpoint backend berbeda:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
3. Jalankan server frontend:
   ```bash
   npm run dev
   ```
4. Buka browser di `http://localhost:3000`.

---

## 🔑 Kredensial Demo

### Admin (Akses Penuh)
| Email | Password |
|-------|----------|
| `admin@pharmaflow.com` | `admin123` |

### Role Lain (untuk login & test akses)
| Email | Password | Role |
|-------|----------|------|
| `apoteker@pharmaflow.com` | `apoteker123` | Apoteker |
| `kasir@pharmaflow.com` | `kasir123` | Kasir |

> Untuk mendaftarkan user baru, gunakan menu **Kelola Users** setelah login sebagai Admin.

---

## 🔐 API Endpoints

Semua endpoint (kecuali login) memerlukan header: `Authorization: Bearer <token>`

| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `POST` | `/api/auth/login` | Publik | Login, mengembalikan JWT token |
| `POST` | `/api/auth/register` | Admin | Mendaftarkan user baru |
| `GET` | `/api/auth/me` | Auth | Info user saat ini |
| `GET` | `/api/auth/users` | Admin | Daftar semua user |
| `PUT` | `/api/auth/users/:id` | Admin | Edit user |
| `DELETE` | `/api/auth/users/:id` | Admin | Hapus user |
| | | | |
| `GET` | `/api/medicines` | Auth | Daftar obat (search, filter kategori, low_stock) |
| `POST` | `/api/medicines` | Admin/Apoteker | Tambah obat |
| `PUT` | `/api/medicines/:id` | Admin/Apoteker | Edit obat |
| `DELETE` | `/api/medicines/:id` | Admin | Hapus obat |
| | | | |
| `GET` | `/api/categories` | Auth | Daftar kategori (dengan jumlah obat) |
| `POST` | `/api/categories` | Admin/Apoteker | Tambah kategori |
| `PUT` | `/api/categories/:id` | Admin/Apoteker | Edit kategori |
| `DELETE` | `/api/categories/:id` | Admin | Hapus kategori |
| | | | |
| `GET` | `/api/batches` | Auth | Daftar batch (filter obat, status expired) |
| `POST` | `/api/batches` | Admin/Apoteker | Tambah batch (auto-update stock) |
| `DELETE` | `/api/batches/:id` | Admin | Hapus batch |
| | | | |
| `POST` | `/api/transactions` | Kasir/Admin | Buat transaksi (FEFO, auto invoice) |
| `GET` | `/api/transactions` | Auth | Riwayat transaksi (filter tanggal) |
| `GET` | `/api/transactions/:id` | Auth | Detail transaksi |
| | | | |
| `GET` | `/api/dashboard/summary` | Admin | Ringkasan dashboard |
| `GET` | `/api/dashboard/revenue` | Admin | Data pendapatan |
| `GET` | `/api/dashboard/top-medicines` | Admin | Obat terlaris |
| `GET` | `/api/dashboard/alerts` | Admin | Peringatan stok & expired |
| | | | |
| `GET` | `/api/stock-mutations` | Auth | Log mutasi stok (filter multi) |

---

## 🎨 Desain Sistem

Proyek ini menggunakan **Tailwind CSS v4** dengan custom design system berbasis CSS Variables:

- **Warna:** Sistem token warna terpadu (primary, surface, text, danger, warning, dll.)
- **Komponen:** `stat-card`, `badge` (emerald/amber/blue/rose), `alert-card`, `modal`, `page-header`, `toolbar`, `table`, `skeleton`, `empty-state`, `pos-cart`
- **Animasi:** Page transitions (AnimatePresence), staggered card entry, table row slide-in, modal scale-in, animated number counter
- **Responsif:** Sidebar collapsible, layout menyesuaikan

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan manajemen apotek. Silakan gunakan dan modifikasi sesuai kebutuhan.
