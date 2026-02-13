import { test, expect } from '@playwright/test';
import path from 'path';

test.use({ viewport: { width: 1280, height: 720 } });

const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots');

test('landing page visual check', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Wait for the main heading text using regex for flexibility
  // Increased timeout and using a simpler check if networkidle is too strict
  await expect(page.getByText(/Master Spelling Through/i)).toBeVisible({ timeout: 30000 });
  await page.waitForTimeout(2000); // Wait for animations
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'landing.png'), fullPage: true });
});

test('login page visual check', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
  await expect(page.getByText(/Welcome Back/i)).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'login.png'), fullPage: true });
});

test('signup page visual check', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await page.waitForLoadState('networkidle');
  await expect(page.getByText(/Create Your Account/i)).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'signup.png'), fullPage: true });
});

test('dashboard redirect check', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  // It should redirect to login if not authenticated
  // Next.js redirect might happen quickly, so we wait for the target URL
  await page.waitForURL(url => url.pathname.includes('/login'), { timeout: 30000 });
  await expect(page.getByText(/Welcome Back/i)).toBeVisible({ timeout: 30000 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard_redirect.png'), fullPage: true });
});
