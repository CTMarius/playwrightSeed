import { test, expect } from "@playwright/test";

test.describe("Notes application", () => {
  test("@saveButton Save button changes status", async ({ page }) => {
    await test.step("Navigate to the main page", async () => {
      await page.goto("URL_TO_YOUR_APPLICATION");
    });

    await test.step("Type text in the text field", async () => {
      await page.fill('input[type="text"]', "GB");
    });

    await test.step("Check initial save button status", async () => {
      expect(
        await page.getAttribute('button[data-testid="saveButton"]', "disabled"),
      ).toBeFalsy();
    });

    await test.step("Clear text field and check save button status", async () => {
      await page.fill('input[type="text"]', "");
      expect(
        await page.getAttribute('button[data-testid="saveButton"]', "disabled"),
      ).toBeTruthy();
    });
  });

  test("@textField Save text", async ({ page }) => {
    await test.step("Navigate to the main page", async () => {
      await page.goto("URL_TO_YOUR_APPLICATION");
    });

    await test.step("Type text in the text field", async () => {
      await page.fill('input[type="text"]', "GB");
    });

    await test.step("Click on the save button", async () => {
      await page.click('button[data-testid="saveButton"]');
      // Add assertions as needed
    });
  });

  test("@datePicker Set a different date", async ({ page }) => {
    await test.step("Navigate to the main page", async () => {
      await page.goto("URL_TO_YOUR_APPLICATION");
    });

    await test.step("Type text in the text field", async () => {
      await page.fill('input[type="text"]', "String to type");
    });

    await test.step("Select a different date", async () => {
      await page.fill('input[type="date"]', "2013-09-25");
      expect(await page.inputValue('input[type="date"]')).toBe("2013-09-25");
    });
  });

  test("@compareJsonFiles Compare two json files", async ({}) => {
    // Assuming you have logic to read and compare JSON files
    const actualJson = require("./dataFiles/sample2.json");
    const expectedJson = require("./dataFiles/sample3.json");
    expect(actualJson).toEqual(expectedJson);
  });
});
