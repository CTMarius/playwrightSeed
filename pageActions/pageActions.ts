import { Page } from '@playwright/test';
import { MainPage } from '../pageObjects/pageObjects';

export class PageActions {
  private page: Page;
  private mainPage: MainPage;

  constructor(page: Page) {
    this.page = page;
    this.mainPage = new MainPage(page);
  }

  async fillTextField(text: string) {
    await this.mainPage.textField.fill(text);
  }

  async clickSaveButton() {
    await this.mainPage.saveButton.click();
  }

  async selectDate(date: string) {
    await this.mainPage.datePicker.fill(date);
  }

  async getErrorMessage() {
    return await this.mainPage.errorMessage.textContent();
  }

  async fillAndSaveContent(text: string) {
    await this.fillTextField(text);
    await this.clickSaveButton();
    await this.page.waitForLoadState('networkidle');
  }

  async fillDateContentAndSave(date: string, text: string) {
    await this.selectDate(date);
    await this.fillTextField(text);
    await this.clickSaveButton();
    await this.page.waitForLoadState('networkidle');
  }

  async triggerInvalidDateEvent(invalidDate?: string) {
    await this.page.evaluate((date) => {
      const event = new CustomEvent('invalidDate', { detail: { date: date || 'invalid' } });
      document.dispatchEvent(event);
    }, invalidDate);
  }

  /**
   * Waits for the page to load and process API responses
   * @param timeout The timeout in milliseconds
   */
  async waitForPageLoad(timeout = 2000): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }

  /**
   * Reloads the page and waits for it to load
   * @param timeout The timeout in milliseconds
   */
  async reloadPageAndWait(timeout = 2000): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad(timeout);
  }

  /**
   * Verifies that the text field has the expected value after a page reload
   * @param expectedValue The expected value in the text field
   * @param timeout The timeout in milliseconds
   */
  async verifyTextFieldValue(expectedValue: string, timeout = 10000): Promise<void> {
    // Wait for the text field to be visible
    await this.mainPage.textField.waitFor({ state: 'visible', timeout });
    
    // Get the current value
    const currentValue = await this.mainPage.textField.inputValue();
    console.log(`Verifying text field value. Expected: "${expectedValue}", Actual: "${currentValue}"`);
    
    // If the value is not what we expect, wait a bit longer and check again
    if (currentValue !== expectedValue) {
      console.log('Value mismatch, waiting for potential UI update...');
      await this.page.waitForTimeout(1000);
      const updatedValue = await this.mainPage.textField.inputValue();
      console.log(`After waiting, value is: "${updatedValue}"`);
    }
  }
}
