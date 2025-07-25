#!/bin/bash

# 🇰🇷 Buddhist Community Korea - 한국 전용 최적화 배포 스크립트
# 비용 최적화 + 성능 최적화 + 한국어 특화

set -e

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🇰🇷 Buddhist Community Korea 최적화 배포 시작${NC}"
echo "=================================================="
echo -e "타겟: ${YELLOW}한국 불교도 전용${NC}"
echo -e "리전: ${YELLOW}서울 (ap-northeast-2) 단독${NC}"
echo -e "최적화: ${YELLOW}비용 + 성능 + 한국어${NC}"
echo ""

# 환경 설정
export AWS_DEFAULT_REGION=ap-northeast-2
export AWS_REGION=ap-northeast-2
PROJECT_NAME="BuddhistCommunityKR"
ENV_NAME="prod"

# 1. 한국 전용 환경 변수 생성
echo -e "${BLUE}1. 한국 전용 환경 설정${NC}"
echo "----------------------------------------"

cat > .env.korea << 'EOF'
# 🇰🇷 한국 전용 불교 커뮤니티 플랫폼 설정

# AWS 기본 설정 - 서울 리전 고정
VITE_AWS_REGION=ap-northeast-2
VITE_AWS_PROJECT_REGION=ap-northeast-2
VITE_AWS_COGNITO_REGION=ap-northeast-2
VITE_AWS_APPSYNC_REGION=ap-northeast-2
VITE_AWS_S3_REGION=ap-northeast-2

# 한국 로케일 설정
VITE_DEFAULT_LANGUAGE=ko
VITE_TIMEZONE=Asia/Seoul
VITE_CURRENCY=KRW
VITE_DATE_FORMAT=YYYY년 MM월 DD일
VITE_PHONE_FORMAT=+82
VITE_PHONE_REGEX=^01[016789]-?\d{3,4}-?\d{4}$

# 한국 불교 특화 설정
VITE_BUDDHIST_ERA=true
VITE_LUNAR_CALENDAR=true
VITE_TEMPLE_REGIONS=서울,경기,인천,강원,충북,충남,대전,세종,전북,전남,광주,경북,경남,대구,울산,부산,제주

# 비용 최적화 설정
VITE_CDN_CACHE_MAX_AGE=31536000
VITE_API_CACHE_TTL=300
VITE_IMAGE_OPTIMIZATION=true
VITE_LAZY_LOADING=true

# 성능 최적화
VITE_BUNDLE_ANALYZER=false
VITE_PRELOAD_COMPONENTS=true
VITE_SERVICE_WORKER=true

# 한국 법정 요구사항
VITE_PRIVACY_POLICY_VERSION=2024.1
VITE_TERMS_VERSION=2024.1
VITE_DATA_RETENTION_DAYS=1095
EOF

echo -e "✅ ${GREEN}한국 전용 환경 변수 생성 완료${NC}"

# 2. 비용 최적화 Amplify 설정
echo -e "\n${BLUE}2. 비용 최적화 Amplify 설정${NC}"
echo "----------------------------------------"

# Amplify 프로젝트 설정 (비용 최적화)
cat > amplify-config-korea.json << 'EOF'
{
  "projectName": "BuddhistCommunityKR",
  "envName": "prod",
  "defaultEditor": "code",
  "appType": "javascript",
  "framework": "react",
  "srcDir": "src",
  "distDir": "dist",
  "buildCommand": "npm run build:korea",
  "startCommand": "npm run start",
  "region": "ap-northeast-2",
  "providers": ["awscloudformation"],
  "categories": {
    "auth": {
      "resourceName": "buddhistcommunityauth",
      "serviceType": "cognito"
    },
    "api": {
      "resourceName": "buddhistcommunityapi",
      "serviceType": "appsync"
    },
    "storage": {
      "resourceName": "buddhistcommunitystorage",
      "serviceType": "s3"
    },
    "hosting": {
      "resourceName": "hostingS3AndCloudFront",
      "serviceType": "cloudfront"
    }
  }
}
EOF

