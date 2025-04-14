import { Locator, Page } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly textField: Locator;
  readonly saveButton: Locator;
  readonly datePicker: Locator;
  readonly errorMessage: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators
    this.textField = page.locator('#textarea');
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.datePicker = page.locator('#datepicker');
    this.errorMessage = page.locator('.error-message');
    this.loadingIndicator = page.locator('.loading-indicator');
  }
}
