# 📊 Monitoring & Alerts Setup

**Complete monitoring stack for production readiness**

---

## 📋 **Overview**

Monitoring setup includes:
- ✅ **Uptime monitoring** (UptimeRobot)
- ✅ **Error tracking** (Sentry - Already configured!)
- ✅ **Analytics** (Plausible - Already configured!)
- ✅ **Admin dashboard** (Internal metrics)
- ⏳ **Performance monitoring** (Coming soon)

---

## 🔔 **UptimeRobot Setup (5 Minutes)**

**Monitor website uptime and get instant alerts**

### **Step 1: Create Account**

1. Go to https://uptimerobot.com
2. Sign up (free tier: 50 monitors, 5-min intervals)
3. Verify email

### **Step 2: Add Monitors**

#### **A) Main Website Monitor**

1. Click **"+ Add New Monitor"**
2. Configure:
   ```
   Monitor Type: HTTP(S)
   Friendly Name: Jewelshot - Main Site
   URL: https://www.jewelshot.ai
   Monitoring Interval: 5 minutes
   ```
3. **Advanced Settings:**
   ```
   Request Timeout: 30 seconds
   Keyword Check: (optional) "Jewelshot"
   ```
4. Click **"Create Monitor"**

#### **B) API Health Check Monitor**

1. Click **"+ Add New Monitor"**
2. Configure:
   ```
   Monitor Type: HTTP(S)
   Friendly Name: Jewelshot - API Health
   URL: https://www.jewelshot.ai/api/health
   Monitoring Interval: 5 minutes
   HTTP Method: GET
   ```
3. **Expected Response:**
   ```json
   {
     "status": "healthy",
     "timestamp": 1234567890,
     "version": "1.0.0"
   }
   ```
4. **Keyword to Check:** `"status":"healthy"`
5. Click **"Create Monitor"**

#### **C) Worker Health Check** (if exposed)

```
Monitor Type: HTTP(S)
Friendly Name: Jewelshot - Worker
URL: https://your-worker.railway.app/health
Monitoring Interval: 5 minutes
```

#### **D) Admin Dashboard**

```
Monitor Type: HTTP(S)
Friendly Name: Jewelshot - Admin Panel
URL: https://www.jewelshot.ai/admin
Monitoring Interval: 15 minutes
```

### **Step 3: Configure Alerts**

#### **Email Alerts**

1. Go to **"My Settings" → "Alert Contacts"**
2. Click **"Add Alert Contact"**
3. Configure:
   ```
   Type: Email
   Email Address: your-email@example.com
   Friendly Name: Primary Admin
   ```
4. Verify email

#### **SMS Alerts** (Paid Plans)

```
Type: SMS
Phone Number: +1234567890
Friendly Name: Emergency Contact
```

#### **Webhook Alerts** (for Slack/Discord)

**Slack:**
1. Create Slack incoming webhook
2. Add as webhook alert contact
3. URL: `https://hooks.slack.com/services/YOUR/WEBHOOK/URL`

**Discord:**
1. Server Settings → Integrations → Webhooks
2. Copy webhook URL
3. Add to UptimeRobot
4. Format URL as: `https://discord.com/api/webhooks/ID/TOKEN/slack`

### **Step 4: Set Alert Thresholds**

For each monitor:
1. Click monitor name
2. Go to **"Alert Contacts"**
3. Select which contacts to notify
4. Configure:
   ```
   Send alerts when: Down
   Send alert when down for: 5 minutes (1 failed check)
   Send notifications to: [Select your alert contacts]
   ```

---

## 📈 **Admin Dashboard Metrics**

**Already implemented! Access at:**  
https://www.jewelshot.ai/admin

### **Available Metrics:**

**📊 Analytics Tab:**
- Daily active users
- Total operations
- Revenue metrics
- Credit usage
- Daily costs

**👥 Users Tab:**
- Total users
- Active users
- Credit statistics
- User activity

**🖼️ Images Tab:**
- Total images generated
- Storage usage
- Operation breakdown

**📝 Activity Log:**
- Recent operations
- User actions
- Error tracking

**🔍 Audit Logs:**
- Admin actions
- User changes
- System events

---

## 🐛 **Error Tracking (Sentry)**

**Already configured and working!**

### **Access:**
https://jewelshot.sentry.io/issues/

### **What's Monitored:**
- ✅ JavaScript errors (client-side)
- ✅ API errors (server-side)
- ✅ Unhandled exceptions
- ✅ Network failures
- ✅ Performance issues

### **Alerts Configuration:**

1. Go to **Sentry → Alerts**
2. Create alert:
   ```
   Alert Name: High Error Rate
   Condition: Number of events > 50 in 1 hour
   Action: Send email to admin@jewelshot.ai
   ```

3. Create second alert:
   ```
   Alert Name: Critical Error
   Condition: Error tagged as "critical"
   Action: Send email + Slack notification
   ```

---

