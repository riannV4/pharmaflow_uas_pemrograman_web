-- ============================================================
-- PharmaFlow SaaS - Seed Data
-- ============================================================
-- Jalankan file ini di Neon DB untuk mengisi data awal.
-- Password semua akun: admin123
-- bcrypt hash (cost 10) untuk "admin123":
--   $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- ============================================================

-- ===========================
-- 1. USERS
-- ===========================
-- Password "admin123" sudah di-hash dengan bcrypt (cost 10)
-- Hash yang valid dihasilkan oleh bcryptjs dengan salt 10

INSERT INTO users (name, email, password_hash, role, is_active) VALUES
  ('Admin Utama',    'admin@pharmaflow.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin',    true),
  ('Rina Sari',      'apoteker@pharmaflow.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'apoteker', true),
  ('Budi Santoso',   'kasir@pharmaflow.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'kasir',    true),
  ('Dewi Lestari',   'dewi@pharmaflow.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'kasir',    true),
  ('Ahmad Fauzi',    'ahmad@pharmaflow.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'apoteker', true),
  ('Siti Nurhaliza', 'siti@pharmaflow.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'kasir',    true)
ON CONFLICT (email) DO NOTHING;

-- ===========================
-- 2. CATEGORIES
-- ===========================
INSERT INTO categories (name, description) VALUES
  ('Obat Demam & Nyeri',       'Parasetamol, ibuprofen, aspirin, dan obat penurun panas lainnya'),
  ('Obat Batuk & Flu',         'Obat batuk sirup, tablet, dan obat pilek'),
  ('Obat Pencernaan',          'Antasida, obat diare, probiotik, dan vitamin pencernaan'),
  ('Obat Antibiotik',          'Amoksisilin, cefaleksin, azitromisin, dan antibiotik lainnya'),
  ('Vitamin & Suplemen',       'Vitamin C, D, multivitamin, mineral, dan suplemen kesehatan'),
  ('Obat Alergi',              'Antihistamin dan obat untuk reaksi alergi'),
  ('Obat Mata & Telinga',      'Tetes mata, salep mata, obat tetes telinga'),
  ('Obat Luar / Topikal',      'Salep, krim, gel, dan obat oles'),
  ('Perawatan Bayi & Anak',    'Popok, susu formula, obat masuk angin anak, vitamin anak'),
  ('Alat Kesehatan',           'Termometer, tensimeter, plester, perban, dan alat medis lainnya'),
  ('Obat Jantung & Hipertensi','Obat tekanan darah tinggi dan gangguan jantung'),
  ('Obat Diabetes',            'Obat penurun kadar gula darah oral maupun injeksi'),
  ('Obat Herbal & Tradisional','Jamu, herbal modern, dan suplemen alami'),
  ('Kosmetik & Perawatan Tubuh','Sabun, shampo, pelembab, dan produk perawatan tubuh'),
  ('Obat Kejiwaan & Saraf',    'Obat anti-kecemasan, antidepresan, dan obat neurologis')
ON CONFLICT (name) DO NOTHING;

-- ===========================
-- 3. MEDICINES
-- ===========================

-- Kategori 1: Obat Demam & Nyeri (category_id = 1)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Parasetamol 500mg',           'MED-0001', 1, 'strip',  5000,   8000,  50, 200, 'Obat penurun panas dan pereda nyeri ringan. Isi 10 tablet.'),
  ('Ibuprofen 400mg',             'MED-0002', 1, 'strip',  6000,  10000,  40, 150, 'Anti-inflamasi non-steroid untuk nyeri dan demam.'),
  ('Parasetamol Drop 100mg/ml',   'MED-0003', 1, 'botol', 12000,  18000,  20,  80, 'Sirup parasetamol untuk bayi dan anak kecil.'),
  ('Aspirin 500mg',               'MED-0004', 1, 'strip',  4000,   7000,  30, 100, 'Analgesik, antipiretik, dan antiplatelet.'),
  ('Mefenam Acid 500mg',          'MED-0005', 1, 'strip',  8000,  12000,  30, 120, 'Obat anti-radang untuk nyeri haid dan nyeri otot.'),
  ('Dexamehasone 0.5mg',          'MED-0006', 1, 'strip',  5000,   9000,  25,  90, 'Kortikosteroid untuk peradangan dan alergi.');

-- Kategori 2: Obat Batuk & Flu (category_id = 2)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Komix Herbacetus 10ml',       'MED-0007', 2, 'sachet',  2000,   3500,  60, 300, 'Obat batuk herbal dalam sachet siap minum.'),
  ('Bisolvon 10mg (Bromhexine)',  'MED-0008', 2, 'strip',   7000,  11000,  30, 120, 'Mukolitik untuk mengencerkan dahak.'),
  ('Decolgen Forte',              'MED-0009', 2, 'strip',   6000,  10000,  40, 160, 'Obat flu untuk pilek, demam, dan hidung tersumbat.'),
  ('Vicks Formula 44 (Sirup)',    'MED-0010', 2, 'botol',  18000,  25000,  15,  60, 'Sirup obat batuk dan pilek dewasa.'),
  ('Triaminic 120mg',             'MED-0011', 2, 'botol',  22000,  30000,  15,  45, 'Sirup demam dan flu untuk anak 6-12 tahun.'),
  ('Salonpas Patch',              'MED-0012', 2, 'box',    15000,  22000,  20,  80, 'Koyo pereda nyeri otot dan pegal linu.');

-- Kategori 3: Obat Pencernaan (category_id = 3)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Entrostop',                   'MED-0013', 3, 'strip',   4000,   7000,  40, 180, 'Obat diare mengandung attapulgite.'),
  ('Ultra-Levura 250mg',          'MED-0014', 3, 'strip',   9000,  14000,  25, 100, 'Probiotik untuk keseimbangan flora usus.'),
  ('Promag Tablet',               'MED-0015', 3, 'strip',   5000,   8000,  30, 130, 'Antasida untuk maag dan gangguan lambung.'),
  ('Diapet 100mg',                'MED-0016', 3, 'strip',   3000,   5500,  40, 200, 'Obat diare alami dari daun jambu biji.'),
  ('Spasmal 200mg (Buscopan)',    'MED-0017', 3, 'strip',  10000,  15000,  20,  70, 'Obat perut kram dan kejang saluran cerna.'),
  ('Lactobacillus (Lac-B)',       'MED-0018', 3, 'botol',  25000,  35000,  15,  50, 'Suplemen probiotik untuk pencernaan.');

-- Kategori 4: Obat Antibiotik (category_id = 4)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Amoksisilin 500mg',           'MED-0019', 4, 'strip',   8000,  12000,  30, 100, 'Antibiotik golongan penisilin untuk infeksi saluran napas.'),
  ('Cefaleksin 500mg',            'MED-0020', 4, 'strip',  12000,  18000,  20,  60, 'Antibiotik sefalosporin generasi 1.'),
  ('Azitromisin 500mg',           'MED-0021', 4, 'strip',  15000,  22000,  20,  50, 'Antibiotik makrolida untuk infeksi saluran napas atas dan bawah.'),
  ('Eritromisin 500mg',           'MED-0022', 4, 'strip',  10000,  15000,  20,  70, 'Antibiotik makrolida alternatif.'),
  ('Metronidazol 500mg',          'MED-0023', 4, 'strip',   6000,  10000,  25,  80, 'Antibiotik untuk infeksi anaerob dan protozoa.');

-- Kategori 5: Vitamin & Suplemen (category_id = 5)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Vitamin C 1000mg (Youvit)',   'MED-0024', 5, 'strip',  10000,  15000,  30, 150, 'Vitamin C tinggi untuk daya tahan tubuh.'),
  ('Vitamin D3 1000IU',           'MED-0025', 5, 'botol',  45000,  65000,  15,  40, 'Suplemen vitamin D untuk kesehatan tulang.'),
  ('Enervon-C 1000mg',            'MED-0026', 5, 'strip',  12000,  18000,  30, 180, 'Vitamin C dengan bioflavonoid.'),
  ('Blackmores Fish Oil 1000mg',  'MED-0027', 5, 'botol',  80000, 110000,  10,  30, 'Minyak ikan omega-3 untuk kesehatan jantung.'),
  ('Zinc 50mg (Nature\'s Way)',   'MED-0028', 5, 'botol',  50000,  70000,  10,  35, 'Suplemen seng untuk imun tubuh.'),
  ('Vitamin B Complex',           'MED-0029', 5, 'strip',   5000,   8000,  30, 160, 'Vitamin B kompleks untuk energi dan saraf.'),
  ('Magnesium 200mg',             'MED-0030', 5, 'botol',  55000,  75000,  10,  25, 'Mineral untuk otot dan saraf.');

-- Kategori 6: Obat Alergi (category_id = 6)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('CTM 4mg (Chlorpheniramine)',  'MED-0031', 6, 'strip',   3000,   5000,  30, 120, 'Antihistamin untuk alergi dan gatal-gatal.'),
  ('Loratadine 10mg',             'MED-0032', 6, 'strip',   8000,  12000,  25,  90, 'Antihistamin generasi 2 tanpa rasa kantuk.'),
  ('Cetirizine 10mg',             'MED-0033', 6, 'strip',   7000,  11000,  25,  85, 'Antihistamin untuk rinitis alergi dan urtikaria.'),
  ('Dexamethasone 0.75mg',        'MED-0034', 6, 'strip',   4000,   7000,  20,  70, 'Kortikosteroid untuk peradangan dan alergi berat.');

-- Kategori 7: Obat Mata & Telinga (category_id = 7)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Insto Regular Tetes Mata',    'MED-0035', 7, 'botol',   8000,  12000,  20,  60, 'Tetes mata untuk mata merah dan iritasi ringan.'),
  ('Cendo Xitrol 10ml',           'MED-0036', 7, 'botol',  35000,  48000,  10,  25, 'Tetes mata antibiotik untuk infeksi mata.'),
  ('Sanprima Tetes Telinga',      'MED-0037', 7, 'botol',  15000,  22000,  10,  30, 'Tetes telinga untuk infeksi telinga luar.');

-- Kategori 8: Obat Luar / Topikal (category_id = 8)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Betnovate-G Cream',           'MED-0038', 8, 'tube',   12000,  18000,  20,  70, 'Salep anti-jamur dan anti-radang kulit.'),
  ('Bioplacenton Jelly',          'MED-0039', 8, 'tube',   15000,  22000,  15,  50, 'Salep luka bakar dan luka tergores.'),
  ('Caladine Lotion',             'MED-0040', 8, 'botol',  10000,  15000,  20,  80, 'Lotion anti-gatal untuk biduran dan gigitan serangga.'),
  ('Miconazole Cream 2%',         'MED-0041', 8, 'tube',    8000,  12000,  20,  60, 'Salep antijamur untuk infeksi jamur kulit.'),
  ('Gentamicin 0.1% Eye Ointment','MED-0042', 8, 'tube',    9000,  14000,  15,  40, 'Salep mata antibiotik.');

-- Kategori 9: Perawatan Bayi & Anak (category_id = 9)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('My Baby Minyak Telon 60ml',   'MED-0043', 9, 'botol',   12000,  18000,  25, 100, 'Minyak telon untuk kesehatan perut bayi.'),
  ('Paratusin Sirup 60ml',        'MED-0044', 9, 'botol',   15000,  22000,  15,  50, 'Sirup batuk pilek untuk anak.'),
  ('Vidalatin drops',             'MED-0045', 9, 'botol',   35000,  50000,  10,  30, 'Vitamin penambah nafsu makan anak.'),
  ('Zambon Gripe Water 60ml',     'MED-0046', 9, 'botol',   12000,  18000,  20,  60, 'Obat masuk angin dan kembung untuk bayi.');

-- Kategori 10: Alat Kesehatan (category_id = 10)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Termometer Digital',           'MED-0047', 10, 'pcs',   25000,  40000,  10,  25, 'Pengukur suhu tubuh digital akurat.'),
  ('Tensimeter Digital Omron',     'MED-0048', 10, 'pcs',  250000, 350000,   5,   8, 'Alat ukur tekanan darah digital.'),
  ('Plester Luka Hansaplast',      'MED-0049', 10, 'box',    5000,   8000,  30, 100, 'Plester luka steril ukuran assorted.'),
  ('Masker Medis 3-Ply (box)',     'MED-0050', 10, 'box',   35000,  50000,  20,  80, 'Masker medis sekali pakai isi 50 pcs.'),
  ('Hand Sanitizer 500ml',         'MED-0051', 10, 'botol',  20000,  30000,  25, 100, 'Pembersih tangan berbasis alkohol 70%.'),
  ('Kasa Steril 10cm x 10cm',      'MED-0052', 10, 'pack',    5000,   8000,  20,  60, 'Kasa steril untuk perawatan luka.');

-- Kategori 11: Obat Jantung & Hipertensi (category_id = 11)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Amlodipine 5mg',               'MED-0053', 11, 'strip',  15000,  22000,  20,  80, 'Calcium channel blocker untuk hipertensi.'),
  ('Candesartan 8mg',              'MED-0054', 11, 'strip',  20000,  30000,  15,  50, 'ARB untuk hipertensi dan gagal jantung.'),
  ('Metoprolol 50mg',              'MED-0055', 11, 'strip',  12000,  18000,  20,  60, 'Beta-blocker untuk hipertensi dan aritmia.'),
  ('Aspilet 80mg',                 'MED-0056', 11, 'strip',   8000,  12000,  25, 100, 'Aspirin dosis rendah untuk pencegahan stroke.'),
  ('Clopidogrel 75mg',             'MED-0057', 11, 'strip',  25000,  35000,  15,  40, 'Antiplatelet untuk pencegahan trombosis.');

-- Kategori 12: Obat Diabetes (category_id = 12)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Metformin 500mg',              'MED-0058', 12, 'strip',   8000,  12000,  25, 100, 'Biguanide untuk diabetes tipe 2.'),
  ('Glibenclamide 5mg',            'MED-0059', 12, 'strip',   5000,   8000,  25,  80, 'Sulfonilurea untuk diabetes tipe 2.'),
  ('Glimepiride 2mg',              'MED-0060', 12, 'strip',  12000,  18000,  20,  60, 'Sulfonilurea generasi baru untuk diabetes.');

-- Kategori 13: Obat Herbal & Tradisional (category_id = 13)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Tolak Angin Cair 15ml',        'MED-0061', 13, 'sachet',  2000,   3500,  60, 250, 'Obat herbal masuk angin dan mual.'),
  ('Empon-Empon Kaplet',           'MED-0062', 13, 'strip',   5000,   8000,  30, 120, 'Herbal untuk daya tahan tubuh dan anti-peradangan.'),
  ('Kunyit Asam Sirih Kaplet',     'MED-0063', 13, 'strip',   4000,   6500,  30, 130, 'Herbal untuk kesehatan wanita.'),
  ('Bandrex Herbal 100ml',         'MED-0064', 13, 'botol',  15000,  22000,  20,  60, 'Minuman herbal pegal linu dan masuk angin.');

-- Kategori 14: Kosmetik & Perawatan Tubuh (category_id = 14)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Cetaphil Gentle Cleanser',     'MED-0065', 14, 'botol',  80000, 110000,   8,  20, 'Pembersih wajah lembut untuk semua jenis kulit.'),
  ('Biore UV Aqua Rich 30ml',      'MED-0066', 14, 'tube',   45000,  65000,  10,  25, 'Sunscreen SPF 50+ PA++++.'),
  ('Vaseline Petroleum Jelly',     'MED-0067', 14, 'jar',    25000,  35000,  15,  40, 'Petroleum jelly serbaguna untuk kelembaban kulit.'),
  ('Nivea Body Lotion 200ml',      'MED-0068', 14, 'botol',  25000,  35000,  15,  35, 'Lotion pelembab tubuh.');

-- Kategori 15: Obat Kejiwaan & Saraf (category_id = 15)
INSERT INTO medicines (name, code, category_id, unit, price_buy, price_sell, stock_min, stock_total, description) VALUES
  ('Diazepam 2mg',                 'MED-0069', 15, 'strip',  10000,  15000,  15,  40, 'Benzodiazepin untuk kecemasan dan kejang.'),
  ('Amitriptyline 25mg',           'MED-0070', 15, 'strip',  12000,  18000,  15,  35, 'Antidepresan trisiklik untuk depresi dan neuropati.'),
  ('Pregabalin 75mg',              'MED-0071', 15, 'strip',  35000,  48000,  10,  25, 'Antikonvulsan untuk neuropati dan nyeri kronis.'),
  ('Carbamazepine 200mg',          'MED-0072', 15, 'strip',  15000,  22000,  15,  40, 'Antikonvulsan untuk epilepsi.');


-- ===========================
-- 4. MEDICINE BATCHES
-- ===========================
-- Menambahkan batch dengan expiry_date beragam untuk simulasi FEFO.
-- Beberapa batch sudah expired atau hampir expired untuk testing alert.

-- Parasetamol 500mg (medicine_id = 1)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (1, 'BT-2024-001',  80, '2026-08-15'),
  (1, 'BT-2024-010', 120, '2027-03-20');

-- Ibuprofen 400mg (medicine_id = 2)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (2, 'BT-2024-002',  50, '2026-09-30'),
  (2, 'BT-2024-011', 100, '2027-06-15');

-- Parasetamol Drop (medicine_id = 3)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (3, 'BT-2024-003',  30, '2026-07-20'),
  (3, 'BT-2024-012',  50, '2027-01-10');

-- Aspirin (medicine_id = 4)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (4, 'BT-2024-004', 100, '2027-12-31');

-- Mefenam Acid (medicine_id = 5)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (5, 'BT-2024-005',  70, '2026-11-20'),
  (5, 'BT-2024-013',  50, '2027-08-15');

-- Dexamehasone (medicine_id = 6)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (6, 'BT-2024-006',  90, '2027-04-30');

-- Komix (medicine_id = 7)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (7, 'BT-2024-007', 100, '2026-10-15'),
  (7, 'BT-2024-014', 200, '2027-09-30');

-- Bisolvon (medicine_id = 8)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (8, 'BT-2024-008',  60, '2027-06-30'),
  (8, 'BT-2024-015',  60, '2028-01-15');

-- Decolgen Forte (medicine_id = 9)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (9, 'BT-2024-009',  80, '2026-12-20'),
  (9, 'BT-2024-016',  80, '2027-11-10');

-- Vicks Formula 44 (medicine_id = 10)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (10, 'BT-2024-017',  30, '2027-03-25'),
  (10, 'BT-2024-018',  30, '2028-06-30');

-- Triaminic (medicine_id = 11)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (11, 'BT-2024-019',  45, '2027-09-15');

-- Salonpas (medicine_id = 12)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (12, 'BT-2024-020',  40, '2028-12-31'),
  (12, 'BT-2024-021',  40, '2029-06-30');

-- Entrostop (medicine_id = 13)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (13, 'BT-2024-022',  80, '2027-05-20'),
  (13, 'BT-2024-023', 100, '2028-02-15');

-- Ultra-Levura (medicine_id = 14)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (14, 'BT-2024-024',  50, '2026-08-30'),
  (14, 'BT-2024-025',  50, '2027-10-15');

-- Promag (medicine_id = 15)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (15, 'BT-2024-026',  60, '2027-07-20'),
  (15, 'BT-2024-027',  70, '2028-03-30');

-- Diapet (medicine_id = 16)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (16, 'BT-2024-028', 100, '2027-12-31'),
  (16, 'BT-2024-029', 100, '2028-06-15');

-- Buscopan (medicine_id = 17)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (17, 'BT-2024-030',  40, '2027-04-10'),
  (17, 'BT-2024-031',  30, '2028-08-20');

-- Lac-B (medicine_id = 18)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (18, 'BT-2024-032',  50, '2027-02-28');

-- Amoksisilin (medicine_id = 19)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (19, 'BT-2024-033',  50, '2027-06-10'),
  (19, 'BT-2024-034',  50, '2028-01-25');

-- Cefaleksin (medicine_id = 20)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (20, 'BT-2024-035',  60, '2027-09-30');

-- Azitromisin (medicine_id = 21)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (21, 'BT-2024-036',  50, '2028-03-15');

-- Eritromisin (medicine_id = 22)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (22, 'BT-2024-037',  70, '2027-11-20');

-- Metronidazol (medicine_id = 23)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (23, 'BT-2024-038',  80, '2027-08-10');

-- Vitamin C Youvit (medicine_id = 24)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (24, 'BT-2024-039',  75, '2027-05-30'),
  (24, 'BT-2024-040',  75, '2028-01-20');

-- Vitamin D3 (medicine_id = 25)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (25, 'BT-2024-041',  40, '2028-06-30');

-- Enervon-C (medicine_id = 26)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (26, 'BT-2024-042',  90, '2027-12-15'),
  (26, 'BT-2024-043',  90, '2028-08-30');

-- Blackmores Fish Oil (medicine_id = 27)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (27, 'BT-2024-044',  30, '2028-03-10');

-- Zinc (medicine_id = 28)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (28, 'BT-2024-045',  35, '2028-09-25');

-- Vitamin B Complex (medicine_id = 29)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (29, 'BT-2024-046',  80, '2027-10-20'),
  (29, 'BT-2024-047',  80, '2028-04-15');

-- Magnesium (medicine_id = 30)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (30, 'BT-2024-048',  25, '2028-07-30');

-- CTM (medicine_id = 31)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (31, 'BT-2024-049',  60, '2027-08-10'),
  (31, 'BT-2024-050',  60, '2028-02-20');

-- Loratadine (medicine_id = 32)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (32, 'BT-2024-051',  45, '2027-12-05'),
  (32, 'BT-2024-052',  45, '2028-06-15');

-- Cetirizine (medicine_id = 33)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (33, 'BT-2024-053',  85, '2028-01-10');

-- Dexamethasone (medicine_id = 34)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (34, 'BT-2024-054',  70, '2027-05-25');

-- Insto (medicine_id = 35)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (35, 'BT-2024-055',  60, '2027-09-20');

-- Cendo Xitrol (medicine_id = 36)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (36, 'BT-2024-056',  25, '2027-11-30');

-- Sanprima (medicine_id = 37)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (37, 'BT-2024-057',  30, '2027-07-15');

-- Betnovate-G (medicine_id = 38)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (38, 'BT-2024-058',  35, '2027-10-20'),
  (38, 'BT-2024-059',  35, '2028-05-10');

-- Bioplacenton (medicine_id = 39)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (39, 'BT-2024-060',  50, '2028-02-28');

-- Caladine Lotion (medicine_id = 40)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (40, 'BT-2024-061',  80, '2028-08-15');

-- Miconazole (medicine_id = 41)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (41, 'BT-2024-062',  60, '2027-12-10');

-- Gentamicin Eye Oint (medicine_id = 42)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (42, 'BT-2024-063',  40, '2028-04-30');

-- My Baby Minyak Telon (medicine_id = 43)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (43, 'BT-2024-064', 100, '2029-01-15');

-- Paratusin Sirup (medicine_id = 44)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (44, 'BT-2024-065',  50, '2028-03-20');

-- Vidalatin drops (medicine_id = 45)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (45, 'BT-2024-066',  30, '2028-07-10');

-- Zambon Gripe Water (medicine_id = 46)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (46, 'BT-2024-067',  60, '2028-05-25');

-- Termometer Digital (medicine_id = 47)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (47, 'BT-2024-068',  25, '2099-12-31');

-- Tensimeter Digital (medicine_id = 48)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (48, 'BT-2024-069',   8, '2099-12-31');

-- Plester Luka (medicine_id = 49)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (49, 'BT-2024-070', 100, '2029-06-30');

-- Masker Medis (medicine_id = 50)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (50, 'BT-2024-071',  80, '2028-12-31');

-- Hand Sanitizer (medicine_id = 51)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (51, 'BT-2024-072', 100, '2028-06-30');

-- Kasa Steril (medicine_id = 52)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (52, 'BT-2024-073',  60, '2029-03-15');

-- Amlodipine (medicine_id = 53)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (53, 'BT-2024-074',  40, '2027-11-25'),
  (53, 'BT-2024-075',  40, '2028-09-10');

-- Candesartan (medicine_id = 54)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (54, 'BT-2024-076',  50, '2028-04-20');

-- Metoprolol (medicine_id = 55)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (55, 'BT-2024-077',  60, '2027-10-15');

-- Aspilet (medicine_id = 56)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (56, 'BT-2024-078', 100, '2028-08-20');

-- Clopidogrel (medicine_id = 57)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (57, 'BT-2024-079',  40, '2028-01-30');

-- Metformin (medicine_id = 58)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (58, 'BT-2024-080', 100, '2028-03-15');

-- Glibenclamide (medicine_id = 59)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (59, 'BT-2024-081',  80, '2027-12-20');

-- Glimepiride (medicine_id = 60)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (60, 'BT-2024-082',  60, '2028-06-10');

-- Tolak Angin (medicine_id = 61)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (61, 'BT-2024-083', 250, '2027-09-30');

-- Empon-Empon (medicine_id = 62)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (62, 'BT-2024-084', 120, '2028-02-15');

-- Kunyit Asam Sirih (medicine_id = 63)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (63, 'BT-2024-085', 130, '2028-01-20');

-- Bandrex Herbal (medicine_id = 64)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (64, 'BT-2024-086',  60, '2028-05-10');

-- Cetaphil (medicine_id = 65)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (65, 'BT-2024-087',  20, '2029-03-30');

-- Biore UV (medicine_id = 66)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (66, 'BT-2024-088',  25, '2029-01-15');

-- Vaseline PJ (medicine_id = 67)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (67, 'BT-2024-089',  40, '2029-08-20');

-- Nivea Body Lotion (medicine_id = 68)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (68, 'BT-2024-090',  35, '2028-11-30');

-- Diazepam (medicine_id = 69)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (69, 'BT-2024-091',  40, '2028-04-15');

-- Amitriptyline (medicine_id = 70)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (70, 'BT-2024-092',  35, '2028-07-20');

-- Pregabalin (medicine_id = 71)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (71, 'BT-2024-093',  25, '2028-09-30');

-- Carbamazepine (medicine_id = 72)
INSERT INTO medicine_batches (medicine_id, batch_number, stock_qty, expiry_date) VALUES
  (72, 'BT-2024-094',  40, '2028-06-25');


-- ===========================
-- 5. SALES (Transaksi Penjualan)
-- ===========================
-- 10 transaksi penjualan dalam beberapa hari terakhir.

INSERT INTO sales (invoice_number, user_id, customer_name, total_amount, discount, net_amount, payment_method, created_at) VALUES
  ('INV-20260701-0001', 3, 'Umum',          23000,     0,  23000, 'cash', '2026-07-01 08:30:00'),
  ('INV-20260701-0002', 3, 'Umum',          45000,  5000,  40000, 'cash', '2026-07-01 10:15:00'),
  ('INV-20260702-0001', 3, 'Umum',          36000,     0,  36000, 'cash', '2026-07-02 09:00:00'),
  ('INV-20260702-0002', 4, 'Bp. Hendra',    50000,  2000,  48000, 'cash', '2026-07-02 14:20:00'),
  ('INV-20260703-0001', 3, 'Umum',          27000,     0,  27000, 'cash', '2026-07-03 08:45:00'),
  ('INV-20260704-0001', 4, 'Ibu Ratna',     53000,  3000,  50000, 'cash', '2026-07-04 11:00:00'),
  ('INV-20260704-0002', 3, 'Umum',          15000,     0,  15000, 'cash', '2026-07-04 15:30:00'),
  ('INV-20260705-0001', 4, 'Umum',          40000,     0,  40000, 'cash', '2026-07-05 09:15:00'),
  ('INV-20260706-0001', 3, 'Bp. Joko',      38000,  2000,  36000, 'cash', '2026-07-06 10:00:00'),
  ('INV-20260707-0001', 3, 'Umum',          30000,     0,  30000, 'cash', '2026-07-07 08:00:00'),
  ('INV-20260707-0002', 4, 'Ibu Sari',      25000,  2000,  23000, 'cash', '2026-07-07 10:30:00'),
  ('INV-20260707-0003', 3, 'Umum',          50000,  5000,  45000, 'cash', '2026-07-07 13:00:00');


-- ===========================
-- 6. SALE ITEMS (Detail Item Penjualan)
-- ===========================

-- INV-20260701-0001 (sale_id = 1): 3x Parasetamol 500mg
INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal) VALUES
  (1, 1, 'BT-2024-001', 3, 8000, 24000);

-- INV-20260701-0002 (sale_id = 2): 1x Komix + 1x Salonpas
INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal) VALUES
  (2, 7,  'BT-2024-007', 5,  3500, 17500),
  (2, 12, 'BT-2024-020', 2, 22000, 44000);

-- INV-20260702-0001 (sale_id = 3): 2x Parasetamol + 2x Ibuprofen
INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal) VALUES
  (3, 1, 'BT-2024-001', 2,  8000, 16000),
  (3, 2, 'BT-2024-002', 2, 10000, 20000);

-- INV-20260702-0002 (sale_id = 4): 1x Amoksisilin + 2x Bisolvon
INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal) VALUES
  (4, 19, 'BT-2024-033', 2, 12000, 24000),
  (4, 8,  'BT-2024-008', 2, 11000, 22000);

-- INV-20260703-0001 (sale_id = 5): 3x Parasetamol Drop + 1x Diapet
INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal) VALUES
  (5, 3,  'BT-2024-003', 2, 18000, 36000),
  (5, 16, 'BT-2024-028', 2,  5500, 11000);

