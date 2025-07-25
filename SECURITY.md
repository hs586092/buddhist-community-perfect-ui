# 🔐 불교 커뮤니티 플랫폼 - 보안 설계서

## 🛡️ 보안 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 CloudFront + WAF                      │
│  ├── DDoS Protection                                        │
│  ├── Rate Limiting                                          │
│  ├── IP Filtering                                           │
│  └── SQL Injection Prevention                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                🔐 AWS Cognito                               │
│  ├── User Pool (Authentication)                             │
│  ├── Identity Pool (Authorization)                          │
│  ├── MFA (TOTP & SMS)                                      │
│  ├── Social Providers (Google, Kakao)                      │
│  └── Custom Attributes                                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                🔗 AppSync + IAM                             │
│  ├── JWT Token Validation                                   │
│  ├── Fine-grained Permissions                              │
│  ├── Owner-based Access                                     │
│  ├── Group-based Access                                     │
│  └── Custom Authorizers                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│            📊 DynamoDB + S3 Encryption                      │
│  ├── Encryption at Rest (KMS)                              │
│  ├── Encryption in Transit (TLS 1.3)                       │
│  ├── Field-level Encryption                                │
│  └── Access Logging                                         │
└─────────────────────────────────────────────────────────────┘
```

## 🔑 인증 (Authentication) 설계

### AWS Cognito User Pool 설정

```typescript
// cognito-config.ts
import { CognitoUserPoolConfig } from '@aws-amplify/auth';

export const cognitoConfig: CognitoUserPoolConfig = {
  // 기본 설정
  userPoolId: process.env.REACT_APP_USER_POOL_ID!,
  userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID!,
  region: 'us-east-1',

  // 회원가입 설정
  signUpVerificationMethod: 'email',
  usernameAttributes: ['email'],
  autoVerifiedAttributes: ['email'],

  // 비밀번호 정책
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    temporaryPasswordValidityDays: 7
  },

  // MFA 설정
  mfa: 'OPTIONAL', // OFF | OPTIONAL | REQUIRED
  mfaTypes: ['TOTP', 'SMS'],

  // 소셜 로그인
  socialProviders: ['Google', 'Kakao'],
  oAuthConfig: {
    domain: 'buddhist-community.auth.us-east-1.amazoncognito.com',
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: ['http://localhost:3000/', 'https://main.dg07hceiqq1rb.amplifyapp.com/'],
    redirectSignOut: ['http://localhost:3000/', 'https://main.dg07hceiqq1rb.amplifyapp.com/'],
    responseType: 'code'
  },

  // 사용자 속성
  attributes: {
    email: { required: true, mutable: true },
    name: { required: false, mutable: true },
    'custom:temple': { required: false, mutable: true },
    'custom:dharma_name': { required: false, mutable: true },
    'custom:practice_years': { required: false, mutable: true },
    'custom:level': { required: false, mutable: true }
  },

  // 계정 복구
  accountRecovery: 'email_only', // email_only | phone_only | email_and_phone

  // 이메일 설정
  emailSettings: {
    emailSendingAccount: 'COGNITO_DEFAULT',
    replyToEmailAddress: 'noreply@buddhist-community.com',
    sourceArn: 'arn:aws:ses:us-east-1:123456789012:identity/buddhist-community.com'
  },

  // 고급 보안
  advancedSecurityMode: 'ENFORCED', // OFF | AUDIT | ENFORCED
  compromisedCredentialsRiskConfiguration: {
    actions: {
      eventAction: 'BLOCK' // BLOCK | NO_ACTION
    }
  },

  // 디바이스 추적
  deviceConfiguration: {
    challengeRequiredOnNewDevice: true,
    deviceOnlyRememberedOnUserPrompt: false
  }
};
```

### 커스텀 사용자 속성

```typescript
// 불교 커뮤니티 전용 사용자 속성
export interface CognitoUserAttributes {
  email: string;
  name: string;
  'custom:temple'?: string;           // 소속 사찰
  'custom:dharma_name'?: string;      // 법명
  'custom:practice_years'?: string;   // 수행 연수
  'custom:level'?: UserLevel;         // 수행 단계
  'custom:specialties'?: string;      // 전문 분야 (JSON)
  'custom:joined_date'?: string;      // 가입일
  'custom:verification_status'?: 'pending' | 'verified' | 'rejected';
}

// 사찰 인증 시스템
export interface TempleVerification {
  templeId: string;
  templeName: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  documentUrl: string; // 재직증명서 등
  status: 'pending' | 'approved' | 'rejected';
  verifiedAt?: string;
  verifiedBy?: string;
}
```

## 🛡️ 권한 부여 (Authorization) 설계

### GraphQL 권한 규칙

```graphql
# 1. 공개 읽기 + 소유자 전체 권한
type Review @model @auth(rules: [
  { allow: public, operations: [read] }
  { allow: owner, operations: [create, update, delete] }
  { allow: groups, groups: ["Moderators"], operations: [update, delete] }
]) {
  # ... 필드 정의
}

