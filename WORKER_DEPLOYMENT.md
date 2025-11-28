# 🚀 Worker Deployment Guide

**Deploy the AI processing worker to Railway**

---

## 📋 **Overview**

The worker processes AI operations from the Redis queue:
- Background image removal
- Image upscaling
- Style transfers
- Batch processing
- And all other AI operations

**Architecture:**
```
User Request → Next.js API → Redis Queue → Worker → FAL.AI → Result
```

---

## 🛤️ **Railway Deployment**

### **Step 1: Create Railway Account**

1. Go to https://railway.app
2. Sign up with GitHub
3. Verify email

### **Step 2: Create New Project**

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repo: `jewelshot/jewelshot_deploy`
4. Select branch: `main`

### **Step 3: Configure Service**

**Service Name:** `jewelshot-worker`

**Root Directory:** `/workers` (if workers are in a subdirectory)  
**Start Command:**
```bash
node worker.js
```

Or if using TypeScript:
```bash
ts-node src/worker.ts
```

### **Step 4: Set Environment Variables**

Add these in Railway → Variables:

```bash
# Redis (Upstash)
REDIS_URL=rediss://default:xxxxx@xxxxx.upstash.io:6379

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# FAL.AI
FAL_AI_KEY_1=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
FAL_AI_KEY_2=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
FAL_AI_KEY_3=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Optional
NODE_ENV=production
LOG_LEVEL=info
```

### **Step 5: Deploy**

1. Click **"Deploy"**
2. Wait for build (~2-3 minutes)
3. Check logs for:
   ```
   ✅ Worker started successfully
   ✅ Connected to Redis
   ✅ Connected to Supabase
   ✅ Waiting for jobs...
   ```

---

## ⚙️ **Alternative: Vercel Serverless Functions**

**⚠️ Not Recommended for Long-Running Tasks**

Vercel has 60-second timeout. For AI operations, Railway is better.

But if needed:

```typescript
// /api/worker/process.ts
export const config = {
  maxDuration: 60, // Max for Pro plan
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  // Process single job
  const job = await queue.pop();
  await processJob(job);
  res.status(200).json({ success: true });
}
```

Then use external cron (like cron-job.org) to call every minute.

---

## 📊 **Monitoring Worker Health**

### **Check Worker Status**

1. **Railway Dashboard:**
   - Logs → Look for errors
   - Metrics → CPU/Memory usage
   - Deployments → Latest deploy status

2. **API Endpoint:**
   ```bash
   curl https://your-app.com/api/worker/health
   ```

   Response:
   ```json
   {
     "status": "healthy",
     "uptime": 3600,
     "processedJobs": 1234,
     "queueLength": 5,
     "redisConnected": true
   }
   ```

### **Health Check Implementation**

Create `/api/worker/health/route.ts`:

```typescript
import { createClient } from '@/lib/redis';

export async function GET() {
  const redis = createClient();
  
  // Check Redis connection
  const queueLength = await redis.llen('ai-queue');
  
  // Check last heartbeat from worker
  const lastHeartbeat = await redis.get('worker:heartbeat');
  const isHealthy = lastHeartbeat && 
    (Date.now() - parseInt(lastHeartbeat)) < 60000; // < 1 min ago
  
  return Response.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    queueLength,
    lastHeartbeat,
  });
}
```

---

## 🔄 **Scaling Workers**

### **Horizontal Scaling (Multiple Workers)**

Railway:
1. Go to **Settings → Scale**
2. Set **Replicas: 2** (or more)
3. Each worker will process jobs in parallel

**Make sure your queue implementation supports multiple consumers!**

### **Vertical Scaling (More Resources)**

Railway:
1. Go to **Settings → Resources**
2. Increase **RAM** (512MB → 1GB → 2GB)
3. Increase **CPU** (0.5 vCPU → 1 vCPU)

**When to scale:**
- Queue length consistently > 100
- Processing time > 5 minutes per job
- Memory usage > 80%

---

## 🐛 **Troubleshooting**

### **Worker Not Starting**

