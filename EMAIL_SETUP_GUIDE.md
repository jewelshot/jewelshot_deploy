# 📧 EMAIL NOTIFICATION SYSTEM SETUP

## ✅ Completed

Your email notification system is now fully integrated! Here's what's been added:

### **Features:**

1. **Welcome Email** ✨
   - Sent when user signs up
   - Includes free credits info
   - Quick start guide
   
2. **Batch Complete Email** 📦
   - Sent when batch processing finishes
   - Shows success/failure stats
   - Direct link to gallery

3. **Credits Low Warning** ⚠️
   - Sent when credits drop to 5 or below
   - Sent again when depleted (0 credits)
   - Shows credit packages

### **Technical Stack:**

- **Resend** - Email delivery service
- **React Email** - Beautiful HTML email templates
- **Database Tracking** - All emails logged in `email_logs` table
- **User Preferences** - Users can opt-out in `email_preferences`

---

## 🔧 Setup Required

### **1. Get Resend API Key**

1. Go to [resend.com](https://resend.com)
2. Sign up / Log in
3. Create an API key
4. Copy the key (starts with `re_`)

### **2. Configure Environment Variables**

Add these to `.env.local` and Vercel:

```env
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here

# Email From Address (use your verified domain)
EMAIL_FROM="Jewelshot <noreply@jewelshot.ai>"

# Internal API Secret (for email endpoint security)
INTERNAL_API_SECRET=your_random_secret_here_min_32_chars
```

**Generate INTERNAL_API_SECRET:**
```bash
openssl rand -hex 32
```

### **3. Verify Domain in Resend**

For production emails:

1. Go to Resend Dashboard → Domains
2. Add your domain: `jewelshot.ai`
3. Add DNS records (MX, TXT, CNAME)
4. Wait for verification (~5 min)

For testing, you can use `onboarding@resend.dev` (100 emails/day limit).

### **4. Run Database Migration**

In Supabase SQL Editor:

```sql
-- Run this migration
supabase/migrations/20250128_email_system.sql
```

This creates:
- `email_logs` table
- `email_preferences` table
- Helper functions

### **5. Deploy to Vercel**

Add environment variables in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `INTERNAL_API_SECRET`
3. Redeploy

---

## 📋 Email Triggers

### **Automatic Triggers:**

| Event | Email | Trigger Point |
|-------|-------|---------------|
| User Signup | Welcome | When user signs up (manual trigger needed) |
| Batch Complete | Batch Complete | When all images processed |
| Credits ≤ 5 | Credits Low | After any credit operation |
| Credits = 0 | Credits Depleted | After any credit operation |

### **Welcome Email Integration:**

Welcome email needs to be manually triggered after signup. Add this to your signup flow:

**Option A - Client-Side (auth.html):**
```javascript
// After successful signup
await fetch('/api/emails/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET}`,
  },
  body: JSON.stringify({
    type: 'welcome',
    data: {
      userEmail: user.email,
      userName: user.user_metadata?.name,
      creditsReceived: 5,
    },
  }),
});
```

**Option B - Supabase Database Trigger:**

Create a Supabase Edge Function or Database Trigger to send welcome email on auth.users insert.

---

## 🧪 Testing

### **1. Test Email Locally:**

```bash
# Add .env.local variables
# Run dev server
npm run dev

# Trigger batch complete (complete a batch)
# Trigger credits low (use credits until < 5)
```

### **2. Test Email Templates:**

```bash
# Install email dev tools
npm install -D @react-email/cli

# Preview emails
npm run email:dev
```

Add to `package.json`:
```json
{
  "scripts": {
    "email:dev": "email dev -p 3001"
  }
}
```

### **3. Check Email Logs:**

```sql
-- See sent emails
SELECT * FROM email_logs 
ORDER BY created_at DESC 
LIMIT 50;

-- Check success rate
SELECT 
  email_type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'sent') as sent,
  COUNT(*) FILTER (WHERE status = 'failed') as failed
FROM email_logs
GROUP BY email_type;
```

---

## 🎨 Email Customization

### **Edit Templates:**

Templates are in `src/emails/`:
- `WelcomeEmail.tsx`
- `BatchCompleteEmail.tsx`
- `CreditsLowEmail.tsx`

### **Preview Changes:**

```bash
npm run email:dev
# Open http://localhost:3001
```

### **Add New Email Type:**

1. Create template in `src/emails/NewEmail.tsx`
2. Add to `email-service.ts` switch statement
3. Add type to `EmailType` union
4. Update `email_system.sql` migration (valid_email_type constraint)

---

## 📊 Monitoring

### **Admin Dashboard:**

View email stats in admin panel:
- Total sent/failed
- Emails by type
- Recent failures

### **Resend Dashboard:**

Monitor in Resend:
- Delivery rate
- Open rate
- Bounce rate
- Spam complaints

---

## 🚨 Troubleshooting

### **Emails not sending?**

1. Check `RESEND_API_KEY` is set
2. Check domain is verified
3. Check email logs: `SELECT * FROM email_logs WHERE status = 'failed'`
4. Check Resend dashboard for errors

### **Emails going to spam?**

1. Verify domain properly (all DNS records)
2. Add DMARC, SPF, DKIM records
3. Use a professional from email
4. Avoid spam trigger words in subject

### **Daily limit reached?**

1. Upgrade Resend plan
2. Check `email_preferences.max_emails_per_day`
3. Review who's sending what

---

## ✅ Next Steps

1. ✅ Set up Resend account
2. ✅ Add environment variables
3. ✅ Verify domain
4. ✅ Run database migration
5. ✅ Deploy to Vercel
6. ✅ Test emails
7. ⏳ Add welcome email trigger to signup
8. ⏳ Monitor email delivery

---

**Need help?** Check Resend docs: https://resend.com/docs

