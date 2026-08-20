<div align="center">

# ReviewX

**리뷰어와 파트너를 연결하는 체험단 캠페인 관리 플랫폼**

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query_v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

<br/>

## 📌 프로젝트 소개

ReviewX는 **광고주(파트너)가 체험단 캠페인을 등록**하고, **리뷰어(유저)가 신청·참여·콘텐츠를 등록**하는 플랫폼입니다.  
리뷰어 / 파트너 / 관리자(GA) 세 가지 역할로 구성되어 있으며, 각 역할에 맞는 화면과 기능을 독립적으로 구현했습니다.

> 프론트엔드 전 영역을 1인 개발로 담당했으며, 실제 백엔드 API 명세서를 기반으로 구현했습니다.  
> 백엔드 없이도 전체 기능을 시연할 수 있도록 json-server 기반 Mock 서버를 직접 구축했습니다.

<br/>

---

## 🛠 기술 스택

| 분류 | 기술 |
|:---|:---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | CSS Modules + Tailwind CSS v4 |
| **Server State** | TanStack Query (React Query) v5 |
| **HTTP Client** | Axios |
| **차트** | Recharts |
| **에디터** | Toast UI Editor |
| **Mock Server** | json-server + 커스텀 Express 미들웨어 |
| **테스트** | Playwright (E2E), Storybook 8 |
| **코드 품질** | ESLint 9, Prettier, Husky + lint-staged |

<br/>

---

## 📂 프로젝트 구조

```
src/
├── app/                         # Next.js App Router
│   ├── campaign/                # 캠페인 목록·상세 (5가지 유형)
│   ├── user/                    # 리뷰어 — 캠페인 관리, 포인트, 마이페이지
│   ├── partner/                 # 파트너 — 캠페인 등록·관리, 지원자, 콘텐츠, 포인트
│   └── manager_ga/              # 관리자 — 대시보드, 캠페인 현황, 회원 관리
│
├── components/                  # 공통 및 도메인별 컴포넌트
│   ├── common/                  # 모달, 버튼, 입력 등 공통 UI
│   ├── fragments/               # 헤더, 네비게이션, 사이드바
│   └── manager / partner / user # 역할별 도메인 컴포넌트
│
├── hooks/                       # React Query 커스텀 훅
│   ├── user/                    # 유저 도메인 훅
│   ├── partner/                 # 파트너 도메인 훅
│   └── manager/                 # 관리자 도메인 훅
│
├── lib/
│   ├── api/                     # Axios API 함수 (역할별 client 분리)
│   └── auth/                    # 인증 로직 (storage, mapper, guard)
│
├── types/                       # TypeScript 타입 정의 (domain / api 분리)
└── styles/                      # CSS Modules (페이지·컴포넌트 단위)
```

<br/>

---

## 🔐 인증 아키텍처

역할에 따라 인증 방식을 다르게 설계했습니다.

```
리뷰어  ──── Naver OAuth ──── localStorage (role-key 기반)
파트너  ──── 이메일/PW  ──── 서버 세션 쿠키 (withCredentials)
관리자  ──── 이메일/PW  ──── localStorage (role-key 기반)
```

- `reviewx_auth_user_{role}` / `reviewx_auth_token_{role}` 키로 역할별 독립 저장
- 파트너는 `partnerApiClient`(별도 Axios 인스턴스)로 세션 쿠키 자동 포함
- 경로 기반 역할 추론(`getRoleFromPathname`)으로 페이지 진입 시 자동 인증 확인

<br/>

---

## ✨ 주요 구현 내용

### 1. React Query placeholderData 패턴
API 응답 전에도 정적 fallback 데이터를 즉시 표시해 **레이아웃 깜빡임(CLS) 없는 UX** 구현

```ts
export function usePartnerProfile() {
  return useQuery({
    queryKey: partnerMypageKeys.profile(),
    queryFn: getPartnerProfile,
    placeholderData: STATIC_PARTNER_PROFILE, // API 응답 전 즉시 렌더링
  });
}
```

### 2. Mock 서버 커스터마이징
json-server에 Express 미들웨어를 추가해 실제 백엔드 동작을 재현
- 세션 기반 파트너 인증 (`/partner/login` → `currentSession` 관리)
- 관리자 역할 분기 (GA / SA)
- 파일 업로드 처리 (multer)
- 전체 응답을 `{ result, generatedAt, data }` 형태로 자동 래핑

### 3. 역할별 완전 분리 구조
- 라우팅, 컴포넌트, 훅, API 클라이언트를 역할별로 독립 관리
- 파트너·리뷰어·관리자가 동시에 각자의 세션을 유지 가능

