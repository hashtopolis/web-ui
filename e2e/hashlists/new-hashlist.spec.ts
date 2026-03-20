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
    // Wait for form dependencies to finish loading
    await expect(page.getByPlaceholder('Hashtypes...')).toBeVisible();

    // Fill in the hashlist name
    await page.getByTestId('name-input').locator('input').fill('Test Hashlist');

    // Select a hash type from the autocomplete
    await page.getByTestId('hashtypes-input').locator('input').fill('MD5');
    await page.getByRole('option', { name: /1 - MD5/ }).click();

    // Select an access group.
    // Use keyboard to open: mat-label overlays the select and blocks pointer events.
    await page.getByTestId('access-group-select').locator('[role="combobox"]').press('Enter');
    await page.getByRole('option', { name: 'Default' }).click();

    // Switch source type to paste — same keyboard pattern.
    await page.getByTestId('hash-source-select').locator('[role="combobox"]').press('Enter');
    await page.getByRole('option', { name: 'Paste Hash(es)' }).click();

    // Paste some hashes.
    // Scoped via data-testid so the test does not break on label renames.
    // force: true is required because cdkTextareaAutosize initialises with zero
    // computed height in Firefox, making Playwright consider it not visible.
    await page
      .getByTestId('paste-hashes-input')
      .locator('textarea')
      .fill('5d41402abc4b2a76b9719d911017c592', { force: true });

    // Submit and verify redirect
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page).toHaveURL(/#\/hashlists\/hashlist/, { timeout: 10_000 });
  });
});