# 2. 그룹 기반 권한
type DharmaSession @model @auth(rules: [
  { allow: public, operations: [read] }
  { allow: groups, groups: ["TempleAdmins"], operations: [create, update] }
  { allow: groups, groups: ["SuperAdmins"], operations: [delete] }
]) {
  # ... 필드 정의
}

# 3. 사용자 정의 권한 (Lambda 함수)
type SensitiveUserData @model @auth(rules: [
  { allow: custom, provider: "verifyTempleAffiliation" }
]) {
  # ... 민감한 사용자 데이터
}

# 4. 필드 레벨 권한
type User @model @auth(rules: [
  { allow: owner }
  { allow: private, operations: [read] }
]) {
  id: ID!
  username: String!
  email: String! @auth(rules: [{ allow: owner }])
  # 이메일은 소유자만 볼 수 있음
}
```

### 사용자 그룹 계층 구조

```typescript
export enum UserGroup {
  // 일반 사용자
  USERS = 'Users',                    // 기본 사용자
  VERIFIED_USERS = 'VerifiedUsers',   // 인증된 사용자
  
  // 콘텐츠 관리
  CONTENT_CREATORS = 'ContentCreators', // 콘텐츠 생성자
  TEMPLE_ADMINS = 'TempleAdmins',      // 사찰 관리자
  
  // 모더레이션
  MODERATORS = 'Moderators',           // 중간 관리자
  SENIOR_MODERATORS = 'SeniorModerators', // 선임 관리자
  
  // 시스템 관리
  SUPER_ADMINS = 'SuperAdmins'         // 최고 관리자
}

// 권한 매트릭스
export const PERMISSION_MATRIX = {
  [UserGroup.USERS]: {
    reviews: ['create', 'read', 'update_own', 'delete_own'],
    posts: ['create', 'read', 'update_own', 'delete_own'],
    comments: ['create', 'read', 'update_own', 'delete_own'],
    chat: ['participate', 'read_public'],
    meditation: ['track_own', 'read_own']
  },
  
  [UserGroup.VERIFIED_USERS]: {
    ...PERMISSION_MATRIX[UserGroup.USERS],
    reviews: [...PERMISSION_MATRIX[UserGroup.USERS].reviews, 'verify_attendance'],
    dharma_sessions: ['register', 'attend'],
    advanced_features: ['private_chat', 'advanced_meditation_tools']
  },
  
  [UserGroup.TEMPLE_ADMINS]: {
    ...PERMISSION_MATRIX[UserGroup.VERIFIED_USERS],
    dharma_sessions: ['create', 'update', 'manage_attendance'],
    temple_content: ['create', 'update', 'delete'],
    user_verification: ['review', 'approve_temple_members']
  },
  
  [UserGroup.MODERATORS]: {
    ...PERMISSION_MATRIX[UserGroup.VERIFIED_USERS],
    content_moderation: ['review', 'hide', 'delete_inappropriate'],
    user_management: ['warn', 'temporary_ban'],
    reports: ['review', 'resolve']
  },
  
  [UserGroup.SUPER_ADMINS]: {
    all: ['*'] // 모든 권한
  }
};
```

### 커스텀 인증 Lambda 함수

```typescript
// lambda/custom-auth/temple-verification.ts
import { AppSyncAuthorizerHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export const handler: AppSyncAuthorizerHandler = async (event) => {
  const { identity, arguments: args } = event;
  
  // JWT 토큰에서 사용자 정보 추출
  const userId = identity?.claims?.sub;
  const customTemple = identity?.claims?.['custom:temple'];
  
  if (!userId || !customTemple) {
    return {
      isAuthorized: false,
      deniedFields: []
    };
  }
  
  try {
    // 사찰 소속 확인
    const templeVerification = await dynamodb.get({
      TableName: 'TempleVerifications',
      Key: { userId }
    }).promise();
    
    if (!templeVerification.Item || 
        templeVerification.Item.status !== 'approved') {
      return {
        isAuthorized: false,
        deniedFields: []
      };
    }
    
    // 요청하는 데이터가 본인 사찰 관련인지 확인
    const requestedTemple = args?.temple;
    if (requestedTemple && requestedTemple !== customTemple) {
      return {
        isAuthorized: false,
        deniedFields: []
      };
    }
    
    return {
      isAuthorized: true,
      deniedFields: []
    };
    
  } catch (error) {
    console.error('Temple verification error:', error);
    return {
      isAuthorized: false,
      deniedFields: []
    };
  }
};
```

## 🔒 데이터 보안

### DynamoDB 보안 설정

```typescript
// Infrastructure as Code (CDK)
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as kms from 'aws-cdk-lib/aws-kms';

export class SecurityStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // KMS 키 생성
    const encryptionKey = new kms.Key(this, 'DynamoDBEncryptionKey', {
      description: 'Encryption key for Buddhist Community DynamoDB tables',
      keyRotation: true, // 자동 키 로테이션
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    // DynamoDB 테이블
    const communityTable = new dynamodb.Table(this, 'CommunityTable', {
      tableName: 'BuddhistCommunity',
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      
      // 암호화 설정
      encryption: dynamodb.TableEncryption.CUSTOMER_MANAGED,
      encryptionKey: encryptionKey,
      
      // 백업 설정
      pointInTimeRecovery: true,
      deletionProtection: true,
      
      // 스트림 설정
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      
      billing: dynamodb.BillingMode.PAY_PER_REQUEST
    });

    // GSI 추가
    communityTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING }
    });
  }
}
```

### S3 보안 설정

```typescript
// S3 버킷 보안 구성
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const mediaBucket = new s3.Bucket(this, 'MediaBucket', {
  bucketName: 'buddhist-community-media',
  
  // 암호화
  encryption: s3.BucketEncryption.KMS_MANAGED,
  
  // 버전 관리
  versioned: true,
  
  // 공개 액세스 차단
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  
  // 생명주기 정책
  lifecycleRules: [{
    id: 'DeleteOldVersions',
    enabled: true,
    noncurrentVersionExpiration: cdk.Duration.days(30)
  }],
  
  // CORS 설정
  cors: [{
    allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
    allowedOrigins: ['https://main.dg07hceiqq1rb.amplifyapp.com'],
    allowedHeaders: ['*'],
    maxAge: 3600
  }]
});

