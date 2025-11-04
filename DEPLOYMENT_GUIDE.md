# 🚀 JEWELSHOT - DEPLOYMENT GUIDE

## 📋 PREREQUISITES

Before deploying, make sure you have:

- [ ] GitHub account
- [ ] Vercel account (sign up at vercel.com)
- [ ] Supabase account (sign up at supabase.com)
- [ ] FAL.AI API key (get from fal.ai/dashboard/keys)

---

## 1️⃣ SUPABASE SETUP

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - Name: `jewelshot`
   - Database Password: (save this!)
   - Region: Choose closest to your users
4. Wait 2-3 minutes for project creation

### Step 2: Run Database Migration

1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste the SQL from `SUPABASE_SETUP.md`
3. Click "Run" to create tables and RLS policies

### Step 3: Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click "New Bucket"
3. Name: `images`
4. Public: ✅ (checked)
5. Click "Create Bucket"

### Step 4: Get API Keys

1. Go to **Project Settings** → **API**
2. Copy:
   - `Project URL` → Save as `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2️⃣ FAL.AI API KEY

1. Go to [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys)
2. Click "Create New Key"
3. Copy the key → Save as `FAL_AI_API_KEY`

---

## 3️⃣ GITHUB REPOSITORY

### Push to GitHub

```bash
cd /Users/yasin/Desktop/vortex/jewelshot

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "feat: production-ready jewelshot with supabase integration"

# Create GitHub repo and push
# Go to github.com → New Repository → jewelshot
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/jewelshot.git
git branch -M main
git push -u origin main
```

---

## 4️⃣ VERCEL DEPLOYMENT

### Step 1: Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your `jewelshot` repo
4. Click "Import"

### Step 2: Configure Environment Variables

In Vercel deployment settings, add these:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# FAL.AI (Server-side only)
FAL_AI_API_KEY=your-fal-api-key-here

# Site URL (for production)
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# Optional
NEXT_PUBLIC_MAX_GALLERY_IMAGES=100
NEXT_PUBLIC_APP_ENV=production
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. ✅ Done! Your app is live

---

## 5️⃣ POST-DEPLOYMENT CHECKS

### Test Basic Features

1. **Landing Page**: Visit your Vercel URL
2. **Sign Up**: Create an account
3. **Studio**: Upload an image
4. **AI Edit**: Try AI generation
5. **Gallery**: Check if images save to Supabase

### Check Supabase Database

1. Go to Supabase → **Table Editor**
2. Check `profiles` table → Should have your user
3. Check `images` table → Should have test images

### Monitor Errors

1. Vercel → Your Project → **Logs**
2. Check for any runtime errors
3. Fix issues and redeploy

---

## 6️⃣ CUSTOM DOMAIN (Optional)

### Add Custom Domain in Vercel

1. Go to Project Settings → **Domains**
2. Add your domain (e.g., `jewelshot.com`)
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### Update Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=https://jewelshot.com
```

---

## 🐛 TROUBLESHOOTING

### Build Fails

**Error: Missing environment variables**
- Solution: Double-check all env vars in Vercel dashboard

**Error: TypeScript errors**
- Solution: Run `npm run build` locally first
- Fix all TypeScript errors before deploying

### Supabase Connection Issues

**Error: "Invalid API key"**
- Solution: Make sure you copied the `anon` key, not `service_role`

**Error: "Row Level Security policy violation"**
- Solution: Check RLS policies in Supabase

### FAL.AI Issues

**Error: "FAL.AI API key not configured"**
- Solution: Make sure `FAL_AI_API_KEY` is set in Vercel (not `NEXT_PUBLIC_`)

**Error: "Rate limit exceeded"**
- Solution: Check your FAL.AI usage dashboard

---

## 📊 MONITORING & ANALYTICS

### Vercel Analytics

1. Go to Project → **Analytics**
2. Enable Vercel Analytics (free tier available)

### Supabase Logs

1. Go to Supabase → **Logs**
2. Monitor API requests and errors

---

## 🔒 SECURITY CHECKLIST

- [x] FAL.AI API key is server-side only (`FAL_AI_API_KEY`)
- [x] Supabase RLS policies are enabled
- [x] Environment variables are in Vercel dashboard (not in code)
- [x] `.env.local` is in `.gitignore`
- [x] HTTPS is enabled (automatic with Vercel)

---

## 🎉 SUCCESS!

Your Jewelshot app is now live! 

**Next Steps:**
- Test all features thoroughly
- Monitor error logs for first 24h
- Collect user feedback
- Plan next features

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- FAL.AI Docs: https://fal.ai/docs

**Generated:** $(date)
**Version:** 1.0.0
