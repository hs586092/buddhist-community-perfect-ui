/**
 * Playwright Configuration
 * 
 * E2E testing configuration with QA persona focus:
 * - Prevention: Cross-browser testing, comprehensive coverage
 * - Detection: Visual regression, performance monitoring
 * - Correction: Retry logic, debugging tools, test isolation
 */

import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['line']
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test */
    trace: 'retain-on-failure',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    
    /* Global timeout for all tests */
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  /* Global setup */
  globalSetup: require.resolve('./tests/e2e/global-setup.ts'),
  
  /* Global teardown */
  globalTeardown: require.resolve('./tests/e2e/global-teardown.ts'),
  
  /* Test timeout */
  timeout: 30000,
  
  /* Expected timeout for assertions */
  expect: {
    timeout: 5000,
    toHaveScreenshot: { threshold: 0.2, animations: 'disabled' },
    toMatchSnapshot: { threshold: 0.2 },
  },

  /* Output directory */
  outputDir: 'test-results/',
  
  /* Test directory pattern */
  testMatch: '**/*.e2e.{test,spec}.{js,ts}',
  
  /* Global configuration */
  maxFailures: process.env.CI ? 10 : undefined,
})