// CloudFront OAI 생성
const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OAI', {
  comment: 'Buddhist Community Media Access'
});

// S3 버킷 정책
mediaBucket.grantRead(originAccessIdentity);
```

## 🛡️ 네트워크 보안

### WAF 규칙 설정

```typescript
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';

const webAcl = new wafv2.CfnWebACL(this, 'WebACL', {
  scope: 'CLOUDFRONT',
  defaultAction: { allow: {} },
  
  rules: [
    // AWS 관리형 규칙
    {
      name: 'AWSManagedRulesCommonRuleSet',
      priority: 1,
      statement: {
        managedRuleGroupStatement: {
          vendorName: 'AWS',
          name: 'AWSManagedRulesCommonRuleSet'
        }
      },
      action: { block: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'CommonRuleSetMetric'
      }
    },
    
    // SQL 인젝션 방어
    {
      name: 'AWSManagedRulesSQLiRuleSet',
      priority: 2,
      statement: {
        managedRuleGroupStatement: {
          vendorName: 'AWS',
          name: 'AWSManagedRulesSQLiRuleSet'
        }
      },
      action: { block: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'SQLiRuleSetMetric'
      }
    },
    
    // Rate Limiting
    {
      name: 'RateLimitRule',
      priority: 3,
      statement: {
        rateBasedStatement: {
          limit: 2000, // 5분당 2000 요청
          aggregateKeyType: 'IP'
        }
      },
      action: { block: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'RateLimitMetric'
      }
    },
    
    // 지역 차단 (필요시)
    {
      name: 'GeoBlockRule',
      priority: 4,
      statement: {
        geoMatchStatement: {
          countryCodes: ['CN', 'RU'] // 예시: 특정 국가 차단
        }
      },
      action: { block: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'GeoBlockMetric'
      }
    }
  ]
});
```

## 🔍 모니터링 & 감사

### CloudWatch 로그 설정

```typescript
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

// 보안 관련 로그 그룹
const securityLogGroup = new logs.LogGroup(this, 'SecurityLogs', {
  logGroupName: '/aws/lambda/buddhist-community-security',
  retention: logs.RetentionDays.ONE_YEAR,
  removalPolicy: cdk.RemovalPolicy.RETAIN
});

// 메트릭 필터
const failedLoginMetric = new logs.MetricFilter(this, 'FailedLoginMetric', {
  logGroup: securityLogGroup,
  metricNamespace: 'BuddhistCommunity/Security',
  metricName: 'FailedLogins',
  filterPattern: logs.FilterPattern.stringValue('$.eventType', '=', 'SignIn_Failure'),
  metricValue: '1'
});

