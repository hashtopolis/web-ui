import { expect, test } from '@playwright/test';

import { mockHashlistsFlow } from '@e2e/support/api-mocks';

test.describe('New Hashlist form', () => {
  test.beforeEach(async ({ page }) => {
    await mockHashlistsFlow(page);
    await page.goto('/#/hashlists/new-hashlist');
  });

  test('shows the form fields after data loads', async ({ page }) => {
    // Name is always present
    await expect(page.getByTestId('name-input')).toBeVisible();
    // Hashtype multiselect appears once hashtypes have loaded
    await expect(page.getByTestId('hashtypes-input')).toBeVisible();
    // Access group select
    await expect(page.getByTestId('access-group-select')).toBeVisible();
  });

  test('shows validation errors when submitting empty form', async ({ page }) => {
    // Default source type is "upload", which shows the testid submit button
    await page.getByTestId('submit-button').click();

    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('This field is required.')).toBeVisible();
    await expect(page.getByText('Access group is required')).toBeVisible();
  });

  test('creates a hashlist via paste and redirects to the list', async ({ page }) => {
    await expect(page.getByTestId('hashtypes-input')).toBeVisible();

    await page.getByTestId('name-input').locator('input').fill('Test Hashlist');

    // Hashtypes Autocomplete
    await page.getByTestId('hashtypes-input').locator('input').fill('MD5');
    await page.getByRole('option', { name: /1 - MD5/ }).click();

    // Access Group Select (using role + force to bypass label overlays)
    await page.getByTestId('access-group-select').locator('.mat-mdc-select-trigger').click({ force: true });
    await page.getByRole('option', { name: 'Default' }).click();

    // Source Type Select — focus the mat-select then open with Space to avoid CDK overlay conflicts.
    await page.getByTestId('hash-source-select').locator('mat-select').focus();
    await page.keyboard.press('Space');
    await page.getByRole('option', { name: 'Paste Hash(es)' }).click();

    await page
      .getByTestId('paste-hashes-input')
      .locator('textarea')
      .fill('5d41402abc4b2a76b9719d911017c592', { force: true });

    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page).toHaveURL(/#\/hashlists\/hashlist/, { timeout: 10_000 });
  });
});
