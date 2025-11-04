# 🚨 Sentry Setup Guide

## Quick Start (5 minutes)

### 1. Create Sentry Account
1. Go to https://sentry.io/signup/
2. Create a new organization (e.g., "jewelshot")
3. Create a new project:
   - Platform: **Next.js**
   - Name: **jewelshot** (or your project name)

### 2. Get Your DSN
1. After project creation, copy your **DSN**
2. It looks like: `https://xxxxx@sentry.io/xxxxx`

### 3. Add to Environment Variables

#### Local Development (.env.local)
```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id
SENTRY_ORG=your-org-name
SENTRY_PROJECT=jewelshot
SENTRY_AUTH_TOKEN=your-auth-token  # Get from: https://sentry.io/settings/account/api/auth-tokens/
```

#### Vercel Production
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add these variables:
   - `NEXT_PUBLIC_SENTRY_DSN`: Your DSN
   - `SENTRY_ORG`: Your org name
   - `SENTRY_PROJECT`: jewelshot
   - `SENTRY_AUTH_TOKEN`: Your auth token (secret)

### 4. Test It

#### Test Error Tracking
```bash
# Run dev server
npm run dev

# Visit: http://localhost:3000
# Open browser console and run:
throw new Error("Test Sentry!");

# Check Sentry dashboard → Should see the error!
```

#### Test Production Build
```bash
# Build
npm run build

# Start
npm start

# Trigger an error and check Sentry dashboard
```

---

## Features Enabled

### ✅ Error Tracking
- Client-side errors (browser)
- Server-side errors (API routes)
- Edge errors (middleware)

### ✅ Session Replay
- Record user sessions when errors occur
- See exactly what user was doing
- Replay rate: 10% (configurable)

### ✅ Performance Monitoring
- Track slow API calls
- Monitor page load times
- Identify bottlenecks

### ✅ Ignored Errors
Already configured to ignore common noise:
- Browser extensions
- Network timeouts
- Supabase auth refresh (expected)
- ResizeObserver (cosmetic)

---

## Monitoring in Production

### Dashboard Access
https://sentry.io/organizations/YOUR_ORG/issues/

### Key Metrics
- **Error Rate**: Should be < 1% of sessions
- **Response Time**: API routes < 500ms
- **User Impact**: Track affected users

### Alerts
Configure alerts for:
1. High error rate (> 10 errors/minute)
2. New error types (first seen)
3. Performance degradation (> 2s response)

---

## Cost

- **Free Tier**: 
  - 5,000 errors/month
  - 500 replays/month
  - 10,000 performance units/month
  
- **Sufficient for:**
  - MVP/small apps
  - ~1,000 daily users
  - Basic monitoring

- **Upgrade when:**
  - > 5,000 errors/month
  - Need longer data retention
  - More than 1 project

---

## Troubleshooting

### No Errors Showing Up?
1. Check DSN is correct
2. Verify environment variables in Vercel
3. Check Sentry project is active
4. Look in browser console for Sentry errors

### Too Many Errors?
1. Add to `ignoreErrors` in sentry config
2. Filter out bot traffic
3. Check if real issues or noise

### Source Maps Not Working?
1. Verify `SENTRY_AUTH_TOKEN` is set
2. Check build logs for Sentry upload
3. Ensure `SENTRY_ORG` and `SENTRY_PROJECT` are correct

---

## Advanced Configuration

### Custom Context
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.setUser({
  id: user.id,
  email: user.email,
});

Sentry.setContext('custom', {
  imageCount: 10,
  subscription: 'free'
});
```

### Manual Error Capture
```typescript
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    extra: { context: 'image-upload' }
  });
}
```

### Performance Tracking
```typescript
const transaction = Sentry.startTransaction({
  name: 'AI Image Generation',
  op: 'ai.generate'
});

// ... your code ...

transaction.finish();
```

---

## Best Practices

1. **Don't log sensitive data**
   - Mask PII (emails, names)
   - Avoid logging API keys
   - Use `beforeSend` hook to scrub

2. **Set proper release tracking**
   - Use git commit SHA
   - Enable source maps
   - Track deployments

3. **Configure sampling**
   - 100% errors in production
   - 10% replays (adjust based on traffic)
   - 10% transactions (adjust based on volume)

4. **Create alerts**
   - New error types
   - High error rate
   - Performance degradation

---

## Support

- Sentry Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Community: https://forum.sentry.io/
- Status: https://status.sentry.io/




