/**
 * Global E2E Test Setup
 * 
 * QA persona focus: Comprehensive test environment preparation
 */

import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E test environment setup...')
  
  // Ensure the dev server is running
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Wait for the application to be available
    await page.goto('http://localhost:3000')
    await page.waitForSelector('body', { timeout: 30000 })
    console.log('✅ Application is ready for testing')
  } catch (error) {
    console.error('❌ Failed to connect to application:', error)
    throw error
  } finally {
    await page.close()
    await browser.close()
  }
}

export default globalSetup