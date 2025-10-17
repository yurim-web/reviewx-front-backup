# ReviewX 프로젝트 백엔드 개발자용 가이드

## 🎯 **프로젝트 개요**

ReviewX는 리뷰 캠페인 플랫폼으로, 사용자들이 다양한 캠페인에 참여하여 제품을 체험하고 리뷰를 작성하는 서비스입니다.

### **주요 기능**

- 5가지 캠페인 타입 (배송형, 방문형, 구매평, 체험단, 기자단)
- 캠페인 신청/관리 시스템
- 포인트 적립/출금 시스템
- 사용자 프로필 관리

---

## 📁 **프로젝트 폴더 구조**

```
reviewx-web/
├── src/
│   ├── app/                          # 📄 페이지 (Next.js App Router)
│   │   ├── page.tsx                  # 🏠 메인 홈페이지
│   │   ├── user/                      # 👤 사용자 관련 페이지
│   │   │   ├── delivery/              # 📦 배송형 캠페인
│   │   │   │   ├── page.tsx           # 배송형 목록 페이지
│   │   │   │   └── [id]/              # 배송형 상세 페이지
│   │   │   ├── visit/                 # 📍 방문형 캠페인
│   │   │   ├── review/                # 🛒 구매평 캠페인
│   │   │   ├── experience/            # 🎯 체험단 캠페인
│   │   │   ├── reporter/              # 📰 기자단 캠페인
│   │   │   ├── mypage/                # 👤 마이페이지
│   │   │   ├── point/                 # 💰 포인트 관리
│   │   │   ├── notice/                # 📢 공지사항
│   │   │   └── faq/                   # ❓ FAQ
│   │   └── campaign_management/      # 📊 캠페인 관리
│   ├── components/                   # 🧩 컴포넌트
│   │   ├── main/                     # 메인 페이지용 컴포넌트
│   │   ├── user/                     # 사용자 관련 컴포넌트
│   │   │   ├── campaign/             # 캠페인 공통 컴포넌트
│   │   │   ├── campaign_detail/      # 캠페인 상세용 컴포넌트
│   │   │   ├── campaign_management/  # 캠페인 관리용 컴포넌트
│   │   │   ├── filter/               # 필터링 컴포넌트
│   │   │   └── mypage/               # 마이페이지 컴포넌트
│   │   └── fragments/                # 공통 조각 컴포넌트
│   ├── data/                         # 📊 데이터 파일
│   │   └── user/                     # 사용자 관련 데이터
│   │       ├── delivery/             # 배송형 캠페인 데이터
│   │       ├── visit/                # 방문형 캠페인 데이터
│   │       ├── review/               # 구매평 캠페인 데이터
│   │       ├── experience/           # 체험단 캠페인 데이터
│   │       ├── reporter/             # 기자단 캠페인 데이터
│   │       └── point/                # 포인트 데이터
│   ├── styles/                       # 🎨 CSS 파일
│   └── types/                        # 📝 TypeScript 타입 정의
└── public/                           # 🖼️ 이미지 등 정적 파일
    └── images/                       # 이미지 파일들
```

---

## 🧩 **컴포넌트 구조 및 사용처**

### **📂 main/** - 메인 페이지용 컴포넌트

| 컴포넌트    | 파일              | 사용 페이지 | 용도                           |
| ----------- | ----------------- | ----------- | ------------------------------ |
| MainMenu    | `MainMenu.tsx`    | 15개 페이지 | 상단 네비게이션 메뉴           |
| CampaignBox | `CampaignBox.tsx` | 6개 페이지  | 캠페인 카드 (가장 많이 사용됨) |
| Titletext   | `Titletext.tsx`   | 6개 페이지  | 페이지 제목                    |

### **📂 user/campaign/** - 캠페인 공통 컴포넌트

| 컴포넌트              | 파일                        | 사용 페이지 | 용도               |
| --------------------- | --------------------------- | ----------- | ------------------ |
| ApplicationModal      | `ApplicationModal.tsx`      | 캠페인 상세 | 지원 모달 (기본형) |
| ApplicationModalType2 | `ApplicationModalType2.tsx` | 캠페인 상세 | 지원 모달 (타입2)  |
| ApplicationModalType3 | `ApplicationModalType3.tsx` | 캠페인 상세 | 지원 모달 (타입3)  |
| AdditionalGuidelines  | `AdditionalGuidelines.tsx`  | 캠페인 상세 | 추가 가이드라인    |

