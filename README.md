# Playwright Test Automation Framework

This project contains an end-to-end testing framework built with Playwright, following the Page Object Model (POM) pattern and best practices for test automation.

## Project Structure

```
├── data/              # Test data files
├── fixtures/          # Test fixtures and custom test configurations
├── mocks/             # Mock data and API responses
├── pageActions/       # Page action classes that handle user interactions
├── pageObjects/       # Page object classes that define element locators
├── tests/             # Test files containing test cases
│   ├── api/           # API tests
│   ├── endtoend/      # End-to-end tests
│   └── integration/   # Integration tests
├── test-results/      # Test execution results and reports
└── playwright-report/ # HTML reports generated after test execution
```

## Directory Details

- **data/**: Test data files
  - **testNotes.ts**: Test data for notes content
  - **testDates.ts**: Test data for date-related tests
- **fixtures/**: Custom test fixtures that extend Playwright's base fixtures
  - **fixtures.ts**: Custom fixtures for page objects and page actions
- **mocks/**: Mock data and API responses for testing
  - **notesApiInterceptors.ts**: API interceptors for mocking API responses
  - **notesMockData.ts**: Mock data and helper functions for testing
- **pageActions/**: Classes that implement user interactions with page elements
  - **pageActions.ts**: Page actions for interacting with the application
- **pageObjects/**: Classes that define element locators and page structure
  - **pageObjects.ts**: Page objects for the application
- **tests/**: Contains all test files with test cases
  - **api/**: API tests
  - **endtoend/**: End-to-end tests that test complete user flows
  - **integration/**: Integration tests that test specific features and edge cases
- **test-results/**: Stores test execution results and reports
- **playwright-report/**: Contains HTML reports generated after test execution

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm (Node Package Manager)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run tests using tags
```bash
npx playwright test --grep=@regression
```

### Run tests in UI mode
```bash
npx playwright test --ui
```

### Run tests in a specific browser
```bash
npx playwright test --project=chromium
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

## Test Organization

The tests are organized into different types:

### End-to-End Tests
End-to-end tests test complete user flows and real-world scenarios. These tests are located in the `tests/endtoend/` directory and focus on:
- Complete user flows
- Real-world scenarios
- System-wide functionality
- Offline capabilities
- State persistence

### Integration Tests
Integration tests verify specific features and edge cases. These tests are located in the `tests/integration/` directory and follow a clear structure:

#### Test Organization
- Tests use consistent mock setup in `beforeEach`
- Each test focuses on a specific behavior
- Mocks are easily overridden for special cases
- Clear separation between test logic and mock setup

#### Test Coverage
- Basic functionality (save, load)
- Edge cases (leap years, month ends)
- Special content handling (multiline, unicode, HTML)
- Error conditions (network errors)
- Performance aspects (slow responses)
- Data validation and persistence

### API Tests
API tests test the API endpoints directly. These tests are located in the `tests/api/` directory.

## Test Data

Test data is stored in the `data/` directory. The main test data files are:

### testNotes.ts
Contains different types of test notes:
- Short notes
- Medium notes
- Long notes
- Special content (multiline, unicode, HTML, emoji)

### testDates.ts
Contains date-related test data:
- Leap year dates
- Month end dates
- Invalid dates
- Test dates
- Future dates

## Mocking

The project uses a clean and maintainable mocking system for API responses:

### Mock Responses
The `mocks/responses/` directory contains separate JSON files for different response types:
- `getEntry.json`: Standard GET response
- `saveEntry.json`: Standard POST/save response
- `specialContent.json`: Special content cases (multiline, unicode, HTML, emoji)
- `edgeCases.json`: Edge cases (leap year, month-end dates)
- `slowResponse.json`: Slow network response data

### API Mocks
The `mocks/apiMocks.ts` file contains:
- Centralized API endpoint patterns
- Self-contained mock functions for each scenario
- Clear setup pattern with `setup*Mock` naming convention
- Automatic handling of HTTP methods
- Built-in network simulation (delays, errors)

Example of using mocks in tests:
```typescript
test.beforeEach(async ({ page }) => {
  // Setup default mocks
  await setupGetEntryMock(page);
  await setupSaveEntryMock(page);
});

test("custom scenario", async ({ page }) => {
  // Override with specific mock when needed
  await setupSpecialContentMock(page, 'multiline');
});
```

Key benefits of this approach:
- Endpoint patterns are defined in one place
- Each mock function is self-contained
- Default mocks are set up consistently
- Special case mocks can override defaults
- Tests are cleaner and focus on behavior

## Page Objects and Page Actions

The project follows the Page Object Model pattern:

### Page Objects
The `pageObjects/pageObjects.ts` file contains:
- Element locators for the application
- Page structure definitions

### Page Actions
The `pageActions/pageActions.ts` file contains:
- User interactions with the application
- Methods for filling forms, clicking buttons, etc.
- Methods for handling special events
- Utility functions for page loading and navigation
- Methods for triggering custom events

## Test Configuration

The project uses the following configuration in `playwright.config.ts`:

- Tests run in parallel by default
- HTML reporter is enabled
- Screenshots are captured on test failure
- Videos are retained on test failure
- Trace is collected on first retry
- Currently configured to run on Chromium browser
- Other browsers (Firefox, WebKit) are commented out but can be enabled

## Viewing Reports

After test execution, you can view the HTML report:
```bash
npx playwright show-report
```

## Best Practices

1. **Page Objects**: Keep element locators in page object classes
2. **Page Actions**: Implement user interactions in page action classes
3. **Test Data**: Store test data separately in the data directory
4. **Fixtures**: Use fixtures for common setup and teardown operations
5. **Mocking**: Use mocks directory for mock data and responses
6. **Test Organization**: Organize tests by type (e2e, integration, api)
7. **Type Safety**: Use TypeScript interfaces for better type safety
8. **Consolidation**: Keep related functionality in a single place (e.g., all page actions in the PageActions class)

## Contributing

1. Create a new branch for your feature
2. Write tests following the existing patterns
3. Ensure all tests pass
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details
