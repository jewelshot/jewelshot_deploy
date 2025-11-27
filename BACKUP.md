# 💾 Database Backup & Restore Guide

## Overview

Automated daily backup system for Jewelshot database. Backups are stored in Supabase Storage and retained for 7 days.

---

## 🤖 Automated Backups

### Schedule

**Daily at 3:00 AM UTC** (via Vercel Cron Job)

### What's Backed Up

- ✅ `user_credits` - All user credit balances
- ✅ `credit_transactions` - Last 10,000 transactions
- ✅ `batch_projects` - All batch projects
- ✅ `batch_images` - Last 30 days
- ✅ `operation_costs` - All operation cost configurations

### Storage Location

**Supabase Storage:** `backups/daily/`

**Retention:** 7 days (auto-cleanup)

**Format:** JSON (human-readable)

---

## 📥 Manual Backup

### Via API (Admin Only)

```bash
curl -X POST https://jewelshot.ai/api/admin/backup \
  -H "Authorization: Bearer YOUR_ADMIN_KEY"
```

### Via Admin Dashboard

1. Go to `/admin/dashboard`
2. Click **"Trigger Backup"** button
3. Wait for confirmation

---

## 🔄 Restore from Backup

### 1. List Available Backups

```bash
# In Supabase Dashboard
# Storage > backups > daily/
# Or via CLI (if configured)
```

### 2. Download Backup (Optional)

You can download the backup file from Supabase Dashboard for inspection.

### 3. Restore Using Script

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL=your-url
export SUPABASE_SERVICE_ROLE_KEY=your-key

# Run restore script
npx tsx scripts/restore-backup.ts backup_PROJECT_2024-01-27.sql.json
```

**⚠️ WARNING:** Restore will **upsert** data (update existing, insert new). Existing data with matching IDs will be overwritten.

### 4. Verify Restore

After restore, verify data:

```sql
-- Check user credits count
SELECT COUNT(*) FROM user_credits;

-- Check latest transactions
SELECT * FROM credit_transactions ORDER BY created_at DESC LIMIT 10;

-- Check batch projects
SELECT COUNT(*) FROM batch_projects;
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `CRON_SECRET` | Yes | Protects cron endpoint |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Admin access to database |

### Vercel Cron Setup

**File:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/backup",
      "schedule": "0 3 * * *"
    }
  ]
}
```

**Schedule format:** Cron syntax (UTC timezone)
- `0 3 * * *` = Every day at 3:00 AM UTC
- `0 */6 * * *` = Every 6 hours
- `0 0 * * 0` = Every Sunday at midnight

---

## 📊 Monitoring

### Check Backup Logs

**Vercel Dashboard:**
1. Go to project > Logs
2. Filter by `/api/cron/backup`
3. Check for errors

**Expected log output:**

```json
{
  "type": "info",
  "message": "Backup completed successfully",
  "scope": "Backup:Cron",
  "context": {
    "backupName": "backup_abc123_2024-01-27.sql.json",
    "duration": 2543,
    "size": 1048576
  }
}
```

### Verify Backups in Storage

1. Go to Supabase Dashboard
2. Storage > backups > daily/
3. Check that today's backup exists
4. Verify file size (should be > 0 bytes)

---

## 🚨 Troubleshooting

### Backup Failed

**Error:** `Could not extract project ref from Supabase URL`

**Fix:** Check `NEXT_PUBLIC_SUPABASE_URL` is correctly set

---

**Error:** `Upload failed: Storage bucket not found`

**Fix:** Run migration `20250128_backup_storage.sql`

---

**Error:** `Unauthorized`

**Fix:** Check `CRON_SECRET` matches in Vercel environment variables

---

### Restore Failed

**Error:** `Failed to download backup`

**Fix:** Check backup file name and that file exists in storage

---

**Error:** `Permission denied`

**Fix:** Check `SUPABASE_SERVICE_ROLE_KEY` has admin permissions

---

## 📝 Best Practices

1. **Test restores monthly** - Backups are useless if they can't be restored
2. **Monitor backup logs** - Set up alerts for failed backups
3. **Keep local copies** - Download important backups to external storage
4. **Document changes** - Note any schema changes that affect backups
5. **Plan for scale** - As data grows, consider partial backups

---

## 🔮 Future Enhancements

- [ ] Point-in-time recovery (PITR)
- [ ] Incremental backups
- [ ] Multi-region backup storage
- [ ] Automated restore testing
- [ ] Backup encryption
- [ ] S3/GCS external storage option

---

## 📞 Emergency Contact

**Data loss?** Follow disaster recovery plan in `SECURITY.md`

**Last updated:** 2024-01-28