**Symptoms:**
- Logs: "Error: Cannot connect to Redis"
- Dashboard: Crashed status

**Solutions:**
1. Check `REDIS_URL` format:
   ```bash
   rediss://default:password@host:6379
   ```
2. Test Redis connection:
   ```bash
   redis-cli -u $REDIS_URL ping
   ```
3. Check Railway logs for specific error

### **Jobs Not Processing**

**Symptoms:**
- Queue length increasing
- No "Processing job..." in logs

**Solutions:**
1. Check worker is running:
   ```bash
   railway logs
   ```
2. Check queue name matches:
   ```typescript
   // Both should use same queue name
   await queue.push('ai-queue', job);    // API
   const job = await queue.pop('ai-queue'); // Worker
   ```
3. Restart worker:
   ```bash
   railway restart
   ```

### **Out of Memory**

**Symptoms:**
- Logs: "JavaScript heap out of memory"
- Worker crashes randomly

**Solutions:**
1. Increase Node.js memory:
   ```bash
   # Railway → Settings → Start Command
   node --max-old-space-size=2048 worker.js
   ```
2. Upgrade Railway plan (more RAM)
3. Process smaller batches

### **Slow Processing**

**Symptoms:**
- Each job takes > 2 minutes
- Queue backlog growing

**Solutions:**
1. Check FAL.AI status: https://status.fal.ai
2. Add more worker replicas
3. Implement job prioritization:
   ```typescript
   // Priority queue
   await redis.zadd('ai-queue-priority', Date.now(), jobId);
   ```

---

## 📈 **Performance Optimization**

### **1. Connection Pooling**

Reuse connections instead of creating new ones:

```typescript
// ❌ Bad: New connection per job
async function processJob(job) {
  const redis = await createClient(); // Slow!
  // ...
}

// ✅ Good: Reuse connection
const redis = await createClient();
async function processJob(job) {
  // Use existing connection
}
```

### **2. Batch Processing**

Process multiple jobs together when possible:

```typescript
// Process up to 5 jobs at once
const jobs = await redis.lpop('ai-queue', 5);
await Promise.all(jobs.map(processJob));
```

### **3. Graceful Shutdown**

Handle SIGTERM/SIGINT properly:

```typescript
let isShuttingDown = false;

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  isShuttingDown = true;
  
  // Wait for current jobs to finish
  await currentJobs;
  
  // Close connections
  await redis.quit();
  process.exit(0);
});
```

---

## 🔐 **Security**

### **Environment Variables**

- ✅ Never hardcode API keys
- ✅ Use Railway's secret management
- ✅ Rotate keys regularly
- ❌ Don't log sensitive data

### **Network Security**

Railway provides:
- ✅ HTTPS by default
- ✅ Private networking between services
- ✅ DDoS protection

---

## 💰 **Cost Optimization**

### **Railway Pricing**

- **Hobby Plan:** $5/month → 500 hours
- **Pro Plan:** $20/month → Unlimited hours

**Tips:**
1. Use **auto-sleep** for dev environments
2. Scale down during low-traffic hours
3. Monitor resource usage in dashboard

### **Estimated Costs**

```
1 Worker (512MB RAM, 0.5 vCPU):
  - Railway: ~$5-10/month
  - FAL.AI: ~$0.01 per operation
  - Redis: Free (Upstash free tier)
  - Supabase: Free tier sufficient
  
Total: ~$5-15/month for low traffic
```

---

## 📚 **Related Documentation**

- [Environment Variables](./ENV_VARIABLES.md)
- [Redis Setup](./REDIS_SETUP.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Worker Source Code](./workers/README.md)

---

## ✅ **Deployment Checklist**

```bash
[ ] Railway account created
[ ] GitHub repo connected
[ ] Environment variables set
[ ] Worker deployed successfully
[ ] Health check endpoint working
[ ] Test job processed successfully
[ ] Monitoring alerts configured
[ ] Logs reviewed for errors
```

---

**Last Updated:** November 28, 2025  
**Maintained By:** Jewelshot Team