echo -e "✅ ${GREEN}Amplify 비용 최적화 설정 완료${NC}"

# 3. 한국어 특화 Cognito 설정
echo -e "\n${BLUE}3. 한국어 특화 인증 시스템 설정${NC}"
echo "----------------------------------------"

mkdir -p amplify/backend/auth/buddhistcommunityauth

cat > amplify/backend/auth/buddhistcommunityauth/cli-inputs.json << 'EOF'
{
  "version": "1",
  "cognitoConfig": {
    "identityPoolName": "BuddhistCommunityKR_identitypool",
    "allowUnauthenticatedIdentities": false,
    "resourceNameTruncated": "buddhkr",
    "userPoolName": "BuddhistCommunityKR_userpool",
    "autoVerifiedAttributes": ["email"],
    "mfaConfiguration": "OPTIONAL",
    "mfaTypes": ["SMS Text Message"],
    "smsAuthenticationMessage": "불교 커뮤니티 인증번호: {####}",
    "smsVerificationMessage": "불교 커뮤니티 인증번호: {####}",
    "emailVerificationSubject": "🏛️ 불교 커뮤니티 이메일 인증",
    "emailVerificationMessage": "안녕하세요! 불교 커뮤니티입니다.\n\n이메일 인증을 위해 다음 코드를 입력해주세요: {####}\n\n감사합니다. 🙏",
    "defaultPasswordPolicy": false,
    "passwordPolicyMinLength": 8,
    "passwordPolicyCharacters": [
      "requireUppercase",
      "requireLowercase", 
      "requireNumbers"
    ],
    "requiredAttributes": ["email", "name"],
    "aliasAttributes": [],
    "userpoolClientGenerateSecret": false,
    "userpoolClientRefreshTokenValidity": 30,
    "userpoolClientWriteAttributes": [
      "email",
      "name",
      "phone_number",
      "custom:temple",
      "custom:dharma_name",
      "custom:practice_years"
    ],
    "userpoolClientReadAttributes": [
      "email",
      "name", 
      "phone_number",
      "custom:temple",
      "custom:dharma_name",
      "custom:practice_years"
    ],
    "userpoolClientLambdaRole": "buddhkr_userpoolclient_lambda_role",
    "userpoolClientSetAttributes": false,
    "sharedId": "buddhkr",
    "resourceName": "buddhistcommunityauth",
    "authSelections": "userPoolOnly",
    "useDefault": "manual",
    "userPoolGroups": true,
    "userPoolGroupList": ["운영자", "법사", "신도"],
    "adminQueries": true,
    "triggers": {
      "preSignUp": {
        "functionName": "koreanUserValidation"
      },
      "postConfirmation": {
        "functionName": "welcomeMessage"
      }
    },
    "hostedUI": true,
    "hostedUIDomainName": "buddhist-community-kr",
    "authProvidersUserPool": [],
    "hostedUIProviderMeta": "[]",
    "oAuthMetadata": "{\"AllowedOAuthFlows\":[\"code\"],\"AllowedOAuthScopes\":[\"phone\",\"email\",\"openid\",\"profile\",\"aws.cognito.signin.user.admin\"],\"CallbackURLs\":[\"https://localhost:3000/\"],\"LogoutURLs\":[\"https://localhost:3000/\"]}",
    "usernameCaseSensitive": false,
    "useEnabledMfas": true
  }
}
EOF

echo -e "✅ ${GREEN}한국어 특화 Cognito 설정 완료${NC}"

# 4. 한국 불교 특화 GraphQL 스키마
echo -e "\n${BLUE}4. 한국 불교 특화 GraphQL 스키마 설정${NC}"
echo "----------------------------------------"

mkdir -p amplify/backend/api/buddhistcommunityapi

cat > amplify/backend/api/buddhistcommunityapi/schema.graphql << 'EOF'
# 🇰🇷 한국 불교 커뮤니티 전용 GraphQL 스키마
# 비용 최적화 + 성능 최적화 + 한국 불교 특화

