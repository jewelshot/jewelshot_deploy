# 💎 Jewelshot

> Enterprise-grade AI image processing platform with queue-based architecture

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-243%20passing-success)](./TESTING.md)

## 🚀 Overview

Jewelshot is a production-ready SaaS platform for AI-powered image processing with comprehensive credit system, admin dashboard, and queue-based architecture.

### ✨ Key Features

**🎨 AI Image Processing:**
- Background removal
- Image upscaling (2x, 4x, 8x)
- Style transfer & filters
- Batch processing
- 20+ AI operations

**💳 Credit System:**
- Atomic reserve/confirm/refund pattern
- Transaction logging
- Admin credit management
- Low balance notifications

**👨‍💼 Admin Dashboard:**
- User management
- Credit operations
- Analytics & monitoring
- Audit logs
- Activity tracking

**🔒 Security & Compliance:**
- Row-level security (RLS)
- Rate limiting (IP + user)
- Anti-abuse detection
- GDPR/CCPA compliant
- Admin authentication

**📧 Notifications:**
- Email system (Resend)
- Welcome emails
- Batch completion alerts
- Credit warnings

**🛡️ Production Features:**
- Error tracking (Sentry)
- Analytics (Plausible)
- Automated backups
- API documentation (OpenAPI)
- 87.7% test coverage

## 🏗️ Architecture

```
jewelshot/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Atomic Design Pattern
│   │   ├── atoms/       # Basic components (AuroraBackground, Button, etc.)
│   │   ├── molecules/   # Composite components
│   │   ├── organisms/   # Complex components
│   │   └── templates/   # Page layouts
│   ├── features/        # Feature-based modules
│   ├── lib/             # External integrations (Supabase, fal.ai)
│   └── hooks/           # Custom React hooks
```

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- TypeScript 5
- Tailwind CSS 4
- Zustand (State Management)
- React Hook Form + Zod
- Framer Motion

**Backend:**
- Supabase (PostgreSQL + Auth + Storage)
- Redis/Upstash (Queue + Rate Limiting)
- FAL.AI (AI Processing)

**Infrastructure:**
- Vercel (Frontend Hosting)
- Railway (Worker Deployment)
- Resend (Email Service)

**Monitoring & Analytics:**
- Sentry (Error Tracking)
- Plausible (Privacy-Focused Analytics)
- UptimeRobot (Uptime Monitoring)

**Testing & CI/CD:**
- Vitest + React Testing Library
- GitHub Actions (Automated Testing)
- 243 tests, 87.7% coverage

## 📦 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/jewelshot/jewelshot_deploy.git
cd jewelshot_deploy

# 2. Install dependencies
npm install

# 3. Setup environment variables (see ENV_VARIABLES.md)
# Required: Supabase, Redis, FAL.AI
# Optional: Resend, Sentry, Plausible

# 4. Run Supabase migrations (see MIGRATION_GUIDE.md)
# Execute all 15 migration files in order

# 5. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📚 **Deployment Guides**

Before deploying, read these essential guides:

1. **[Environment Variables](./ENV_VARIABLES.md)** - Complete setup guide
2. **[Migration Guide](./MIGRATION_GUIDE.md)** - Database migrations
3. **[Worker Deployment](./WORKER_DEPLOYMENT.md)** - Railway worker setup
4. **[Redis Setup](./REDIS_SETUP.md)** - Upstash configuration
5. **[Email Setup](./EMAIL_SETUP_GUIDE.md)** - Resend integration

## ✅ **Production Checklist**

```bash
[ ] Environment variables set (Vercel + Railway)
[ ] Supabase migrations run (all 15 files)
[ ] Redis/Upstash database created
[ ] Worker deployed to Railway
[ ] Email service configured (Resend)
[ ] Admin dashboard key set
[ ] Sentry DSN configured
[ ] Domain verified for emails
[ ] Storage buckets created (images, batch-originals, backup)
[ ] Test AI operation works end-to-end
```

