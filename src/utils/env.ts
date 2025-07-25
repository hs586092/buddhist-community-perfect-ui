/**
 * Environment configuration utilities
 * Provides type-safe access to environment variables
 */

export const env = {
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Buddhist Community',
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'A modern Buddhist community platform',

  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUGGING: import.meta.env.VITE_ENABLE_DEBUGGING === 'true' || import.meta.env.DEV,
  ENABLE_PWA: import.meta.env.VITE_ENABLE_PWA === 'true',

  // External Services
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',

  // Development flags
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test',
} as const

/**
 * Validates that required environment variables are set
 */
export function validateEnvironment() {
  const required: Array<keyof typeof env> = ['APP_NAME', 'APP_URL']

  const missing = required.filter(key => !env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

/**
 * Gets environment-specific configuration
 */
export function getConfig() {
  return {
    ...env,
    // Add computed values
    isLocal: env.APP_URL.includes('localhost'),
    isStaging: env.APP_URL.includes('staging'),
    isProduction: env.isProd && !env.APP_URL.includes('localhost'),
  }
}

// Validate environment on import in non-test environments
if (!env.isTest) {
  validateEnvironment()
}
