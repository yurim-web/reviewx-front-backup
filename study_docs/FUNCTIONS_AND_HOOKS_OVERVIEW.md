# ReviewX Web - 함수 & 훅 개요 정리

> 이 문서는 프로젝트 전반에서 사용하는 **주요 커스텀 훅 / 유틸 함수**를 한 번에 이해할 수 있도록 정리한 가이드입니다. (React 기본 훅, Next 기본 함수 등은 제외)

---

## 1. 공통 커스텀 훅 모음 (`src/hooks`)

### 1-1. `usePhoneVerification` (휴대폰 인증 공통 훅)

- **파일 위치**: `src/hooks/common/signup/usePhoneVerification.ts`
- **역할**: 회원가입에서 사용하는 휴대폰 번호 + 인증번호 입력과 타이머를 한 번에 관리
- **주요 상태**
  - `phone`: 입력된 휴대폰 번호
  - `verificationCode`: 입력된 인증번호
  - `isVerificationRequested`: 인증번호 요청 여부
  - `isPhoneVerified`: 인증 성공 여부
  - `timer`: 남은 시간(초)
- **주요 메서드**
  - `handleVerificationRequest()`: 휴대폰 번호 형식 검사 후 인증번호 요청, 타이머 240초 시작
  - `handleVerify()`: 인증번호 형식 + 테스트코드 일치 여부 검사 후 성공 시 `isPhoneVerified`를 `true`로 설정
  - `resetVerification()`: 위의 모든 상태를 초기화 (휴대폰 번호 변경 시 사용)
- **연관 유틸/데이터**
  - `@/utils/signup/validation` → `validatePhone`, `validateVerificationCode`
  - `@/data/signup/testVerificationData` → 테스트용 인증번호 검사
- **사용 위치 (예시)**
  - `src/app/user/signup/page.tsx` (사용자 회원가입)
  - `src/app/partner/signup/page.tsx` (파트너 회원가입)

### 1-2. `useCampaignFilters` (캠페인 리스트 필터/정렬 훅)

- **파일 위치**: `src/hooks/common/campaign/useCampaignFilters.ts`
- **역할**: 캠페인 리스트 페이지에서 카테고리/채널/지역/마감임박/정렬 상태를 하나의 훅으로 관리
- **입력 파라미터**
  - `campaigns`: 필터링/정렬 대상 캠페인 배열
  - `enableRegionFilter`: 방문형 캠페인처럼 지역 필터가 필요한 경우 `true`
- **반환 값**
  - `activeFilters`: 현재 선택된 필터 상태 (`channels`, `categories`, `regions?`, `sort`)
  - `closingSoon`: 마감임박 필터 여부
  - `handleFilterChange(filters)`: 필터 값 변경 핸들러
  - `setClosingSoon()`: 마감임박 토글 함수
  - `filteredAndSortedCampaigns`: 최종 필터+정렬이 적용된 캠페인 목록
- **사용 위치 (예시)**
  - `src/app/campaign/delivery/page.tsx`
  - `src/app/campaign/mission/page.tsx`
  - `src/app/campaign/reporter/page.tsx`
  - `src/app/campaign/review/page.tsx`
  - `src/app/campaign/visit/page.tsx`

### 1-3. `useCampaignDetailScroll` (캠페인 상세 헤더 고정 스크롤 훅)

- **파일 위치**: `src/hooks/common/campaign/useCampaignDetailScroll.ts`
- **역할**: 캠페인 상세 페이지에서 상단 정보 라벨이 스크롤에 따라 상단에 고정되도록 관리
- **반환 값**
  - `isCampaignInfoFixed`: 라벨이 고정 상태인지 여부
  - `campaignInfoLabelRef`: 라벨 DOM을 참조하는 `ref`
- **내부 동작 요약**
  - 최초 마운트 시 라벨의 Y 위치를 기억
  - 스크롤 이벤트에서 현재 스크롤 위치가 특정 지점을 넘으면 `isCampaignInfoFixed`를 `true`로 변경
- **사용 위치 (예시)**
  - `src/app/campaign/delivery/[id]/page.tsx` 등 캠페인 상세 페이지 전반

### 1-4. `useCampaignFilterBar` (캠페인 관리 상단 필터바 상태 훅)

- **파일 위치**: `src/hooks/common/campaign_management/useCampaignFilterBar.ts`
- **역할**: 공통 캠페인 관리 필터 바(`CampaignFilterBar`)의 모달 열림/닫힘, 타입·채널·정렬·검색 상태를 관리
- **주요 개념**
  - `state`와 `actions`를 분리해서 반환
  - 실제 캠페인 필터링은 `campaign_filter_helpers`에 위임하고, 훅은 상태/이벤트만 담당
