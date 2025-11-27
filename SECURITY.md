# 🔒 Security Policy

## Overview

This document outlines security best practices and policies for the Jewelshot application.

---

## 🔑 Secrets Management

### Environment Variables

**Critical secrets that MUST be set:**

| Variable | Purpose | Rotation Policy |
|----------|---------|-----------------|
| `ADMIN_DASHBOARD_KEY` | Admin panel access | Every 90 days |
| `FAL_AI_KEY_1`, `FAL_AI_KEY_2`, `FAL_AI_KEY_3` | AI API access | When compromised |
| `SUPABASE_SERVICE_ROLE_KEY` | Database admin access | Never (contact Supabase) |
| `UPSTASH_REDIS_REST_TOKEN` | Redis access | When compromised |

### Key Rotation Procedure

**1. Admin Dashboard Key (Every 90 days):**

```bash
# Generate new key
openssl rand -base64 32

# Update in Vercel
Vercel Dashboard > Settings > Environment Variables > ADMIN_DASHBOARD_KEY

# Update in Railway
Railway Dashboard > Variables > ADMIN_DASHBOARD_KEY

# Redeploy both services
```

**2. FAL.AI API Keys (When compromised or hitting rate limits):**

```bash
# Get new key from FAL.AI dashboard
https://fal.ai/dashboard/keys

# Add as FAL_AI_KEY_4, FAL_AI_KEY_5, etc.
# System will automatically rotate through available keys

# Remove compromised key after 24h grace period
```

**3. Supabase Keys:**

> ⚠️ **WARNING:** Service role key rotation requires Supabase support.
> Only rotate if absolutely necessary (security breach).

---

## 🛡️ Access Control

### Admin Dashboard

**Protection layers:**
1. ✅ **Rate limiting:** 30 requests/minute per IP
2. ✅ **Bearer token authentication:** `ADMIN_DASHBOARD_KEY`
3. ⚙️ **IP whitelist (optional):** Set `ADMIN_ALLOWED_IPS` env var
4. ✅ **Access logging:** All attempts logged to console

**Recommended IP whitelist setup:**

```bash
# In Vercel environment variables
ADMIN_ALLOWED_IPS=123.45.67.89,98.76.54.32

# Comma-separated list of allowed IPs
# Leave empty to allow all IPs (use rate limiting only)
```

### API Endpoints

**Public endpoints (rate limited):**
- `/api/ai/*` - 10 requests/minute per user
- `/api/batch/*` - 50 requests/minute per user
- `/api/credits/*` - 50 requests/minute per user

**Protected endpoints (admin only):**
- `/api/admin/*` - 30 requests/minute per IP + admin key required
- `/api/health` - No auth (for monitoring)

---

## 🔐 Data Security

### Database (Supabase)

**Row Level Security (RLS) enabled on:**
- ✅ `user_credits` - Users can only view their own credits
- ✅ `credit_transactions` - Users can only view their own transactions
- ✅ `batch_projects` - Users can only access their own batches
- ✅ `batch_images` - Users can only access images from their batches

**Server-only access (Service Role Key):**
- Credit management functions
- Batch processing
- Admin analytics

### Storage (Supabase Storage)

**Buckets with RLS:**
- ✅ `batch-originals` - Users can only upload/read their own images
- ✅ `processed-images` - Users can only read their own processed images

---

## 📊 Monitoring & Alerts

### Security Events Logged

All security events are logged in structured JSON format:

```json
{
  "type": "admin_access",
  "timestamp": "2024-01-27T12:00:00Z",
  "endpoint": "/api/admin/workers",
  "ip": "123.45.67.89",
  "userAgent": "Mozilla/5.0...",
  "success": true/false,
  "error": "error message if failed"
}
```

### Recommended Monitoring

**Set up alerts for:**
- ❌ Multiple failed admin login attempts (> 5 in 1 minute)
- ❌ Admin access from new IP addresses
- ❌ Unusual API usage patterns
- ❌ Database connection failures
- ❌ Redis connection failures

**Tools:**
- **UptimeRobot:** Application uptime
- **Vercel Logs:** Request/error logs
- **Railway Logs:** Worker logs
- **Supabase Logs:** Database logs

---

## 🚨 Incident Response

### If Admin Key is Compromised

1. **Immediately rotate key:**
   - Generate new key: `openssl rand -base64 32`
   - Update in Vercel & Railway
   - Redeploy both services

2. **Review access logs:**
   - Check Vercel logs for unauthorized access
   - Look for `/api/admin/*` requests from unknown IPs

3. **Enable IP whitelist:**
   - Set `ADMIN_ALLOWED_IPS` to your known IPs
   - Deploy immediately

### If FAL.AI Key is Compromised

1. **Revoke key in FAL.AI dashboard**
2. **Remove from environment variables**
3. **Add new key as `FAL_AI_KEY_4` (or next available number)**
4. **Monitor costs for 24h**

### If Database is Compromised

1. **Contact Supabase support immediately**
2. **Rotate service role key (with their help)**
3. **Review RLS policies**
4. **Check for data exfiltration in logs**

---

## ✅ Security Checklist

**Before Production:**
- [ ] All environment variables set (no defaults)
- [ ] Admin dashboard key is strong (32+ chars)
- [ ] IP whitelist configured (recommended)
- [ ] Rate limiting tested
- [ ] RLS policies verified
- [ ] Backup system configured
- [ ] Monitoring alerts set up
- [ ] Security headers enabled (CSP, HSTS, etc.)
- [ ] Dependency vulnerabilities checked (`npm audit`)

**Monthly:**
- [ ] Review admin access logs
- [ ] Check for unusual API usage
- [ ] Verify backup integrity
- [ ] Update dependencies

**Quarterly:**
- [ ] Rotate admin dashboard key
- [ ] Review and update security policies
- [ ] Conduct security audit

---

## 📞 Contact

**Security issues:** Report privately to admin (do not create public issues)

**Last updated:** 2024-01-27
