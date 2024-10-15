import { test, expect } from './../fixtures/fixtures'; // Import the custom fixtures
const baseURL = "https://keen-ardinghelli-99a36b30.netlify.app/";

test.describe("Notes application", () => {

  test("@saveButton Save button changes status", async ({ pageActions }) => {
    await test.step("Navigate to the main page", async () => {
      await pageActions.mainPage.page.goto(baseURL);
    });

    await test.step("Check initial save button status", async () => {
      const status = await pageActions.mainPage.saveButton.getAttribute('disabled');
      console.log(status);
      expect(status === "disabled").toBeTruthy();
    });

    await test.step("Type text in the text field", async () => {
      await pageActions.fillTextField("GB");
    });

    await test.step("Check save button status after filling in text", async () => {
      const status = await pageActions.mainPage.saveButton.getAttribute('disabled');
      expect(status).toBeFalsy();
    });

    await test.step("Clear text field and check save button status", async () => {
      await pageActions.fillTextField("");
      const status = await pageActions.mainPage.saveButton.getAttribute('disabled');
      expect(status).toBeTruthy();
    });
  });

  test("@textField Save text", async ({ pageActions }) => {
    await test.step("Navigate to the main page", async () => {
      await pageActions.mainPage.page.goto(baseURL);
    });

    await test.step("Type text in the text field", async () => {
      await pageActions.fillTextField("GB");
    });

    await test.step("Click on the save button", async () => {
      await pageActions.clickSaveButton();
      // Add assertions as needed
    });
  });

  test("@datePicker Set a different date", async ({ pageActions }) => {
    await test.step("Navigate to the main page", async () => {
      await pageActions.mainPage.page.goto(baseURL);
    });

    await test.step("Type text in the text field", async () => {
      await pageActions.fillTextField("String to type");
    });

    await test.step("Select a different date", async () => {
      await pageActions.selectDate("2013-09-25");
      expect(await pageActions.mainPage.datePicker.inputValue()).toBe("2013-09-25");
    });
  });

  test("@compareJsonFiles Compare two json files", async () => {
    const actualJson = require("./dataFiles/sample2.json");
    const expectedJson = require("./dataFiles/sample3.json");
    expect(actualJson).toEqual(expectedJson);
  });

});
