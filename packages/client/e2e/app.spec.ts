import { test, expect } from '@playwright/test';

test.describe('App Shell', () => {
  test('renders in dark mode by default', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    await expect(page.getByText('AccountOS')).toBeVisible();
  });

  test('shows API health status', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/API:/)).toBeVisible();
  });
});
