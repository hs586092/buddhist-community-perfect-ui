# API Client Library

Comprehensive TypeScript API clients for the Buddhist Community platform, featuring 5 microservices with robust error handling, caching, authentication, and development tools.

## Architecture

```
src/services/api/
├── types.ts                 # Core TypeScript interfaces
├── base/
│   ├── http-client.ts       # HTTP client with retry/cache/rate limiting
│   └── base-client.ts       # Base class for all service clients
├── clients/
│   ├── content-service.ts   # Content: Users, Posts, Comments, Media
│   ├── community-service.ts # Community: Groups, Events, Notifications
│   ├── analytics-service.ts # Analytics: Metrics, Dashboards, Reports
│   ├── admin-service.ts     # Admin: User management, Moderation, System
│   └── search-service.ts    # Search: Full-text search, Recommendations
├── mocks/                   # Development mock data and server
├── client-factory.ts        # Unified client factory and management
└── index.ts                 # Main exports and utilities
```

## Quick Start

### Basic Usage

```typescript
import { contentApi, communityApi, auth } from '@/services/api'

// Authentication
auth.setToken('your-jwt-token')

// Fetch posts
const posts = await contentApi.getPosts({ 
  category: 'meditation',
  page: 1,
  limit: 20 
})

// Create a group
const group = await communityApi.createGroup({
  name: 'Meditation Circle',
  description: 'A supportive community...',
  type: 'public',
  category: 'meditation'
})
```

### Factory Pattern

```typescript
import { apiClientFactory } from '@/services/api'

// Configure all clients
const factory = apiClientFactory.getInstance({
  baseURL: '/api',
  timeout: 10000,
  enableCache: true,
  enableRateLimit: false
})

// Get specific clients
const contentClient = factory.getClient('content')
const communityClient = factory.getClient('community')

// Set authentication for all clients
factory.setAuthToken('jwt-token')

// Health monitoring
const systemHealth = await factory.getSystemHealth()
```

## Service Clients

### Content Service

Manages users, posts, comments, and media files.

```typescript
import { contentApi } from '@/services/api'

// User management
const currentUser = await contentApi.getCurrentUser()
const userPosts = await contentApi.getUserPosts('user-id')

// Post operations
const posts = await contentApi.getPosts({ category: 'meditation' })
const post = await contentApi.createPost({
  title: 'Mindful Breathing',
  content: 'The practice of mindful breathing...',
  category: 'meditation',
  tags: ['mindfulness', 'breathing']
})

// Interactions
await contentApi.togglePostLike('post-id')
await contentApi.togglePostBookmark('post-id')

// Comments
const comments = await contentApi.getPostComments('post-id')
await contentApi.createComment({
  postId: 'post-id',
  content: 'Great insights!'
})

// Media uploads
const mediaFile = await contentApi.uploadMediaFile(file, {
  altText: 'Meditation guide',
  quality: 'high'
})
```

### Community Service

Handles groups, events, notifications, and social features.

```typescript
import { communityApi } from '@/services/api'

// Group management
const groups = await communityApi.getGroups({ type: 'public' })
const group = await communityApi.createGroup({
  name: 'Philosophy Study',
  type: 'private',
  category: 'study'
})

// Membership
await communityApi.joinGroup('group-id')
await communityApi.inviteToGroup('group-id', 'user-id')

// Events
const events = await communityApi.getEvents({
  type: 'online',
  startDate: '2025-01-01'
})

await communityApi.createEvent({
  title: 'Weekly Meditation',
  type: 'hybrid',
  startDate: '2025-01-25T18:00:00Z',
  endDate: '2025-01-25T19:30:00Z',
  timezone: 'America/Los_Angeles'
})

// RSVP and attendance
await communityApi.rsvpToEvent('event-id', 'attending')
await communityApi.checkInAttendee('event-id')

// Notifications
const notifications = await communityApi.getNotifications({ isRead: false })
await communityApi.markNotificationAsRead('notification-id')
const unreadCount = await communityApi.getUnreadNotificationsCount()

// Social features
await communityApi.followUser('user-id')
const followers = await communityApi.getUserFollowers('user-id')
const activityFeed = await communityApi.getActivityFeed()
```

