# 🚀 GitHub 자동 배포 설정 가이드

## 1단계: GitHub Repository 생성

### 웹에서 생성 (추천)
1. https://github.com 접속
2. **"New repository"** 클릭
3. **Repository name**: `buddhist-community`
4. **Description**: `🪷 불교 커뮤니티 - 선원 (디지털 법당)`
5. **Public** 선택
6. **"Create repository"** 클릭

### 생성된 Repository 연결
```bash
# GitHub repository 연결
git remote add origin https://github.com/YOUR_USERNAME/buddhist-community.git
git branch -M main
git push -u origin main
```

## 2단계: AWS Amplify GitHub 연동

### AWS Amplify Console에서 설정
1. **AWS Amplify Console** 접속
2. **"Host your web app"** 선택
3. **GitHub** 선택
4. **"Authorize AWS Amplify"** 클릭 (GitHub 계정 연동)
5. **Repository**: `buddhist-community` 선택
6. **Branch**: `main` 선택
7. **"Next"** 클릭

### 빌드 설정 확인
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

### 환경 변수 설정 (선택사항)
```
NODE_VERSION=18.x
REACT_APP_VERSION=1.0.0
```

## 3단계: 자동 배포 확인

### 배포 트리거
- ✅ **main 브랜치에 push** → 자동 배포
- ✅ **Pull Request 머지** → 자동 배포
- ✅ **코드 변경 감지** → 자동 빌드

### 배포 프로세스
1. **Code Push** → GitHub
2. **Auto Trigger** → AWS Amplify 감지
3. **Build Phase** → npm ci + npm run build
4. **Deploy Phase** → dist 폴더 배포
5. **Live URL** → 즉시 업데이트

## 4단계: 향후 개발 워크플로우

### 일반적인 개발 사이클
```bash
# 1. 코드 수정
# 2. 로컬 테스트
npm run dev

# 3. 빌드 테스트
npm run build

# 4. Git 커밋 & 푸시
git add .
git commit -m "기능 추가: 새로운 명상 타이머"
git push origin main

# 5. 자동 배포 완료! (3-5분 소요)
```

### 브랜치 전략 (고급)
```bash
# 개발 브랜치 생성
git checkout -b feature/new-meditation

# 개발 완료 후 main으로 머지
git checkout main
git merge feature/new-meditation
git push origin main  # 자동 배포!
```

## 5단계: 모니터링 & 관리

### AWS Amplify Console에서 확인 가능
- 📊 **배포 기록**: 성공/실패 상태
- 🔍 **빌드 로그**: 상세 에러 메시지
- 📈 **성능 메트릭**: 로딩 속도, 트래픽
- 🌐 **도메인 관리**: 커스텀 도메인 연결

### 장점
✅ **자동화**: 코드 푸시 → 자동 배포
✅ **백업**: GitHub에 모든 버전 저장
✅ **협업**: 여러 개발자 동시 작업
✅ **롤백**: 이전 버전으로 쉽게 복원
✅ **무료**: GitHub + AWS Amplify 무료 티어

## 🎯 다음 단계 명령어

```bash
# GitHub repository URL 확인 후 실행
git remote add origin https://github.com/YOUR_USERNAME/buddhist-community.git
git push -u origin main
```

이후 AWS Amplify에서 GitHub 연동하면 완료!