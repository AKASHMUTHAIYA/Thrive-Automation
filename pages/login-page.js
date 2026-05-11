class LoginPage {
  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.headline = page.locator('h1');
  }

  async goto() {
    await this.page.goto(this.baseUrl);
  }

  async expectLoaded() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('h1');
    await this.page.locator('h1').first().waitFor({ state: 'visible' });
  }
}

module.exports = { LoginPage };
