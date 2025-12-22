## ReviewX Web 학습 계획표

> 이 문서는 이 프로젝트를 처음부터 다시 이해하기 위한 **학습 순서 & 체크리스트**입니다.
> 하루에 다 끝내려고 하지 말고, **"문서 1개 + 코드 1~2개"** 정도만 보는 걸 목표로 하면 좋습니다.

---

## 전체 로드맵 개요

- **1단계: 지도 파악하기 (개요 읽기)**
  - `FUNCTIONS_AND_HOOKS_OVERVIEW.md`
- **2단계: 회원가입 플로우 이해**
  - `user_signup_flow.mdx` + 관련 코드들
- **3단계: 게시글 작성/수정 플로우 이해**
  - `post_form_flow.mdx` + 관련 코드들
- **4단계: 캠페인 관리(리스트/카드/진행현황) 이해**
  - `campaign_management_flow.mdx` + 관련 코드들
- **5단계: 실전 연습 (작게 수정해보기)**
  - 버튼 조건/문구/정렬 옵션 등 직접 변경해 보기

---

## 1주차 학습 계획 (기본 구조 이해)

### Day 1 — 전체 훅/유틸 지도 파악

- **읽기**
  - `docs/FUNCTIONS_AND_HOOKS_OVERVIEW.md`
- **코드 같이 열어보기 (이름만 훑어보기)**
  - `src/hooks/common/signup/usePhoneVerification.ts`
  - `src/hooks/user/signup/useTermsAgreement.ts`
  - `src/hooks/common/campaign/useCampaignFilters.ts`
  - `src/hooks/common/campaign_management/useCampaignFilterBar.ts`
  - `src/hooks/table/useTableSort.ts`
  - `src/hooks/partner/campaign_management/useCampaignCard.ts`
  - `src/hooks/manager/common/campaign/useCampaignProgressDetail.ts`
- **목표**
  - “아, 이 프로젝트에는 이런 이름의 훅/유틸들이 있구나” 정도만 감 잡기 (내용 완전 이해 X)

---

### Day 2 — 회원가입 플로우 (1): 전체 흐름 잡기

- **읽기**
  - `docs/user_signup_flow.mdx` (처음부터 끝까지 1회)
- **코드 같이 보기**
  - `src/app/user/signup/page.tsx`
- **집중 포인트**
  - `UserSignupPage`에서 `useTermsAgreement`, `usePhoneVerification`을 어떻게 불러오는지
  - `handleSubmit`, `handleVerifyClick`, `handleVerificationRequestClick` 같은 **핸들러 함수 위치** 찾기
- **작은 연습**
  - `handleSubmit` 안에 `console.log("회원가입 폼 제출", { email, name, phone })` 한 줄 추가해 보고, 브라우저 콘솔에서 찍히는지 확인

---

### Day 3 — 회원가입 플로우 (2): 휴대폰 인증 훅/컴포넌트

- **다시 읽기**
  - `docs/user_signup_flow.mdx`의 **3번 섹션 (휴대폰 인증 흐름)** 부분만 다시 읽기
- **코드 같이 보기**
  - `src/components/common/signup/PhoneVerification.tsx`
  - `src/hooks/common/signup/usePhoneVerification.ts`
  - `src/data/signup/testVerificationData.ts`
- **집중 포인트**
  - `PhoneVerification`이 받는 props가 `UserSignupPage`에서 어떻게 넘어오는지
  - `usePhoneVerification`이 **어떤 state를 만들고 무엇을 return 하는지**
  - `checkTestVerificationCode`, `checkTestPhoneNumber`가 언제/어디서 호출되는지
- **작은 연습**
  - `PhoneVerification`에서 에러 문구 하나만 살짝 바꿔 보기
    - 예: "인증번호 6자리를 입력해주세요." → "인증번호 6자리 꼭 입력해주세요!"

---

### Day 4 — 회원가입 플로우 (3): 약관 동의 훅

- **읽기**
  - `docs/user_signup_flow.mdx`의 **2번 섹션 (약관 동의 흐름)** 부분
- **코드 같이 보기**
  - `src/hooks/user/signup/useTermsAgreement.ts`
  - `src/components/user/signup/TermsAgreement.tsx`
- **집중 포인트**
  - `allAgreed`와 개별 체크박스(`termsAgreed`, `privacyAgreed`, `marketingAgreed`) 관계
  - `useEffect` 두 개가 각각 어떤 역할을 하는지 (전체 → 개별, 개별 → 전체)
- **작은 연습**
  - 마케팅 동의(`marketingAgreed`)가 체크될 때 `console.log("마케팅 동의 변경", marketingAgreed)` 찍어 보기

---

## 2주차 학습 계획 (페이지/패턴 익히기)

### Day 5 — 게시글 작성/수정 플로우 (1): 상위 폼 컴포넌트

- **읽기**
  - `docs/post_form_flow.mdx` (섹션 1, 2 중심)
- **코드 같이 보기**
  - `src/app/manager_ga/community/posts/create/page.tsx`
  - `src/components/manager/common/community/posts/form/PostFormPageClient.tsx`
