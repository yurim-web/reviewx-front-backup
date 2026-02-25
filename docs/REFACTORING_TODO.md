# 리팩토링 TODO 리스트

> 분석일: 2026-02-24
> 브랜치: `feature/frontend-refactor`
> 범위: `src/components/user`, `src/components/partner`, `src/components/common`, `src/utils/partner`

---

## 🔴 즉시 수정 (TypeScript 오류 - 빌드/런타임 영향)

### TS-1. `campaignToFormData.ts` 타입 오류 (~40개)
- **파일**: `src/utils/partner/campaignEdit/campaignToFormData.ts`
- **문제**: `{}` 타입 남발 → `string`, `boolean`, `string[]` 등에 할당 불가
- **수정**: 각 변수에 정확한 타입 명시, 타입 가드 추가

### TS-2. `StoredCampaignRaw` 누락 속성 (~20개)
- **파일**: `src/app/partner/campaign/edit/mission/[id]/page.tsx` 외 4개
- **문제**: `contentType`, `isUrgent`, `registeredAt`, `guidelines`, `productLink`, `keywords`, `minTextLength`, `minImageCount`, `videoCount`, `videoDuration`, `requireLinkAttachment`, `requireKeywordAttachment`, `contactPhone` 등 속성 없음
- **수정**: `StoredCampaignRaw` 타입 정의에 누락 필드 추가

### TS-3. 함수 시그니처 불일치 (5개)
- **파일**:
  - `src/app/partner/campaign_application/delivery/[id]/page.tsx:26`
  - `src/app/partner/campaign_application/mission/[id]/page.tsx:26`
  - `src/app/partner/campaign_application/reporter/[id]/page.tsx:26`
  - `src/app/partner/campaign_application/review/[id]/page.tsx:26`
  - `src/app/partner/campaign_application/visit/[id]/page.tsx:26`
- **문제**: `(applicantId: string) => void` ≠ `(applicant: AllApplicant) => void`
- **수정**: 함수 파라미터 타입을 `AllApplicant`로 통일

### TS-4. `useParams` 잘못된 import (2개)
- **파일**:
  - `src/app/partner/campaign_contents/mission/[id]/page.tsx:16`
  - `src/app/partner/campaign_contents/review/[id]/page.tsx:16`
- **문제**: `import { useParams } from 'react'` → React에는 없음
- **수정**: `import { useParams } from 'next/navigation'`으로 변경

### TS-5. 날짜 포맷 함수 시그니처 불일치 (5개)
- **파일**:
  - `src/app/partner/campaign_contents/delivery/[id]/page.tsx:88`
  - `src/app/partner/campaign_contents/mission/[id]/page.tsx:80`
  - `src/app/partner/campaign_contents/reporter/[id]/page.tsx:89`
  - `src/app/partner/campaign_contents/review/[id]/page.tsx:175`
  - `src/app/partner/campaign_contents/visit/[id]/page.tsx:89`
- **문제**: `(iso: string) => string` ≠ `(date: string | Date) => string`
- **수정**: 함수 시그니처를 `(date: string | Date) => string`으로 통일

### TS-6. `isEmpty` 중복 export
- **파일**: `src/utils/helpers/index.ts:14`
- **문제**: `'./string'` 모듈에서 `isEmpty` 중복 export
- **수정**: 명시적 re-export 또는 한쪽 제거

### TS-7. `RefObject` 타입 불일치
- **파일**: `src/app/partner/point/charge/page.tsx:342,347`
- **문제**: `RefObject<HTMLDivElement | null>` ≠ `RefObject<HTMLElement>`
- **수정**: ref 타입을 `RefObject<HTMLElement>` 또는 사용 컴포넌트 props 타입 수정

---

## 🟡 단기 수정 (중복 제거 / 통합)

### DUP-1. AddressInput 중복
- **중복 파일**:
  - `src/components/common/mypage/AddressInput.tsx` (171줄) - 공통용
  - `src/components/partner/signup/AddressInput.tsx` (107줄) - signup 전용 미니버전
- **수정**: `partner/signup/AddressInput.tsx` 삭제 후 common 버전 사용 (props로 variant 구분)

### DUP-2. TermsViewModal 중복
- **중복 파일**:
  - `src/components/user/signup/TermsViewModal.tsx` (125줄) - 3가지 타입
  - `src/components/partner/signup/PartnerTermsViewModal.tsx` (209줄) - 6가지 타입
