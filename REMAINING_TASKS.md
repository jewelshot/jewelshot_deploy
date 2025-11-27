# 📋 KALAN İŞLER - Priority List

**Last Updated:** Nov 26, 2025  
**Status:** Queue migration complete, production setup pending  

---

## 🔴 CRITICAL (Production Blockers)

### 1. **REDIS SETUP** ⏱️ 5 dakika
**Problem:** Queue sistemi çalışmıyor (Redis yok)  
**Impact:** Tüm AI istekler 503 dönüyor  

**Adımlar:**
```bash
1. upstash.com → Create account
2. Create Redis database (Free tier)
3. Copy REDIS_URL
4. Vercel → Settings → Environment Variables
5. Add: REDIS_URL = rediss://...
6. Redeploy
```

**Status:** ⏳ Pending  
**Priority:** 🔴 CRITICAL  

---

### 2. **CREDIT MIGRATION RUN** ⏱️ 5 dakika
**Problem:** Credit tabloları yok, reserve/confirm/refund çalışmıyor  
**Impact:** Users can't use AI features (insufficient credits error)  

**Adımlar:**
```sql
1. Supabase Dashboard → SQL Editor
2. Paste: supabase/migrations/20250127_credit_system.sql
3. Run
4. Verify tables:
   - user_credits
   - credit_transactions
   - operation_costs
```

**Status:** ⏳ Pending  
**Priority:** 🔴 CRITICAL  

---

### 3. **WORKER DEPLOY** ⏱️ 10 dakika
**Problem:** Jobs queue'da takılıyor, hiçbiri işlenmiyor  
**Impact:** Users submit jobs but never get results  

**Options:**

**A. Vercel Cron (Recommended for MVP):**
```javascript
// vercel.json
{
  "crons": [{
    "path": "/api/cron/process-queue",
    "schedule": "* * * * *" // Every minute
  }]
}

// src/app/api/cron/process-queue/route.ts
// Process 10 pending jobs per minute
```

**B. Separate Dyno (Production):**
```bash
# Heroku, Railway, Render, etc.
npm run worker
# Runs 24/7, processes jobs continuously
```

**Status:** ⏳ Pending  
**Priority:** 🔴 CRITICAL  

---

## 🟡 HIGH (Code Quality)

### 4. **CLEANUP EMPTY FOLDERS** ⏱️ 2 dakika
**Problem:** 11 boş API endpoint klasörü (deleted endpoints)  
**Impact:** Confusing codebase, looks messy  

**Folders to delete:**
```
src/app/api/ai/camera-control/
src/app/api/ai/edit/
src/app/api/ai/gemstone-enhance/
src/app/api/ai/generate/
src/app/api/ai/metal-polish/
src/app/api/ai/metal-recolor/
src/app/api/ai/natural-light/
src/app/api/ai/remove-background/
src/app/api/ai/turntable-video/
src/app/api/ai/upscale/
src/app/api/ai/video/
src/app/api/credits/add/
src/app/api/credits/check/
src/app/api/credits/refund/
src/app/api/credits/use/
```

**Command:**
```bash
find src/app/api -type d -empty -delete
git add -A
git commit -m "chore: remove empty API endpoint folders"
```

**Status:** ⏳ Pending  
**Priority:** 🟡 HIGH  

---

### 5. **CLEANUP TRASH DOCS** ⏱️ 3 dakika
**Problem:** 26+ .md/.sql files in root (migration guides, plans, etc.)  
**Impact:** Root directory cluttered, hard to find important files  

**Files to delete:**
```
BATCH_SETUP_GUIDE.md
CATALOGUE_MASTER_PLAN.md
CATALOG_FIX_INSTRUCTIONS.md
COMPLETED_IMPROVEMENTS.md
CREDIT_CLEANUP_PLAN.md
CREDIT_SYSTEM_FIX_FINAL.sql
CREDIT_SYSTEM_MASTER.sql
CRITICAL_ISSUES_FOUND.md
ENTERPRISE_CRITICAL_GAPS.md
ENTERPRISE_EVALUATION.md
FRONTEND_MIGRATION_PLAN.md
GALLERY_REINTRODUCE.md
MIGRATION_COMPLETION_REPORT.md
PRESET_CLEANUP_STRATEGY.md
PRODUCTION_READINESS_CHECKLIST.md
QUEUE_MIGRATION_GUIDE.md
RECOVERY_PLAN.md
... (+ 10 more)
```

**Keep:**
```
README.md
CONTRIBUTING.md
LICENSE (if exists)
```

**Command:**
```bash
# Move to docs/ folder
mkdir -p docs/migration-history
mv *.md docs/migration-history/ (except README.md, CONTRIBUTING.md)
mv *.sql docs/migration-history/
git add -A
git commit -m "chore: organize migration docs into docs/ folder"
```

**Status:** ⏳ Pending  
**Priority:** 🟡 HIGH  

---

### 6. **FIX TEST SUITE** ⏱️ 2-3 saat
**Problem:** 40+ TypeScript errors in tests, CI can't run  
**Impact:** Can't catch regressions, ship bugs to production  

**Example Errors:**
```typescript
// Canvas.test.tsx
// Type errors: useAIQueue, imageMetadataStore, etc.
// Need to update mocks for new queue system
```

**Adımlar:**
1. Update test mocks for queue system
2. Fix TypeScript errors (40+)
3. Run tests: `npm test`
4. Ensure 0 errors
5. Setup GitHub Actions CI

**Status:** ⏳ Pending  
**Priority:** 🟡 HIGH  

---

## 🟢 MEDIUM (Nice to Have)

