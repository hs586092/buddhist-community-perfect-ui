# 🪷 불교 커뮤니티 AWS 아키텍처 설계

## 🎯 아키텍처 개요

### **데이터베이스 전략**
- **Primary DB**: **DynamoDB** (NoSQL) - 실시간 채팅, 리뷰, 사용자 활동
- **Search**: **OpenSearch** - 사찰/리뷰 검색, 전문 검색
- **Analytics**: **RDS Aurora** (PostgreSQL) - 복잡한 분석, 리포트
- **Cache**: **ElastiCache Redis** - 세션, 실시간 데이터

### **백엔드 서비스**
- **API**: **API Gateway** + **Lambda** (서버리스)
- **실시간**: **WebSocket API Gateway** + **Lambda**
- **인증**: **Cognito** (사용자 관리)
- **파일**: **S3** (이미지, 첨부파일)

### **모니터링 & 보안**
- **모니터링**: **CloudWatch**, **X-Ray**
- **보안**: **WAF**, **Shield**, **IAM**
- **백업**: **DynamoDB Point-in-time Recovery**

---

## 📂 DynamoDB 테이블 설계

### **1. Users 테이블**
```
PK: USER#{userId}
SK: PROFILE

Attributes:
- userId (String): 고유 사용자 ID
- username (String): 사용자명
- email (String): 이메일
- buddhistLevel (String): 입문자|수행자|오랜불자
- isAnonymous (Boolean): 익명 사용자 여부
- avatar (String): 아바타 이미지 URL
- createdAt (String): 가입일
- lastLoginAt (String): 마지막 로그인
- preferences (Map): 사용자 설정

GSI1:
- GSI1PK: BUDDHIST_LEVEL#{level}
- GSI1SK: CREATED#{createdAt}
```

### **2. Temples 테이블**
```
PK: TEMPLE#{templeId}
SK: INFO

Attributes:
- templeId (String): 사찰 고유 ID
- name (String): 사찰명
- fullName (String): 정식 사찰명
- address (String): 주소
- city (String): 도시
- province (String): 도/광역시
- denomination (String): 종파
- description (String): 설명
- features (List): 제공 서비스 [명상, 법문, 템플스테이]
- images (List): 이미지 URL 목록
- rating (Number): 평균 평점
- reviewCount (Number): 리뷰 수
- location (Map): 위도/경도

GSI1:
- GSI1PK: CITY#{city}
- GSI1SK: RATING#{rating}

GSI2:
- GSI2PK: PROVINCE#{province}
- GSI2SK: NAME#{name}
```

### **3. Reviews 테이블**
```
PK: TEMPLE#{templeId}
SK: REVIEW#{reviewId}

Attributes:
- reviewId (String): 리뷰 고유 ID
- templeId (String): 사찰 ID
- userId (String): 작성자 ID
- title (String): 리뷰 제목
- content (String): 리뷰 내용
- rating (Number): 별점 (1-5)
- category (String): 카테고리 (명상|법문|체험)
- visitDate (String): 방문일
- isRecommended (Boolean): 추천 여부
- helpfulCount (Number): 도움됨 수
- tags (List): 태그 목록
- createdAt (String): 작성일
- updatedAt (String): 수정일

GSI1:
- GSI1PK: USER#{userId}
- GSI1SK: CREATED#{createdAt}

GSI2:
- GSI2PK: CATEGORY#{category}
- GSI2SK: RATING#{rating}
```

### **4. Messages 테이블** (실시간 채팅)
```
PK: ROOM#{roomId}
SK: MESSAGE#{timestamp}#{messageId}

Attributes:
- messageId (String): 메시지 고유 ID
- roomId (String): 방 ID (예: "general", "meditation")
- userId (String): 발신자 ID
- content (String): 메시지 내용
- messageType (String): question|sharing|advice|discussion
- isAnonymous (Boolean): 익명 메시지 여부
- reactions (Map): 반응 {gratitude: 5, empathy: 3}
- timestamp (String): 타임스탬프
- editedAt (String): 수정일 (선택)

TTL: 30일 후 자동 삭제 (채팅 기록 보관 정책)

GSI1:
- GSI1PK: USER#{userId}
- GSI1SK: TIMESTAMP#{timestamp}
```

### **5. EmotionalCheckins 테이블**
```
PK: USER#{userId}
SK: CHECKIN#{date}

Attributes:
- userId (String): 사용자 ID
- date (String): 체크인 날짜 (YYYY-MM-DD)
- emotion (String): 감정 상태
- intensity (Number): 강도 (1-10)
- description (String): 상세 설명
- note (String): 개인 메모
- createdAt (String): 기록 시간

GSI1:
- GSI1PK: DATE#{date}
- GSI1SK: EMOTION#{emotion}
```