# ==========================================
# 🏛️ 한국 사찰 정보
# ==========================================
type Temple @model 
  @auth(rules: [
    { allow: public, operations: [read] }
    { allow: groups, groups: ["운영자"], operations: [create, update, delete] }
  ]) {
  id: ID!
  name: String! @index(name: "byName", queryField: "searchTemples")
  branch: String! # 조계종, 천태종, 진각종 등
  address: KoreanAddress!
  contact: Contact
  description: String
  features: [String!] # 주차장, 법당, 요사채 등
  dharmaSessions: [DharmaSession] @hasMany
  avgRating: Float
  reviewCount: Int @default(value: "0")
  isActive: Boolean! @default(value: "true")
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type KoreanAddress {
  roadAddress: String! # 도로명 주소
  jibunAddress: String # 지번 주소
  sido: String! # 시도
  sigungu: String! # 시군구
  dong: String # 동/읍/면
  zipCode: String!
  latitude: Float
  longitude: Float
}

type Contact {
  phone: String @regex(pattern: "^01[016789]-?\\d{3,4}-?\\d{4}$")
  email: String @email
  website: String @url
  kakaoId: String
}

# ==========================================
# 🙏 법회 정보 (한국 특화)
# ==========================================
type DharmaSession @model 
  @auth(rules: [
    { allow: public, operations: [read] }
    { allow: groups, groups: ["운영자", "법사"], operations: [create, update, delete] }
  ]) {
  id: ID!
  title: String! @index(name: "byTitle")
  templeId: ID! @index(name: "byTemple")
  temple: Temple @belongsTo
  
  # 한국 불교 특화 카테고리
  category: KoreanDharmaCategory! @index(name: "byCategory")
  type: SessionType! @default(value: "REGULAR")
  
  # 일정 정보
  startDateTime: AWSDateTime! @index(name: "byDate", sortKeyFields: ["startDateTime"])
  endDateTime: AWSDateTime!
  isRecurring: Boolean @default(value: "false")
  recurringPattern: RecurringPattern
  
  # 진행자 정보
  monk: MonkInfo!
  assistants: [String!] # 보조 진행자
  
  # 참가 정보
  maxParticipants: Int
  currentParticipants: Int @default(value: "0")
  ageRestriction: AgeGroup
  prerequisites: [String!] # 사전 준비물, 복장 안내 등
  
  # 내용
  description: String!
  materials: [String!] # 경전, 교재 등
  language: Language! @default(value: "KOREAN")
  
  # 위치 및 접근성
  location: SessionLocation!
  accessibility: [AccessibilityFeature!] # 휠체어, 주차장 등
  
  # 리뷰 및 평가
  reviews: [Review] @hasMany
  avgRating: Float @default(value: "0")
  reviewCount: Int @default(value: "0")
  
  # 상태
  status: SessionStatus! @default(value: "SCHEDULED")
  registrationRequired: Boolean @default(value: "false")
  isFeatured: Boolean @default(value: "false")
  
  # 비용 정보 (무료 원칙이지만 보시/공양 안내)
  offering: OfferingInfo
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

enum KoreanDharmaCategory {
  GENERAL_DHARMA     # 일반 법회
  MORNING_CHANTING   # 아침 예불
  EVENING_CHANTING   # 저녁 예불
  MEDITATION         # 참선/명상
  SUTRA_STUDY        # 경전 공부
  DHARMA_TALK        # 법문
  YOUTH_DHARMA       # 청년 법회
  CHILDREN_DHARMA    # 어린이 법회
  FAMILY_DHARMA      # 가족 법회
  SPECIAL_CEREMONY   # 특별 의식 (49재, 천도재 등)
  RETREAT            # 수련회/템플스테이
  COMMUNITY_SERVICE  # 봉사 활동
  CULTURAL_EVENT     # 문화 행사
  LOTUS_LANTERN      # 연등 법회
  BUDDHA_BIRTHDAY    # 부처님 오신 날
}

enum SessionType {
  REGULAR      # 정기 법회
  SPECIAL      # 특별 법회
  RETREAT      # 수련회
  CEREMONY     # 의식
  EDUCATION    # 교육
  PILGRIMAGE   # 순례
}

type RecurringPattern {
  frequency: Frequency!
  interval: Int! # 매주, 격주, 매월 등
  dayOfWeek: [DayOfWeek!] # 요일
  endDate: AWSDateTime
}

enum Frequency {
  DAILY
  WEEKLY
  MONTHLY
  YEARLY
}

enum DayOfWeek {
  MONDAY
  TUESDAY  
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}

type MonkInfo {
  name: String!
  title: String # 스님, 법사, 전법사 등
  temple: String
  biography: String
  specialties: [String!] # 전문 분야
  profileImage: String @url
}

enum AgeGroup {
  ALL_AGES      # 전 연령
  CHILDREN      # 어린이 (6-12세)
  YOUTH         # 청소년 (13-19세)
  YOUNG_ADULT   # 청년 (20-35세)
  ADULT         # 성인 (36-64세)
  SENIOR        # 시니어 (65세+)
}

enum Language {
  KOREAN
  ENGLISH
  MIXED
}

type SessionLocation {
  building: String! # 대웅전, 법당, 선방 등
  floor: String
  room: String
  capacity: Int
  equipment: [String!] # 방송 시설, 프로젝터 등
}

enum AccessibilityFeature {
  WHEELCHAIR_ACCESSIBLE  # 휠체어 접근 가능
  PARKING_AVAILABLE     # 주차장 이용 가능
  PUBLIC_TRANSPORT     # 대중교통 접근 용이
  ELEVATOR            # 엘리베이터
  RESTROOM           # 화장실
  NURSING_ROOM       # 수유실
}

enum SessionStatus {
  SCHEDULED   # 예정
  ONGOING     # 진행 중
  COMPLETED   # 완료
  CANCELLED   # 취소
  POSTPONED   # 연기
  FULL        # 마감
}

type OfferingInfo {
  suggestedAmount: Int # 권장 보시금 (원)
  description: String # 보시금 사용처 설명
  acceptsCard: Boolean @default(value: "false")
  acceptsAccount: Boolean @default(value: "true")
  accountInfo: String # 계좌 정보
}

# ==========================================
# 📝 리뷰 시스템 (한국어 특화)
# ==========================================
type Review @model 
  @auth(rules: [
    { allow: public, operations: [read] }
    { allow: owner, operations: [create, update, delete] }
    { allow: groups, groups: ["운영자"], operations: [update, delete] }
  ]) {
  id: ID!
  dharmaSessionId: ID! @index(name: "byDharmaSession")
  dharmaSession: DharmaSession @belongsTo
  userId: ID! @index(name: "byUser") 
  
  # 평가
  rating: Int! # 1-5점
  title: String!
  content: String!
  
  # 세부 평가 (한국 불교 특화)
  contentQuality: Int      # 법문/내용의 질
  teachingClarity: Int     # 설법의 명확성  
  spiritualInspiration: Int # 영적 감화
  practiceGuidance: Int    # 수행 지도
  atmosphere: Int          # 분위기
  accessibility: Int       # 접근성/편의성
  
  # 추천 대상
  recommendedFor: [AgeGroup!]
  difficultyLevel: DifficultyLevel!
  
  # 미디어
  photos: [String!] @url
  
  # 검증
  isVerified: Boolean @default(value: "false")
  attendanceVerified: Boolean @default(value: "false")
  
  # 상호작용
  comments: [Comment] @hasMany
  likes: [ReviewLike] @hasMany
  helpfulCount: Int @default(value: "0")
  
  # 상태
  isPublished: Boolean! @default(value: "true")
  language: Language! @default(value: "KOREAN")
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

enum DifficultyLevel {
  BEGINNER    # 초심자
  INTERMEDIATE # 중급자
  ADVANCED    # 숙련자
  EXPERT      # 전문가
}

# ==========================================
# 💬 댓글 시스템
# ==========================================
type Comment @model 
  @auth(rules: [
    { allow: public, operations: [read] }
    { allow: owner, operations: [create, update, delete] }
    { allow: groups, groups: ["운영자"], operations: [delete] }
  ]) {
  id: ID!
  reviewId: ID! @index(name: "byReview")
  review: Review @belongsTo
  userId: ID! @index(name: "byUser")
  
  content: String!
  parentCommentId: ID
  parentComment: Comment @belongsTo
  replies: [Comment] @hasMany
  
  isEdited: Boolean @default(value: "false")
  isDeleted: Boolean @default(value: "false")
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# ==========================================
# 👍 좋아요 시스템
# ==========================================
type ReviewLike @model 
  @auth(rules: [{ allow: owner }]) {
  id: ID!
  reviewId: ID! @index(name: "byReview")
  review: Review @belongsTo
  userId: ID! @index(name: "byUser")
  
  createdAt: AWSDateTime!
}

# ==========================================
# 🔔 알림 시스템 (한국어)
# ==========================================
type Notification @model
  @auth(rules: [{ allow: owner }]) {
  id: ID!
  userId: String! @index(name: "byUser")
  type: NotificationType!
  title: String!
  message: String!
  data: String # JSON 문자열
  isRead: Boolean! @default(value: "false")
  createdAt: AWSDateTime!
}

enum NotificationType {
  NEW_REVIEW         # 새 리뷰 등록
  COMMENT_REPLY      # 댓글 답글
  REVIEW_LIKED       # 리뷰 좋아요
  DHARMA_REMINDER    # 법회 알림
  DHARMA_CANCELLED   # 법회 취소
  DHARMA_UPDATED     # 법회 변경
  TEMPLE_NEWS        # 사찰 소식
  SYSTEM_NOTICE      # 시스템 공지
}

# ==========================================
# 📊 한국 사용자 통계 (개인정보 보호)
# ==========================================
type UserStats @model
  @auth(rules: [{ allow: owner }]) {
  id: ID! 
  userId: String! @index(name: "byUser")
  
  # 활동 통계
  reviewCount: Int @default(value: "0")
  sessionAttendance: Int @default(value: "0")
  totalPracticeHours: Int @default(value: "0")
  
  # 지역별 통계 (개인정보 제거)
  preferredRegion: String # 시도 단위만
  practiceLevel: DifficultyLevel @default(value: "BEGINNER")
  
  # 관심 분야
  interests: [KoreanDharmaCategory!]
  
  updatedAt: AWSDateTime!
}

# ==========================================
# 📈 플랫폼 통계 (비용 최적화)
# ==========================================
type PlatformStats @model
  @auth(rules: [
    { allow: groups, groups: ["운영자"], operations: [read] }
  ]) {
  id: ID!
  date: AWSDate! @index(name: "byDate")
  
  # 일별 통계
  dailyActiveUsers: Int
  newRegistrations: Int
  sessionCreated: Int
  reviewsWritten: Int
  
  # 지역별 통계
  regionStats: String # JSON 문자열로 저장 (DynamoDB 비용 절약)
  
  createdAt: AWSDateTime!
}
EOF

echo -e "✅ ${GREEN}한국 불교 특화 GraphQL 스키마 생성 완료${NC}"

# 5. 비용 최적화 CloudFront 설정
echo -e "\n${BLUE}5. 비용 최적화 CDN 설정${NC}"
echo "----------------------------------------"

mkdir -p amplify/backend/hosting/S3AndCloudFront

cat > amplify/backend/hosting/S3AndCloudFront/template.json << 'EOF'
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "한국 전용 불교 커뮤니티 CDN - 비용 최적화",
  "Parameters": {
    "env": {
      "Type": "String"
    },
    "bucketName": {
      "Type": "String"
    }
  },
  "Resources": {
    "S3Bucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "BucketName": {
          "Fn::Sub": "${bucketName}-${env}"
        },
        "WebsiteConfiguration": {
          "IndexDocument": "index.html",
          "ErrorDocument": "index.html"
        },
        "PublicAccessBlockConfiguration": {
          "BlockPublicAcls": false,
          "BlockPublicPolicy": false,
          "IgnorePublicAcls": false,
          "RestrictPublicBuckets": false
        },
        "LifecycleConfiguration": {
          "Rules": [{
            "Id": "CostOptimization",
            "Status": "Enabled",
            "Transitions": [{
              "Days": 30,
              "StorageClass": "STANDARD_IA"
            }, {
              "Days": 90,
              "StorageClass": "GLACIER"
            }]
          }]
        },
        "IntelligentTieringConfigurations": [{
          "Id": "EntireBucket",
          "Status": "Enabled"
        }]
      }
    },
    "CloudFrontDistribution": {
      "Type": "AWS::CloudFront::Distribution",
      "Properties": {
        "DistributionConfig": {
          "Enabled": true,
          "Comment": "한국 불교 커뮤니티 CDN - 서울 최적화",
          "PriceClass": "PriceClass_200",
          "HttpVersion": "http2",
          "IPV6Enabled": true,
          "DefaultRootObject": "index.html",
          "Aliases": [],
          "Origins": [{
            "Id": "S3Origin",
            "DomainName": {
              "Fn::GetAtt": ["S3Bucket", "RegionalDomainName"]
            },
            "S3OriginConfig": {
              "OriginAccessIdentity": ""
            }
          }],
          "DefaultCacheBehavior": {
            "TargetOriginId": "S3Origin",
            "ViewerProtocolPolicy": "redirect-to-https",
            "Compress": true,
            "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
            "OriginRequestPolicyId": "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf"
          },
          "CacheBehaviors": [{
            "PathPattern": "static/js/*",
            "TargetOriginId": "S3Origin",
            "ViewerProtocolPolicy": "redirect-to-https",
            "Compress": true,
            "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
            "TTL": 31536000
          }, {
            "PathPattern": "static/css/*",
            "TargetOriginId": "S3Origin", 
            "ViewerProtocolPolicy": "redirect-to-https",
            "Compress": true,
            "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
            "TTL": 31536000
          }, {
            "PathPattern": "images/*",
            "TargetOriginId": "S3Origin",
            "ViewerProtocolPolicy": "redirect-to-https",
            "Compress": true,
            "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
            "TTL": 86400
          }],
          "CustomErrorResponses": [{
            "ErrorCode": 404,
            "ResponseCode": 200,
            "ResponsePagePath": "/index.html",
            "ErrorCachingMinTTL": 300
          }, {
            "ErrorCode": 403,
            "ResponseCode": 200,
            "ResponsePagePath": "/index.html",
            "ErrorCachingMinTTL": 300
          }],
          "ViewerCertificate": {
            "CloudFrontDefaultCertificate": true
          }
        }
      }
    }
  },
  "Outputs": {
    "S3BucketName": {
      "Value": {
        "Ref": "S3Bucket"
      }
    },
    "CloudFrontDistributionId": {
      "Value": {
        "Ref": "CloudFrontDistribution"
      }
    },
    "CloudFrontDomainName": {
      "Value": {
        "Fn::GetAtt": ["CloudFrontDistribution", "DomainName"]
      }
    }
  }
}
EOF

