# 🗄️ SUPABASE MIGRATIONS GUIDE

Complete guide for running database migrations in Supabase.

---

## ⚠️ **CRITICAL:** Run Migrations Before Deploying!

All 17 migration files must be run in Supabase **BEFORE** deploying the application.

**If not run:** App will crash with database errors!

---

## 📋 **MIGRATION FILES (17 Total)**

Located in: `supabase/migrations/`

### **Run in This Order:**

```
1.  20250118_batch_projects.sql           ← Batch processing tables
2.  20250119_batch_original_url.sql       ← Batch storage URLs
3.  20250125_fix_storage_bucket.sql       ← Storage bucket fix
4.  20250125_image_metadata_favorites.sql ← Image metadata
5.  20250127_batch_helpers.sql            ← Batch helper functions
6.  20250127_batch_storage.sql            ← Batch storage bucket
7.  20250127_credit_system.sql            ⭐ CRITICAL: Credit system
8.  20250127_profiles_avatars_fixed.sql   ← User avatars (fixed)
9.  20250127_profiles_avatars.sql         ← User avatars
10. 20250127_simple_avatars.sql           ← Simple avatars
11. 20250128_admin_audit_logs.sql         ⭐ Admin audit system
12. 20250128_admin_credit_functions.sql   ⭐ Admin credit management
13. 20250128_anti_abuse.sql               ⭐ Anti-abuse system
14. 20250128_backup_storage.sql           ← Backup storage bucket
15. 20250128_backup_system.sql            ← Backup logging
16. 20250128_email_system.sql             ⭐ Email notifications
17. 20250128_performance_indexes.sql      ← Performance optimization
```

**⭐ CRITICAL FILES:** Must not fail!

---

## 🚀 **HOW TO RUN MIGRATIONS**

### **Method 1: Supabase Dashboard (Recommended)**

1. **Go to Supabase Dashboard:**
   - https://app.supabase.com/

2. **Select Your Project**

3. **Open SQL Editor:**
   - Left sidebar → SQL Editor → New Query

4. **Run Each Migration:**
   ```sql
   -- Copy content from: supabase/migrations/20250118_batch_projects.sql
   -- Paste into SQL Editor
   -- Click "Run"
   -- Wait for "Success" message
   -- Repeat for each file
   ```

5. **Verify:**
   - Check "Success" for each query
   - If error, read error message and fix

---

### **Method 2: Supabase CLI (Advanced)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

## ✅ **POST-MIGRATION VERIFICATION**

### **1. Check Tables Created:**

Go to: Table Editor → Should see:
```
✅ batch_projects
✅ batch_images
✅ user_credits
✅ credit_transactions
✅ operation_costs
✅ admin_logs
✅ user_action_timeline
✅ signup_ips
✅ device_fingerprints
✅ credit_unlocks
✅ suspicious_activities
✅ backup_logs
✅ email_logs
✅ email_preferences
```

---

### **2. Check Storage Buckets:**

Go to: Storage → Should see:
```
✅ images
✅ batch-originals
✅ backup
```

---

### **3. Check RPC Functions:**

Go to: Database → Functions → Should see:
```
✅ reserve_credit
✅ confirm_credit
✅ refund_credit
✅ get_available_credits
✅ add_admin_credits
✅ remove_admin_credits
✅ ban_user
✅ unban_user
✅ delete_user_data
✅ get_user_full_stats
✅ log_admin_action
✅ log_user_action
✅ log_backup_action
✅ can_receive_email
✅ get_email_stats
... (and more)
```

---

### **4. Test Credit System:**

Run this SQL query:
```sql
-- Test credit reservation
SELECT reserve_credit(
  'test-user-id',
  10,
  'generate',
  'test prompt'
);

-- Should return a transaction_id
-- If error, credit system migration failed
```

---

## ⚠️ **TROUBLESHOOTING**

### **Error: "relation already exists"**

**Cause:** Migration already run  
**Solution:** Skip that migration, continue to next

---

### **Error: "column already exists"**

**Cause:** Column from older migration  
**Solution:** 
```sql
-- Add IF NOT EXISTS clause
ALTER TABLE batch_projects 
ADD COLUMN IF NOT EXISTS prompt TEXT;
```

---

### **Error: "function already exists"**

