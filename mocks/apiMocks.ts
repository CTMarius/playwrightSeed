import { Page } from '@playwright/test';
import getEntryResponse from './responses/getEntry.json';
import saveEntryResponse from './responses/saveEntry.json';
import specialContentResponse from './responses/specialContent.json';
import edgeCasesResponse from './responses/edgeCases.json';
import slowResponse from './responses/slowResponse.json';

const API_ENDPOINTS = {
  GET_ENTRY: '**/api/entry?date=*',
  SAVE_ENTRY: '**/api/entry',
  DELETE_ENTRY: '**/api/entry?id=*'
};

// Basic mock handlers
export async function setupGetEntryMock(page: Page) {
  await page.route(API_ENDPOINTS.GET_ENTRY, async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(getEntryResponse)
    });
  });
}

export async function setupSaveEntryMock(page: Page) {
  await page.route(API_ENDPOINTS.SAVE_ENTRY, async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        body: JSON.stringify(saveEntryResponse)
      });
    }
  });
}

// Special content mocks
export async function setupSpecialContentMock(page: Page, contentType: 'multiline' | 'unicode' | 'emoji' | 'html') {
  await page.route(API_ENDPOINTS.GET_ENTRY, async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(specialContentResponse[contentType])
    });
  });
}

// Edge case mocks
export async function setupLeapYearMock(page: Page) {
  await page.route(API_ENDPOINTS.GET_ENTRY, async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(edgeCasesResponse.leapYear)
    });
  });
}

export async function setupMonthEndMock(page: Page, index: number) {
  await page.route(API_ENDPOINTS.GET_ENTRY, async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(edgeCasesResponse.monthEnds[index])
    });
  });
}

// Error case mocks
export async function setupNetworkErrorMock(page: Page) {
  await page.route(API_ENDPOINTS.SAVE_ENTRY, async route => {
    await route.abort('failed');
  });
}

export async function setupSlowResponseMock(page: Page) {
  await page.route(API_ENDPOINTS.SAVE_ENTRY, async route => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await route.fulfill({
      status: 200,
      body: JSON.stringify(slowResponse)
    });
  });
}