# 파트너 캠페인 관리 페이지 데이터 흐름 정리

## 📋 개요

파트너 캠페인 관리 페이지(`/partner/campaign_management`)에서 사용하는 캠페인 데이터의 소스와 흐름을 정리한 문서입니다.

---

## 🔄 데이터 흐름도

```
[데이터 소스]
    ↓
[getSharedCampaigns()]
    ↓
[convertToPartnerCampaigns()]
    ↓
[getCampaignsByTab()]
    ↓
[페이지 컴포넌트]
```

---

## 📂 데이터 소스 (최상위)

### 1. `/data/campaign` 디렉토리 (메인 데이터 소스)

**위치**: `src/data/campaign/`

**파일들**:

- `delivery/deliveryCampaigns.ts` - 배송형 캠페인
- `mission/missionCampaigns.ts` - 미션형 캠페인
- `review/reviewCampaigns.ts` - 구매평 캠페인
- `visit/visitCampaigns.ts` - 방문형 캠페인
- `reporter/reporterCampaigns.ts` - 기자단 캠페인

**특징**:

- ✅ **사용자가 보는 캠페인 목록과 동일한 데이터 소스**
- ✅ 파트너 관리 페이지에서도 같은 데이터를 사용
- ✅ 데이터 일관성 보장

**import 위치**: `src/data/partner/sharedCampaigns.ts` (35-39번째 줄)

```typescript
import { deliveryCampaigns as campaignDeliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { missionCampaigns as campaignMissionCampaigns } from "@/data/campaign/mission/missionCampaigns";
import { reviewCampaigns as campaignReviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { visitCampaigns as campaignVisitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reporterCampaigns as campaignReporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
```

---

### 2. localStorage (사용자가 새로 등록한 캠페인)

**위치**: 브라우저 localStorage

**키들**:

- `deliveryCampaigns` - 배송형
- `missionCampaigns` - 미션형
- `reviewCampaigns` - 구매평
- `visitCampaigns` - 방문형
- `reporterCampaigns` - 기자단

**함수**: `getStoredCampaigns()` (210번째 줄)

- 각 타입별 localStorage에서 데이터를 불러옴
- 상태를 현재 날짜 기준으로 재계산

---

### 3. 종료/취소 캠페인 데이터

**위치**: `src/data/partner/sharedCampaigns.ts` (147번째 줄)

**함수**: `getClosedCampaigns()`

- 종료되거나 취소된 캠페인의 콘텐츠 데이터
- 각 타입별 파일에서 동적 import:
  - `./delivery` → `deliveryClosedCampaigns`
  - `./mission` → `missionClosedCampaigns`
  - `./visit` → `visitClosedCampaigns`
  - `./review` → `reviewClosedCampaigns`
- 관리 페이지 목록 노출을 위해 최소 정보만 포함

---

## 🔧 데이터 변환 과정

### Step 1: `getSharedCampaigns()` 함수

**위치**: `src/data/partner/sharedCampaigns.ts` (679번째 줄)

**역할**:

1. `/data/campaign` 데이터를 `CampaignWithApplicants` 형식으로 변환
2. localStorage 데이터 병합
3. 종료/취소 데이터 병합
4. 삭제된 캠페인 필터링

**변환 함수**: `convertCampaignDataToPartnerFormat()` (560번째 줄)

- `/data/campaign` 형식 → `CampaignWithApplicants` 형식
- 날짜 기반 상태 계산
- daysLeft 계산

**반환 타입**: `CampaignWithApplicants[]`

---

### Step 2: `convertToPartnerCampaigns()` 함수

**위치**: `src/data/partner/sharedCampaigns.ts` (774번째 줄)

**역할**:

1. `getSharedCampaigns()` 결과를 받아서 `PartnerCampaign` 형식으로 변환
2. 날짜 기반으로 탭 상태 계산 (예정/신청/진행/종료/취소)
3. 신청/선정/모집 인원 수 계산
4. 서브 상태(subStatus) 계산
5. 브랜드 로고 계산
6. 중복 제거 (같은 ID가 여러 소스에 있을 때)

**반환 타입**: `PartnerCampaign[]`

---

### Step 3: `getCampaignsByTab()` 함수

**위치**: `src/data/partner/sharedCampaigns.ts` (951번째 줄)

**역할**:

1. `convertToPartnerCampaigns()` 결과를 받아서
2. 선택된 탭에 맞는 캠페인만 필터링
3. 탭: 전체, 예정, 신청, 진행, 종료, 취소, 연장 요청

**사용 위치**:

- `src/app/partner/campaign_management/page.tsx` (59번째 줄)
- 각 탭별 페이지들 (scheduled, applied, progress, completed, cancelled)

**반환 타입**: `PartnerCampaign[]`

---

## 📊 통계 데이터

### `getCampaignStats()` 함수

**위치**: `src/data/partner/sharedCampaigns.ts` (986번째 줄)

**역할**:

- `convertToPartnerCampaigns()` 결과를 기반으로 상태별 개수 계산
- 통계 탭에 표시되는 숫자들 (전체, 예정, 신청, 진행, 종료, 취소, 연장 요청, 패널티)

