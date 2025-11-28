# 🔐 Google OAuth Setup Guide

**Enable Google Sign-In for Jewelshot**

---

## 📋 **Overview**

This guide will help you setup Google OAuth authentication, allowing users to sign in with their Google accounts.

**What you'll need:**
- Google Cloud Console access
- Supabase Dashboard access
- 15 minutes

---

## 🎯 **Step 1: Google Cloud Console Setup**

### **1.1 Create a Project** (if you don't have one)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Project name: `jewelshot`
4. Click **"Create"**

### **1.2 Enable OAuth Consent Screen**

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **"External"** (for public users)
3. Click **"Create"**

**Fill in:**
```
App name: Jewelshot
User support email: [your-email]
Developer contact: [your-email]
```

4. **Scopes** → Click **"Add or Remove Scopes"**
   - Select: `email`
   - Select: `profile`
   - Select: `openid`
5. Click **"Save and Continue"**

6. **Test Users** (Optional for development)
   - Add your email
7. Click **"Save and Continue"**

8. **Summary** → Click **"Back to Dashboard"**

### **1.3 Create OAuth Credentials**

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Application type: **Web application**
4. Name: `Jewelshot Web Client`

**Authorized JavaScript origins:**
```
http://localhost:3000
https://www.jewelshot.ai
https://jewelshot.vercel.app
```

**Authorized redirect URIs:**
```
http://localhost:3000/auth/callback
https://www.jewelshot.ai/auth/callback
https://jewelshot.vercel.app/auth/callback
```

**IMPORTANT:** For Supabase, you also need to add Supabase's redirect URI:
```
https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
```

Example:
```
https://abcdefghijklmnop.supabase.co/auth/v1/callback
```

