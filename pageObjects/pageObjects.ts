import { Locator, Page } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly textField: Locator;
  readonly saveButton: Locator;
  readonly datePicker: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators
    this.textField = page.locator('#textarea'); // Replace with actual text field ID
    this.saveButton = page.locator('#save'); // Replace with actual save button ID
    this.datePicker = page.locator('#datePickerId'); // Replace with actual date picker ID
  }
}
