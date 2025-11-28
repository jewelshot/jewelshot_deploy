# 🚨 DISASTER RECOVERY RUNBOOK

> **CRITICAL DOCUMENT - READ BEFORE ANY PRODUCTION INCIDENT**

**Last Updated:** 2024-11-28  
**Version:** 1.0  
**Owner:** DevOps Team  
**SLA:** RTO: 2 hours, RPO: 15 minutes  

---

## 📋 QUICK REFERENCE

```
EMERGENCY CONTACTS:
├─ Primary On-Call:  [YOUR-PHONE]
├─ DevOps Lead:      [DEVOPS-PHONE]
├─ Supabase Support: support@supabase.io
├─ Vercel Support:   support@vercel.com
└─ FAL.AI Support:   support@fal.ai

CRITICAL URLS:
├─ Production:       https://jewelshot.ai
├─ Admin Dashboard:  https://jewelshot.ai/admin
├─ Supabase:         https://supabase.com/dashboard
├─ Vercel:           https://vercel.com/dashboard
└─ Uptime Monitor:   https://uptimerobot.com
```

---

## 🔴 SCENARIO 1: DATABASE DISASTER

### **Symptoms:**
- Users report missing images/data
- Database queries failing
- Data corruption detected
- Accidental DROP TABLE or DELETE

### **Recovery Steps:**

#### **Step 1: STOP THE BLEEDING (2 minutes)**
```bash
# 1. Enable maintenance mode
# Edit src/middleware.ts:
const MAINTENANCE_MODE = true;

# 2. Deploy immediately
git add src/middleware.ts
git commit -m "emergency: Enable maintenance mode"
git push origin main

# 3. Verify maintenance page is up
curl https://jewelshot.ai
# Should show maintenance page
```

#### **Step 2: ASSESS DAMAGE (5 minutes)**
```bash
# 1. Login to Supabase Dashboard
open https://supabase.com/dashboard/project/[PROJECT-REF]

# 2. Check affected tables
# SQL Editor → Run:
SELECT 
  schemaname, 
  tablename, 
  n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY tablename;

# 3. Identify missing/corrupted data
# Compare with expected counts:
# - users: ~100
# - images: ~10,000
# - user_credits: ~100
```

#### **Step 3: DETERMINE RESTORE POINT (5 minutes)**
```bash
# Find when data was last good
# Check backup_logs table:
SELECT * FROM backup_logs 
ORDER BY created_at DESC 
LIMIT 10;

# Check Supabase backup history:
# Dashboard → Database → Backups
# Note the timestamp of last good backup
```

#### **Step 4: CREATE EMERGENCY BACKUP (5 minutes)**
```bash
# Backup current state (even if corrupted)
# This allows rollback if restore fails

cd /Users/yasin/Desktop/vortex/jewelshot\ kopyası

supabase db dump \
  --project-ref [PROJECT-REF] \
  --file backups/emergency_$(date +%Y%m%d_%H%M%S).sql

# Verify dump created
ls -lh backups/
```

#### **Step 5: RESTORE FROM BACKUP (15-30 minutes)**

**Option A: Point-in-Time Recovery (PITR)**
```bash
# Supabase Dashboard → Database → Backups → Point in Time
# 1. Select timestamp (e.g., "2024-11-28 10:00:00")
# 2. Click "Restore"
# 3. Confirm
# 4. Wait 15-30 minutes

# OR via CLI:
supabase db restore \
  --timestamp "2024-11-28T10:00:00Z" \
  --project-ref [PROJECT-REF]
```

**Option B: Full Backup Restore**
```bash
# If you have SQL backup file:
supabase db push \
  --file backups/backup_20241128.sql \
  --project-ref [PROJECT-REF]
```

**Option C: Script-based Restore**
```bash
# Use our automated script:
export SUPABASE_PROJECT_REF="[PROJECT-REF]"
./scripts/restore-backup.sh "2024-11-28T10:00:00Z"
```

#### **Step 6: VERIFY RESTORE (10 minutes)**
```bash
# 1. Check table counts
SELECT COUNT(*) FROM images;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM user_credits;

# 2. Check recent data
SELECT * FROM images ORDER BY created_at DESC LIMIT 5;

# 3. Health check
curl https://jewelshot.ai/api/health

# 4. Test critical flows:
# - Login
# - View gallery
# - Check credits
```

#### **Step 7: RE-ENABLE PRODUCTION (5 minutes)**
```bash
# 1. Disable maintenance mode
# Edit src/middleware.ts:
const MAINTENANCE_MODE = false;

# 2. Deploy
git add src/middleware.ts
git commit -m "fix: Disable maintenance mode - restore complete"
git push origin main

# 3. Monitor errors
# Watch Sentry/logs for 30 minutes
```

