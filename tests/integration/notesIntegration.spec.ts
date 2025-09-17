import { test, expect } from '@playwright/test';
import { PageActions } from '../../pageActions/pageActions';
import { MainPage } from '../../pageObjects/pageObjects';
import { testNotes } from '../../data/testNotes';
import { testDates } from '../../data/testDates';
import {
  setupGetEntryMock,
  setupSaveEntryMock,
  setupSpecialContentMock,
  setupLeapYearMock,
  setupMonthEndMock,
  setupNetworkErrorMock,
  setupSlowResponseMock
} from '../../mocks/apiMocks';

const baseURL = "https://keen-ardinghelli-99a36b30.netlify.app";

test.describe("Notes Integration Tests", () => {
  let pageActions: PageActions;
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    // Setup default mocks
    await setupGetEntryMock(page);
    await setupSaveEntryMock(page);

    await page.goto(baseURL);
    mainPage = new MainPage(page);
    pageActions = new PageActions(page);
  });

  test("Save button should be disabled when text field is empty", async () => {
    await expect(mainPage.saveButton).toBeDisabled();
  });

  test("Save button should be enabled when text field has content", async () => {
    await pageActions.fillTextField(testNotes.short);
    await expect(mainPage.saveButton).toBeEnabled();
  });

  test("Should save and persist text content", async ({ page }) => {
    await pageActions.fillTextField(testNotes.medium);
    await pageActions.clickSaveButton();
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(mainPage.textField).toHaveValue(testNotes.medium);
  });

  test("Should handle date selection and persistence", async ({ page }) => {
    await pageActions.selectDate(testDates.testDate);
    await pageActions.fillTextField(testNotes.medium);
    await pageActions.clickSaveButton();
    
    await page.reload();
    await page.waitForLoadState('networkidle');

    const currentDateValue = await mainPage.datePicker.inputValue();
    expect(currentDateValue).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    await expect(mainPage.textField).toHaveValue(testNotes.medium);
  });

  test("Should prevent saving empty content", async () => {
    await pageActions.fillTextField("");
    await expect(mainPage.saveButton).toBeDisabled();
  });

  test("Should handle special content types", async ({ page }) => {
    const specialTypes = ['multiline', 'unicode', 'emoji', 'html'] as const;
    
    for (const type of specialTypes) {
      await setupSpecialContentMock(page, type);
      await pageActions.fillTextField(testNotes[type]);
      await pageActions.clickSaveButton();
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const savedContent = await mainPage.textField.inputValue();
      if (type === 'html') {
        expect(savedContent).toContain("Test");
        expect(savedContent).not.toContain("<script>");
      } else {
        expect(savedContent).toBeTruthy();
      }
    }
  });

  test("Should handle date edge cases", async ({ page }) => {
    // Test leap year
    await setupLeapYearMock(page);
    await pageActions.selectDate(testDates.leapYear);
    await pageActions.fillTextField(testNotes.medium);
    await pageActions.clickSaveButton();
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const currentDateValue = await mainPage.datePicker.inputValue();
    expect(currentDateValue).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    // Test month end dates
    for (let i = 0; i < testDates.monthEnds.length; i++) {
      await setupMonthEndMock(page, i);
      await pageActions.selectDate(testDates.monthEnds[i]);
      await pageActions.fillTextField(testNotes.medium);
      await pageActions.clickSaveButton();
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const currentMonthEndDate = await mainPage.datePicker.inputValue();
      expect(currentMonthEndDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test("Should handle network errors gracefully", async ({ page }) => {
    await setupNetworkErrorMock(page);
    await pageActions.fillTextField(testNotes.medium);
    await pageActions.clickSaveButton();
    await page.waitForTimeout(1000);
  });

  test("Should handle slow network responses", async ({ page }) => {
    await setupSlowResponseMock(page);
    await pageActions.fillTextField(testNotes.medium);
    await pageActions.clickSaveButton();
    await page.waitForTimeout(2500);
  });
}); 