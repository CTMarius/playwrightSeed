import { test, expect } from '../../fixtures/fixtures';
import { testNotes } from '../../data/testNotes';

const baseURL = "https://keen-ardinghelli-99a36b30.netlify.app/";

test.describe("@regression Notes application E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
  });

  test("@saveButton Save button changes status", async ({ pageActions, mainPage }) => {
    await test.step("Check initial save button status", async () => {
      expect(await mainPage.saveButton.isDisabled()).toBeTruthy();
    });

    await test.step("Type text in the text field", async () => {
      await pageActions.fillTextField(testNotes.short);
    });

    await test.step("Check save button status after filling in text", async () => {
      expect(await mainPage.saveButton.isEnabled()).toBeTruthy();
    });

    await test.step("Clear text field and check save button status", async () => {
      await pageActions.fillTextField("");
      expect(await mainPage.saveButton.isDisabled()).toBeTruthy();
    });
  });

  test("@textField Save and retrieve text", async ({ pageActions, mainPage, page }) => {
    await test.step("Type and save short text", async () => {
      await pageActions.fillTextField(testNotes.short);
      await pageActions.clickSaveButton();
      await page.reload();
      expect(await mainPage.textField.innerText()).toContain(testNotes.short);
    });

    await test.step("Type and save long text", async () => {
      await pageActions.fillTextField(testNotes.long);
      await pageActions.clickSaveButton();
      await page.reload();
      expect(await mainPage.textField.innerText()).toContain(testNotes.long);
    });
  });

  test("@datePicker Date picker functionality", async ({ pageActions, mainPage }) => {
    await test.step("Type text in the text field", async () => {
      await pageActions.fillTextField(testNotes.medium);
    });

    await test.step("Select a past date", async () => {
      await pageActions.selectDate("2013-09-25");
      expect(await mainPage.datePicker.inputValue()).toBe("2013-09-25");
    });

    await test.step("Select today's date", async () => {
      const today = new Date().toISOString().split('T')[0];
      await pageActions.selectDate(today);
      expect(await mainPage.datePicker.inputValue()).toBe(today);
    });
  });

  test("@offlineMode Offline functionality", async ({ pageActions, mainPage, page }) => {
    await test.step("Handle offline state", async () => {
      await pageActions.fillTextField(testNotes.medium);
      await page.context().setOffline(true);
      await pageActions.clickSaveButton();
      expect(await mainPage.textField.innerText()).not.toContain(testNotes.medium);
    });

    await test.step("Recover from offline state", async () => {
      await page.context().setOffline(false);
      await page.reload();
      await pageActions.fillTextField(testNotes.medium);
      await pageActions.clickSaveButton();
      expect(await mainPage.textField.innerText()).toContain(testNotes.medium);
    });
  });

  test("@statePersistence State persistence after refresh", async ({ pageActions, mainPage, page }) => {
    await test.step("Save note and verify persistence", async () => {
      await pageActions.fillTextField(testNotes.medium);
      await pageActions.clickSaveButton();
      await page.reload();
      expect(await mainPage.textField.innerText()).toContain(testNotes.medium);
    });

    await test.step("Verify state after multiple refreshes", async () => {
      for (let i = 0; i < 3; i++) {
        await page.reload();
        expect(await mainPage.textField.innerText()).toContain(testNotes.medium);
      }
    });
  });
});

