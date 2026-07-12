# PharmaFlow Frontend - Development Guide

## Quick Start

### First Time Setup
```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

---

## Project Structure

```
frontend/
├── app/                           # Next.js app directory
│   ├── layout.tsx                # Root layout with fonts
│   ├── page.tsx                  # Landing page (simple)
│   ├── globals.css               # Global styles & design system
│   ├── login/
│   │   └── page.tsx             # Login page with animations
│   └── dashboard/                # Protected routes
│       ├── layout.tsx           # Dashboard layout
│       ├── page.tsx             # Main dashboard
│       ├── inventory/           # Inventory management
│       ├── batches/             # Batch tracking
│       ├── categories/          # Medicine categories
│       ├── mutations/           # Stock mutations
│       ├── users/               # User management
│       └── pos/                 # Point of Sale

├── components/
│   ├── landing/                  # Landing page sections
│   │   ├── navigation.tsx       # Header with logo
│   │   ├── hero-section.tsx     # Main hero
│   │   ├── features-section.tsx # Features
│   │   ├── tech-marquee-section.tsx  # Tech stack
│   │   ├── roles-section.tsx    # User roles
│   │   ├── cta-section.tsx      # Call-to-action
│   │   └── footer.tsx           # Footer
│   ├── infinite-marquee.tsx      # Reusable marquee
│   ├── sidebar.tsx              # Dashboard sidebar
│   ├── header.tsx               # Dashboard header
│   └── ...other components

├── lib/
│   ├── api.ts                   # API utilities
│   └── auth-context.tsx         # Auth provider

├── public/
│   ├── pharmaflow_logo.svg     # Main logo
│   └── ...other assets

├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## Design System

### Typography
- **Font**: Inter Tight (Google Fonts)
- **Sizes**: Responsive with `clamp()`
- **Weights**: 300 (light) to 800 (black)

**Usage**:
```tsx
<h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '2.5rem' }}>
  Heading
</h1>
```

### Colors
Located in `app/globals.css` as CSS variables:

```css
:root {
  --primary: #059669         /* Emerald */
  --primary-light: #34d399   /* Light emerald */
  --accent: #0d9488          /* Teal */
  --success: #22c55e         /* Green */
  --warning: #f59e0b         /* Amber */
  --danger: #ef4444          /* Red */
}
```

**Usage**:
```tsx
<div style={{ color: 'var(--primary)' }}>
  Text in emerald
</div>
```

### Spacing Scale
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)

### Radius
- `--radius-sm`: 6px
- `--radius-md`: 10px
- `--radius-lg`: 14px
- `--radius-xl`: 20px

### Shadows
- `--shadow-sm`: Light
- `--shadow-md`: Medium
- `--shadow-lg`: Large
- `--shadow-xl`: Extra large

---

## Animations with Framer Motion

### Basic Pattern
```tsx
'use client'

import { motion } from 'framer-motion'

export function MyComponent() {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      Content
    </motion.div>
  )
}
```

### Important: TypeScript Fix
Always use `as const` with ease values:
```tsx
// ✅ Correct
ease: 'easeOut' as const

// ❌ Wrong
ease: 'easeOut'
```

### Common Animations
1. **Fade In**
   ```tsx
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   ```

2. **Slide In**
   ```tsx
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   ```

3. **Scale**
   ```tsx
   initial={{ scale: 0.95 }}
   animate={{ scale: 1 }}
   ```

4. **Stagger Children**
   ```tsx
   const containerVariants = {
     hidden: { opacity: 0 },
     visible: {
       opacity: 1,
       transition: { staggerChildren: 0.1 },
     },
   }
   ```

5. **Hover Effects**
   ```tsx
   <motion.button
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
   >
     Click me
   </motion.button>
   ```

---

## CSS Guidelines

### ✅ DO: Use Valid CSS Properties
```tsx
<div style={{ padding: '2rem 0' }}>
  Valid CSS
</div>
```

### ❌ DON'T: Use Framework Shorthands
```tsx
// Don't do this in React inline styles:
<div style={{ paddingY: '2rem' }}>  // ❌ Not valid
  Framework shorthand
</div>

// Don't do this:
<div style={{ marginX: '1rem' }}>   // ❌ Not valid
  Framework shorthand
</div>
```

### CSS Property Mapping
| Framework | React Style |
|-----------|------------|
| `paddingY` | `padding: 'Y 0'` |
| `paddingX` | `padding: '0 X'` |
| `marginY` | `margin: 'Y 0'` |
| `marginX` | `margin: '0 X'` |

---

## Common Components

