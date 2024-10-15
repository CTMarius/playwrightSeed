import { Locator, Page } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly textField: Locator;
  readonly saveButton: Locator;
  readonly datePicker: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators
    this.textField = page.locator('#textarea'); 
    this.saveButton = page.locator('#save'); 
    this.datePicker = page.locator('#datepicker'); 
  }
}
