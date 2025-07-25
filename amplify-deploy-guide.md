# 🪷 AWS Amplify 배포 가이드

## 🚀 방법 1: 직접 배포 (가장 간단)

### 1단계: AWS Amplify Console 접속
1. **AWS Management Console** 로그인
2. **Amplify** 검색 후 선택
3. **"Get started"** 클릭

### 2단계: 직접 배포 선택
1. **"Deploy without Git provider"** 선택
2. **"Manual deployment"** 선택

### 3단계: 배포 파일 업로드
```bash
# 현재 위치에서 dist 폴더를 압축
cd /Users/hyeonsoo/platform-of-platforms/buddhist-community
zip -r buddhist-community-deploy.zip dist/
```

### 4단계: 업로드 및 배포
1. **앱 이름**: `buddhist-community`
2. **환경 이름**: `production`
3. **dist 폴더 전체를 ZIP으로 압축하여 업로드**
4. **"Save and deploy"** 클릭

---

## 🚀 방법 2: GitHub 연동 배포 (자동 배포)

### 1단계: GitHub Repository 생성
1. https://github.com 접속
2. **"New repository"** 클릭
3. **Repository name**: `buddhist-community`
4. **Public** 선택
5. **"Create repository"** 클릭

### 2단계: 코드 업로드
```bash
# GitHub repository 연결
git remote add origin https://github.com/YOUR_USERNAME/buddhist-community.git
git branch -M main
git push -u origin main
```

### 3단계: AWS Amplify에서 GitHub 연결
1. AWS Amplify Console
2. **"Host your web app"** 선택
3. **GitHub** 선택 및 인증
4. **Repository**: `buddhist-community` 선택
5. **Branch**: `main` 선택

### 4단계: 빌드 설정
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
  cache:
    paths:
      - node_modules/**/*
```

---

## 🔧 환경 변수 설정 (선택사항)

나중에 실제 AWS 백엔드 연결 시:
```
REACT_APP_AWS_REGION=ap-northeast-2
REACT_APP_COGNITO_USER_POOL_ID=your-pool-id
REACT_APP_COGNITO_CLIENT_ID=your-client-id
REACT_APP_API_GATEWAY_URL=your-api-url
```

---

## 📋 배포 후 체크리스트

### ✅ 기본 확인사항
- [ ] 홈페이지 로딩 정상 (흰 화면 아님)
- [ ] 법회 리뷰 페이지 접속
- [ ] 불자 소통 채팅 기능
- [ ] 나의 마음 감정 체크인
- [ ] 모바일 반응형 확인

### ✅ 성능 확인
- [ ] 로딩 속도 < 3초
- [ ] 모든 애니메이션 정상 작동
- [ ] 이미지 최적화 확인

### ✅ 도메인 설정 (선택)
1. **AWS Route 53** 에서 도메인 구매
2. **Amplify Custom domains** 설정
3. **SSL 인증서** 자동 적용

---

## 🎯 예상 결과

배포 성공 시:
- **임시 URL**: `https://main.d1234567890.amplifyapp.com`
- **커스텀 도메인 가능**: `https://seonwon.kr`
- **전 세계 CDN**: 빠른 접속 속도
- **자동 HTTPS**: 보안 연결

---

## 💰 예상 비용

### 무료 티어 (첫 12개월)
- **빌드 시간**: 1000분/월 무료
- **저장 공간**: 5GB 무료
- **데이터 전송**: 15GB/월 무료

### 일반 사용 시
- **호스팅**: $1-3/월
- **빌드**: $0.01/분
- **데이터 전송**: $0.15/GB

**예상 월 비용**: $2-5/월

---

## 🆘 문제 해결

### 빌드 실패 시
```bash
# 로컬에서 다시 빌드 테스트
npm run build

# 성공하면 다시 업로드
```

### 흰 화면 시
1. **브라우저 개발자 도구** (F12)
2. **Console 탭** 오류 확인
3. **Network 탭** 파일 로딩 확인

### 접속 불가 시
- 10-15분 대기 (배포 완료 시간)
- AWS Amplify Console에서 배포 상태 확인

---

## 🎉 배포 완료 후

### 다음 단계
1. **실제 사용자 테스트**
2. **피드백 수집**
3. **기능 개선**
4. **실제 AWS 백엔드 연동** (필요 시)

### 유지보수
- **정기 업데이트**: GitHub push로 자동 배포
- **모니터링**: AWS CloudWatch
- **백업**: 자동 관리됨