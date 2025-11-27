# 🧹 CREDIT SYSTEM CLEANUP - EXECUTION PLAN

**Date:** November 26, 2025  
**Issue:** Duplicate credit systems causing free generations  
**Impact:** 🔴 CRITICAL - Direct money loss  

---

## 🚨 CURRENT SITUATION

### **ESKİ SİSTEM (BROKEN):**
```
API Endpoints:
├── /api/credits/use        ❌ Kullanılıyor ama eski RPC
├── /api/credits/check      ❌ Eski user_credits tablosu
├── /api/credits/add        ❌ Manuel ekleme
└── /api/credits/refund     ❌ Manuel iade

Old AI Endpoints (11):
├── /api/ai/edit                  ❌ Credit KULLANMIYOR
├── /api/ai/generate              ❌ Credit KULLANMIYOR
├── /api/ai/upscale               ❌ Credit KULLANMIYOR
├── /api/ai/remove-background     ❌ Credit KULLANMIYOR
├── /api/ai/camera-control        ❌ Credit KULLANMIYOR
├── /api/ai/gemstone-enhance      ❌ Credit KULLANMIYOR
├── /api/ai/metal-recolor         ❌ Credit KULLANMIYOR
├── /api/ai/metal-polish          ❌ Credit KULLANMIYOR
├── /api/ai/natural-light         ❌ Credit KULLANMIYOR
├── /api/ai/video                 ❌ Credit KULLANMIYOR
└── /api/ai/turntable-video       ❌ Credit KULLANMIYOR

Supabase RPC (Old):
└── use_credit(p_user_id, p_description, p_metadata)
    ↓ Kullanıyor: user_credits (old table)
    ↓ Problem: Atomic değil, refund yok
```

### **YENİ SİSTEM (READY):**
```
Credit Manager:
└── src/lib/credit-manager.ts        ✅ Hazır
    ├── reserveCredit()              ✅ Atomic
    ├── confirmCredit()              ✅ Safe
    ├── refundCredit()               ✅ Automatic
    └── getUserCredits()             ✅ Working

New Supabase RPC (Atomic):
├── reserve_credit()                 ✅ Migration'da oluşturuldu
├── confirm_credit()                 ✅ Migration'da oluşturuldu
├── refund_credit()                  ✅ Migration'da oluşturuldu
└── get_available_credits()          ✅ Migration'da oluşturuldu

New Tables:
├── user_credits (NEW)               ✅ balance, reserved, earned, spent
├── credit_transactions              ✅ reserve/confirm/refund tracking
└── operation_costs                  ✅ Cost per operation

New Queue Endpoints (Using Atomic Credits):
├── /api/ai/submit                   ✅ reserve_credit() BEFORE job
├── /api/ai/status/[jobId]           ✅ Check job state
└── /api/ai/cancel/[jobId]           ✅ refund_credit() IF cancelled

Worker (Using Atomic Credits):
└── src/workers/ai-worker.ts
    ├── On Success: confirm_credit() ✅
    └── On Failure: refund_credit()  ✅
```

---

## 🎯 EXECUTION PLAN

### **STEP 1: DELETE OLD AI ENDPOINTS (11 files)** ⏱️ 5 min

**Silinecek dosyalar:**
```bash
src/app/api/ai/
├── edit/route.ts                  ❌ DELETE
├── generate/route.ts              ❌ DELETE
├── upscale/route.ts               ❌ DELETE
├── remove-background/route.ts     ❌ DELETE
├── camera-control/route.ts        ❌ DELETE
├── gemstone-enhance/route.ts      ❌ DELETE
├── metal-recolor/route.ts         ❌ DELETE
├── metal-polish/route.ts          ❌ DELETE
├── natural-light/route.ts         ❌ DELETE
├── video/route.ts                 ❌ DELETE
└── turntable-video/route.ts       ❌ DELETE
```

**Neden?**
- Hiçbiri credit kullanmıyor → BEDAVA GENERATION
- Yeni queue sistemi var → Bu endpoint'ler gereksiz
- Frontend zaten migrate edilecek → Kullanılmayacak

---

### **STEP 2: DELETE OLD CREDIT ENDPOINTS (4 files)** ⏱️ 3 min

**Silinecek dosyalar:**
```bash
src/app/api/credits/
├── use/route.ts         ❌ DELETE (yeni: reserve + confirm)
├── check/route.ts       ❌ DELETE (yeni: getUserCredits)
├── add/route.ts         ❌ DELETE (yeni: Supabase admin)
└── refund/route.ts      ❌ DELETE (yeni: automatic refund)
```

**Neden?**
- Eski `user_credits` tablosu kullanıyor (farklı şema)
- Atomic değil → Race condition riski
- Yeni `credit-manager.ts` var → Atomic + safe

---

### **STEP 3: UPDATE FRONTEND REFERENCES** ⏱️ 10 min

**Aranacak & Değiştirilecek:**
```bash
# Old pattern
fetch('/api/credits/use', ...)           → useAIQueue.submitJob()
fetch('/api/credits/check', ...)         → getUserCredits()
fetch('/api/ai/edit', ...)               → useAIQueue.submitJob({ operation: 'edit' })
fetch('/api/ai/generate', ...)           → useAIQueue.submitJob({ operation: 'generate' })

# Find all references
grep -r "/api/credits/use" src/
grep -r "/api/credits/check" src/
grep -r "/api/ai/edit" src/
grep -r "/api/ai/generate" src/
# ... etc for all 11 old endpoints
```