## 🧪 Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(studio): add aurora background component
fix(auth): resolve login redirect issue
docs(readme): update installation guide
test(studio): add unit tests for prompt generator
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

## 🌿 Branch Strategy

```
main            # Production-ready code
└── develop     # Integration branch
    ├── feature/studio-sidebar
    ├── feature/fal-ai-integration
    └── fix/animation-performance
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License

Copyright (c) 2025 Jewelshot

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

See [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation](docs/)
- [fal.ai Documentation](https://fal.ai/models/fal-ai/nano-banana/edit/api)
- [Supabase Docs](https://supabase.com/docs)

## 📊 **Project Status**

**Current Score:** 8.5/10 - **BETA READY** 🎉

### **✅ Completed** (11/12 Major Systems)

```
✅ Architecture & Queue System
✅ Credit Management (Atomic Operations)
✅ Admin Dashboard (Full User Management)
✅ Security & Compliance (RLS, Rate Limiting, Anti-Abuse)
✅ Email Notifications (Resend + Templates)
✅ Backup System (Automated Daily Backups)
✅ Error Tracking (Sentry - Live!)
✅ Analytics (Plausible)
✅ API Documentation (OpenAPI + Swagger)
✅ Testing (243 tests passing)
✅ CI/CD (GitHub Actions)
```

### **🔴 Missing** (for Full Launch)

```
❌ Payment System (Stripe Integration) - 2-3 days
```

### **🟡 Optional Improvements**

```
🟡 Component Tests (atoms/molecules)
🟡 API Route Tests (full coverage)
🟡 E2E Tests (Playwright)
🟡 Staging Environment
🟡 Load Testing
```

## 🚀 **Launch Strategy**

### **Option 1: Beta Launch (NOW)** ⚡
- Deploy current version
- Invite 50-100 beta users
- Free credits only (no payment)
- Collect feedback
- Build payment in parallel

### **Option 2: Full Launch (4-5 Days)** 💳
- Add Stripe payment system
- Test thoroughly
- Public launch with monetization

---

## 📖 **Documentation**

- [Environment Variables](./ENV_VARIABLES.md)
- [Worker Deployment](./WORKER_DEPLOYMENT.md)
- [Redis Setup](./REDIS_SETUP.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Email Setup](./EMAIL_SETUP_GUIDE.md)
- [Anti-Abuse Guide](./ANTI_ABUSE_GUIDE.md)
- [Backup Guide](./BACKUP_GUIDE.md)
- [Testing Guide](./TESTING.md)
- [API Documentation](./API_DOCUMENTATION.md)

---

## 🤝 **Contributing**

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 **License**

MIT License - See [LICENSE](LICENSE) for details.

---

## 🚀 **Deployment**

### Production Deployment

```bash
# Automatic deployment on push to main
git push origin main

# Vercel automatically builds and deploys
# URL: https://www.jewelshot.ai
```

### Staging Deployment

```bash
# Deploy to staging environment
npm run staging:deploy

# Or manually:
git checkout staging
git merge main
git push origin staging

# Run smoke tests
npm run staging:test
```

See [STAGING_ENVIRONMENT.md](./STAGING_ENVIRONMENT.md) for complete setup guide.

### Environment-Specific URLs

- **Production:** https://www.jewelshot.ai
- **Staging:** https://staging.jewelshot.ai (or Vercel preview URL)
- **Development:** http://localhost:3000

---

## 🔗 **Links**

- **Live Demo:** [https://www.jewelshot.ai](https://www.jewelshot.ai)
- **Admin Dashboard:** [https://www.jewelshot.ai/admin](https://www.jewelshot.ai/admin)
- **API Docs:** [https://www.jewelshot.ai/docs/api](https://www.jewelshot.ai/docs/api)
- **Status Page:** [Coming Soon]

---

Built with ❤️ by **Jewelshot Team**  
**Last Updated:** November 28, 2025
