import { test, expect } from '@playwright/test'

test('webshop homepage', async ({ page, baseURL }) => {
  const response = await page.goto(baseURL as string)

  expect(response?.status()).toBeLessThan(400)
  await expect(page).toHaveTitle(/Danube WebShop/)
  await page.screenshot({ path: 'homepage.jpg' })
})