#### **Step 8: POST-MORTEM (1 hour - within 24h)**
```markdown
# Create incident report:
- What happened?
- Root cause?
- Data lost (if any)?
- Recovery time?
- Lessons learned?
- Prevention steps?
```

**Total Recovery Time:** ~1-2 hours (RTO target met ✅)  
**Data Loss:** < 15 minutes (RPO target met ✅)

---

## 🔥 SCENARIO 2: WORKER CRASH / QUEUE FAILURE

### **Symptoms:**
- AI jobs stuck in "processing"
- Queue growing but not processing
- Worker memory/CPU alerts
- No completed jobs in last hour

### **Recovery Steps:**

#### **Step 1: DIAGNOSE (2 minutes)**
```bash
# 1. Check worker status
curl https://jewelshot.ai/api/admin/workers

# 2. Check queue stats
curl https://jewelshot.ai/api/admin/queues

# Expected:
# {
#   "active": 0-5,
#   "waiting": 0-20,
#   "failed": 0-5
# }

# BAD if:
# - active: 0 (worker dead!)
# - waiting: 100+ (queue backed up!)
# - failed: 50+ (worker crashing!)
```

#### **Step 2: CHECK WORKER LOGS**
```bash
# Railway (if deployed):
railway logs --service jewelshot-worker

# Vercel Cron (if using cron):
# Dashboard → Functions → Logs

# Look for:
# - "Worker started" (should see recent)
# - Memory errors
# - Connection errors
# - Unhandled rejections
```

#### **Step 3: RESTART WORKER**
```bash
# Railway:
railway service restart jewelshot-worker

# OR manual:
cd /Users/yasin/Desktop/vortex/jewelshot\ kopyası
npm run worker:start

# OR background process:
nohup npm run worker:start > worker.log 2>&1 &
```

#### **Step 4: VERIFY RECOVERY (5 minutes)**
```bash
# 1. Check queue is processing
curl https://jewelshot.ai/api/admin/workers
# active should be > 0

# 2. Submit test job
curl -X POST https://jewelshot.ai/api/ai/submit \
  -H "Authorization: Bearer [USER-TOKEN]" \
  -d '{
    "operation": "generate",
    "params": {"prompt": "test"},
    "priority": "normal"
  }'

# 3. Check job status (should complete in ~30s)
curl https://jewelshot.ai/api/ai/status/[JOB-ID]
```

#### **Step 5: CLEAR STUCK JOBS (if needed)**
```bash
# Login to Railway/worker server
# Or run locally with production Redis:

node -e "
const { Queue } = require('bullmq');
const queue = new Queue('ai-operations', {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  }
});

// Clean stuck jobs
await queue.clean(3600000, 100, 'active'); // Remove jobs active > 1h
console.log('Cleaned stuck jobs');
process.exit(0);
"
```

**Total Recovery Time:** ~10-15 minutes

---

## 💸 SCENARIO 3: CREDIT SYSTEM FAILURE

### **Symptoms:**
- Users report incorrect credit balance
- Credits not deducting
- Negative credits
- Duplicate charges

### **Recovery Steps:**

#### **Step 1: IDENTIFY AFFECTED USERS (5 minutes)**
```sql
-- Find users with negative credits
SELECT 
  user_id, 
  balance,
  last_updated
FROM user_credits
WHERE balance < 0;

-- Find suspicious transactions
SELECT 
  user_id,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount
FROM credit_transactions
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY user_id
HAVING COUNT(*) > 50;  -- Suspicious if > 50 transactions/hour
```

#### **Step 2: RECALCULATE BALANCES (10 minutes)**
```sql
-- Backup current state
CREATE TABLE user_credits_backup AS 
SELECT * FROM user_credits;

-- Recalculate from transactions
UPDATE user_credits uc
SET balance = (
  SELECT COALESCE(SUM(amount), 0)
  FROM credit_transactions ct
  WHERE ct.user_id = uc.user_id
)
WHERE user_id IN (
  SELECT user_id FROM user_credits WHERE balance < 0
);

-- Verify
SELECT COUNT(*) FROM user_credits WHERE balance < 0;
-- Should be 0
```

#### **Step 3: REFUND IF NEEDED**
```sql
-- If users were overcharged:
INSERT INTO credit_transactions (user_id, amount, type, description)
SELECT 
  user_id,
  ABS(balance) as refund_amount,
  'refund',
  'Automatic refund - system error correction'
FROM user_credits_backup
WHERE balance < 0 AND user_id NOT IN (
  SELECT user_id FROM user_credits WHERE balance < 0
);
```

**Total Recovery Time:** ~15-20 minutes

---

## 🌐 SCENARIO 4: VERCEL DEPLOYMENT FAILURE