- **수정**: `common/signup/TermsViewModal.tsx`로 통합, props로 약관 타입 목록 주입

### DUP-3. formValidation 중복
- **중복 파일**:
  - `src/components/user/signup/utils/formValidation.ts` (67줄)
  - `src/components/partner/signup/utils/formValidation.ts` (171줄)
- **수정**: 공통 검증 로직(`이메일`, `이름`, `휴대폰`)을 `src/utils/validation/signup.ts`로 추출

### DUP-4. ReceiptRegistrationModal 중복
- **중복 파일**:
  - `src/components/user/campaign_management/modals/ReceiptRegistrationModal.tsx` (537줄)
  - `src/components/partner/campaign_contents/ReceiptRegistrationModal.tsx` (234줄)
- **수정**: 공유 로직(이미지 업로드, 검수 실패 메시지) 공통 훅/컴포넌트로 추출

### DUP-5. `businessNumberUtils.ts` 중복
- **중복 파일**:
  - `src/components/partner/signup/utils/businessNumberUtils.ts`
  - `src/utils/formatting/businessNumber.ts` (이미 존재)
- **수정**: `partner/signup/utils/businessNumberUtils.ts` 삭제 후 공통 유틸 사용

---

## 🟡 단기 수정 (파일 위치 / 이름)

### NAME-1. 타입 파일 PascalCase 문제
| 현재 | 변경 |
|------|------|
| `partner/campaign_contents/card_type/shared_card/CampaignTypes.ts` | `campaignTypes.ts` |
| `partner/campaign_contents/card_type/experience_card/ExperienceTypes.ts` | `experienceTypes.ts` |

### NAME-2. Generic 파일명
| 현재 | 변경 |
|------|------|
| `src/data/campaign/delivery/utils.ts` | `deliveryUtils.ts` |
| `partner/campaign_create_form/common/constants/constants.ts` | `campaignFormConstants.ts` |

### LOC-1. 파일 위치 이동 필요
| 파일 | 현재 위치 | 이동 대상 |
|------|---------|---------|
| `partner/signup/utils/formValidation.ts` | components 내부 | `src/utils/validation/partnerSignup.ts` |
| `partner/signup/utils/businessNumberUtils.ts` | components 내부 | 삭제 (공통 유틸 사용) |
| `partner/signup/BusinessNumberInput.tsx` | partner/signup | `common/signup/` |
| `partner/signup/ContactPhoneInput.tsx` | partner/signup | `common/signup/` |

---

## 🟢 장기 개선 (구조 개선)

### LONG-1. 500줄 이상 파일 분할

| 파일 | 줄수 | 분할 방향 |
|------|------|---------|
| `common/date_range_picker/RangeCalendar.tsx` | 1218 | 날짜 계산 로직 → 훅으로 분리 |
| `user/campaign_detail/modal/ApplicationModal.tsx` | 1208 | 섹션별 서브컴포넌트 분리 |
| `common/date_range_picker/SingleCalendar.tsx` | 779 | 동일 |
| `partner/campaign_application/utils/campaign_info_helpers.ts` | 648 | 도메인별 파일 분리 |
| `partner/campaign_create_form/VisitCampaignForm.tsx` | 664 | 섹션 컴포넌트 분리 |
| `partner/point/PartnerPointPageLayout.tsx` | 609 | 탭별 서브컴포넌트 분리 |
| `partner/campaign_create_form/ReviewCampaignForm.tsx` | 585 | 섹션 컴포넌트 분리 |
| `partner/campaign_create_form/MissionCampaignForm.tsx` | 573 | 섹션 컴포넌트 분리 |
| `common/phone_verification/PhoneVerification.tsx` | 564 | 타이머/검증 로직 → 훅으로 분리 |
| `partner/campaign_management/utils/campaign_card_helpers.ts` | 544 | 도메인별 파일 분리 |
| `partner/campaign_contents/.../CampaignPendingCard.tsx` | 543 | 하단 참고 |
| `partner/campaign_create_form/ReporterCampaignForm.tsx` | 539 | 섹션 컴포넌트 분리 |
| `user/campaign_management/modals/ReceiptRegistrationModal.tsx` | 537 | DUP-4 해결 시 같이 해결 |
| `partner/campaign_create_form/DeliveryCampaignForm.tsx` | 537 | 섹션 컴포넌트 분리 |
| `partner/campaign_management/CampaignCard.tsx` | 536 | 상태별 서브카드 분리 |
| `partner/campaign_contents/.../CampaignInspectionCard.tsx` | 525 | 하단 참고 |
| `partner/campaign_contents/CampaignContentsLayout.tsx` | 507 | 섹션별 서브컴포넌트 분리 |

