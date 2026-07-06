# WORKFLOW PROJECT PHARMAFLOW

## A. Workflow Bisnis Aplikasi (User Flow)

Alur ini menjelaskan bagaimana sistem digunakan secara operasional oleh pegawai apotek.

### 1. Alur Autentikasi (Keamanan)

1. **Akses Sistem:** Kasir atau Admin membuka URL aplikasi PharmaFlow di browser.
2. **Input Kredensial:** Pengguna memasukkan `email` dan `password` pada halaman login.
3. **Validasi Backend:** Backend Hono menerima data dan melakukan verifikasi ke tabel `users` di Neon DB (mencocokkan _hash_ password).
4. **Penerbitan Token:** Jika validasi sukses, backend menerbitkan **JWT (JSON Web Token)** yang berisi ID dan Role pengguna.
5. **Akses Dashboard:** Frontend Next.js menyimpan token tersebut (via _Local Storage_ atau _Cookies_) dan mengarahkan pengguna ke halaman Dashboard yang sesuai dengan hak aksesnya.

### 2. Alur Manajemen Inventaris (Admin & Apoteker)

1. **Penerimaan Barang:** Apoteker menerima kiriman stok obat fisik dari distributor/supplier.
2. **Input Data:** Apoteker membuka menu **Manajemen Inventaris > Tambah Obat/Restock**.
3. **Pencatatan Detail:** Apoteker memasukkan detail master obat (jika obat baru) atau langsung memasukkan **Nomor Batch** dan **Tanggal Kedaluwarsa** (jika restock obat lama).
4. **Penyimpanan Database:** Sistem mencatat penambahan stok ke dalam tabel `medicine_batches` dan merekam riwayatnya di tabel `stock_logs` dengan tipe mutasi `IN`.
5. **Sistem Peringatan (Alert):** Secara otomatis, sistem mengecek batas minimum stok dan batas waktu kedaluwarsa. Jika ada batch yang kedaluwarsanya kurang dari 90 hari, dashboard akan menampilkan peringatan (kuning/merah).

### 3. Alur Transaksi Kasir (Point of Sale)

1. **Pelayanan:** Pasien datang membeli obat atau menebus resep.
2. **Pencarian Produk:** Kasir membuka menu **POS / Penjualan**, lalu memindai barcode atau mengetik nama obat (sistem merespon pencarian dengan latensi <100ms).
3. **Alokasi FEFO Otomatis:** Saat obat dimasukkan ke keranjang kasir, backend secara otomatis memilih stok dari **Nomor Batch yang memiliki masa kedaluwarsa paling dekat (First Expired First Out)**.
4. **Kalkulasi Final:** Sistem menghitung _Subtotal_ per item dan _Net Amount_ setelah dikurangi diskon. Kasir menerima pembayaran dari pasien.
5. **Penyelesaian Transaksi:**
   - Stok pada tabel `medicine_batches` berkurang secara real-time.
   - Histori keluar tercatat di `stock_logs` dengan mutasi `OUT`.
   - Data transaksi tersimpan di tabel `sales` dan `sale_items`.
   - Sistem menerbitkan struk elektronik (Nomor Invoice).

---

## B. Workflow Pengembangan & Deployment (CI/CD)

Alur ini menjelaskan siklus rilis kode dari laptop _developer_ hingga _live_ ke server _production_.

### 1. Local Development (Tahap Pengkodean)

- **Workspace:** Menulis dan mengedit kode menggunakan Visual Studio Code.
- **Local Server:** Menjalankan _environment_ pengembangan menggunakan terminal lokal (`npm run dev` pada direktori `frontend` dan `backend`).
- **Testing:** Menguji fungsi API dan antarmuka (UI) menggunakan data _seed_ yang terhubung ke Neon DB.

### 2. Version Control (Tahap Penyimpanan Repositori)

- **Staging:** Setelah fitur selesai dikerjakan, perubahan disimpan menggunakan perintah `git add .`.
- **Commit:** Mengunci perubahan kode dengan pesan deskriptif (contoh: `git commit -m "feat: integrasi POS dengan sistem FEFO"`).
- **Push:** Mengirim perubahan dari laptop lokal ke GitHub (`git push origin main`).

### 3. Production & Hosting (Tahap Rilis Otomatis)

- **Trigger Integrasi:** Vercel secara otomatis mendeteksi setiap ada perubahan (_commit_ baru) yang masuk ke _branch main_ di repositori GitHub.
- **Proses Build:** Vercel memulai proses _build_, mengompilasi halaman Next.js, dan menyiapkan Hono sebagai _Edge Functions_.
- **Environment Variables:** Vercel memuat kunci rahasia secara aman (seperti `DATABASE_URL` dan `JWT_SECRET`) tanpa menampilkannya di _public source code_.
- **Go Live:** Setelah proses _build_ selesai, fitur baru atau perbaikan _bug_ langsung aktif dan dapat diakses secara publik oleh seluruh pengguna sistem.
