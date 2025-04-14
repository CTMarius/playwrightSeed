import { Route } from '@playwright/test';
import { 
  mockEntries, 
  addMockEntry, 
  getMockEntriesForDate, 
  NoteEntry,
  simulateNetworkDelay,
  simulateNetworkError,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry
} from './notesMockData';
import { testNotes } from '../tests/data/testNotes';

/**
 * Sets up API interceptors for the notes API
 * @param route The route to intercept
 * @returns A promise that resolves when the interception is complete
 */
export async function setupNotesApiInterceptors(route: Route): Promise<void> {
  const url = route.request().url();
  const method = route.request().method();

  // Handle GET requests
  if (method === "GET") {
    await handleGetRequest(route, url);
    return;
  }

  // Handle POST requests
  if (method === "POST") {
    await handlePostRequest(route);
    return;
  }

  // Handle PUT requests
  if (method === "PUT") {
    await handlePutRequest(route);
    return;
  }

  // Handle DELETE requests
  if (method === "DELETE") {
    await handleDeleteRequest(route, url);
    return;
  }

  await route.continue();
}

/**
 * Handles GET requests to the notes API
 * @param route The route to intercept
 * @param url The URL of the request
 * @returns A promise that resolves when the interception is complete
 */
async function handleGetRequest(route: Route, url: string): Promise<void> {
  const urlObj = new URL(url);
  const date = urlObj.searchParams.get("date");
  const id = urlObj.searchParams.get("id");
  
  // Simulate network delay
  await simulateNetworkDelay();
  
  // Get entry by ID
  if (id) {
    const entry = getEntryById(id);
    if (entry) {
      await route.fulfill({ 
        status: 200, 
        body: JSON.stringify(entry) 
      });
    } else {
      await route.fulfill({ 
        status: 404, 
        body: JSON.stringify({ error: "Entry not found" }) 
      });
    }
    return;
  }
  
  // Get entries by date
  if (date) {
    const entries = getMockEntriesForDate(date);
    await route.fulfill({ 
      status: 200, 
      body: JSON.stringify(entries) 
    });
    return;
  }
  
  // Get all entries
  const entries = getAllEntries();
  await route.fulfill({ 
    status: 200, 
    body: JSON.stringify(entries) 
  });
}

/**
 * Handles POST requests to the notes API
 * @param route The route to intercept
 * @returns A promise that resolves when the interception is complete
 */
async function handlePostRequest(route: Route): Promise<void> {
  const body = JSON.parse(await route.request().postData() || "{}");
  const { name, Created_date } = body;

  // Simulate network delay
  await simulateNetworkDelay();

  if (!name || !Created_date) {
    await route.fulfill({ 
      status: 400, 
      body: JSON.stringify({ error: "Name and date are required" }) 
    });
    return;
  }

  // Add the new entry to our mock data
  addMockEntry(name, Created_date);
  
  // Return success response
  await route.fulfill({ 
    status: 201, 
    body: JSON.stringify({ success: true }) 
  });
}

/**
 * Handles PUT requests to the notes API
 * @param route The route to intercept
 * @returns A promise that resolves when the interception is complete
 */
async function handlePutRequest(route: Route): Promise<void> {
  const body = JSON.parse(await route.request().postData() || "{}");
  const { id, name, Created_date } = body;

  // Simulate network delay
  await simulateNetworkDelay();

  if (!id) {
    await route.fulfill({ 
      status: 400, 
      body: JSON.stringify({ error: "ID is required" }) 
    });
    return;
  }

  const updates: Partial<NoteEntry> = {};
  if (name) updates.name = name;
  if (Created_date) updates.Created_date = Created_date;

  const success = updateEntry(id, updates);
  
  if (success) {
    await route.fulfill({ 
      status: 200, 
      body: JSON.stringify({ success: true }) 
    });
  } else {
    await route.fulfill({ 
      status: 404, 
      body: JSON.stringify({ error: "Entry not found" }) 
    });
  }
}

/**
 * Handles DELETE requests to the notes API
 * @param route The route to intercept
 * @param url The URL of the request
 * @returns A promise that resolves when the interception is complete
 */
