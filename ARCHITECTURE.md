# 불교 커뮤니티 플랫폼 - 시스템 아키텍처

## 🏗️ 전체 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 CloudFront CDN                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                📱 React Frontend                            │
│  ├── Authentication UI (Cognito Hosted UI)                 │
│  ├── Review Management                                      │
│  ├── Community Chat                                         │
│  └── Practice Tracking                                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                🔗 AWS AppSync (GraphQL)                     │
│  ├── Real-time Subscriptions                               │
│  ├── Offline Sync                                          │
│  ├── Data Source Resolvers                                 │
│  └── Schema Stitching                                      │
└─┬─────────────┬─────────────┬─────────────┬─────────────────┘
  │             │             │             │
  ▼             ▼             ▼             ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐
│🔐Cognito│ │📊DynamoDB│ │📁 S3    │ │⚡ Lambda    │
│User Pool│ │Single   │ │Storage  │ │Functions   │
│& Groups │ │Table    │ │Bucket   │ │& Layers    │
└─────────┘ └─────────┘ └─────────┘ └─────────────┘
```

## 🛠️ 기술 스택

### Frontend
- **React 18** + **TypeScript 5.0**
- **AWS Amplify UI Components**
- **TailwindCSS** for styling
- **React Query** for state management
- **React Hook Form** for form handling

### Backend
- **AWS AppSync** (GraphQL API)
- **AWS Lambda** (Serverless functions)
- **DynamoDB** (NoSQL database)
- **S3** (File storage)
- **CloudWatch** (Monitoring)

### Authentication & Authorization
- **AWS Cognito User Pools**
- **Social Login** (Google, Kakao)
- **Multi-Factor Authentication**
- **Role-based Access Control**

## 📊 데이터 모델 설계

### DynamoDB Single-Table Design
```
PK (Partition Key) | SK (Sort Key)     | Type      | Attributes
USER#123          | PROFILE           | User      | name, email, temple
USER#123          | REVIEW#456        | Review    | rating, content, dharmaId
DHARMA#789        | METADATA          | Dharma    | title, temple, monk, date
DHARMA#789        | REVIEW#456        | Review    | userId, rating, content
CHAT#room1        | MSG#timestamp     | Message   | userId, content, type
```

### GraphQL Schema Structure
```graphql
type User @model @auth(rules: [{allow: owner}]) {
  id: ID!
  username: String!
  email: String!
  temple: String
  level: UserLevel!
  reviews: [Review] @hasMany(indexName: "byUser", fields: ["id"])
  posts: [Post] @hasMany(indexName: "byAuthor", fields: ["id"])
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type DharmaSession @model @auth(rules: [
  {allow: public, operations: [read]},
  {allow: groups, groups: ["Moderators"], operations: [create, update, delete]}
]) {
  id: ID!
  title: String!
  temple: String!
  monk: String!
  date: AWSDateTime!
  description: String
  category: DharmaCategory!
  reviews: [Review] @hasMany(indexName: "byDharmaSession", fields: ["id"])
  avgRating: Float
  reviewCount: Int
  isActive: Boolean!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type Review @model @auth(rules: [
  {allow: public, operations: [read]},
  {allow: owner, operations: [create, update, delete]}
]) {
  id: ID!
  dharmaSessionId: ID! @index(name: "byDharmaSession")
  dharmaSession: DharmaSession @belongsTo(fields: ["dharmaSessionId"])
  userId: ID! @index(name: "byUser")
  user: User @belongsTo(fields: ["userId"])
  rating: Int!
  content: String!
  images: [String]
  isVerified: Boolean
  comments: [Comment] @hasMany(indexName: "byReview", fields: ["id"])
  likes: Int
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

enum DharmaCategory {
  MEDITATION
  SUTRASTUDY  
  DHARMA_TALK
  CEREMONY
  RETREAT
}

enum UserLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  TEACHER
  MODERATOR
}
```

## 🔐 보안 설계

### 인증 전략
```typescript
// Cognito User Pool Configuration
const authConfig = {
  userPoolId: 'us-east-1_xxxxxx',
  userPoolWebClientId: 'xxxxxxxxxxxxxx',
  mandatorySignIn: true,
  signUpVerificationMethod: 'email',
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true
  },
  mfa: 'TOTP', // Time-based One-Time Password
  socialProviders: ['Google', 'Kakao']
};
```

### API 보안 계층
```typescript
// AppSync Authorization Rules
const securityRules = {
  // Public read access for dharma sessions
  publicRead: { allow: 'public', operations: ['read'] },
  
  // Owner-based access for personal data
  ownerAccess: { allow: 'owner' },
  
  // Group-based access for moderation
  moderatorAccess: { 
    allow: 'groups', 
    groups: ['Moderators', 'Admins'] 
  },
  
  // Custom authorization with Lambda
  customAuth: { allow: 'custom', provider: 'verifyTempleAttendance' }
};
```

## ⚡ 성능 최적화

### Frontend 최적화
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format + lazy loading
- **Caching Strategy**: Service Worker + Cache API
- **Bundle Optimization**: Tree shaking + compression

### Backend 최적화
- **DynamoDB Optimization**: GSI design + batch operations
- **AppSync Caching**: Redis-based resolver caching
- **Lambda Performance**: Provisioned concurrency + layers
- **CDN Strategy**: CloudFront edge caching

## 📈 확장성 설계

### 수평적 확장
- **DynamoDB Auto Scaling**
- **Lambda Concurrent Execution Limits**
- **AppSync Request Throttling**
- **CloudFront Global Distribution**

### 수직적 확장
- **Read Replicas** for DynamoDB
- **Lambda Memory Optimization**
- **Multi-AZ Deployment**
- **Cross-Region Replication**

## 🔄 CI/CD 파이프라인

```yaml
# .github/workflows/deploy.yml
name: Deploy to Amplify
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run build
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Amplify
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: amplify push --yes
```

## 📊 모니터링 & 관찰성

### CloudWatch 대시보드
- **API Response Times**
- **Error Rates by Endpoint**
- **User Authentication Metrics**
- **DynamoDB Performance Metrics**

### 알람 설정
- **High Error Rate** (> 5%)
- **API Latency** (> 2 seconds)
- **DynamoDB Throttling**
- **Lambda Cold Start Issues**

## 🔮 향후 확장 계획

### Phase 2: 고급 기능
- **AI 기반 콘텐츠 추천**
- **실시간 화상 법회**
- **다국어 지원**
- **모바일 앱 (React Native)**

### Phase 3: 글로벌 확장
- **Multi-Region Deployment**
- **CDN Edge Computing**
- **국가별 규정 준수**
- **언어별 콘텐츠 관리**