- **주요 반환 값**
  - `state`
    - `isTypeModalOpen`, `isChannelModalOpen`, `isSortModalOpen`
    - `tempTypes`, `tempChannels`, `tempSort`
    - `selectedSort`, `searchQuery`, `currentFilters`
  - `actions`
    - 모달 열기/닫기: `openTypeModal`, `closeTypeModal` 등
    - 필터 적용/초기화: `handleTypeApply`, `handleChannelApply`, `handleTypeReset`, `handleChannelReset`
    - 정렬/검색: `handleSortToggle`, `handleSortReset`, `handleSearchChange`
    - 선택 제거: `handleTypeRemove`, `handleChannelRemove`
- **연관 유틸**
  - `@/components/common/campaign_management/utils/campaign_filter_helpers`
- **사용 위치**
  - `src/components/common/campaign_management/CampaignFilterBar.tsx`
  - (user/partner 캠페인 관리 페이지에서 공통으로 사용)

### 1-5. `useTimer` (공통 타이머 훅 — 현재 미사용)

- **파일 위치**: `src/hooks/common/useTimer.ts`
- **역할**: 초 단위 카운트다운 타이머를 관리하는 공통 훅 (인증 타이머 등 재사용용)
- **반환 값**
  - `timer`: 남은 시간(초)
  - `setTimer(seconds)`: 타이머 시작/변경 함수
- **특이 사항**
  - 현재 주석에도 "사용되지 않음"으로 표기되어 있으며, 추후 공통타이머가 필요할 때 활용 가능

### 1-6. `useTableSort` (테이블 정렬 훅)

- **파일 위치**: `src/hooks/table/useTableSort.ts`
- **역할**: 관리자 화면의 테이블에서 정렬 상태와 정렬된 데이터를 공통으로 관리
- **입력 옵션**
  - `data`: 정렬 대상 배열
  - `initial_column_key`: 기본 정렬 컬럼 키
  - `initial_direction`: 기본 정렬 방향 (`"asc"` / `"desc"`)
  - `column_config`: 각 컬럼의 타입 설정 (숫자, 문자열 등)
- **반환 값**
  - `sort_state`: 현재 정렬 컬럼과 방향
  - `handle_sort(column_key)`: 헤더 클릭 시 호출할 정렬 토글 함수
  - `sorted_data`: 정렬된 결과 데이터
- **연관 유틸**
  - `@/utils/table/sort` → `sort_table_data`, `create_sort_handler` 등
- **사용 위치 (예시)**
  - `src/components/manager/common/campaign/progress/table/CampaignTable.tsx`
  - `src/components/manager/ga/campaign/rejected/section/RejectedCampaignTable.tsx`

### 1-7. `useTermsAgreement` (사용자 회원가입 약관 동의 훅)

- **파일 위치**: `src/hooks/user/signup/useTermsAgreement.ts`
- **역할**: 회원가입 약관 동의(전체 동의 + 필수/선택 약관들)의 체크 상태를 일관성 있게 유지
- **주요 상태**
  - `allAgreed`: 전체 동의 여부
  - `termsAgreed`, `privacyAgreed`, `marketingAgreed`: 개별 약관 동의 여부
- **핵심 로직**
  - 전체 동의 체크 시: 하위 모든 약관 체크/해제
  - 개별 약관 변경 시: 모두 체크되어 있으면 `allAgreed = true`, 하나라도 풀리면 `false`
- **사용 위치 (예시)**
  - `src/app/user/signup/page.tsx`

### 1-8. `usePartnerTermsAgreement` (파트너 회원가입 약관 동의 훅)

- **파일 위치**: `src/hooks/partner/signup/usePartnerTermsAgreement.ts`
- **역할**: 파트너 회원가입에서 더 많은 약관(서비스, 제3자 제공, 광고, 마케팅, 제3자 마케팅 등)을 관리
- **주요 상태**
  - `allAgreed`: 전체 동의 여부
  - `serviceTermsAgreed`, `privacyAgreed`, `thirdPartyAgreed`, `advertisingAgreed`, `marketingAgreed`, `thirdPartyMarketingAgreed`
- **로직 구조**: `useTermsAgreement`와 비슷하지만, 관리하는 체크박스 종류만 다름
- **사용 위치 (예시)**
  - `src/app/partner/signup/page.tsx`

### 1-9. `useCampaignCard` (파트너 캠페인 카드 전용 훅)

