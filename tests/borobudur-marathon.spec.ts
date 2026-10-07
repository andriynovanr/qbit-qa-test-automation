import { test, expect } from '@playwright/test';
import { BorobudurMarathonPage } from '../pages/BorobudurMarathonPage';

test.describe('Pengujian Website Borobudur Marathon', () => {
  let borobudurPage: BorobudurMarathonPage;

  test.beforeEach(async ({ page }) => {
    borobudurPage = new BorobudurMarathonPage(page);
  });

  test('Verifikasi homepage berhasil dimuat', async () => {
    await borobudurPage.gotoHomepage();
    
    const title = await borobudurPage.getPageTitle();
    expect(title).toContain('Borobudur Marathon');
    expect(title).toContain('2026');
    
    const isMainBannerVisible = await borobudurPage.isMainBannerVisible();
    expect(isMainBannerVisible).toBeTruthy();
  });

  test('Verifikasi tampilan banner utama homepage', async () => {
    await borobudurPage.gotoHomepage();
    
    const isMainBannerVisible = await borobudurPage.isMainBannerVisible();
    expect(isMainBannerVisible).toBeTruthy();
    
    await expect(borobudurPage.mainBanner).toBeVisible();
  });

  test('Verifikasi menu navigasi terlihat', async () => {
    await borobudurPage.gotoHomepage();
    
    const allNavVisible = await borobudurPage.areAllNavigationItemsVisible();
    expect(allNavVisible).toBeTruthy();
    
    // Verifikasi setiap item navigasi
    await expect(borobudurPage.navHome).toBeVisible();
    await expect(borobudurPage.navTheRace).toBeVisible();
    await expect(borobudurPage.navProgram).toBeVisible();
    await expect(borobudurPage.navMedia).toBeVisible();
    await expect(borobudurPage.navContact).toBeVisible();
    await expect(borobudurPage.navApps).toBeVisible();
    await expect(borobudurPage.navMerchandise).toBeVisible();
  });

  test('Verifikasi fungsi link menu Home', async () => {
    await borobudurPage.gotoHomepage();
    
    await borobudurPage.clickNavigation('home');
    
    const currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toBe('https://borobudurmarathon.com/');
  });

  test('Verifikasi navigasi section The Race', async ({ page }) => {
    await borobudurPage.gotoHomepage();
    
    await borobudurPage.clickNavigation('the-race');
    
    const currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toContain('borobudurmarathon.com');
  });

  test('Verifikasi navigasi section Program', async ({ page }) => {
    await borobudurPage.gotoHomepage();
    
    await borobudurPage.clickNavigation('program');
    
    const currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toContain('borobudurmarathon.com');
  });

  test('Verifikasi navigasi section Media', async ({ page }) => {
    await borobudurPage.gotoHomepage();
    
    await borobudurPage.clickNavigation('media');
    
    const currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toContain('borobudurmarathon.com');
  });

  test('Verifikasi navigasi section Contact', async ({ page }) => {
    await borobudurPage.gotoHomepage();
    
    await borobudurPage.clickNavigation('contact');
    
    const currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toContain('borobudurmarathon.com');
  });

  test('Verifikasi navigasi ke halaman Apps', async ({ page }) => {
    await borobudurPage.gotoHomepage();
    
    await borobudurPage.clickNavigation('apps');
    await page.waitForLoadState('domcontentloaded');
    
    const currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toContain('/apps/');
  });

  test('Verifikasi navigasi ke halaman Merchandise', async ({ page }) => {
    await borobudurPage.gotoHomepage();
    
    await borobudurPage.clickNavigation('merchandise');
    await page.waitForLoadState('domcontentloaded');
    
    const currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toContain('/official-merchandise/');
  });

  test('Verifikasi halaman Apps dimuat dengan benar', async ({ page }) => {
    await borobudurPage.gotoAppsPage();
    
    const currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toContain('/apps/');
    
    // Verifikasi halaman dimuat dan tidak menampilkan error
    await expect(page).not.toHaveTitle(/404|error|not found/i);
  });

  test('Verifikasi halaman Merchandise dimuat dengan benar', async ({ page }) => {
    await borobudurPage.gotoMerchandisePage();
    
    const currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toContain('/official-merchandise/');
    
    // Verifikasi halaman dimuat dan tidak menampilkan error
    await expect(page).not.toHaveTitle(/404|error|not found/i);
  });

  test('Verifikasi logo sponsor ditampilkan', async () => {
    await borobudurPage.gotoHomepage();
    
    const sponsorsVisible = await borobudurPage.areSponsorsVisible();
    expect(sponsorsVisible).toBeTruthy();
  });

  test('Verifikasi tampilan responsif mobile', async ({ page }) => {
    await borobudurPage.setViewport(375, 667);
    await borobudurPage.gotoHomepage();
    
    // Verifikasi navigasi masih dapat diakses
    expect(page.url()).toContain('borobudurmarathon.com');
    
    const isMainBannerVisible = await borobudurPage.isMainBannerVisible();
    expect(isMainBannerVisible).toBeTruthy();
  });

  test('Verifikasi tampilan responsif tablet', async ({ page }) => {
    await borobudurPage.setViewport(768, 1024);
    await borobudurPage.gotoHomepage();
    
    const isMainBannerVisible = await borobudurPage.isMainBannerVisible();
    expect(isMainBannerVisible).toBeTruthy();
    
    expect(page.url()).toContain('borobudurmarathon.com');
  });

  test('Verifikasi navigasi kembali dari halaman Apps', async () => {
    await borobudurPage.gotoHomepage();
    
    // Navigasi ke halaman Apps
    await borobudurPage.clickNavigation('apps');
    await borobudurPage.page.waitForLoadState('domcontentloaded');
    
    let currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toContain('/apps/');
    
    await borobudurPage.goBack();
    
    currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toBe('https://borobudurmarathon.com/');
  });

  test('Verifikasi navigasi kembali dari halaman Merchandise', async () => {
    await borobudurPage.gotoHomepage();
    
    // Navigasi ke halaman Merchandise
    await borobudurPage.clickNavigation('merchandise');
    await borobudurPage.page.waitForLoadState('domcontentloaded');
    
    let currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toContain('/official-merchandise/');
    
    // Kembali
    await borobudurPage.goBack();
    
    currentURL = await borobudurPage.getCurrentURL();
    expect(currentURL).toBe('https://borobudurmarathon.com/');
  });

  test('Verifikasi penanganan URL tidak valid - halaman 404', async ({ page }) => {
    await page.goto('https://borobudurmarathon.com/invalid-page-xyz');
    
    // Cek apakah halaman 404 ditampilkan atau di-redirect ke homepage
    const currentURL = page.url();
    const title = await page.title();
    
    const is404 = title.toLowerCase().includes('404') || 
                  title.toLowerCase().includes('not found') ||
                  currentURL === 'https://borobudurmarathon.com/';
    
    expect(is404).toBeTruthy();
  });


});