-- INV-20260704-0001 (sale_id = 6): 3x Tolak Angin + 2x Bioplacenton
INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal) VALUES
  (6, 61, 'BT-2024-083', 5,  3500, 17500),
  (6, 39, 'BT-2024-060', 2, 22000, 44000);

-- INV-20260704-0002 (sale_id = 7): 1x Salonpas
INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal) VALUES
  (7, 12, 'BT-2024-020', 1, 22000, 22000);

-- INV-20260705-0001 (sale_id = 8): 2x Enervon-C + 1x Decolgen
INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal) VALUES
  (8, 26, 'BT-2024-042', 2, 18000, 36000),
  (8, 9,  'BT-2024-009', 2, 10000, 20000);

-- INV-20260706-0001 (sale_id = 9): 1x Blackmores + 1x Ultra-Levura
INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal) VALUES
  (9, 27, 'BT-2024-044', 1, 110000, 110000),
  (9, 14, 'BT-2024-024', 2,  14000,  28000);

-- INV-20260707-0001 (sale_id = 10): 3x Parasetamol
INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal) VALUES
  (10, 1, 'BT-2024-001', 4,  8000, 32000);

-- INV-20260707-0002 (sale_id = 11): 1x Promag + 1x Buscopan
INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal) VALUES
  (11, 15, 'BT-2024-026', 2,  8000, 16000),
  (11, 17, 'BT-2024-030', 1, 15000, 15000);

