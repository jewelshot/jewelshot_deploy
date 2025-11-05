# 🚀 JewelShot Scaling Plan

## Current Limits (Free Tier)

- **FAL.AI:** 10-20 req/min
- **Vercel Hobby:** 10s timeout, ~20 concurrent functions
- **Supabase Free:** 500MB DB, 1GB storage, 2GB bandwidth/month
- **Max concurrent users:** ~5-10 (realistic)

---

## 🚨 50 Concurrent Users Scenario

### What Will Break:

1. ❌ FAL.AI rate limit (40-45 users get errors)
2. ❌ Vercel timeout (AI takes 20-45s, limit is 10s)
3. ❌ Supabase connections exhausted
4. ❌ Storage fills up in 1 day
5. ❌ No queue = all requests at once

---

## ✅ Solution: 3-Tier Scaling Strategy

### TIER 1: Quick Wins (2-4 hours) 💰 $0/month

#### 1.1 Queue System (Vercel KV + Background Jobs)

```typescript
// src/lib/queue/ai-queue.ts
import { kv } from '@vercel/kv';

interface JobData {
  userId: string;
  imageUrl: string;
  prompt: string;
  priority: 'normal' | 'high';
}

export async function enqueueAIJob(job: JobData) {
  const jobId = `job_${Date.now()}_${Math.random()}`;

  // Add to queue
  await kv.lpush('ai_queue', JSON.stringify({ id: jobId, ...job }));

  // Add to user's job list
  await kv.set(`job:${jobId}`, JSON.stringify(job), { ex: 3600 });

  return jobId;
}

export async function processQueue() {
  // Get next job
  const job = await kv.rpop('ai_queue');
  if (!job) return null;

  const data = JSON.parse(job as string);

  // Check if user is still rate-limited
  const canProcess = await checkUserRateLimit(data.userId);
  if (!canProcess) {
    // Re-queue
    await kv.lpush('ai_queue', job);
    return null;
  }

  return data;
}
```

**Benefits:**

- ✅ Requests don't fail, they queue
- ✅ FIFO processing
- ✅ User sees "Position in queue: 5"

---

#### 1.2 Global Rate Limiter (Redis-based)

```typescript
// src/lib/rate-limiter-global.ts
import { kv } from '@vercel/kv';

const GLOBAL_LIMIT = 15; // 15 AI requests per minute globally
const WINDOW = 60 * 1000; // 1 minute

export async function checkGlobalRateLimit(): Promise<boolean> {
  const now = Date.now();
  const windowStart = now - WINDOW;

  // Get request count in current window
  const count = await kv.zcount('global_requests', windowStart, now);

  if (count >= GLOBAL_LIMIT) {
    return false; // Rate limited
  }

  // Add current request
  await kv.zadd('global_requests', { score: now, member: `req_${now}` });

  // Cleanup old entries
  await kv.zremrangebyscore('global_requests', 0, windowStart);

  return true;
}
```

**Benefits:**

- ✅ Protects FAL.AI rate limit
- ✅ Prevents API key ban
- ✅ Respects upstream limits

---

#### 1.3 Image Compression + CDN

```typescript
// Compress BEFORE upload to Supabase
const compressed = await compressImage(blob, {
  maxSizeMB: 0.5, // 5MB → 500KB (10x reduction!)
  maxWidthOrHeight: 1920,
  quality: 0.8,
});
```

**Benefits:**

- ✅ 10x storage reduction (1GB → 10GB effective)
- ✅ Faster uploads
- ✅ Lower bandwidth costs

---

#### 1.4 Progressive Loading + Polling

```typescript
// Client-side: Poll for job status
export function useAIJobStatus(jobId: string) {
  const [status, setStatus] = useState<
    'queued' | 'processing' | 'complete' | 'failed'
  >('queued');
  const [position, setPosition] = useState<number>(0);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(`/api/jobs/${jobId}`);
      const data = await response.json();

      setStatus(data.status);
      setPosition(data.queuePosition || 0);

      if (data.status === 'complete') {
        setResult(data.imageUrl);
        clearInterval(interval);
      }
    }, 2000); // Poll every 2s

    return () => clearInterval(interval);
  }, [jobId]);

  return { status, position, result };
}
```

**Benefits:**

- ✅ No timeout issues
- ✅ User sees progress
- ✅ Better UX

---

### TIER 2: Production Ready (1 day) 💰 $20-50/month

#### 2.1 Upgrade Plans

- **Vercel Pro:** $20/month
  - 60s timeout (enough for AI)
  - 100 concurrent functions
  - 1000 GB bandwidth