### Stat Card
```tsx
<div className="stat-card stat-card--emerald">
  <div className="stat-card__icon stat-card__icon--emerald">
    <TrendingUp size={20} />
  </div>
  <div className="stat-card__info">
    <div className="stat-card__label">Total Sales</div>
    <div className="stat-card__value">Rp 12.5M</div>
    <div className="stat-card__change">+12% from last month</div>
  </div>
</div>
```

### Button
```tsx
<button className="btn btn--primary">
  <Plus size={16} />
  Add New
</button>
```

### Badge
```tsx
<span className="badge badge--emerald">Active</span>
```

### Form Input
```tsx
<div className="form-group">
  <label>Email</label>
  <input type="email" className="form-input" />
</div>
```

---

## Adding New Pages

### 1. Create Page File
```bash
mkdir -p app/dashboard/new-feature
touch app/dashboard/new-feature/page.tsx
```

### 2. Add Page Component
```tsx
'use client'

import { motion } from 'framer-motion'

export default function NewFeaturePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1>New Feature</h1>
    </motion.div>
  )
}
```

### 3. Update Sidebar (if needed)
Edit `components/sidebar.tsx` to add navigation link

---

## API Integration

### Using the API Client
```tsx
import { api } from '@/lib/api'

export default function MyComponent() {
  const fetchData = async () => {
    const response = await api.get('/endpoint')
    console.log(response.data)
  }

  return <button onClick={fetchData}>Fetch</button>
}
```

### API Base URL
- Development: `http://localhost:8787`
- Production: Set in `.env.local`

### Example .env.local
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
```

---

## Performance Tips

### 1. Image Optimization
```tsx
import Image from 'next/image'

<Image
  src="/pharmaflow_logo.svg"
  alt="Logo"
  width={40}
  height={40}
  priority  // For above-the-fold images
/>
```

### 2. Code Splitting
```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./heavy'), {
  loading: () => <div>Loading...</div>,
})
```

### 3. Memoization
```tsx
import { memo } from 'react'

const ExpensiveComponent = memo(function Component(props) {
  return <div>{props.data}</div>
})
```

### 4. useCallback for Event Handlers
```tsx
import { useCallback } from 'react'

export function Component() {
  const handleClick = useCallback(() => {
    // handler logic
  }, [])

  return <button onClick={handleClick}>Click</button>
}
```

---

## Debugging

### 1. Check Console
- Open DevTools (F12)
- Look for errors in Console tab
- Check Network tab for API failures

### 2. React DevTools
- Install React DevTools browser extension
- Inspect component props and state
- Profile performance

### 3. Framer Motion DevTools
- Check animations in browser DevTools
- Use `animate` property to test transitions
- Monitor performance: 60fps target

### 4. Next.js DevTools
- Fast Refresh shows errors immediately
- Check terminal for build errors
- Use Source Maps for debugging

---

## Git Workflow

### Branches
```bash
# Feature branch
git checkout -b feature/new-feature

# Bug fix branch
git checkout -b fix/bug-name

# Hotfix branch
git checkout -b hotfix/critical-issue
```

### Commit Messages
```bash
# Feature
git commit -m "feat: add new dashboard widget"

# Bug fix
git commit -m "fix: resolve marquee animation jumps"

# Documentation
git commit -m "docs: update development guide"

# Styling
git commit -m "style: update button colors"

# Performance
git commit -m "perf: optimize image loading"
```

---

## Deployment

### To Vercel
```bash
# Push to main branch (auto-deploys)
git push origin main

# Or use Vercel CLI
vercel
```

### Environment Variables
Create `.env.production` on Vercel:
- `NEXT_PUBLIC_API_BASE_URL`
- Other production secrets

---

## Troubleshooting

### Build Fails
1. Clear `.next` folder: `rm -rf .next`
2. Reinstall dependencies: `npm install`
3. Check TypeScript: `npx tsc --noEmit`

### Animations Janky
1. Check Chrome DevTools for performance
2. Ensure using GPU-accelerated properties (transform, opacity)
3. Reduce animation duration if too long
4. Check for CPU-heavy operations

### API Not Responding
1. Check backend is running: `npm run dev` (in backend folder)
2. Check `.env.local` has correct API URL
3. Check browser console for CORS errors
4. Verify authentication token is valid

### Logo Not Displaying
1. Check file exists: `ls public/pharmaflow_logo.svg`
2. Verify Image component path is correct
3. Check alt text is provided
4. Clear browser cache and reload

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Support

For issues or questions:
1. Check this guide first
2. Search GitHub issues
3. Create a new issue with clear description
4. Include error messages and steps to reproduce

---

*Last updated: July 13, 2026*