echo -e "✅ ${GREEN}비용 최적화 CDN 설정 완료${NC}"

# 6. 한국어 빌드 스크립트 추가
echo -e "\n${BLUE}6. 한국어 최적화 빌드 설정${NC}"
echo "----------------------------------------"

# package.json에 한국 전용 스크립트 추가
npm pkg set scripts.build:korea="NODE_ENV=production VITE_TARGET_COUNTRY=KR vite build --mode production"
npm pkg set scripts.dev:korea="VITE_TARGET_COUNTRY=KR vite dev"
npm pkg set scripts.preview:korea="VITE_TARGET_COUNTRY=KR vite preview"

echo -e "✅ ${GREEN}한국어 빌드 스크립트 추가 완료${NC}"

# 7. 비용 모니터링 설정
echo -e "\n${BLUE}7. 비용 모니터링 설정${NC}"
echo "----------------------------------------"

cat > cost-monitoring-korea.sh << 'EOF'
#!/bin/bash

# 한국 원화 기준 비용 모니터링 설정

# 1. 예산 알림 설정 (월 5만원)
aws budgets create-budget \
  --account-id $(aws sts get-caller-identity --query Account --output text) \
  --budget '{
    "BudgetName": "BuddhistCommunityKR-Monthly",
    "BudgetLimit": {
      "Amount": "50",
      "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST",
    "CostFilters": {
      "Region": ["ap-northeast-2"]
    }
  }' \
  --notifications-with-subscribers '[{
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80,
      "ThresholdType": "PERCENTAGE"
    },
    "Subscribers": [{
      "SubscriptionType": "EMAIL",
      "Address": "admin@buddhist-community-kr.com"
    }]
  }]'