### **Symptoms:**
- Build failing
- 500 errors on all pages
- Middleware errors
- Function timeouts

### **Recovery Steps:**

#### **Step 1: ROLLBACK (2 minutes)**
```bash
# Vercel Dashboard → Deployments → Previous successful deployment
# Click "..." → "Promote to Production"

# OR via CLI:
vercel rollback
```

#### **Step 2: IDENTIFY BUILD ERROR**
```bash
# Check build logs
vercel logs --follow

# Common issues:
# - Environment variables missing
# - TypeScript errors
# - Dependency conflicts
# - Memory limit exceeded
```

#### **Step 3: FIX & REDEPLOY**
```bash
# Fix locally first
npm run build

# If successful:
git add .
git commit -m "fix: [description]"
git push origin main

# Monitor deployment
vercel --prod
```

**Total Recovery Time:** ~5-10 minutes

---

## 🔐 SCENARIO 5: SECURITY BREACH

### **Symptoms:**
- Unusual API activity
- Suspicious admin actions
- Unknown admin logins
- Data exfiltration

### **Recovery Steps:**

#### **Step 1: LOCKDOWN (IMMEDIATE)**
```bash
# 1. Enable maintenance mode
# (see Scenario 1, Step 1)

# 2. Rotate ALL secrets
# Supabase Dashboard → Settings → API
# - Regenerate anon key
# - Regenerate service role key

# Vercel Dashboard → Settings → Environment Variables
# - Regenerate all API keys
# - FAL_AI_KEY_1, FAL_AI_KEY_2, etc.

# 3. Force logout all users
# Supabase Dashboard → Authentication → Users
# Select all → Sign out
```

#### **Step 2: AUDIT (30 minutes)**
```sql
-- Check recent admin actions
SELECT * FROM admin_audit_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Check suspicious activities
SELECT * FROM suspicious_activities
WHERE reviewed = false
ORDER BY suspicion_score DESC;

-- Check unauthorized access
SELECT 
  ip_address,
  COUNT(*) as attempts,
  MAX(created_at) as last_attempt
FROM admin_audit_logs
WHERE success = false
GROUP BY ip_address
HAVING COUNT(*) > 10;
```

#### **Step 3: SECURE (1 hour)**
```bash
# 1. Update all admin passwords
# 2. Enable 2FA for all admins (mandatory)
# 3. Review and revoke suspicious sessions
# 4. Add IP whitelist for admin routes (if possible)
# 5. Increase rate limits
```

#### **Step 4: NOTIFY (15 minutes)**
```
# 1. Notify affected users (if data breach)
# 2. Update status page
# 3. Prepare public statement (if needed)
# 4. Report to authorities (if required by GDPR)
```

**Total Recovery Time:** ~2-3 hours

---

## 📊 RECOVERY TIME OBJECTIVES (RTO/RPO)

```
┌─────────────────────────────────────────────────────────┐
│ Scenario              RTO       RPO      Criticality    │
├─────────────────────────────────────────────────────────┤
│ Database Disaster     2h        15min    🔴 CRITICAL    │
│ Worker Crash          15min     0min     🔴 CRITICAL    │
│ Credit System         20min     5min     🟡 HIGH        │
│ Vercel Deployment     10min     0min     🟡 HIGH        │
│ Security Breach       3h        N/A      🔴 CRITICAL    │
│ Third-party Outage    Varies    N/A      🟢 MEDIUM      │
└─────────────────────────────────────────────────────────┘

RTO = Recovery Time Objective (max downtime)
RPO = Recovery Point Objective (max data loss)
```

---

## 🧪 DISASTER RECOVERY DRILLS

### **Monthly Drill Schedule:**

**Week 1:** Database restore drill
```bash
# Test PITR on staging
export SUPABASE_PROJECT_REF="staging-ref"
./scripts/restore-backup.sh --dry-run
```

**Week 2:** Worker failover drill
```bash
# Kill worker, verify auto-restart
# Measure recovery time
```

**Week 3:** Security incident drill
```bash
# Simulate breach
# Practice lockdown procedure
# Measure response time
```

**Week 4:** Full disaster recovery
```bash
# Simulate complete outage
# Restore from scratch
# Measure RTO/RPO
```

---

## 📞 INCIDENT RESPONSE PROCEDURE

### **1. DETECT (0-5 minutes)**
```
How you'll know:
├─ Uptime monitor alert
├─ Sentry error spike
├─ User reports
├─ Health check failing
└─ Admin dashboard alerts
```

### **2. ASSESS (5-10 minutes)**
```
Severity levels:
├─ SEV-1 (Critical): Complete outage, data loss
├─ SEV-2 (High): Partial outage, major feature down
├─ SEV-3 (Medium): Minor feature degraded
└─ SEV-4 (Low): Non-critical issue
```

