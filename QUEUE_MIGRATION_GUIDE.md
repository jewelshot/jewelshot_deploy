# 🚀 ENTERPRISE QUEUE SYSTEM - MIGRATION GUIDE

## 📊 OVERVIEW

**Amaç:** Tüm AI isteklerini merkezi bir queue sisteminden geçirerek:
- ✅ API key yönetimi (3-5 key, load balancing)
- ✅ Rate limit kontrolü
- ✅ Priority management (Urgent/Normal/Background)
- ✅ Automatic retry & error handling
- ✅ Scalable (100-500+ users)
- ✅ Atomic credit system (reserve/confirm/refund)

**Değişmeyen:** Presets, promptlar, UI, user experience

---

## ✅ PROGRESS STATUS

- [x] **PHASE 1:** Infrastructure (Dependencies installed)
- [x] **PHASE 2:** Queue Core (types, config, queues, api-keys)
- [x] **PHASE 3:** Processors (base + 11 operations + router)
- [x] **PHASE 4:** Worker (ai-worker.ts + npm script)
- [x] **PHASE 5:** API Endpoints (submit, status, cancel)
- [x] **PHASE 6:** Credit System (SQL migration + manager + integration)
- [x] **PHASE 7:** Frontend Hook (useAIQueue.ts)
- [ ] **PHASE 7:** Frontend Migration (Update components to use hook)
- [ ] **PHASE 8:** Monitoring (Bull Board)
- [ ] **PHASE 9:** Cleanup (Delete old endpoints)

---

## 🎯 PHASE-BY-PHASE CHECKLIST

### ✅ **PHASE 1: INFRASTRUCTURE** (2-3 saat)

- [ ] **1.1 Redis Setup**
  - [ ] Upstash.com hesabı aç
  - [ ] Redis database oluştur (Free tier yeterli)
  - [ ] REDIS_URL ve REDIS_TOKEN kopyala
  - [ ] `.env.local` dosyasına ekle

- [ ] **1.2 Install Dependencies**
  ```bash
  npm install bullmq ioredis
  npm install @bull-board/api @bull-board/ui
  ```

- [ ] **1.3 Environment Variables**
  - [ ] `.env.local` dosyasını güncelle
  - [ ] 3-5 FAL.AI API key ekle
  - [ ] Redis credentials ekle

**Dosya:** `.env.local`
```env
# Redis (Upstash)
REDIS_URL=rediss://...
REDIS_TOKEN=...

# FAL.AI Keys (3-5 keys for load balancing)
FAL_AI_KEY_1=your_key_1
FAL_AI_KEY_2=your_key_2
FAL_AI_KEY_3=your_key_3

# Queue Config
QUEUE_CONCURRENCY=5
WORKER_COUNT=3
```

---

### ✅ **PHASE 2: QUEUE CORE** (3-4 saat)

- [ ] **2.1 Create Queue Types**
  - [ ] `src/lib/queue/types.ts`
  - [ ] Define all 11 AI operations
  - [ ] Job data interfaces
  - [ ] Result interfaces

- [ ] **2.2 Create Queue Config**
  - [ ] `src/lib/queue/config.ts`
  - [ ] Redis connection
  - [ ] Queue names (urgent/normal/background)
  - [ ] Default job options

- [ ] **2.3 Create Queue Instances**
  - [ ] `src/lib/queue/queues.ts`
  - [ ] urgentQueue (Studio, Quick Actions)
  - [ ] normalQueue (Batch)
  - [ ] backgroundQueue (future use)

- [ ] **2.4 Create API Key Manager**
  - [ ] `src/lib/queue/api-keys.ts`
  - [ ] Round-robin key rotation
  - [ ] Key health tracking

**Dosyalar:**
```
src/lib/queue/
├── types.ts          ← Job types & interfaces
├── config.ts         ← Redis connection & queue config
├── queues.ts         ← Queue instances
└── api-keys.ts       ← API key manager
```

---

### ✅ **PHASE 3: PROCESSORS** (4-5 saat)

- [ ] **3.1 Create Base Processor**
  - [ ] `src/lib/queue/processors/base-processor.ts`
  - [ ] Generic FAL.AI call wrapper
  - [ ] Error handling
  - [ ] Retry logic

- [ ] **3.2 Create Operation Processors**
  - [ ] `src/lib/queue/processors/edit.ts`
  - [ ] `src/lib/queue/processors/generate.ts`
  - [ ] `src/lib/queue/processors/upscale.ts`
  - [ ] `src/lib/queue/processors/remove-bg.ts`
  - [ ] `src/lib/queue/processors/camera-control.ts`
  - [ ] `src/lib/queue/processors/gemstone.ts`
  - [ ] `src/lib/queue/processors/metal-recolor.ts`
  - [ ] `src/lib/queue/processors/metal-polish.ts`
  - [ ] `src/lib/queue/processors/natural-light.ts`
  - [ ] `src/lib/queue/processors/video.ts`
  - [ ] `src/lib/queue/processors/turntable.ts`