# 2. 리소스 태깅 (비용 추적용)
aws resourcegroupstaggingapi tag-resources \
  --resource-arn-list \
    "arn:aws:s3:::buddhist-community-kr-*" \
    "arn:aws:cloudfront::*:distribution/*" \
    "arn:aws:cognito-idp:ap-northeast-2:*:userpool/*" \
  --tags "Project=BuddhistCommunityKR,Environment=Production,CostCenter=Korea"

echo "✅ 비용 모니터링 설정 완료 (월 5만원 기준)"
EOF

chmod +x cost-monitoring-korea.sh

echo -e "✅ ${GREEN}비용 모니터링 스크립트 생성 완료${NC}"

# 8. 성능 최적화 설정
echo -e "\n${BLUE}8. 성능 최적화 설정${NC}"
echo "----------------------------------------"

# Vite 한국 전용 설정
cat > vite.config.korea.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: false, // 비용 절약을 위해 소스맵 비활성화
    rollupOptions: {
      output: {
        manualChunks: {
          // 한국어 특화 청크 분할
          'korean-vendor': ['react', 'react-dom'],
          'korean-ui': ['lucide-react', '@aws-amplify/ui-react'],
          'korean-aws': ['aws-amplify', '@aws-amplify/api', '@aws-amplify/auth']
        }
      }
    },
    chunkSizeWarningLimit: 500,
    minify: 'esbuild'
  },
  define: {
    __COUNTRY__: '"KR"',
    __CURRENCY__: '"KRW"',
    __TIMEZONE__: '"Asia/Seoul"',
    __LANGUAGE__: '"ko"'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@korean': resolve(__dirname, 'src/locales/ko')
    }
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  }
})
EOF