### **3. RESPOND (10-120 minutes)**
```
Actions:
├─ Update status page
├─ Enable maintenance mode (if needed)
├─ Start recovery procedure
├─ Notify stakeholders
└─ Document timeline
```

### **4. RECOVER (varies)**
```
Follow scenario-specific steps above
```

### **5. POST-MORTEM (within 24h)**
```
Required:
├─ Timeline of events
├─ Root cause analysis
├─ Impact assessment (users, revenue, data)
├─ Recovery actions taken
├─ Lessons learned
└─ Prevention measures
```

---

## 🛠️ PREVENTION MEASURES

### **Automated Monitoring:**
```yaml
✅ Implemented:
  - Health check endpoint (/api/health)
  - Queue monitoring
  - Worker health checks
  - Audit logging

⏳ To Implement:
  - Uptime alerts (UptimeRobot → Slack/Email)
  - Error rate alerts (Sentry)
  - Queue depth alerts (> 100 waiting)
  - Credit depletion alerts (< 1000 credits remaining)
  - Disk space alerts (> 80% full)
```

### **Backup Strategy:**
```yaml
Daily Backups:
  - Automated: Yes (Supabase PITR)
  - Retention: 7 days
  - Testing: Monthly drill

Weekly Backups:
  - Full SQL dump
  - Stored in: S3 / Google Drive
  - Retention: 30 days

Monthly Backups:
  - Full system snapshot
  - Retention: 12 months
  - Compliance: GDPR/CCPA
```

### **Access Controls:**
```yaml
Admin Access:
  - 2FA: Mandatory for all admins
  - IP Whitelist: Optional (recommended)
  - Session timeout: 24 hours
  - Audit logging: All actions

Database Access:
  - RLS policies: Enabled
  - Service role: Limited to server
  - Direct access: Disabled
  - Migration testing: Staging first
```

---

## 📝 INCIDENT LOG TEMPLATE

```markdown
# INCIDENT REPORT

**Date:** YYYY-MM-DD
**Incident ID:** INC-YYYYMMDD-001
**Severity:** SEV-X
**Status:** Resolved / Ongoing

## Summary
[One-line description]

## Timeline
- HH:MM - Incident detected
- HH:MM - Maintenance mode enabled
- HH:MM - Root cause identified
- HH:MM - Fix deployed
- HH:MM - Verification complete
- HH:MM - Service restored

## Impact
- Users affected: X
- Downtime: X minutes
- Data lost: None / X records
- Revenue impact: $X

## Root Cause
[Detailed explanation]

## Resolution
[What was done to fix]

## Prevention
- [ ] Action item 1
- [ ] Action item 2
- [ ] Action item 3

## Lessons Learned
[What we learned]
```

---

## 🔗 USEFUL COMMANDS

### **Database Commands:**
```bash
# Backup database
supabase db dump -f backup_$(date +%Y%m%d).sql

# Restore database
supabase db push -f backup.sql

# Reset database (DANGEROUS!)
supabase db reset

# Run migration
supabase db push

# View migrations
supabase migration list
```

### **Vercel Commands:**
```bash
# Rollback deployment
vercel rollback

# View logs
vercel logs --follow

# List deployments
vercel ls

# Promote deployment
vercel promote [URL]
```

### **Queue Commands:**
```bash
# Clean failed jobs
npm run queue:clean

# Drain queue
npm run queue:drain

# View queue stats
npm run queue:stats
```

---

## 🎯 TESTING THIS RUNBOOK

**Monthly Checklist:**
- [ ] Test database restore on staging
- [ ] Test worker restart procedure
- [ ] Verify emergency backups work
- [ ] Update contact information
- [ ] Review and update RTO/RPO targets
- [ ] Train new team members

**Annual Checklist:**
- [ ] Full disaster recovery simulation
- [ ] Review and update all scenarios
- [ ] Audit backup retention
- [ ] Test all emergency contacts
- [ ] Update vendor support contacts

---

## 📚 ADDITIONAL RESOURCES

- [Supabase Backup Docs](https://supabase.com/docs/guides/platform/backups)
- [Vercel Deployment Docs](https://vercel.com/docs/deployments)
- [BullMQ Queue Management](https://docs.bullmq.io/)
- [Incident Response Best Practices](https://www.atlassian.com/incident-management)

---

**⚠️ REMEMBER:**
1. **Stay Calm** - Panic causes mistakes
2. **Follow the Runbook** - Don't improvise
3. **Document Everything** - Incident log is critical
4. **Test on Staging First** - Never YOLO production
5. **Communicate** - Keep stakeholders informed

---

**🚨 IN CASE OF EMERGENCY, START HERE! 🚨**

