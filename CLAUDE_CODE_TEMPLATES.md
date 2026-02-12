# 🛠️ Claude Code Templates 정리

> 현재 프로젝트에 설치된 Claude Code 템플릿 목록 및 설명

---

## 🚀 한눈에 보기

### 현재 설치된 도구들

| 카테고리 | 도구 이름 | 한 줄 설명 | 사용 예시 |
|---------|----------|-----------|----------|
| 🤖 **Agent** | code-reviewer | 코드 품질/보안 자동 검증 | "코드 리뷰해줘" |
| 🤖 **Agent** | frontend-developer | React 컴포넌트 전문 개발 | "로그인 폼 만들어줘" |
| 🤖 **Agent** | typescript-pro | TypeScript 고급 타입 시스템 전문가 | "타입 안전한 API 클라이언트 만들어줘" |
| 🤖 **Agent** | nextjs-architecture-expert | Next.js App Router 아키텍처 전문가 | "App Router로 마이그레이션해줘" |
| 🤖 **Agent** | react-performance-optimization | React 성능 최적화 전문가 | "렌더링 성능 개선해줘" |
| 🎨 **Skill** | frontend-design | 독창적인 UI 디자인 생성 | "/frontend-design 랜딩 페이지" |
| 🎨 **Skill** | senior-frontend | React/Next.js 고급 개발 & 최적화 | "/senior-frontend 컴포넌트 생성" |
| 🎨 **Skill** | webapp-testing | Playwright 기반 웹앱 테스트 | "/webapp-testing E2E 테스트" |
| 🎨 **Skill** | file-organizer | 파일/폴더 자동 정리 | "/file-organizer 다운로드 정리" |
| 🧪 **Command** | setup-visual-testing | 비주얼 회귀 테스트 설정 | "/setup-visual-testing --responsive" |
| 🧪 **Command** | explain-code | 코드 기능 분석 및 설명 | "/explain-code 이 함수 설명해줘" |
| 🧪 **Command** | refactor-code | 코드 리팩토링 자동화 | "/refactor-code 이 컴포넌트 개선해줘" |
| 🧪 **Command** | feature | Git Flow feature 브랜치 생성 | "/feature user-profile" |
| 🧪 **Command** | generate-api-documentation | API 문서 자동 생성 | "/generate-api-documentation --swagger-ui" |
| 📐 **Guideline** | css-guidelines | CSS 코딩 표준 (반응형 규칙) | CSS 작성 시 자동 적용 |
| 🔌 **MCP** | GitHub MCP | 이슈/PR/저장소 자동 관리 | "이슈 만들어줘", "PR 생성해줘" |
| 🔌 **MCP** | Atlassian Confluence | Confluence/Jira 문서 관리 | "컨플루언스 페이지 조회", "Jira 이슈 생성" |

---

## 💬 실제 사용 예시

```bash
# 코드 리뷰
너: "코드 리뷰해줘"
→ code-reviewer가 자동으로 보안/품질/성능 검증

# React 컴포넌트 개발
너: "사용자 프로필 카드 만들어줘"
→ frontend-developer가 컴포넌트 + 스타일 + 테스트 생성

# 독창적인 UI 디자인
너: "/frontend-design 포트폴리오 랜딩 페이지"
→ frontend-design이 프로덕션급 디자인 코드 생성

# GitHub 작업
너: "버그 수정 이슈 만들어줘"
→ GitHub MCP가 자동으로 이슈 생성

너: "PR 만들어줘"
→ GitHub MCP가 Pull Request 자동 생성

# Confluence/Jira 작업
너: "컨플루언스 페이지 조회해줘"
→ Atlassian MCP가 문서 자동 조회

너: "Jira 이슈 만들어줘"
→ Atlassian MCP가 Jira 이슈 자동 생성

# TypeScript 타입 작업
너: "타입 안전한 API 클라이언트 라이브러리 만들어줘"
→ typescript-pro가 고급 타입 시스템으로 구현

# Next.js 아키텍처
너: "Pages Router를 App Router로 마이그레이션해줘"
→ nextjs-architecture-expert가 마이그레이션 전략 제시

# React 성능 최적화
너: "이 컴포넌트 렌더링이 너무 느려"
→ react-performance-optimization이 병목 지점 분석 및 개선

# 시니어 프론트엔드 개발
너: "/senior-frontend 사용자 프로필 컴포넌트 생성해줘"
→ senior-frontend가 컴포넌트 + 스타일 + 테스트 자동 생성

# 웹앱 E2E 테스트
너: "/webapp-testing 로그인 플로우 테스트 작성해줘"
→ webapp-testing이 Playwright 테스트 코드 생성

# 파일 정리
너: "/file-organizer 다운로드 폴더 정리해줘"
→ file-organizer가 파일 분석 후 자동 정리 제안

# 코드 설명
너: "/explain-code src/utils/auth.ts"
→ explain-code가 코드 구조, 로직, 알고리즘 상세 분석

# 코드 리팩토링
너: "/refactor-code src/components/Dashboard.tsx"
→ refactor-code가 코드 품질 개선 및 최적화

# Git Feature 브랜치
너: "/feature user-profile-page"
→ feature가 develop 기반 feature/user-profile-page 브랜치 자동 생성

# API 문서 생성
너: "/generate-api-documentation --swagger-ui"
→ generate-api-documentation이 OpenAPI 스펙 및 Swagger UI 자동 생성
```