echo -e "✅ ${GREEN}성능 최적화 설정 완료${NC}"

# 9. 한국어 UI 컴포넌트 생성
echo -e "\n${BLUE}9. 한국어 UI 컴포넌트 생성${NC}"
echo "----------------------------------------"

mkdir -p src/components/korea
mkdir -p src/locales/ko

# 한국어 상수 파일
cat > src/locales/ko/constants.ts << 'EOF'
// 🇰🇷 한국 불교 커뮤니티 전용 상수

export const KOREAN_DHARMA_CATEGORIES = {
  GENERAL_DHARMA: '일반 법회',
  MORNING_CHANTING: '아침 예불',
  EVENING_CHANTING: '저녁 예불',
  MEDITATION: '참선/명상',
  SUTRA_STUDY: '경전 공부',
  DHARMA_TALK: '법문',
  YOUTH_DHARMA: '청년 법회',
  CHILDREN_DHARMA: '어린이 법회',
  FAMILY_DHARMA: '가족 법회',
  SPECIAL_CEREMONY: '특별 의식',
  RETREAT: '수련회/템플스테이',
  COMMUNITY_SERVICE: '봉사 활동',
  CULTURAL_EVENT: '문화 행사',
  LOTUS_LANTERN: '연등 법회',
  BUDDHA_BIRTHDAY: '부처님 오신 날'
} as const;

