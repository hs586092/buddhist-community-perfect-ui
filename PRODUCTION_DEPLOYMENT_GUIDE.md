# 🚀 Buddhist Community - 프로덕션 배포 가이드

## 📋 배포 순서

### 1️⃣ 사전 준비 체크
```bash
# 사전 요구사항 검증
./scripts/check-prerequisites.sh
```

**확인 항목:**
- ✅ AWS CLI 설치 및 구성
- ✅ Amplify CLI 설치 
- ✅ Node.js 18+ 버전
- ✅ 프로젝트 파일 완성도
- ✅ 환경 변수 템플릿

### 2️⃣ Amplify 프로젝트 초기화
```bash
# Amplify 프로젝트 설정
./scripts/amplify-init.sh
```

**자동 설정:**
- 🏛️ 프로젝트명: BuddhistCommunity
- 🌏 환경: prod
- 📍 리전: ap-northeast-2 (서울)
- ⚛️ 프레임워크: React

### 3️⃣ 백엔드 서비스 설정
```bash
# 인증, API, 스토리지, 호스팅 설정
./scripts/setup-backend-services.sh
```

**생성되는 서비스:**
- 🔐 **Cognito**: 사용자 인증 + MFA
- 📡 **AppSync**: GraphQL API
- 💾 **S3**: 파일 스토리지
- 🌐 **CloudFront**: CDN 호스팅

### 4️⃣ 프로덕션 배포
```bash
# 전체 배포 실행
./scripts/deploy-production.sh
```

**배포 과정:**
1. 빌드 테스트
2. 백엔드 리소스 생성 (5-10분)
3. 환경 변수 자동 업데이트
4. GraphQL 코드 생성
5. 프론트엔드 빌드 & 배포

### 5️⃣ 모니터링 설정
```bash
# CloudWatch 모니터링 활성화
./scripts/setup-monitoring.sh
```

**모니터링 기능:**
- 📊 실시간 대시보드
- 🚨 알람 (에러율, 지연시간, 인증 실패)
- 📧 이메일 알림
- 📝 로그 관리

## 🔧 주요 설정 파일

### `.env.production` - 프로덕션 환경 변수
```bash
# 자동 업데이트되는 주요 변수들
VITE_GRAPHQL_ENDPOINT=https://xxx.appsync.ap-northeast-2.amazonaws.com/graphql
VITE_USER_POOL_ID=ap-northeast-2_xxxxxxxxx
VITE_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_S3_BUCKET=buddhist-community-storage-prod
```

### `amplify.yml` - Amplify 빌드 설정
```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - amplifyPush --simple
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
```

## 📊 배포 결과

### 🎯 성능 지표
- **JavaScript**: 778KB (gzip: 224KB)
- **CSS**: 317KB (gzip: 31KB)  
- **빌드 시간**: ~2초
- **배포 시간**: 5-10분

### 🏗️ 생성되는 AWS 리소스
```
AWS Amplify App
├── Cognito User Pool (인증)
├── AppSync GraphQL API 
├── DynamoDB Tables (데이터)
├── S3 Bucket (스토리지)
├── CloudFront Distribution (CDN)
├── Lambda Functions (비즈니스 로직)
└── IAM Roles & Policies (권한)
```

## 🔗 배포 후 접근 링크

### 📱 애플리케이션
- **앱 URL**: `https://xxx.amplifyapp.com`
- **관리자 URL**: `https://xxx.amplifyapp.com/admin`

### 🛠️ AWS 관리 콘솔
- **Amplify**: `https://console.aws.amazon.com/amplify/`
- **CloudWatch**: `https://console.aws.amazon.com/cloudwatch/`
- **Cognito**: `https://console.aws.amazon.com/cognito/`
- **AppSync**: `https://console.aws.amazon.com/appsync/`

## 🧪 배포 후 테스트

### 1. 기본 기능 테스트
```bash
# E2E 테스트 실행
npm run test:e2e:prod

# 성능 테스트
npm run lighthouse:ci
```

### 2. 수동 테스트 체크리스트
- [ ] 🏠 홈페이지 로딩
- [ ] 📝 회원가입/로그인
- [ ] 🏛️ 법회 세션 조회
- [ ] ⭐ 리뷰 작성/조회
- [ ] 📱 모바일 반응형
- [ ] 🔒 권한 확인

## 🔧 환경별 관리

### 개발 환경
```bash
amplify env checkout dev
amplify status
```

### 프로덕션 환경
```bash
amplify env checkout prod
amplify status
```

### 새 환경 생성
```bash
amplify env add staging
```

## 📈 모니터링 & 알림

### CloudWatch 대시보드
- **API 성능**: 응답시간, 에러율
- **사용자 활동**: 로그인, 가입
- **인프라**: CloudFront, S3 사용량

### 알람 임계값
- **API 에러율**: > 1%
- **응답 시간**: > 1초
- **인증 실패**: > 20회/5분

## 🚨 트러블슈팅

### 자주 발생하는 문제

#### 1. 배포 실패
```bash
# 리소스 상태 확인
amplify status

# 로그 확인
amplify console

# 강제 재배포
amplify push --force
```

#### 2. 환경 변수 누락
```bash
# aws-exports.js 재생성
amplify codegen

# 환경 변수 수동 확인
cat src/aws-exports.js
```

#### 3. 권한 문제
```bash
# IAM 역할 확인
aws sts get-caller-identity

# Amplify CLI 재구성
amplify configure
```

## 💰 비용 최적화

### 예상 월간 비용 (초기)
- **CloudFront**: $1-5
- **S3**: $1-3  
- **AppSync**: $2-10
- **Cognito**: $0-5
- **총 예상**: $5-25/월

### 비용 모니터링
```bash
# 비용 알림 설정
aws budgets create-budget --account-id ACCOUNT_ID --budget file://budget.json
```

## 🔒 보안 설정

### 1. 기본 보안 기능
- ✅ Cognito MFA 활성화
- ✅ GraphQL 권한 기반 접근
- ✅ S3 버킷 정책
- ✅ CloudFront HTTPS 강제

### 2. 추가 보안 강화
```bash
# WAF 설정
aws wafv2 create-web-acl --name BuddhistCommunityWAF

# Security Hub 활성화
aws securityhub enable-security-hub
```

## 📞 지원 및 문의

### 기술 지원
- **AWS Support**: AWS 콘솔 → Support Center
- **Amplify 문서**: https://docs.amplify.aws/
- **커뮤니티**: https://github.com/aws-amplify/amplify-js

### 프로젝트 이슈
- **GitHub**: 프로젝트 Issues 탭
- **로그**: CloudWatch Logs 확인

---

## 🎉 배포 완료!

**Buddhist Community 플랫폼이 성공적으로 AWS 클라우드에 배포되었습니다.**

다음 단계로 사용자 피드백을 수집하고 지속적인 개선을 진행하세요! 🙏