- **집중 포인트**
  - 서버 컴포넌트(`CreatePostPage`)가 `PostFormPageClient`에게 `mode="create"`만 넘기는 구조
  - `PostFormPageClient`가 가진 상태들: `category_type`, `category`, `target`, `title`
- **작은 연습**
  - `PostFormPageClient`에서 페이지 제목(`page_title`)을 콘솔에 찍어 보기

---

### Day 6 — 게시글 작성/수정 플로우 (2): Toast Editor 래퍼

- **읽기**
  - `docs/post_form_flow.mdx`의 **3번 섹션 (PostEditorField)**
- **코드 같이 보기**
  - `src/components/manager/common/community/posts/form/PostEditorField.tsx`
- **집중 포인트**
  - `dynamic(import("@toast-ui/react-editor"))` 부분
  - `is_mounted`, `is_editor_ready`, `is_editor_unlocked` 상태가 각각 언제 true/false가 되는지
  - `editor_instance_ref.current`에 Editor 인스턴스를 어떻게 저장하는지
- **작은 연습**
  - Editor 높이를 `340px` → `400px`로 바꿔 보고 UI가 어떻게 변하는지 확인

---

### Day 7 — 캠페인 관리 플로우 (1): 필터바

- **읽기**
  - `docs/campaign_management_flow.mdx`의 **1번 섹션 (캠페인 필터 바)**
- **코드 같이 보기**
  - `src/components/common/campaign_management/CampaignFilterBar.tsx`
  - `src/hooks/common/campaign_management/useCampaignFilterBar.ts`
- **집중 포인트**
  - `CampaignFilterBar`가 `useCampaignFilterBar`로부터 `state`, `actions`를 어떻게 구조분해 해서 쓰는지
  - `filterCampaigns`가 필터/검색/정렬을 모두 한 번에 맡고 있다는 점
- **작은 연습**
  - 검색 input placeholder를 "검색" → "캠페인 검색"으로 바꿔 보기

---

### Day 8 — 캠페인 관리 플로우 (2): 파트너 캠페인 카드

- **읽기**
  - `docs/campaign_management_flow.mdx`의 **2번 섹션 (파트너 캠페인 카드)**
- **코드 같이 보기**
  - `src/components/partner/campaign_management/CampaignCard.tsx`
  - `src/hooks/partner/campaign_management/useCampaignCard.ts`
- **집중 포인트**
  - `CampaignCard`가 `useCampaignCard`에서 어떤 `state`/`actions`를 받는지
  - `campaignSubStatus`, `isContentStage`, `primaryButtonText`에 따른 버튼 분기
- **작은 연습**
  - `useCampaignCard`의 `handleButtonClick`에서 `console.log(buttonText)` 한 줄 넣고, 각 버튼을 눌러보며 어떤 텍스트가 오는지 확인

---

### Day 9 — 캠페인 관리 플로우 (3): 진행현황 상세 훅

- **읽기**
  - `docs/campaign_management_flow.mdx`의 **3번 섹션 (진행현황 상세)**
- **코드 같이 보기**
  - `src/hooks/manager/common/campaign/useCampaignProgressDetail.ts`
- **집중 포인트**
  - `campaign_data`, `applicants_state`, `selected_state`의 관계
  - `handle_select_applicant`, `handle_cancel_applicant`가 어떻게 배열을 이동시키는지
- **작은 연습**
  - `handle_select_applicant` 안에 `console.log("선정", applicant_id)` 추가해서 동작 흐름 확인

---

## 3주차 이후 — 복습 + 스스로 해보기

### Day 10 이후 — 스스로 튜토리얼 만들어 보기

- **1단계**: 아직 헷갈리는 페이지 하나 선택 (예: 계정 찾기, 유저 마이페이지 등)
- **2단계**: 그 페이지의 파일들을 열고, 지금까지 만든 MDX 문서 스타일을 따라
  - "어디서 어떤 훅을 쓰는지"
  - "주요 이벤트 핸들러는 무엇인지"
  - "데이터가 어떻게 이동하는지"
    텍스트로 간단히 적어보기 (처음에는 개인 메모 수준이면 충분)
- **3단계**: 필요하면 나에게 다시 요청해서, 그 페이지 기준으로 **정식 `*_flow.mdx`** 문서로 같이 정리

---

## 사용 팁

- 하루에 너무 많이 보려고 하지 말고, **한 문서 + 한두 개 코드 파일**에만 집중하세요.
- 코드를 볼 때는 항상 아래 순서로 보면 좋습니다.
  1. **import에서 `use...` 훅들만 먼저 눈으로 찾기**
  2. 그 훅이 `return` 하는 값/함수를 JSX에서 어디에 쓰는지 찾기
  3. 마지막으로, 그 훅의 구현 파일을 열고 내부 로직을 읽어보기
- 막히는 부분이 생기면,
  - "어떤 파일이 헷갈리는지" + "어떤 함수/훅이 이해 안 되는지"를 적어서 질문해 주세요.
  - 그 부분을 기준으로 새로운 튜토리얼 문서를 더 만들어서 이어갈 수 있습니다.
