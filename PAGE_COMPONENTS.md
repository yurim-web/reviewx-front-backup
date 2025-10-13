# 페이지별 사용 컴포넌트 정리

## 📄 페이지별 컴포넌트 구성

---

## 🏠 **메인 페이지**

**파일**: `src/app/page.tsx`

### 사용 컴포넌트:

- **`MainMenu`** - 상단 네비게이션 메뉴
- **`CampaignBox`** - 캠페인 카드 표시
- **`Titletext`** - 페이지 제목

### 사용 데이터:

- `mainFirstCampaigns` - 첫 번째 섹션 캠페인 데이터
- `mainSecondCampaigns` - 두 번째 섹션 캠페인 데이터

---

## 📦 **배송형 페이지**

**파일**: `src/app/delivery/page.tsx`

### 사용 컴포넌트:

- **`MainMenu`** - 상단 네비게이션 메뉴
- **`FilterBar`** - 필터/정렬 바
- **`CampaignBox`** - 캠페인 카드 표시
- **`Titletext`** - 페이지 제목

### 사용 데이터:

- `deliveryCampaigns` - 배송형 캠페인 데이터 (16개)
- `deliveryCategoryOptions` - 카테고리 필터 옵션
- `deliveryChannelOptions` - 채널 필터 옵션
- `deliverySortOptions` - 정렬 옵션

### 필터 기능:

- 카테고리, 채널, 정렬 필터
- 선택된 필터 태그 표시

---

## 📍 **방문형 페이지**

**파일**: `src/app/visit/page.tsx`

### 사용 컴포넌트:

- **`MainMenu`** - 상단 네비게이션 메뉴
- **`FilterBar`** - 필터/정렬 바
- **`CampaignBox`** - 캠페인 카드 표시
- **`Titletext`** - 페이지 제목

### 사용 데이터:

- `visitCampaigns` - 방문형 캠페인 데이터 (16개)
- `visitCategoryOptions` - 카테고리 필터 옵션
- `visitChannelOptions` - 채널 필터 옵션
- `visitSortOptions` - 정렬 옵션

### 필터 기능:

- 카테고리, 채널, 정렬 필터
- 선택된 필터 태그 표시

---

## 🛒 **구매평 페이지**

**파일**: `src/app/review/page.tsx`

### 사용 컴포넌트:

- **`MainMenu`** - 상단 네비게이션 메뉴
- **`FilterBar`** - 필터/정렬 바
- **`CampaignBox`** - 캠페인 카드 표시
- **`Titletext`** - 페이지 제목

### 사용 데이터:

- `reviewCampaigns` - 구매평 캠페인 데이터 (16개)
- `reviewCategoryOptions` - 카테고리 필터 옵션
- `reviewChannelOptions` - 채널 필터 옵션
- `reviewSortOptions` - 정렬 옵션

### 필터 기능:

- 카테고리, 채널, 정렬 필터
- 선택된 필터 태그 표시

---

## 🎯 **체험단 페이지**

**파일**: `src/app/experience/page.tsx`

### 사용 컴포넌트:

- **`MainMenu`** - 상단 네비게이션 메뉴
- **`FilterBar`** - 필터/정렬 바
- **`CampaignBox`** - 캠페인 카드 표시
- **`Titletext`** - 페이지 제목

### 사용 데이터:

- `experienceCampaigns` - 체험단 캠페인 데이터 (16개)
- `experienceCategoryOptions` - 카테고리 필터 옵션
- `experienceChannelOptions` - 채널 필터 옵션
- `experienceSortOptions` - 정렬 옵션

### 필터 기능:

- 카테고리, 채널, 정렬 필터
- 선택된 필터 태그 표시

---

## 📰 **기자단 페이지**

**파일**: `src/app/reporter/page.tsx`

### 사용 컴포넌트:

- **`MainMenu`** - 상단 네비게이션 메뉴
- **`FilterBar`** - 필터/정렬 바
- **`CampaignBox`** - 캠페인 카드 표시
- **`Titletext`** - 페이지 제목

### 사용 데이터:

- `reporterCampaigns` - 기자단 캠페인 데이터 (16개)
- `reporterCategoryOptions` - 카테고리 필터 옵션
- `reporterChannelOptions` - 채널 필터 옵션
- `reporterSortOptions` - 정렬 옵션

### 필터 기능:

- 카테고리, 채널, 정렬 필터
- 선택된 필터 태그 표시

---

## 👤 **마이페이지**

**파일**: `src/app/mypage/page.tsx`

### 사용 컴포넌트:

- **`MainMenu`** - 상단 네비게이션 메뉴

### 주요 기능:

- 프로필 정보 표시
- 채널 & 스토어 탭
- 메뉴 항목들 (공지사항, FAQ 등)

---

## ✏️ **프로필 편집 페이지**

**파일**: `src/app/mypage/edit/page.tsx`

### 사용 컴포넌트:

- **`MainMenu`** - 상단 네비게이션 메뉴

### 주요 기능:

- 프로필 정보 편집 폼
- 이미지 업로드 기능

---

## 📢 **공지사항 페이지**

**파일**: `src/app/notice/page.tsx`

### 사용 컴포넌트:

- **`MainMenu`** - 상단 네비게이션 메뉴

### 주요 기능:

- 뒤로가기 버튼
- 카테고리 필터 (전체, 공지, 이벤트)
- 공지사항 목록

---

## ❓ **FAQ 페이지**

**파일**: `src/app/faq/page.tsx`

### 사용 컴포넌트:

- **`MainMenu`** - 상단 네비게이션 메뉴

### 주요 기능:

- 뒤로가기 버튼
- 카테고리 필터 (전체, 이용방법, 결제, 기타)
- 아코디언 형태의 Q&A

---

## 📖 **가이드 페이지**

**파일**: `src/app/guide/page.tsx`

### 사용 컴포넌트:

- **`MainMenu`** - 상단 네비게이션 메뉴

### 주요 기능:

- 서비스 이용 가이드
- 단계별 설명

---

## 🔍 **캠페인 상세 페이지들**

### **일반 캠페인 상세**

**파일**: `src/app/campaign/[id]/page.tsx`

### **배송형 상세**

**파일**: `src/app/delivery/[id]/page.tsx`

### **방문형 상세**

**파일**: `src/app/visit/[id]/page.tsx`

### **체험단 상세**

**파일**: `src/app/experience/[id]/page.tsx`

### 사용 컴포넌트:

- **`MainMenu`** - 상단 네비게이션 메뉴
- **`Header`** - 상세 페이지 헤더
- **`SubHeader`** - 서브 헤더

### 주요 기능:

- 캠페인 상세 정보 표시
- 지원하기 버튼
- 관련 이미지들

---

## 📊 **컴포넌트 사용 빈도 통계**

### **가장 많이 사용되는 컴포넌트:**

1. **`MainMenu`** - 모든 페이지에서 사용 (100%)
2. **`FilterBar`** - 5개 캠페인 페이지에서 사용
3. **`CampaignBox`** - 6개 페이지에서 사용 (메인 + 5개 캠페인)
4. **`Titletext`** - 6개 페이지에서 사용 (메인 + 5개 캠페인)

### **페이지별 특수 컴포넌트:**

- **상세 페이지들**: `Header`, `SubHeader`
- **마이페이지**: 프로필 관련 커스텀 컴포넌트들
- **공지사항/FAQ**: 아코디언, 카테고리 필터

---

## 🎨 **스타일 파일 매핑**

### **공통 스타일:**

- `delivery.module.css` - 모든 캠페인 페이지에서 공유 사용
- `campaign_box.module.css` - CampaignBox 컴포넌트
- `filter_bar.module.css` - FilterBar 컴포넌트

### **페이지별 전용 스타일:**

- `mypage.module.css` - 마이페이지
- `notice.module.css` - 공지사항
- `faq.module.css` - FAQ
- `home.module.css` - 메인 페이지

---

## 🔄 **데이터 흐름**

### **캠페인 페이지들:**

```
데이터 파일 → 페이지 컴포넌트 → CampaignBox → 상세 페이지
```

### **필터 시스템:**

```
FilterOptions → FilterBar → ModalFilter → 필터 상태 업데이트
```