- [ ] **3.3 Create Main Processor**
  - [ ] `src/lib/queue/processors/ai-processor.ts`
  - [ ] Route to correct processor
  - [ ] API key injection
  - [ ] Result formatting

**Dosyalar:**
```
src/lib/queue/processors/
├── ai-processor.ts      ← Main router
├── base-processor.ts    ← Shared logic
├── edit.ts
├── generate.ts
├── upscale.ts
├── remove-bg.ts
├── camera-control.ts
├── gemstone.ts
├── metal-recolor.ts
├── metal-polish.ts
├── natural-light.ts
├── video.ts
└── turntable.ts
```

---

### ✅ **PHASE 4: WORKER** (2-3 saat)

- [ ] **4.1 Create Worker**
  - [ ] `src/workers/ai-worker.ts`
  - [ ] Process jobs from queues
  - [ ] Call ai-processor
  - [ ] Handle errors

- [ ] **4.2 Worker Startup Script**
  - [ ] `package.json` script ekle
  - [ ] Vercel cron job config (optional)

- [ ] **4.3 Test Worker Locally**
  ```bash
  npm run worker
  ```

**Dosyalar:**
```
src/workers/
└── ai-worker.ts

package.json:
"scripts": {
  "worker": "tsx watch src/workers/ai-worker.ts"
}
```

---

### ✅ **PHASE 5: API ENDPOINTS** (2-3 saat)

- [ ] **5.1 Submit Endpoint**
  - [ ] `src/app/api/ai/submit/route.ts`
  - [ ] Accept all AI requests
  - [ ] Add to appropriate queue
  - [ ] Return jobId

- [ ] **5.2 Status Endpoint**
  - [ ] `src/app/api/ai/status/[jobId]/route.ts`
  - [ ] Check job state
  - [ ] Return progress & result

- [ ] **5.3 Cancel Endpoint** (optional)
  - [ ] `src/app/api/ai/cancel/[jobId]/route.ts`
  - [ ] Cancel pending/active jobs

**Dosyalar:**
```
src/app/api/ai/
├── submit/route.ts
├── status/[jobId]/route.ts
└── cancel/[jobId]/route.ts
```

---

### ✅ **PHASE 6: CREDIT SYSTEM** (4-5 saat)

- [ ] **6.1 Database Migration**
  - [ ] `supabase/migrations/20250127_credit_system.sql`
  - [ ] Create `user_credits` table
  - [ ] Create `credit_transactions` table
  - [ ] Create atomic functions (reserve/confirm/refund)

- [ ] **6.2 Credit Functions**
  ```sql
  reserve_credit(user_id, amount, operation_type)
  confirm_credit(transaction_id)
  refund_credit(transaction_id)
  ```

- [ ] **6.3 Integrate with Queue**
  - [ ] Reserve credit BEFORE job submit
  - [ ] Confirm on success
  - [ ] Refund on failure
  - [ ] Update `src/app/api/ai/submit/route.ts`

**Dosyalar:**
```
supabase/migrations/
└── 20250127_credit_system.sql

src/lib/
└── credit-manager.ts
```

---

### ✅ **PHASE 7: FRONTEND MIGRATION** (5-6 saat)

**⚠️ ÖNEMLİ:** Mevcut 11 API endpoint'i YENİ queue sistemiyle değiştireceğiz.

#### **Mevcut Endpoints (ESKİ - SİLİNECEK):**
1. `/api/edit/route.ts`
2. `/api/generate/route.ts`
3. `/api/upscale/route.ts`
4. `/api/remove-bg/route.ts`
5. `/api/camera-control/route.ts`
6. `/api/gemstone/route.ts`
7. `/api/metal-recolor/route.ts`
8. `/api/metal-polish/route.ts`
9. `/api/natural-light/route.ts`
10. `/api/video/route.ts`
11. `/api/turntable/route.ts`

#### **Migration Steps:**

- [ ] **7.1 Create Shared Hook**
  - [ ] `src/hooks/useAIQueue.ts`
  - [ ] Submit job helper
  - [ ] Poll status helper
  - [ ] Handle results

- [ ] **7.2 Migrate Studio Page**
  - [ ] `src/components/templates/StudioPage.tsx`
  - [ ] Replace direct API calls
  - [ ] Use `useAIQueue` hook
  - [ ] Update UI for queued state

- [ ] **7.3 Migrate Quick Actions**
  - [ ] `src/components/organisms/QuickActions.tsx`
  - [ ] All quick preset buttons
  - [ ] Use `useAIQueue` hook

