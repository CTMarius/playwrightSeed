import { test, expect } from '@playwright/test';
import { APIRequestContext } from '@playwright/test';
import { testNotes } from '../../data/testNotes';
import { testDates } from '../../data/testDates';

const baseURL = "https://keen-ardinghelli-99a36b30.netlify.app/api";

test.describe('Notes API', () => {
  let request: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL,
    });
  });

  test.afterAll(async () => {
    await request.dispose();
  });

  test('should create a new entry', async () => {
    const entryData = {
      date: testDates.futureDate,
      content: testNotes.medium
    };

    const response = await request.post('/entry', {
      data: entryData
    });
    
    expect(response.ok()).toBeTruthy();
    const createdEntry = await response.json();
    expect(createdEntry).toHaveProperty('date', entryData.date);
    expect(createdEntry).toHaveProperty('content', entryData.content);
  });

  test('should retrieve an entry by date', async () => {
    const date = testDates.futureDate;
    const response = await request.get(`/entry?date=${date}`);
    
    expect(response.ok()).toBeTruthy();
    const entry = await response.json();
    expect(entry).toHaveProperty('date', date);
    expect(entry).toHaveProperty('content');
  });

  test('should return 404 for non-existent date', async () => {
    const date = testDates.futureDate; // Use a future date that shouldn't exist
    const response = await request.get(`/entry?date=${date}`);
    
    expect(response.status()).toBe(404);
  });

  test('should handle invalid date format', async () => {
    const invalidDate = testDates.invalidDate; // Invalid date
    const response = await request.get(`/entry?date=${invalidDate}`);
    
    expect(response.status()).toBe(400);
  });

  test('should handle missing date parameter', async () => {
    const response = await request.get('/entry');
    
    expect(response.status()).toBe(400);
  });

  test('should handle invalid POST request body', async () => {
    const invalidData = {
      date: testDates.invalidDate, // Invalid date
      content: "" // Empty content
    };

    const response = await request.post('/entry', {
      data: invalidData
    });
    
    expect(response.status()).toBe(400);
  });

  test('should handle POST request with missing required fields', async () => {
    const incompleteData = {
      date: testDates.futureDate
      // Missing content field
    };

    const response = await request.post('/entry', {
      data: incompleteData
    });
    
    expect(response.status()).toBe(400);
  });
});