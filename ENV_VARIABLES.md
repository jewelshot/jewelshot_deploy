# 🔐 Environment Variables Setup

**Complete list of all environment variables needed for Jewelshot**

---

## 📋 **Quick Setup**

1. Copy this file content
2. Create `.env.local` in project root
3. Fill in your actual values
4. **Never commit `.env.local` to git!**

---

## 🔴 **REQUIRED VARIABLES**

### **Supabase (Database + Auth + Storage)**

Get these from: https://supabase.com/dashboard/project/_/settings/api

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Redis / Upstash (Queue System)**

Get these from: https://console.upstash.com/redis

```bash
REDIS_URL=rediss://default:xxxxx@xxxxx.upstash.io:6379
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYxxxxxxxxxxxxxxxxxxx
```

### **FAL.AI (AI Processing)**

Get API keys from: https://fal.ai/dashboard/keys

```bash
FAL_AI_KEY_1=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Optional (for load balancing):**
```bash
FAL_AI_KEY_2=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
FAL_AI_KEY_3=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 🟡 **IMPORTANT VARIABLES**

### **Admin Dashboard**

Generate a secure random string (min 32 characters):

```bash
ADMIN_DASHBOARD_KEY=your-super-secret-admin-key-min-32-chars
```

**Generate with:**
```bash
openssl rand -base64 32
```

### **Email System (Resend)**

Get API key from: https://resend.com/api-keys

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

### **Internal API Secret**

For internal service-to-service communication:

```bash
INTERNAL_API_SECRET=your-internal-api-secret-min-32-chars
```

### **Google OAuth (Optional but Recommended)**

Setup guide: [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

**Note:** Google credentials are configured in Supabase Dashboard, not .env  
You only need to enable the provider in Supabase and add your Google OAuth credentials there.

```bash
# No environment variables needed - handled by Supabase
# Just follow GOOGLE_OAUTH_SETUP.md to configure
```

---

## 🟢 **OPTIONAL VARIABLES**

### **Analytics (Plausible)**

Your domain registered in Plausible.io:

```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=jewelshot.ai
```

### **Error Tracking (Sentry)**

Get DSN from: https://sentry.io/settings/

```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@oxxxxx.ingest.de.sentry.io/xxxxx
```

### **Site Configuration**

```bash
NEXT_PUBLIC_SITE_URL=https://www.jewelshot.ai
```

### **Payment (Stripe - Coming Soon)**

```bash
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
# STRIPE_SECRET_KEY=sk_live_xxxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## 📝 **Complete .env.local Template**

```bash
# ==================================
# JEWELSHOT - ENVIRONMENT VARIABLES
# ==================================

# ----------------------------------
# SUPABASE
# ----------------------------------
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# ----------------------------------
# REDIS / UPSTASH
# ----------------------------------
REDIS_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ----------------------------------
# FAL.AI
# ----------------------------------
FAL_AI_KEY_1=
FAL_AI_KEY_2=
FAL_AI_KEY_3=

# ----------------------------------
# EMAIL (RESEND)
# ----------------------------------
RESEND_API_KEY=

# ----------------------------------
# ADMIN & SECURITY
# ----------------------------------
ADMIN_DASHBOARD_KEY=
INTERNAL_API_SECRET=

# ----------------------------------
# ANALYTICS (OPTIONAL)
# ----------------------------------
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=

# ----------------------------------
# ERROR TRACKING (OPTIONAL)
# ----------------------------------
NEXT_PUBLIC_SENTRY_DSN=

# ----------------------------------
# SITE CONFIG
# ----------------------------------
NEXT_PUBLIC_SITE_URL=
```

---

## ⚙️ **Vercel Deployment**

Add these variables in: **Vercel Dashboard → Settings → Environment Variables**

**Tips:**
- Add to all environments (Production, Preview, Development)
- Use Vercel CLI: `vercel env pull .env.local`
- Never expose secrets in client-side code!

---

## 🔒 **Security Best Practices**

### **DO:**
✅ Use `.env.local` for local development  
✅ Add `.env.local` to `.gitignore`  
✅ Use Vercel Environment Variables for production  
✅ Rotate secrets regularly  
✅ Use different keys for dev/staging/prod  

### **DON'T:**
❌ Commit `.env` files to git  
❌ Share secrets in Slack/Discord  
❌ Use production keys in development  
❌ Expose `SUPABASE_SERVICE_ROLE_KEY` in client code  

---

## 🧪 **Testing Environment Variables**

Run this to check if all required variables are set:

```bash
npm run check:env
```

Or manually check:

```bash
node -e "console.log({
  supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  redis: !!process.env.REDIS_URL,
  fal: !!process.env.FAL_AI_KEY_1,
  admin: !!process.env.ADMIN_DASHBOARD_KEY,
  resend: !!process.env.RESEND_API_KEY
})"
```

---

## 🚩 **Feature Flags (Optional - For Safe Rollouts)**

Used for gradual feature rollouts and instant rollback. Toggle in Vercel dashboard.

```bash
# State Management Unification
NEXT_PUBLIC_USE_ZUSTAND_ONLY=false  # Default: false (legacy mode)
# Set to 'true' to use Zustand-only (recommended)

# Canvas Component Refactoring
NEXT_PUBLIC_USE_MODULAR_CANVAS=false  # Default: false (legacy 2,049 line Canvas)
# Set to 'true' to use modular Canvas (maintainable sub-components)
```

**When to use:**
- Deploying new features
- A/B testing
- Gradual user rollouts
- Instant rollback capability

**How to toggle:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Find variable (e.g., `NEXT_PUBLIC_USE_ZUSTAND_ONLY`)
3. Edit value (`true` or `false`)
4. Redeploy (automatic, takes ~30 seconds)

---

## 🏗️ **STAGING ENVIRONMENT**

### **Staging-Specific Variables**

For pre-production testing, use separate instances of all services:

```bash
# Staging Supabase (separate project)
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_staging_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key

# Staging Redis (separate instance)
UPSTASH_REDIS_REST_URL=https://staging-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_staging_token

# Staging Sentry (separate project)
NEXT_PUBLIC_SENTRY_DSN=https://your-staging-sentry-dsn
SENTRY_ENVIRONMENT=staging

# Environment identifier
NEXT_PUBLIC_ENV=staging

# Feature Flags (Enable all new features in staging)
NEXT_PUBLIC_USE_ZUSTAND_ONLY=true
NEXT_PUBLIC_USE_MODULAR_CANVAS=true
NEXT_PUBLIC_USE_MODULAR_GALLERY=true
```

**See:** [STAGING_ENVIRONMENT.md](./STAGING_ENVIRONMENT.md) for complete setup guide

---

## 📚 **Related Documentation**

- [Supabase Setup](./supabase/README.md)
- [Redis Setup](./REDIS_SETUP.md)
- [Worker Deployment](./WORKER_DEPLOYMENT.md)
- [Staging Environment](./STAGING_ENVIRONMENT.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Safe Refactoring Guide](./GÜVENLİ_REFACTORING_PLANI.md)

---

**Last Updated:** November 28, 2025