- **파일 위치**: `src/hooks/partner/campaign_management/useCampaignCard.ts`
- **역할**: 파트너 캠페인 관리 화면에서 **캠페인 카드 한 장**이 보여줄 파생 정보와 모달 상태를 모두 관리
- **state** (주요 반환 값 일부)
  - `campaignStatus`, `campaignSubStatus`
  - `reviewingCount`, `completedCount`, `isContentStage`
  - `primaryButtonText`, `statusDescription`
  - `isReceiptModalOpen`, `isManagementModalOpen`, `isDeleteModalOpen`
- **actions**
  - `openReceiptModal`, `closeReceiptModal`
  - `openManagementModal`, `closeManagementModal`
  - `openDeleteModal`, `closeDeleteModal`
  - `handleButtonClick(buttonText)`: 버튼 텍스트별로 영수증 등록 / 캠페인 관리 / 삭제 / 수정 / 신청내역 확인 등으로 라우팅
- **연관 유틸**
  - `@/components/partner/campaign_management/utils/campaign_card_helpers`
- **사용 위치**
  - `src/components/partner/campaign_management/CampaignCard.tsx`

### 1-10. `useCampaignProgressDetail` (매니저 캠페인 진행현황 상세 공통 훅)

- **파일 위치**: `src/hooks/manager/common/campaign/useCampaignProgressDetail.ts`
- **역할**: GA/SA 관리자 캠페인 진행현황 상세 페이지(배송/미션/기자단/구매평/방문 공통)의 상태와 로직을 통합 관리
- **상태**
  - `campaign_data`: 신청자/선정자 데이터를 포함한 캠페인 전체 정보
  - `is_loading`, `error_message`
  - `active_tab`: `"applicants"`(신청) / `"selected"`(선정)
  - `sort_order`, `sort_options`
  - `applicants_state`, `selected_state` + 각 카운트
  - `current_applicants`: 현재 탭에 보여줄 목록
- **핸들러**
  - `set_active_tab(tab)`
  - `set_sort_order(order)`
  - `handle_select_applicant(id)`: 신청 → 선정 이동
  - `handle_cancel_applicant(id)`: 선정 → 신청 이동
  - `handle_download_applicants`, `handle_download_selected`: 추후 엑셀 다운로드 구현용 자리
- **연관 데이터**
  - `@/data/partner/sharedCampaigns` → `getCampaignById`, `CampaignWithApplicants`, `AllApplicant`
- **사용 위치 (예시)**
  - `src/app/manager_ga/campaign/progress/*/[id]/page.tsx`
  - `src/app/manager_sa/campaign/progress/*/[id]/page.tsx`

---

## 2. 주요 유틸 함수 모음 (`src/utils`, `src/components/**/utils` 등)

> 이 섹션은 "로직은 많지만 컴포넌트는 가벼워야 하는" 부분에서 자주 사용하는 헬퍼/유틸 모듈을 모아 설명합니다.

### 2-1. 테이블 정렬 유틸 (`@/utils/table/sort`)

- **파일 위치**: `src/utils/table/sort.ts`
- **역할**: `useTableSort` 훅과 함께 사용되는 테이블 정렬 전용 함수 모음
- **핵심 개념**
  - `SortState`, `SortDirection`, `SortColumnConfig` 타입 정의
  - `sort_table_data(data, sort_state, column_config)`
    - 컬럼 타입(숫자/문자열/날짜 등)에 맞게 데이터를 정렬
  - `create_sort_handler(set_sort_state)`
    - 현재 정렬 상태를 보고, 같은 컬럼 클릭 시 `asc ↔ desc` 토글

### 2-2. 회원가입 유효성 검사 (`@/utils/signup/validation`)

- **파일 위치**: `src/utils/signup/validation.ts`
- **역할**: 회원가입 폼에서 공통으로 사용하는 입력값 검증
- **주요 함수 (예시)**
  - `validatePhone(phone)`: 휴대폰 번호 형식 검사
  - `validateVerificationCode(code)`: 6자리 숫자 코드 검사
  - (기타 이름/이메일/비밀번호 등 검증 로직 포함)
- **사용 위치 예시**
  - `usePhoneVerification` 훅
  - 사용자/파트너 회원가입 페이지의 폼 유효성 검사

### 2-3. 회원가입 타이머 유틸 (`@/utils/signup/timerUtils`)

- **파일 위치**: `src/utils/signup/timerUtils.ts`
- **역할**: 인증번호 타이머와 같이 "남은 시간 표시"에 특화된 숫자 포맷/계산 헬퍼