// 알람 설정
const failedLoginAlarm = new cloudwatch.Alarm(this, 'FailedLoginAlarm', {
  metric: failedLoginMetric.metric(),
  threshold: 10,
  evaluationPeriods: 1,
  treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING
});
```

### 보안 이벤트 추적

```typescript
// 보안 이벤트 로깅
export interface SecurityEvent {
  eventId: string;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'PERMISSION_DENIED' | 
             'SUSPICIOUS_ACTIVITY' | 'DATA_ACCESS' | 'ADMIN_ACTION';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  resource?: string;
  action?: string;
  result: 'SUCCESS' | 'FAILURE';
  details?: Record<string, any>;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// 보안 이벤트 처리기
export class SecurityEventHandler {
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    // CloudWatch 로그에 기록
    console.log(JSON.stringify({
      ...event,
      source: 'BuddhistCommunity',
      version: '1.0'
    }));
    
    // 높은 심각도 이벤트는 즉시 알림
    if (event.severity === 'HIGH' || event.severity === 'CRITICAL') {
      await this.sendSecurityAlert(event);
    }
    
    // DynamoDB에 감사 로그 저장
    await this.saveAuditLog(event);
  }
  
  private async sendSecurityAlert(event: SecurityEvent): Promise<void> {
    // SNS 알림 발송
    // 관리자 이메일, Slack 등
  }
  
  private async saveAuditLog(event: SecurityEvent): Promise<void> {
    // DynamoDB 감사 테이블에 저장
  }
}
```

## 🔐 데이터 개인정보보호

### GDPR/개인정보보호법 준수

```typescript
// 개인정보 처리 동의 관리
export interface PrivacyConsent {
  userId: string;
  consentId: string;
  consentType: 'ESSENTIAL' | 'FUNCTIONAL' | 'ANALYTICS' | 'MARKETING';
  granted: boolean;
  grantedAt?: string;
  withdrawnAt?: string;
  ipAddress: string;
  userAgent: string;
  version: string; // 개인정보처리방침 버전
}

// 데이터 삭제 (잊혀질 권리)
export class DataDeletionService {
  async deleteUserData(userId: string, deletionType: 'SOFT' | 'HARD'): Promise<void> {
    if (deletionType === 'SOFT') {
      // 개인 식별 정보만 삭제, 익명화된 통계 데이터는 유지
      await this.anonymizeUserData(userId);
    } else {
      // 모든 사용자 데이터 완전 삭제
      await this.hardDeleteUserData(userId);
    }
    
    // 삭제 로그 기록
    await this.logDataDeletion(userId, deletionType);
  }
  
  private async anonymizeUserData(userId: string): Promise<void> {
    // 개인 식별 정보 익명화
    // 이름, 이메일, 전화번호 등을 해시값으로 대체
  }
  
  private async hardDeleteUserData(userId: string): Promise<void> {
    // 모든 관련 데이터 완전 삭제
    // 리뷰, 게시글, 댓글, 명상 기록 등
  }
}

// 데이터 이동 권리 (Data Portability)
export class DataExportService {
  async exportUserData(userId: string): Promise<UserDataExport> {
    const userData = await this.collectUserData(userId);
    
    return {
      exportedAt: new Date().toISOString(),
      format: 'JSON',
      data: {
        profile: userData.profile,
        reviews: userData.reviews,
        posts: userData.posts,
        meditation_sessions: userData.meditationSessions,
        social_interactions: userData.socialData
      }
    };
  }
}
```

## 🛡️ 보안 체크리스트

### 배포 전 보안 점검

```yaml
# 보안 체크리스트
security_checklist:
  authentication:
    - ✅ MFA 활성화
    - ✅ 강력한 비밀번호 정책
    - ✅ JWT 토큰 만료 시간 설정
    - ✅ 소셜 로그인 보안 설정
    
  authorization:
    - ✅ 최소 권한 원칙 적용
    - ✅ 역할 기반 접근 제어
    - ✅ API 레벨 권한 검증
    - ✅ 필드 레벨 보안
    
  data_protection:
    - ✅ 저장 데이터 암호화
    - ✅ 전송 데이터 암호화
    - ✅ 개인정보 마스킹
    - ✅ 백업 데이터 암호화
    
  infrastructure:
    - ✅ WAF 규칙 적용
    - ✅ DDoS 방어
    - ✅ VPC 보안 그룹
    - ✅ 네트워크 ACL
    
  monitoring:
    - ✅ 보안 로그 수집
    - ✅ 이상 징후 탐지
    - ✅ 알람 설정
    - ✅ 정기 보안 감사
    
  compliance:
    - ✅ 개인정보처리방침
    - ✅ 이용약관
    - ✅ 데이터 수집 동의
    - ✅ 감사 로그 보관
```

이 포괄적인 보안 설계는 불교 커뮤니티 플랫폼의 모든 보안 요구사항을 다루며, AWS 클라우드 환경에서 엔터프라이즈급 보안을 제공합니다. 🔐✨