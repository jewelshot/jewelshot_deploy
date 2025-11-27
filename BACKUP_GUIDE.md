# 💾 DATABASE BACKUP SYSTEM

## ✅ Overview

Your database is protected with **Supabase Pro automatic backups** + manual backup logging system.

---

## 🔄 Automated Backups (Supabase Pro)

### **What's Included:**

- ✅ **Daily automated backups**
- ✅ **30-day retention** (can be increased)
- ✅ **Point-in-time recovery** (PITR)
- ✅ **Automatic off-site storage**
- ✅ **Zero configuration required**

### **Access Automated Backups:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **Jewelshot**
3. Navigate to: **Database → Backups**
4. View all automated backups with timestamps

---

## 🎯 Manual Backup Logging

### **When to Log Manual Backups:**

- Before major migrations
- Before risky operations
- Before bulk data changes
- For audit trail purposes

### **How to Trigger:**

1. **Admin Panel:**
   - Go to `/admin` → **Backups** tab
   - Click **"Log Manual Backup"**
   - Enter reason (optional)
   - Backup is logged in system

2. **API:**
```bash
curl -X POST https://www.jewelshot.ai/api/admin/backup \
  -H "Authorization: Bearer YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Before migration"}'
```

---

## 📥 Download Backups

### **From Supabase Dashboard:**

1. Go to: **Database → Backups**
2. Select backup you want
3. Click **"Download"**
4. Choose format: `.sql` or `.tar.gz`

### **What You Get:**

- Full database dump
- All tables, indexes, constraints
- RLS policies
- Stored procedures

---

## 🔄 Restore a Backup

### **Option 1: Supabase Dashboard (Easiest)**

1. Go to: **Database → Backups**
2. Select backup
3. Click **"Restore"**
4. Confirm restoration
5. Wait for completion (~5-10 min)

⚠️ **Warning:** This will replace current database!

### **Option 2: Manual Restore (Advanced)**

```bash
# Download backup first
# Then restore using psql

psql -h your-project.supabase.co \
     -U postgres \
     -d postgres \
     -f backup.sql
```

### **Option 3: Point-in-Time Recovery**

For Pro plan users:

1. Go to: **Database → Backups → PITR**
2. Select exact timestamp
3. Restore to that point
4. Useful for recovering from accidental deletions

---

## 📊 Backup Monitoring

### **Admin Dashboard:**

View backup statistics:
- Total backups logged
- Automated vs Manual ratio
- Last backup date
- Recent backup history

### **Database Query:**

```sql
-- View recent backups
SELECT *
FROM backup_logs
ORDER BY created_at DESC
LIMIT 20;

-- Backup stats
SELECT * FROM get_backup_stats();
```

---

## 🚨 Disaster Recovery Plan

### **Scenario 1: Accidental Data Deletion**

**If within last hour:**
1. Use Point-in-Time Recovery
2. Restore to timestamp before deletion
3. Done in minutes

**If older:**
1. Find nearest automated backup
2. Download backup
3. Restore locally or on staging
4. Extract needed data
5. Import to production

### **Scenario 2: Database Corruption**

1. Contact Supabase support immediately
2. They will assist with recovery
3. Have backup ID ready
4. Expect ~1 hour recovery time

### **Scenario 3: Complete Project Loss**

1. Create new Supabase project
2. Download last backup
3. Import using `psql` or Dashboard
4. Update connection strings
5. Reconfigure environment variables

---

## 📋 Best Practices

### **Before Major Changes:**

```bash
# 1. Log manual backup
curl -X POST .../api/admin/backup \
  -d '{"reason": "Before v2.0 migration"}'

# 2. Perform change
# Run your migration/update

# 3. Verify success
# Test thoroughly

# 4. If problems, restore backup
```

### **Regular Checks:**

- ✅ Weekly: Verify automated backups are running
- ✅ Monthly: Test backup restoration
- ✅ Quarterly: Download and archive critical backups

### **What to Back Up Separately:**

- Environment variables (`.env`)
- Uploaded images (Supabase Storage separately)
- Redis data (if critical)
- Third-party service configs

---

## 🔐 Backup Security

### **Encryption:**

- ✅ Backups encrypted at rest
- ✅ Encrypted in transit
- ✅ AES-256 encryption

### **Access Control:**

- ✅ Only project admins can download
- ✅ Audit trail of all downloads
- ✅ MFA required for restoration

### **Retention:**

- **Pro Plan:** 30 days
- **Team/Enterprise:** Custom retention

---

## 📞 Support

### **Backup Issues:**

1. Check Supabase Dashboard for errors
2. Review backup logs: `/admin` → Backups
3. Contact Supabase support: support@supabase.io
4. Include: Project ID, backup date, error message

### **Restoration Help:**

- **Emergency:** support@supabase.io (mention "URGENT")
- **General:** Use dashboard chat support
- **Questions:** Check [Supabase Docs](https://supabase.com/docs/guides/platform/backups)

---

## ✅ Checklist

**Setup (One-time):**
- [x] Supabase Pro plan activated
- [x] Automated backups enabled
- [x] Backup logging system deployed
- [x] Admin access configured

**Regular Tasks:**
- [ ] Weekly: Check backup status
- [ ] Monthly: Test restoration
- [ ] Before migrations: Log manual backup
- [ ] Quarterly: Archive important backups

---

## 🎯 Quick Reference

| Action | Where | How |
|--------|-------|-----|
| View backups | Supabase Dashboard | Database → Backups |
| Download backup | Supabase Dashboard | Select → Download |
| Restore backup | Supabase Dashboard | Select → Restore |
| Log manual backup | Admin Panel | /admin → Backups tab |
| Check backup stats | Admin Panel | /admin → Backups tab |
| View backup logs | Database | `SELECT * FROM backup_logs` |

---

**Your data is safe!** 🛡️

- Automated daily backups ✅
- 30-day retention ✅
- Point-in-time recovery ✅
- Manual backup logging ✅
- Easy restoration ✅

