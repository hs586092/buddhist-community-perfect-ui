# 🪷 불교 커뮤니티 배포 가이드

## 빠른 배포 (Vercel - 추천)

### 1단계: 프로젝트 준비
```bash
npm run build  # 프로덕션 빌드
```

### 2단계: Vercel 계정 생성
1. https://vercel.com 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭

### 3단계: 배포
1. GitHub repository 선택
2. 자동으로 React 프로젝트 인식
3. "Deploy" 클릭
4. 2-3분 후 완료!

### 결과
- **무료 도메인**: your-app-name.vercel.app
- **커스텀 도메인**: 유료 플랜에서 연결 가능
- **HTTPS 자동 적용**

## AWS Amplify 배포 (AWS 백엔드 연동)

### 1단계: AWS Amplify Console
1. AWS Console → Amplify
2. "새 앱 호스팅" 선택
3. GitHub 연결

### 2단계: 환경 변수 설정
```
REACT_APP_AWS_REGION=ap-northeast-2
REACT_APP_COGNITO_USER_POOL_ID=[UserPool ID]
REACT_APP_COGNITO_CLIENT_ID=[Client ID]
REACT_APP_API_GATEWAY_URL=[API URL]
```

### 3단계: 빌드 설정
```yaml
version: 1
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

## 커스텀 도메인 연결

### 도메인 구매처
- **Namecheap**: 저렴한 가격
- **GoDaddy**: 인지도 높음  
- **AWS Route 53**: AWS와 완벽 통합

### 추천 도메인명
- buddhist-community.com
- seonwon.kr (선원)
- bulkyo-community.com
- dharma-community.kr

## 비용 예상

### Vercel
- **무료**: .vercel.app 도메인
- **Pro ($20/월)**: 커스텀 도메인, 고급 분석

### AWS Amplify + 백엔드
- **호스팅**: $1-3/월
- **DynamoDB**: $1-5/월 (사용량 기반)
- **Lambda**: 거의 무료 (월 100만 요청)
- **총 예상**: $5-10/월

### 도메인
- **.com**: $10-15/년
- **.kr**: $20-30/년

## 🚀 즉시 시작하기

1. **가장 빠른 방법**: Vercel 무료 배포 (5분)
2. **완전한 방법**: AWS Amplify + 커스텀 도메인 (1시간)
3. **프로페셔널**: AWS + 도메인 + SSL (2시간)

어떤 방법을 선호하시나요?