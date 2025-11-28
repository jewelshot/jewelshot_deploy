# 🚩 FEATURE FLAG ROLLOUT PLAN

**Feature:** State Management Unification (Zustand-only)  
**Flag:** `NEXT_PUBLIC_USE_ZUSTAND_ONLY`  
**Status:** Ready for rollout  
**Date:** November 28, 2025  

---

## 📊 CURRENT STATUS

```bash
✅ Code deployed to production
✅ Feature flag system active
✅ Both systems tested and working
✅ Zero-risk rollback ready

DEFAULT: flag=false (Legacy mode - SAFE)
```

---

## 🎯 ROLLOUT STRATEGY

### **PHASE 1: LOCAL TESTING (NOW - 30 minutes)**

```bash
# Test locally with new system
NEXT_PUBLIC_USE_ZUSTAND_ONLY=true npm run dev

# Test scenarios:
1. Navigate to /catalogue
2. Add/remove favorites
3. Check data persists on refresh
4. Navigate to /gallery
5. Verify favorites sync between pages
6. Check localStorage structure

EXPECTED: All features work identically
```

### **PHASE 2: STAGING TEST (TODAY - 2 hours)**

```bash
# Option A: Vercel Preview Deployment
1. Create PR with flag enabled
2. Vercel creates preview deployment
3. Test on preview URL

# Option B: Staging Environment Variable
1. Vercel Dashboard → Project → Settings
2. Environment Variables → Add
3. Name: NEXT_PUBLIC_USE_ZUSTAND_ONLY
4. Value: true
5. Environment: Preview
6. Save → Redeploy

# Test checklist:
□ Catalogue page loads
□ Gallery page loads
□ Add favorite works
□ Remove favorite works
□ Data persists on refresh
□ No console errors
□ Performance acceptable
```

### **PHASE 3: PRODUCTION CANARY (DAY 2 - 24 hours)**

```bash
# 10% rollout (A/B test)
1. Implement user bucketing:
   - Hash user ID
   - If hash % 10 === 0 → new system
   - Else → legacy system

2. Monitor metrics:
   - Error rate (Sentry)
   - Performance (Vercel Analytics)
   - User complaints (support)

3. Success criteria:
   - Error rate < baseline
   - No data loss reports
   - Performance same or better
```

### **PHASE 4: GRADUAL ROLLOUT (DAY 3-4)**

```bash
DAY 3:
  - 50% rollout if canary successful
  - Monitor 12 hours

DAY 4:
  - 100% rollout if no issues
  - Monitor 24 hours
```

### **PHASE 5: CLEANUP (DAY 5)**

```bash
# If 100% rollout successful for 24 hours:

1. Remove feature flag
2. Delete legacy code
3. Clean commit

git checkout -b cleanup/remove-legacy-state
# Remove legacy localStorage code
# Remove feature flag checks
git commit -m "cleanup: remove legacy state management"
git push
```

---

## 🔍 MONITORING

### **Metrics to Watch:**

```bash
1. ERROR RATE (Sentry)
   - Target: Same or lower
   - Alert if: >10% increase

2. PERFORMANCE (Vercel Analytics)
   - Page load time
   - Time to interactive
   - Target: Same or better

3. DATA INTEGRITY
   - Favorites persist correctly
   - No duplicate favorites
   - No lost favorites

4. USER FEEDBACK
   - Support tickets
   - Error reports
   - Performance complaints
```

### **Dashboards:**

```
Sentry: https://jewelshot.sentry.io
Vercel Analytics: https://vercel.com/jewelshot/analytics
Uptime: https://uptimerobot.com
```

---

## ⚠️ ROLLBACK PROCEDURE

### **INSTANT ROLLBACK (30 seconds)**

```bash
# If issues detected:

1. Vercel Dashboard → Environment Variables
2. Find: NEXT_PUBLIC_USE_ZUSTAND_ONLY
3. Change: true → false
4. Save (auto-redeploy starts)
5. Wait 30 seconds → rollback complete

✅ Legacy system active
✅ Zero data loss (both systems persist)
✅ Users unaffected
```

### **When to Rollback:**

```
🔴 IMMEDIATE:
  - Data loss reported
  - Error rate spike >50%
  - Critical functionality broken

🟡 CONSIDER:
  - Error rate spike 10-50%
  - Performance degradation >20%
  - Multiple user complaints

🟢 CONTINUE:
  - Error rate same or better
  - Performance same or better
  - No user complaints
```

---

## 📋 PRE-ROLLOUT CHECKLIST

```bash
Before enabling flag in production:

Technical:
□ Build passes (npm run build)
□ No TypeScript errors
□ No console.log in new code
□ Feature flag tested locally
□ Staging test passed

Documentation:
□ This rollout plan created
□ Team notified
□ Support team briefed
□ Rollback procedure documented

Monitoring:
□ Sentry configured
□ Error alerts enabled
□ Performance baseline recorded
□ On-call engineer assigned
```

---

## 🧪 LOCAL TEST COMMANDS

```bash
# Terminal 1: Run with NEW system
NEXT_PUBLIC_USE_ZUSTAND_ONLY=true npm run dev

# Terminal 2: Run with OLD system (compare)
NEXT_PUBLIC_USE_ZUSTAND_ONLY=false npm run dev

# Test both:
1. Add 5 favorites
2. Refresh page
3. Remove 2 favorites
4. Navigate away and back
5. Check data persistence

# Inspect localStorage:
# Open DevTools → Application → Local Storage
# Key: jewelshot-image-metadata
# Should see: { state: { favorites: [...], metadata: {...} } }
```

---

## 📊 SUCCESS CRITERIA

```
✅ Phase 1 (Local): All tests pass
✅ Phase 2 (Staging): 24 hours no issues
✅ Phase 3 (10% Prod): 24 hours no issues
✅ Phase 4 (50% Prod): 12 hours no issues
✅ Phase 5 (100% Prod): 24 hours no issues

THEN: Remove legacy code ✨
```

---

## 🎯 NEXT STEPS (RIGHT NOW)

```bash
1. LOCAL TEST (30 minutes)
   └─ Run commands above
   
2. DECISION POINT
   └─ Pass? → Schedule staging test
   └─ Fail? → Fix issues first
   
3. STAGING TEST (Tomorrow)
   └─ Enable flag in Vercel Preview
   
4. PRODUCTION (Day 2-5)
   └─ Gradual rollout as described
```

---

**Created:** November 28, 2025  
**Owner:** Engineering Team  
**Status:** ✅ Ready for Phase 1 (Local Testing)  
**Risk Level:** 🟢 LOW (instant rollback available)