### **📂 user/campaign_detail/** - 캠페인 상세용 컴포넌트

| 컴포넌트                          | 파일                                    | 사용 페이지 | 용도                |
| --------------------------------- | --------------------------------------- | ----------- | ------------------- |
| DetailHeader                      | `DetailHeader.tsx`                      | 캠페인 상세 | 상세 페이지 헤더    |
| DetailImage                       | `DetailImage.tsx`                       | 캠페인 상세 | 이미지 갤러리       |
| DetailProductInfo                 | `DetailProductInfo.tsx`                 | 캠페인 상세 | 제품 정보           |
| DetailScheduleInfo                | `DetailScheduleInfo.tsx`                | 캠페인 상세 | 일정 정보           |
| DetailGuidelinesSectionDelivery   | `DetailGuidelinesSectionDelivery.tsx`   | 배송형 상세 | 가이드라인 (배송형) |
| DetailGuidelinesSectionVisit      | `DetailGuidelinesSectionVisit.tsx`      | 방문형 상세 | 가이드라인 (방문형) |
| DetailGuidelinesSectionReview     | `DetailGuidelinesSectionReview.tsx`     | 구매평 상세 | 가이드라인 (구매평) |
| DetailGuidelinesSectionExperience | `DetailGuidelinesSectionExperience.tsx` | 체험단 상세 | 가이드라인 (체험단) |
| DetailGuidelinesSectionReporter   | `DetailGuidelinesSectionReporter.tsx`   | 기자단 상세 | 가이드라인 (기자단) |

### **📂 user/campaign_management/** - 캠페인 관리용 컴포넌트

| 컴포넌트       | 파일                 | 사용 페이지 | 용도                                     |
| -------------- | -------------------- | ----------- | ---------------------------------------- |
| TabNavigation  | `TabNavigation.tsx`  | 2개 페이지  | 메인 탭 (캠페인/포인트/계정/커뮤니티)    |
| StatisticsTab  | `StatisticsTab.tsx`  | 캠페인 관리 | 통계 탭 (신청/선정/완료/취소반려/패널티) |
| CampaignList   | `CampaignList.tsx`   | 캠페인 관리 | 캠페인 목록 컨테이너                     |
| CampaignCard   | `CampaignCard.tsx`   | 캠페인 관리 | 개별 캠페인 카드                         |
| PenaltyContent | `PenaltyContent.tsx` | 캠페인 관리 | 패널티 내역 화면                         |
| CampaignTag    | `CampaignTag.tsx`    | 캠페인 관리 | 태그들 (마감임박, 타입 등)               |

### **📂 user/filter/** - 필터링 컴포넌트

| 컴포넌트     | 파일               | 사용 페이지 | 용도         |
| ------------ | ------------------ | ----------- | ------------ |
| FilterBar    | `FilterBar.tsx`    | 5개 페이지  | 필터/정렬 바 |
| ModalFilter  | `ModalFilter.tsx`  | 5개 페이지  | 모달 필터    |
| RegionFilter | `RegionFilter.tsx` | 5개 페이지  | 지역 필터    |

### **📂 fragments/** - 공통 조각 컴포넌트

| 컴포넌트  | 파일            | 사용 페이지 | 용도      |
| --------- | --------------- | ----------- | --------- |
| Header    | `Header.tsx`    | 거의 모든   | 공통 헤더 |
| SubHeader | `SubHeader.tsx` | 캠페인 상세 | 서브 헤더 |

---

## 📄 **페이지별 API 요구사항 및 데이터 구조**

### **🏠 메인 홈페이지** - `/` (`app/page.tsx`)

**사용 컴포넌트**: MainMenu, CampaignBox, Titletext  
**필요한 API**:

```
GET /api/campaigns/main
- 선정 확률 높은 캠페인 목록 (8개)
- 지금 인기 많은 캠페인 목록 (8개)
```

### **📦 배송형 페이지** - `/user/delivery` (`app/user/delivery/page.tsx`)

**사용 컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext  
**필요한 API**:

