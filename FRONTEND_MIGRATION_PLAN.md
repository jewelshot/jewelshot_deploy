# 🔄 FRONTEND MIGRATION PLAN - Queue System Integration

**Status:** In Progress  
**Affected Files:** 11 hooks using deleted endpoints  
**Strategy:** Wrapper pattern (minimal breaking changes)  

---

## 🚨 BROKEN HOOKS (Using Deleted Endpoints)

| Hook | Old Endpoint | Status | LOC |
|------|--------------|--------|-----|
| `useCameraControl` | `/api/ai/camera-control` | ❌ 404 | 112 |
| `useGemstoneEnhance` | `/api/ai/gemstone-enhance` | ❌ 404 | 119 |
| `useImageToVideo` | `/api/ai/video` | ❌ 404 | ~120 |
| `useImageUpscale` | `/api/ai/upscale` | ❌ 404 | 135 |
| `useMetalPolish` | `/api/ai/metal-polish` | ❌ 404 | ~115 |
| `useMetalRecolor` | `/api/ai/metal-recolor` | ❌ 404 | ~115 |
| `useNaturalLight` | `/api/ai/natural-light` | ❌ 404 | ~115 |
| `useRemoveBackground` | `/api/ai/remove-background` | ❌ 404 | ~110 |
| `useTurntableVideo` | `/api/ai/turntable-video` | ❌ 404 | ~120 |
| `useImageEdit` (probably) | `/api/ai/edit` | ❌ 404 | ~150 |
| `useTextToImage` (probably) | `/api/ai/generate` | ❌ 404 | ~140 |

**Total:** 11 hooks, ~1,361 LOC

---

## ✅ MIGRATION STRATEGY: WRAPPER PATTERN

**Why Wrapper?**
- ✅ Minimal breaking changes
- ✅ Keep existing hook API
- ✅ Components don't need updates
- ✅ Easy to test incrementally

**How?**
Replace internal `fetch()` calls with `useAIQueue` hook.

**Example:**

### BEFORE (BROKEN):
```typescript
// useImageUpscale.ts
const response = await fetch('/api/ai/upscale', {
  method: 'POST',
  body: JSON.stringify({ image_url }),
});
```

### AFTER (QUEUE-BASED):
```typescript
// useImageUpscale.ts
import { useAIQueue } from './useAIQueue';

const { submitAndWait } = useAIQueue();
const result = await submitAndWait({
  operation: 'upscale',
  params: { image_url },
  priority: 'urgent',
});
```

---

## 📋 MIGRATION CHECKLIST

### **Step 1: Migrate High-Priority Hooks** (30 min)

Hooks used most frequently in UI:

- [ ] `useCameraControl` (rotate, closeup buttons)
- [ ] `useImageUpscale` (upscale button)
- [ ] `useMetalRecolor` (quick actions)
- [ ] `useMetalPolish` (quick actions)
- [ ] `useNaturalLight` (quick actions)

### **Step 2: Migrate Medium-Priority Hooks** (30 min)

- [ ] `useGemstoneEnhance`
- [ ] `useRemoveBackground`

### **Step 3: Migrate Video Hooks** (20 min)

- [ ] `useImageToVideo`
- [ ] `useTurntableVideo`

### **Step 4: Migrate Core Hooks** (40 min)

These might be more complex:

- [ ] `useImageEdit` (if exists)
- [ ] `useTextToImage` (if exists)

---

## 🔧 MIGRATION TEMPLATE

