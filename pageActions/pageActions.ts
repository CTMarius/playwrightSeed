import { MainPage } from './../pageObjects/pageObjects';
import { Page } from '@playwright/test';

export class PageActions {
  readonly mainPage: MainPage;

  constructor(page: Page) {
    this.mainPage = new MainPage(page);
  }

  async fillTextField(text: string) {
    await this.mainPage.textField.fill(text);
  }

  async clickSaveButton() {
    await this.mainPage.saveButton.click();
  }

  async selectDate(date: string) {
    await this.mainPage.datePicker.fill(date); // Adjust based on how your date picker works
  }
}
