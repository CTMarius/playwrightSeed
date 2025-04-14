export interface TestDates {
  leapYear: string;
  monthEnds: string[];
  invalidDate: string;
  testDate: string;
  futureDate: string;
}

export const testDates: TestDates = {
  leapYear: "2024-02-29",
  monthEnds: ["2024-01-31", "2024-04-30", "2024-06-30", "2024-09-30", "2024-11-30"],
  invalidDate: "2013-13-45",
  testDate: "2013-09-25",
  futureDate: "2025-04-14"
}; 