---

## 🎯 빠른 설치 명령어

```bash
# Code Reviewer
npx claude-code-templates@latest --agent=development-tools/code-reviewer --yes

# Frontend Developer
npx claude-code-templates@latest --agent=development-tools/frontend-developer --yes

# Frontend Design Skill
npx claude-code-templates@latest --skill=frontend-design --yes

# Visual Testing
npx claude-code-templates@latest --command=setup-visual-testing --yes

# TypeScript Pro
npx claude-code-templates@latest --agent=programming-languages/typescript-pro --yes

# Next.js Architecture Expert
npx claude-code-templates@latest --agent=web-tools/nextjs-architecture-expert --yes

# React Performance Optimization
npx claude-code-templates@latest --agent=performance-testing/react-performance-optimization --yes

# Senior Frontend Skill
npx claude-code-templates@latest --skill=development/senior-frontend --yes

# WebApp Testing Skill
npx claude-code-templates@latest --skill=development/webapp-testing --yes

# File Organizer Skill
npx claude-code-templates@latest --skill=productivity/file-organizer --yes

# Explain Code Command
npx claude-code-templates@latest --command=utilities/explain-code --yes

# Refactor Code Command
npx claude-code-templates@latest --command=utilities/refactor-code --yes

# Git Feature Command
npx claude-code-templates@latest --command=git/feature --yes

# API Documentation Generator
npx claude-code-templates@latest --command=documentation/generate-api-documentation --yes
```

---

## 📂 설치된 템플릿 구조

```
.claude/
├── agents/
│   ├── code-reviewer.md                      # 코드 리뷰 자동화 에이전트
│   ├── frontend-developer.md                 # 프론트엔드 개발 전문 에이전트
│   ├── typescript-pro.md                     # TypeScript 고급 타입 시스템 전문가
│   ├── nextjs-architecture-expert.md         # Next.js App Router 아키텍처 전문가
│   └── react-performance-optimization.md     # React 성능 최적화 전문가
├── skills/
│   ├── frontend-design/
│   │   └── SKILL.md                          # UI 디자인 생성 스킬
│   ├── senior-frontend/
│   │   ├── SKILL.md                          # React/Next.js 고급 개발
│   │   ├── references/                       # React 패턴, Next.js 최적화 가이드
│   │   └── scripts/                          # 컴포넌트 생성, 번들 분석 스크립트
│   ├── webapp-testing/
│   │   ├── SKILL.md                          # Playwright 웹앱 테스트
│   │   ├── examples/                         # 테스트 예제
│   │   └── scripts/                          # 서버 관리 헬퍼
│   └── file-organizer/
│       └── SKILL.md                          # 파일/폴더 자동 정리
├── commands/
│   ├── setup-visual-testing.md          # 비주얼 테스트 설정
│   ├── explain-code.md                  # 코드 분석 및 설명
│   ├── refactor-code.md                 # 코드 리팩토링 자동화
│   ├── feature.md                       # Git Flow feature 브랜치 생성
│   └── generate-api-documentation.md    # API 문서 자동 생성
├── css-guidelines.md            # CSS 코딩 가이드라인
└── claude_desktop_config.json   # MCP 서버 설정 (전역)
```

---

## 🔌 MCP (Model Context Protocol)

### 개요
**MCP**는 Claude가 외부 도구 및 데이터 소스와 통합할 수 있게 해주는 프로토콜입니다.