**사용 위치**:

- `src/components/partner/campaign_management/PartnerCampaignManagementHeader.tsx` (121번째 줄)

---

## 🎯 실제 사용 흐름

### 1. 페이지 로드 시

```
1. PartnerCampaignManagementHeader 컴포넌트 마운트
   ↓
2. getCampaignStats() 호출 → 통계 계산
   ↓
3. StatisticsTab에 통계 표시
```

### 2. 탭 클릭 시

```
1. 사용자가 탭 클릭 (예: "신청")
   ↓
2. setActiveStatTab("신청") 호출
   ↓
3. getCampaignsByTab("신청") 호출
   ↓
4. convertToPartnerCampaigns() → getSharedCampaigns() → 데이터 소스들
   ↓
5. 필터링된 캠페인 목록 반환
   ↓
6. CampaignList 컴포넌트에 표시
```

### 3. 필터링 시

```
1. CampaignFilterBar에서 필터 적용
   ↓
2. getCampaignsByTab() 결과를 필터링
   ↓
3. handleFilteredCampaignsChange() 호출
   ↓
4. CampaignList에 필터링된 결과 표시
```

---

## ⚠️ `/data/partner` 파일들의 사용 여부

### ❌ 사용되지 않는 데이터

**`/data/partner/delivery.ts`, `mission.ts`, `reporter.ts`, `review.ts`, `visit.ts`의 메인 캠페인 데이터**

- `export const deliveryCampaigns` 등은 **주석 처리되어 있고 사용되지 않음**
- `sharedCampaigns.ts` 42-43번째 줄에서 주석 처리됨
- 대신 `/data/campaign`의 데이터를 사용

### ✅ 여전히 사용되는 것들

1. **헬퍼 함수들** (`calculateCampaignStatus`, `calculateDaysLeft`)

   - 위치: 각 `/data/partner/*.ts` 파일
   - 사용 위치: `getStoredCampaigns()` 내부 (localStorage 데이터 처리 시)
   - 역할: localStorage에서 불러온 캠페인의 상태를 현재 날짜 기준으로 재계산

2. **종료/취소 캠페인 데이터** (`*ClosedCampaigns`)
   - `deliveryClosedCampaigns`, `missionClosedCampaigns`, `visitClosedCampaigns`, `reviewClosedCampaigns`
   - 위치: 각 `/data/partner/*.ts` 파일
   - 사용 위치: `getClosedCampaigns()` 함수 (147번째 줄)
   - 역할: 종료되거나 취소된 캠페인의 콘텐츠 데이터 제공

---

## 📝 요약

### 데이터 소스 우선순위

1. **`/data/campaign` 데이터** (최우선)

   - 사용자가 보는 캠페인 목록과 동일
   - 모든 캠페인 타입 포함
   - **메인 캠페인 데이터 소스**

2. **localStorage 데이터**

   - 사용자가 새로 등록한 캠페인
   - 동적으로 추가/수정 가능
   - 상태 재계산 시 `/data/partner`의 헬퍼 함수 사용

3. **종료/취소 데이터** (`/data/partner`에서 가져옴)
   - 종료되거나 취소된 캠페인
   - 콘텐츠 데이터 포함
   - `*ClosedCampaigns` 변수 사용

### 핵심 함수들

| 함수명                        | 위치                   | 역할                          |
| ----------------------------- | ---------------------- | ----------------------------- |
| `getSharedCampaigns()`        | sharedCampaigns.ts:679 | 모든 데이터 소스를 병합       |
| `convertToPartnerCampaigns()` | sharedCampaigns.ts:774 | PartnerCampaign 형식으로 변환 |
| `getCampaignsByTab()`         | sharedCampaigns.ts:951 | 탭별 필터링                   |
| `getCampaignStats()`          | sharedCampaigns.ts:986 | 통계 계산                     |

### 데이터 형식 변환

```
/data/campaign 형식
    ↓ convertCampaignDataToPartnerFormat()
CampaignWithApplicants 형식
    ↓ convertToPartnerCampaigns()
PartnerCampaign 형식
    ↓ getCampaignsByTab()
필터링된 PartnerCampaign[]
```

---

## 🔍 디버깅 팁

### 캠페인이 보이지 않을 때

1. **데이터 소스 확인**

   - `/data/campaign`에 해당 캠페인이 있는지 확인
   - localStorage에 저장되어 있는지 확인

2. **삭제 여부 확인**

   - `getDeletedCampaignIds()`로 삭제된 캠페인인지 확인
   - 콘솔 로그 확인

3. **필터링 확인**
   - `getCampaignsByTab()`에서 올바른 탭으로 필터링되는지 확인
   - `CampaignFilterBar`에서 필터가 적용되었는지 확인

### 통계가 맞지 않을 때

1. **상태 계산 확인**

   - 날짜 기반 상태 계산이 올바른지 확인
   - `getPartnerTabByDates()` 함수 확인

2. **중복 제거 확인**
   - 같은 ID의 캠페인이 여러 소스에 있는지 확인
   - `uniqueCampaignsMap`에서 중복 제거 로직 확인