**Cause:** Function from older migration  
**Solution:**
```sql
-- Drop and recreate
DROP FUNCTION IF EXISTS reserve_credit;
-- Then run the CREATE FUNCTION statement
```

---

### **Error: "permission denied"**

**Cause:** Using anon key instead of service role  
**Solution:** Make sure you're in Supabase Dashboard (not API call)

---

## 🔄 **ROLLBACK (If Something Goes Wrong)**

### **Manual Rollback:**

1. **Drop created tables:**
```sql
DROP TABLE IF EXISTS batch_projects CASCADE;
DROP TABLE IF EXISTS batch_images CASCADE;
DROP TABLE IF EXISTS user_credits CASCADE;
-- etc...
```

2. **Drop created functions:**
```sql
DROP FUNCTION IF EXISTS reserve_credit;
DROP FUNCTION IF EXISTS confirm_credit;
-- etc...
```

3. **Delete storage buckets:**
- Go to Storage → Select bucket → Delete

4. **Re-run migrations from start**

---

## 📊 **MIGRATION STATUS TRACKING**

### **Create a Migration Log Table (Optional):**

```sql
CREATE TABLE IF NOT EXISTS migration_log (
  id SERIAL PRIMARY KEY,
  migration_name TEXT NOT NULL,
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('success', 'failed')),
  error_message TEXT
);

-- Log each migration
INSERT INTO migration_log (migration_name, status)
VALUES ('20250118_batch_projects', 'success');
```

---

## 🎯 **PRODUCTION DEPLOYMENT CHECKLIST**

Before deploying to production:

```bash
[ ] All 17 migrations run successfully
[ ] Tables verified in Table Editor
[ ] Storage buckets created
[ ] RPC functions available
[ ] Credit system tested
[ ] No SQL errors in logs
[ ] Backup storage bucket created
[ ] Email system tables exist
[ ] Admin functions work
[ ] Anti-abuse tables exist
```

---

## 📝 **MIGRATION DETAILS**

### **Critical Migrations Explained:**

#### **7. credit_system.sql** ⭐
- Creates `user_credits`, `credit_transactions`, `operation_costs` tables
- Creates `reserve_credit`, `confirm_credit`, `refund_credit` functions
- **Must work:** Entire credit system depends on this

#### **11. admin_audit_logs.sql** ⭐
- Creates `admin_logs`, `user_action_timeline` tables
- Tracks all admin actions
- **Security:** Required for compliance

#### **12. admin_credit_functions.sql** ⭐
- Creates admin-specific credit management functions
- Allows adding/removing credits
- **Admin panel:** Required for user management

#### **13. anti_abuse.sql** ⭐
- Creates fraud detection tables
- Tracks IPs, devices, suspicious activity
- **Critical:** Prevents credit abuse

#### **16. email_system.sql** ⭐
- Creates `email_logs`, `email_preferences` tables
- Tracks all sent emails
- **Important:** Email notifications won't work without this

---

## 🔍 **VERIFICATION QUERIES**

### **Check All Tables Exist:**

```sql
SELECT 
  table_name 
FROM 
  information_schema.tables 
WHERE 
  table_schema = 'public' 
ORDER BY 
  table_name;
```

### **Check All Functions Exist:**

```sql
SELECT 
  routine_name 
FROM 
  information_schema.routines 
WHERE 
  routine_schema = 'public' 
  AND routine_type = 'FUNCTION'
ORDER BY 
  routine_name;
```

### **Check Storage Buckets:**

```sql
SELECT * FROM storage.buckets;
```

---

## 📞 **NEED HELP?**

### **Migration Failed?**

1. Read error message carefully
2. Check which table/function it's trying to create
3. Manually drop that table/function
4. Re-run migration

### **Still Stuck?**

1. Check Supabase docs: https://supabase.com/docs/guides/database/migrations
2. Join Supabase Discord: https://discord.supabase.com/
3. Check GitHub issues

---

## ⏱️ **ESTIMATED TIME**

- **Manual (Dashboard):** 15-20 minutes
- **CLI (Automated):** 2-3 minutes
- **Verification:** 5 minutes

**Total:** ~25 minutes for first-time setup

---

**Last Updated:** November 27, 2025  
**Next Update:** When new migrations added

