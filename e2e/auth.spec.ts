import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * 
 * Critical flows:
 * 1. User signup with validation
 * 2. User login success/failure
 * 3. Protected route access
 * 4. Logout flow
 * 
 * Note: These tests use unique email addresses to avoid conflicts
 */

test.describe('Authentication Flow', () => {
  // Generate unique test email for each test run
  const timestamp = Date.now();
  const testEmail = `test-${timestamp}@example.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';

  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('/');
  });

  test('should display landing page with navigation', async ({ page }) => {
    // Check if landing page loads
    await expect(page).toHaveTitle(/Jewelshot/i);
    
    // Check for key brand elements
    const brandElement = page.locator('text=Jewelshot').first();
    await expect(brandElement).toBeVisible();
    
    // Check for auth links in footer
    const signInLink = page.locator('a[href="/auth/login"]').first();
    const signUpLink = page.locator('a[href="/auth/signup"]').first();
    
    await expect(signInLink).toBeVisible();
    await expect(signUpLink).toBeVisible();
  });

  test.describe('Signup Flow', () => {
    test('should navigate to signup page', async ({ page }) => {
      // Navigate to signup page
      await page.goto('/auth/signup');
      
      // Should be on signup page
      await expect(page).toHaveURL(/\/auth\/signup/);
      
      // Check for signup form elements
      await expect(page.locator('text=Create Account')).toBeVisible();
      await expect(page.getByPlaceholder(/full name/i)).toBeVisible();
      await expect(page.getByPlaceholder(/email address/i)).toBeVisible();
      await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    });

    test('should validate password length', async ({ page }) => {
      await page.goto('/auth/signup');
      
      // Fill with short password
      await page.getByPlaceholder(/full name/i).fill(testName);
      await page.getByPlaceholder(/email address/i).fill(testEmail);
      await page.getByPlaceholder(/password/i).fill('123');
      
      // Try to submit
      await page.getByRole('button', { name: /create account/i }).click();
      
      // Should show error
      await expect(page.locator('text=/password must be at least 6 characters/i')).toBeVisible({ timeout: 3000 });
    });

    test('should successfully create new account', async ({ page }) => {
      await page.goto('/auth/signup');
      
      // Fill signup form
      await page.getByPlaceholder(/full name/i).fill(testName);
      await page.getByPlaceholder(/email address/i).fill(testEmail);
      await page.getByPlaceholder(/password/i).fill(testPassword);
      
      // Submit form
      await page.getByRole('button', { name: /create account/i }).click();
      
      // Should show success message or redirect
      await page.waitForTimeout(2500);
      
      // Check for success (either success message or redirect to studio)
      const url = page.url();
      const hasSuccessMessage = await page.locator('text=/account created successfully/i').isVisible()
        .catch(() => false);
      
      expect(
        url.includes('/studio') || hasSuccessMessage
      ).toBeTruthy();
    });

    test('should prevent duplicate account creation', async ({ page }) => {
      await page.goto('/auth/signup');
      
      // Try to create account with same email
      await page.getByPlaceholder(/full name/i).fill(testName);
      await page.getByPlaceholder(/email address/i).fill(testEmail);
      await page.getByPlaceholder(/password/i).fill(testPassword);
      
      await page.getByRole('button', { name: /create account/i }).click();
      
      // Should show error about existing user
      await page.waitForTimeout(2000);
      const hasError = await page.locator('div').filter({ hasText: /already|exists|registered/i }).isVisible({ timeout: 3000 })
        .catch(() => false);
      
      // Should still be on signup page or show error
      expect(hasError || page.url().includes('/signup')).toBeTruthy();
    });
  });

  test.describe('Login Flow', () => {
    test('should navigate to login page', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Check for login form elements
      await expect(page.locator('text=Welcome Back')).toBeVisible();
      await expect(page.getByPlaceholder(/email address/i)).toBeVisible();
      await expect(page.getByPlaceholder(/password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Fill with invalid credentials
      await page.getByPlaceholder(/email address/i).fill('invalid@example.com');
      await page.getByPlaceholder(/password/i).fill('wrongpassword');
      
      // Submit form
      await page.getByRole('button', { name: /sign in/i }).click();
      
      // Wait for error message
      await page.waitForTimeout(2000);
      
      // Should show error message
      const errorVisible = await page.locator('div.text-red-400, [class*="red"]').isVisible({ timeout: 3000 })
        .catch(() => false);
      
      expect(errorVisible).toBeTruthy();
      
      // Still on login page
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('should successfully login with valid credentials', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Fill login form with test account
      await page.getByPlaceholder(/email address/i).fill(testEmail);
      await page.getByPlaceholder(/password/i).fill(testPassword);
      
      // Submit form
      await page.getByRole('button', { name: /sign in/i }).click();
      
      // Wait for redirect
      await page.waitForTimeout(3000);
      
      // Should be redirected to studio or verify email
      const url = page.url();
      expect(
        url.includes('/studio') || 
        url.includes('/verify-email')
      ).toBeTruthy();
    });

    test('should have working forgot password link', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Click forgot password
      const forgotPasswordLink = page.getByText(/forgot password/i);
      await expect(forgotPasswordLink).toBeVisible();
      
      await forgotPasswordLink.click();
      
      // Should navigate to reset password page
      await expect(page).toHaveURL(/\/auth\/reset-password/, { timeout: 3000 });
    });
  });

  test.describe('Navigation Between Auth Pages', () => {
    test('should navigate from login to signup', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Click sign up link
      await page.getByText(/sign up/i).last().click();
      
      // Should be on signup page
      await expect(page).toHaveURL(/\/auth\/signup/);
    });

    test('should navigate from signup to login', async ({ page }) => {
      await page.goto('/auth/signup');
      
      // Click sign in link
      await page.getByText(/sign in/i).last().click();
      
      // Should be on login page
      await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('should have working back button', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Click back button
      const backButton = page.getByText(/back to home/i);
      await expect(backButton).toBeVisible();
      
      await backButton.click();
      
      // Should be on home page
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated users from studio', async ({ page, context }) => {
      // Clear any existing sessions
      await context.clearCookies();
      
      // Try to access studio directly
      await page.goto('/studio');
      
      // Should be redirected to login or home
      await page.waitForTimeout(2000);
      const url = page.url();
      
      expect(
        url.includes('/auth/login') || 
        url === 'http://localhost:3000/' ||
        url.endsWith('/')
      ).toBeTruthy();
    });

    test('should redirect unauthenticated users from gallery', async ({ page, context }) => {
      // Clear any existing sessions
      await context.clearCookies();
      
      // Try to access gallery directly
      await page.goto('/gallery');
      
      // Should be redirected to login or home
      await page.waitForTimeout(2000);
      const url = page.url();
      
      expect(
        url.includes('/auth/login') || 
        url === 'http://localhost:3000/' ||
        url.endsWith('/')
      ).toBeTruthy();
    });
  });
});