### Analytics Service

Provides metrics collection, dashboards, and reporting.

```typescript
import { analyticsApi } from '@/services/api'

// Metrics collection
await analyticsApi.recordMetric({
  name: 'page_view',
  value: 1,
  unit: 'count',
  category: 'engagement',
  tags: { page: 'posts' }
})

// Batch metrics
await analyticsApi.recordMetrics([
  { name: 'user_login', value: 1, unit: 'count', category: 'activity' },
  { name: 'post_created', value: 1, unit: 'count', category: 'content' }
])

// Query time series data
const metricsData = await analyticsApi.queryMetrics({
  metrics: ['page_views', 'user_sessions'],
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  granularity: 'day'
})

// Real-time dashboard
const realTimeMetrics = await analyticsApi.getRealTimeMetrics(['engagement', 'activity'])

// Dashboard management
const dashboards = await analyticsApi.getDashboards()
await analyticsApi.createDashboard({
  name: 'Community Overview',
  layout: 'grid',
  widgets: [...]
})

// Reports
const reports = await analyticsApi.getReports({ type: 'engagement' })
const reportJob = await analyticsApi.generateReport('report-id', {
  format: 'pdf',
  startDate: '2025-01-01',
  endDate: '2025-01-31'
})

// Performance monitoring
const systemPerf = await analyticsApi.getSystemPerformance()
const healthStatus = await analyticsApi.getHealthStatus()
```

### Admin Service

Administrative functions for user management and system operations.

```typescript
import { adminApi } from '@/services/api'

// User management
const users = await adminApi.getUsers({ 
  role: 'user',
  status: 'active',
  page: 1 
})

const userDetails = await adminApi.getUserById('user-id', true) // include history
await adminApi.updateUser('user-id', { role: 'moderator' })
await adminApi.blockUser('user-id', 'Violation of community guidelines')

// Moderation
const moderationQueue = await adminApi.getModerationQueue({
  type: 'reported',
  priority: 'high'
})

await adminApi.takeModerationAction({
  type: 'warn',
  targetType: 'post',
  targetId: 'post-id',
  reason: 'Content violates guidelines'
})

const modHistory = await adminApi.getModerationHistory()
const modStats = await adminApi.getModerationStats()

// System settings
const settings = await adminApi.getSystemSettings()
await adminApi.updateSystemSettings({
  general: {
    siteName: 'Buddhist Community Platform',
    maintenanceMode: false
  }
})

// System overview and analytics
const overview = await adminApi.getSystemOverview()
const userAnalytics = await adminApi.getUserAnalytics({ timeframe: '30d' })

// System operations
const backupJob = await adminApi.createBackup({ type: 'full' })
const backups = await adminApi.getBackups()
await adminApi.clearCache('all')
await adminApi.toggleMaintenanceMode(true, 'Scheduled maintenance')
```

### Search Service

Full-text search, recommendations, and content discovery.

```typescript
import { searchApi } from '@/services/api'

// Basic search
const searchResults = await searchApi.search({
  q: 'meditation mindfulness',
  type: 'all',
  sort: 'relevance',
  page: 1,
  limit: 20
})

// Specialized searches
const posts = await searchApi.searchPosts('buddhist philosophy', {
  category: 'philosophy',
  sort: 'date'
})

const users = await searchApi.searchUsers('lama teacher', {
  location: { lat: 37.7749, lng: -122.4194, radius: 50 }
})

const groups = await searchApi.searchGroups('meditation circle')
const events = await searchApi.searchEvents('online workshop')

// Auto-complete and suggestions
const suggestions = await searchApi.getSuggestions('medita', {
  type: 'all',
  includeRecent: true
})

const tags = await searchApi.getAutoComplete('tags', 'mind', 10)

// Advanced search
const facetedResults = await searchApi.facetedSearch('meditation', {
  facets: ['category', 'tags', 'author'],
  filters: { category: ['meditation', 'mindfulness'] }
})

// Discovery
const trending = await searchApi.getTrending({
  type: 'content',
  timeframe: '24h'
})

const similar = await searchApi.findSimilar('post-id', 'post', { limit: 5 })

// Personalized recommendations
const recommendations = await searchApi.getRecommendations({
  types: ['posts', 'groups'],
  limit: 10
})

const interestBased = await searchApi.getRecommendationsByInterests(
  ['meditation', 'mindfulness', 'zen']
)

// Analytics
await searchApi.recordSearchInteraction({
  query: 'meditation',
  action: 'click',
  resultId: 'post-123',
  position: 1
})

const searchAnalytics = await searchApi.getSearchAnalytics({
  startDate: '2025-01-01',
  endDate: '2025-01-31'
})
```

