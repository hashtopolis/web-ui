import { expect, test } from '@playwright/test';

import { mockHashlistsFlow } from '@e2e/support/api-mocks';

test.describe('Hashlist list', () => {
  test.beforeEach(async ({ page }) => {
    await mockHashlistsFlow(page);
    await page.goto('/#/hashlists/hashlist');
  });

  test('shows the New Hashlist button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'New Hashlist' })).toBeVisible();
  });

  test('navigates to the create form', async ({ page }) => {
    await page.getByRole('button', { name: 'New Hashlist' }).click();
    await expect(page).toHaveURL(/#\/hashlists\/new-hashlist/);
  });
});