5. Click **"Create"**
6. **Copy** the **Client ID** and **Client Secret** (you'll need these)

---

## 🗄️ **Step 2: Supabase Configuration**

### **2.1 Enable Google Provider**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **Authentication** → **Providers**
3. Find **Google** in the list
4. Toggle **"Enabled"**

### **2.2 Add Google Credentials**

Paste the credentials from Google Cloud Console:

```
Client ID: [paste from Google Console]
Client Secret: [paste from Google Console]
```

### **2.3 Configure Redirect URLs**

**Site URL:**
```
https://www.jewelshot.ai
```

**Redirect URLs (comma-separated):**
```
http://localhost:3000/auth/callback,
https://www.jewelshot.ai/auth/callback,
https://jewelshot.vercel.app/auth/callback
```

### **2.4 Save**

Click **"Save"** at the bottom.

---

## 🔧 **Step 3: Environment Variables**

You **don't need** to add Google credentials to `.env` because Supabase handles them.

Just ensure your Supabase credentials are set:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🗂️ **Step 4: Database Profile Creation**

When a user signs in with Google OAuth for the first time, a `profiles` record must be created.

### **4.1 Check if Trigger Exists**

Go to **Supabase Dashboard** → **SQL Editor** and run:

```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_name LIKE '%profile%';
```

If you see `on_auth_user_created` or similar, you're good. ✅

### **4.2 Create Trigger (if missing)**

If no trigger exists, run this migration:

```sql
-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger when a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**What this does:**
- When a user signs in with Google (or email)
- Automatically creates a `profiles` record
- Uses Google's `full_name` if available, else email prefix

---

## ✅ **Step 5: Test OAuth Flow**

### **5.1 Test Locally**

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open: http://localhost:3000/auth/login

3. Click **"Continue with Google"**

4. You should see:
   - Google sign-in popup
   - Permission request (email, profile)
   - Redirect to `/studio` on success

### **5.2 Verify Database**

After signing in, check Supabase:

```sql
SELECT * FROM auth.users WHERE email = 'your-test@gmail.com';
SELECT * FROM public.profiles WHERE email = 'your-test@gmail.com';
```

Both should have records. ✅

---

## 🐛 **Troubleshooting**

### **Error: "redirect_uri_mismatch"**

**Cause:** The redirect URI in your request doesn't match Google Console.

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Ensure these URIs are added:
   ```
   http://localhost:3000/auth/callback
   https://[YOUR-PROJECT].supabase.co/auth/v1/callback
   https://www.jewelshot.ai/auth/callback
   ```

---

### **Error: "Access blocked: This app's request is invalid"**

**Cause:** OAuth consent screen not configured.

**Fix:**
1. Go to Google Cloud Console → OAuth consent screen
2. Add required scopes: `email`, `profile`, `openid`
3. Add test users (for development)
4. Publish app (for production)

---

### **Error: "User not found" after Google sign-in**

**Cause:** Profile trigger not working.

**Fix:**
1. Check if trigger exists:
   ```sql
   SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
   ```
2. If missing, run the migration from **Step 4.2**
3. Test again

---

### **Error: "Email not confirmed"**

**Cause:** Supabase requires email confirmation, but Google accounts are auto-verified.

**Fix:**
1. Go to Supabase Dashboard → Authentication → Settings
2. **Email Confirmation** → Set to **"Disable"** for OAuth providers
3. Or update your middleware to skip verification for OAuth users:

```typescript
// src/middleware.ts
const isEmailVerified =
  user.email_confirmed_at ||
  user.app_metadata.provider === 'google'; // Auto-verify Google users
```

---

## 🔒 **Security Best Practices**

### **1. Verify Email Domain (Optional)**

If you want to restrict to specific domains (e.g., company emails):

```typescript
// src/app/auth/callback/route.ts
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (user && !user.email?.endsWith('@yourcompany.com')) {
  await supabase.auth.signOut();
  return NextResponse.redirect(`${origin}/auth/login?error=invalid_domain`);
}
```

### **2. Rate Limiting**

Google OAuth is already rate-limited by Supabase, but you can add extra protection:

```typescript
// src/app/auth/callback/route.ts
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  // Check IP-based rate limit
  const rateLimitResult = await checkRateLimit(request, {
    max: 10, // 10 OAuth attempts
    window: 60 * 5, // per 5 minutes
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many login attempts' },
      { status: 429 }
    );
  }

  // ... rest of callback logic
}
```

### **3. Audit Logging**

Track OAuth sign-ins:

```typescript
// After successful OAuth
await supabase.from('admin_logs').insert({
  user_id: user.id,
  action: 'oauth_login',
  ip_address: request.headers.get('x-forwarded-for'),
  details: { provider: 'google' },
});
```

---

## 🚀 **Production Checklist**

```bash
[ ] Google Cloud Console project created
[ ] OAuth consent screen configured
[ ] OAuth credentials created
[ ] Authorized redirect URIs added (production)
[ ] Supabase Google provider enabled
[ ] Google credentials added to Supabase
[ ] Profile creation trigger tested
[ ] Email verification flow verified
[ ] Error handling tested
[ ] OAuth tested on production URL
[ ] Audit logging implemented
[ ] Rate limiting configured
```

---

## 📊 **Monitoring**

### **Track OAuth Usage**

```sql
-- OAuth sign-ins (last 24h)
SELECT 
  COUNT(*) as oauth_logins,
  DATE_TRUNC('hour', created_at) as hour
FROM auth.users
WHERE raw_app_meta_data->>'provider' = 'google'
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;
```

### **Failed OAuth Attempts**

Check logs in:
- **Supabase Dashboard** → Logs → Auth Logs
- **Sentry** → Search for "OAuth" errors
- **Vercel Dashboard** → Logs → Filter "auth/callback"

---

## 📚 **Related Documentation**

- [Supabase OAuth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Auth Patterns](https://nextjs.org/docs/app/building-your-application/authentication)

---

**Last Updated:** November 28, 2025  
**Maintained By:** Jewelshot Team

**Need help?** Check [Troubleshooting](#troubleshooting) or contact support.