## Features

### Authentication

All clients support JWT token authentication:

```typescript
import { auth } from '@/services/api'

// Set token for all clients
auth.setToken('eyJhbGciOiJIUzI1NiIs...')

// Clear authentication
auth.clearToken()

// Check auth status
const isAuthenticated = auth.isAuthenticated()
const authStatus = auth.getStatus()
```

### Error Handling

Comprehensive error handling with typed errors:

```typescript
import { isApiError, isNetworkError, isAuthError, retryApiCall } from '@/services/api'

try {
  const posts = await contentApi.getPosts()
} catch (error) {
  if (isAuthError(error)) {
    // Handle authentication error
    redirectToLogin()
  } else if (isNetworkError(error)) {
    // Handle network issues
    showNetworkError()
  } else if (isApiError(error)) {
    // Handle API-specific errors
    console.error('API Error:', error.message, error.code)
  }
}

// Automatic retry with exponential backoff
const posts = await retryApiCall(
  () => contentApi.getPosts(),
  3, // max retries
  1000 // initial delay
)
```

### Caching

Intelligent caching for improved performance:

```typescript
// Cache configuration per client
const factory = ApiClientFactory.getInstance({
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
    maxSize: 100
  }
})

// Manual cache operations
import { cache } from '@/services/api'

cache.clear() // Clear all caches
const stats = cache.getStats() // Get cache statistics
```

### Health Monitoring

Built-in health checking and monitoring:

```typescript
import { health } from '@/services/api'

// Check individual services
const serviceHealth = await health.check()

// Get overall system health
const systemHealth = await health.getSystem()

// Performance statistics
const performanceStats = await health.getStats()
```

## Development Tools

### Mock Data

Comprehensive mock data for development and testing:

```typescript
import { mockData, setupDevelopmentEnvironment } from '@/services/api/mocks'

// Setup development environment
setupDevelopmentEnvironment({
  enableMockServer: true,
  autoAuth: true,
  logLevel: 'verbose'
})

// Access mock data
console.log(mockData.users) // Sample users
console.log(mockData.posts) // Sample posts
console.log(mockData.groups) // Sample groups
```

### Mock Server

In-memory mock server for development:

```typescript
import { mockServer } from '@/services/api/mocks'

// Configure mock server
mockServer.updateConfig({
  delay: 500,
  failureRate: 0.05,
  requireAuth: false
})

// Add custom endpoints
mockServer.registerEndpoint('GET', '/custom/endpoint', () => {
  return { data: 'custom response' }
})

// Server statistics
const stats = mockServer.getStats()
```

### Development Console

Development utilities available in browser console:

```javascript
// Available in development mode
window.__mockData // All mock data
window.__mockServer // Mock server instance
window.__devCommands // Development commands

// Useful commands
__devCommands.listUsers() // Show all users in table
__devCommands.listPosts() // Show all posts in table
__devCommands.showEndpoints() // Show all mock endpoints
__devCommands.testAuth('token') // Test authentication
```

## Configuration

### Environment Variables

Configure API clients using environment variables:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.buddhist-community.org
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUGGING=true
```

### Client Factory Configuration

```typescript
import { ApiClientFactory } from '@/services/api'

