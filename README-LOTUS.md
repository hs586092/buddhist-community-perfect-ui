# 🌸 연꽃 일러스트 컴포넌트 라이브러리

불교 커뮤니티 플랫폼을 위한 미니멀한 연꽃 SVG 컴포넌트 모음

## 📁 구조

```
src/components/lotus/
├── LotusBloom.tsx           # 완전히 핀 연꽃 (Hero용)
├── LotusBud.tsx            # 봉오리 상태 (로딩/버튼용)  
├── LotusLeaf.tsx           # 연잎만 (배경 패턴용)
├── LotusIcon.tsx           # 심플 아이콘 (네비게이션용)
├── index.ts                # 통합 export
└── LotusComponents.stories.tsx  # Storybook 문서
```

## 🎨 컴포넌트 가이드

### 1. LotusBloom - 완전히 핀 연꽃

**용도**: Hero 섹션, 메인 대시보드, 환영 메시지
**특징**: 8개 외부 꽃잎 + 6개 내부 꽃잎, 애니메이션 지원

```tsx
import { LotusBloom } from '@/components/lotus';

<LotusBloom 
  size={120}           // 크기 (px 또는 string)
  color="currentColor" // 색상
  strokeWidth={1.5}    // 선 두께
  animate={true}       // 애니메이션 효과
  className="custom-class"
/>
```

### 2. LotusBud - 봉오리 상태

**용도**: 로딩 상태, 버튼 아이콘, 로그인 페이지
**특징**: 봉오리 형태, 줄기 포함, 펄스 애니메이션

```tsx
import { LotusBud } from '@/components/lotus';

<LotusBud 
  size={60}
  color="#3b82f6"
  animate={true}
/>
```

### 3. LotusLeaf - 연잎만

**용도**: 카드 배경, 패턴 장식, 빈 상태 일러스트
**특징**: 회전 가능, 연잎 질감 표현

```tsx
import { LotusLeaf } from '@/components/lotus';

<LotusLeaf 
  size={80}
  color="#059669"
  rotate={45}          // 회전 각도
  animate={false}
/>
```

### 4. LotusIcon - 심플 아이콘

**용도**: 네비게이션 로고, 작은 아이콘, 버튼 아이콘
**특징**: 24px 최적화, filled/outline 모드

```tsx
import { LotusIcon } from '@/components/lotus';

<LotusIcon 
  size={24}
  color="currentColor"
  filled={false}       // true: 채워진 스타일
/>
```

## 🏗️ 통합 예시

### 네비게이션 로고
```tsx
// SpiritualDashboard.tsx
<div className="w-8 h-8 bg-gradient-to-br from-sage-500 to-serenity-500 rounded-lg flex items-center justify-center">
  <LotusIcon size={20} color="white" />
</div>
```

### Hero 섹션
```tsx
// SpiritualDashboard.tsx
<motion.div className="w-20 h-20 bg-gradient-to-br from-sage-500 to-serenity-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
  <LotusBloom size={48} color="white" animate={true} />
</motion.div>
```

### 로그인 페이지
```tsx
// LoginPage.tsx
<div className="mx-auto h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
  <LotusBud size={32} color="white" animate={true} />
</div>
```

### 카드 배경
```tsx
// Card.tsx
<div className="aspect-video bg-gradient-to-br from-sage-50 to-sage-100 relative overflow-hidden flex items-center justify-center">
  <LotusLeaf size={80} color="#a3a3a3" animate={false} />
</div>
```

## 🎯 디자인 원칙

### 미니멀한 선화 스타일
- 선명한 선 (stroke-width: 1.5)
- 채우기 없는 아웃라인 중심
- 차분한 색상 팔레트

### 접근성 준수
- `role="img"` 속성
- `aria-label` 설명
- 키보드 내비게이션 지원

### 반응형 디자인
- SVG 벡터 기반 (무손실 확대/축소)
- CSS 클래스 통합 지원
- TailwindCSS 호환

## 🎨 색상 가이드

### 추천 색상 조합
```css
/* 평온한 그린 */
color: #10b981  /* emerald-500 */
color: #059669  /* emerald-600 */

/* 영성적 퍼플 */
color: #7c3aed  /* violet-600 */
color: #6366f1  /* indigo-500 */

/* 차분한 블루 */
color: #3b82f6  /* blue-500 */
color: #0ea5e9  /* sky-500 */

/* 따뜻한 그레이 */
color: #6b7280  /* gray-500 */
color: #9ca3af  /* gray-400 */
```

## 🔧 애니메이션

### 기본 애니메이션 (animate=true)
- **LotusBloom**: 꽃잎별 순차적 펄스 (0s-1.4s 딜레이)
- **LotusBud**: 전체 펄스 애니메이션
- **LotusLeaf**: 부드러운 페이드 효과

### 커스텀 애니메이션
```css
/* Framer Motion과 함께 사용 */
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  <LotusBloom size={120} />
</motion.div>
```

## 📱 테스트

### 시각적 테스트
1. `lotus-test.html` 파일 브라우저에서 열기
2. 각 컴포넌트 렌더링 확인
3. 애니메이션 동작 검증

### Storybook 사용
```bash
npm run storybook
```

### 단위 테스트
```bash
npm run test -- --testPathPattern=lotus
```

## 🚀 성능 최적화

### SVG 최적화
- 불필요한 그룹 제거
- Path 단순화
- 색상 중복 제거

### 번들 사이즈
- Tree-shaking 지원
- 개별 import 가능
- 압축 후 ~2KB

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능