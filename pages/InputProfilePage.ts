import { Page, Locator } from '@playwright/test';

export class InputProfilePage {
  readonly page: Page;
  readonly backButton: Locator;
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly nicknameInput: Locator;
  readonly genderMaleRadio: Locator;
  readonly genderFemaleRadio: Locator;
  readonly birthDateInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Using getByRole and getByText as per best practices
    this.backButton = page.getByRole('button', { name: /back/i });
    this.pageTitle = page.getByText('Input your profile');
    
    // Form inputs - using getByLabel for better accessibility
    this.firstNameInput = page.getByLabel(/first name/i);
    this.middleNameInput = page.getByLabel(/middle name/i);
    this.lastNameInput = page.getByLabel(/last name/i);
    this.nicknameInput = page.getByLabel(/nickname/i);
    
    // Gender radio buttons - using getByRole for radio inputs
    this.genderMaleRadio = page.getByRole('radio', { name: /male/i });
    this.genderFemaleRadio = page.getByRole('radio', { name: /female/i });
    
    // Birth date input
    this.birthDateInput = page.getByLabel(/birth date/i);
    
    // Save button
    this.saveButton = page.getByRole('button', { name: /save/i });
  }

  /**
   * Navigate to Input Profile page
   * @param url - URL of the profile input page
   */
  async goto(url: string) {
    await this.page.goto(url);
  }

  /**
   * Fill first name field
   * @param firstName - First name value
   */
  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Fill middle name field
   * @param middleName - Middle name value
   */
  async fillMiddleName(middleName: string) {
    await this.middleNameInput.fill(middleName);
  }

  /**
   * Fill last name field
   * @param lastName - Last name value
   */
  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Fill nickname field
   * @param nickname - Nickname value
   */
  async fillNickname(nickname: string) {
    await this.nicknameInput.fill(nickname);
  }

  /**
   * Select gender
   * @param gender - 'male' or 'female'
   */
  async selectGender(gender: 'male' | 'female') {
    if (gender === 'male') {
      await this.genderMaleRadio.check();
    } else {
      await this.genderFemaleRadio.check();
    }
  }

  /**
   * Fill birth date field
   * @param birthDate - Birth date in DD MMM YYYY format (e.g., '15 Jan 1990')
   */
  async fillBirthDate(birthDate: string) {
    await this.birthDateInput.fill(birthDate);
  }

  /**
   * Click save button
   */
  async clickSave() {
    await this.saveButton.click();
  }

  /**
   * Click back button
   */
  async clickBack() {
    await this.backButton.click();
  }

  /**
   * Fill complete profile with all fields
   * @param profileData - Object containing all profile data
   */
  async fillCompleteProfile(profileData: {
    firstName: string;
    middleName?: string;
    lastName?: string;
    nickname?: string;
    gender: 'male' | 'female';
    birthDate?: string;
  }) {
    await this.fillFirstName(profileData.firstName);
    
    if (profileData.middleName) {
      await this.fillMiddleName(profileData.middleName);
    }
    
    if (profileData.lastName) {
      await this.fillLastName(profileData.lastName);
    }
    
    if (profileData.nickname) {
      await this.fillNickname(profileData.nickname);
    }
    
    await this.selectGender(profileData.gender);
    
    if (profileData.birthDate) {
      await this.fillBirthDate(profileData.birthDate);
    }
  }

  /**
   * Check if error message is displayed
   * @param errorText - Expected error message text
   */
  async getErrorMessage(errorText: string) {
    return this.page.getByText(errorText, { exact: false });
  }

  /**
   * Check if save button is enabled
   */
  async isSaveButtonEnabled(): Promise<boolean> {
    return await this.saveButton.isEnabled();
  }

  /**
   * Verify page is loaded by checking page title
   */
  async verifyPageLoaded() {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  /**
   * Check if gender is selected
   * @param gender - 'male' or 'female'
   */
  async isGenderSelected(gender: 'male' | 'female'): Promise<boolean> {
    if (gender === 'male') {
      return await this.genderMaleRadio.isChecked();
    } else {
      return await this.genderFemaleRadio.isChecked();
    }
  }
}
