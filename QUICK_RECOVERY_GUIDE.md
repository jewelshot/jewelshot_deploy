# ⚡ QUICK RECOVERY GUIDE

**Emergency Backup & Recovery - Quick Reference**

---

## 🚨 EMERGENCY: DATA LOST?

### Step 1: DON'T PANIC 🧘

You have:

- ✅ 7 days of continuous PITR (Point-in-Time Recovery)
- ✅ 7 days of daily snapshots
- ✅ 30 days of weekly backups

**Data Loss:** < 5 minutes maximum

---

## ⚡ FASTEST RECOVERY (5 MINUTES)

### Scenario: "I just deleted something!"

```bash
1. Go to Supabase Dashboard
   https://supabase.com/dashboard/project/fhfpyqlnazmulhroyyzz

2. Settings → Database → Backups → Point-in-Time Recovery

3. Select timestamp (5 minutes before deletion)

4. Click "Create Branch"

5. Export affected data from branch

6. Import back to main project

✅ DONE - Data recovered!
```

---

## 🔄 FULL DATABASE RESTORE (30 MINUTES)

### When to use: Database corrupted or major data loss

```bash
1. Supabase Dashboard → Settings → Database → Backups

2. Choose backup:
   - Daily Snapshot (< 24h old)
   - Weekly Backup (< 7d old)

3. Click "Restore to new project"

4. Wait for restore (5-10 min)

5. Update Vercel environment variables:
   NEXT_PUBLIC_SUPABASE_URL=[NEW_PROJECT_URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[NEW_KEY]

6. Redeploy: git push origin main

✅ DONE - Full recovery!
```

---

## 📦 STORAGE RECOVERY (20 MINUTES)

### Scenario: Images missing or corrupted

```bash
1. Supabase Dashboard → Storage → Buckets

2. Select affected bucket (e.g., "images")

3. Click "Restore from backup"

4. Select backup date

5. Confirm restore

6. Clear CDN cache (if using):
   - Vercel: Deployment → Clear Cache

✅ DONE - Storage recovered!
```

---

## 🛠️ MANUAL SQL BACKUP (NOW!)

### Quick backup before risky operation:

```bash
# Via Supabase Dashboard:
Settings → Database → Backups → "Create Manual Backup"

# Or save this SQL:
SELECT * FROM profiles INTO OUTFILE '/tmp/profiles_backup.csv';
SELECT * FROM images INTO OUTFILE '/tmp/images_backup.csv';
```

---

## ☎️ EMERGENCY SUPPORT

### If all else fails:

```
Supabase Support (24/7):
https://supabase.com/support

Your Supabase Project:
https://supabase.com/dashboard/project/fhfpyqlnazmulhroyyzz

GitHub Issues:
https://github.com/jewelshot/jewelshot_deploy/issues
```

---

## 📊 BACKUP STATUS DASHBOARD

Check backup health:

```
1. Go to: https://supabase.com/dashboard/project/fhfpyqlnazmulhroyyzz
2. Settings → Database → Backups
3. Verify:
   ✅ PITR: Enabled
   ✅ Daily: Last 24h
   ✅ Weekly: Last 7d
```

---

## ✅ RECOVERY CHECKLIST

After any recovery:

- [ ] Verify user login works
- [ ] Check gallery loads
- [ ] Test image upload
- [ ] Test AI generation
- [ ] Monitor for 1 hour
- [ ] Document incident

---

**Remember:** Supabase has your back! 💪

**RTO:** < 1 hour  
**RPO:** < 5 minutes  
**Confidence Level:** 🟢 HIGH
