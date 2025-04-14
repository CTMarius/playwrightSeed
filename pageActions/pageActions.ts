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

  async triggerInvalidDateEvent() {
    await this.page.evaluate(() => {
      const event = new CustomEvent('invalidDate', { detail: { date: 'invalid' } });
      document.dispatchEvent(event);
    });
  }
}
