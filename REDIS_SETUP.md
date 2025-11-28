# 🔴 Redis / Upstash Setup Guide

**Setup Redis for queue management and caching**

---

## 📋 **Overview**

Redis is used for:
- **AI job queue** (background processing)
- **Rate limiting** (per-user, per-IP)
- **Session caching** (optional)
- **Worker coordination** (job distribution)

**Why Upstash?**
- ✅ Serverless-friendly (HTTP REST API)
- ✅ Global edge network (low latency)
- ✅ Free tier (10,000 commands/day)
- ✅ Auto-scaling
- ✅ No cold starts

---

## 🚀 **Quick Setup (5 Minutes)**

### **Step 1: Create Upstash Account**

1. Go to https://console.upstash.com
2. Sign up with GitHub or email
3. Verify email

### **Step 2: Create Redis Database**

1. Click **"Create Database"**
2. Fill in details:
   ```
   Name: jewelshot-redis
   Type: Regional (or Global for multi-region)
   Region: Choose closest to your users
   Eviction: no-eviction (recommended)
   ```
3. Click **"Create"**

### **Step 3: Get Connection Details**

After creation, you'll see:

**Redis CLI:**
```bash
REDIS_URL=rediss://default:AbCd1234...@us1-example.upstash.io:6379
```

**REST API:**
```bash
UPSTASH_REDIS_REST_URL=https://us1-example.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYqwerty123...
```

### **Step 4: Add to Environment Variables**

**Local (.env.local):**
```bash
REDIS_URL=rediss://default:AbCd1234...@us1-example.upstash.io:6379
UPSTASH_REDIS_REST_URL=https://us1-example.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYqwerty123...
```

**Vercel:**
1. Go to **Vercel Dashboard → Settings → Environment Variables**
2. Add all 3 variables
3. Select all environments (Production, Preview, Development)

**Railway (Worker):**
1. Go to **Railway Dashboard → Variables**
2. Add `REDIS_URL`
3. Add `UPSTASH_REDIS_REST_URL`
4. Add `UPSTASH_REDIS_REST_TOKEN`

---

## 🧪 **Test Connection**

### **Option 1: Using Redis CLI**

```bash
redis-cli -u $REDIS_URL
```

Then try:
```redis
> PING
PONG

> SET test "Hello Redis"
OK

> GET test
"Hello Redis"

> DEL test
(integer) 1
```

### **Option 2: Using curl (REST API)**

```bash
curl https://us1-example.upstash.io/set/test/hello \
  -H "Authorization: Bearer AYqwerty123..."
```

Response:
```json
{"result":"OK"}
```

### **Option 3: Using Node.js**

```typescript
// test-redis.ts
import { createClient } from '@/lib/redis';

async function test() {
  const redis = createClient();
  
  // Test write
  await redis.set('test', 'hello');
  
  // Test read
  const value = await redis.get('test');
  console.log('✅ Redis working!', value);
  
  // Cleanup
  await redis.del('test');
}

test();
```

Run:
```bash
npx ts-node test-redis.ts
```

---

## 📊 **Queue Implementation**

Our queue uses Redis `LIST` data structure:

### **Push Job to Queue (API)**

```typescript
import { createClient } from '@/lib/redis';

const redis = createClient();

// Add job to queue
await redis.lpush('ai-queue', JSON.stringify({
  id: 'job-123',
  type: 'generate',
  userId: 'user-456',
  data: { prompt: 'A beautiful sunset', model: 'flux' },
  createdAt: Date.now(),
}));
```

### **Pop Job from Queue (Worker)**

```typescript
// Blocking pop (waits for job)
const job = await redis.brpop('ai-queue', 5); // 5 sec timeout

if (job) {
  const [queueName, jobData] = job;
  const parsedJob = JSON.parse(jobData);
  
  // Process job
  await processJob(parsedJob);
}
```

### **Check Queue Length**

```typescript
const length = await redis.llen('ai-queue');
console.log(`Queue has ${length} pending jobs`);
```

### **Priority Queue (Advanced)**

Use sorted sets for priority:

```typescript
// Add with priority score (lower = higher priority)
await redis.zadd('ai-queue-priority', Date.now(), JSON.stringify(job));

// Pop highest priority
const [job] = await redis.zpopmin('ai-queue-priority', 1);
```

---

## 🔒 **Rate Limiting**

### **Per-User Rate Limit**

```typescript
import { Redis } from '@upstash/redis';

async function checkRateLimit(userId: string) {
  const redis = Redis.fromEnv();
  const key = `ratelimit:user:${userId}`;
  
  // Increment counter
  const count = await redis.incr(key);
  
  // Set expiry on first request (24 hours)
  if (count === 1) {
    await redis.expire(key, 86400);
  }
  
  // Check limit (max 100 requests per day)
  if (count > 100) {
    throw new Error('Rate limit exceeded');
  }
  
  return count;
}
```

### **Per-IP Rate Limit**

