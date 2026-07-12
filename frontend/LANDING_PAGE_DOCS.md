# Landing Page Documentation

## 📋 Overview

Landing page PharmaFlow telah diupgrade dengan:
- ✅ **Framer Motion Animations** - Smooth transitions dan interactive elements
- ✅ **Inter Tight Font** - Modern typography via Google Fonts
- ✅ **Infinite Marquee** - Endless scrolling tech stack showcase
- ✅ **Component-based Architecture** - Modular dan maintainable

## 🏗️ Struktur File

```
frontend/
├── app/
│   ├── page.tsx                    # Landing page main (composer)
│   ├── globals.css                 # Design system & styles
│   └── layout.tsx                  # Root layout dengan Inter Tight font
└── components/
    ├── infinite-marquee.tsx        # Infinite scroll component
    └── landing/
        ├── navigation.tsx          # Fixed navbar dengan animations
        ├── hero-section.tsx        # Hero dengan animated backgrounds
        ├── features-section.tsx    # Feature cards dengan hover effects
        ├── tech-marquee-section.tsx # Marquee section untuk tech stack
        ├── roles-section.tsx       # RBAC roles showcase
        ├── cta-section.tsx         # Call-to-action section
        └── footer.tsx              # Footer dengan branding
```

## 🎨 Features & Animations

### 1. **Navigation Bar** (`navigation.tsx`)
```typescript
- Fixed positioning dengan glassmorphism effect
- Auto blur/scroll detection
- Logo with hover scale animation
- Links dengan color transition
- Login button dengan scale animation
```

### 2. **Hero Section** (`hero-section.tsx`)
```typescript
- Animated background circles (float effect)
- Staggered text animation on load
- Badge dengan Activity icon
- Stats cards dengan hover scale
- CTA buttons dengan spring animation
```

### 3. **Features Section** (`features-section.tsx`)
```typescript
- Staggered grid animation
- Card lift effect on hover
- Icon scale animation
- Scroll-triggered animations (whileInView)
```

### 4. **Tech Marquee Section** (`tech-marquee-section.tsx`)
```typescript
- Infinite scrolling tech stack
- Pause on hover functionality
- Card hover lift effect
- Emoji icons untuk visual appeal
```

### 5. **Roles Section** (`roles-section.tsx`)
```typescript
- 3 role cards dengan animations
- Icon rotation on hover
- Access badges dengan staggered animation
- Scroll-triggered effects
```

### 6. **CTA Section** (`cta-section.tsx`)
```typescript
- Floating icon animation
- Large heading dengan serif font
- Primary CTA button dengan interaction
- Gradient background
```

### 7. **Footer** (`footer.tsx`)
```typescript
- Logo hover animation
- Scroll-triggered fade-in
- Minimal dark theme
```

## 🚀 Framer Motion Animations Used

### Common Patterns:

```typescript
// Staggered Container Animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// Item Animation
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

// Hover Animations
whileHover={{ scale: 1.05, y: -8 }}
whileTap={{ scale: 0.95 }}

// Scroll-triggered
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}

// Floating Animation
animate={{ y: [0, -10, 0] }}
transition={{ duration: 3, repeat: Infinity }}
```

## 🎯 Typography

**Font**: Inter Tight (via `layout.tsx`)
```typescript
import { Inter_Tight } from 'next/font/google'

const interTight = Inter_Tight({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})
```

**Usage**: 
```typescript
style={{ fontFamily: 'var(--font-sans)' }}
// atau di CSS
font-family: var(--font-sans);
```

## 📦 Infinite Marquee Component

### Props:
```typescript
interface InfiniteMarqueeProps {
  items: React.ReactNode[]              // Array of items to scroll
  speed?: number                         // Duration in seconds (default: 80)
  pauseOnHover?: boolean                 // Pause on hover (default: true)
  direction?: 'left' | 'right'          // Scroll direction (default: 'left')
}
```

### Usage:
```typescript
<InfiniteMarquee 
  items={marqueeItems} 
  speed={80}           // Slower, smoother scrolling
  pauseOnHover={true}
/>
```

### How It Works:
The marquee implements **truly infinite looping** with:
1. **4x Item Duplication** - Internally multiplies items for seamless cycling
2. **Linear Motion** - Constant speed animation for hypnotic effect
3. **Smart Looping** - Scrolls one set distance then loops back invisibly
4. **Pause on Hover** - Smooth pause/resume on interaction
5. **GPU Acceleration** - Transform-based for 60fps performance

### Features:
- ✅ **Truly Infinite Loop** - No visible jump or reset
- ✅ **Smooth Linear Animation** - Consistent, hypnotic motion
- ✅ **Pause on Hover** - Interactive pause/resume
- ✅ **Responsive** - Works on all screen sizes
- ✅ **Customizable Speed** - Adjust pacing (60-120s recommended)
- ✅ **Bidirectional** - Support for left/right scrolling

### Speed Guide:
```
speed={60}   → Fast, energetic
speed={80}   → Default, balanced (recommended)
speed={100}  → Slow, relaxed
speed={120}  → Very slow, leisurely
```

### Real-World Example:
```typescript
// Tech stack showcase (default)
<InfiniteMarquee 
  items={[
    <TechItem key="1">Next.js</TechItem>,
    <TechItem key="2">Hono</TechItem>,
    // ... 8 total items
  ]}
  speed={80}
/>

// Result: Items scroll left infinitely for ~80 seconds per cycle
// When it loops, user sees the SAME items (no visible jump!)
```

## 🔧 Performance Considerations

1. **Animations**: Menggunakan `transform` dan `opacity` untuk GPU acceleration
2. **Viewport**: `whileInView` dengan `once: true` untuk prevent re-trigger
3. **Motion**: Smooth easing curves dengan `ease: 'easeOut'` & `ease: 'linear'`
4. **Marquee**: Efficient 3x item duplication untuk seamless loop

## 🎬 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (dengan `-webkit-` prefix untuk backdrop-filter)
- Mobile: ✅ Optimized dengan viewport considerations

## 🔄 Auth Integration

Landing page automatically redirects authenticated users:
```typescript
useEffect(() => {
  if (user) {
    router.replace('/dashboard')
  }
}, [user, router])
```

## 📱 Responsive Design

- Hero: `clamp()` untuk fluid typography
- Grid: `repeat(auto-fit, minmax(...))` untuk responsive columns
- Mobile: Flex wrap pada buttons dan navigation
- Marquee: Horizontal scroll-friendly pada small screens

## 🎨 Color System

**Primary Gradient**: `#059669` → `#0d9488` (Emerald/Teal)
**Background**: `#f0fdf4` (Light green tint)
**Text Primary**: `#0f172a` (Dark slate)
**Text Secondary**: `#475569` (Medium slate)

See `frontend/app/globals.css` untuk CSS variables lengkap.

## 🚀 Deployment

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Siap untuk Vercel deployment dengan zero config!

## 📝 Notes

- Semua animations smooth dan tidak blocking
- Font loading optimized via Google Fonts API
- Marquee component fully accessible dengan keyboard navigation disabled
- Z-index management untuk navigation dan overlays

---

**Last Updated**: July 2026
**Version**: 1.0.0
