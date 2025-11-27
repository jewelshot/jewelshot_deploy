# 📊 Analytics Setup Guide

## Plausible Analytics Integration

**Privacy-focused, GDPR-compliant analytics for Jewelshot**

---

## 🎯 Features

✅ **Privacy-Focused** - No cookies, GDPR compliant
✅ **Lightweight** - < 1KB script, doesn't slow down site
✅ **Real-time** - Live visitor tracking
✅ **Custom Events** - Track conversions, signups, purchases
✅ **FREE** - 10,000 events/month on free tier

---

## 🚀 Setup (5 minutes)

### **1. Create Plausible Account**

Go to: https://plausible.io/register

**OR use self-hosted free version:**
https://plausible.io/self-hosted-web-analytics

### **2. Add Your Site**

1. Click **"+ Add website"**
2. Domain: `jewelshot.ai` (without https://)
3. Timezone: `UTC` or your preferred timezone
4. Click **"Add snippet"**

### **3. Verify Installation**

After deploying:
1. Go to https://jewelshot.ai
2. Check Plausible dashboard
3. Should see real-time visitor!

✅ **That's it!** No environment variables needed.

---

## 📈 What Gets Tracked

### **Automatic (Pageviews)**

- ✅ Every page visit
- ✅ Unique visitors
- ✅ Bounce rate
- ✅ Visit duration
- ✅ Top pages
- ✅ Traffic sources
- ✅ Countries/devices

### **Custom Events**

We track these important events:

| Event | When | Props |
|-------|------|-------|
| `Signup` | User registers | `method` (email/social) |
| `Login` | User logs in | - |
| `AI_Generation` | Image generated | `operation`, `credits` |
| `Upgrade` | User upgrades plan | `plan`, `amount` |
| `Credit_Purchase` | Credits purchased | `amount`, `credits` |
| `Batch_Create` | Batch created | `totalImages` |
| `Preset_Used` | Preset selected | `preset` |
| `Quick_Action` | Quick action used | `action` |
| `Error` | Error occurred | `type`, `code` |

---

## 💻 Usage in Code

### **Track Custom Events**

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const analytics = useAnalytics();

  const handleSignup = async () => {
    // ... signup logic ...
    analytics.trackSignup('email');
  };

  const handleGenerate = async () => {
    // ... generate logic ...
    analytics.trackGeneration('image-generation', 5);
  };

  const handlePurchase = async () => {
    // ... purchase logic ...
    analytics.trackCreditPurchase(9.99, 100);
  };

  return <div>...</div>;
}
```

### **Track Generic Events**

```typescript
const { track } = useAnalytics();

track('Button_Click', { button: 'hero_cta' });
track('Feature_Used', { feature: 'background_removal' });
```

---

## 📊 Dashboard Access

**Live Stats:**
https://plausible.io/jewelshot.ai

**What you'll see:**
- 📈 Real-time visitors
- 📍 Top pages
- 🌍 Countries
- 📱 Devices (desktop/mobile)
- 🔗 Referrers (where traffic comes from)
- 📊 Custom event funnels

---

## 🎯 Key Metrics to Watch

### **Growth Metrics**

```
Daily Active Users (DAU)
Monthly Active Users (MAU)
New Signups / Day
Signup Conversion Rate
```

### **Engagement Metrics**

```
Average Session Duration
Pages per Session
Top Features Used
Preset Popularity
```

### **Revenue Metrics**

```
Purchase Conversion Rate
Average Order Value
Credit Purchase Frequency
Upgrade Rate
```

### **Technical Metrics**

```
Error Rate
Bounce Rate
Page Load Time (via SpeedInsights)
```

---

## 🔍 Custom Goals

### **Set Up Goals in Plausible:**

1. Go to **Settings** → **Goals**
2. Add custom events:

```
✅ Signup
✅ Credit_Purchase
✅ Upgrade
✅ AI_Generation
```

3. Track conversion funnels:

```
Page View → Signup → AI_Generation → Credit_Purchase
```

---

## 🚨 Privacy Compliance

### **GDPR Compliant**

✅ No cookies
✅ No personal data collected
✅ No cross-site tracking
✅ Anonymous visitor tracking
✅ EU-hosted option available

### **No Cookie Banner Needed**

Since Plausible doesn't use cookies, you don't need a cookie consent banner!

---

## 💰 Pricing

**Free Tier:**
- 10,000 events/month
- 1 website
- Real-time stats
- Perfect for starting out

**Growth Plan ($9/month):**
- 100,000 events/month
- 10 websites
- Custom events
- Email reports

**Business Plan ($19/month):**
- 1M events/month
- 50 websites
- Priority support

**OR Self-host for FREE:**
https://plausible.io/docs/self-hosting

---

## 🛠️ Troubleshooting

### **Events not showing up?**

1. Check production deployment (doesn't track in dev)
2. Verify domain in Plausible settings
3. Check browser console for errors
4. Try incognito mode (ad blockers might block)

### **Script blocked by ad blocker?**

Use proxy (advanced):
https://plausible.io/docs/proxy/introduction

### **Want more events?**

Upgrade plan or self-host!

---

## 📚 Resources

- **Plausible Docs:** https://plausible.io/docs
- **Self-Hosting Guide:** https://plausible.io/docs/self-hosting
- **API Documentation:** https://plausible.io/docs/events-api
- **Privacy Policy:** https://plausible.io/privacy

---

## ✅ Verification Checklist

After deployment:

- [ ] Visit https://jewelshot.ai
- [ ] Open Plausible dashboard
- [ ] See real-time visitor
- [ ] Test signup event
- [ ] Test generation event
- [ ] Verify all custom events working

---

**Last updated:** 2024-01-28

