import { Page, Locator } from '@playwright/test';

export class BorobudurMarathonPage {
  readonly page: Page;
  readonly baseURL: string = 'https://borobudurmarathon.com';
  
  // Navigation menu
  readonly navHome: Locator;
  readonly navTheRace: Locator;
  readonly navProgram: Locator;
  readonly navMedia: Locator;
  readonly navContact: Locator;
  readonly navApps: Locator;
  readonly navMerchandise: Locator;
  
  // Main content
  readonly mainBanner: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Navigation - using getByRole for links
    this.navHome = page.getByRole('link', { name: /^home$/i });
    this.navTheRace = page.getByRole('link', { name: /the race/i });
    this.navProgram = page.getByRole('link', { name: /^program$/i });
    this.navMedia = page.getByRole('link', { name: /^media$/i });
    this.navContact = page.getByRole('link', { name: /^contact$/i });
    this.navApps = page.getByRole('link', { name: /^apps$/i });
    this.navMerchandise = page.getByRole('link', { name: /merchandise/i });
    
    // Main content - using getByText with first() to avoid strict mode violation
    this.mainBanner = page.getByText(/decade of legacy/i).first();
    this.pageTitle = page.locator('title');
  }

  /**
   * Navigate to homepage
   */
  async gotoHomepage() {
    await this.page.goto(this.baseURL, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Navigate to Apps page
   */
  async gotoAppsPage() {
    await this.page.goto(`${this.baseURL}/apps/`, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Navigate to Merchandise page
   */
  async gotoMerchandisePage() {
    await this.page.goto(`${this.baseURL}/official-merchandise/`, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Click navigation menu item
   * @param menuItem - Name of menu item to click
   */
  async clickNavigation(menuItem: 'home' | 'the-race' | 'program' | 'media' | 'contact' | 'apps' | 'merchandise') {
    const menuMap = {
      'home': this.navHome,
      'the-race': this.navTheRace,
      'program': this.navProgram,
      'media': this.navMedia,
      'contact': this.navContact,
      'apps': this.navApps,
      'merchandise': this.navMerchandise,
    };
    
    await menuMap[menuItem].click();
  }

  /**
   * Check if main banner is visible
   */
  async isMainBannerVisible(): Promise<boolean> {
    return await this.mainBanner.isVisible();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Verify homepage is loaded
   */
  async verifyHomepageLoaded() {
    await this.page.waitForURL(this.baseURL);
    await this.mainBanner.waitFor({ state: 'visible' });
  }

  /**
   * Check if all navigation menu items are visible
   */
  async areAllNavigationItemsVisible(): Promise<boolean> {
    const navItems = [
      this.navHome,
      this.navTheRace,
      this.navProgram,
      this.navMedia,
      this.navContact,
      this.navApps,
      this.navMerchandise,
    ];
    
    for (const item of navItems) {
      if (!(await item.isVisible())) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Get sponsor section
   */
  getSponsorSection() {
    return this.page.getByText(/government partner|powered by|managed by|official/i);
  }

  /**
   * Check if sponsor logos are visible
   */
  async areSponsorsVisible(): Promise<boolean> {
    const sponsorSection = this.getSponsorSection();
    return await sponsorSection.first().isVisible();
  }

  /**
   * Get footer element
   */
  getFooter() {
    return this.page.locator('footer');
  }

  /**
   * Check if footer is visible
   */
  async isFooterVisible(): Promise<boolean> {
    const footer = this.getFooter();
    const count = await footer.count();
    if (count > 0) {
      return await footer.isVisible();
    }
    return false;
  }

  /**
   * Get all images on page
   */
  getAllImages() {
    return this.page.locator('img');
  }

  /**
   * Check if all images are loaded (no broken images)
   */
  async areAllImagesLoaded(): Promise<boolean> {
    const images = await this.getAllImages().all();
    
    for (const img of images) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      if (naturalWidth === 0) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Set viewport size for responsive testing
   * @param width - Viewport width
   * @param height - Viewport height
   */
  async setViewport(width: number, height: number) {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Emulate network conditions
   * @param condition - Network condition ('Slow 3G', 'Fast 3G', 'Offline')
   */
  async emulateNetworkCondition(condition: 'Slow 3G' | 'Fast 3G' | 'Offline') {
    const presets = {
      'Slow 3G': {
        downloadThroughput: (400 * 1024) / 8,
        uploadThroughput: (400 * 1024) / 8,
        latency: 2000,
      },
      'Fast 3G': {
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
        latency: 562.5,
      },
      'Offline': {
        downloadThroughput: 0,
        uploadThroughput: 0,
        latency: 0,
      },
    };
    
    const cdpSession = await this.page.context().newCDPSession(this.page);
    await cdpSession.send('Network.emulateNetworkConditions', {
      offline: condition === 'Offline',
      ...presets[condition],
    });
  }

  /**
   * Scroll to section by text
   * @param sectionText - Text to identify section
   */
  async scrollToSection(sectionText: string) {
    const section = this.page.getByText(sectionText, { exact: false });
    await section.scrollIntoViewIfNeeded();
  }

  /**
   * Go back using browser navigation
   */
  async goBack() {
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Check if current URL matches expected
   * @param expectedURL - Expected URL or pattern
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take full page screenshot
   * @param path - Path to save screenshot
   */
  async takeScreenshot(path: string) {
    await this.page.screenshot({ path, fullPage: true });
  }
}
