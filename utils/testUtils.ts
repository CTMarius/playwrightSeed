import { Page } from '@playwright/test';

/**
 * Waits for the page to load and process API responses
 * @param page The page to wait on
 * @param timeout The timeout in milliseconds
 */
export async function waitForPageLoad(page: Page, timeout = 2000): Promise<void> {
  await page.waitForTimeout(timeout);
}

/**
 * Reloads the page and waits for it to load
 * @param page The page to reload
 * @param timeout The timeout in milliseconds
 */
export async function reloadPageAndWait(page: Page, timeout = 2000): Promise<void> {
  await page.reload();
  await waitForPageLoad(page, timeout);
}

/**
 * Fills in the text area and clicks the save button
 * @param page The page to interact with
 * @param content The content to fill in the text area
 */
export async function fillAndSaveContent(page: Page, content: string): Promise<void> {
  const textArea = page.locator('#textarea');
  const saveButton = page.getByRole("button", { name: "Save" });

  await textArea.fill(content);
  await saveButton.click();
  
  // Wait for the save operation to complete
  await page.waitForTimeout(1000);
}

/**
 * Fills in the date picker, text area, and clicks the save button
 * @param page The page to interact with
 * @param date The date to fill in the date picker
 * @param content The content to fill in the text area
 */
export async function fillDateContentAndSave(
  page: Page, 
  date: string, 
  content: string
): Promise<void> {
  const datePicker = page.locator('#datepicker');
  const textArea = page.locator('#textarea');
  const saveButton = page.getByRole("button", { name: "Save" });

  await datePicker.fill(date);
  await textArea.fill(content);
  await saveButton.click();
  
  // Wait for the save operation to complete
  await page.waitForTimeout(1000);
}

/**
 * Triggers a custom event with an invalid date
 * @param page The page to trigger the event on
 * @param invalidDate The invalid date to use
 */
export async function triggerInvalidDateEvent(
  page: Page, 
  invalidDate: string
): Promise<void> {
  await page.evaluate((date) => {
    const event = new CustomEvent('dateSelected', { 
      detail: { date } 
    });
    document.dispatchEvent(event);
  }, invalidDate);
} 