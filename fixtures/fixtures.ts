import { test as baseTest } from '@playwright/test';
import { MainPage } from './../pageObjects/pageObjects';
import { PageActions } from './../pageActions/pageActions';

type MyFixtures = {
  mainPage: MainPage;
  pageActions: PageActions;
};

export const test = baseTest.extend<MyFixtures>({
    mainPage: async ({ page }, use) => {
    const examplePage = new MainPage(page);
    await use(examplePage);
  },
  pageActions: async ({ page }, use) => {
    const pageActions = new PageActions(page);
    await use(pageActions);
  },
});

export { expect } from '@playwright/test';