### 현재 설치된 MCP 서버

#### 1. **GitHub MCP** 🐙
**설정 위치:** `~/.claude/claude_desktop_config.json`

**역할:**
- GitHub API와 직접 통합
- 코드 없이 저장소 관리
- 이슈, PR, 브랜치, 커밋 자동화

**주요 기능:**
- ✅ 저장소 생성/포크/조회
- ✅ 이슈 생성/수정/조회/검색
- ✅ Pull Request 생성/병합/리뷰
- ✅ 브랜치 생성/관리
- ✅ 파일 원격 생성/수정/조회
- ✅ 커밋 조회/분석
- ✅ 코드/이슈/PR/사용자 검색

**사용 예시:**
```bash
클로드에게: "새 이슈 만들어줘: 로그인 버그 수정 필요"
→ GitHub에 자동으로 이슈 생성

클로드에게: "PR 만들어줘"
→ 현재 브랜치로 Pull Request 자동 생성

클로드에게: "이슈 #123 상태 확인해줘"
→ GitHub 이슈 정보 자동 조회
```

---

#### 2. **Atlassian Confluence MCP** 📄
**설정 위치:** `~/.claude/claude_desktop_config.json`

**역할:**
- Confluence 문서 조회/편집
- Jira 이슈 관리
- 팀 협업 자동화

**주요 기능:**

**Confluence:**
- ✅ 페이지 조회/생성/수정
- ✅ 스페이스 관리
- ✅ 댓글 추가 (Footer/Inline)
- ✅ CQL 검색 (Confluence Query Language)
- ✅ 페이지 트리 구조 조회

**Jira:**
- ✅ 이슈 생성/조회/수정
- ✅ 이슈 상태 전환 (Transition)
- ✅ 댓글 추가
- ✅ Worklog 기록
- ✅ JQL 검색 (Jira Query Language)
- ✅ 프로젝트 관리

**사용 예시:**
```bash
클로드에게: "컨플루언스 페이지 19071073 조회해줘"
→ Confluence 페이지 내용 자동 조회

클로드에게: "이 페이지에 MCP 섹션 추가해줘"
→ Confluence 페이지 자동 업데이트

클로드에게: "Jira 버그 이슈 만들어줘"
→ Jira 이슈 자동 생성

클로드에게: "PROJ-123 이슈 상태를 Done으로 변경해줘"
→ Jira 이슈 상태 자동 업데이트
```

---

### MCP 서버 추가 방법

#### Atlassian Confluence MCP 추가
```json
{
  "mcpServers": {
    "github": { ... },
    "atlassian-confluence": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-atlassian"],
      "env": {
        "ATLASSIAN_API_TOKEN": "your-token-here",
        "ATLASSIAN_CLOUD_ID": "your-cloud-id"
      }
    }
  }
}
```

