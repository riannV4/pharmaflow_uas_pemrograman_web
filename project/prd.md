# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Project Name: PharmaFlow (Pharmacy Inventory & POS SaaS)

| Informasi Dokumen    | Detail                                                            |
| :------------------- | :---------------------------------------------------------------- |
| **Nama Project**     | PharmaFlow                                                        |
| **Pengembang Utama** | Trian Rossi Karurukan                                             |
| **Tanggal**          | 6 Juli 2026                                                       |
| **Status**           | _Approved for Development_                                        |
| **Tech Stack**       | Next.js (Frontend), Hono (Backend), Neon DB (Serverless Postgres) |

---

## 1. Executive Summary & Latar Belakang

Apotek skala kecil dan menengah sering kali menghadapi kendala dalam efisiensi pencatatan transaksi kasir, pengelolaan stok obat multi-batch, serta pemantauan obat yang mendekati masa kedaluwarsa (_expired date_). Kelalaian dalam pelacakan produk kedaluwarsa berisiko menimbulkan kerugian finansial yang signifikan dan bahaya medis bagi konsumen.

**PharmaFlow** hadir sebagai platform SaaS manajemen inventaris dan _Point of Sale_ (POS) yang dirancang khusus untuk memenuhi kebutuhan digitalisasi industri farmasi. Dengan memanfaatkan kecepatan arsitektur _edge-ready_ dari Hono dan reliabilitas data relasional dari Neon DB, platform ini mampu memberikan performa transaksi real-time dengan latensi minimal dan skalabilitas yang andal.

---

## 2. Pengguna & Peran (User Personas)

Sistem ini membagi akses pengguna ke dalam 3 peran utama menggunakan _Role-Based Access Control_ (RBAC):

- **Admin (Pemilik Apotek/Manajer):** Memiliki kontrol penuh atas seluruh sistem, termasuk mengelola akun karyawan (kasir/apoteker), melihat laporan keuangan, performa penjualan, dan melakukan audit stok total.
- **Apoteker (Pharmacist):** Berfokus pada pengelolaan master data obat, penataan kategori, verifikasi obat masuk dari distributor, serta pengaturan nomor batch dan tanggal kedaluwarsa produk.
- **Kasir (Cashier):** Berfokus penuh pada antarmuka penjualan (POS), melayani _checkout_ pasien, mencetak struk belanja, dan menerima pembayaran.

---

## 3. Cakupan Fitur & Prioritas (MoSCoW Matrix)

Berikut adalah tabel skala prioritas enkapsulasi fitur PharmaFlow untuk fase _Minimum Viable Product_ (MVP):

| Fitur                    | Deskripsi                                                                                                       | Peran Pengguna  | Prioritas       |
| :----------------------- | :-------------------------------------------------------------------------------------------------------------- | :-------------- | :-------------- |
| **Autentikasi JWT**      | Login aman menggunakan email & password terlindungi (_hashed password_) serta proteksi rute halaman dashboard.  | Semua           | **Must Have**   |
| **Manajemen Inventaris** | CRUD data obat, manajemen unit (tablet/botol), kategori, dan batas aman stok minimum (_stock alert_).           | Admin, Apoteker | **Must Have**   |
| **Multi-Batch Tracking** | Pelacakan obat berdasarkan nomor batch produk dan tanggal kedaluwarsa (_FEFO System_).                          | Apoteker        | **Must Have**   |
| **Kasir Kilat (POS)**    | Antarmuka transaksi kasir kilat dengan pencarian obat, kalkulasi otomatis, dan cetak _invoice_.                 | Kasir, Admin    | **Must Have**   |
| **Log Mutasi Stok**      | Pencatatan otomatis setiap ada obat masuk (restock) atau keluar (terjual/rusak) untuk kebutuhan audit internal. | Semua           | **Should Have** |
| **Dashboard Analitik**   | Grafik pendapatan harian/bulanan, grafik obat terlaris, dan daftar alarm obat kritis.                           | Admin           | **Should Have** |
| **Notifikasi Eksternal** | Alert otomatis ke WhatsApp/Email pemilik jika ada stok obat vital yang habis atau kedaluwarsa.                  | Admin           | **Could Have**  |

