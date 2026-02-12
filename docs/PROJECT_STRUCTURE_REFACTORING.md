# 📁 프로젝트 구조 정리 계획

## 🎯 목표 구조

```
src/
├── components/
│   ├── common/           # 모든 역할에서 공통 사용 UI
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Table/
│   │   ├── Pagination/
│   │   ├── signup/      # 회원가입 공통 컴포넌트
│   │   ├── find_account/ # 아이디/비밀번호 찾기
│   │   ├── mypage/      # 마이페이지 공통 컴포넌트
│   │   └── ...
│   ├── user/            # 유저 전용 UI 컴포넌트
│   ├── partner/         # 파트너 전용 UI
│   ├── manager/         # 관리자 전용 UI (manager_ga, manager_sa 통합)
│   └── fragments/       # 레이아웃 컴포넌트 (Header 등)
│
├── hooks/
│   ├── common/          # 공통 훅 (useFetch, useModal 등)
│   ├── user/
│   ├── partner/
│   └── manager/
```

## 🔍 발견된 중복 및 문제점

### 1. 중복 컴포넌트

- ✅ `user/point/PointTabNavigation.tsx` ↔ `partner/point/PointTabNavigation.tsx`
  - **해결**: `common/point/PointTabNavigation.tsx`로 통합
- ✅ `user/mypage/SubTabNavigation.tsx` ↔ `partner/SubTabNavigation.tsx`

  - **해결**: `common/mypage/SubTabNavigation.tsx`로 통합

- ⚠️ `user/campaign_management/CampaignCard.tsx` ↔ `partner/campaign_management/CampaignCard.tsx`

  - **상태**: 타입이 다르지만 로직이 유사함
  - **해결**: 제네릭 타입으로 통합 검토 필요

- ✅ `mypage/` 폴더의 컴포넌트들
  - **현재**: `src/components/mypage/`에 있음
  - **해결**: `common/mypage/`로 이동 완료
    - `AddressInput.tsx` → `common/mypage/AddressInput.tsx`
    - `PhoneVerificationInput.tsx` → `common/mypage/PhoneVerificationInput.tsx`
    - `ProfilePhotoUpload.tsx` → `common/mypage/ProfilePhotoUpload.tsx`
    - 모든 import 경로 수정 완료

### 2. Hooks 구조 문제 ✅

- **현재**: 각 컴포넌트 폴더 안에 hooks가 흩어져 있음
  - `components/common/signup/hooks/`
  - `components/partner/signup/hooks/`
  - `components/user/signup/hooks/`
  - `components/partner/campaign_management/hooks/`
  - `components/common/campaign_management/hooks/`
- **해결**: `src/hooks/` 폴더로 통합 완료
  - ✅ `hooks/common/signup/usePhoneVerification.ts`
  - ✅ `hooks/user/signup/useTermsAgreement.ts`
  - ✅ `hooks/partner/signup/usePartnerTermsAgreement.ts`
  - ✅ 모든 hooks가 `src/hooks/` 폴더에 정리됨
  - ✅ 빈 hooks 폴더 삭제 완료

### 3. Manager 구조 문제 ✅

- **현재**: `manager_common`, `manager_ga`, `manager_sa`로 분리
- **해결**: `manager/` 폴더로 통합 완료
  - ✅ `manager/common/` - 공통 컴포넌트
  - ✅ `manager/ga/` - GA 전용
  - ✅ `manager/sa/` - SA 전용
  - ✅ 모든 import 경로가 `@/components/manager/`로 통일됨

## 📋 정리 작업 단계

### Phase 1: 공통 컴포넌트 정리 ✅

1. ✅ `PointTabNavigation` 통합 완료
2. ✅ `SubTabNavigation` 통합 완료
3. ✅ `mypage/` 컴포넌트 이동 완료
   - `AddressInput.tsx`, `PhoneVerificationInput.tsx`, `ProfilePhotoUpload.tsx` → `common/mypage/`로 이동
   - 모든 import 경로 수정 완료
   - 빈 hooks 폴더 및 mypage 폴더 삭제 완료

### Phase 2: Hooks 구조 정리 ✅

