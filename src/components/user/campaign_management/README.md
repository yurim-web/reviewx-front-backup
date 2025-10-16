# ReviewX 프로젝트 개발 참고서

## 📁 **파일 구조**

```
reviewx-web/
├── src/
│   ├── app/                          # 페이지 (Next.js App Router)
│   │   ├── page.tsx                  # 메인 홈
│   │   ├── user/                      # 사용자 관련 페이지
│   │   │   ├── delivery/              # 배송형 캠페인
│   │   │   ├── visit/                 # 방문형 캠페인
│   │   │   ├── review/                # 구매평 캠페인
│   │   │   ├── experience/            # 체험단 캠페인
│   │   │   ├── reporter/              # 기자단 캠페인
│   │   │   ├── mypage/                # 마이페이지
│   │   │   ├── point/                 # 포인트
│   │   │   ├── notice/                # 공지사항
│   │   │   └── faq/                   # FAQ
│   │   ├── campaign/[id]/            # 캠페인 상세
│   │   ├── campaign_management/      # 캠페인 관리
│   │   └── guide/                    # 가이드
│   ├── components/                   # 컴포넌트
│   │   ├── main/                     # 메인 페이지용
│   │   ├── campaign/                 # 캠페인 공통
│   │   ├── campaign_detail/          # 캠페인 상세용
│   │   ├── campaign_management/      # 캠페인 관리용
│   │   ├── filter/                   # 필터링
│   │   └── fragments/                # 공통 조각
│   ├── data/                         # 데이터
│   ├── styles/                       # CSS 파일
│   └── types/                        # 타입 정의
└── public/                           # 이미지 등 정적 파일
```

---

## 🧩 **컴포넌트 목록**

### **📂 main/** - 메인 페이지용

| 컴포넌트    | 파일              | 용도                           |
| ----------- | ----------------- | ------------------------------ |
| MainMenu    | `MainMenu.tsx`    | 상단 네비게이션 메뉴           |
| CampaignBox | `CampaignBox.tsx` | 캠페인 카드 (가장 많이 사용됨) |
| Titletext   | `Titletext.tsx`   | 페이지 제목                    |

### **📂 campaign/** - 캠페인 공통

| 컴포넌트              | 파일                        | 용도               |
| --------------------- | --------------------------- | ------------------ |
| CampaignDetail        | `CampaignDetail.tsx`        | 캠페인 기본 정보   |
| ApplicationModal      | `ApplicationModal.tsx`      | 지원 모달 (기본형) |
| ApplicationModalType2 | `ApplicationModalType2.tsx` | 지원 모달 (타입2)  |
| ApplicationModalType3 | `ApplicationModalType3.tsx` | 지원 모달 (타입3)  |
| AdditionalGuidelines  | `AdditionalGuidelines.tsx`  | 추가 가이드라인    |

### **📂 campaign_detail/** - 캠페인 상세용

| 컴포넌트                          | 파일                                    | 용도                |
| --------------------------------- | --------------------------------------- | ------------------- |
| DetailHeader                      | `DetailHeader.tsx`                      | 상세 페이지 헤더    |
| DetailImage                       | `DetailImage.tsx`                       | 이미지 갤러리       |
| DetailProductInfo                 | `DetailProductInfo.tsx`                 | 제품 정보           |
| DetailScheduleInfo                | `DetailScheduleInfo.tsx`                | 일정 정보           |
| DetailGuidelinesSection           | `DetailGuidelinesSection.tsx`           | 가이드라인 (기본)   |
| DetailGuidelinesSectionDelivery   | `DetailGuidelinesSectionDelivery.tsx`   | 가이드라인 (배송형) |
| DetailGuidelinesSectionVisit      | `DetailGuidelinesSectionVisit.tsx`      | 가이드라인 (방문형) |
| DetailGuidelinesSectionReview     | `DetailGuidelinesSectionReview.tsx`     | 가이드라인 (구매평) |
| DetailGuidelinesSectionExperience | `DetailGuidelinesSectionExperience.tsx` | 가이드라인 (체험단) |
| DetailGuidelinesSectionReporter   | `DetailGuidelinesSectionReporter.tsx`   | 가이드라인 (기자단) |

### **📂 campaign_management/** - 캠페인 관리용