#### 다른 유용한 MCP 서버들
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-..."
      }
    }
  }
}
```

---

## 🤖 Agents (에이전트)

### 1. **code-reviewer** 📝
**파일:** `.claude/agents/code-reviewer.md`

#### 역할
코드 품질, 보안, 유지보수성을 전문적으로 검토하는 시니어 코드 리뷰어

#### 주요 기능
- ✅ 코드 가독성 및 간결성 검증
- ✅ 변수/함수 네이밍 검토
- ✅ 중복 코드 탐지
- ✅ 에러 핸들링 확인
- ✅ 보안 취약점 검사 (API 키 노출, 시크릿 유출)
- ✅ 입력 검증 구현 확인
- ✅ 테스트 커버리지 검토
- ✅ 성능 최적화 제안

#### 사용 방법
```bash
# 자동으로 git diff를 확인하여 최근 변경사항 리뷰
클로드에게: "코드 리뷰해줘"
```

#### 리뷰 결과 우선순위
1. **Critical** (반드시 수정): 보안 이슈, 치명적 버그
2. **Warning** (수정 권장): 성능 문제, 잠재적 버그
3. **Suggestion** (개선 제안): 코드 품질 향상

---

### 2. **frontend-developer** ⚛️
**파일:** `.claude/agents/frontend-developer.md`

#### 역할
React 애플리케이션과 반응형 디자인 전문 프론트엔드 개발자

#### 주요 기능
- ⚛️ React 컴포넌트 아키텍처 (Hooks, Context, Performance)
- 🎨 반응형 CSS (Tailwind/CSS-in-JS)
- 📦 상태 관리 (Redux, Zustand, Context API)
- ⚡ 프론트엔드 성능 최적화 (Lazy Loading, Code Splitting, Memoization)
- ♿ 접근성 구현 (WCAG, ARIA, 키보드 네비게이션)

#### 개발 원칙
1. **컴포넌트 우선 사고** - 재사용 가능하고 조합 가능한 UI
2. **모바일 퍼스트** - 작은 화면부터 설계
3. **성능 예산** - 3초 이내 로딩 목표
4. **시맨틱 HTML** - 적절한 ARIA 속성
5. **타입 안정성** - TypeScript 적용

#### 사용 방법
```bash
클로드에게: "로그인 폼 컴포넌트 만들어줘"
클로드에게: "이 컴포넌트를 반응형으로 수정해줘"
```

#### 출력 결과
- 완성된 React 컴포넌트 (Props Interface 포함)
- 스타일링 솔루션 (Tailwind 또는 styled-components)
- 상태 관리 구현
- 기본 유닛 테스트 구조
- 접근성 체크리스트
- 성능 최적화 고려사항

---

### 3. **typescript-pro** 🔷
**파일:** `.claude/agents/typescript-pro.md`

#### 역할
TypeScript 5.0+ 고급 타입 시스템 마스터 - 타입 안전성과 DX 극대화

#### 주요 기능
- 🔷 고급 타입 패턴 (Conditional Types, Mapped Types, Template Literal Types)
- 🎯 타입 레벨 프로그래밍 (Type-level Programming)
- 🔒 100% 타입 커버리지 및 Strict Mode
- 🚀 풀스택 타입 안전성 (tRPC, GraphQL)
- ⚡ 빌드 최적화 (Project References, Incremental Compilation)
- 📦 라이브러리 제작 및 Declaration Files

#### 전문 분야
- Discriminated Unions, Type Guards, Branded Types
- Generic Constraints, Higher-kinded Types 시뮬레이션
- End-to-End Type Safety (DB → Backend → Frontend)
- Monorepo TypeScript 아키텍처
- 타입 기반 코드 생성 (OpenAPI, GraphQL)

#### 사용 방법
```bash
클로드에게: "타입 안전한 API 클라이언트 라이브러리 만들어줘"
클로드에게: "JavaScript 코드를 TypeScript로 마이그레이션해줘"
클로드에게: "이 타입 에러 해결해줘"
```

---

### 4. **nextjs-architecture-expert** ⚡
**파일:** `.claude/agents/nextjs-architecture-expert.md`

#### 역할
Next.js App Router 전문가 - 현대적인 풀스택 아키텍처 설계

#### 주요 기능
- 📁 App Router 아키텍처 (File-based Routing, Nested Layouts)
- ⚛️ Server Components & Client Components 전략
- 🚀 성능 최적화 (Static Generation, ISR, Streaming)
- 🔄 Pages Router → App Router 마이그레이션
- 🌐 Full-Stack Patterns (API Routes, Middleware, Auth)
- 📊 데이터 페칭 전략 (Server-side, Suspense)

#### 아키텍처 패턴
- Route Groups, Parallel Routes, Intercepting Routes
- Streaming with Suspense
- Middleware for Authentication
- Static Generation with Dynamic Segments
- Edge Functions & Edge Runtime

#### 사용 방법
```bash
클로드에게: "Pages Router를 App Router로 마이그레이션해줘"
클로드에게: "Next.js 프로젝트 아키텍처 설계해줘"
클로드에게: "Server Components vs Client Components 어떻게 나눌까?"
```

---

### 5. **react-performance-optimization** 🚄
**파일:** `.claude/agents/react-performance-optimization.md`

#### 역할
React 성능 최적화 전문가 - 병목 지점 분석 및 해결

#### 주요 기능
- ⚡ 렌더링 최적화 (React.memo, useMemo, useCallback)
- 📦 번들 최적화 (Code Splitting, Tree Shaking, Dynamic Imports)
- 🧠 메모리 관리 (Memory Leaks 탐지 및 해결)
- 🌐 네트워크 성능 (Lazy Loading, Prefetching, Caching)
- 📊 Core Web Vitals 최적화 (LCP, FID, CLS)
- 🔍 프로파일링 (React DevTools Profiler, Chrome DevTools)

#### 최적화 전략
- Component Memoization 패턴
- Virtual List (Windowing) 구현
- Image & Asset 최적화
- Re-render 방지 기법
- Bundle Size 분석 및 감소

#### 사용 방법
```bash
클로드에게: "이 컴포넌트 렌더링이 너무 느려"
클로드에게: "번들 사이즈 줄여줘"
클로드에게: "메모리 누수 찾아줘"
클로드에게: "Core Web Vitals 점수 개선해줘"
```

---

## 🎨 Skills (스킬)

### 3. **frontend-design** 🎭
**파일:** `.claude/skills/frontend-design/SKILL.md`

#### 역할
독창적이고 프로덕션급 프론트엔드 인터페이스를 생성하는 디자인 스킬

#### 주요 기능
- 🎨 고품질 UI 디자인 자동 생성
- ✨ "AI 티" 나지 않는 독창적 디자인
- 🎭 다양한 미학적 방향성 지원
- 🚀 실제 동작하는 프로덕션 코드 생성

#### 디자인 철학
**BOLD한 미학적 방향성 선택:**
- Brutally Minimal (극도의 미니멀)
- Maximalist Chaos (맥시멀리즘)
- Retro-Futuristic (레트로 퓨처)
- Organic/Natural (유기적/자연적)
- Luxury/Refined (럭셔리/정제됨)
- Playful/Toy-like (장난스러움)
- Editorial/Magazine (에디토리얼)
- Brutalist/Raw (브루탈리즘)
- Art Deco/Geometric (아르데코/기하학)

#### 디자인 요소 집중
1. **타이포그래피**: 독특하고 아름다운 폰트 선택 (Inter, Arial 금지)
2. **컬러 테마**: 응집력 있는 색상 팔레트, CSS 변수 활용
3. **모션**: 애니메이션 효과, 마이크로 인터랙션
4. **공간 구성**: 비대칭, 중첩, 대각선 흐름, 그리드 파괴
5. **배경 & 디테일**: 그라디언트 메시, 노이즈 텍스처, 기하학 패턴

#### 금지 사항
❌ Inter, Roboto, Arial, 시스템 폰트
❌ 보라색 그라디언트 + 흰 배경
❌ 예측 가능한 레이아웃
❌ 맥락 없는 쿠키커터 디자인

#### 사용 방법
```bash
클로드에게: "/frontend-design 랜딩 페이지 만들어줘"
클로드에게: "/frontend-design 대시보드 UI 디자인해줘"
```

---

### 6. **senior-frontend** 💼
**파일:** `.claude/skills/senior-frontend/SKILL.md`

#### 역할
React/Next.js 전문 시니어 개발자 - 컴포넌트 생성부터 번들 최적화까지

#### 주요 기능
- ⚛️ React/Next.js/TypeScript/Tailwind 풀스택
- 🏗️ 컴포넌트 스캐폴딩 자동화
- 📦 번들 분석 및 최적화
- ⚡ 성능 튜닝 및 모니터링
- 📚 베스트 프랙티스 가이드 내장

#### 자동화 스크립트
1. **Component Generator** - 컴포넌트 자동 생성
2. **Bundle Analyzer** - 번들 크기 분석 및 최적화
3. **Frontend Scaffolder** - 프로젝트 구조 자동 생성

#### 레퍼런스 문서
- `references/react_patterns.md` - React 패턴 가이드
- `references/nextjs_optimization_guide.md` - Next.js 최적화
- `references/frontend_best_practices.md` - 프론트엔드 베스트 프랙티스

#### 사용 방법
```bash
클로드에게: "/senior-frontend 컴포넌트 생성해줘"
클로드에게: "/senior-frontend 번들 사이즈 분석해줘"
클로드에게: "/senior-frontend 프로젝트 스캐폴딩해줘"
```

---

### 7. **webapp-testing** 🧪
**파일:** `.claude/skills/webapp-testing/SKILL.md`

#### 역할
Playwright 기반 웹 애플리케이션 E2E 테스트 전문가

#### 주요 기능
- 🎭 Playwright 자동화 테스트
- 🌐 로컬 웹앱 기능 검증
- 🐛 UI 동작 디버깅
- 📸 브라우저 스크린샷 캡처
- 📋 브라우저 콘솔 로그 확인

#### 헬퍼 스크립트
- `scripts/with_server.py` - 서버 라이프사이클 관리 (단일/멀티 서버)

#### 테스트 패턴
- Static HTML 테스트
- Dynamic 웹앱 테스트
- 요소 탐색 (Element Discovery)
- 콘솔 로깅 캡처

#### 사용 방법
```bash
클로드에게: "/webapp-testing E2E 테스트 작성해줘"
클로드에게: "/webapp-testing UI 동작 검증해줘"
클로드에게: "/webapp-testing 스크린샷 찍어줘"
```

---

### 8. **file-organizer** 📁
**파일:** `.claude/skills/file-organizer/SKILL.md`

#### 역할
파일/폴더 자동 정리 및 구조화 전문가

#### 주요 기능
- 🗂️ 파일/폴더 구조 자동 분석
- 🔍 중복 파일 탐지 및 제거
- 📋 논리적 폴더 구조 제안
- 🧹 자동 정리 및 이동
- 📊 파일 타입/크기/날짜 분석

#### 정리 기준
- **타입별**: Documents, Images, Videos, Archives, Code
- **목적별**: Work/Personal, Active/Archive, Project-specific
- **날짜별**: Current, Previous years, Very old

#### 베스트 프랙티스
- 명확한 폴더/파일 네이밍
- 날짜 포함 네이밍 (YYYY-MM-DD)
- 6개월 이상 미사용 시 아카이브
- 주기적 정리 (주간/월간/분기/연간)

#### 사용 방법
```bash
클로드에게: "/file-organizer 다운로드 폴더 정리해줘"
클로드에게: "/file-organizer 중복 파일 찾아줘"
클로드에게: "/file-organizer 프로젝트 구조화해줘"
```

---

## 🧪 Commands (커맨드)

### 4. **setup-visual-testing** 📸
**파일:** `.claude/commands/setup-visual-testing.md`

#### 역할
크로스 브라우저 및 반응형 테스트를 포함한 종합적인 비주얼 회귀 테스트 설정

#### 주요 기능
- 📸 비주얼 회귀 테스트 자동화
- 🌐 크로스 브라우저 테스트
- 📱 반응형 디자인 검증
- ♿ 접근성 검증
- 🔍 차이 감지 및 승인 워크플로우

#### 테스트 프레임워크 선택
- Percy
- Chromatic
- BackstopJS
- Playwright

#### 테스트 범위
1. **컴포넌트 테스트** - 개별 UI 컴포넌트 검증
2. **페이지 워크플로우** - 전체 페이지 시나리오
3. **반응형 브레이크포인트** - 다양한 화면 크기
4. **브라우저 매트릭스** - 여러 브라우저 호환성

#### 사용 방법
```bash
클로드에게: "/setup-visual-testing --components"
클로드에게: "/setup-visual-testing --responsive"
클로드에게: "/setup-visual-testing --cross-browser"
```

#### 설정 단계
1. **도구 선택 및 설정** - 프레임워크 선택, 환경 구성
2. **베이스라인 생성** - 스크린샷 캡처, 버전 관리
3. **테스트 시나리오 설계** - 컴포넌트/페이지 테스트
4. **CI/CD 통합** - 자동화된 실행
5. **회귀 감지** - Diff 알고리즘, 승인 워크플로우
6. **고급 테스트** - 접근성, 성능 모니터링

---

### 9. **explain-code** 💡
**파일:** `.claude/commands/explain-code.md`

#### 역할
코드 기능을 체계적으로 분석하고 자세히 설명하는 도구

#### 주요 기능
- 📖 코드 구조 및 아키텍처 분석
- 🔍 라인별 상세 설명
- 🧠 알고리즘 및 로직 해석
- 🔐 보안 및 성능 고려사항 분석
- 🐛 디버깅 및 테스트 전략 제시

#### 분석 항목
1. 고수준 개요 및 목적
2. 코드 구조 분해
3. 알고리즘 및 로직 설명
4. 데이터 구조 및 타입
5. 프레임워크/라이브러리 사용법
6. 에러 처리 및 엣지 케이스
7. 성능 및 보안 고려사항
8. 개선 제안

#### 사용 방법
```bash
클로드에게: "/explain-code src/utils/auth.ts 설명해줘"
클로드에게: "/explain-code 이 함수 로직 분석해줘"
```

---

### 10. **refactor-code** 🔄
**파일:** `.claude/commands/refactor-code.md`

#### 역할
코드 품질을 체계적으로 개선하고 리팩토링하는 자동화 도구

#### 주요 기능
- 🧹 코드 중복 제거 (DRY)
- 📏 복잡도 감소 및 가독성 향상
- 🎯 디자인 패턴 적용
- ⚡ 성능 최적화
- 🧪 테스트 커버리지 유지

#### 리팩토링 전략
1. 사전 분석 및 테스트 검증
2. 점진적 리팩토링 (작은 단위)
3. 네이밍 및 구조 개선
4. 성능 최적화
5. 에러 핸들링 개선
6. 문서화 업데이트
7. 통합 테스트

#### 사용 방법
```bash
클로드에게: "/refactor-code src/components/Dashboard.tsx"
클로드에게: "/refactor-code 이 함수 성능 개선해줘"
```

---

### 11. **feature** 🌿
**파일:** `.claude/commands/feature.md`

#### 역할
Git Flow feature 브랜치를 자동 생성하고 관리하는 도구

#### 주요 기능
- 🌿 feature 브랜치 자동 생성
- 📌 develop 브랜치 기반 분기
- 🔄 원격 저장소 추적 설정
- ✅ Git Flow 네이밍 컨벤션
- 🚨 충돌 방지 및 상태 검증

#### 워크플로우
1. develop 브랜치로 전환
2. 최신 변경사항 pull
3. `feature/<name>` 브랜치 생성
4. 원격 추적 설정 및 push
5. 상태 리포트 제공

#### Git Flow 브랜치 구조
- **main**: 프로덕션 코드
- **develop**: 통합 브랜치
- **feature/**: 새 기능 개발 (여기!)
- **release/**: 릴리스 준비
- **hotfix/**: 긴급 수정

#### 사용 방법
```bash
클로드에게: "/feature user-authentication"
클로드에게: "/feature payment-integration"
```

---

### 12. **generate-api-documentation** 📚
**파일:** `.claude/commands/generate-api-documentation.md`

#### 역할
API 레퍼런스 문서를 자동 생성하고 배포하는 도구

#### 주요 기능
- 📝 OpenAPI/Swagger 문서 자동 생성
- 🎨 다중 포맷 지원 (Swagger UI, Redoc, Postman)
- 🔍 코드 주석 기반 문서화
- 🚀 CI/CD 통합 자동 배포
- 📊 대화형 API 테스트

#### 지원 포맷
- **Swagger UI**: 대화형 API 문서
- **Redoc**: 모던 OpenAPI 렌더러
- **Postman**: API 컬렉션
- **Insomnia**: API 테스트
- **GraphQL**: GraphiQL, Apollo Studio

#### 문서화 전략
1. 코드 주석 및 스키마 정의
2. API 스펙 자동 생성
3. 대화형 문서 설정
4. 호스팅 및 배포
5. CI/CD 통합
6. 유지보수 및 품질 관리

#### 사용 방법
```bash
클로드에게: "/generate-api-documentation --swagger-ui"
클로드에게: "/generate-api-documentation --multi-format"
```

---

## 📐 Guidelines (가이드라인)

### 5. **css-guidelines** 📏
**파일:** `.claude/css-guidelines.md`

#### 역할
CSS 코딩 표준 및 반응형 스타일 작성 규칙

#### 반응형 미디어 쿼리 형식
```css
/* 📱 ================================================================================================

모바일 반응형 스타일 (max-width: 768px)

================================================================================================ 📱 */