**Frontend dosyaları (tahmin):**
- `src/components/templates/StudioPage.tsx`
- `src/components/organisms/QuickActions.tsx`
- `src/components/molecules/QuickModeContent.tsx`
- `src/hooks/useCreditStore.ts` (maybe)

---

### **STEP 4: CREATE CREDIT WIDGET** ⏱️ 15 min

**Yeni component:**
```typescript
// src/components/molecules/CreditDisplay.tsx
import { useEffect, useState } from 'react';
import { getUserCredits } from '@/lib/credit-manager';

export function CreditDisplay() {
  const [credits, setCredits] = useState<number>(0);
  
  useEffect(() => {
    async function fetchCredits() {
      const data = await getUserCredits(userId);
      setCredits(data.available);
    }
    fetchCredits();
  }, []);
  
  return (
    <div className="credit-badge">
      {credits} credits
    </div>
  );
}
```

**Eklenecek yerler:**
- TopBar (global)
- Sidebar (user dropdown)
- StudioPage (before generate)

---

### **STEP 5: MIGRATE SUPABASE DB** ⏱️ 5 min

**Zaten hazır migration:**
```sql
-- supabase/migrations/20250127_credit_system.sql
-- ✅ Already created in previous commit
-- Just needs to be run on Supabase
```

**Çalıştırma:**
1. Supabase Dashboard → SQL Editor
2. Paste `20250127_credit_system.sql`
3. Execute
4. Verify tables created

---

### **STEP 6: TEST FLOW** ⏱️ 10 min

**Test senaryosu:**
```typescript
// 1. Check credits
const credits = await getUserCredits(userId);
console.log('Available:', credits.available); // Should be 500 (initial)

// 2. Submit job
const { jobId } = await submitJob({
  operation: 'generate',
  params: { prompt: 'test' },
  priority: 'urgent',
});

// 3. Check reserved
const credits2 = await getUserCredits(userId);
console.log('Reserved:', credits2.reserved); // Should be 2 (generate cost)

// 4. Wait for completion
const result = await pollForResult(jobId);

// 5. Check confirmed
const credits3 = await getUserCredits(userId);
console.log('Balance:', credits3.balance); // Should be 498
console.log('Reserved:', credits3.reserved); // Should be 0
```

---

## 📋 CHECKLIST

### **Pre-Execution:**
- [ ] Backup current code (`git commit`)
- [ ] Backup Supabase (snapshot)
- [ ] Note current user credit balances

### **Execution:**
- [ ] Delete 11 old AI endpoints
- [ ] Delete 4 old credit endpoints
- [ ] Run Supabase migration (20250127_credit_system.sql)
- [ ] Update frontend to use `useAIQueue`
- [ ] Add `CreditDisplay` component
- [ ] Update `useCreditStore` (if needed)

### **Testing:**
- [ ] Test credit reservation
- [ ] Test credit confirmation (success)
- [ ] Test credit refund (failure)
- [ ] Test insufficient credits error
- [ ] Test concurrent requests (race condition)
- [ ] Test queue processing with credits

### **Verification:**
- [ ] No references to `/api/credits/use`
- [ ] No references to `/api/ai/edit` (old)
- [ ] All AI requests go through `/api/ai/submit`
- [ ] Credits deduct correctly
- [ ] Refunds work on failures
- [ ] UI shows correct credit balance

---

## 🚨 RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users lose credits | 🔴 HIGH | Backup DB, migration adds not removes |
| Old endpoints still called | 🟡 MEDIUM | Search all code, delete endpoints |
| Frontend breaks | 🟡 MEDIUM | Test thoroughly, gradual rollout |
| Race conditions | 🟡 MEDIUM | Atomic SQL functions prevent this |

---

## 📊 BEFORE vs AFTER

### **BEFORE:**
```
User makes request
  ↓
Frontend calls /api/ai/edit
  ↓
API calls FAL.AI
  ↓
(NO CREDIT CHECK!) ❌
  ↓
User gets free generation 💸
```

### **AFTER:**
```
User makes request
  ↓
Frontend calls useAIQueue.submitJob()
  ↓
/api/ai/submit
  ├── reserve_credit() ✅ (atomic)
  ├── Add to queue
  └── Return jobId
  ↓
Worker processes job
  ├── On success: confirm_credit() ✅
  └── On failure: refund_credit() ✅
  ↓
User sees result + correct credit balance 💰
```

---

## ⏱️ TOTAL TIME ESTIMATE

- **Delete endpoints:** 5 min
- **Delete credit APIs:** 3 min
- **Run migration:** 5 min
- **Update frontend:** 30 min
- **Create CreditDisplay:** 15 min
- **Testing:** 20 min
- **Verification:** 10 min

**TOTAL:** ~90 minutes (1.5 hours)

---

## 🎯 SUCCESS CRITERIA

✅ **All old endpoints deleted** (15 files)  
✅ **Migration ran successfully**  
✅ **Frontend using new queue**  
✅ **Credits deduct correctly**  
✅ **Refunds work**  
✅ **No free generations possible**  
✅ **Build passes**  
✅ **Tests pass** (if any)  

---

**Ready to execute?** Say "başla" to start cleanup! 🚀


