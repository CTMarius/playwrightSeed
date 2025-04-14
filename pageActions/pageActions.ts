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

  async waitForLoadingIndicator() {
    await this.mainPage.loadingIndicator.waitFor({ state: 'visible' });
    await this.mainPage.loadingIndicator.waitFor({ state: 'hidden' });
  }

  async getErrorMessage() {
    return await this.mainPage.errorMessage.textContent();
  }

  async fillAndSaveContent(text: string) {
    await this.fillTextField(text);
    await this.clickSaveButton();
    await this.waitForLoadingIndicator();
  }

  async fillDateContentAndSave(date: string, text: string) {
    await this.selectDate(date);
    await this.fillTextField(text);
    await this.clickSaveButton();
    await this.waitForLoadingIndicator();
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
}
