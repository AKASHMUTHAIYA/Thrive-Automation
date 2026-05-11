class DashboardPage {
  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.title = page.locator('h1');
  }

  async goto() {
    await this.page.goto(this.baseUrl);
  }

  async expectLoaded() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('h1');
    await this.page.locator('h1').first();
  }
}

module.exports = { DashboardPage };