export const KOREAN_REGIONS = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시',
  '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
  '경기도', '강원특별자치도', '충청북도', '충청남도',
  '전북특별자치도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
] as const;

export const BUDDHIST_BRANCHES = [
  '조계종', '천태종', '진각종', '태고종', '법화종',
  '총지종', '관음종', '원효종', '일승종', '화엄종'
] as const;

export const SESSION_TIMES = {
  EARLY_MORNING: '새벽 (05:00-07:00)',
  MORNING: '오전 (09:00-12:00)',
  AFTERNOON: '오후 (14:00-17:00)',
  EVENING: '저녁 (19:00-21:00)',
  LATE_EVENING: '밤 (21:00-23:00)'
} as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: '초심자',
  INTERMEDIATE: '중급자', 
  ADVANCED: '숙련자',
  EXPERT: '전문가'
} as const;

export const AGE_GROUPS = {
  ALL_AGES: '전 연령',
  CHILDREN: '어린이 (6-12세)',
  YOUTH: '청소년 (13-19세)',
  YOUNG_ADULT: '청년 (20-35세)',
  ADULT: '성인 (36-64세)',
  SENIOR: '시니어 (65세+)'
} as const;
EOF

echo -e "✅ ${GREEN}한국어 상수 파일 생성 완료${NC}"

