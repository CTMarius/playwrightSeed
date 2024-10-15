import { test, expect } from './../fixtures/fixtures'; // Import the custom fixtures
const baseURL = "https://keen-ardinghelli-99a36b30.netlify.app/";

test.describe("Notes application", () => {

  test("@saveButton Save button changes status", async ({ pageActions, mainPage, page }) => {
    await test.step("Navigate to the main page", async () => {
      await page.goto(baseURL);
    });

    await test.step("Check initial save button status", async () => {
      expect(await mainPage.saveButton.isDisabled()).toBeTruthy();
    });

    await test.step("Type text in the text field", async () => {
      await pageActions.fillTextField("GB");
    });

    await test.step("Check save button status after filling in text", async () => {
      expect(await mainPage.saveButton.isEnabled()).toBeTruthy();
    });

    await test.step("Clear text field and check save button status", async () => {
      await pageActions.fillTextField("");
      expect(await mainPage.saveButton.isDisabled()).toBeTruthy();
    });
  });

  test("@textField Save text", async ({ pageActions, mainPage, page }) => {
    await test.step("Navigate to the main page", async () => {
      await page.goto(baseURL);
    });

    await test.step("Type text in the text field", async () => {
      await pageActions.fillTextField("GB");
    });

    await test.step("Click on the save button", async () => {
      await pageActions.clickSaveButton();           
    });

    await test.step("Check that the text is actually saved", async () => {      
      await page.reload();
      expect(await mainPage.textField.innerText()).toContain("GB")
    });
  });

  test("@datePicker Set a different date", async ({ pageActions, mainPage, page }) => {
    await test.step("Navigate to the main page", async () => {
      await page.goto(baseURL);
    });

    await test.step("Type text in the text field", async () => {
      await pageActions.fillTextField("String to type");
    });

    await test.step("Select a different date", async () => {
      await pageActions.selectDate("2013-09-25");
      expect(await mainPage.datePicker.inputValue()).toBe("2013-09-25");
    });
  });

});
