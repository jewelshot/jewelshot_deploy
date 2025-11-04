# 💾 BACKUP & DISASTER RECOVERY STRATEGY

**Last Updated:** November 4, 2025  
**Status:** ✅ Active  
**Owner:** DevOps Team

---

## 🎯 OVERVIEW

This document outlines our backup strategy, recovery procedures, and disaster recovery plan for the JewelShot application.

---

## 📊 BACKUP SCOPE

### What We Backup

1. **Database** (Supabase PostgreSQL)
   - User accounts
   - Gallery images metadata
   - Rate limit data
   - User preferences
   
2. **Storage** (Supabase Storage)
   - Original uploaded images
   - AI-generated images
   - User profile images
   
3. **Configuration**
   - Environment variables (manual backup)
   - RLS policies (via SQL scripts)
   - Database schema (via migrations)

### What We Don't Backup

- Temporary session data
- Client-side localStorage data
- CDN caches
- Build artifacts
- `node_modules`

---

## 🔄 BACKUP SCHEDULE

### Automated Backups (Supabase)

| Backup Type | Frequency | Retention | Notes |
|-------------|-----------|-----------|-------|
| **Point-in-Time Recovery (PITR)** | Continuous | 7 days | Supabase Pro plan |
| **Daily Snapshots** | Daily at 00:00 UTC | 7 days | Automated by Supabase |
| **Weekly Full Backup** | Weekly (Sunday) | 30 days | Automated by Supabase |

### Manual Backups

| Type | When | By Whom |
|------|------|---------|
| Pre-deployment | Before major releases | Dev Team |
| Pre-migration | Before schema changes | Dev Team |
| On-demand | As needed | Admin |

---

## 🛡️ BACKUP VERIFICATION

### Daily Checks (Automated)

```bash
# Check if Supabase backups are running
# (Monitored via Supabase Dashboard)
Status: https://supabase.com/dashboard/project/[PROJECT_ID]/settings/database
```

### Weekly Verification

- [ ] Verify backup completion in Supabase Dashboard
- [ ] Check backup size (should be growing with data)
- [ ] Test restore to staging environment (monthly)

---

## 🚨 DISASTER RECOVERY PROCEDURES

### RTO & RPO Targets

| Metric | Target | Current |
|--------|--------|---------|
| **RTO** (Recovery Time Objective) | < 1 hour | ~30 minutes |
| **RPO** (Recovery Point Objective) | < 5 minutes | ~1 minute (PITR) |

### Disaster Scenarios & Response

#### 1️⃣ Accidental Data Deletion

**Symptoms:** User reports missing data

**Recovery Steps:**
```bash
# 1. Identify the affected data and timestamp
# 2. Use Supabase PITR to restore to before deletion
# 3. Export affected data
# 4. Re-import to production

# Via Supabase Dashboard:
Settings → Database → Backups → Point-in-Time Recovery
→ Select timestamp → Create branch → Export data
```

**Time:** ~15 minutes  
**Data Loss:** < 5 minutes

#### 2️⃣ Database Corruption

**Symptoms:** Database errors, connection issues

**Recovery Steps:**
```bash
# 1. Immediately switch to read-only mode
# 2. Restore from latest daily snapshot
# 3. Apply PITR to recover recent transactions
# 4. Verify data integrity
# 5. Switch back to read-write

# Via Supabase:
Settings → Database → Backups → Daily Snapshots
→ Select latest → Restore to new project
→ Update connection strings in Vercel
```

**Time:** ~45 minutes  
**Data Loss:** < 5 minutes

#### 3️⃣ Storage Bucket Corruption

**Symptoms:** Missing images, upload errors

**Recovery Steps:**
```bash
# 1. Identify affected bucket
# 2. Restore from Supabase Storage backup
# 3. Verify file integrity
# 4. Update CDN cache

# Via Supabase:
Storage → Buckets → [bucket_name] → Restore from backup
```

**Time:** ~20 minutes  
**Data Loss:** Depends on last backup (24h max)

#### 4️⃣ Complete Supabase Project Loss

**Symptoms:** Supabase project unavailable

**Recovery Steps:**
```bash
# 1. Create new Supabase project
# 2. Restore database from latest backup
# 3. Restore storage from latest backup
# 4. Re-apply RLS policies (from supabase_sql_setup.sql)
# 5. Update environment variables in Vercel
# 6. Verify functionality
# 7. Switch DNS/routing to new project

# Time: ~2-3 hours (manual process)
```

**Time:** ~2-3 hours  
**Data Loss:** < 24 hours (depends on backup age)

---

## 📋 BACKUP CHECKLIST

### Before Major Deployment

- [ ] Create manual backup via Supabase Dashboard
- [ ] Export critical data (users, gallery) to CSV
- [ ] Document database schema state
- [ ] Save current environment variables
- [ ] Test backup restoration in staging

### After Deployment

- [ ] Verify application functionality
- [ ] Check database connections
- [ ] Monitor error logs for 1 hour
- [ ] Keep backup for 7 days minimum

---

## 🔧 MANUAL BACKUP PROCEDURES

### 1. Database Backup (SQL Dump)

```bash
# Via Supabase Dashboard:
Settings → Database → Backups → Manual Backup → Create Backup

# Or via CLI (if Supabase CLI is installed):
supabase db dump --project-ref [PROJECT_ID] -f backup.sql

# Restore:
psql -h [SUPABASE_HOST] -U postgres -d postgres -f backup.sql
```

### 2. Storage Backup

```bash
# Export bucket via Supabase Dashboard:
Storage → Buckets → [bucket_name] → Download All

# Or via API:
curl -X GET "https://[PROJECT_ID].supabase.co/storage/v1/bucket/[bucket_name]/list" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [SERVICE_ROLE_KEY]"
```

### 3. Configuration Backup

```bash
# Backup environment variables (Vercel):
vercel env pull .env.backup

# Backup RLS policies:
cp supabase_sql_setup.sql backups/rls_$(date +%Y%m%d).sql

# Backup Next.js config:
cp next.config.ts backups/next.config_$(date +%Y%m%d).ts
```

---

## 🧪 TESTING RECOVERY

### Monthly Recovery Drill

1. **Objective:** Verify backup & restore procedures work
2. **Frequency:** First Sunday of each month
3. **Duration:** ~1 hour

**Steps:**
```bash
# 1. Create test Supabase project
# 2. Restore latest backup
# 3. Deploy test app pointing to restored DB
# 4. Verify:
   - User login works
   - Gallery loads
   - Image upload works
   - AI generation works
# 5. Document time taken
# 6. Delete test project
```

---

## 📱 EMERGENCY CONTACTS

| Role | Contact | Availability |
|------|---------|--------------|
| Primary Admin | [Your Email] | 24/7 |
| Supabase Support | https://supabase.com/support | 24/7 (Pro plan) |
| Vercel Support | https://vercel.com/support | 24/7 |

---

## 📚 ADDITIONAL RESOURCES

- [Supabase Backup Docs](https://supabase.com/docs/guides/platform/backups)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [PostgreSQL Backup & Restore](https://www.postgresql.org/docs/current/backup.html)

---

## ✅ BACKUP VERIFICATION LOG

| Date | Type | Status | Verified By | Notes |
|------|------|--------|-------------|-------|
| 2025-11-04 | Initial Setup | ✅ Pass | System | Automated backups configured |
| | | | | |
| | | | | |

---

## 🔄 DOCUMENT CHANGELOG

| Date | Changes | By |
|------|---------|-----|
| 2025-11-04 | Initial backup strategy document created | Dev Team |
| | | |

---

**Next Review:** December 4, 2025