const factory = ApiClientFactory.getInstance({
  baseURL: '/api',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
  enableCache: true,
  enableRateLimit: false,
  defaultHeaders: {
    'X-Client-Version': '1.0.0'
  }
})
```

## Best Practices

### Performance

1. **Use caching** for frequently accessed data
2. **Batch operations** when possible (bulk updates, etc.)
3. **Paginate** large datasets
4. **Debounce** search queries

### Error Handling

1. **Check error types** before handling
2. **Provide fallbacks** for network failures
3. **Log errors** appropriately
4. **Show user-friendly** error messages

### Security

1. **Validate auth tokens** before making requests
2. **Handle 401/403** responses properly
3. **Don't log** sensitive information
4. **Use HTTPS** in production

### Development

1. **Use mock server** for offline development
2. **Test error scenarios** with mock failures
3. **Monitor performance** with built-in metrics
4. **Validate responses** against TypeScript types

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type { 
  User, 
  Post, 
  ApiResponse, 
  PaginatedResponse 
} from '@/services/api'

// Strongly typed responses
const response: ApiResponse<User> = await contentApi.getCurrentUser()
const posts: PaginatedResponse<Post> = await contentApi.getPosts()

// Type-safe request parameters
await contentApi.createPost({
  title: 'Meditation Guide', // Required
  content: 'Content here...', // Required
  category: 'meditation', // Required
  tags: ['mindfulness'], // Optional
  // TypeScript will catch missing required fields
})
```

## Testing

### Unit Testing with Mocks

```typescript
import { createMockApiClient } from '@/services/api/mocks'

describe('Content API', () => {
  it('should fetch posts', async () => {
    const { factory, cleanup } = createMockApiClient()
    const contentApi = factory.getClient('content')
    
    const posts = await contentApi.getPosts()
    expect(posts.data).toHaveLength(2)
    
    cleanup() // Clean up mock
  })
})
```

### Integration Testing

```typescript
import { mockServer, mockResponses } from '@/services/api/mocks'

// Configure mock server for testing
mockServer.updateConfig({
  enabled: true,
  delay: 0, // No delay in tests
  failureRate: 0, // No random failures
  requireAuth: false
})

// Test with real API structure
const response = await mockServer.handleRequest(
  'GET',
  '/content/posts',
  undefined,
  {}
)
```

## Migration Guide

### From v0.x to v1.x

1. **Import changes**: Update import paths to use the new structure
2. **Factory pattern**: Use `apiClientFactory` instead of individual clients
3. **Error handling**: Update to use new error checking utilities
4. **Authentication**: Use centralized `auth` utilities

```typescript
// Old way (v0.x)
import { ContentApi } from './api/content'
const contentApi = new ContentApi()

// New way (v1.x)
import { contentApi } from '@/services/api'
// or
import { apiClientFactory } from '@/services/api'
const contentApi = apiClientFactory.getClient('content')
```

## Contributing

### Adding New Endpoints

1. **Update types**: Add new interfaces to `types.ts`
2. **Implement method**: Add method to appropriate service client
3. **Add mock data**: Create mock response in `mocks/`
4. **Update tests**: Add unit tests for the new endpoint
5. **Document**: Update this README with usage examples

### Adding New Services

1. **Create client**: Add new service client in `clients/`
2. **Extend factory**: Add service to client factory
3. **Add mock support**: Create mock endpoints
4. **Export**: Add exports to main `index.ts`
5. **Document**: Add service documentation

## API Reference

For detailed API documentation, see individual service files:

- [Content Service](./clients/content-service.ts)
- [Community Service](./clients/community-service.ts)
- [Analytics Service](./clients/analytics-service.ts)
- [Admin Service](./clients/admin-service.ts)
- [Search Service](./clients/search-service.ts)

## Support

For issues and questions:

1. Check the [TypeScript definitions](./types.ts) for API contracts
2. Use development console tools for debugging
3. Enable verbose logging in development mode
4. Check mock server endpoints for available operations

## License

MIT License - see project root for details.