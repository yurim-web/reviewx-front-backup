# 데이터 파일 가이드 (백엔드 개발자용)

## ⚠️ **중요한 경고: 현재 프론트엔드 데이터 구조의 문제점**

### **현재 상황**
프론트엔드에서는 개발 편의를 위해 사용자(user)와 파트너(partner)의 캠페인 데이터를 **분리해서 관리**하고 있습니다:

- `src/data/user/delivery/deliveryCampaigns.ts` - 사용자가 보는 배송형 캠페인 목록
- `src/data/partner/delivery.ts` - 파트너가 관리하는 배송형 캠페인

### **문제점**
1. **데이터 중복**: 같은 캠페인이 두 곳에 존재합니다
2. **일관성 문제**: 한쪽에서 수정하면 다른 쪽과 동기화되지 않을 수 있습니다
3. **유지보수 어려움**: 캠페인 정보 변경 시 두 곳 모두 수정해야 합니다

### **올바른 백엔드 설계 방향**
**백엔드에서는 반드시 하나의 캠페인 데이터 소스를 사용해야 합니다:**

```
✅ 올바른 구조:
┌─────────────────────────┐
│   캠페인 테이블 (단일)   │
│  - id                   │
│  - title                │
│  - type                 │
│  - status               │
│  - ...                  │
└─────────────────────────┘
         │
         ├──────────────┬──────────────┐
         │              │              │
    사용자 뷰      파트너 뷰      관리자 뷰
    (조회용)      (관리용)      (전체관리)
```

**API 설계 예시:**

1. **하나의 캠페인 조회 API**: `GET /api/campaigns/{id}`
   - 사용자: 공개된 캠페인 정보만 반환
   - 파트너: 자신이 등록한 캠페인의 전체 정보 + 신청자 데이터 반환
   - 관리자: 모든 캠페인의 전체 정보 반환

2. **캠페인 목록 API**:
   - 사용자: `GET /api/campaigns?type={type}&status=모집중` (공개 캠페인만)
   - 파트너: `GET /api/partner/campaigns` (자신이 등록한 캠페인만)
   - 관리자: `GET /api/admin/campaigns` (전체 캠페인)

3. **관계 데이터 분리**:
   - 신청자 데이터: `GET /api/campaigns/{id}/applicants` (파트너/관리자만 접근)
   - 콘텐츠 데이터: `GET /api/campaigns/{id}/contents` (파트너/관리자만 접근)
   - 사용자별 참여 상태: `GET /api/user/campaigns?status={status}` (사용자 본인만)

**핵심 원칙:**
- ❌ 캠페인 데이터를 사용자/파트너별로 분리하지 마세요
- ✅ 하나의 캠페인 테이블 + 역할별 접근 권한 + 필요한 관계 데이터만 추가 조회

---

## 📋 **목차**

