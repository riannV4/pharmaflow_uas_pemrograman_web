# 🗺️ Landing Page Component Map

## Component Hierarchy

```
app/page.tsx (Landing Page Main)
│
├── <Navigation />
│   ├── Logo + Brand
│   ├── Navigation Links (#features, #roles)
│   ├── Login Button
│   └── Scroll Detection (blur effect)
│
├── <HeroSection />
│   ├── Animated Background Circles
│   │   ├── Circle 1 (float animation)
│   │   └── Circle 2 (float animation)
│   ├── Badge (Activity icon + text)
│   ├── Main Heading (staggered)
│   ├── Subtitle (staggered)
│   ├── CTA Buttons
│   │   ├── "Mulai Sekarang" (white)
│   │   └── "Pelajari Fitur" (transparent)
│   └── Stats Grid (3 columns, hover scale)
│       ├── <100ms Pencarian
│       ├── <1.5s Transaksi
│       └── 100% Akurasi
│
├── <FeaturesSection />
│   └── Feature Cards Grid (auto-fit)
│       ├── 🛒 POS Cepat & Akurat
│       ├── 🗂️ Multi-Batch Tracking
│       ├── 📦 Manajemen Inventaris
│       ├── 📊 Dashboard Analitik
│       ├── ⚠️ Expired Date Alert
│       └── 🛡️ Keamanan Terjamin
│
├── <TechMarqueeSection />
│   └── <InfiniteMarquee items={marqueeItems} />
│       ├── ⚛️ Next.js
│       ├── 🔥 Hono
│       ├── 🗄️ Neon DB
│       ├── 🔐 JWT
│       ├── 🛡️ Bcrypt
│       ├── ▲ Vercel
│       ├── 🎨 Tailwind
│       └── 📘 TypeScript
│
├── <RolesSection />
│   └── Role Cards Grid (3 columns)
│       ├── 🛡️ Admin
│       │   ├── Manajemen User
│       │   ├── Laporan Keuangan
│       │   ├── Audit Stok
│       │   └── Dashboard Analitik
│       ├── 💊 Apoteker
│       │   ├── Master Data Obat
│       │   ├── Kategori Produk
│       │   ├── Batch Tracking
│       │   └── Log Mutasi Stok
│       └── 🧾 Kasir
│           ├── POS Interface
│           ├── Cetak Invoice
│           ├── Pembayaran
│           └── Riwayat Transaksi
│
├── <CTASection />
│   ├── Floating Icon (animation loop)
│   ├── Main Heading
│   ├── Subtitle
│   └── Primary CTA Button
│
└── <Footer />
    ├── Logo + Brand
    ├── Copyright
    └── Tech Stack Attribution

```

---

## Animation Flow Diagram

```
┌─────────────────────────────────────┐
│  USER LOADS PAGE                    │
└────────────┬────────────────────────┘
             │
             ▼
      PAGE LOAD EVENT
             │
     ┌───────┴───────┐
     │               │
     ▼               ▼
[Hero Anim]    [Background Circles]
  Staggered        Float Motion
  Fade-in          (8-10s loop)
     │               │
     └───────┬───────┘
             │
             ▼
      USER SCROLLS PAGE
             │
     ┌───────┴──────────┐
     │                  │
     ▼                  ▼
[Nav Blur]        [Scroll Triggers]
Effect Applied    Feature Cards Animate
                  Role Cards Animate
                  CTA Floats
             │
             ▼
      USER HOVERS
             │
     ┌─────────┬───────────┬─────────┐
     │         │           │         │
     ▼         ▼           ▼         ▼
   Card      Icon        Button    Marquee
   Lifts     Scales      Springs   Slows
   Up        1.1x        Tap       Down
```

---

## Data Flow (Tech Marquee)

```
MARQUEE_ITEMS Array (8 items)
         │
         ▼
  InfiniteMarquee Component
         │
     ┌───┴────────┐
     │            │
     ▼            ▼
[Duplicate x3]  [Motion Animation]
(seamless loop)  (linear ease)
     │            │
     └───┬────────┘
         │
         ▼
   [Container div]
   overflow: hidden
         │
         ▼
   [Motion.div]
   x: -300%
   repeat: ∞
         │
   ┌─────┴─────┐
   │           │
   ▼           ▼
[Hover]    [Normal]
speed      speed
x1.5       x1
```

---

## Responsive Breakpoints

```
Mobile (<640px)
└── Stack everything vertically
    └── 1 column grids
    └── Smaller font sizes
    └── Marquee horizontal scroll

Tablet (640px - 1024px)
└── 2-3 column grids
    └── Stacked CTAs
    └── Full-width sections

Desktop (>1024px)
└── Full layout
    └── Side-by-side elements
    └── Max-width containers (1200px)
    └── All animations active
```

---

## Animation Timing