- [ ] **7.4 Migrate Video Features**
  - [ ] Video generation buttons
  - [ ] Turntable buttons
  - [ ] Canvas video button

- [ ] **7.5 Migrate Batch**
  - [ ] `src/components/templates/BatchPage.tsx`
  - [ ] Update background processing
  - [ ] Use queue for each image

- [ ] **7.6 Test Each Feature**
  - [ ] Studio generate
  - [ ] Studio quick actions
  - [ ] Studio edit tools (recolor, polish, etc.)
  - [ ] Video features
  - [ ] Batch processing

**Dosyalar:**
```
src/hooks/
└── useAIQueue.ts

Updated files:
- src/components/templates/StudioPage.tsx
- src/components/templates/BatchPage.tsx
- src/components/organisms/QuickActions.tsx
- src/components/molecules/QuickModeContent.tsx
```

---

### ✅ **PHASE 8: MONITORING** (2-3 saat)

- [ ] **8.1 Bull Board Setup**
  - [ ] `src/app/api/admin/queues/route.ts`
  - [ ] Bull Board UI integration
  - [ ] Admin-only access

- [ ] **8.2 Queue Metrics**
  - [ ] Job counts
  - [ ] Processing times
  - [ ] Error rates

**Dosyalar:**
```
src/app/api/admin/
└── queues/route.ts
```

**Access:** `http://localhost:3000/api/admin/queues`

---

### ✅ **PHASE 9: CLEANUP** (1-2 saat)

- [ ] **9.1 Delete Old Endpoints**
  - [ ] ❌ `/api/edit/route.ts`
  - [ ] ❌ `/api/generate/route.ts`
  - [ ] ❌ `/api/upscale/route.ts`
  - [ ] ❌ `/api/remove-bg/route.ts`
  - [ ] ❌ `/api/camera-control/route.ts`
  - [ ] ❌ `/api/gemstone/route.ts`
  - [ ] ❌ `/api/metal-recolor/route.ts`
  - [ ] ❌ `/api/metal-polish/route.ts`
  - [ ] ❌ `/api/natural-light/route.ts`
  - [ ] ❌ `/api/video/route.ts`
  - [ ] ❌ `/api/turntable/route.ts`

- [ ] **9.2 Update Documentation**
  - [ ] README.md
  - [ ] API documentation

- [ ] **9.3 Final Tests**
  - [ ] All features working
  - [ ] No console errors
  - [ ] Credit system working

---

## 🔄 MIGRATION FLOW EXAMPLE

### **ESKİ YÖNTEM (Studio Generate):**
```typescript
// StudioPage.tsx
const response = await fetch('/api/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt, aspectRatio }),
});
const result = await response.json();
setImage(result.image);
```

### **YENİ YÖNTEM (Queue):**
```typescript
// StudioPage.tsx
import { useAIQueue } from '@/hooks/useAIQueue';

const { submitJob, getStatus } = useAIQueue();

// Submit job
const { jobId } = await submitJob({
  operation: 'generate',
  params: { prompt, aspectRatio },
  priority: 'urgent',
});

// Poll for result
const result = await getStatus(jobId); // Auto-polls
setImage(result.image);
```

**⚠️ PROMPT DEĞİŞİKLİĞİ YOK!**
- Presetlardaki promptlar aynı kalıyor
- `params` objesi olduğu gibi FAL.AI'a gönderiliyor
- Sadece arada queue katmanı ekleniyor

---

## 📁 FINAL FOLDER STRUCTURE

```
src/
├── app/api/
│   ├── ai/
│   │   ├── submit/route.ts         ← YENİ (tek giriş noktası)
│   │   ├── status/[jobId]/route.ts ← YENİ
│   │   └── cancel/[jobId]/route.ts ← YENİ
│   ├── admin/
│   │   └── queues/route.ts         ← YENİ (monitoring)
│   └── batch/
│       └── ...                      (mevcut)
├── lib/
│   ├── queue/
│   │   ├── types.ts                ← YENİ
│   │   ├── config.ts               ← YENİ
│   │   ├── queues.ts               ← YENİ
│   │   ├── api-keys.ts             ← YENİ
│   │   └── processors/
│   │       ├── ai-processor.ts     ← YENİ
│   │       ├── base-processor.ts   ← YENİ
│   │       ├── edit.ts             ← YENİ
│   │       ├── generate.ts         ← YENİ
│   │       └── ...                 (11 processor)
│   └── credit-manager.ts           ← YENİ
├── workers/
│   └── ai-worker.ts                ← YENİ
├── hooks/
│   └── useAIQueue.ts               ← YENİ
└── components/
    └── ...                         (güncellenecek)

supabase/migrations/
└── 20250127_credit_system.sql      ← YENİ
```

---

## 🔒 SECURITY (CRITICAL)

