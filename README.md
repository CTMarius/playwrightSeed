# Playwright Test Automation Framework

This project contains an end-to-end testing framework built with Playwright, following the Page Object Model (POM) pattern and best practices for test automation.

## Project Structure

```
├── apiControllers/     # API-related test controllers and helpers
├── fixtures/          # Test fixtures and custom test configurations
├── mocks/             # Mock data and API responses
├── pageActions/       # Page action classes that handle user interactions
├── pageObjects/       # Page object classes that define element locators
├── testData/          # Test data files and configurations
├── tests/             # Test files containing test cases
├── test-results/      # Test execution results and reports
└── playwright-report/ # HTML reports generated after test execution
```

## Directory Details

- **apiControllers/**: Contains API-related test controllers and helper functions for API testing
- **fixtures/**: Custom test fixtures that extend Playwright's base fixtures
- **mocks/**: Mock data and API responses for testing
- **pageActions/**: Classes that implement user interactions with page elements
- **pageObjects/**: Classes that define element locators and page structure
- **testData/**: Test data files, configurations, and test parameters
- **tests/**: Contains all test files with test cases
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
npx playwright test tests/entoendTestExample.spec.ts
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
3. **Test Data**: Store test data separately in the testData directory
4. **Fixtures**: Use fixtures for common setup and teardown operations
5. **API Testing**: Use apiControllers for API-related tests
6. **Mocking**: Use mocks directory for mock data and responses

## Contributing

1. Create a new branch for your feature
2. Write tests following the existing patterns
3. Ensure all tests pass
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details