1. [데이터 폴더 구조](#데이터-폴더-구조)
2. [사용자 데이터 (user/)](#사용자-데이터-user)
3. [파트너 데이터 (partner/)](#파트너-데이터-partner)
4. [커뮤니티 데이터 (faq/)](#커뮤니티-데이터-faq)
5. [관리자 데이터 (admin/) - 향후 구현 예정](#관리자-데이터-admin---향후-구현-예정)
6. [API 매핑 가이드](#api-매핑-가이드)
7. [데이터 구조 설명](#데이터-구조-설명)
8. [PRD 기반 추가 요구사항](#prd-기반-추가-요구사항)

---

## 📁 **데이터 폴더 구조**

```
src/data/
├── user/                          # 사용자(리뷰어) 관련 데이터
│   ├── delivery/                  # 배송형 캠페인
│   │   ├── deliveryCampaigns.ts   # 캠페인 목록 데이터
│   │   └── deliveryFilterOptions.ts # 필터 옵션 데이터
│   ├── visit/                     # 방문형 캠페인
│   │   ├── visitCampaigns.ts
│   │   └── visitFilterOptions.ts
│   ├── review/                    # 구매평 캠페인
│   │   ├── reviewCampaigns.ts
│   │   └── reviewFilterOptions.ts
│   ├── mission/                   # 미션형 캠페인
│   │   ├── missionCampaigns.ts
│   │   └── missionFilterOptions.ts
│   ├── reporter/                  # 기자단 캠페인
│   │   ├── reporterCampaigns.ts
│   │   └── reporterFilterOptions.ts
│   ├── campaign_management/       # 캠페인 관리 데이터
│   │   └── campaignManagementData.ts
│   └── point/                     # 포인트 데이터
│       └── pointData.ts
├── partner/                       # 파트너(광고주) 관련 데이터
│   ├── delivery.ts                # 배송형 캠페인 데이터 (관리용)
│   ├── visit.ts                   # 방문형 캠페인 데이터 (관리용)
│   ├── review.ts                  # 구매평 캠페인 데이터 (관리용)
│   ├── mission.ts                 # 미션형 캠페인 데이터 (관리용)
│   ├── reporter.ts                # 기자단 캠페인 데이터 (관리용)
│   ├── sharedCampaigns.ts         # 공용 캠페인 데이터 (관리 + 신청내역)
│   ├── campaign_application/      # 신청내역 데이터
│   │   ├── delivery_applicants.ts # 배송형 신청자 데이터
│   │   └── delivery_review_completed.ts # 검수/완료 데이터
│   ├── point/                     # 파트너 포인트 데이터
│   │   └── pointData.ts
│   └── utils/                     # 유틸리티 함수
│       └── campaignHelpers.ts     # 캠페인 헬퍼 함수들
└── faq/                           # FAQ 데이터
    └── faqData.ts
```

---

## 👤 **사용자 데이터 (user/)**

### **📦 배송형 캠페인** - `user/delivery/`

#### **`deliveryCampaigns.ts`**
- **용도**: 배송형 캠페인 목록 데이터
- **사용 페이지**:
  - `/` - 메인 홈페이지
  - `/user/delivery` - 배송형 목록 페이지
  - `/user/delivery/[id]` - 배송형 상세 페이지
- **API 매핑**: `GET /api/campaigns/delivery`
- **데이터 개수**: 16개
- **주요 필드**:
  - `id`: 캠페인 ID (예: `"delivery_1"`, `"delivery_2"`)
  - `title`: 캠페인 제목
  - `image`: 메인 이미지 경로
  - `points`: 지급 포인트
  - `recruitment`: 모집 인원 정보
  - `detailedSchedule`: 일정 정보

#### **`deliveryFilterOptions.ts`**
- **용도**: 배송형 캠페인 필터 옵션
- **사용 페이지**: `/user/delivery`
- **API 매핑**: `GET /api/campaigns/delivery/filters`
- **포함 옵션**:
  - 카테고리: 전체, 식품, 뷰티, 가전, 유아동, 여가, 서비스, 생활, 패션, 가구, 디지털, 문화, 반려동물, 기타
  - 채널: 네이버 블로그, 네이버 클립, 인스타그램, 릴스, 유튜브, 쇼츠
  - 정렬: 최신순, 인기순, 마감임박순, 포인트순

---

### **📍 방문형 캠페인** - `user/visit/`

#### **`visitCampaigns.ts`**
- **용도**: 방문형 캠페인 목록 데이터
- **사용 페이지**:
  - `/` - 메인 홈페이지
  - `/user/visit` - 방문형 목록 페이지
  - `/user/visit/[id]` - 방문형 상세 페이지
- **API 매핑**: `GET /api/campaigns/visit`
- **데이터 개수**: 16개

#### **`visitFilterOptions.ts`**
- **용도**: 방문형 캠페인 필터 옵션
- **사용 페이지**: `/user/visit`
- **API 매핑**: `GET /api/campaigns/visit/filters`

---

### **🛒 구매평 캠페인** - `user/review/`

#### **`reviewCampaigns.ts`**
- **용도**: 구매평 캠페인 목록 데이터
- **사용 페이지**:
  - `/` - 메인 홈페이지
  - `/user/review` - 구매평 목록 페이지
  - `/user/review/[id]` - 구매평 상세 페이지
- **API 매핑**: `GET /api/campaigns/review`
- **데이터 개수**: 16개
- **특징**: 구매 기간 정보 포함 (`purchasePeriod`)

#### **`reviewFilterOptions.ts`**
- **용도**: 구매평 캠페인 필터 옵션
- **사용 페이지**: `/user/review`
- **API 매핑**: `GET /api/campaigns/review/filters`

---

### **🎯 미션형 캠페인** - `user/mission/`

#### **`missionCampaigns.ts`**
- **용도**: 미션형 캠페인 목록 데이터
- **사용 페이지**:
  - `/` - 메인 홈페이지
  - `/user/mission` - 미션형 목록 페이지
  - `/user/mission/[id]` - 미션형 상세 페이지
- **API 매핑**: `GET /api/campaigns/experience` (경로는 experience)
- **데이터 개수**: 16개

#### **`missionFilterOptions.ts`**
- **용도**: 미션형 캠페인 필터 옵션
- **사용 페이지**: `/user/mission`
- **API 매핑**: `GET /api/campaigns/experience/filters`

---

### **📰 기자단 캠페인** - `user/reporter/`

#### **`reporterCampaigns.ts`**
- **용도**: 기자단 캠페인 목록 데이터
- **사용 페이지**:
  - `/` - 메인 홈페이지
  - `/user/reporter` - 기자단 목록 페이지
  - `/user/reporter/[id]` - 기자단 상세 페이지
- **API 매핑**: `GET /api/campaigns/reporter`
- **데이터 개수**: 16개

#### **`reporterFilterOptions.ts`**
- **용도**: 기자단 캠페인 필터 옵션
- **사용 페이지**: `/user/reporter`
- **API 매핑**: `GET /api/campaigns/reporter/filters`

---

### **📊 캠페인 관리 데이터** - `user/campaign_management/`

#### **`campaignManagementData.ts`**
- **용도**: 사용자 캠페인 관리 페이지 데이터
- **사용 페이지**:
  - `/user/campaign_management/applied` - 신청 탭
  - `/user/campaign_management/selected` - 선정 탭
  - `/user/campaign_management/completed` - 완료 탭
  - `/user/campaign_management/cancelled` - 취소/반려 탭
- **API 매핑**: `GET /api/user/campaigns?status={status}`
- **주요 기능**:
  - 사용자가 신청한 캠페인 목록
  - 상태별 필터링 (신청, 선정, 완료, 취소/반려)
  - 통계 정보 포함

---

### **💰 포인트 데이터** - `user/point/`

#### **`pointData.ts`**
- **용도**: 사용자 포인트 내역 데이터
- **사용 페이지**:
  - `/user/point/all` - 전체 탭
  - `/user/point/earned` - 적립 탭
  - `/user/point/withdrawn` - 출금 탭
  - `/user/point/withdrawal_request` - 출금 신청
- **API 매핑**: 
  - `GET /api/user/points` - 전체 포인트 내역
  - `GET /api/user/points?type=earned` - 적립 내역
  - `GET /api/user/points?type=withdrawn` - 출금 내역
  - `POST /api/user/points/withdrawal` - 출금 신청
- **주요 필드**:
  - `id`: 포인트 내역 ID
  - `type`: "earned" | "withdrawn"
  - `amount`: 포인트 금액
  - `status`: "earned" | "completed" | "pending" | "failed"
  - `campaign_id`: 관련 캠페인 ID (선택적)

---

## 🤝 **파트너 데이터 (partner/)**

### **📦 배송형 캠페인** - `partner/delivery.ts`

- **용도**: 파트너용 배송형 캠페인 데이터 (관리 + 신청내역)
- **사용 페이지**:
  - `/partner/campaign_management` - 캠페인 관리 페이지
  - `/partner/campaign_application/delivery/[id]` - 신청내역 페이지
  - `/partner/campaign_contents/delivery/[id]` - 콘텐츠 검수 페이지
- **API 매핑**: 
  - `GET /api/partner/campaigns` - 파트너 캠페인 목록
  - `GET /api/partner/campaigns/{id}` - 캠페인 상세
- **데이터 구조**:
  - `campaignInfo`: 캠페인 기본 정보
  - `applicantData`: 신청자 데이터 (`applicants`, `selectedApplicants`)
  - `contents`: 콘텐츠 데이터 (검수/완료)

---

### **📍 방문형 캠페인** - `partner/visit.ts`

- **용도**: 파트너용 방문형 캠페인 데이터
- **사용 페이지**:
  - `/partner/campaign_management` - 캠페인 관리
  - `/partner/campaign_application/visit/[id]` - 신청내역
  - `/partner/campaign_contents/visit/[id]` - 콘텐츠 검수
- **API 매핑**: `GET /api/partner/campaigns?type=visit`

---

### **🛒 구매평 캠페인** - `partner/review.ts`

- **용도**: 파트너용 구매평 캠페인 데이터
- **사용 페이지**:
  - `/partner/campaign_management` - 캠페인 관리
  - `/partner/campaign_application/review/[id]` - 신청내역
  - `/partner/campaign_contents/review/[id]` - 콘텐츠 검수
- **API 매핑**: `GET /api/partner/campaigns?type=review`
- **특징**: 구매 기간 정보 포함, 구매 영수증 검수 기능

---

### **🎯 미션형 캠페인** - `partner/mission.ts`

- **용도**: 파트너용 미션형 캠페인 데이터
- **사용 페이지**:
  - `/partner/campaign_management` - 캠페인 관리
  - `/partner/campaign_application/mission/[id]` - 신청내역
  - `/partner/campaign_contents/mission/[id]` - 콘텐츠 검수
- **API 매핑**: `GET /api/partner/campaigns?type=mission`

---

### **📰 기자단 캠페인** - `partner/reporter.ts`

- **용도**: 파트너용 기자단 캠페인 데이터
- **사용 페이지**:
  - `/partner/campaign_management` - 캠페인 관리
  - `/partner/campaign_application/reporter/[id]` - 신청내역
  - `/partner/campaign_contents/reporter/[id]` - 콘텐츠 검수
- **API 매핑**: `GET /api/partner/campaigns?type=reporter`

---

### **📊 공용 캠페인 데이터** - `partner/sharedCampaigns.ts`

- **용도**: 파트너 캠페인 관리 및 신청내역에서 공통으로 사용하는 데이터
- **사용 페이지**:
  - `/partner/campaign_management` (모든 탭)
  - `/partner/campaign_application` (모든 타입)
  - `/partner/campaign_contents` (모든 타입)
- **API 매핑**: 
  - `GET /api/partner/campaigns` - 모든 캠페인
  - `GET /api/partner/campaigns/stats` - 캠페인 통계
- **주요 함수**:
  - `getSharedCampaigns()`: 모든 캠페인 데이터 반환 (localStorage 포함)
  - `getCampaignById(id)`: ID로 캠페인 조회
  - `getCampaignsByTab(tab)`: 탭별 캠페인 필터링
  - `getCampaignStats()`: 캠페인 통계 정보
  - `getClosedCampaigns()`: 종료/취소 캠페인 조회
- **데이터 구조**:
  ```typescript
  interface CampaignWithApplicants {
    campaignInfo: PartnerCampaign;  // 캠페인 기본 정보
    applicantData: {
      applicants: AllApplicant[];      // 신청자 목록
      selectedApplicants: AllApplicant[]; // 선정자 목록
    };
  }
  
  interface CampaignWithContents {
    campaignInfo: PartnerCampaign;
    contents: {
      reviewing: ContentItem[];  // 검수 중 콘텐츠
      completed: ContentItem[];  // 완료된 콘텐츠
    };
  }
  ```

---

### **📋 신청내역 데이터** - `partner/campaign_application/`

#### **`delivery_applicants.ts`**
- **용도**: 배송형 캠페인 신청자 데이터 타입 정의 및 예시
- **사용 페이지**: `/partner/campaign_application/delivery/[id]`
- **API 매핑**: `GET /api/partner/campaigns/{id}/applicants`
- **주요 타입**:
  - `Applicant`: 기본 신청자 타입
  - `NaverClipApplicant`: 네이버 클립 신청자
  - `InstagramApplicant`: 인스타그램 신청자
  - `YoutubeApplicant`: 유튜브 신청자
  - `AllApplicant`: 통합 신청자 타입
  - `CampaignWithApplicants`: 캠페인 + 신청자 통합 타입

#### **`delivery_review_completed.ts`**
- **용도**: 검수/완료 상태 신청자 데이터
- **사용 페이지**: `/partner/campaign_contents/delivery/[id]`
- **API 매핑**: `GET /api/partner/campaigns/{id}/contents`
- **주요 타입**:
  - `ReviewApplicant`: 검수 중 신청자
  - `CompletedApplicant`: 완료된 신청자

---

### **💰 파트너 포인트 데이터** - `partner/point/`

#### **`pointData.ts`**
- **용도**: 파트너 포인트 내역 데이터
- **사용 페이지**: `/partner/point`
- **API 매핑**: `GET /api/partner/points`
- **주요 필드**: 사용자 포인트와 유사한 구조

---

### **🛠️ 유틸리티 함수** - `partner/utils/campaignHelpers.ts`

- **용도**: 캠페인 관련 헬퍼 함수들
- **주요 함수**:
  - `calculateCampaignStatus()`: 날짜 기준으로 캠페인 상태 계산
  - `calculateDaysLeft()`: 선정일까지 남은 일수 계산
  - `getStatusMessage()`: 상태별 메시지 반환
  - `getBrandLogo()`: 브랜드명으로 로고 URL 반환
  - `getSubStatus()`: 서브 상태 계산
  - `getPartnerTabByDates()`: 날짜 기준으로 탭 결정

---

## 🔄 **API 매핑 가이드**

> ⚠️ **주의**: 아래의 API 매핑은 **현재 프론트엔드 데이터 파일 구조를 기준**으로 작성되었습니다.  
> **백엔드에서는 위에서 설명한 대로 하나의 캠페인 데이터 소스를 사용**하고, 역할별로 다른 뷰를 제공해야 합니다.

### **핵심 API 설계 원칙**

**캠페인은 하나의 테이블에서 관리하며, 역할별 접근 권한으로 데이터를 제한합니다:**

1. **공통 캠페인 조회**: `GET /api/campaigns/{id}`
   - 역할에 따라 반환하는 필드가 다름 (사용자: 공개 정보만, 파트너: 전체 정보)
   
2. **캠페인 목록**: `GET /api/campaigns?type={type}&status={status}`
   - 사용자: 공개된 캠페인만 (`status=모집중`)
   - 파트너: 자신이 등록한 캠페인만 (`/api/partner/campaigns`)
   
3. **관계 데이터**: 별도 엔드포인트로 분리
   - 신청자: `GET /api/campaigns/{id}/applicants`
   - 콘텐츠: `GET /api/campaigns/{id}/contents`
   - 사용자 참여 상태: `GET /api/user/campaigns`

---

### **사용자 API**

| 프론트엔드 데이터 파일 | 권장 API 엔드포인트 | HTTP 메서드 | 설명 | 비고 |
|----------------------|-------------------|-------------|------|------|
| `user/delivery/deliveryCampaigns.ts` | `/api/campaigns?type=delivery` | GET | 배송형 캠페인 목록 | 공개 캠페인만 |
| `user/delivery/deliveryFilterOptions.ts` | `/api/campaigns/filters?type=delivery` | GET | 배송형 필터 옵션 | |
| `user/delivery/deliveryCampaigns.ts` | `/api/campaigns/{id}` | GET | 배송형 캠페인 상세 | 공개 정보만 반환 |
| `user/visit/visitCampaigns.ts` | `/api/campaigns?type=visit` | GET | 방문형 캠페인 목록 | 공개 캠페인만 |
| `user/visit/visitFilterOptions.ts` | `/api/campaigns/filters?type=visit` | GET | 방문형 필터 옵션 | |
| `user/review/reviewCampaigns.ts` | `/api/campaigns?type=review` | GET | 구매평 캠페인 목록 | 공개 캠페인만 |
| `user/review/reviewFilterOptions.ts` | `/api/campaigns/filters?type=review` | GET | 구매평 필터 옵션 | |
| `user/mission/missionCampaigns.ts` | `/api/campaigns?type=mission` | GET | 미션형 캠페인 목록 | 공개 캠페인만 |
| `user/mission/missionFilterOptions.ts` | `/api/campaigns/filters?type=mission` | GET | 미션형 필터 옵션 | |
| `user/reporter/reporterCampaigns.ts` | `/api/campaigns?type=reporter` | GET | 기자단 캠페인 목록 | 공개 캠페인만 |
| `user/reporter/reporterFilterOptions.ts` | `/api/campaigns/filters?type=reporter` | GET | 기자단 필터 옵션 | |
| `user/campaign_management/campaignManagementData.ts` | `/api/user/campaigns?status={status}` | GET | 사용자 참여 캠페인 목록 | 본인 참여 정보만 |
| `user/point/pointData.ts` | `/api/user/points` | GET | 포인트 내역 | |
| `user/point/pointData.ts` | `/api/user/points/withdrawal` | POST | 출금 신청 | |
| `faq/faqData.ts` | `/api/faq` | GET | FAQ 목록 | |
| `faq/faqData.ts` | `/api/faq?category={category}` | GET | 카테고리별 FAQ | |
| `notice/noticeData.ts` | `/api/notices` | GET | 공지사항 목록 | |
| `notice/noticeData.ts` | `/api/notices?category={category}` | GET | 카테고리별 공지사항 | |

---

### **파트너 API**

| 프론트엔드 데이터 파일 | 권장 API 엔드포인트 | HTTP 메서드 | 설명 | 비고 |
|----------------------|-------------------|-------------|------|------|
| `partner/sharedCampaigns.ts` | `/api/partner/campaigns` | GET | 파트너 캠페인 목록 | 본인이 등록한 캠페인만 |
| `partner/sharedCampaigns.ts` | `/api/partner/campaigns/stats` | GET | 캠페인 통계 | |
| `partner/delivery.ts` 등 | `/api/campaigns/{id}` | GET | 캠페인 상세 | 본인 캠페인만 접근 가능 |
| `partner/delivery.ts` 등 | `/api/campaigns/{id}` | PUT | 캠페인 수정 | 본인 캠페인만 수정 가능 |
| `partner/delivery.ts` 등 | `/api/campaigns/{id}` | DELETE | 캠페인 삭제 | 본인 캠페인만 삭제 가능 |
| `partner/sharedCampaigns.ts` | `/api/campaigns` | POST | 캠페인 생성 | |
| `partner/campaign_application/delivery_applicants.ts` | `/api/campaigns/{id}/applicants` | GET | 신청자 목록 | 본인 캠페인만 접근 가능 |
| `partner/campaign_application/delivery_review_completed.ts` | `/api/campaigns/{id}/contents` | GET | 콘텐츠 목록 | 본인 캠페인만 접근 가능 |
| `partner/point/pointData.ts` | `/api/partner/points` | GET | 파트너 포인트 내역 | |

---

## 📢 **커뮤니티 데이터 (faq/)**

### **❓ FAQ 데이터** - `faq/faqData.ts`

- **용도**: 자주 묻는 질문 데이터
- **사용 페이지**:
  - `/faq` - FAQ 페이지
  - `/user/mypage/profile` - 마이페이지에서 FAQ 링크
  - `/partner/mypage` - 파트너 마이페이지에서 FAQ 링크
- **API 매핑**: `GET /api/faq` 또는 `GET /api/faq?category={category}`
- **주요 필드**:
  - `id`: FAQ ID
  - `question`: 질문 내용
  - `answer`: 답변 내용
  - `category`: 카테고리 (전체, 미션형, 주문/배송, 교환/반품, 회원가입/로그인, 취소/환불, 포인트, 기타)
- **카테고리 목록**:
  - 전체, 미션형, 주문/배송, 교환/반품, 회원가입/로그인, 취소/환불, 포인트, 기타

---

### **📢 공지사항 데이터** - `notice/noticeData.ts` (향후 생성 예정)

- **용도**: 공지사항 데이터
- **사용 페이지**:
  - `/notice` - 공지사항 페이지
  - `/user/mypage/profile` - 마이페이지에서 공지사항 링크
  - `/partner/mypage` - 파트너 마이페이지에서 공지사항 링크
- **API 매핑**: `GET /api/notices` 또는 `GET /api/notices?category={category}`
- **예상 필드**:
  - `id`: 공지사항 ID
  - `title`: 제목
  - `content`: 내용
  - `date`: 작성일
  - `category`: 카테고리 (전체, 중요, 소식, 미션형, 이벤트)
  - `isImportant`: 중요 여부

---

## 👨‍💼 **관리자 데이터 (admin/) - 향후 구현 예정**

### **⚠️ 현재 상태**

현재 코드베이스에는 관리자 관련 데이터 파일이 없습니다.  
PRD에 따르면 다음 관리자 역할이 필요합니다:

1. **일반 관리자**: 파트너 캠페인 관리, 회원 관리, 리뷰 검수, 정산 검토
2. **최고 관리자**: 전체 시스템 접근, 정책 설정, 정산 승인, 강제 수정

### **예상 데이터 구조**

#### **관리자 대시보드 데이터** - `admin/dashboardData.ts` (예정)

- **용도**: 관리자 대시보드 통계 데이터
- **사용 페이지**: `/admin/dashboard`
- **API 매핑**: `GET /api/admin/dashboard`
- **예상 필드**:
  - `totalCampaigns`: 전체 캠페인 수
  - `pendingApprovals`: 승인 대기 캠페인 수
  - `pendingSettlements`: 정산 대기 건수
  - `totalUsers`: 전체 회원 수
  - `totalPartners`: 전체 파트너 수
  - `todayApplications`: 오늘 신청 건수
  - `pendingReviews`: 리뷰 검수 대기 수

#### **관리자 캠페인 관리 데이터** - `admin/campaignManagementData.ts` (예정)

- **용도**: 관리자용 캠페인 목록 및 관리 데이터
- **사용 페이지**: `/admin/campaigns`
- **API 매핑**: `GET /api/admin/campaigns`
- **예상 필드**:
  - 전체 캠페인 목록 (파트너별, 상태별 필터링)
  - 캠페인 승인/반려 기능
  - 캠페인 상세 정보 및 수정 권한

#### **관리자 회원 관리 데이터** - `admin/userManagementData.ts` (예정)

- **용도**: 관리자용 회원 관리 데이터
- **사용 페이지**: `/admin/users`
- **API 매핑**: `GET /api/admin/users`
- **예상 필드**:
  - 전체 회원 목록
  - 회원 활동 이력
  - 블랙리스트 관리
  - 회원 그룹 관리

#### **관리자 정산 관리 데이터** - `admin/settlementData.ts` (예정)

- **용도**: 관리자용 정산 관리 데이터
- **사용 페이지**: `/admin/settlements`
- **API 매핑**: `GET /api/admin/settlements`
- **예상 필드**:
  - 전체 정산 신청 내역
  - 정산 승인/반려 처리
  - 정산 일괄 처리
  - 정산 통계

---

## 📝 **데이터 구조 설명**

### **캠페인 ID 형식**

- **사용자 캠페인**:
  - 배송형: `"delivery_1"`, `"delivery_2"`, ..., `"delivery_16"`
  - 방문형: `"visit_1"`, `"visit_2"`, ..., `"visit_16"`
  - 구매평: `"review_1"`, `"review_2"`, ..., `"review_16"`
  - 미션형: `"experience_1"`, `"experience_2"`, ..., `"experience_16"`
  - 기자단: `"reporter_1"`, `"reporter_2"`, ..., `"reporter_16"`

- **파트너 캠페인**:
  - 숫자 ID 사용 (예: `"101"`, `"201"`, `"301"`)
  - 타입별로 100단위 구분
    - 배송형: 1xx
    - 방문형: 2xx
    - 구매평: 3xx
    - 미션형: 4xx
    - 기자단: 5xx

### **캠페인 상태 값**

- **사용자 캠페인 상태**: `"신청"` | `"선정"` | `"완료"` | `"취소/반려"`

- **파트너 캠페인 상태**: `"대기 중"` | `"모집 중"` | `"진행 중"` | `"종료"` | `"취소"`

### **포인트 타입**

- `"earned"`: 적립
- `"withdrawn"`: 출금

### **포인트 상태**

- `"earned"`: 적립 완료
- `"completed"`: 출금 완료
- `"pending"`: 출금 대기 중
- `"failed"`: 출금 실패

---

## 🚀 **PRD 기반 추가 요구사항**

### **1. 쿠팡 파트너스 연동** (향후 구현 예정)

PRD에 따르면 쿠팡 파트너스 연결이 예정되어 있습니다.

- **제품 구매 대행 수수료**: 8% (최대 9%)
- **API 매핑** (예상):
  - `POST /api/coupang/partner/link` - 쿠팡 파트너스 링크 생성
  - `GET /api/coupang/products` - 쿠팡 상품 조회
- **데이터 구조** (예상):
  ```typescript
  interface CoupangPartnerData {
    partnerId: string;
    productUrl: string;
    commissionRate: number; // 8% or 9%
    productInfo: {
      name: string;
      price: number;
      image: string;
    };
  }
  ```

### **2. 결제 시스템 연동** (향후 구현 예정)

- **파트너 포인트 충전**:
  - 무통장 입금
  - 카드 결제 (수수료 처리 필요)
- **API 매핑** (예상):
  - `POST /api/payment/charge` - 포인트 충전
  - `POST /api/payment/withdraw` - 출금 신청
  - `GET /api/payment/history` - 결제 내역

### **3. 정산 정책**

- **참여자 출금 정책**:
  - 주 1회 정산
  - 한도: 500,000원 (일반), 2,000,000원 (월 최대)
  - 수수료: 3.3% 공제
- **API 매핑** (예상):
  - `POST /api/user/points/withdrawal` - 출금 신청
  - `GET /api/user/points/withdrawal/limit` - 출금 한도 확인

### **4. 채널 연동 API**

PRD에 따르면 채널 연동을 통한 등급/팔로워 수 자동 수집이 필요합니다.

- **지원 채널**: 네이버 블로그, 네이버 클립, 인스타그램, 릴스, 유튜브, 쇼츠
- **API 매핑** (예상):
  - `POST /api/user/channels/connect` - 채널 연결
  - `GET /api/user/channels/{channelId}/stats` - 채널 통계 조회
  - `GET /api/user/channels/{channelId}/followers` - 팔로워 수 조회

### **5. 소셜 로그인**

- **카카오 로그인**: 휴대폰 번호 수집 및 카카오톡 알림 발송
- **API 매핑** (예상):
  - `POST /api/auth/kakao/login` - 카카오 로그인
  - `GET /api/auth/kakao/callback` - 카카오 로그인 콜백

### **6. AI 자동 검수 기능** (향후 구현 예정)

PRD에 AI 자동 검수 기능 제안이 있습니다.

- **기능**:
  - 배송지, 주문번호, 카드 영수증 일치 여부 확인
  - 리뷰 내용 요약
  - 반복 반려 자동 탐지
- **API 매핑** (예상):
  - `POST /api/admin/reviews/ai-check` - AI 자동 검수
  - `GET /api/admin/reviews/ai-summary` - 리뷰 요약

### **7. 알림 시스템**

- **카카오톡 알림**: 반려 사유, 승인 완료, 정산 지급 등
- **API 매핑** (예상):
  - `POST /api/notifications/kakao/send` - 카카오톡 알림 발송
  - `GET /api/notifications/history` - 알림 내역

### **8. 반려 사유 코드**

PRD에 정의된 반려 사유 코드:

| 코드 | 구분 | 설명 |
|------|------|------|
| R001 | 리뷰 | 구매 인증 누락 |
| R002 | 리뷰 | 포토 미흡 |
| R003 | 리뷰 | 후기 부적절 |
| R004 | 리뷰 | URL 오류 |
| R005 | 리뷰 | 채널 등급 미달 |
| C001 | 캠페인 등록 | 필수 정보 누락 |
| C002 | 캠페인 등록 | 가이드 기준 미흡 |
| C003 | 캠페인 등록 | 부적절한 콘텐츠 요청 |
| U001 | 유저 상태 | 지각 제출 |
| U002 | 유저 상태 | 반복 반려 |
| U003 | 유저 상태 | 캠페인 무단 이탈 |
| U004 | 유저 상태 | 기간 불이행 |
| U005 | 유저 상태 | 기타 |
| U006 | 유저 상태 | 블랙리스트 등재 |
| P001 | 정산 | 계좌 정보 오류 |
| P002 | 정산 | 사기성 정산 시도 |
| S001 | 시스템 | 중복 계정 탐지 |
| S002 | 시스템 | 동일 리뷰 내용 반복 |
| S003 | 시스템 | 비정상 접근 기록 |

**API 매핑** (예상):
- `GET /api/rejection-reasons` - 반려 사유 목록
- `POST /api/reviews/{id}/reject` - 리뷰 반려 (사유 코드 포함)

---

## ⚠️ **중요 사항**

### **🔴 가장 중요: 캠페인 데이터 중복 문제**

**현재 프론트엔드 구조의 문제:**
- `user/` 폴더와 `partner/` 폴더에 캠페인 데이터가 분리되어 있습니다
- 이는 프론트엔드 개발 편의를 위한 것으로, **백엔드에서는 절대 따라하지 마세요**

**올바른 백엔드 설계:**
1. **하나의 캠페인 테이블**만 사용
2. 역할별 접근 권한으로 데이터 제한
3. 필요한 관계 데이터(신청자, 콘텐츠 등)만 별도 엔드포인트로 제공
4. 동일한 캠페인 조회 API(`GET /api/campaigns/{id}`)에서 역할에 따라 다른 필드 반환

---

### **기타 중요 사항**

1. **localStorage 사용**: 현재 프론트엔드에서는 새로 생성된 캠페인을 localStorage에 저장합니다. 백엔드 구현 시 실제 API로 대체해야 합니다.

2. **순환 참조 방지**: `sharedCampaigns.ts`에서는 순환 참조를 방지하기 위해 동적 로딩을 사용합니다. 백엔드에서는 이런 문제가 없지만 참고용으로 확인해주세요.

3. **날짜 기반 상태 계산**: 파트너 캠페인의 상태는 날짜를 기준으로 동적으로 계산됩니다. 백엔드에서도 동일한 로직으로 상태를 계산해야 합니다.

4. **캠페인 타입별 차이점**:
   - 구매평: `purchasePeriod` 필드 추가
   - 미션형: API 경로가 `experience`로 다름 (프론트엔드만, 백엔드는 `type=mission`으로 통일 권장)
   - 각 타입별로 필터 옵션이 약간씩 다를 수 있음

5. **데이터 구조 차이**: 
   - 프론트엔드에서는 사용자용과 파트너용 데이터 구조가 다릅니다
   - 백엔드에서는 하나의 캠페인 데이터를 역할별로 다른 뷰로 제공해야 합니다
   - 사용자: 공개 정보만 (제목, 이미지, 포인트, 일정 등)
   - 파트너: 전체 정보 + 신청자/콘텐츠 데이터

6. **관리자 기능**: 현재 프론트엔드에는 관리자 관련 페이지가 구현되지 않았습니다. PRD 기준으로 향후 구현 예정입니다.

7. **쿠팡 파트너스 연동**: PRD에 언급되었으나 현재 구현되지 않았습니다. 향후 구현 예정입니다.

8. **이미지 처리 정책**: 
   - 최대 용량: 5MB
   - 허용 확장자: JPG, PNG
   - 백엔드에서 이미지 검증 필요

9. **보안 정책**:
   - 개인정보 보호: 리뷰/정산 자료 포함 개인정보 보호 필요
   - SSL 암호화: 전송 시 필수
   - 비밀번호 해시 암호화: 데이터 최소 수집 설계 필요
   - 접근 권한: 파트너는 자신이 등록한 캠페인만 접근 가능하도록 구현 필수

---

**문서 버전**: 2.0  
**최종 업데이트**: 2025-01-20  
**작성자**: ReviewX 프론트엔드 개발팀  
**PRD 반영일**: 2025-01-20
