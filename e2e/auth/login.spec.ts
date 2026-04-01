import { expect, test } from '@playwright/test';

import { mockLoginFlow } from '@e2e/support/api-mocks';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/auth/login');
  });

  test('shows the login form', async ({ page }) => {
    await expect(page.getByTestId('username-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeVisible();
  });

  test('shows validation errors when submitting empty form', async ({ page }) => {
    await page.getByTestId('submit-button').click();

    await expect(page.getByText('Username is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('redirects to dashboard after successful login', async ({ page }) => {
    await mockLoginFlow(page);
    await page.goto('/#/auth/login');

    await page.getByTestId('username-input').fill('e2e-test');
    await page.getByTestId('password-input').fill('anypassword');
    await page.getByTestId('submit-button').click();

    await expect(page).not.toHaveURL(/#\/auth/);
  });
});
