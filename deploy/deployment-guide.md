# 🪷 불교 커뮤니티 배포 가이드

실제 불자들이 사용할 수 있는 프로덕션 서비스 배포를 위한 완전한 가이드입니다.

## 📋 배포 전 체크리스트

### 필수 사항
- [ ] 모든 테스트 통과 (단위, 통합, E2E)
- [ ] 타입 검사 완료
- [ ] 린트 검사 통과
- [ ] 성능 최적화 적용
- [ ] 보안 설정 완료
- [ ] 환경 변수 설정

### 성능 목표
- [ ] LCP < 2.5초 (법회 리뷰 로딩)
- [ ] FID < 100ms (불자 소통 반응성)
- [ ] CLS < 0.1 (연꽃 UI 안정성)
- [ ] TTFB < 600ms (첫 바이트 시간)
- [ ] Lighthouse 점수 > 90점

## 🚀 배포 옵션

### 1. Vercel (추천) - 빠른 배포
```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 로그인
vercel login

# 3. 프로젝트 설정
vercel

# 4. 프로덕션 배포
vercel --prod
```

**장점:**
- 자동 HTTPS
- 글로벌 CDN
- 자동 최적화
- GitHub 연동

**설정 파일:** `deploy/vercel.json`

### 2. Netlify - 강력한 기능
```bash
# 1. Netlify CLI 설치
npm install -g netlify-cli

# 2. 로그인
netlify login

# 3. 사이트 초기화
netlify init

# 4. 배포
netlify deploy --prod --dir=dist
```

**장점:**
- 폼 처리
- 리다이렉트 규칙
- 플러그인 생태계
- A/B 테스트

**설정 파일:** `deploy/netlify.toml`

### 3. Firebase Hosting - Google 생태계
```bash
# 1. Firebase CLI 설치
npm install -g firebase-tools

# 2. 로그인
firebase login

# 3. 프로젝트 초기화
firebase init hosting

# 4. 배포
firebase deploy --only hosting
```

**장점:**
- Firebase 통합
- 실시간 데이터베이스
- 인증 서비스
- 무료 SSL

**설정 파일:** `deploy/firebase.json`

## 🔧 환경 변수 설정

### Vercel 환경 변수
```bash
# Vercel 대시보드에서 설정하거나 CLI로:
vercel env add VITE_APP_TITLE production
vercel env add VITE_APP_DESCRIPTION production
vercel env add VITE_FIREBASE_API_KEY production
```

### Netlify 환경 변수
```bash
# Netlify CLI로 설정:
netlify env:set VITE_APP_TITLE "불교 커뮤니티 - 선원"
netlify env:set VITE_APP_DESCRIPTION "전국 불자들의 따뜻한 소통 공간"
```

### Firebase 환경 변수
```bash
# Firebase 함수에서 사용:
firebase functions:config:set app.title="불교 커뮤니티"
firebase functions:config:set app.description="전국 불자들의 따뜻한 소통 공간"
```

## 🔒 보안 설정

### 1. HTTPS 강제 활성화
- Vercel: 자동 활성화
- Netlify: 자동 활성화  
- Firebase: 자동 활성화

### 2. 보안 헤더 확인
모든 플랫폼에서 다음 헤더가 설정되어 있는지 확인:
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000`

### 3. CSP (Content Security Policy)
`src/utils/security.ts`의 CSP 설정이 적용되는지 확인

## 📊 모니터링 설정

### 1. Lighthouse CI
```bash
# GitHub Actions에서 자동 실행
# .lighthouserc.json 설정 확인
```

### 2. 성능 모니터링
```javascript
// src/utils/performance.ts의 모니터링 활성화
import { performanceMonitor } from '@/utils/performance';

// 앱 시작시 모니터링 시작
performanceMonitor.initialize();
```

### 3. 에러 추적 (선택사항)
```bash
# Sentry 설정 (선택사항)
npm install @sentry/react @sentry/tracing
```

## 🌐 도메인 설정

### 커스텀 도메인 연결

#### Vercel
1. Vercel 대시보드 → Domains
2. 도메인 추가: `buddhist-community.kr`
3. DNS 설정: CNAME 레코드 추가

#### Netlify
1. Netlify 대시보드 → Domain settings
2. Custom domain 추가
3. DNS 설정 또는 Netlify DNS 사용

#### Firebase
1. Firebase Console → Hosting
2. Connect custom domain
3. DNS 설정에 TXT, A 레코드 추가

## 🚀 CI/CD 설정

### GitHub Actions 워크플로우
`.github/workflows/deploy.yml`이 다음을 자동화:

1. **품질 검사**
   - 타입 검사
   - 린트 검사
   - 단위 테스트
   - 커버리지 측정

2. **빌드 & 테스트**
   - 프로덕션 빌드
   - E2E 테스트
   - 성능 측정

3. **자동 배포**
   - main 브랜치 → 스테이징
   - production 브랜치 → 프로덕션

### 브랜치 전략
```
main (개발) → Vercel/Netlify 스테이징
production → 모든 플랫폼 프로덕션
```

## 🔍 배포 후 검증

### 1. 사이트 접근성 확인
```bash
# 각 플랫폼별 URL 확인
curl -I https://buddhist-community.vercel.app
curl -I https://buddhist-community.netlify.app
curl -I https://buddhist-community.web.app  # Firebase
```

### 2. 핵심 기능 테스트
- [ ] 홈페이지 로딩
- [ ] 법회 리뷰 작성/조회
- [ ] 불자 소통 기능
- [ ] 모바일 반응형
- [ ] 접근성 기능

### 3. 성능 측정
```bash
# Lighthouse 점수 확인
npx lighthouse https://your-domain.com --view
```

### 4. SEO 확인
- [ ] 메타 태그 적용
- [ ] sitemap.xml 접근 가능
- [ ] robots.txt 적용
- [ ] 구조화된 데이터 (선택사항)

## 🛠 문제 해결

### 빌드 실패
```bash
# 로컬에서 프로덕션 빌드 테스트
npm run build
npm run preview
```

### 성능 이슈
```bash
# 번들 분석
npm run build
npx vite-bundle-analyzer dist
```

### 배포 실패
```bash
# 로그 확인
vercel logs  # Vercel
netlify logs  # Netlify
firebase hosting:channel:deploy --only hosting  # Firebase
```

## 📱 모바일 최적화

### PWA 기능 (선택사항)
```bash
# PWA 플러그인 설치
npm install vite-plugin-pwa
```

### 모바일 테스트
- Chrome DevTools 모바일 시뮬레이션
- 실제 디바이스 테스트
- 터치 제스처 확인

## 🌍 국제화 준비 (선택사항)

### 다국어 지원
```bash
# react-i18next 설치
npm install react-i18next i18next
```

## 📞 지원 연락처

배포 관련 문제가 있으시면:
- 이슈 트래커: GitHub Issues
- 이메일: admin@buddhist-community.kr
- 문서: 이 가이드 참조

---

**🪷 모든 불자들이 평화롭게 소통할 수 있는 디지털 선원이 되기를 발원합니다.**