### **API Key Protection:**

- [ ] **1. Never Commit .env Files**
  ```bash
  # .gitignore (already exists)
  .env
  .env.local
  .env*.local
  ```

- [ ] **2. Create .env.example Template**
  ```bash
  # .env.example (commit this)
  REDIS_URL=your_redis_url_here
  REDIS_TOKEN=your_redis_token_here
  FAL_AI_KEY_1=your_fal_key_1_here
  FAL_AI_KEY_2=your_fal_key_2_here
  FAL_AI_KEY_3=your_fal_key_3_here
  QUEUE_CONCURRENCY=5
  ```

- [ ] **3. Server-Side Only**
  - ✅ API keys ONLY in server components/API routes
  - ✅ NEVER import in client components
  - ✅ NEVER expose via `NEXT_PUBLIC_*`
  - ❌ Client asla API keylere erişemez

- [ ] **4. Vercel Environment Variables**
  - Vercel Dashboard → Settings → Environment Variables
  - Production/Preview/Development ortamlar ayrı
  - Encrypted storage by Vercel

- [ ] **5. Rate Limiting per User**
  ```typescript
  // src/app/api/ai/submit/route.ts
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Check user rate limit (10 req/min)
  const isAllowed = await checkRateLimit(user.id);
  if (!isAllowed) return NextResponse.json({ error: 'Rate limit' }, { status: 429 });
  ```

- [ ] **6. Admin Endpoint Protection**
  ```typescript
  // src/app/api/admin/queues/route.ts
  const isAdmin = await checkAdminRole(user.id);
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  ```

### **API Key Manager Security:**
```typescript
// src/lib/queue/api-keys.ts
// ✅ DOĞRU YÖNTEM
const API_KEYS = [
  process.env.FAL_AI_KEY_1,
  process.env.FAL_AI_KEY_2,
  process.env.FAL_AI_KEY_3,
].filter(Boolean);

// Keys asla log edilmez
export function getNextApiKey(): string {
  const key = API_KEYS[currentIndex];
  currentIndex = (currentIndex + 1) % API_KEYS.length;
  // ❌ ASLA: console.log(key)
  return key!;
}
```

---

## ⚡ QUICK START

```bash
# 1. Install dependencies
npm install bullmq ioredis @bull-board/api @bull-board/ui

# 2. Setup Redis (Upstash)
# - Go to upstash.com
# - Create Redis database
# - Copy credentials to .env.local

# 3. Create .env.local (NEVER COMMIT THIS)
cp .env.example .env.local
# Then edit .env.local with real credentials

# 4. Verify .gitignore
# Make sure .env.local is ignored

# 5. Start development
npm run dev

# 6. Start worker (separate terminal)
npm run worker

# 7. Test queue
# Submit job via /api/ai/submit
# Check status via /api/ai/status/[jobId]

# 8. Monitor queues (admin only)
# Visit: http://localhost:3000/api/admin/queues
```

---

## 🎯 SUCCESS CRITERIA

- [ ] Tüm AI istekleri `/api/ai/submit` üzerinden gidiyor
- [ ] 3-5 API key round-robin çalışıyor
- [ ] Urgent queue < 5s response time
- [ ] Normal queue < 30s response time
- [ ] Credit reserve/confirm/refund çalışıyor
- [ ] Worker crash'ten sonra recovery yapıyor
- [ ] UI'da hiçbir değişiklik yok (user experience aynı)
- [ ] Presetlar ve promptlar hiç değişmemiş
- [ ] Batch processing background'da çalışıyor
- [ ] 100+ concurrent user test passed

---

## 🚨 RISK MANAGEMENT

**Risk 1:** Redis bağlantı sorunu
- **Mitigation:** Fallback to direct API call (graceful degradation)

**Risk 2:** Worker crash
- **Mitigation:** PM2 veya Vercel Cron ile auto-restart

**Risk 3:** Queue overflow
- **Mitigation:** Max queue size limit, oldest job eviction

**Risk 4:** API key rate limit
- **Mitigation:** Per-key rate tracking, automatic key rotation

---

## 📞 SUPPORT

**Sorun yaşarsanız:**
1. Worker loglarını kontrol edin
2. Bull Board'dan queue state'e bakın
3. Redis connection'ı test edin
4. API key'lerin geçerli olduğundan emin olun

---

## ✅ READY TO START?

**İlk adım:** PHASE 1 - Infrastructure
- Upstash hesabı aç
- Redis database oluştur
- Dependencies install et

**Sonra:** PHASE 2 - Queue Core
- `/src/lib/queue/` klasörünü oluştur
- Temel yapıları kodla

**Devam:** Her phase'i sırayla tamamla
- Test et
- Commit at
- Next phase'e geç

---

**Hazır mısın? 🚀**

