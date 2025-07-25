# 🪷 영성 커뮤니티 플랫폼

현대적인 Apple/Figma 스타일의 미니멀한 디자인으로 구축된 영성 커뮤니티 React 애플리케이션입니다.

## ✨ 주요 특징

### 🎨 모던 디자인 시스템
- **평화로운 색상 팔레트**: Sage, Serenity, Lotus, Warmth 테마
- **Apple/Figma 스타일**: 미니멀하고 직관적인 인터페이스
- **다국어 타이포그래피**: Inter + Noto Sans KR 폰트 지원
- **부드러운 애니메이션**: Framer Motion을 활용한 자연스러운 전환

### 🏛️ 핵심 기능
- **사찰 리뷰 시스템**: 전국 사찰의 수행 경험 공유
- **영성 포스팅**: 깨달음과 성찰을 나누는 글쓰기 플랫폼
- **집회/모임 관리**: 불교 모임과 행사 참여 시스템
- **커뮤니티 상호작용**: 좋아요, 댓글, 북마크 기능

### 🛠️ 기술 스택
- **Frontend**: React 19 + TypeScript + Vite
- **스타일링**: Tailwind CSS + CSS Variables
- **애니메이션**: Framer Motion
- **상태 관리**: React Hooks
- **API 통신**: Fetch API with TypeScript

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── ui/                     # 재사용 가능한 UI 컴포넌트
│   │   ├── Button.tsx         # 영성 테마 버튼 컴포넌트
│   │   ├── Card.tsx           # 카드 시스템 (사찰, 리뷰, 포스트)
│   │   ├── Input.tsx          # 입력 컴포넌트 (Input, Textarea, Select)
│   │   ├── Modal.tsx          # 모달 시스템
│   │   └── Navigation.tsx     # 네비게이션 컴포넌트
│   ├── spiritual/             # 영성 커뮤니티 전용 컴포넌트
│   │   └── SpiritualDashboard.tsx  # 메인 대시보드
│   └── forms/                 # 폼 컴포넌트
│       └── CreatePostForm.tsx # 글 작성 폼 예제
├── types/
│   └── spiritual.ts           # TypeScript 타입 정의
├── services/
│   └── api.ts                 # API 서비스 레이어
├── styles/
│   └── design-system.css      # 디자인 시스템 CSS Variables
└── utils/
    └── cn.ts                  # 클래스명 유틸리티
```

## 🛠 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📜 Available Scripts

### Development
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Testing
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface

## 🏗 Architecture

### Technology Stack
- **React 19**: Latest React with concurrent features
- **TypeScript**: Strict type checking for better DX
- **Vite**: Fast build tool with excellent DX
- **ESLint + Prettier**: Consistent code style

### Performance Optimizations
- **Code Splitting**: Automatic vendor chunk splitting
- **Bundle Analysis**: Built-in bundle size monitoring
- **Fast Refresh**: Instant HMR for development

## 🧪 Testing

Testing setup with Vitest and React Testing Library. Write tests in `*.test.tsx` files.

## 🚀 Deployment

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

---

Built with ❤️ for the Buddhist community