async function handleDeleteRequest(route: Route, url: string): Promise<void> {
  const urlObj = new URL(url);
  const id = urlObj.searchParams.get("id");
  
  // Simulate network delay
  await simulateNetworkDelay();
  
  if (!id) {
    await route.fulfill({ 
      status: 400, 
      body: JSON.stringify({ error: "ID is required" }) 
    });
    return;
  }
  
  const success = deleteEntry(id);
  
  if (success) {
    await route.fulfill({ 
      status: 200, 
      body: JSON.stringify({ success: true }) 
    });
  } else {
    await route.fulfill({ 
      status: 404, 
      body: JSON.stringify({ error: "Entry not found" }) 
    });
  }
}

/**
 * Sets up a specific mock for a test case
 * @param route The route to intercept
 * @param testContent The content to return for the test
 * @param testDate The date to use for the test
 * @returns A promise that resolves when the interception is complete
 */
export async function setupTestSpecificMock(
  route: Route, 
  testContent: string, 
  testDate: string
): Promise<void> {
  const url = route.request().url();
  const method = route.request().method();
  const testDateISO = new Date(testDate).toISOString();

  // Handle POST request
  if (method === "POST") {
    const body = JSON.parse(await route.request().postData() || "{}");
    const { name, Created_date } = body;
    
    // Add the new entry to our mock data
    addMockEntry(name, Created_date);
    
    // Return success response
    await route.fulfill({ 
      status: 201, 
      body: JSON.stringify({ success: true }) 
    });
    return;
  }
  
  // Handle GET request
  if (method === "GET") {
    // Return an array with our test entry
    await route.fulfill({ 
      status: 200, 
      body: JSON.stringify([
        { name: testContent, Created_date: testDateISO, id: "test-id" }
      ]) 
    });
    return;
  }
  
  await route.continue();
}

/**
 * Sets up a mock for special content types
 * @param route The route to intercept
 * @param contentType The type of content to test
 * @param testDate The date to use for the test
 * @returns A promise that resolves when the interception is complete
 */
export async function setupSpecialContentMock(
  route: Route,
  contentType: 'multiline' | 'unicode' | 'html' | 'emoji',
  testDate: string = "2024-01-01"
): Promise<void> {
  const url = route.request().url();
  const method = route.request().method();
  const testDateISO = new Date(testDate).toISOString();
  
  let content: string;
  
  switch (contentType) {
    case 'multiline':
      content = testNotes.multiline;
      break;
    case 'unicode':
      content = testNotes.unicode;
      break;
    case 'html':
      content = testNotes.html;
      break;
    case 'emoji':
      content = testNotes.emoji;
      break;
    default:
      content = testNotes.medium;
  }
  
  // Handle POST request
  if (method === "POST") {
    const body = JSON.parse(await route.request().postData() || "{}");
    const { name, Created_date } = body;
    
    // Add the new entry to our mock data
    addMockEntry(name, Created_date);
    
    // Return success response
    await route.fulfill({ 
      status: 201, 
      body: JSON.stringify({ success: true }) 
    });
    return;
  }
  
  // Handle GET request
  if (method === "GET") {
    // Return an array with our test entry
    await route.fulfill({ 
      status: 200, 
      body: JSON.stringify([
        { name: content, Created_date: testDateISO, id: "special-content-id" }
      ]) 
    });
    return;
  }
  
  await route.continue();
}

/**
 * Sets up a mock for an invalid date format
 * @param route The route to intercept
 * @param invalidDate The invalid date to use
 * @returns A promise that resolves when the interception is complete
 */
export async function setupInvalidDateMock(
  route: Route, 
  invalidDate: string
): Promise<void> {
  const url = route.request().url();
  
  if (url.includes(`date=${invalidDate}`)) {
    await route.fulfill({ 
      status: 400, 
      body: JSON.stringify({ error: "Invalid date format" }) 
    });
    return;
  }
  
  await route.continue();
}

/**
 * Sets up a mock for a network error
 * @param route The route to intercept
 * @returns A promise that resolves when the interception is complete
 */
export async function setupNetworkErrorMock(route: Route): Promise<void> {
  await simulateNetworkError();
  await route.abort('failed');
}

/**
 * Sets up a mock for a slow network response
 * @param route The route to intercept
 * @param delayMs The delay in milliseconds
 * @returns A promise that resolves when the interception is complete
 */
export async function setupSlowNetworkMock(route: Route, delayMs: number = 2000): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, delayMs));
  await route.continue();
} 