```typescript
async function checkIPRateLimit(ip: string) {
  const redis = Redis.fromEnv();
  const key = `ratelimit:ip:${ip}`;
  
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 3600); // 1 hour
  }
  
  if (count > 20) {
    throw new Error('Too many requests from this IP');
  }
  
  return count;
}
```

---

## 💰 **Pricing & Limits**

### **Free Tier**

```
✅ 10,000 commands/day
✅ 256 MB storage
✅ Max 1,000 concurrent connections
✅ Global replication (for global DBs)
```

### **Paid Plans**

| Plan | Price | Commands/Day | Storage |
|------|-------|--------------|---------|
| Free | $0 | 10,000 | 256 MB |
| Pay As You Go | $0.20/100K | Unlimited | $0.25/GB |
| Pro 2K | $10/mo | 2 million | 2 GB |
| Pro 10K | $40/mo | 10 million | 10 GB |

### **Estimate Your Usage**

```
AI Operation:
  - Queue push: 1 command
  - Queue pop: 1 command
  - Status update: 1 command
  = ~3 commands per operation

1000 AI operations/day = 3000 commands
→ Free tier sufficient!

10,000 operations/day = 30,000 commands
→ Pay As You Go: ~$6/month
```

---

## 🔧 **Advanced Configuration**

### **Connection Pooling**

```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis';

let redisInstance: Redis | null = null;

export function createClient() {
  if (!redisInstance) {
    redisInstance = Redis.fromEnv();
  }
  return redisInstance;
}
```

### **Retry Logic**

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.pow(2, retryCount) * 100,
  },
});
```

### **Pipeline (Batch Commands)**

```typescript
// Execute multiple commands at once
const pipeline = redis.pipeline();

pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.incr('counter');

const results = await pipeline.exec();
console.log(results); // [OK, OK, 1]
```

---

## 🐛 **Troubleshooting**

### **Connection Timeout**

**Error:**
```
Error: Connection timeout
```

**Solutions:**
1. Check Upstash status: https://status.upstash.com
2. Verify `REDIS_URL` is correct
3. Check network/firewall settings
4. Try REST API instead of direct connection

### **Authentication Failed**

**Error:**
```
Error: WRONGPASS invalid username-password pair
```

**Solutions:**
1. Regenerate credentials in Upstash dashboard
2. Copy new `REDIS_URL`
3. Update environment variables
4. Restart app/worker

### **Too Many Connections**

**Error:**
```
Error: ERR max number of clients reached
```

**Solutions:**
1. Implement connection pooling (see above)
2. Close connections when done:
   ```typescript
   await redis.quit();
   ```
3. Upgrade Upstash plan

### **Commands Taking Too Long**

**Symptoms:**
- Queue operations > 1 second
- Slow API responses

**Solutions:**
1. Check queue size:
   ```bash
   redis-cli -u $REDIS_URL llen ai-queue
   ```
2. Use pipeline for bulk operations
3. Consider global database (multi-region)
4. Use REST API for better serverless compatibility

---

## 📈 **Monitoring**

### **Dashboard Metrics**

Upstash Console shows:
- **Total Commands** (24h graph)
- **Storage Usage** (MB)
- **Active Connections**
- **Hit Rate** (cache efficiency)

### **Custom Monitoring**

```typescript
// Get queue stats
async function getQueueStats() {
  const redis = createClient();
  
  const queueLength = await redis.llen('ai-queue');
  const processing = await redis.get('worker:processing') || 0;
  const completed = await redis.get('jobs:completed:today') || 0;
  
  return {
    pending: queueLength,
    processing: Number(processing),
    completed: Number(completed),
  };
}
```

### **Alerts**

Set up alerts in Upstash:
1. Go to **Database → Alerts**
2. Configure:
   ```
   Alert: Storage > 200 MB
   Alert: Commands > 8000/day (80% of free tier)
   ```
3. Add email/Slack webhook

---

## 🔄 **Migration from Other Redis**

### **From Redis Cloud**

1. Export data:
   ```bash
   redis-cli --rdb dump.rdb
   ```
2. Import to Upstash:
   ```bash
   redis-cli -u $UPSTASH_URL --pipe < dump.rdb
   ```

### **From ElastiCache**

1. Create snapshot in AWS
2. Download snapshot
3. Import to Upstash (same as above)

---

## 📚 **Related Documentation**

- [Worker Deployment](./WORKER_DEPLOYMENT.md)
- [Environment Variables](./ENV_VARIABLES.md)
- [Queue Implementation](/lib/queue/README.md)
- [Upstash Docs](https://docs.upstash.com/redis)

---

## ✅ **Setup Checklist**

```bash
[ ] Upstash account created
[ ] Redis database created
[ ] Connection credentials copied
[ ] Environment variables set (local + Vercel + Railway)
[ ] Connection tested successfully
[ ] Queue working (push + pop)
[ ] Rate limiting tested
[ ] Monitoring configured
```

---

**Last Updated:** November 28, 2025  
**Maintained By:** Jewelshot Team