---

## 4. Kebutuhan Fungsional & Logika Bisnis

### 4.1 Modul Kasir (Point of Sale)

- **Pencarian Cepat:** Sistem harus dapat mencari produk berdasarkan kode barcode atau nama obat dengan latensi respon input kurang dari **100ms** memanfaatkan optimalisasi indeksing database.
- **Logika Pengurangan Stok (FEFO - First Expired First Out):** Saat kasir memasukkan item obat ke keranjang belanja, sistem backend Hono harus secara otomatis mengalokasikan stok dari **Nomor Batch yang memiliki masa kedaluwarsa paling dekat**.
- **Rumus Finansial Transaksi:**
  Perhitungan subtotal per item produk dirumuskan sebagai berikut:

  $$\text{Subtotal} = \text{Price Per Unit} \times \text{Quantity}$$

  Sedangkan nilai akhir transaksi kotor (_Net Amount_) yang wajib dibayarkan pembeli setelah dikurangi potongan harga ditentukan melalui formula:

  $$\text{Net Amount} = \sum_{i=1}^{n} (\text{Subtotal}_i) - \text{Discount}$$

### 4.2 Modul Inventarisasi & Alert System

- **Indikator Kedaluwarsa:** Sistem Next.js harus mendeteksi rentang waktu `expiry_date` dari tabel database:
  - Jika sisa waktu masa aktif kurang dari 90 hari: Tampilkan indikator warna **Kuning** (Peringatan).
  - Jika sisa waktu masa aktif kurang dari 30 hari atau lewat hari: Tampilkan indikator warna **Merah** (Kritis / Dilarang Jual).
- **Stok Menipis:** Jika total stok berada di bawah nilai minimum stok yang ditentukan, sistem wajib memunculkan notifikasi restock otomatis pada panel dashboard utama.

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 5.1 Performa & Skalabilitas

- **Serverless Database Scaling:** Database harus menggunakan arsitektur serverless dari Neon DB untuk dapat melakukan _scale-up_ performa komputasi secara instan saat jam sibuk transaksi apotek, dan melakukan _scale-to-zero_ saat malam hari ketika apotek tutup demi menghemat biaya operasional.
- **Edge Routing Latency:** Backend API Hono wajib dikonfigurasi secara otomatis agar ringan dan kompatibel jika dideploy ke arsitektur Edge network (seperti Vercel Edge Functions), memangkas _Cold Start_ hingga di bawah **10ms**.

### 5.2 Keamanan Data (Security)

- **Hashing Sandi:** Seluruh kata sandi pengguna wajib dienkripsi sebelum masuk ke database menggunakan algoritma _Bcrypt_ dengan minimal kekuatan salt factor 10.
- **Stateless Authentication:** Token autentikasi menggunakan standar JWT (_JSON Web Token_) dengan masa kedaluwarsa token maksimal **8 jam** sejak waktu login pertama kali dilakukan.

---

## 6. Metrik Keberhasilan (KPIs)

Keberhasilan peluncuran versi awal platform PharmaFlow diukur berdasarkan parameter berikut:

- **Akurasi Inventaris:** **100%** sinkron antara jumlah fisik obat di rak apotek dengan data yang tercantum pada sistem log mutasi stok database.
- **Kecepatan Transaksi:** Waktu pemrosesan tombol "Selesaikan Pembayaran" hingga data tersimpan dan invoice terbit di bawah **1.5 detik**.
- **Zero Human Error Expired:** **0%** kasus obat kedaluwarsa yang lolos terjual ke tangan konsumen berkat sistem pencegahan berbasis logika otomatis FEFO pada backend.
