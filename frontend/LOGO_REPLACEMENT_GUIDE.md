# 🎨 Logo Replacement Guide

Panduan lengkap untuk mengganti logo project PharmaFlow.

---

## 📍 Lokasi Logo di Project

Logo PharmaFlow muncul di **3 tempat**:

### 1. **Navigation Bar** (Top-left, setiap page)
```typescript
// FILE: frontend/components/landing/navigation.tsx (line 60)
<Pill size={22} color="white" />
```
- Ukuran: 40×40 px
- Warna background: Gradient #34d399 → #0d9488
- Position: Fixed di atas

### 2. **Landing Page (Hero Section)**
```typescript
// FILE: frontend/components/landing/navigation.tsx (bagian dari nav)
// Sama dengan di atas
```

### 3. **Footer**
```typescript
// FILE: frontend/components/landing/footer.tsx (line 42)
<Pill size={16} color="white" />
```
- Ukuran: 28×28 px
- Warna background: Gradient #34d399 → #0d9488
- Position: Footer center

---

## 🖼️ Format Logo yang Direkomendasikan

### Opsi 1: SVG (Recommended)
```
Keuntungan:
✅ Scalable tanpa blur
✅ Ringan (file size kecil)
✅ Dapat di-style dengan CSS
✅ Cocok untuk semua ukuran
```

**Tempat simpan**: `frontend/public/logo.svg`

### Opsi 2: PNG
```
Keuntungan:
✅ Mudah dibuat dengan design tools
✅ Support transparency
✅ Kompatibel semua browser

Persyaratan:
- Minimum 512×512 px (untuk scalability)
- Background transparent
- Format: PNG dengan alpha channel
```

**Tempat simpan**: `frontend/public/logo.png`

### Opsi 3: Dynamic Logo Component
```
Keuntungan:
✅ Custom styling per lokasi
✅ Animasi lebih mudah
✅ Size responsif

Cara: Buat component React
```

---

## 🚀 Cara Mengganti Logo

### Method 1: SVG (Recommended)

#### Step 1: Siapkan File SVG
```
1. Buat/export logo Anda sebagai SVG
2. Pastikan ukuran canvas: 512×512 px (atau square)
3. Nama file: logo.svg
```

#### Step 2: Letakkan di Public Folder
```
frontend/
└── public/
    └── logo.svg  ← Letakkan di sini
```

#### Step 3: Update Components

**Update Navigation Component:**
```typescript
// FILE: frontend/components/landing/navigation.tsx

// Ganti dari:
import { Pill } from 'lucide-react'
// Menjadi:
import Image from 'next/image'

// Ganti JSX dari:
<div
  style={{
    width: 40,
    height: 40,
    background: 'linear-gradient(135deg, #34d399, #0d9488)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(52, 211, 153, 0.3)',
  }}
>
  <Pill size={22} color="white" />
</div>

// Menjadi:
<Image
  src="/logo.svg"
  alt="PharmaFlow Logo"
  width={40}
  height={40}
  style={{
    borderRadius: 10,
    boxShadow: '0 2px 8px rgba(52, 211, 153, 0.3)',
  }}
/>
```

**Update Footer Component:**
```typescript
// FILE: frontend/components/landing/footer.tsx

// Ganti dari:
<div
  style={{
    width: 28,
    height: 28,
    background: 'linear-gradient(135deg, #34d399, #0d9488)',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <Pill size={16} color="white" />
</div>

// Menjadi:
<Image
  src="/logo.svg"
  alt="PharmaFlow Logo"
  width={28}
  height={28}
  style={{
    borderRadius: 6,
  }}
/>
```

---

### Method 2: PNG dengan Background

#### Step 1: Siapkan File PNG
```
1. Export logo Anda sebagai PNG
2. Ukuran: 512×512 px (atau lebih besar)
3. Background: Transparent atau solid color
4. Nama: logo.png
```

#### Step 2: Letakkan di Public Folder
```
frontend/
└── public/
    └── logo.png  ← Letakkan di sini
```

#### Step 3: Update Components
```typescript
// Sama seperti SVG method di atas
// Hanya ganti `/logo.svg` menjadi `/logo.png`

<Image
  src="/logo.png"
  alt="PharmaFlow Logo"
  width={40}
  height={40}
/>
```

---

### Method 3: Logo Component Custom

#### Jika ingin lebih flexible:

```typescript
// FILE: frontend/components/logo.tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface LogoProps {
  size?: number
  animated?: boolean
  href?: string
}

export function Logo({ size = 40, animated = false, href }: LogoProps) {
  const logo = (
    <Image
      src="/logo.svg"
      alt="PharmaFlow"
      width={size}
      height={size}
      style={{
        borderRadius: size * 0.25,
      }}
      priority
    />
  )

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        style={{ cursor: 'pointer' }}
      >
        {logo}
      </motion.div>
    )
  }

  return logo
}
```

Penggunaan:
```typescript
// Di Navigation
<Logo size={40} animated />

// Di Footer
<Logo size={28} />
```

---

## 📋 Checklist: Lokasi Harus di Update

Saat mengganti logo, pastikan update di:

```
Frontend:
✅ frontend/components/landing/navigation.tsx    (Line 60)
✅ frontend/components/landing/footer.tsx        (Line 42)
✅ frontend/public/logo.svg (atau .png)          (NEW FILE)

Optional:
⚪ backend (jika ada logo di email/dokumen)
⚪ .vercel/repo.json (metadata)
⚪ Favicon (jika ingin logo di browser tab)
```

