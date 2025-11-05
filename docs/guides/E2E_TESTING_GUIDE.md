# E2E Testing Guide

## 📋 Overview

This project uses **Playwright** for end-to-end (E2E) testing. Tests cover critical user flows including authentication, image upload, AI generation, gallery management, and rate limiting.

## 🚀 Quick Start

### Run All E2E Tests

```bash
npm run test:e2e
```

### Run Tests with UI Mode (Interactive)

```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:e2e:headed
```

### Debug Tests

```bash
npm run test:e2e:debug
```

### View Test Report

```bash
npm run test:e2e:report
```

### Run All Tests (Unit + E2E)

```bash
npm run test:all
```

## 📁 Test Structure

```
e2e/
├── auth.spec.ts          # Authentication flows (signup, login, logout)
├── studio.spec.ts        # Image upload & canvas interactions
├── gallery.spec.ts       # Gallery page & image management
├── rate-limiting.spec.ts # Rate limit indicator & enforcement
└── fixtures/             # Test data and helper files
    └── README.md
```

## ✅ Test Coverage

### 1. Authentication Tests (`auth.spec.ts`)

- **Landing page**: Verify page loads with navigation elements
- **Signup flow**:
  - Navigate to signup page
  - Password validation (min 6 characters)
  - Successful account creation
  - Duplicate email prevention
- **Login flow**:
  - Navigate to login page
  - Invalid credentials error handling
  - Successful login with valid credentials
  - Forgot password link functionality
- **Navigation**: Switch between login/signup, back button
- **Protected routes**: Redirect unauthenticated users

**Total**: 14 tests

### 2. Studio Tests (`studio.spec.ts`)

- **Page load**: Studio loads with all UI elements
- **Sidebar navigation**: Working links to gallery
- **Image upload**:
  - Successful image upload
  - Compression progress tracking
  - File type validation
- **Canvas interactions**:
  - Display uploaded image
  - Zoom controls
  - View mode options
  - Image download functionality
- **Save to gallery**: Save uploaded images
- **AI integration**:
  - AI edit controls presence
  - Rate limit indicator visibility

**Total**: 15 tests

### 3. Gallery Tests (`gallery.spec.ts`)

- **Page load**: Gallery loads successfully
- **Empty state**: Show message for new users
- **Navigation**: Back to studio
- **Image display**:
  - Grid of images (if any exist)
  - Image metadata (date, size)
- **Image actions**:
  - Click to view details (modal)
  - Download functionality
  - Delete with confirmation
- **Integration**:
  - Show newly saved images from studio
  - Maintain state across navigation

**Total**: 11 tests

### 4. Rate Limiting Tests (`rate-limiting.spec.ts`)

- **Indicator**:
  - Display on studio page
  - Show correct initial quota (5/5)
  - Color-coded status (green/yellow/red)
- **Enforcement**:
  - Rate limit protection on AI endpoints
  - Client-side rate limit checks
- **Error messages**:
  - Error handling for exceeded limits
  - Countdown timer display
  - Clear, user-friendly messages
- **Quota management**:
  - Show remaining requests
  - Persist quota across reloads
  - 60-second cooldown window
- **Retry mechanism**:
  - Retry button after cooldown
  - Auto-enable retry after countdown
- **Global vs user limits**:
  - Per-user rate limiting
  - Global rate limit messages

**Total**: 14 tests

## 🎯 Running Specific Tests

### Run Single Test File

```bash
npx playwright test auth.spec.ts
```

### Run Specific Test by Name

```bash
npx playwright test -g "should successfully login"
```

### Run Tests in Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 🔧 Configuration