```
GET /api/campaigns/delivery
- 배송형 캠페인 목록 (16개)
- 필터링 옵션 (카테고리, 채널, 정렬)

GET /api/campaigns/delivery/filters
- 카테고리: ["전체", "식품", "뷰티", "가전", "유아동", "여가", "서비스", "생활", "패션", "가구", "디지털", "문화", "반려동물", "기타"]
- 채널: ["네이버 블로그", "네이버 클립", "인스타그램", "릴스", "유튜브", "쇼츠"]
- 정렬: ["최신순", "인기순", "마감임박순", "포인트순"]
```

### **📍 방문형 페이지** - `/user/visit` (`app/user/visit/page.tsx`)

**사용 컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext  
**필요한 API**:

```
GET /api/campaigns/visit
GET /api/campaigns/visit/filters
```

### **🛒 구매평 페이지** - `/user/review` (`app/user/review/page.tsx`)

**사용 컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext  
**필요한 API**:

```
GET /api/campaigns/review
GET /api/campaigns/review/filters
```

### **🎯 체험단 페이지** - `/user/experience` (`app/user/experience/page.tsx`)

**사용 컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext  
**필요한 API**:

```
GET /api/campaigns/experience
GET /api/campaigns/experience/filters
```

### **📰 기자단 페이지** - `/user/reporter` (`app/user/reporter/page.tsx`)

**사용 컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext  
**필요한 API**:

```
GET /api/campaigns/reporter
GET /api/campaigns/reporter/filters
```

### **🔍 캠페인 상세 페이지** - `/user/delivery/[id]` (`app/user/delivery/[id]/page.tsx`)

**사용 컴포넌트**: SubHeader, DetailHeader, DetailProductInfo, DetailScheduleInfo, DetailImage, DetailGuidelinesSectionDelivery, ApplicationModal  
**필요한 API**:

```
GET /api/campaigns/delivery/{id}
- 캠페인 상세 정보
- 가이드라인 텍스트
- 요구사항 목록

POST /api/campaigns/delivery/{id}/apply
- 캠페인 신청
```

### **📊 캠페인 관리 페이지** - `/user/campaign_management` (`app/user/campaign_management/page.tsx`)

**사용 컴포넌트**: TabNavigation, StatisticsTab, CampaignList, CampaignCard, PenaltyContent, CampaignTag  
**필요한 API**:

```
GET /api/user/campaigns?status=신청
- 사용자 신청/선정/완료/취소반려 캠페인 목록
- 통계 정보 (신청/선정/완료/취소반려/패널티 개수)

GET /api/user/penalty
- 사용자 현재 패널티 상태 (활동 가능/경고 조치/이용 정지 7일/15일/30일/영구 정지)
- 패널티 내역 목록 (경고/주의/정지/제재)
```

### **👤 마이페이지** - `/user/mypage` (`app/user/mypage/page.tsx`)

**사용 컴포넌트**: TabNavigation  
**필요한 API**:

```
GET /api/user/profile
- 사용자 프로필 정보

PUT /api/user/profile
- 프로필 수정
```

### **💰 포인트 페이지** - `/user/point` (`app/user/point/page.tsx`)

**사용 컴포넌트**: TabNavigation  
**필요한 API**:

```
GET /api/user/points
- 포인트 요약 정보 (총 보유, 출금 가능, 대기 중)
- 포인트 내역 (적립/출금)

POST /api/user/points/withdrawal
- 출금 신청
```

### **📢 공지사항** - `/user/notice` (`app/user/notice/page.tsx`)

**사용 컴포넌트**: MainMenu  
**필요한 API**:

```
GET /api/notices
- 공지사항 목록
```

### **❓ FAQ** - `/user/faq` (`app/user/faq/page.tsx`)

**사용 컴포넌트**: MainMenu  
**필요한 API**:

```
GET /api/faq
- FAQ 목록
```

---

## 📊 **데이터 구조 및 ID 값 설명**

### **📂 data/** 구조

