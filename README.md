# Playwright Test Automation Framework

This project contains an end-to-end testing framework built with Playwright, following the Page Object Model (POM) pattern and best practices for test automation.

## Project Structure

```
├── fixtures/          # Test fixtures and custom test configurations
├── mocks/             # Mock data and API responses
├── pageActions/       # Page action classes that handle user interactions
├── pageObjects/       # Page object classes that define element locators
├── tests/             # Test files containing test cases
│   ├── api/           # API tests
│   ├── data/          # Test data files
│   ├── endtoend/      # End-to-end tests
│   └── integration/   # Integration tests
├── test-results/      # Test execution results and reports
└── playwright-report/ # HTML reports generated after test execution
```

## Directory Details

- **fixtures/**: Custom test fixtures that extend Playwright's base fixtures
- **mocks/**: Mock data and API responses for testing
  - **notesApiInterceptors.ts**: API interceptors for mocking API responses
  - **notesMockData.ts**: Mock data and helper functions for testing
- **pageActions/**: Classes that implement user interactions with page elements
- **pageObjects/**: Classes that define element locators and page structure
- **tests/**: Contains all test files with test cases
  - **api/**: API tests
  - **data/**: Test data files (e.g., testNotes.ts)
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

### Run tests in a specific file
```bash
npx playwright test tests/endtoend/entoendTestExample.spec.ts
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
Integration tests test specific features and edge cases. These tests are located in the `tests/integration/` directory and focus on:
- Testing specific features in isolation
- Testing edge cases and error conditions
- Testing API interactions
- Testing concurrent operations
- Testing performance characteristics
- Testing data validation

### API Tests
API tests test the API endpoints directly. These tests are located in the `tests/api/` directory.

## Test Data

Test data is stored in the `tests/data/` directory. The main test data file is `testNotes.ts`, which contains:
- Different types of test notes (short, medium, long, etc.)
- Special content types (multiline, unicode, HTML, emoji)
- TypeScript interfaces for type safety

## Mocking

The project uses a robust mocking system for API responses:

### Mock Data
The `mocks/notesMockData.ts` file contains:
- Mock data for the notes API
- Helper functions for common operations
- Functions to simulate network conditions (delays, errors)
- CRUD operations (create, read, update, delete)

### API Interceptors
The `mocks/notesApiInterceptors.ts` file contains:
- API interceptors for different HTTP methods (GET, POST, PUT, DELETE)
- Error handling
- Network simulation (delays, errors)
- Specific mock functions for different test scenarios

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
3. **Test Data**: Store test data separately in the tests/data directory
4. **Fixtures**: Use fixtures for common setup and teardown operations
5. **Mocking**: Use mocks directory for mock data and responses
6. **Test Organization**: Organize tests by type (e2e, integration, api)
7. **Type Safety**: Use TypeScript interfaces for better type safety

## Contributing

1. Create a new branch for your feature
2. Write tests following the existing patterns
3. Ensure all tests pass
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details