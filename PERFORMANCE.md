# ⚡ Performance Optimization Guide

## Current Optimizations

### ✅ Implemented

1. **Bundle Analyzer** - Identify large dependencies
2. **Code Splitting** - Dynamic imports for heavy components
3. **Package Optimization** - Tree-shaking for lucide-react, supabase, zustand
4. **Image Optimization** - AVIF/WebP formats, responsive sizes
5. **SWC Minification** - Faster builds, smaller bundles
6. **Console Removal** - Production builds remove console.log
7. **Security Headers** - CSP, HSTS, X-Frame-Options

---

## 📊 Bundle Analysis

### Run Bundle Analyzer

```bash
npm run analyze
```

Opens interactive bundle visualization in browser.

### Key Metrics to Watch

- **First Load JS** - Should be < 200KB (gzipped)
- **Total Size** - All routes combined
- **Shared Chunks** - Common code across pages

---

## 🎯 Optimization Checklist

### Level 1: Quick Wins (Already Done)

- [x] Enable SWC minification
- [x] Remove console.log in production
- [x] Optimize package imports
- [x] Image formats (AVIF/WebP)
- [x] Security headers with caching

### Level 2: Code Splitting

- [x] Dynamic imports for heavy components
- [ ] Route-based code splitting
- [ ] Lazy load below-the-fold components
- [ ] Split vendor bundles

### Level 3: Advanced

- [ ] Implement service worker for offline support
- [ ] Add request deduplication
- [ ] Implement stale-while-revalidate caching
- [ ] Optimize third-party scripts
- [ ] Add resource hints (preload, prefetch, preconnect)

---

## 🚀 Performance Best Practices

### 1. Component Lazy Loading

```tsx
// ❌ Bad: Import everything upfront
import { HeavyComponent } from '@/components/HeavyComponent';

// ✅ Good: Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <Skeleton />, ssr: false }
);
```

### 2. Image Optimization

```tsx
// ❌ Bad: Regular img tag
<img src="/large-image.jpg" />

// ✅ Good: Next.js Image component
import Image from 'next/image';

<Image
  src="/large-image.jpg"
  width={800}
  height={600}
  alt="Description"
  loading="lazy"
  placeholder="blur"
/>
```

### 3. Icon Optimization

```tsx
// ❌ Bad: Import all icons
import * as Icons from 'lucide-react';

// ✅ Good: Import only what you need
import { Search, X, Plus } from 'lucide-react';
```

### 4. Font Optimization

```tsx
// ✅ Already optimized with next/font
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
```

---

## 📈 Monitoring Performance

### Core Web Vitals

| Metric | Target | Critical |
|--------|--------|----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 4.0s |
| **FID** (First Input Delay) | < 100ms | < 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.25 |
| **TTFB** (Time to First Byte) | < 600ms | < 1.8s |
| **FCP** (First Contentful Paint) | < 1.8s | < 3.0s |

### Tools

- **Lighthouse** (Chrome DevTools)
- **WebPageTest** - https://webpagetest.org
- **PageSpeed Insights** - https://pagespeed.web.dev
- **Vercel Analytics** (Built-in)

---

## 🔍 Debugging Slow Performance

### 1. Identify Bottlenecks

```bash
# Run bundle analyzer
npm run analyze

# Check for large dependencies
du -sh node_modules/* | sort -rh | head -10

# Profile React rendering
# Use React DevTools Profiler in browser
```

### 2. Common Causes

**Large Bundle Size:**
- Heavy dependencies (moment.js → use date-fns)
- Unused code not tree-shaken
- Duplicate dependencies

**Slow Initial Load:**
- No code splitting
- Large images not optimized
- Blocking scripts

**Poor Runtime Performance:**
- Unnecessary re-renders
- Memory leaks
- Inefficient algorithms

---

## 🎛️ Advanced Optimizations

### 1. Reduce JavaScript Bundle

```typescript
// next.config.ts
export default {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@supabase/supabase-js',
      'zustand',
      // Add more packages
    ],
  },
};
```

### 2. Optimize Images

```typescript
// next.config.ts
export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};
```

### 3. Caching Strategy

```typescript
// Set cache headers
export async function headers() {
  return [
    {
      source: '/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

### 4. Database Query Optimization

```typescript
// ❌ Bad: N+1 queries
for (const user of users) {
  const credits = await getCredits(user.id);
}

// ✅ Good: Batch query
const userIds = users.map(u => u.id);
const credits = await getCreditsForUsers(userIds);
```

---

## 📦 Dependency Optimization

### Check Unused Dependencies

```bash
npx depcheck
```

### Replace Heavy Dependencies

| Heavy | Lighter Alternative |
|-------|-------------------|
| `moment.js` (290KB) | `date-fns` (78KB) or `dayjs` (7KB) |
| `lodash` (full) | `lodash-es` (tree-shakeable) |
| `axios` | `fetch` (native) |
| `uuid` | `crypto.randomUUID()` (native) |

---

## 🧪 Performance Testing

### Local Testing

```bash
# Production build
npm run build

# Start production server
npm start

# Run Lighthouse
npx lighthouse http://localhost:3000 --view
```

### Continuous Monitoring

```bash
# Add to CI/CD
npm install --save-dev @lhci/cli

# lighthouse.config.js
npx lhci autorun
```

---

## 🎯 Performance Budget

| Asset Type | Budget | Current |
|------------|--------|---------|
| **Total JS** | < 300KB | TBD |
| **Total CSS** | < 100KB | TBD |
| **Total Images** | < 500KB/page | TBD |
| **Total Fonts** | < 100KB | TBD |

Run `npm run analyze` and update "Current" column.

---

## 📚 Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Bundle Phobia](https://bundlephobia.com/) - Check package sizes
- [Import Cost VSCode Extension](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

---

**Last updated:** 2024-01-28