### 7. **SETUP CI/CD** ⏱️ 1 gün
**What:** GitHub Actions to run tests/lint on every PR  
**Benefits:** Prevent bad code from merging  

**File:** `.github/workflows/ci.yml`
```yaml
name: CI
on: [pull_request, push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

**Status:** ⏳ Pending  
**Priority:** 🟢 MEDIUM  

---

### 8. **BULL BOARD (Queue Monitoring)** ⏱️ 1 saat
**What:** Web UI to monitor queue jobs  
**Benefits:** See pending/completed/failed jobs, retry manually  

**File:** `src/app/api/admin/queues/[...path]/route.ts`
```typescript
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { NextjsAdapter } from '@bull-board/nextjs';

const serverAdapter = new NextjsAdapter();
createBullBoard({
  queues: [
    new BullMQAdapter(urgentQueue),
    new BullMQAdapter(normalQueue),
    new BullMQAdapter(backgroundQueue),
  ],
  serverAdapter,
});

export const GET = serverAdapter.registerPlugin();
```

**Access:** `/api/admin/queues`  
**Auth:** Protect with middleware (admin only)  

**Status:** ⏳ Pending  
**Priority:** 🟢 MEDIUM  

---

### 9. **MONITORING & ALERTS** ⏱️ 1 gün
**What:** Uptime monitoring, error alerts, cost alerts  
**Services:** UptimeRobot, Sentry, LogSnag  

**Setup:**
```
1. UptimeRobot (free)
   - Monitor /api/health every 5 min
   - Alert via email if down

2. Sentry (already configured)
   - Add alert: if error rate > 5% → SMS

3. Cost Alerts
   - Vercel: Set $100/day limit
   - Supabase: Set $50/day limit
   - FAL.AI: Manual check (no API for limits)
```

**Status:** ⏳ Pending  
**Priority:** 🟢 MEDIUM  

---

### 10. **LEGAL COMPLIANCE** ⏱️ 3 gün
**What:** Privacy Policy, Terms of Service, Cookie Consent  
**Why:** GDPR fines up to €20M  

**Tasks:**
```
1. Privacy Policy (TermsFeed.com - free generator)
2. Terms of Service (TermsFeed.com)
3. Cookie Consent Banner (CookieBot)
4. Data Export (button in profile)
5. Account Deletion (button in profile)
6. DMCA Agent (register with US Copyright Office)
```

**Status:** ⏳ Pending  
**Priority:** 🟢 MEDIUM (but legally required)  

---

## 🔵 LOW (Future)

### 11. **DISASTER RECOVERY PLAN** ⏱️ 1 gün
- Automated Supabase backups
- Runbook for outages
- Status page
- Incident response plan

### 12. **VENDOR ABSTRACTION** ⏱️ 1 hafta
- Support multiple AI providers (FAL + Replicate)
- Can switch if FAL.AI raises prices

### 13. **ADVANCED RATE LIMITING** ⏱️ 1 gün
- Redis-based (global state)
- Per-IP + Per-User
- Progressive penalties

### 14. **FEATURE FLAGS** ⏱️ 2 gün
- LaunchDarkly integration
- Emergency kill switches
- Gradual rollouts

---

## 📊 SUMMARY

| Task | Time | Priority | Impact |
|------|------|----------|--------|
| Redis Setup | 5 min | 🔴 CRITICAL | Queue active |
| Credit Migration | 5 min | 🔴 CRITICAL | Credits work |
| Worker Deploy | 10 min | 🔴 CRITICAL | Jobs process |
| Empty Folders | 2 min | 🟡 HIGH | Clean code |
| Trash Docs | 3 min | 🟡 HIGH | Clean root |
| Fix Tests | 2-3h | 🟡 HIGH | Quality |
| CI/CD | 1 day | 🟢 MEDIUM | Automation |
| Bull Board | 1h | 🟢 MEDIUM | Monitoring |
| Alerts | 1 day | 🟢 MEDIUM | Observability |
| Legal | 3 days | 🟢 MEDIUM | Compliance |

**Total Critical:** 20 minutes → Production  
**Total High:** 3 hours → Clean codebase  
**Total Medium:** 5 days → Enterprise grade  

---

## 🎯 RECOMMENDED ORDER

### **Option 1: FAST (Get to production ASAP)**
```
1. Redis Setup (5 min)
2. Credit Migration (5 min)
3. Worker Deploy (10 min)
4. Test manually (30 min)
→ PRODUCTION READY in 50 minutes
```

### **Option 2: CLEAN (Production + Code quality)**
```
1. Redis Setup (5 min)
2. Credit Migration (5 min)
3. Worker Deploy (10 min)
4. Empty Folders (2 min)
5. Trash Docs (3 min)
6. Test manually (30 min)
→ PRODUCTION + CLEAN in 1 hour
```

### **Option 3: SOLID (Production + Tests + CI)**
```
1. Redis Setup (5 min)
2. Credit Migration (5 min)
3. Worker Deploy (10 min)
4. Empty Folders (2 min)
5. Trash Docs (3 min)
6. Fix Tests (2-3h)
7. Setup CI (1 day)
8. Test end-to-end (1h)
→ PRODUCTION + QUALITY in 2 days
```

### **Option 4: ENTERPRISE (Everything)**
```
All of the above + monitoring + legal + DR
→ FULL ENTERPRISE in 2 weeks
```

---

## ❓ WHAT'S NEXT?

**You choose:**
1. 🚀 Fast → Production (50 min)
2. 🧹 Clean → Production + Cleanup (1 hour)
3. 🏗️ Solid → Production + Tests (2 days)
4. 🏢 Enterprise → Full stack (2 weeks)
5. 🎨 Feature → Build something new

**Waiting for your decision...**