```typescript
/**
 * use[Feature] Hook - MIGRATED TO QUEUE SYSTEM
 *
 * [Description]
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';
import { useAIQueue } from './useAIQueue'; // NEW IMPORT

const logger = createScopedLogger('use[Feature]');

export function use[Feature]() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // NEW: Use queue hook
  const { submitAndWait } = useAIQueue();

  const process = useCallback(async (input: InputType) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      logger.info('Starting [feature]', input);

      // OLD: fetch('/api/ai/[endpoint]', ...)
      // NEW: Use queue system
      const result = await submitAndWait({
        operation: '[operation]', // e.g., 'upscale'
        params: {
          // Map input to FAL.AI params
          image_url: input.image_url,
          // ... other params
        },
        priority: 'urgent', // or 'normal'
      }, {
        onProgress: (status) => {
          // Optional: update UI with progress
          logger.info('Progress:', status.state);
        },
      });

      if (result?.data?.imageUrl) {
        setResult(result.data.imageUrl);
        logger.info('[Feature] completed successfully');
      } else {
        throw new Error('No image returned');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('[Feature] failed:', err);
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [submitAndWait]);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setResult(null);
    setError(null);
  }, []);

  return {
    process,
    isProcessing,
    result,
    error,
    reset,
  };
}
```

---

## 🎯 OPERATION MAPPING

Map old endpoints to new queue operations:

| Old Endpoint | New Operation | Priority | Cost |
|--------------|---------------|----------|------|
| `/api/ai/edit` | `'edit'` | `'urgent'` | 1 |
| `/api/ai/generate` | `'generate'` | `'urgent'` | 2 |
| `/api/ai/upscale` | `'upscale'` | `'urgent'` | 1 |
| `/api/ai/remove-background` | `'remove-bg'` | `'urgent'` | 1 |
| `/api/ai/camera-control` | `'camera-control'` | `'urgent'` | 2 |
| `/api/ai/gemstone-enhance` | `'gemstone'` | `'urgent'` | 2 |
| `/api/ai/metal-recolor` | `'metal-recolor'` | `'urgent'` | 2 |
| `/api/ai/metal-polish` | `'metal-polish'` | `'urgent'` | 2 |
| `/api/ai/natural-light` | `'natural-light'` | `'urgent'` | 2 |
| `/api/ai/video` | `'video'` | `'normal'` | 5 |
| `/api/ai/turntable-video` | `'turntable'` | `'normal'` | 5 |

---

## 🧪 TESTING STRATEGY

### **Per-Hook Testing:**
```typescript
// Test each migrated hook
1. Open component using hook
2. Trigger action (e.g., click upscale)
3. Verify:
   - ✅ Job submitted to queue
   - ✅ Credit reserved
   - ✅ Progress updates (if implemented)
   - ✅ Result returned
   - ✅ Credit confirmed/refunded
   - ✅ UI updates correctly
```

### **Integration Testing:**
```bash
# Test full flow
1. User clicks "Upscale"
2. Check Network tab → POST /api/ai/submit
3. Check Response → jobId returned
4. Check Polling → GET /api/ai/status/[jobId]
5. Check Credits → GET /api/credits/balance (decreased)
6. Verify result displayed
```

---

## ⚠️ KNOWN ISSUES & SOLUTIONS

### Issue 1: Different Response Formats
**Problem:** Old endpoints returned `{ success, image: { url } }`  
**Solution:** Queue returns `{ data: { imageUrl } }` - map in hook

### Issue 2: Progress Updates
**Problem:** Old endpoints had no progress  
**Solution:** Use `onProgress` callback from `submitAndWait`

### Issue 3: Credit Deduction
**Problem:** Old endpoints didn't deduct credits  
**Solution:** ✅ Queue automatically handles reserve/confirm/refund

---

## 📊 ESTIMATED TIME

| Task | Time | Status |
|------|------|--------|
| Migrate 5 high-priority hooks | 30 min | ⏳ Pending |
| Migrate 2 medium-priority hooks | 30 min | ⏳ Pending |
| Migrate 2 video hooks | 20 min | ⏳ Pending |
| Migrate 2 core hooks | 40 min | ⏳ Pending |
| Testing all hooks | 30 min | ⏳ Pending |
| Bug fixes | 20 min | ⏳ Pending |

**TOTAL:** ~2.5 hours

---

## 🚀 READY TO START?

**Next command:** Migrate first hook (`useCameraControl`)

