import { test, expect } from '@playwright/test';
import { setupNotesApiInterceptors, setupTestSpecificMock, setupInvalidDateMock, setupNetworkErrorMock, setupSlowNetworkMock, setupSpecialContentMock } from '../../mocks/notesApiInterceptors';
import { clearMockData } from '../../mocks/notesMockData';
import { 
  reloadPageAndWait, 
  fillAndSaveContent, 
  fillDateContentAndSave,
  triggerInvalidDateEvent
} from '../../utils/testUtils';
import { testNotes } from '../data/testNotes';

const baseURL = "https://keen-ardinghelli-99a36b30.netlify.app";

test.describe("Notes Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Clear mock data before each test
    clearMockData();
    
    // Setup API mocking
    await page.route("**/api/entry**", setupNotesApiInterceptors);

    await page.goto(baseURL);
  });

  test("Save button should be disabled when text field is empty", async ({ page }) => {
    const saveButton = page.getByRole("button", { name: "Save" });
    await expect(saveButton).toBeDisabled();
  });

  test("Save button should be enabled when text field has content", async ({ page }) => {
    const textArea = page.locator('#textarea');
    const saveButton = page.getByRole("button", { name: "Save" });

    await textArea.fill("Test content");
    await expect(saveButton).toBeEnabled();
  });

  test("Should save and persist text content", async ({ page }) => {
    const textArea = page.locator('#textarea');
    const testContent = "Test content to save";
    const testDate = "2025-04-14";

    // Set up specific mocks for this test
    await page.route("**/api/entry**", (route) => 
      setupTestSpecificMock(route, testContent, testDate)
    );

    // Fill in the text area and save
    await fillAndSaveContent(page, testContent);
    
    // Reload the page to verify persistence
    await reloadPageAndWait(page);
    
    // Verify the content is still there
    await expect(textArea).toHaveValue(testContent, { timeout: 10000 });
  });

  test("Should handle date selection and persistence", async ({ page }) => {
    const datePicker = page.locator('#datepicker');
    const textArea = page.locator('#textarea');
    const testDate = "2013-09-25";
    const testContent = "Content for specific date";

    // Set up specific mocks for this test
    await page.route("**/api/entry**", (route) => 
      setupTestSpecificMock(route, testContent, testDate)
    );

    // Fill in date, content and save
    await fillDateContentAndSave(page, testDate, testContent);
    
    // Reload the page to verify persistence
    await reloadPageAndWait(page);

    await expect(datePicker).toHaveValue(testDate, { timeout: 10000 });
    await expect(textArea).toHaveValue(testContent, { timeout: 10000 });
  });

  test("Should handle invalid date format through API", async ({ page }) => {
    const textArea = page.locator('#textarea');
    const invalidDate = "2013-13-45";
    
    // Fill in content to enable the save button
    await textArea.fill("Test content");
    
    // Mock an API response for an invalid date
    await page.route("**/api/entry**", (route) => 
      setupInvalidDateMock(route, invalidDate)
    );

    // Trigger the API call with an invalid date
    await triggerInvalidDateEvent(page, invalidDate);

    // Verify error message appears
    await expect(page.getByText("Invalid date format")).toBeVisible();
  });

  test("Should prevent saving empty content", async ({ page }) => {
    const textArea = page.locator('#textarea');
    const saveButton = page.getByRole("button", { name: "Save" });

    // Verify button is disabled when textarea is empty
    await textArea.fill("");
    await expect(saveButton).toBeDisabled();

    // Try to trigger the save action using JavaScript
    await page.evaluate(() => {
      const saveButton = document.getElementById('save');
      if (saveButton) {
        saveButton.click();
      }
    });

    // Verify no API call was made (mock should not have been called)
    await expect(page.getByText("Content cannot be empty")).not.toBeVisible();
  });

  test("Should handle special content types", async ({ page }) => {
    const textArea = page.locator('#textarea');
    
    // Test multiline content
    await page.route("**/api/entry**", (route) => 
      setupSpecialContentMock(route, 'multiline')
    );
    await fillAndSaveContent(page, testNotes.multiline);
    await reloadPageAndWait(page);
    await expect(textArea).toHaveValue(testNotes.multiline);

    // Test unicode content
    await page.route("**/api/entry**", (route) => 
      setupSpecialContentMock(route, 'unicode')
    );
    await fillAndSaveContent(page, testNotes.unicode);
    await reloadPageAndWait(page);
    await expect(textArea).toHaveValue(testNotes.unicode);

    // Test HTML content (should be sanitized)
    await page.route("**/api/entry**", (route) => 
      setupSpecialContentMock(route, 'html')
    );
    await fillAndSaveContent(page, testNotes.html);
    await reloadPageAndWait(page);
    const savedContent = await textArea.inputValue();
    expect(savedContent).toContain("Test");
    expect(savedContent).not.toContain("<script>");

    // Test emoji content
    await page.route("**/api/entry**", (route) => 
      setupSpecialContentMock(route, 'emoji')
    );
    await fillAndSaveContent(page, testNotes.emoji);
    await reloadPageAndWait(page);
    await expect(textArea).toHaveValue(testNotes.emoji);
  });

  test("Should handle date edge cases", async ({ page }) => {
    const datePicker = page.locator('#datepicker');
    const textArea = page.locator('#textarea');
    
    // Test leap year date
    const leapYearDate = "2024-02-29";
    await page.route("**/api/entry**", (route) => 
      setupTestSpecificMock(route, testNotes.medium, leapYearDate)
    );
    await fillDateContentAndSave(page, leapYearDate, testNotes.medium);
    await reloadPageAndWait(page);
    await expect(datePicker).toHaveValue(leapYearDate);

    // Test month end dates
    const monthEnds = ["2024-01-31", "2024-04-30", "2024-06-30", "2024-09-30", "2024-11-30"];
    for (const date of monthEnds) {
      await page.route("**/api/entry**", (route) => 
        setupTestSpecificMock(route, testNotes.medium, date)
      );
      await fillDateContentAndSave(page, date, testNotes.medium);
      await reloadPageAndWait(page);
      await expect(datePicker).toHaveValue(date);
    }
  });

  test("Should handle concurrent save operations", async ({ page }) => {
    const textArea = page.locator('#textarea');
    const saveButton = page.getByRole("button", { name: "Save" });
    
    // Mock API for concurrent operations
    await page.route("**/api/entry**", (route) => {
      const request = route.request();
      const content = request.postData();
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, content })
      });
    });

    // Perform concurrent saves
    const promises: Promise<void>[] = [];
    for (let i = 0; i < 3; i++) {
      const content = `Concurrent note ${i}`;
      promises.push(
        textArea.fill(content).then(() => saveButton.click())
      );
    }
    await Promise.all(promises);
    
    // Verify all content was saved
    await reloadPageAndWait(page);
    const savedContent = await textArea.inputValue();
    for (let i = 0; i < 3; i++) {
      expect(savedContent).toContain(`Concurrent note ${i}`);
    }
  });

  test("Should handle network errors gracefully", async ({ page }) => {
    const textArea = page.locator('#textarea');
    const saveButton = page.getByRole("button", { name: "Save" });
    
    // Mock network error
    await page.route("**/api/entry**", setupNetworkErrorMock);

    await textArea.fill(testNotes.medium);
    await saveButton.click();
    
    // Verify error handling
    await expect(page.getByText("Failed to save note")).toBeVisible();
  });

  test("Should handle slow network responses", async ({ page }) => {
    const textArea = page.locator('#textarea');
    const saveButton = page.getByRole("button", { name: "Save" });
    
    // Mock slow network
    await page.route("**/api/entry**", (route) => setupSlowNetworkMock(route, 1000));

    await textArea.fill(testNotes.medium);
    await saveButton.click();
    
    // Verify loading state
    await expect(page.getByText("Saving...")).toBeVisible();
    
    // Wait for save to complete
    await expect(page.getByText("Saving...")).not.toBeVisible();
    await expect(page.getByText("Note saved")).toBeVisible();
  });
}); 