| 컴포넌트       | 파일                 | 용도                                     |
| -------------- | -------------------- | ---------------------------------------- |
| TabNavigation  | `TabNavigation.tsx`  | 메인 탭 (캠페인/포인트/계정/커뮤니티)    |
| StatisticsTab  | `StatisticsTab.tsx`  | 통계 탭 (신청/선정/완료/취소반려/패널티) |
| CampaignList   | `CampaignList.tsx`   | 캠페인 목록 컨테이너                     |
| CampaignCard   | `CampaignCard.tsx`   | 개별 캠페인 카드                         |
| PenaltyContent | `PenaltyContent.tsx` | 패널티 내역 화면                         |
| CampaignTag    | `CampaignTag.tsx`    | 태그들 (마감임박, 타입 등)               |

### **📂 filter/** - 필터링

| 컴포넌트     | 파일               | 용도         |
| ------------ | ------------------ | ------------ |
| FilterBar    | `FilterBar.tsx`    | 필터/정렬 바 |
| ModalFilter  | `ModalFilter.tsx`  | 모달 필터    |
| RegionFilter | `RegionFilter.tsx` | 지역 필터    |

### **📂 fragments/** - 공통 조각

| 컴포넌트  | 파일            | 용도      |
| --------- | --------------- | --------- |
| Header    | `Header.tsx`    | 공통 헤더 |
| SubHeader | `SubHeader.tsx` | 서브 헤더 |

---

## 📄 **페이지별 사용 컴포넌트**

### **🏠 메인 페이지** - `app/page.tsx`

- **컴포넌트**: MainMenu, CampaignBox, Titletext
- **데이터**: `mainFirstCampaigns`, `mainSecondCampaigns`
- **CSS**: `home/home.module.css`

### **📦 배송형 페이지** - `app/user/delivery/page.tsx`

- **컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext
- **데이터**: `deliveryCampaigns`, `deliveryFilterOptions`
- **CSS**: `delivery/delivery.module.css`

### **📍 방문형 페이지** - `app/user/visit/page.tsx`

- **컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext
- **데이터**: `visitCampaigns`, `visitFilterOptions`
- **CSS**: `delivery/delivery.module.css` (공통 사용)

### **🛒 구매평 페이지** - `app/user/review/page.tsx`

- **컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext
- **데이터**: `reviewCampaigns`, `reviewFilterOptions`
- **CSS**: `delivery/delivery.module.css` (공통 사용)

### **🎯 체험단 페이지** - `app/user/experience/page.tsx`

- **컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext
- **데이터**: `experienceCampaigns`, `experienceFilterOptions`
- **CSS**: `delivery/delivery.module.css` (공통 사용)

### **📰 기자단 페이지** - `app/user/reporter/page.tsx`

- **컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext
- **데이터**: `reporterCampaigns`, `reporterFilterOptions`
- **CSS**: `delivery/delivery.module.css` (공통 사용)

### **🔍 캠페인 상세** - `app/user/delivery/[id]/page.tsx` (각 타입별로 분산)

- **컴포넌트**: MainMenu, Header, SubHeader, DetailHeader, DetailImage, DetailProductInfo, DetailScheduleInfo, DetailGuidelinesSection, ApplicationModal
- **CSS**: `campaign/campaign_detail.module.css`

### **📊 캠페인 관리** - `app/user/campaign_management/page.tsx`

- **컴포넌트**: TabNavigation, StatisticsTab, CampaignList, CampaignCard, PenaltyContent, CampaignTag
- **CSS**: `campaign_management/campaign_management.module.css`, `campaign_management/penalty.module.css`

### **👤 마이페이지** - `app/user/mypage/page.tsx`

- **컴포넌트**: TabNavigation
- **특별기능**: 외부 링크 (이용가이드, 카카오톡 상담 새창 열림)
- **CSS**: `mypage/mypage.module.css`

### **💰 포인트 페이지** - `app/user/point/page.tsx`

- **컴포넌트**: MainMenu
- **데이터**: `pointData`
- **CSS**: `point/point.module.css`

### **📢 공지사항** - `app/user/notice/page.tsx`

- **컴포넌트**: MainMenu
- **CSS**: `notice/notice.module.css`

