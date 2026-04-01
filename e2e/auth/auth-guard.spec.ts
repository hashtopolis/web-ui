import { expect, test } from '@playwright/test';

test('redirects unauthenticated users to the login page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/#\/auth/);
  await expect(page).toHaveTitle(/Hashtopolis/);
});