1. ✅ `src/hooks/` 폴더 생성 완료
2. ✅ hooks 파일들 이동 및 import 경로 수정 완료
   - 모든 hooks가 `src/hooks/` 폴더에 정리되어 있음
   - `hooks/common/`, `hooks/user/`, `hooks/partner/`, `hooks/manager/` 구조로 잘 정리됨

### Phase 3: Manager 구조 정리 ✅

1. ✅ `manager/` 폴더로 통합 완료
2. ✅ import 경로 정리 완료
   - `manager/common/` - 공통 컴포넌트
   - `manager/ga/` - GA 전용 컴포넌트
   - `manager/sa/` - SA 전용 컴포넌트
   - 모든 import 경로가 `@/components/manager/`로 통일됨

### Phase 4: CampaignCard 통합 검토 ✅

1. ✅ 타입 차이 분석 완료
2. ✅ 부분 통합 완료: 공통 버튼 스타일 유틸리티 함수 추출

**분석 결과:**

**타입 차이:**

- User: `CampaignApplication` 타입, `StatTab` 타입 사용
- Partner: `PartnerCampaign` 타입, `PartnerStatTab` 타입 사용
- 상태 값도 완전히 다름 (User: "신청" | "선정" | "완료" | "취소/반려", Partner: "대기 중" | "모집 중" | "진행 중" | "종료" | "취소")

**통합 작업:**

- ✅ **공통 버튼 스타일 유틸리티 함수 생성**

  - `src/components/common/campaign_management/utils/button_style_utils.ts` 생성
  - `getButtonStyleType()`: 버튼 텍스트를 분석하여 스타일 타입 반환
  - `getButtonClassName()`: 최종 버튼 클래스 문자열 생성
  - User와 Partner의 CampaignCard에서 공통으로 사용

- ✅ **User CampaignCard 리팩토링**

  - `getButtonStyle()` 함수를 공통 유틸리티 함수 사용하도록 변경
  - 중복된 버튼 스타일 로직 제거

- ✅ **Partner CampaignCard 리팩토링**
  - `getButtonStyle()` 함수를 공통 유틸리티 함수 사용하도록 변경
  - 중복된 버튼 스타일 로직 제거

**결론:**

- ❌ 완전 통합은 어려움: 타입과 로직이 너무 다름
- ✅ 부분 통합 완료: 공통 버튼 스타일 로직을 유틸리티 함수로 추출하여 중복 제거
- 💡 향후 개선 가능: 카드 레이아웃 구조도 공통 컴포넌트로 추출 가능 (선택적)

## ✅ 작업 완료 요약

### 완료된 작업

1. ✅ **공통 컴포넌트 통합**

   - `PointTabNavigation` → `common/point/`
   - `SubTabNavigation` → `common/mypage/`
   - `mypage/` 폴더의 모든 컴포넌트 → `common/mypage/`

2. ✅ **Hooks 구조 정리**

   - 모든 hooks가 `src/hooks/` 폴더로 통합
   - 빈 hooks 폴더 삭제 완료

3. ✅ **Manager 구조 정리**

   - `manager/common/`, `manager/ga/`, `manager/sa/` 구조로 통합
   - 모든 import 경로 통일

4. ✅ **인코딩 문제 해결**
   - `.editorconfig`, `.gitattributes` 파일 생성
   - 모든 한글 주석 인코딩 오류 수정

### 현재 프로젝트 구조 상태

```
src/
├── components/
│   ├── common/          ✅ 공통 컴포넌트 (point, mypage, signup, find_account 등)
│   ├── user/            ✅ 유저 전용 컴포넌트
│   ├── partner/         ✅ 파트너 전용 컴포넌트
│   ├── manager/         ✅ 관리자 전용 컴포넌트 (common, ga, sa)
│   └── fragments/       ✅ 레이아웃 컴포넌트
│
└── hooks/
    ├── common/          ✅ 공통 훅
    ├── user/            ✅ 유저 전용 훅
    ├── partner/         ✅ 파트너 전용 훅
    └── manager/         ✅ 관리자 전용 훅
```

## ⚠️ 주의사항

1. **타입 차이**: user와 partner의 타입이 다를 수 있으므로 통합 시 주의
2. **스타일 차이**: CSS 모듈 경로도 함께 수정 필요
3. **점진적 진행**: 한 번에 모든 것을 바꾸지 말고 단계별로 진행
4. **테스트**: 각 단계마다 빌드 및 동작 확인