- **Supabase Pro:** $25/month
  - 8 GB database
  - 100 GB storage
  - 250 GB bandwidth
  - Connection pooling

**Capacity:**

- ✅ ~100-200 concurrent users
- ✅ 500-1000 AI generations/day

---

#### 2.2 Background Job Processor (Inngest)

```bash
npm install inngest
```

```typescript
// src/inngest/functions.ts
import { inngest } from './client';
import { editImage } from '@/lib/ai/fal-client';
import { saveImageToGallery } from '@/lib/gallery-storage';

export const processAIJob = inngest.createFunction(
  { id: 'process-ai-job' },
  { event: 'ai/job.created' },
  async ({ event, step }) => {
    // Step 1: Generate image
    const result = await step.run('generate-image', async () => {
      return await editImage({
        image_url: event.data.imageUrl,
        prompt: event.data.prompt,
      });
    });

    // Step 2: Save to gallery
    await step.run('save-to-gallery', async () => {
      return await saveImageToGallery(
        result.images[0].url,
        event.data.fileName,
        'ai-edited'
      );
    });

    // Step 3: Notify user
    await step.run('notify-user', async () => {
      // Send webhook or update database
    });
  }
);
```

**Benefits:**

- ✅ Automatic retries
- ✅ Step-based execution
- ✅ Observability
- ✅ Free tier: 1,000 steps/month

---

#### 2.3 CDN for Images (Cloudflare R2)

```typescript
// Store FAL.AI images in R2 (10GB free)
// Serve via CDN (unlimited bandwidth)
```

**Benefits:**

- ✅ 10 GB free storage
- ✅ Unlimited bandwidth
- ✅ Lightning fast delivery

---

### TIER 3: Scale to 1000+ Users (3 days) 💰 $100-200/month

#### 3.1 Dedicated Queue (BullMQ + Redis)

- Upstash Redis: $10/month
- Priority queues
- Retry strategies
- Job scheduling

#### 3.2 Multiple FAL.AI Accounts

- Load balance across 3-5 API keys
- 10 req/min × 5 = 50 req/min total

#### 3.3 Caching Layer

- Cache AI results (same prompt = same image)
- Redis cache for database queries
- Reduce Supabase load by 70%

#### 3.4 Monitoring & Alerts

- Sentry for errors
- Vercel Analytics
- Uptime monitoring
- Cost alerts

---

## 📊 Capacity Comparison

| Tier               | Cost/month | Concurrent Users | AI Gen/day | Storage   |
| ------------------ | ---------- | ---------------- | ---------- | --------- |
| **Current (Free)** | $0         | 5-10             | 50-100     | 1 GB      |
| **Tier 1 (Quick)** | $0         | 20-30            | 200-300    | 1 GB      |
| **Tier 2 (Pro)**   | $50        | 100-200          | 1,000      | 100 GB    |
| **Tier 3 (Scale)** | $200       | 500-1000         | 5,000+     | Unlimited |

---

## 🎯 Recommendation

**Start with Tier 1 (Today, 2-4 hours):**

1. Add queue system
2. Add global rate limiter
3. Improve compression
4. Add polling UI

**Then Tier 2 (When revenue > $100/month):**

1. Upgrade Vercel + Supabase
2. Add Inngest
3. Add Cloudflare R2

**Tier 3 only if 500+ daily active users**

---

## 🧪 Load Testing Plan

```bash
# Install k6
brew install k6

# Run load test
k6 run load-test.js
```

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 }, // Ramp up to 10 users
    { duration: '2m', target: 50 }, // Ramp up to 50 users
    { duration: '1m', target: 0 }, // Ramp down
  ],
};

export default function () {
  const res = http.post(
    'https://jewelshot-final.vercel.app/api/ai/edit',
    JSON.stringify({
      prompt: 'enhance lighting',
      image_url: 'https://example.com/image.jpg',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
  });

  sleep(1);
}
```

---

## 🚨 Critical Metrics to Monitor

1. **API Response Time:** < 500ms (excluding AI generation)
2. **AI Generation Time:** < 45s (p95)
3. **Error Rate:** < 1%
4. **Queue Length:** < 20 jobs
5. **Database Connections:** < 50
6. **Storage Usage:** < 80% capacity
7. **Bandwidth Usage:** < 80% quota

---

## 💰 Cost Breakdown (Tier 2)

```
Vercel Pro:        $20/month
Supabase Pro:      $25/month
Inngest Free:      $0/month
Cloudflare R2:     $0/month (10GB free)
---
Total:             $45/month

Revenue needed:    $100/month (2.2x buffer)
```

At $5/month per user → Need 10-20 paying users to break even