```
Hero Section Stagger Timeline:
├── 0.0s: Badge fades in
├── 0.2s: Heading fades in
├── 0.4s: Subtitle fades in
├── 0.6s: CTA buttons fade in
└── 0.8s: Stats grid fades in
    Duration: 0.6s each
    Delay between: 0.2s

Feature Cards On Scroll:
├── Delay: 0.2s (start after view)
├── Stagger: 0.1s between cards
├── Individual animation: 0.6s
└── Total for 6 cards: ~0.7s

Marquee Animation:
├── Duration: 40s (configurable)
├── Ease: linear
├── Repeat: Infinity
├── On hover: 1.5x slower (60s)
```

---

## Color System & Variants

```
Primary Gradient:
├── Start: #059669 (Emerald-600)
├── Mid:   #0d9488 (Teal-600)
└── End:   #064e3b (Emerald-900)

Text Colors:
├── Primary:   #0f172a (Slate-900)
├── Secondary: #475569 (Slate-600)
├── Tertiary:  #94a3b8 (Slate-400)
└── Inverted:  White (on dark bg)

Backgrounds:
├── Main:      #f0fdf4 (Emerald-50)
├── Card:      #ffffff (White)
├── Hover:     #ecfdf5 (Emerald-100)
└── Dark:      #020617 (Slate-950)

Semantic:
├── Success:   #22c55e (Green-500)
├── Warning:   #f59e0b (Amber-500)
├── Danger:    #ef4444 (Red-500)
└── Info:      #3b82f6 (Blue-500)
```

---

## Font Hierarchy

```
Inter Tight (all weights: 300-800)

Largest (4rem clamp):
└── Hero Main Heading

Large (2rem):
├── Section Headings
└── Role Names

Medium (1.25rem):
├── Feature Titles
└── Card Titles

Regular (1rem):
├── Body text
├── CTA buttons
└── Navigation

Small (0.85-0.9rem):
├── Subtitles
├── Descriptions
└── Labels

Extra Small (0.75-0.78rem):
├── Badges
└── Meta text
```

---

## Performance Optimization

```
GPU Accelerated Transforms:
├── transform: translateX() ✅
├── transform: scale()      ✅
├── transform: rotate()     ✅
└── opacity                 ✅

Avoid Heavy Operations:
├── ❌ width changes
├── ❌ height changes
├── ❌ margin/padding changes
└── ✅ Only use transform + opacity

Marquee Efficiency:
├── Items duplicated 3x
├── Smooth infinite loop
├── Linear ease (no easing)
└── Pause smoothly on hover

Scroll Triggers:
├── viewport={{ once: true }}
└── Prevent re-animation
```

---

## Dependencies

```
Required:
├── framer-motion      // Animations
├── lucide-react       // Icons
├── next              // Framework
├── react             // UI Library
└── next/font/google  // Inter Tight

CSS (No extra libs):
├── globals.css       // Design system
└── Tailwind (existing)
```

---

## File Imports Map

```
app/page.tsx
│
├── import useAuth from '@/lib/auth-context'
├── import { Navigation } from '@/components/landing/navigation'
├── import { HeroSection } from '@/components/landing/hero-section'
├── import { FeaturesSection } from '@/components/landing/features-section'
├── import { TechMarqueeSection } from '@/components/landing/tech-marquee-section'
├── import { RolesSection } from '@/components/landing/roles-section'
├── import { CTASection } from '@/components/landing/cta-section'
└── import { Footer } from '@/components/landing/footer'

tech-marquee-section.tsx
│
├── import { InfiniteMarquee } from '@/components/infinite-marquee'
└── import { motion } from 'framer-motion'

All Components
│
├── import { motion } from 'framer-motion'
├── import Link from 'next/link'
├── import { [Icons] } from 'lucide-react'
└── Optional: import { useState, useEffect } from 'react'
```

---

## Usage Examples

### Import & Use Components:
```typescript
import { Navigation } from '@/components/landing/navigation'
import { HeroSection } from '@/components/landing/hero-section'

export default function LandingPage() {
  return (
    <>
      <Navigation />
      <HeroSection />
    </>
  )
}
```

### Use InfiniteMarquee:
```typescript
import { InfiniteMarquee } from '@/components/infinite-marquee'

const items = [
  <div key={1}>Item 1</div>,
  <div key={2}>Item 2</div>,
  // ... more items
]

<InfiniteMarquee items={items} speed={40} pauseOnHover />
```

### Use Framer Motion:
```typescript
import { motion } from 'framer-motion'

<motion.div
  animate={{ opacity: 1 }}
  initial={{ opacity: 0 }}
  whileHover={{ scale: 1.05 }}
>
  Content
</motion.div>
```

---

**Component Map Version**: 1.0.0
**Last Updated**: July 12, 2026
**Status**: ✅ Complete & Ready