### **❓ FAQ** - `app/user/faq/page.tsx`

- **컴포넌트**: MainMenu
- **CSS**: `faq/faq.module.css`

---

## 🎨 **CSS 파일 위치 및 용도**

### **📂 styles/** 구조

```
styles/
├── campaign/
│   ├── application_modal.module.css     # 지원 모달
│   ├── campaign_box.module.css          # 캠페인 카드 (가장 많이 사용)
│   └── campaign_detail.module.css       # 캠페인 상세
├── campaign_management/
│   ├── campaign_management.module.css   # 캠페인 관리 메인
│   └── penalty.module.css               # 패널티 화면
├── delivery/
│   └── delivery.module.css              # 모든 캠페인 페이지 공통
├── filter/
│   └── filter_bar.module.css            # 필터 바
├── fragments/
│   └── sub_header.module.css            # 서브 헤더
├── home/
│   ├── home.module.css                  # 메인 페이지
│   ├── text.module.css                  # 텍스트 스타일
│   └── tablet/                          # 태블릿 반응형
├── mypage/
│   ├── mypage.module.css                # 마이페이지
│   └── edit_profile.module.css          # 프로필 편집
├── point/
│   ├── point.module.css                 # 포인트
│   └── withdrawal_request.module.css    # 출금 신청
├── notice/
│   └── notice.module.css                # 공지사항
├── faq/
│   └── faq.module.css                   # FAQ
├── error_page/
│   ├── error.module.css                 # 에러
│   ├── loading.module.css               # 로딩
│   └── not_found.module.css             # 404
└── header.module.css                    # 공통 헤더
```

### **CSS 사용 빈도**

1. **delivery.module.css** - 5개 캠페인 페이지 공통 사용 ⭐
2. **campaign_box.module.css** - 6개 페이지에서 사용
3. **filter_bar.module.css** - 5개 캠페인 페이지에서 사용
4. **header.module.css** - 거의 모든 페이지에서 사용

---

## 📊 **데이터 파일 위치 및 구조**

### **📂 data/** 구조

```
data/
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

### **데이터 구조**

- **캠페인 데이터**: 각 타입별로 16개씩 목업 데이터
- **필터 옵션**: 카테고리, 채널, 정렬 옵션
- **포인트 데이터**: 포인트 내역 및 출금 데이터

---

## 🔄 **컴포넌트 재사용성**

### **가장 많이 재사용되는 컴포넌트**

1. **MainMenu** - 15개 페이지에서 사용
2. **CampaignBox** - 6개 페이지에서 사용
3. **FilterBar** - 5개 페이지에서 사용
4. **TabNavigation** - 2개 페이지에서 사용

### **페이지별 전용 컴포넌트**

- **캠페인 상세**: DetailHeader, DetailImage, DetailProductInfo 등
- **캠페인 관리**: StatisticsTab, CampaignList, PenaltyContent 등
- **필터링**: ModalFilter, RegionFilter

---

## 🛠️ **개발 시 참고사항**

### **새 캠페인 타입 추가 시**

1. `data/새타입/` 폴더 생성
2. 캠페인 데이터 + 필터 옵션 파일 생성
3. `app/새타입/` 페이지 생성
4. 기존 컴포넌트 (FilterBar, CampaignBox) 재사용
5. `delivery.module.css` 공통 CSS 사용

### **새 컴포넌트 추가 시**

1. 적절한 폴더에 배치 (main, campaign, filter 등)
2. 대응하는 CSS 모듈 생성
3. 타입 정의 추가

### **네이밍 규칙**

- **컴포넌트**: PascalCase (`CampaignBox`)
- **CSS 클래스**: snake_case (`campaign_box`)
- **파일명**: camelCase (`campaignBox.module.css`)

---

## 📝 **타입 정의**

### **주요 타입**

```typescript
// 캠페인 관리
type MainTab = "campaign" | "point" | "account" | "community";
type StatTab = "신청" | "선정" | "완료" | "취소/반려" | "패널티";

// 캠페인 타입
type CampaignType = "배송형" | "방문형" | "구매평" | "체험단" | "기자단";

// 캠페인 상태
type CampaignStatus = "신청" | "선정" | "완료" | "취소/반려";
```

---
