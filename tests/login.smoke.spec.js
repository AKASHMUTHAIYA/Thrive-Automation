const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login-page');

const BASE_URL = process.env.BASE_URL || 'https://example.com/';

test.describe('@smoke Login smoke', () => {
  test('login page opens and contains expected text', async ({ page }) => {
    const loginPage = new LoginPage(page, BASE_URL);
    await loginPage.goto();
    await loginPage.expectLoaded();
    await expect(page).toHaveTitle(/Example Domain|Login/i);
  });
});
