# 🚀 불교 커뮤니티 플랫폼 - 배포 가이드

## 📋 배포 체크리스트

### Phase 1: 개발 환경 준비
- ✅ **아키텍처 설계 완료**: DDD 기반 시스템 설계
- ✅ **GraphQL 스키마 설계**: 완전한 도메인 모델링
- ✅ **TypeScript 타입 시스템**: 전체 도메인 타입 정의
- ✅ **보안 설계**: AWS Cognito + IAM 기반 보안 아키텍처
- ✅ **빌드 시스템**: Vite 기반 빌드 검증 완료

### Phase 2: AWS Amplify 백엔드 구성
```bash
# 1. Amplify CLI 설치
npm install -g @aws-amplify/cli

# 2. AWS 자격 증명 구성
amplify configure

# 3. Amplify 프로젝트 초기화
amplify init

# 4. 백엔드 서비스 추가
amplify add auth      # Cognito 인증
amplify add api       # AppSync GraphQL API
amplify add storage   # S3 파일 저장소
amplify add analytics # Pinpoint 분석

# 5. 백엔드 배포
amplify push
```

### Phase 3: 프론트엔드 구현
```bash
# 1. AWS Amplify 라이브러리 설치
npm install aws-amplify @aws-amplify/ui-react

# 2. GraphQL 코드 생성
amplify codegen

# 3. 개발 서버 실행
npm run dev

# 4. 프로덕션 빌드
npm run build
```

### Phase 4: 배포 및 호스팅
```bash
# 1. Amplify 호스팅 추가
amplify add hosting

# 2. 전체 스택 배포
amplify publish

# 3. CI/CD 파이프라인 설정
# GitHub Actions 또는 Amplify Console 사용
```

## 🏗️ 인프라스트럭처 구성

### AWS 서비스 구성도
```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 Route 53 (DNS)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              🚀 CloudFront (CDN + WAF)                      │
│  ├── Global Edge Locations                                  │
│  ├── SSL/TLS Termination                                    │
│  ├── DDoS Protection                                        │
│  └── Web Application Firewall                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                🏠 Amplify Hosting                           │
│  ├── React SPA Hosting                                      │
│  ├── Auto Deployment                                        │
│  ├── Branch-based Environments                              │
│  └── Custom Domain                                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                🔗 AppSync (GraphQL)                         │
│  ├── Real-time Subscriptions                               │
│  ├── Offline Sync                                          │
│  ├── Data Source Resolvers                                 │
│  └── Caching Layer                                          │
└─┬─────────────┬─────────────┬─────────────┬─────────────────┘
  │             │             │             │
  ▼             ▼             ▼             ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐
│🔐Cognito│ │📊DynamoDB│ │📁 S3    │ │⚡ Lambda    │
│User Pool│ │Single   │ │Storage  │ │Functions   │
│& Groups │ │Table    │ │Bucket   │ │& Layers    │
└─────────┘ └─────────┘ └─────────┘ └─────────────┘
```

## 🛠️ 개발 환경 설정

### 환경 변수 설정
```bash
# .env.local
REACT_APP_AWS_REGION=us-east-1
REACT_APP_USER_POOL_ID=us-east-1_xxxxxxxxx
REACT_APP_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
REACT_APP_APPSYNC_GRAPHQL_ENDPOINT=https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql
REACT_APP_APPSYNC_REGION=us-east-1
REACT_APP_APPSYNC_AUTHENTICATION_TYPE=AMAZON_COGNITO_USER_POOLS
REACT_APP_S3_BUCKET=buddhist-community-storage-xxxxxxxxx
```

### Amplify 구성 파일
```typescript
// src/aws-exports.ts (Auto-generated)
const awsconfig = {
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_xxxxxxxxx',
  aws_user_pools_web_client_id: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
  oauth: {
    domain: 'buddhist-community-dev.auth.us-east-1.amazoncognito.com',
    scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
    redirectSignIn: 'http://localhost:3000/',
    redirectSignOut: 'http://localhost:3000/',
    responseType: 'code'
  },
  federationTarget: 'COGNITO_USER_POOLS',
  aws_appsync_graphqlEndpoint: 'https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_user_files_s3_bucket: 'buddhist-community-storage-xxxxxxxxx',
  aws_user_files_s3_bucket_region: 'us-east-1'
};

export default awsconfig;
```

이 배포 가이드를 통해 불교 커뮤니티 플랫폼을 안전하고 효율적으로 AWS 클라우드에 배포할 수 있습니다! 🚀✨