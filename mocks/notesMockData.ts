import { testNotes } from '../data/testNotes';

// Types for our mock data
export interface NoteEntry {
  name: string;
  Created_date: string;
  id?: string;
  error?: string;
}

// Mock data for the notes API
export const mockEntries: NoteEntry[] = [
  { name: testNotes.short, Created_date: "2025-04-14T00:00:00.000Z", id: "1" },
  { name: testNotes.medium, Created_date: "2013-09-25T00:00:00.000Z", id: "2" },
  { name: testNotes.long, Created_date: "2024-01-01T00:00:00.000Z", id: "3" },
  { name: testNotes.special, Created_date: "2024-02-15T00:00:00.000Z", id: "4" }
];

// Helper function to add a new entry to the mock data
export function addMockEntry(name: string, Created_date: string, id?: string): void {
  mockEntries.push({ name, Created_date, id: id || String(mockEntries.length + 1) });
}

// Helper function to get entries for a specific date
export function getMockEntriesForDate(date: string): NoteEntry[] {
  const dateISO = new Date(date).toISOString();
  return mockEntries.filter(entry => entry.Created_date === dateISO);
}

// Helper function to clear mock data (useful for tests)
export function clearMockData(): void {
  mockEntries.length = 0;
}

// Helper function to simulate network delay
export function simulateNetworkDelay(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 100));
}

// Helper function to simulate network error
export function simulateNetworkError(): Promise<never> {
  return Promise.reject(new Error("Network error"));
}

// Helper function to get all entries
export function getAllEntries(): NoteEntry[] {
  return [...mockEntries];
}

// Helper function to get entry by ID
export function getEntryById(id: string): NoteEntry | undefined {
  return mockEntries.find(entry => entry.id === id);
}

// Helper function to update an entry
export function updateEntry(id: string, updates: Partial<NoteEntry>): boolean {
  const index = mockEntries.findIndex(entry => entry.id === id);
  if (index === -1) return false;
  
  mockEntries[index] = { ...mockEntries[index], ...updates };
  return true;
}

// Helper function to delete an entry
export function deleteEntry(id: string): boolean {
  const index = mockEntries.findIndex(entry => entry.id === id);
  if (index === -1) return false;
  
  mockEntries.splice(index, 1);
  return true;
} 