-- INV-20260707-0003 (sale_id = 12): 1x Tensimeter + 1x Termometer
INSERT INTO sale_items (sale_id, medicine_id, batch_number, quantity, price_per_unit, subtotal) VALUES
  (12, 48, 'BT-2024-069', 1, 350000, 350000),
  (12, 47, 'BT-2024-068', 1,  40000,  40000);


-- ===========================
-- 7. STOCK LOGS
-- ===========================
-- Log restock awal dan penjualan.

-- Restock logs (type = 'in')
INSERT INTO stock_logs (medicine_id, batch_number, type, quantity, reason, created_at) VALUES
  (1,  'BT-2024-001', 'in',  80, 'Restock batch BT-2024-001', '2026-01-15 09:00:00'),
  (1,  'BT-2024-010', 'in', 120, 'Restock batch BT-2024-010', '2026-03-10 09:00:00'),
  (2,  'BT-2024-002', 'in',  50, 'Restock batch BT-2024-002', '2026-01-15 09:00:00'),
  (2,  'BT-2024-011', 'in', 100, 'Restock batch BT-2024-011', '2026-04-20 09:00:00'),
  (3,  'BT-2024-003', 'in',  30, 'Restock batch BT-2024-003', '2026-02-10 09:00:00'),
  (3,  'BT-2024-012', 'in',  50, 'Restock batch BT-2024-012', '2026-05-05 09:00:00'),
  (7,  'BT-2024-007', 'in', 100, 'Restock batch BT-2024-007', '2026-02-15 09:00:00'),
  (7,  'BT-2024-014', 'in', 200, 'Restock batch BT-2024-014', '2026-06-01 09:00:00'),
  (8,  'BT-2024-008', 'in',  60, 'Restock batch BT-2024-008', '2026-03-01 09:00:00'),
  (9,  'BT-2024-009', 'in',  80, 'Restock batch BT-2024-009', '2026-03-15 09:00:00'),
  (12, 'BT-2024-020', 'in',  40, 'Restock batch BT-2024-020', '2026-04-01 09:00:00'),
  (12, 'BT-2024-021', 'in',  40, 'Restock batch BT-2024-021', '2026-06-15 09:00:00'),
  (14, 'BT-2024-024', 'in',  50, 'Restock batch BT-2024-024', '2026-02-20 09:00:00'),
  (15, 'BT-2024-026', 'in',  60, 'Restock batch BT-2024-026', '2026-03-05 09:00:00'),
  (16, 'BT-2024-028', 'in', 100, 'Restock batch BT-2024-028', '2026-04-10 09:00:00'),
  (17, 'BT-2024-030', 'in',  40, 'Restock batch BT-2024-030', '2026-04-15 09:00:00'),
  (19, 'BT-2024-033', 'in',  50, 'Restock batch BT-2024-033', '2026-02-25 09:00:00'),
  (26, 'BT-2024-042', 'in',  90, 'Restock batch BT-2024-042', '2026-05-10 09:00:00'),
  (27, 'BT-2024-044', 'in',  30, 'Restock batch BT-2024-044', '2026-05-15 09:00:00'),
  (39, 'BT-2024-060', 'in',  50, 'Restock batch BT-2024-060', '2026-06-01 09:00:00'),
  (47, 'BT-2024-068', 'in',  25, 'Restock batch BT-2024-068', '2026-01-05 09:00:00'),
  (48, 'BT-2024-069', 'in',   8, 'Restock batch BT-2024-069', '2026-01-05 09:00:00'),
  (61, 'BT-2024-083', 'in', 250, 'Restock batch BT-2024-083', '2026-03-20 09:00:00');

