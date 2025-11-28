# Staging Environment Setup

## Overview

This guide covers setting up a complete staging environment on Vercel for pre-production testing.

## Architecture

```
Production: main branch → jewelshot.ai
Staging: staging branch → staging.jewelshot.ai (or Vercel preview URL)
Development: local → localhost:3000
```

---

## 1. Vercel Project Setup

### Option A: Separate Vercel Project (Recommended)

**Pros:**
- Complete isolation from production
- Independent environment variables
- No risk of accidental production deployment
- Separate analytics and logs

**Cons:**
- Requires separate Vercel project

**Setup:**
1. Go to https://vercel.com/new
2. Import repository again
3. Name it `jewelshot-staging`
4. Set Environment Variables (see below)
5. Deploy

### Option B: Git Branch Preview (Simpler)

**Pros:**
- Same Vercel project
- Automatic preview deployments
- Easier to manage

**Cons:**
- Shared resource limits
- Shares some production settings

**Setup:**
1. Create `staging` branch
2. Push to GitHub
3. Vercel auto-creates preview URL
4. Override env vars for preview deployments

---

## 2. Environment Variables Configuration

### Staging-Specific Variables

```bash
# ============================================
# DATABASE (Staging Supabase Project)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_staging_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key

# ============================================
# REDIS (Staging Upstash Instance)
# ============================================
UPSTASH_REDIS_REST_URL=https://your-staging-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_staging_token

# ============================================
# AI SERVICES (Staging API Keys - Lower Rate Limits)
# ============================================
FAL_KEY=your_staging_fal_key

# ============================================
# MONITORING (Staging Sentry Project)
# ============================================
NEXT_PUBLIC_SENTRY_DSN=https://your_staging_sentry_dsn
SENTRY_AUTH_TOKEN=your_staging_auth_token

# ============================================
# FEATURE FLAGS (Staging = Test Everything)
# ============================================
NEXT_PUBLIC_USE_ZUSTAND_ONLY=true
NEXT_PUBLIC_USE_MODULAR_CANVAS=true
NEXT_PUBLIC_USE_MODULAR_GALLERY=true

# ============================================
# ENVIRONMENT
# ============================================
NODE_ENV=production
NEXT_PUBLIC_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.jewelshot.ai

# ============================================
# RATE LIMITS (More lenient for testing)
# ============================================
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000

# ============================================
# CREDITS (Staging - More generous for testing)
# ============================================
NEXT_PUBLIC_FREE_CREDITS=100
NEXT_PUBLIC_AI_QUEUE_CREDITS=10
```

---

## 3. Vercel Configuration

Create or update `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "installCommand": "npm install",
  "env": {
    "NODE_ENV": "production",
    "NEXT_PUBLIC_ENV": "staging"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_ENV": "staging"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Environment",
          "value": "staging"
        },
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    }
  ]
}
```

---

## 4. Staging Branch Setup

### Create Staging Branch

```bash
# From main branch
git checkout -b staging
git push origin staging
```

### Branch Protection Rules (GitHub)

1. Go to Repository → Settings → Branches
2. Add rule for `staging` branch:
   - ✅ Require pull request reviews (optional)
   - ✅ Require status checks to pass
   - ✅ Require CI tests to pass
   - ❌ Do not require admin approval (for faster iteration)

### Auto-Merge Strategy

```bash
# Staging automatically pulls from main every day
# Set up GitHub Action for auto-sync (optional)
```

---

## 5. Database Setup (Staging Supabase)

### Create Staging Supabase Project

1. Go to https://supabase.com/dashboard
2. Create new project: `jewelshot-staging`
3. Run migrations:

```bash
# Copy schema from production
npx supabase db dump --db-url "postgres://production-url" > schema.sql
npx supabase db push --db-url "postgres://staging-url" --file schema.sql
```

4. Seed test data:

```bash
# Create test users
# Create sample images
# Create batch projects
```

### RLS Policies

- Same as production (already in migrations)
- Test with multiple user accounts

---

## 6. Redis Setup (Staging Upstash)

### Create Staging Redis Instance

1. Go to https://console.upstash.com
2. Create new database: `jewelshot-staging`
3. Copy credentials to Vercel env vars
4. Lower rate limits (for cost savings)

### Configuration

```bash
UPSTASH_REDIS_REST_URL=https://staging-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=staging_token

# Smaller queue settings
MAX_CONCURRENT_JOBS=2  # Production: 5
```

---

## 7. Monitoring Setup (Staging Sentry)

### Create Staging Sentry Project

1. Go to https://sentry.io
2. Create project: `jewelshot-staging`
3. Copy DSN to Vercel
4. Set lower rate limits (for cost)

### Configuration

```bash
NEXT_PUBLIC_SENTRY_DSN=https://staging-sentry-dsn
SENTRY_ENVIRONMENT=staging

# Lower sample rates
SENTRY_TRACES_SAMPLE_RATE=0.5  # Production: 1.0
SENTRY_REPLAYS_SAMPLE_RATE=0.1  # Production: 0.1
```