# 10. 배포 실행
echo -e "\n${BLUE}10. 한국 전용 배포 실행${NC}"
echo "----------------------------------------"

echo -e "${YELLOW}Amplify 프로젝트 초기화 중...${NC}"
if [ ! -f "amplify/.config/project-config.json" ]; then
    amplify init --yes \
        --name "$PROJECT_NAME" \
        --environment "$ENV_NAME" \
        --defaultEditor code \
        --appType javascript \
        --framework react \
        --srcDir src \
        --distDir dist \
        --buildCommand "npm run build:korea" \
        --startCommand "npm start" \
        --region ap-northeast-2
fi

echo -e "${YELLOW}한국어 빌드 테스트 중...${NC}"
npm run build:korea

echo -e "✅ ${GREEN}한국 전용 배포 준비 완료!${NC}"

# 11. 완료 및 다음 단계 안내
echo -e "\n${PURPLE}=================================================="
echo -e "🇰🇷 Buddhist Community Korea 최적화 완료!"
echo -e "==================================================${NC}"

echo -e "\n${BLUE}✅ 완료된 최적화:${NC}"
echo -e "  • 🏛️ 한국 불교 특화 스키마 설계"
echo -e "  • 🇰🇷 한국어 UI/UX 최적화"
echo -e "  • 💰 비용 최적화 (월 5만원 이하 목표)"
echo -e "  • ⚡ 서울 리전 단일 배포"
echo -e "  • 📱 한국 사용자 경험 최적화"

echo -e "\n${BLUE}💰 예상 월간 비용 (KRW):${NC}"
echo -e "  • CloudFront: ₩3,000-8,000"
echo -e "  • S3 Storage: ₩1,000-3,000"
echo -e "  • AppSync: ₩5,000-15,000" 
echo -e "  • Cognito: ₩0-5,000"
echo -e "  • DynamoDB: ₩2,000-8,000"
echo -e "  • ${GREEN}총 예상: ₩11,000-39,000/월${NC}"

echo -e "\n${BLUE}📈 한국 시장 특화 기능:${NC}"
echo -e "  • 조계종/천태종 등 종단별 분류"
echo -e "  • 지역별 사찰 검색 (시도/시군구)"
echo -e "  • 한국 전화번호 형식 지원"
echo -e "  • 음력 기준 불교 행사 달력"
echo -e "  • 보시금 안내 시스템"

echo -e "\n${BLUE}🚀 다음 단계:${NC}"
echo -e "  1. 백엔드 서비스 배포: ${YELLOW}amplify push${NC}"
echo -e "  2. 프론트엔드 배포: ${YELLOW}amplify publish${NC}"
echo -e "  3. 비용 모니터링 활성화: ${YELLOW}./cost-monitoring-korea.sh${NC}"
echo -e "  4. 한국 사찰 데이터 입력"
echo -e "  5. 베타 테스터 모집 (한국 불교도)"

echo -e "\n${GREEN}🙏 한국 불교 커뮤니티가 준비되었습니다!${NC}"