## 📊 **Analytics (Plausible)**

**Already configured!**

### **Access:**
https://plausible.io/jewelshot.ai

### **Metrics Available:**
- Page views
- Unique visitors
- Bounce rate
- Traffic sources
- Device/Browser stats
- Goal conversions

### **Goals to Track:**

Add these custom events in Plausible:
1. **User Signup** → Event: `signup`
2. **AI Operation** → Event: `generate`
3. **Credit Purchase** → Event: `purchase`
4. **Batch Complete** → Event: `batch_complete`

---

## 🔥 **Custom Health Check Endpoint**

Create `/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/redis';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: Date.now(),
    version: '1.0.0',
    services: {
      redis: false,
      supabase: false,
      worker: false,
    },
  };

  try {
    // Check Redis
    const redis = createClient();
    await redis.ping();
    checks.services.redis = true;
  } catch (error) {
    checks.status = 'degraded';
  }

  try {
    // Check Supabase
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('user_credits')
      .select('id')
      .limit(1);
    checks.services.supabase = !error;
  } catch (error) {
    checks.status = 'degraded';
  }

  try {
    // Check Worker (via queue health)
    const redis = createClient();
    const queueLength = await redis.llen('ai-queue');
    const lastHeartbeat = await redis.get('worker:heartbeat');
    const workerAlive = lastHeartbeat && 
      (Date.now() - parseInt(lastHeartbeat)) < 60000;
    checks.services.worker = workerAlive;
  } catch (error) {
    checks.status = 'degraded';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}
```

**Test it:**
```bash
curl https://www.jewelshot.ai/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": 1701234567890,
  "version": "1.0.0",
  "services": {
    "redis": true,
    "supabase": true,
    "worker": true
  }
}
```

---

## 📱 **Status Page** (Optional)

### **Option 1: Public Status Page**

Create `/app/status/page.tsx`:

```typescript
export default async function StatusPage() {
  const response = await fetch('/api/health', { cache: 'no-store' });
  const health = await response.json();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Jewelshot Status</h1>
        
        <div className={`p-6 rounded-lg ${
          health.status === 'healthy' ? 'bg-green-100' : 'bg-yellow-100'
        }`}>
          <div className="text-2xl font-semibold mb-4">
            {health.status === 'healthy' ? '✅ All Systems Operational' : '⚠️ Degraded Performance'}
          </div>
          
          <div className="space-y-2">
            <StatusItem name="Website" status={health.services.supabase} />
            <StatusItem name="API" status={health.services.redis} />
            <StatusItem name="AI Worker" status={health.services.worker} />
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Last updated: {new Date(health.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function StatusItem({ name, status }: { name: string; status: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded">
      <span className="font-medium">{name}</span>
      <span className={status ? 'text-green-600' : 'text-red-600'}>
        {status ? '✓ Operational' : '✗ Down'}
      </span>
    </div>
  );
}
```

### **Option 2: Use Status Page Service**

**statuspage.io** (by Atlassian):
- Professional status page
- Incident management
- Subscriber notifications
- Free tier available

**Better Uptime** (by Better Stack):
- Beautiful status pages
- Public incidents
- Email subscribers
- $10/month

---

## ⚡ **Performance Monitoring** (Future)

### **Option 1: Vercel Analytics**

Already included in Vercel Pro:
- Web Vitals (LCP, FID, CLS)
- Real User Monitoring (RUM)
- Geographic performance
- Device breakdown

### **Option 2: New Relic** (Advanced)

For deep performance insights:
- APM (Application Performance Monitoring)
- Transaction traces
- Database queries
- External service calls
- ~$99/month

---

## 🚨 **Alert Escalation Matrix**

| Severity | Condition | Alert To | Response Time |
|----------|-----------|----------|---------------|
| 🟢 Low | Queue > 100 jobs | Email | 24 hours |
| 🟡 Medium | API response > 5s | Email + Slack | 4 hours |
| 🟠 High | Site down > 5 min | Email + SMS | 1 hour |
| 🔴 Critical | Database down | Email + SMS + Call | 15 minutes |

---

## 📋 **Monitoring Checklist**

```bash
[ ] UptimeRobot account created
[ ] Main website monitor added
[ ] API health check monitor added
[ ] Email alerts configured
[ ] Webhook alerts configured (Slack/Discord)
[ ] Health check endpoint created (/api/health)
[ ] Sentry alerts configured
[ ] Plausible goals set up
[ ] Admin dashboard accessible
[ ] Status page created (optional)
[ ] Test all monitors manually
```

---

## 📚 **Related Documentation**

- [Admin Dashboard](./ADMIN_DASHBOARD_GUIDE.md)
- [Sentry Setup](./sentry.config.ts)
- [Analytics Setup](./ANALYTICS_SETUP.md)
- [Error Handling](./lib/error-handler.ts)

---

**Last Updated:** November 28, 2025  
**Maintained By:** Jewelshot Team