### **6. Sessions 테이블** (실시간 사용자)
```
PK: SESSION#{sessionId}
SK: INFO

Attributes:
- sessionId (String): 세션 ID
- userId (String): 사용자 ID
- roomId (String): 현재 방 ID
- status (String): peaceful|meditating|typing|away
- lastActivity (String): 마지막 활동 시간
- isOnline (Boolean): 온라인 상태

TTL: 1시간 후 자동 삭제

GSI1:
- GSI1PK: ROOM#{roomId}
- GSI1SK: LAST_ACTIVITY#{lastActivity}
```

---

## 🔧 Lambda 함수 구조

### **API 함수들**

#### **1. user-management**
```javascript
// GET /users/{userId}
// PUT /users/{userId}
// POST /users
// DELETE /users/{userId}
```

#### **2. temple-service**
```javascript
// GET /temples
// GET /temples/{templeId}
// GET /temples/search?query=조계사
// GET /temples/nearby?lat=37.5&lng=127.0
```

#### **3. review-service**
```javascript
// GET /temples/{templeId}/reviews
// POST /temples/{templeId}/reviews
// PUT /reviews/{reviewId}
// DELETE /reviews/{reviewId}
// POST /reviews/{reviewId}/helpful
```

#### **4. emotion-service**
```javascript
// GET /users/{userId}/emotions
// POST /users/{userId}/emotions/checkin
// GET /users/{userId}/emotions/stats
```

### **WebSocket 함수들**

#### **5. chat-websocket**
```javascript
// $connect - 연결 설정
// $disconnect - 연결 해제
// sendMessage - 메시지 전송
// joinRoom - 방 참여
// leaveRoom - 방 떠나기
// typing - 타이핑 상태
```

---

## 🛡️ 보안 & 권한 관리

### **Cognito User Pool 설정**
```json
{
  "UserPoolName": "buddhist-community-users",
  "Policies": {
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": false,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": false
    }
  },
  "Schema": [
    {
      "Name": "email",
      "Required": true,
      "Mutable": true
    },
    {
      "Name": "buddhist_level",
      "AttributeDataType": "String",
      "Mutable": true
    },
    {
      "Name": "preferred_name",
      "AttributeDataType": "String",
      "Mutable": true
    }
  ],
  "AutoVerifiedAttributes": ["email"],
  "AliasAttributes": ["email"],
  "UsernameConfiguration": {
    "CaseSensitive": false
  }
}
```

### **IAM 역할 정책**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/BuddhistCommunity-*",
        "arn:aws:dynamodb:*:*:table/BuddhistCommunity-*/index/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::buddhist-community-assets/*"
    }
  ]
}
```

---

## 💰 비용 최적화 전략

### **DynamoDB**
- **On-Demand 모드**: 초기 트래픽 예측 어려움
- **예상 비용**: 월 $10-50 (1,000 활성 사용자 기준)

### **Lambda**
- **1M 요청/월 무료**
- **예상 비용**: 월 $5-20

### **API Gateway**
- **1M API 호출**: $3.50
- **WebSocket**: $1.20/1M 메시지

### **S3**
- **50GB 저장**: $1.15/월
- **이미지 최적화**: CloudFront 사용

### **총 예상 비용**: **월 $20-100** (초기 서비스)

---

## 🚀 배포 자동화

### **AWS CDK/CloudFormation**
```typescript
// 인프라 as 코드로 관리
// 버전 관리 가능
// 롤백 지원
// 스테이징/프로덕션 환경 분리
```

### **CI/CD 파이프라인**
```yaml
# GitHub Actions + AWS CodePipeline
# 자동 테스트 → 배포
# Blue/Green 배포 지원
# 모니터링 대시보드 연동
```

---

## 📊 모니터링 & 알림

### **CloudWatch 메트릭**
- API 응답 시간
- DynamoDB 읽기/쓰기 용량
- Lambda 오류율
- 동시 사용자 수

### **알림 설정**
- 오류율 > 1% 시 Slack 알림
- 응답 시간 > 3초 시 이메일
- DynamoDB 스로틀링 발생 시

---

이 아키텍처는 **확장 가능하고 비용 효율적이며 안정적인** 불교 커뮤니티 플랫폼을 제공합니다! 🪷