### 2-4. 전화번호/사업자번호 유틸

- **사용자/파트너 회원가입 관련**
  - `src/utils/signup/phoneUtils.ts`: 휴대폰 번호 포맷/마스킹 등
  - `src/components/partner/signup/utils/businessNumberUtils.ts`: 사업자등록번호 포맷/검증 헬퍼

### 2-5. 캠페인 필터/카드/정보 유틸

- **캠페인 관리 필터**
  - `src/components/common/campaign_management/utils/campaign_filter_helpers.ts`
    - `filterCampaigns`, `getItemKey` 등
    - `useCampaignFilterBar`가 내부에서 사용하는 실제 필터링 로직
- **파트너 캠페인 카드**
  - `src/components/partner/campaign_management/utils/campaign_card_helpers.ts`
    - `calculateContentCounts`, `getCampaignTypePath`, `getPrimaryButtonText`, `getStatusTextForCampaign`, `isContentStage` 등
- **캠페인 신청 정보**
  - `src/components/partner/campaign_application/utils/campaign_info_helpers.ts`
    - 신청 상세 화면에서 텍스트/뷰 구성을 돕는 헬퍼

### 2-6. 카드/채널 매핑 유틸

- **파일 위치**
  - `src/utils/cardTypeMapper.ts`: 카드 타입 → UI에서 쓸 이름/색상 등 매핑
  - `src/utils/channelLogoMap.ts`: 채널(인스타그램/블로그 등) → 아이콘 리소스 매핑

### 2-7. 정산/출금 테이블 유틸

- **파일 위치**: `src/utils/settlement/withdrawalTableHelpers.ts`
- **역할**: 정산/출금 내역 테이블에서 금액 포맷, 상태 텍스트, 컬럼 파생데이터 계산 등을 담당

---

## 3. 페이지/폼 전용 로직 (예: 게시글 작성, 회원가입 폼 등)

> 이 영역은 "특정 페이지에서만 쓰이는" 로직이라 훅/유틸로 일부만 분리되어 있고, 나머지는 컴포넌트 안에 그대로 들어가 있습니다. 필요하면 앞으로 이들 중 일부를 별도의 훅으로 추출할 수 있습니다.

### 3-1. 커뮤니티 게시글 작성 폼 (`PostFormPageClient`, `PostEditorField`)

- **파일 위치**
  - `src/components/manager/common/community/posts/form/PostFormPageClient.tsx`
  - `src/components/manager/common/community/posts/form/PostEditorField.tsx`
- **역할 요약**
  - `PostFormPageClient`: 게시글 작성/수정 페이지의 전체 상태와 제출 로직 관리
  - `PostEditorField`: Toast UI Editor와 제목/내용 필드를 연결하는 프레젠테이션 + 일부 상태
- **향후 개선 아이디어**
  - 현재는 컴포넌트 내부에 상태/로직이 섞여 있으므로, 필요한 경우 `usePostForm` 같은 훅으로 분리 가능

### 3-2. 회원가입 폼 (`user_signup`, `partner_signup`)

- **파일 위치 (예시)**
  - `src/app/user/signup/page.tsx`
  - `src/app/partner/signup/page.tsx`
- **연관 훅/유틸**
  - `usePhoneVerification`, `useTermsAgreement`, `usePartnerTermsAgreement`
  - `@/components/user/signup/utils/formValidation`
  - `@/components/partner/signup/utils/formValidation`, `@/components/partner/signup/utils/validation`

---

## 4. 이 문서를 읽는 방법 & 팁

- **훅을 이해하는 순서 추천**
  1. `usePhoneVerification` / `useTermsAgreement` → 회원가입 플로우 이해
  2. `useCampaignFilters` / `useCampaignFilterBar` → 캠페인 목록/관리 페이지 구조 이해
  3. `useTableSort` / `useCampaignProgressDetail` → 관리자 테이블/상세 화면 흐름 이해
  4. `useCampaignCard` → 파트너 캠페인 관리 카드 단위 로직 이해
- **"이 훅이 어디서 쓰이지?"가 궁금할 때**
  - VSCode/Cursor에서 훅 이름에 커서를 두고 `Go to References` 또는 프로젝트 전체 검색으로 사용처를 바로 찾을 수 있습니다.

> 앞으로 새 훅이나 유틸을 만들 때, 이 문서에 같은 형식으로 섹션을 하나씩 추가하면, "나중에 봐도 이해할 수 있는" 프로젝트 지도가 계속 유지됩니다.
