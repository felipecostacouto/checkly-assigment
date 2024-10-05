import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
   await page.goto('https://www.checklyhq.com/');
   await page.getByRole('button', {name: 'Product' }).first().click();
   await page.getByRole('link', {name: 'Synthetic Monitoring Open' }).click();
   await expect(page.locator('h1')).toContainText('Synthetic Monitoring');
   const startFreeLink =page.getByRole('main').getByRole('link', { name: 'Start for free' }).first();
   await expect(startFreeLink).toBeVisible();
   const page1Promise = page.waitForEvent('popup');
   await page.getByRole('link', {name: 'login'}).click();
   const page1 = await page1Promise;
   await page1.getByPlaceholder('yours@example.com').click();
   await page1.getByPlaceholder('yours@example.com').fill('felipe.costacouto19@gmail.com');
   await expect(page1.getByPlaceholder('yours@example.com')).toHaveValue('felipe.costacouto19@gmail.com');
});
