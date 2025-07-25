# 🪷 Amplify Console 앱 확인 가이드

## 📋 확인할 앱 목록
- `buddhist-community`
- `buddhist-community-perfect-ui`

## 🔍 Amplify Console 확인 단계

### 1. AWS Amplify Console 접속
URL: https://console.aws.amazon.com/amplify/

### 2. 기존 앱 확인 방법

#### A. 대시보드에서 앱 목록 확인
```
AWS Amplify > All apps
├── buddhist-community (확인 필요)
├── buddhist-community-perfect-ui (확인 필요)
└── 기타 앱들...
```

#### B. 앱 상태 확인 항목
- **App name**: buddhist-community / buddhist-community-perfect-ui
- **Repository**: GitHub 연결 상태
- **Branch**: main 브랜치 연결 여부
- **Build status**: 최근 빌드 상태
- **Domain**: 배포 URL

### 3. 시나리오별 대응 방안

#### 🟢 케이스 1: 기존 앱이 있고 정상 작동 중
```
✅ 기존 앱 활용
1. 해당 앱 선택
2. "App settings" → "General" 확인
3. Repository 연결 상태 확인
4. 최신 커밋 자동 배포 확인
```

#### 🟡 케이스 2: 기존 앱이 있지만 문제 있음
```
🔧 앱 재설정
1. "App settings" → "General"
2. "Edit" → Repository 재연결
3. Branch를 "main"으로 설정
4. Build settings 확인 (amplify.yml)
```

#### 🔴 케이스 3: 앱이 없거나 새로 생성 필요
```
🆕 새 앱 생성
1. "New app" → "Host web app"
2. GitHub 선택
3. Repository: hs586092/buddhist-community-perfect-ui
4. Branch: main
5. 자동 빌드 설정 확인
```

### 4. 권장 앱 설정

#### 📝 App 기본 정보
```
App name: buddhist-community-perfect-ui
Repository: hs586092/buddhist-community-perfect-ui
Branch: main
```

#### ⚙️ Build settings (amplify.yml 자동 감지됨)
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

#### 🌍 Environment variables
```
VITE_APP_STAGE=production
VITE_TARGET_COUNTRY=KR
VITE_DEFAULT_LANGUAGE=ko
```

### 5. 배포 확인 체크리스트

#### ✅ 필수 확인 사항
- [ ] Repository 연결됨
- [ ] main 브랜치 선택됨
- [ ] amplify.yml 파일 감지됨
- [ ] 자동 빌드 활성화됨
- [ ] _redirects 파일 포함됨

#### 🚀 배포 상태 확인
- [ ] 빌드 시작됨 (Provision → Build → Deploy)
- [ ] 빌드 성공 (녹색 체크마크)
- [ ] 배포 URL 생성됨
- [ ] 사이트 정상 접속됨

### 6. 예상 배포 URL 형식

#### 🌐 기본 도메인
```
https://main.d[앱ID].amplifyapp.com
또는
https://d[앱ID].amplifyapp.com
```

#### 📱 페이지 확인
- **랜딩 페이지**: `/` (2분할 레이아웃)
- **법회 리뷰**: `/temple-reviews`
- **불자 소통**: `/community`

### 7. 트러블슈팅

#### ❌ 빌드 실패 시
1. **Amplify Console → 앱 선택 → Build history**
2. **실패한 빌드 클릭 → 로그 확인**
3. **일반적인 해결책**:
   ```bash
   # 로컬 빌드 테스트
   npm run build
   
   # 의존성 재설치
   npm ci
   ```

#### 🔄 재배포 필요 시
1. **Amplify Console → 앱 선택**
2. **"Redeploy this version" 버튼 클릭**
3. **또는 새 커밋 푸시**:
   ```bash
   git commit --allow-empty -m "🪷 Amplify 재배포 트리거"
   git push origin main
   ```

## 🎯 다음 단계
1. Amplify Console에서 앱 상태 확인
2. 필요시 위 가이드에 따라 설정
3. 배포 URL로 사이트 접속 테스트
4. 모든 페이지 (/, /temple-reviews, /community) 정상 작동 확인

## 📞 완료 후 알려주세요
- 발견된 앱 이름
- 현재 상태 (정상/문제/없음)
- 배포 URL (생성된 경우)