-- Penjualan logs (type = 'out')
INSERT INTO stock_logs (medicine_id, batch_number, type, quantity, reason, created_at) VALUES
  (1,  'BT-2024-001', 'out',  3, 'Penjualan INV-20260701-0001', '2026-07-01 08:30:00'),
  (7,  'BT-2024-007', 'out',  5, 'Penjualan INV-20260701-0002', '2026-07-01 10:15:00'),
  (12, 'BT-2024-020', 'out',  2, 'Penjualan INV-20260701-0002', '2026-07-01 10:15:00'),
  (1,  'BT-2024-001', 'out',  2, 'Penjualan INV-20260702-0001', '2026-07-02 09:00:00'),
  (2,  'BT-2024-002', 'out',  2, 'Penjualan INV-20260702-0001', '2026-07-02 09:00:00'),
  (19, 'BT-2024-033', 'out',  2, 'Penjualan INV-20260702-0002', '2026-07-02 14:20:00'),
  (8,  'BT-2024-008', 'out',  2, 'Penjualan INV-20260702-0002', '2026-07-02 14:20:00'),
  (3,  'BT-2024-003', 'out',  2, 'Penjualan INV-20260703-0001', '2026-07-03 08:45:00'),
  (16, 'BT-2024-028', 'out',  2, 'Penjualan INV-20260703-0001', '2026-07-03 08:45:00'),
  (61, 'BT-2024-083', 'out',  5, 'Penjualan INV-20260704-0001', '2026-07-04 11:00:00'),
  (39, 'BT-2024-060', 'out',  2, 'Penjualan INV-20260704-0001', '2026-07-04 11:00:00'),
  (12, 'BT-2024-020', 'out',  1, 'Penjualan INV-20260704-0002', '2026-07-04 15:30:00'),
  (26, 'BT-2024-042', 'out',  2, 'Penjualan INV-20260705-0001', '2026-07-05 09:15:00'),
  (9,  'BT-2024-009', 'out',  2, 'Penjualan INV-20260705-0001', '2026-07-05 09:15:00'),
  (27, 'BT-2024-044', 'out',  1, 'Penjualan INV-20260706-0001', '2026-07-06 10:00:00'),
  (14, 'BT-2024-024', 'out',  2, 'Penjualan INV-20260706-0001', '2026-07-06 10:00:00'),
  (1,  'BT-2024-001', 'out',  4, 'Penjualan INV-20260707-0001', '2026-07-07 08:00:00'),
  (15, 'BT-2024-026', 'out',  2, 'Penjualan INV-20260707-0002', '2026-07-07 10:30:00'),
  (17, 'BT-2024-030', 'out',  1, 'Penjualan INV-20260707-0002', '2026-07-07 10:30:00'),
  (48, 'BT-2024-069', 'out',  1, 'Penjualan INV-20260707-0003', '2026-07-07 13:00:00'),
  (47, 'BT-2024-068', 'out',  1, 'Penjualan INV-20260707-0003', '2026-07-07 13:00:00');


-- ============================================================
-- CATATAN PENTING:
-- ============================================================
-- 1. Password semua akun: admin123
-- 2. Login pertama kali menggunakan akun:
--    Email: admin@pharmaflow.com / Password: admin123
-- 3. Data ini mensimulasikan apotek dengan 72 item obat/kesehatan
--    dari 15 kategori, 12 transaksi penjualan, dan batch stok
--    dengan expiry_date beragam (termasuk yang sudah expired
--    dan hampir expired untuk testing fitur alert).
-- 4. Untuk mereset password, gunakan script:
--    cd backend && npx tsx src/db/reset_pass.ts
-- 5. Jika ingin menjalankan seed, pastikan tabel sudah dibuat
--    terlebih dahulu (schema.sql harus ada di backend/src/db/).
-- ============================================================
