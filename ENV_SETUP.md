# 🔧 ENVIRONMENT VARIABLES SETUP

Complete guide for setting up environment variables for Jewelshot.

---

## 📋 **REQUIRED VARIABLES**

### **1. Supabase (Database + Auth)**

Get from: https://app.supabase.com/project/_/settings/api

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:**
- `ANON_KEY` → Public, safe for client-side
- `SERVICE_ROLE_KEY` → Secret, server-side only!

---

### **2. Redis / Upstash (Queue System)**

Get from: https://console.upstash.com/

```bash
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYxxxxxxxxxxxxx
```

**Steps:**
1. Create free account at Upstash
2. Create new Redis database
3. Select Global (multi-region) or closest region
4. Copy all 3 values

---

### **3. FAL.AI (AI Processing)**

Get from: https://fal.ai/dashboard/keys

```bash
FAL_AI_KEY_1=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
FAL_AI_KEY_2=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  # Optional
FAL_AI_KEY_3=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  # Optional
```

**Recommendation:**
- Minimum: 1 key (works but limited)
- Recommended: 3-5 keys (load balancing, better performance)

---

### **4. Resend (Email Service)**

Get from: https://resend.com/api-keys

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Steps:**
1. Sign up at Resend
2. Verify your domain (or use their test domain)
3. Create API key
4. Copy key

---

### **5. Admin & Security**

**Admin Dashboard Key:**
```bash
ADMIN_DASHBOARD_KEY=your-super-secret-admin-key-here
```

Generate a strong key:
```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online
# https://www.random.org/strings/
```

**Internal API Secret:**
```bash
INTERNAL_API_SECRET=your-internal-api-secret-here
```

Use the same method above to generate.

---

## 🌐 **SITE URL**

### **Development:**
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### **Production (Vercel):**
```bash
# Use your actual Vercel URL
NEXT_PUBLIC_SITE_URL=https://jewelshot.vercel.app

# Or your custom domain
NEXT_PUBLIC_SITE_URL=https://www.jewelshot.ai
```

---

## 📊 **OPTIONAL VARIABLES**

### **Analytics:**
```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=jewelshot.ai
```

### **App Configuration:**
```bash
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_MAX_GALLERY_IMAGES=100
NODE_ENV=development
```

### **Worker Configuration:**
```bash
QUEUE_CONCURRENCY=5
WORKER_COUNT=3
```

---

## 🚀 **SETUP INSTRUCTIONS**

### **Local Development (.env.local)**

1. **Create `.env.local` file:**
```bash
cd jewelshot
touch .env.local
```

2. **Copy template:**
```bash
# Copy all variables from above
# Fill in your actual values
```

3. **Verify:**
```bash
npm run dev
# Check console for any missing env var errors
```

---

### **Vercel Deployment**

1. **Go to Vercel Dashboard:**
   - Project → Settings → Environment Variables

2. **Add each variable:**
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://xxx.supabase.co
   Environments: ✅ Production, ✅ Preview, ✅ Development
   ```

3. **Required variables for Vercel:**
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   REDIS_URL
   UPSTASH_REDIS_REST_URL
   UPSTASH_REDIS_REST_TOKEN
   FAL_AI_KEY_1
   RESEND_API_KEY
   ADMIN_DASHBOARD_KEY
   INTERNAL_API_SECRET
   NEXT_PUBLIC_SITE_URL  # Set to your Vercel URL
   ```

4. **Redeploy:**
   ```bash
   git push origin main
   # Vercel will auto-deploy with new env vars
   ```

---

### **Railway Worker Deployment**

1. **Go to Railway Dashboard:**
   - Project → Service → Variables

2. **Add these variables:**
   ```
   SUPABASE_SERVICE_ROLE_KEY
   REDIS_URL
   FAL_AI_KEY_1
   FAL_AI_KEY_2  # Optional
   FAL_AI_KEY_3  # Optional
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   RESEND_API_KEY
   INTERNAL_API_SECRET
   ```

3. **Redeploy:**
   - Railway will auto-restart with new variables

---

## ✅ **VERIFICATION CHECKLIST**

### **After Setting All Variables:**

```bash
[ ] Supabase connection works
[ ] Redis connection works
[ ] FAL.AI key valid (test AI generation)
[ ] Resend key valid (test email)
[ ] Admin dashboard accessible
[ ] Worker is running (check Railway)
[ ] No console errors about missing env vars
```

### **Test Each Service:**

**Supabase:**
```bash
# Try signing up/in
# Check if data saves to database
```

**Redis:**
```bash
# Submit an AI job
# Check queue dashboard (/api/admin/queues)
```

**FAL.AI:**
```bash
# Generate an image
# Should complete successfully
```

**Resend:**
```bash
# Trigger welcome email (new signup)
# Check email arrives
```

**Worker:**
```bash
# Check Railway logs
# Should see "Workers running" messages
```

---

## ⚠️ **COMMON ISSUES**

### **Issue: "Missing environment variable"**

**Solution:**
1. Check variable name (exact match, case-sensitive)
2. Check it's set in correct environment (Vercel/Railway)
3. Redeploy after adding variables

---

### **Issue: "Supabase connection failed"**

**Solution:**
1. Verify URL is correct (https://xxx.supabase.co)
2. Check you're using ANON key (not service role) for client
3. Verify service role key is correct

---

### **Issue: "Redis connection failed"**

**Solution:**
1. Check all 3 Redis variables are set
2. Verify format: `rediss://` (with double 's')
3. Test connection in Upstash dashboard

---

### **Issue: "Worker not processing jobs"**

**Solution:**
1. Check Railway logs for errors
2. Verify all env vars set in Railway
3. Check FAL.AI keys are valid
4. Verify Redis connection works

---

## 🔒 **SECURITY BEST PRACTICES**

### **DO:**
- ✅ Use different keys for dev/prod
- ✅ Rotate keys regularly (every 3-6 months)
- ✅ Keep `.env.local` in `.gitignore`
- ✅ Use service role key only server-side
- ✅ Generate strong admin keys (32+ chars)
- ✅ Use HTTPS in production

### **DON'T:**
- ❌ Commit `.env.local` to git
- ❌ Share keys publicly
- ❌ Use same keys across projects
- ❌ Use `NEXT_PUBLIC_` for secrets
- ❌ Hardcode keys in code

---

## 📞 **NEED HELP?**

### **Missing a Service:**

- **Supabase:** https://supabase.com/docs
- **Upstash:** https://docs.upstash.com/
- **FAL.AI:** https://fal.ai/docs
- **Resend:** https://resend.com/docs

### **Still Stuck?**

1. Check console for specific error messages
2. Verify all variables are set (no typos)
3. Try redeploying
4. Check service status pages

---

## 📝 **QUICK REFERENCE**

### **Complete `.env.local` Template:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Redis
REDIS_URL=rediss://xxx.upstash.io:6379
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AY...

# FAL.AI
FAL_AI_KEY_1=xxx-xxx-xxx
FAL_AI_KEY_2=xxx-xxx-xxx
FAL_AI_KEY_3=xxx-xxx-xxx

# Email
RESEND_API_KEY=re_xxx

# Security
ADMIN_DASHBOARD_KEY=xxx
INTERNAL_API_SECRET=xxx

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=jewelshot.ai
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_MAX_GALLERY_IMAGES=100
```

---

**Last Updated:** November 27, 2025  
**Version:** 1.0