@media (max-width: 768px) {
  /* 모바일 스타일 내용 */
}
```

#### 규칙
- ✅ 브레이크포인트: `max-width: 768px` 필수 사용
- ✅ 주석 형식 정확히 준수
- ✅ 이모지와 구분선 포함

#### 목적
- 일관된 CSS 코드 스타일 유지
- 가독성 향상
- 모바일 반응형 코드 관리 용이성

---

## 🎯 템플릿 설치 방법

### 개별 템플릿 설치
```bash
# Code Reviewer 설치
npx claude-code-templates@latest --agent=development-tools/code-reviewer --yes

# Frontend Developer 설치
npx claude-code-templates@latest --agent=development-tools/frontend-developer --yes

# Frontend Design Skill 설치
npx claude-code-templates@latest --skill=frontend-design --yes

# Visual Testing Command 설치
npx claude-code-templates@latest --command=setup-visual-testing --yes
```

---

## 📊 템플릿 활용 시나리오

### 1. 코드 작성 후 자동 리뷰
```
개발자: 새 기능 구현
→ Claude: "코드 리뷰해줘"
→ code-reviewer 자동 실행
→ 보안/품질/성능 피드백 제공
```

### 2. 프론트엔드 컴포넌트 개발
```
개발자: "사용자 프로필 카드 만들어줘"
→ frontend-developer 자동 실행
→ React 컴포넌트 + 스타일 + 테스트 생성
```

### 3. 독창적인 UI 디자인
```
개발자: "/frontend-design 포트폴리오 페이지"
→ frontend-design 스킬 실행
→ 독특한 디자인 + 프로덕션 코드 생성
```

### 4. 비주얼 테스트 설정
```
개발자: "/setup-visual-testing --responsive"
→ 반응형 비주얼 테스트 자동 구성
→ CI/CD 통합 완료
```

---

## 💡 Tips

### 언제 사용하면 좋을까?

| 템플릿/도구 | 사용 시점 |
|------------|----------|
| **code-reviewer** | 코드 작성/수정 후 즉시 |
| **frontend-developer** | React 컴포넌트 개발 시 |
| **typescript-pro** | 고급 타입 시스템, 타입 에러 해결 시 |
| **nextjs-architecture-expert** | Next.js 프로젝트 설계, 마이그레이션 시 |
| **react-performance-optimization** | 성능 병목, 렌더링 최적화 필요 시 |
| **frontend-design** | 독창적인 UI/UX 필요 시 |
| **senior-frontend** | 컴포넌트 생성, 번들 분석, 프로젝트 구조화 시 |
| **webapp-testing** | E2E 테스트, UI 검증, 디버깅 시 |
| **file-organizer** | 폴더 정리, 중복 파일 제거, 구조 개선 시 |
| **setup-visual-testing** | 프로젝트 초기 또는 테스트 개선 시 |
| **explain-code** | 레거시 코드 이해, 복잡한 로직 분석 시 |
| **refactor-code** | 기술 부채 해결, 코드 품질 개선 시 |
| **feature** | 새 기능 개발 브랜치 생성 시 |
| **generate-api-documentation** | API 문서화, 스펙 생성 시 |
| **css-guidelines** | CSS 파일 작성 시 항상 참고 |
| **GitHub MCP** | 이슈/PR 관리, 저장소 조회 시 |
| **Atlassian Confluence MCP** | 문서 작성/조회, Jira 이슈 관리 시 |

### 조합 활용 예시

#### 완전한 기능 개발 플로우
```
1. GitHub MCP로 이슈 생성
   ↓
