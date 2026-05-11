const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../pages/dashboard-page');

const BASE_URL = process.env.BASE_URL || 'https://example.com/';

test.describe('@smoke Dashboard smoke', () => {
  test('dashboard page loads and has expected title', async ({ page }) => {
    const dashboardPage = new DashboardPage(page, BASE_URL);
    await dashboardPage.goto();
    await dashboardPage.expectLoaded();
    await expect(page).toHaveTitle(/Example Domain|Dashboard/i);
  });
});