```
data/user/
├── delivery/
│   ├── deliveryCampaigns.ts             # 배송형 캠페인 16개
│   └── deliveryFilterOptions.ts         # 필터 옵션
├── visit/
│   ├── visitCampaigns.ts               # 방문형 캠페인 16개
│   └── visitFilterOptions.ts           # 필터 옵션
├── review/
│   ├── reviewCampaigns.ts              # 구매평 캠페인 16개
│   └── reviewFilterOptions.ts          # 필터 옵션
├── experience/
│   ├── experienceCampaigns.ts          # 체험단 캠페인 16개
│   └── experienceFilterOptions.ts      # 필터 옵션
├── reporter/
│   ├── reporterCampaigns.ts            # 기자단 캠페인 16개
│   └── reporterFilterOptions.ts        # 필터 옵션
└── point/
    └── pointData.ts                     # 포인트 데이터
```

### **🔑 ID 값 설명**

#### **캠페인 ID 형식**

- **배송형**: `delivery_1`, `delivery_2`, ..., `delivery_16`
- **방문형**: `visit_1`, `visit_2`, ..., `visit_16`
- **구매평**: `review_1`, `review_2`, ..., `review_16`
- **체험단**: `experience_1`, `experience_2`, ..., `experience_16`
- **기자단**: `reporter_1`, `reporter_2`, ..., `reporter_16`

#### **사용자 ID**

- **형식**: 숫자형 자동증가 (1, 2, 3, ...)
- **용도**: 사용자 고유 식별자

#### **포인트 내역 ID**

- **형식**: 숫자형 자동증가 (1, 2, 3, ...)
- **용도**: 포인트 거래 내역 고유 식별자

### **📋 주요 데이터 구조**

#### **캠페인 데이터 구조**

```typescript
interface CampaignData {
  id: string; // 캠페인 고유 ID
  title: string; // 캠페인 제목
  category: string; // 캠페인 타입 (배송형, 방문형 등)
  categoryIcon: string; // 카테고리 아이콘 경로
  image: string; // 메인 이미지 경로
  subcategory: string; // 세부 카테고리 (뷰티, 생활 등)
  points: number; // 지급 포인트
  description: string; // 제품 설명
  recruitment: {
    current: number; // 현재 지원자 수
    total: number; // 총 모집 인원
  };
  detailedSchedule: {
    applicationStart: string; // 신청 시작일
    applicationEnd: string; // 신청 마감일
    announcement: string; // 선정 발표일
    purchasePeriod: string; // 구매 기간
    registrationPeriod: string; // 등록 기간
  };
  channel: string; // 채널 정보
  keyword: string; // 캠페인 키워드
  promotionLink?: string; // 홍보링크
  requirements: string[]; // 요구사항 목록
  guidelineTexts: string[]; // 가이드라인 텍스트
}
```

#### **패널티 데이터 구조**

```typescript
interface PenaltyHistory {
  id: string; // 패널티 내역 ID
  type: "경고" | "주의" | "정지" | "제재"; // 패널티 분류
  title: string; // 패널티 제목/사유
  date: string; // 발생 날짜 (YYYY-MM-DD 형식)
  campaign_id?: string; // 관련 캠페인 ID
}

interface UserPenaltyStatus {
  currentStatus:
    | "활동 가능"
    | "경고 조치"
    | "이용 정지 7일"
    | "이용 정지 15일"
    | "이용 정지 30일"
    | "영구 정지";
  penaltyCount: number; // 총 패널티 횟수
}
```

#### **포인트 데이터 구조**

```typescript
interface PointHistory {
  id: string; // 포인트 내역 ID
  type: "earned" | "withdrawn"; // 적립/출금 타입
  amount: number; // 포인트 금액
  description: string; // 내역 설명
  campaign_id?: string; // 관련 캠페인 ID
  date: string; // 날짜
  status: "earned" | "completed" | "pending" | "failed";
  balance: number; // 거래 후 잔액
}
```

---

## 🔄 **컴포넌트 재사용성 및 중요도**

### **가장 많이 재사용되는 컴포넌트 (백엔드 개발 시 우선순위)**

1. **MainMenu** - 15개 페이지에서 사용 ⭐⭐⭐
2. **CampaignBox** - 6개 페이지에서 사용 ⭐⭐⭐
3. **FilterBar** - 5개 페이지에서 사용 ⭐⭐
4. **TabNavigation** - 2개 페이지에서 사용 ⭐⭐

### **페이지별 전용 컴포넌트**