### 4. 탭 기반 캠페인 상태 관리
단일 URL 파라미터로 5가지 탭(전체·신청·선정·완료·취소) 상태를 관리하고, React Query 캐싱으로 탭 전환 시 불필요한 재요청 방지

<br/>

---

## 🖥 화면 소개

### 로그인

| 리뷰어 로그인 (Naver/Kakao OAuth) | 파트너 로그인 | 관리자 로그인 |
|:---:|:---:|:---:|
| ![리뷰어 로그인](portfolio_screenshots/08_user_login.png) | ![파트너 로그인](portfolio_screenshots/17_partner_login.png) | ![관리자 로그인](portfolio_screenshots/28_manager_login.png) |

<br/>

### 홈 & 캠페인 목록 (5가지 유형)

| 홈 | 배송형 캠페인 목록 | 캠페인 상세 |
|:---:|:---:|:---:|
| ![홈](portfolio_screenshots/01_home.png) | ![배송형](portfolio_screenshots/02_delivery_list.png) | ![상세](portfolio_screenshots/03_delivery_detail.png) |

| 방문형 | 구매평형 | 기자단 | 미션형 |
|:---:|:---:|:---:|:---:|
| ![방문형](portfolio_screenshots/04_visit_list.png) | ![구매평](portfolio_screenshots/05_review_list.png) | ![기자단](portfolio_screenshots/06_reporter_list.png) | ![미션형](portfolio_screenshots/07_mission_list.png) |

| 캠페인 필터 모달 | 캠페인 신청 모달 |
|:---:|:---:|
| ![필터](portfolio_screenshots/35_campaign_filter.png) | ![신청모달](portfolio_screenshots/34_delivery_apply_modal.png) |

<br/>

### 리뷰어 — 캠페인 관리

| 전체 | 신청 완료 | 선정 완료 | 리뷰 완료 | 취소 |
|:---:|:---:|:---:|:---:|:---:|
| ![전체](portfolio_screenshots/09_user_campaign_all.png) | ![신청](portfolio_screenshots/10_user_campaign_applied.png) | ![선정](portfolio_screenshots/11_user_campaign_selected.png) | ![완료](portfolio_screenshots/12_user_campaign_completed.png) | ![취소](portfolio_screenshots/13_user_campaign_cancelled.png) |

| 포인트 내역 | 마이페이지 | 정보 수정 |
|:---:|:---:|:---:|
| ![포인트](portfolio_screenshots/14_user_point.png) | ![마이페이지](portfolio_screenshots/15_user_mypage_profile.png) | ![정보수정](portfolio_screenshots/16_user_mypage_edit.png) |

<br/>

### 파트너 — 캠페인 운영

| 홈 대시보드 | 캠페인 관리 | 진행 중 | 완료 |
|:---:|:---:|:---:|:---:|
| ![파트너홈](portfolio_screenshots/18_partner_home.png) | ![캠페인관리](portfolio_screenshots/19_partner_cm.png) | ![진행중](portfolio_screenshots/22_partner_cm_progress.png) | ![완료](portfolio_screenshots/23_partner_cm_completed.png) |

| 지원자 관리 | 콘텐츠 관리 | 포인트 내역 | 마이페이지 |
|:---:|:---:|:---:|:---:|
| ![지원자](portfolio_screenshots/24_partner_application.png) | ![콘텐츠](portfolio_screenshots/25_partner_contents.png) | ![포인트](portfolio_screenshots/26_partner_point.png) | ![마이페이지](portfolio_screenshots/27_partner_mypage.png) |

<br/>

### 관리자 (GA) — 운영 관리

| 대시보드 | 캠페인 진행 현황 | 리뷰어 회원 | 파트너 회원 |
|:---:|:---:|:---:|:---:|
| ![대시보드](portfolio_screenshots/29_manager_home.png) | ![캠페인](portfolio_screenshots/30_manager_campaigns.png) | ![리뷰어](portfolio_screenshots/31_manager_reviewers.png) | ![파트너](portfolio_screenshots/32_manager_partners.png) |

<br/>

---

## 🚀 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 + Mock API 서버 동시 실행
npm run dev

# → Next.js 앱: http://localhost:3002
# → Mock API:   http://localhost:3001
```

### 테스트 계정

| 역할 | 이메일 | 비밀번호 |
|:---|:---|:---|
| 파트너 | `test@test.com` | `cjdaud1!` |
| 관리자 GA | `manager_ga@test.com` | `cjdaud1!` |

> 리뷰어(유저) 로그인은 Naver OAuth를 사용합니다.

<br/>

---

<div align="center">

**프론트엔드 전 영역 1인 개발 · 2024 – 2025**

</div>