2. nextjs-architecture-expert로 아키텍처 설계
   ↓
3. typescript-pro로 타입 시스템 구축
   ↓
4. frontend-design로 UI 디자인 생성
   ↓
5. frontend-developer로 React 컴포넌트 구현
   ↓
6. react-performance-optimization으로 성능 최적화
   ↓
7. code-reviewer로 품질 검증
   ↓
8. setup-visual-testing로 회귀 테스트 설정
   ↓
9. GitHub MCP로 PR 생성 및 리뷰 요청
```

#### 실전 시나리오 1: 새 기능 개발
```
개발자: "로그인 기능 버그 있어"
  → GitHub MCP: 이슈 자동 생성 (#45)

개발자: "Next.js App Router로 로그인 페이지 만들어줘"
  → nextjs-architecture-expert: App Router 구조 설계
  → typescript-pro: 타입 안전한 인증 로직 구현
  → frontend-design: 새로운 로그인 UI 생성
  → frontend-developer: React 컴포넌트 구현

개발자: "코드 리뷰 부탁"
  → code-reviewer: 보안/품질 검증

개발자: "PR 만들어줘"
  → GitHub MCP: Pull Request 자동 생성
  → 이슈 #45 자동 연결
```

#### 실전 시나리오 2: 성능 개선
```
개발자: "대시보드 페이지가 너무 느려"
  → react-performance-optimization: 병목 지점 분석
  → "5개 컴포넌트에서 불필요한 re-render 발생"
  → React.memo, useMemo로 최적화 제안
  → 번들 사이즈 40% 감소, 렌더링 시간 60% 개선

개발자: "TypeScript 타입 에러 해결해줘"
  → typescript-pro: 고급 타입 패턴으로 해결
  → Generic Constraints, Conditional Types 적용
```

---

## 🔗 참고 링크

- [Claude Code 공식 문서](https://docs.claude.ai)
- [Anthropic GitHub](https://github.com/anthropics)
- [Claude Code Templates](https://www.npmjs.com/package/claude-code-templates)

---

**마지막 업데이트:** 2026-02-12
**프로젝트:** reviewx-web
