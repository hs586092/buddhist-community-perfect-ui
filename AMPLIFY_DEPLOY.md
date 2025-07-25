# 🪷 Buddhist Community - Amplify 배포 가이드

## 배포 준비 완료 ✅

### 빌드 파일 위치
```
dist/
├── _redirects          # SPA 라우팅을 위한 설정
├── index.html          # 메인 HTML
├── assets/             # JS/CSS 번들
├── favicon.ico         # 파비콘
└── manifest.json       # PWA 매니페스트
```

### Amplify 배포 단계

1. **AWS Amplify Console 접속**
   - https://console.aws.amazon.com/amplify/

2. **새 앱 생성**
   - "Host web app" 선택
   - GitHub/CodeCommit 등에서 리포지토리 연결

3. **빌드 설정**
   - `amplify.yml` 파일이 자동으로 감지됨
   - Node.js 18+ 환경 설정
   - 빌드 명령어: `npm run build`
   - 출력 디렉토리: `dist`

4. **환경 변수 설정**
   ```
   VITE_APP_STAGE=production
   VITE_TARGET_COUNTRY=KR
   VITE_DEFAULT_LANGUAGE=ko
   ```

5. **도메인 설정**
   - 기본 도메인: `https://xxxxx.amplifyapp.com`
   - 커스텀 도메인 설정 가능

### 주요 기능
- ✅ SPA 라우팅 지원 (`_redirects`)
- ✅ PWA 매니페스트
- ✅ SEO 최적화
- ✅ 한국어 불교 커뮤니티 콘텐츠
- ✅ 반응형 디자인
- ✅ 실시간 채팅 UI

### 페이지 구조
- `/` - 랜딩 페이지 (2분할 레이아웃)
- `/temple-reviews` - 법회 리뷰 페이지
- `/community` - 불자 소통 채팅 페이지

### 성능 최적화
- JS 번들: ~214KB (gzipped: ~65KB)
- CSS: ~12KB (gzipped: ~2.6KB)
- 총 로딩 시간: <3초 (3G 네트워크 기준)

### 보안 설정
- HTTPS 강제
- CSP 헤더
- XSS 보호
- 클릭재킹 방지

배포 후 https://your-app.amplifyapp.com 에서 확인 가능합니다.