---

## 8. CI/CD Pipeline

### GitHub Actions for Staging

Create `.github/workflows/staging-deploy.yml`:

```yaml
name: Staging Deploy

on:
  push:
    branches: [staging]
  pull_request:
    branches: [staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test -- --run
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_STAGING_PROJECT_ID }}
          working-directory: ./
```

---

## 9. Testing Checklist

### Before Deployment

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Redis instance configured
- [ ] Sentry project created
- [ ] Build passing locally
- [ ] Tests passing (npm test)

### After Deployment

- [ ] Staging URL accessible
- [ ] Authentication works (Supabase)
- [ ] Image upload works
- [ ] AI generation works (queue processing)
- [ ] Credits system works
- [ ] Gallery loads images
- [ ] Favorites work
- [ ] Error tracking works (Sentry)
- [ ] Health endpoint responds
- [ ] No console errors

### Feature Flag Testing

- [ ] Test with `USE_MODULAR_CANVAS=true`
- [ ] Test with `USE_MODULAR_GALLERY=true`
- [ ] Test with `USE_ZUSTAND_ONLY=true`
- [ ] Test with all flags combined
- [ ] Test rollback (set flags to `false`)

---

## 10. Deployment Workflow

### Recommended Flow

```bash
1. Development → Local testing
   ├─ npm run dev
   ├─ Test features
   └─ Run tests (npm test)

2. Feature Branch → PR to main
   ├─ Code review
   ├─ CI tests pass
   └─ Merge to main

3. Main → Auto-deploy to Production
   ├─ Vercel auto-deploys
   └─ Monitor for errors

4. Main → Merge to Staging (optional pre-production test)
   ├─ git checkout staging
   ├─ git merge main
   ├─ git push origin staging
   ├─ Test on staging URL
   └─ If OK, deploy to production
```

### Emergency Rollback

```bash
# Option 1: Vercel Dashboard
1. Go to Deployments
2. Find last working deployment
3. Click "Promote to Production"

# Option 2: Feature Flags
1. Go to Vercel → Environment Variables
2. Set problematic flag to 'false'
3. Wait 30 seconds
4. Old system active

# Option 3: Git Revert
git revert <commit-hash>
git push origin main
# Vercel auto-deploys
```

---

## 11. Cost Optimization

### Staging Cost Savings

```bash
SUPABASE:
  - Free tier (OK for staging)
  - Pause when not in use

REDIS:
  - Smaller instance ($10/month)
  - Lower connection limits

VERCEL:
  - Same project = Free
  - Separate project = $20/month (Pro plan)

SENTRY:
  - Lower event quotas
  - Shorter retention (7 days)

AI (FAL.AI):
  - Use staging API key
  - Lower rate limits
  - Monitor usage closely

TOTAL: ~$30-50/month for staging
```

---

## 12. Quick Start

### Fastest Path to Staging

```bash
# 1. Create staging branch
git checkout -b staging
git push origin staging

# 2. Vercel will auto-create preview URL
# URL format: jewelshot-git-staging-yourorg.vercel.app

# 3. Set environment variables in Vercel
# Go to: Vercel Project → Settings → Environment Variables
# Filter: Preview (staging branch only)
# Add all variables from ENV_VARIABLES.md

# 4. Deploy
git commit --allow-empty -m "trigger staging deploy"
git push origin staging

# 5. Test
# Visit preview URL
# Run smoke tests
```

---

## 13. Monitoring & Alerts

### Staging-Specific Alerts

**UptimeRobot:**
- Monitor staging URL
- Less frequent checks (5 min vs 1 min)
- Email alerts to dev team only

**Sentry:**
- Separate Slack channel (#staging-errors)
- Less noisy alerts
- Focus on critical errors only

**Vercel:**
- Build status notifications
- Deployment previews in Slack

---

## 14. Data Management

### Staging Data Strategy

**DO:**
- Use fake/test data
- Anonymized production snapshots (optional)
- Auto-reset weekly (optional)

**DON'T:**
- Use real user data
- Use real payment info
- Use production API keys (except read-only)

### Weekly Reset Script (Optional)

```bash
# Reset staging database weekly
npm run staging:reset-db
# Drops all data, re-runs migrations, seeds test data
```

---

## Status

- **Staging Environment**: Not yet created
- **Estimated Setup Time**: 1-2 hours
- **Monthly Cost**: ~$30-50
- **Benefits**: Safe pre-production testing, feature flag validation

---

## Next Steps

1. Create `staging` branch
2. Set up Vercel preview environment
3. Configure environment variables
4. Create staging Supabase project
5. Create staging Redis instance
6. Deploy and test
7. Document staging URL
8. Set up monitoring

---

*Last Updated: November 28, 2024*