E2E tests are configured in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000` (auto-starts dev server)
- **Timeout**: 60 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Parallel execution**: Yes (except on CI)
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

## 🧪 Test Data

### Test Users

Tests create unique users per run to avoid conflicts:

- **Auth tests**: `test-${Date.now()}@example.com`
- **Studio tests**: `test-studio-${Date.now()}@example.com`
- **Gallery tests**: `test-gallery-${Date.now()}@example.com`
- **Rate limiting tests**: `test-ratelimit-${Date.now()}@example.com`

### Test Images

Tests use a **1x1 pixel PNG** (base64 encoded) for fast uploads without external dependencies.

## 📊 CI Integration

E2E tests run automatically on:

- **Push** to `main` or `develop` branches
- **Pull requests** to `main` or `develop`
- **Manual trigger** via GitHub Actions

### GitHub Actions Workflow

See `.github/workflows/e2e-tests.yml`:

- **Parallel execution**: 2 shards for faster runs
- **Browser**: Chromium only (for speed)
- **Artifacts**: Test results & HTML reports (7-day retention)
- **Summary**: Auto-generated test summary in PR

### Required Secrets

Configure these in GitHub repository settings:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
FAL_AI_API_KEY
```

## 🐛 Debugging Tests

### 1. Use Playwright UI Mode

```bash
npm run test:e2e:ui
```

- Interactive test runner
- Time travel debugging
- Step-by-step execution

### 2. Use Debug Mode

```bash
npm run test:e2e:debug
```

- Opens Playwright Inspector
- Set breakpoints
- Inspect selectors

### 3. Run in Headed Mode

```bash
npm run test:e2e:headed
```

- See browser actions in real-time
- Useful for understanding failures

### 4. Check Test Results

```bash
npm run test:e2e:report
```

- Opens HTML report
- Screenshots & videos of failures
- Full trace viewer

## 📝 Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // 1. Arrange
    await page.goto('/some-page');

    // 2. Act
    await page.getByRole('button', { name: /click me/i }).click();

    // 3. Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Best Practices

1. **Use semantic locators**:

   ```typescript
   // Good
   page.getByRole('button', { name: /sign in/i });
   page.getByPlaceholder(/email/i);

   // Avoid
   page.locator('#btn-123');
   ```

2. **Wait for state, not time**:

   ```typescript
   // Good
   await expect(page.locator('.loading')).toBeVisible();
   await expect(page.locator('.loading')).not.toBeVisible();

   // Avoid
   await page.waitForTimeout(5000);
   ```

3. **Use unique test data**:

   ```typescript
   const testEmail = `test-${Date.now()}@example.com`;
   ```

4. **Clean up after tests**:

   ```typescript
   test.afterEach(async ({ page }) => {
     // Delete test data
     await cleanup();
   });
   ```

5. **Group related tests**:

   ```typescript
   test.describe('Login Flow', () => {
     test.describe('Success Cases', () => {
       // ...
     });

     test.describe('Error Cases', () => {
       // ...
     });
   });
   ```

## 🔍 Common Issues

### Issue: "Test timeout"

**Solution**: Increase timeout in test or config

```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes
  // ...
});
```

### Issue: "Element not found"

**Solution**: Wait for element or check selector

```typescript
await page.waitForSelector('.my-element', { state: 'visible' });
```

### Issue: "Tests pass locally but fail in CI"

**Solution**: Check for:

- Environment variables
- Race conditions (add proper waits)
- Viewport size differences
- Network latency

### Issue: "Flaky tests"

**Solution**:

- Avoid `waitForTimeout()`
- Use `waitForLoadState('networkidle')`
- Add retry logic
- Check for animations (wait for them to finish)

## 📈 Test Metrics

### Current Status

- ✅ **54 E2E tests** covering critical flows
- ✅ **100% pass rate** on main branch
- ✅ **CI/CD integrated** with GitHub Actions
- ✅ **Parallel execution** (2 shards)
- ✅ **Auto-generated reports** with artifacts

### Coverage Areas

- ✅ Authentication (signup, login, protected routes)
- ✅ Image upload & compression
- ✅ Canvas interactions (zoom, view modes)
- ✅ AI generation integration
- ✅ Gallery management (view, delete, save)
- ✅ Rate limiting (indicator, enforcement, UX)

## 🎓 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Debugging Tests](https://playwright.dev/docs/debug)

## 🤝 Contributing

When adding new features:

1. Write E2E tests covering the happy path
2. Add error case tests
3. Run tests locally before pushing
4. Ensure tests pass in CI
5. Update this guide if needed

---

**Happy Testing! 🎉**
