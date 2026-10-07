import { test, expect } from '@playwright/test';
import { InputProfilePage } from '../pages/InputProfilePage';

// Update URL ini dengan aplikasi yang sebenarnya
const BASE_URL = 'https://example.com/profile/input';

test.describe('Pengujian Form Input Profile', () => {
  let inputProfilePage: InputProfilePage;

  test.beforeEach(async ({ page }) => {
    inputProfilePage = new InputProfilePage(page);
    await inputProfilePage.goto(BASE_URL);
    await inputProfilePage.verifyPageLoaded();
  });

  test('Verifikasi input profil berhasil dengan semua field terisi', async ({ page }) => {
    await inputProfilePage.fillCompleteProfile({
      firstName: 'Joel',
      middleName: 'K',
      lastName: 'Osteen',
      nickname: 'JoelO',
      gender: 'male',
      birthDate: '15 Jan 1990'
    });

    await inputProfilePage.clickSave();
    await expect(page).toHaveURL(/.*success|.*dashboard|.*profile/);
  });

  test('Verifikasi simpan profil hanya dengan field wajib', async ({ page }) => {
    await inputProfilePage.fillFirstName('John');
    await inputProfilePage.fillNickname('Johnny');
    await inputProfilePage.selectGender('male');
    await inputProfilePage.fillBirthDate('15 Mar 1992');

    await inputProfilePage.clickSave();
    await expect(page).toHaveURL(/.*success|.*dashboard|.*profile/);
  });

  test('Verifikasi validasi First Name kosong', async () => {
    await inputProfilePage.selectGender('male');
    await inputProfilePage.clickSave();

    const errorMessage = await inputProfilePage.getErrorMessage('required');
    await expect(errorMessage).toBeVisible();
  });

  test('Verifikasi First Name menerima karakter valid', async ({ page }) => {
    await inputProfilePage.fillFirstName('Jonathan');
    await inputProfilePage.fillNickname('Jon');
    await inputProfilePage.selectGender('male');
    await inputProfilePage.fillBirthDate('25 Dec 1988');
    await inputProfilePage.clickSave();

    await expect(page).toHaveURL(/.*success|.*dashboard|.*profile/);
  });

  test('Verifikasi validasi First Name dengan karakter khusus', async () => {
    await inputProfilePage.fillFirstName('@#$%');
    await inputProfilePage.fillNickname('Test');
    await inputProfilePage.selectGender('male');
    await inputProfilePage.fillBirthDate('01 Jan 1990');
    await inputProfilePage.clickSave();

    const errorMessage = await inputProfilePage.getErrorMessage('invalid');
    await expect(errorMessage).toBeVisible();
  });

  test('Verifikasi Middle Name bersifat opsional', async ({ page }) => {
    await inputProfilePage.fillFirstName('Michael');
    await inputProfilePage.fillNickname('Mike');
    await inputProfilePage.selectGender('male');
    await inputProfilePage.fillBirthDate('05 May 1991');
    await inputProfilePage.clickSave();

    await expect(page).toHaveURL(/.*success|.*dashboard|.*profile/);
  });

  test('Verifikasi Last Name bersifat opsional', async ({ page }) => {
    await inputProfilePage.fillFirstName('Sarah');
    await inputProfilePage.fillNickname('Sar');
    await inputProfilePage.selectGender('female');
    await inputProfilePage.fillBirthDate('12 Feb 1993');
    await inputProfilePage.clickSave();

    await expect(page).toHaveURL(/.*success|.*dashboard|.*profile/);
  });

  test('Verifikasi pemilihan Gender Male', async ({ page }) => {
    await inputProfilePage.fillFirstName('David');
    await inputProfilePage.fillNickname('Dave');
    await inputProfilePage.selectGender('male');
    await inputProfilePage.fillBirthDate('18 Apr 1989');

    const isMaleSelected = await inputProfilePage.isGenderSelected('male');
    expect(isMaleSelected).toBeTruthy();

    await inputProfilePage.clickSave();
    await expect(page).toHaveURL(/.*success|.*dashboard|.*profile/);
  });

  test('Verifikasi pemilihan Gender Female', async ({ page }) => {
    await inputProfilePage.fillFirstName('Emily');
    await inputProfilePage.fillNickname('Em');
    await inputProfilePage.selectGender('female');
    await inputProfilePage.fillBirthDate('22 Jul 1994');

    const isFemaleSelected = await inputProfilePage.isGenderSelected('female');
    expect(isFemaleSelected).toBeTruthy();

    await inputProfilePage.clickSave();
    await expect(page).toHaveURL(/.*success|.*dashboard|.*profile/);
  });

  test('Verifikasi validasi Gender tidak dipilih', async () => {
    await inputProfilePage.fillFirstName('Alex');
    await inputProfilePage.fillNickname('Al');
    await inputProfilePage.fillBirthDate('30 Sep 1990');
    await inputProfilePage.clickSave();

    const errorMessage = await inputProfilePage.getErrorMessage('required');
    await expect(errorMessage).toBeVisible();
  });

  test('Verifikasi Birth Date dengan tanggal valid', async ({ page }) => {
    await inputProfilePage.fillFirstName('Robert');
    await inputProfilePage.fillNickname('Rob');
    await inputProfilePage.selectGender('male');
    await inputProfilePage.fillBirthDate('25 Dec 1995');
    await inputProfilePage.clickSave();

    await expect(page).toHaveURL(/.*success|.*dashboard|.*profile/);
  });

  test('Verifikasi validasi Birth Date kosong', async () => {
    await inputProfilePage.fillFirstName('Jessica');
    await inputProfilePage.fillNickname('Jess');
    await inputProfilePage.selectGender('female');
    await inputProfilePage.clickSave();

    const errorMessage = await inputProfilePage.getErrorMessage('required');
    await expect(errorMessage).toBeVisible();
  });

  test('Verifikasi validasi Birth Date tanggal masa depan', async () => {
    await inputProfilePage.fillFirstName('Thomas');
    await inputProfilePage.fillNickname('Tom');
    await inputProfilePage.selectGender('male');
    await inputProfilePage.fillBirthDate('01 Jan 2030');
    await inputProfilePage.clickSave();

    const errorMessage = await inputProfilePage.getErrorMessage('future');
    await expect(errorMessage).toBeVisible();
  });

  test('Verifikasi validasi Nickname kosong', async () => {
    await inputProfilePage.fillFirstName('Robert');
    await inputProfilePage.selectGender('male');
    await inputProfilePage.fillBirthDate('20 Aug 1990');
    await inputProfilePage.clickSave();

    const errorMessage = await inputProfilePage.getErrorMessage('required');
    await expect(errorMessage).toBeVisible();
  });

  test('Verifikasi fungsi tombol Back', async ({ page }) => {
    await inputProfilePage.clickBack();
    await expect(page).toHaveURL(/^(?!.*profile\/input)/);
  });

  test('Verifikasi tombol Save dapat diklik', async () => {
    await inputProfilePage.fillFirstName('Linda');
    await inputProfilePage.fillNickname('Lin');
    await inputProfilePage.selectGender('female');
    await inputProfilePage.fillBirthDate('08 Nov 1992');

    const isEnabled = await inputProfilePage.isSaveButtonEnabled();
    expect(isEnabled).toBeTruthy();

    await inputProfilePage.clickSave();
  });

  test('Verifikasi tampilan error untuk beberapa field kosong', async () => {
    await inputProfilePage.clickSave();

    const errorMessage = await inputProfilePage.getErrorMessage('required');
    await expect(errorMessage).toBeVisible();
  });

  test('Verifikasi batas maksimal karakter First Name', async () => {
    const longText = 'A'.repeat(150);
    await inputProfilePage.fillFirstName(longText);
    await inputProfilePage.fillNickname('Test');
    await inputProfilePage.selectGender('male');
    await inputProfilePage.fillBirthDate('10 Oct 1990');
    await inputProfilePage.clickSave();

    const errorMessage = await inputProfilePage.getErrorMessage('maximum length');
    await expect(errorMessage).toBeVisible();
  });

  test('Verifikasi tampilan responsif form', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(inputProfilePage.firstNameInput).toBeVisible();
    await expect(inputProfilePage.middleNameInput).toBeVisible();
    await expect(inputProfilePage.lastNameInput).toBeVisible();
    await expect(inputProfilePage.nicknameInput).toBeVisible();
    await expect(inputProfilePage.genderMaleRadio).toBeVisible();
    await expect(inputProfilePage.genderFemaleRadio).toBeVisible();
    await expect(inputProfilePage.birthDateInput).toBeVisible();
    await expect(inputProfilePage.saveButton).toBeVisible();
  });
});