- **캠페인 상세**: DetailHeader, DetailImage, DetailProductInfo 등
- **캠페인 관리**: StatisticsTab, CampaignList, PenaltyContent 등
- **필터링**: ModalFilter, RegionFilter

---

## 🛠️ **백엔드 개발 시 참고사항**

### **API 개발 우선순위**

1. **1순위**: 캠페인 목록 API (5개 타입별)
2. **2순위**: 캠페인 상세 API (5개 타입별)
3. **3순위**: 사용자 관련 API (캠페인 관리, 포인트)
4. **4순위**: 인증/인가 API

### **데이터베이스 설계 시 주의사항**

- **캠페인 ID**: 문자열 형식 (`delivery_1`, `visit_2` 등)
- **사용자 ID**: 숫자형 자동증가
- **포인트**: 정수형 (원 단위)
- **날짜**: ISO 8601 형식 (`2025-01-20`)
- **패널티 상태**: enum 타입 (활동 가능, 경고 조치, 이용 정지 7일/15일/30일, 영구 정지)
- **패널티 타입**: enum 타입 (경고, 주의, 정지, 제재)

### **API 응답 형식**

```json
{
  "success": true,
  "data": {
    // 실제 데이터
  },
  "message": "성공",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

---

## 📝 **주요 타입 정의 (백엔드 개발 참고)**

### **캠페인 관련 타입**

```typescript
// 캠페인 타입
type CampaignType = "배송형" | "방문형" | "구매평" | "체험단" | "기자단";

// 캠페인 상태
type CampaignStatus = "신청" | "선정" | "완료" | "취소/반려";

// 필터 옵션
type FilterCategory =
  | "전체"
  | "식품"
  | "뷰티"
  | "가전"
  | "유아동"
  | "여가"
  | "서비스"
  | "생활"
  | "패션"
  | "가구"
  | "디지털"
  | "문화"
  | "반려동물"
  | "기타";
type FilterChannel =
  | "네이버 블로그"
  | "네이버 클립"
  | "인스타그램"
  | "릴스"
  | "유튜브"
  | "쇼츠";
type SortOption = "최신순" | "인기순" | "마감임박순" | "포인트순";
```

### **사용자 관련 타입**

```typescript
// 캠페인 관리 탭
type MainTab = "campaign" | "point" | "account" | "community";
type StatTab = "신청" | "선정" | "완료" | "취소/반려" | "패널티";

// 패널티 관련
type PenaltyStatus =
  | "활동 가능"
  | "경고 조치"
  | "이용 정지 7일"
  | "이용 정지 15일"
  | "이용 정지 30일"
  | "영구 정지";

type PenaltyType = "경고" | "주의" | "정지" | "제재";

// 포인트 관련
type PointType = "earned" | "withdrawn";
type PointStatus = "earned" | "completed" | "pending" | "failed";
```

---

## 🚀 **백엔드 개발 체크리스트**

### **필수 구현 API**

- [ ] `GET /api/campaigns/main` - 메인 페이지 캠페인 목록
- [ ] `GET /api/campaigns/{type}` - 캠페인 목록 (5개 타입)
- [ ] `GET /api/campaigns/{type}/filters` - 필터 옵션
- [ ] `GET /api/campaigns/{type}/{id}` - 캠페인 상세
- [ ] `POST /api/campaigns/{type}/{id}/apply` - 캠페인 신청
- [ ] `GET /api/user/campaigns` - 사용자 캠페인 목록
- [ ] `GET /api/user/penalty` - 패널티 현황 및 내역
- [ ] `GET /api/user/points` - 포인트 정보
- [ ] `POST /api/user/points/withdrawal` - 출금 신청
- [ ] `POST /api/auth/login` - 로그인
- [ ] `POST /api/auth/register` - 회원가입

### **데이터베이스 테이블**

- [ ] `campaigns` - 캠페인 정보
- [ ] `users` - 사용자 정보
- [ ] `campaign_applications` - 캠페인 신청
- [ ] `penalty_history` - 패널티 내역
- [ ] `point_history` - 포인트 내역
- [ ] `withdrawal_requests` - 출금 신청

### **보안 및 인증**

- [ ] JWT 토큰 구현
- [ ] Spring Security 설정
- [ ] API 권한 관리
- [ ] Rate Limiting 적용

---