### LONG-2. 캠페인 카드 Base 컴포넌트화

현재 상태: 카드타입(배송/방문/구매/기자단/미션/경험) × 상태(Pending/Inspection/Completed) = 15개+ 파일, 6000+줄

```
card_type/
  shared_card/
    CampaignPendingCard.tsx     (543줄)
    CampaignInspectionCard.tsx  (525줄)
    CampaignCompletedCard.tsx   (516줄)
  mission_card/
    MissionPendingCard.tsx      (540줄)
    MissionInspectionCard.tsx   (433줄)
    MissionCompletedCard.tsx
  experience_card/
    ExperiencePendingCard.tsx   (595줄)
    ExperienceInspectionCard.tsx(410줄)
  purchase_card/
    purchase_first_card/        (361+354줄)
    purchase_second_card/       (493+364줄)
```

- **수정 방향**: `BaseCampaignCard` + 상태별 props 패턴으로 통합

### LONG-3. DetailGuidelines 섹션 통합

현재: 6개 파일 (~1000줄)
```
guidelines/
  DetailGuidelinesSection.tsx         (368줄) - 기본
  DetailGuidelinesSectionDelivery.tsx (153줄)
  DetailGuidelinesSectionVisit.tsx    (187줄)
  DetailGuidelinesSectionReview.tsx   (128줄)
  DetailGuidelinesSectionReporter.tsx (119줄)
  DetailGuidelinesSectionMission.tsx  (119줄)
```

- **수정 방향**: `DetailGuidelinesSection.tsx` 1개에 `campaignType` prop으로 조건 처리

### LONG-4. 폴더 중첩 깊이 완화

문제 경로 (7단계):
```
src/components/partner/campaign_contents/card_type/purchase_card/purchase_second_card/PurchaseSecondPendingCard.tsx
src/components/manager/common/campaign/progress/filter/CampaignProgressStatusFilter.tsx
```
- **수정 방향**: `purchase_card/` 아래로 직접 flat하게 이동 검토

---

## ESLint 현황

| 범위 | errors | warnings |
|------|--------|----------|
| user/partner/common (리팩토링 완료 범위) | **0** | 340 |
| manager/data/app 등 미접촉 영역 | ~522 | - |

> warnings 340개는 주로 미사용 변수, `any` 잔존 등 → 필요시 개별 확인

---

## 체크리스트

### 🔴 즉시 (TypeScript 오류)
- [ ] TS-1. `campaignToFormData.ts` `{}` 타입 수정
- [ ] TS-2. `StoredCampaignRaw` 누락 속성 추가
- [ ] TS-3. 함수 시그니처 불일치 5개 수정
- [ ] TS-4. `useParams` import 경로 수정 2개
- [ ] TS-5. 날짜 포맷 함수 시그니처 통일 5개
- [ ] TS-6. `isEmpty` 중복 export 해결
- [ ] TS-7. `RefObject` 타입 불일치 수정

### 🟡 단기 (중복 제거)
- [ ] DUP-1. AddressInput 중복 제거
- [ ] DUP-2. TermsViewModal 통합
- [ ] DUP-3. formValidation 공통 추출
- [ ] DUP-4. ReceiptRegistrationModal 공통 로직 추출
- [ ] DUP-5. businessNumberUtils 중복 제거

### 🟡 단기 (파일 정리)
- [ ] NAME-1. 타입 파일명 camelCase로 변경
- [ ] NAME-2. Generic 파일명 구체화
- [ ] LOC-1. 파일 위치 이동 4개

### 🟢 장기 (구조 개선)
- [ ] LONG-1. 500줄+ 파일 분할 (17개)
- [ ] LONG-2. 캠페인 카드 Base 컴포넌트화
- [ ] LONG-3. DetailGuidelines 섹션 통합 (6→1)
- [ ] LONG-4. 폴더 중첩 깊이 완화