---

## 🎨 Logo Specifications

### Recommended Dimensions
```
Canvas:     512×512 px (square preferred)
Safe area:  Safe 50% of canvas (200×200 px)
Format:     SVG preferred, PNG accepted

For navbar:     40×40 px ✓
For footer:     28×28 px ✓
For favicon:    32×32 px (optional)
```

### Design Guidelines
```
Keep it simple:
✅ Recognizable at small sizes
✅ Works in single color (if needed)
✅ Doesn't have too many details
✅ Maintains brand identity

Color palette:
✅ Primary: #059669 (Emerald)
✅ Accent: #0d9488 (Teal)
✅ Should work on both light & dark backgrounds
```

---

## 📁 Folder Structure

Setelah mengganti logo, struktur akan menjadi:

```
frontend/
├── public/
│   ├── logo.svg          ← Logo utama (NEW)
│   ├── file.svg          (existing)
│   ├── globe.svg         (existing)
│   ├── next.svg          (existing)
│   ├── vercel.svg        (existing)
│   └── window.svg        (existing)
│
├── components/
│   └── landing/
│       ├── navigation.tsx (UPDATED)
│       └── footer.tsx     (UPDATED)
│
└── ... (other files)
```

---

## 🎯 Step-by-Step Instructions

### Paling Mudah (SVG Method)

```
1. Buat/design logo di Figma/Illustrator/Adobe XD
   └─ Export sebagai SVG
   
2. Copy file ke: frontend/public/logo.svg

3. Buka: frontend/components/landing/navigation.tsx
   └─ Hapus Pill icon
   └─ Ganti dengan Image component
   └─ Set src="/logo.svg"
   
4. Buka: frontend/components/landing/footer.tsx
   └─ Lakukan hal sama seperti navigation
   
5. Test: npm run dev
   └─ Lihat logo muncul di navbar dan footer
```

---

## ✅ Verification Checklist

Setelah mengganti logo, pastikan:

- [ ] Logo muncul di navigation bar (top-left)
- [ ] Logo muncul di footer (center)
- [ ] Logo tidak distorted/blur di ukuran apapun
- [ ] Logo responsive (desktop, tablet, mobile)
- [ ] Logo terlihat jelas (tidak terlalu kecil)
- [ ] Build tidak ada error: `npm run build`
- [ ] Tidak ada console warning

---

## 🐛 Troubleshooting

### Logo tidak muncul
```
1. Cek file path: frontend/public/logo.svg
2. Cek file name case-sensitive (Linux)
3. Clear Next.js cache: rm -rf .next
4. Restart dev server: npm run dev
```

### Logo blur/pixelated
```
1. Gunakan SVG format (tidak akan blur)
2. Jika PNG, pastikan ukuran >= 512×512 px
3. Cek browser zoom level (harus 100%)
```

### Logo terlalu besar/kecil
```
Adjust width/height props:
- Navigation: width={40} height={40}
- Footer: width={28} height={28}
- Adjust sesuai kebutuhan
```

### Build error setelah ganti logo
```
1. Check file format (SVG/PNG harus valid)
2. Check file permissions
3. Clear cache: rm -rf .next node_modules
4. Reinstall: npm install
5. Rebuild: npm run build
```

---

## 🎨 Logo Naming Convention

Disarankan untuk:
```
✅ logo.svg            (primary)
✅ logo-dark.svg       (untuk dark mode, optional)
✅ logo-white.svg      (for dark backgrounds, optional)
✅ favicon.ico         (for browser tab)

Hindari:
❌ LogoNew.svg
❌ logo (1).svg
❌ pharmaflow logo.svg (spasi)
```

---

## 📚 File References

Setelah perubahan, file yang berubah:

```
Modified:
  frontend/components/landing/navigation.tsx
  frontend/components/landing/footer.tsx

Added:
  frontend/public/logo.svg (atau .png)

Unchanged:
  frontend/components/landing/hero-section.tsx
  frontend/components/landing/features-section.tsx
  frontend/app/page.tsx
  (dan semua file lain)
```

---

## 🚀 Tips Optimization

### 1. Optimize SVG Size
```
Gunakan tool online: SVGO
- Hapus metadata yang tidak perlu
- Compress paths
- Reduce file size
```

### 2. Use Next.js Image Optimization
```typescript
<Image
  src="/logo.svg"
  width={40}
  height={40}
  priority        // ← Load immediately
  alt="Logo"
/>
```

### 3. Set Favicon (Optional)
```
1. Buat favicon 32×32 px
2. Letakkan di: frontend/public/favicon.ico
3. Browser otomatis akan menggunakannya
```

---

## 📞 Quick Reference

### Location of Logo Usage
| Location | File | Line | Size |
|----------|------|------|------|
| Navbar | navigation.tsx | 60 | 40×40 |
| Footer | footer.tsx | 42 | 28×28 |

### Place to Put Logo File
| Type | Location | Extension |
|------|----------|-----------|
| Vector | frontend/public/ | .svg |
| Raster | frontend/public/ | .png |
| Icon | frontend/public/ | .ico |

### Update Required
| File | Update |
|------|--------|
| navigation.tsx | Replace Pill with Image |
| footer.tsx | Replace Pill with Image |

---

## 🎉 Done!

After following these steps:
- ✅ Logo akan muncul di navbar dan footer
- ✅ Logo akan scale dengan sempurna
- ✅ Logo responsive di semua device
- ✅ Professional appearance maintained

---

**Ready to replace your logo?** Start with the recommended SVG method above! 🎨
