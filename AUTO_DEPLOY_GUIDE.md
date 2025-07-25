# 🪷 Buddhist Community - 자동 배포 가이드

## 🚀 자동 배포 설정 완료!

### 1. GitHub Actions 자동 빌드
코드를 `main` 브랜치에 푸시하면 자동으로:
- ✅ Node.js 18 환경 설정
- ✅ 의존성 설치
- ✅ TypeScript 컴파일 검증
- ✅ 프로덕션 빌드 생성
- ✅ 빌드 파일 검증

### 2. AWS Amplify 연결 설정

#### A. Amplify Console에서 설정
1. **AWS Amplify Console 접속**: https://console.aws.amazon.com/amplify/
2. **"New app" → "Host web app" 선택**
3. **GitHub 연결**:
   ```
   Repository: buddhist-community
   Branch: main
   ```
4. **빌드 설정 자동 감지**:
   - `amplify.yml` 파일이 자동으로 적용됨
   - Node.js 18, npm 빌드 환경

#### B. 환경 변수 설정
Amplify Console > App Settings > Environment variables:
```
VITE_APP_STAGE=production
VITE_TARGET_COUNTRY=KR
VITE_DEFAULT_LANGUAGE=ko
```

### 3. 자동 배포 트리거

#### 🔄 자동 배포 조건
- **main 브랜치에 푸시**: 즉시 배포 시작
- **Pull Request**: 프리뷰 배포 생성
- **수동 배포**: Amplify Console에서 "Redeploy" 버튼

#### 📝 배포 프로세스
1. **GitHub 푸시** → 자동 트리거
2. **Amplify 빌드 시작** (2-3분)
3. **배포 완료** → 라이브 URL 업데이트
4. **알림** (선택사항)

### 4. 배포 명령어

```bash
# 로컬 빌드 테스트
npm run build

# 한국 최적화 빌드
npm run build:korea

# 배포 전 검증
npm run validate

# GitHub에 푸시 (자동 배포 트리거)
git add .
git commit -m "feat: 새로운 기능 추가 🪷"
git push origin main
```

### 5. 배포 상태 확인

#### 📊 Amplify Console 모니터링
- **빌드 로그**: 실시간 빌드 진행 상황
- **배포 히스토리**: 과거 배포 기록
- **성능 메트릭**: 로딩 시간, 에러율

#### 🔍 배포 URL
```
메인: https://[app-id].amplifyapp.com
프리뷰: https://[branch-name].[app-id].amplifyapp.com
```

### 6. 고급 설정

#### 🔐 보안 설정
- HTTPS 강제 활성화
- CSP 헤더 자동 적용
- XSS, 클릭재킹 보호

#### ⚡ 성능 최적화
- CDN 자동 설정
- 이미지 최적화
- 번들 압축 (gzip/brotli)

#### 📱 도메인 설정
커스텀 도메인 연결 가능:
```
예시: buddhist-community.com
SSL 인증서 자동 생성
```

### 7. 트러블슈팅

#### ❌ 빌드 실패 시
1. **로컬에서 빌드 테스트**:
   ```bash
   npm run build
   ```
2. **의존성 재설치**:
   ```bash
   npm ci
   ```
3. **Amplify 빌드 로그 확인**

#### 🐛 배포 실패 시
- Network 탭에서 404/500 에러 확인
- `_redirects` 파일 존재 확인
- Console 에러 메시지 확인

### 8. 배포 플로우 예시

```mermaid
graph LR
    A[코드 수정] --> B[git push main]
    B --> C[GitHub Actions 실행]
    C --> D[빌드 검증]
    D --> E[Amplify 자동 배포]
    E --> F[라이브 사이트 업데이트]
    F --> G[배포 완료 🎉]
```

## 🎉 이제 코드를 푸시하기만 하면 자동으로 배포됩니다!

```bash
# 간단한 배포 워크플로우
git add .
git commit -m "feat: 불교 커뮤니티 기능 개선 🪷"
git push origin main

# 2-3분 후 자동으로 라이브 사이트 업데이트!
```