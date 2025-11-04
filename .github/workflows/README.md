# 🚀 CI/CD Workflows

This directory contains GitHub Actions workflows for automated testing and deployment.

## Workflows

### 1. CI Pipeline (`ci.yml`)
**Triggers:** Every push and PR to `main` or `develop`

**Jobs:**
- ✅ **Lint & Format:** ESLint + Prettier checks
- ✅ **Type Check:** TypeScript compilation
- ✅ **Unit Tests:** Vitest with coverage
- ✅ **Build Test:** Next.js production build
- ✅ **Security Audit:** npm audit for vulnerabilities
- ✅ **Dependency Check:** Verify package-lock.json

**Duration:** ~5-10 minutes

### 2. Deploy Preview (`deploy-preview.yml`)
**Triggers:** PRs to `main` branch

**Actions:**
- 🚀 Deploys to Vercel Preview
- 💬 Comments PR with preview URL
- ⚡ Auto-updates on new commits

**Duration:** ~3-5 minutes

### 3. Deploy Production (`deploy-production.yml`)
**Triggers:** Push to `main` branch

**Actions:**
- 🚀 Deploys to Vercel Production
- 📊 Creates Sentry release
- ✅ Notifies on success/failure

**Duration:** ~5-8 minutes

---

## Setup Instructions

### GitHub Secrets Required

Add these in: `Settings → Secrets and variables → Actions`

#### Vercel Deployment
```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

**Get these from:**
1. Vercel Token: https://vercel.com/account/tokens
2. Org ID & Project ID: Run `vercel link` in your project

#### Sentry (Optional)
```
SENTRY_AUTH_TOKEN=your-sentry-auth-token
SENTRY_ORG=your-org-name
SENTRY_PROJECT=jewelshot
```

**Get token from:** https://sentry.io/settings/account/api/auth-tokens/

#### Codecov (Optional)
```
CODECOV_TOKEN=your-codecov-token
```

**Get token from:** https://codecov.io/gh/your-repo

---

## Local Testing

Test workflows locally with [act](https://github.com/nektos/act):

```bash
# Install act
brew install act

# Test CI workflow
act -j lint
act -j type-check
act -j test
act -j build

# Test all jobs
act push
```

---

## Workflow Status

View workflow runs:
- https://github.com/jewelshot/jewelshot_deploy/actions

### Status Badges

Add to README.md:

```markdown
[![CI](https://github.com/jewelshot/jewelshot_deploy/workflows/CI/badge.svg)](https://github.com/jewelshot/jewelshot_deploy/actions)
[![Deploy](https://github.com/jewelshot/jewelshot_deploy/workflows/Deploy%20Production/badge.svg)](https://github.com/jewelshot/jewelshot_deploy/actions)
```

---

## Troubleshooting

### CI Failing?

1. **Lint errors:** Run `npm run lint:fix` locally
2. **Type errors:** Run `npm run type-check` locally
3. **Test failures:** Run `npm run test` locally
4. **Build errors:** Run `npm run build` locally

### Deploy Failing?

1. Check Vercel secrets are set correctly
2. Verify environment variables in Vercel dashboard
3. Check Vercel deployment logs
4. Ensure all required env vars are in Vercel

### Security Audit Failing?

1. Run `npm audit` locally
2. Fix high/critical vulnerabilities: `npm audit fix`
3. If can't fix, add exception in workflow

---

## Best Practices

### Branch Protection
Enable in: `Settings → Branches → main`

Required checks:
- ✅ Lint & Format
- ✅ Type Check
- ✅ Unit Tests
- ✅ Build Test
- ✅ Security Audit

### PR Guidelines
1. All checks must pass before merge
2. At least 1 approval required
3. Up-to-date with base branch
4. Delete branch after merge

### Deployment Strategy
- **main branch:** Auto-deploys to production
- **develop branch:** Manual deploy or staging
- **feature branches:** Preview deployments on PR

---

## Cost Optimization

### GitHub Actions
- **Free tier:** 2,000 minutes/month
- **Current usage:** ~50 minutes/week (200/month)
- **Optimization:** Cache dependencies, parallel jobs

### Vercel
- **Free tier:** 100 deployments/day
- **Current usage:** ~10 deployments/day
- **Optimization:** Skip preview for draft PRs

---

## Monitoring

### Workflow Notifications
Configure in: `Settings → Notifications`

Options:
- Email on failure
- Slack integration
- Discord webhooks

### Analytics
- Track deployment frequency
- Measure build times
- Monitor success rate

Goal: > 95% success rate, < 10 min build time

