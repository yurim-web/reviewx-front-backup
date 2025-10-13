# 캠페인 관리 컴포넌트 구조

캠페인 관리 페이지의 컴포넌트들을 역할별로 분리하여 구성했습니다.

## 📁 파일 구조

```
src/
├── app/
│   └── campaign_management/
│       └── page.tsx                    # 메인 페이지 (최상위)
├── components/
│   └── campaign_management/
│       ├── TabNavigation.tsx           # 상단 탭 (캠페인/포인트/계정/커뮤니티)
│       ├── StatisticsTab.tsx           # 통계 탭 (신청/선정/완료/취소반려/패널티)
│       ├── CampaignList.tsx            # 캠페인 목록 컨테이너
│       ├── CampaignCard.tsx            # 개별 캠페인 카드
│       ├── PenaltyContent.tsx          # 패널티 내역 화면
│       ├── CampaignTag.tsx             # 태그 컴포넌트들 (마감임박, 타입 등)
│       └── README.md                   # 이 파일
├── types/
│   └── campaignManagement.ts           # 타입 정의
└── styles/
    └── campaign_management/
        └── campaign_management.module.css
```

## 🧩 컴포넌트 설명

### 1. **page.tsx** (메인 페이지)

- 역할: 최상위 페이지, 상태 관리 및 데이터 제공
- 상태 관리:
  - `activeTab`: 메인 탭 (campaign/point)
  - `activeStatTab`: 통계 탭 (신청/선정/완료/취소반려/패널티)
- 목업 데이터: `mockApplications` (실제로는 API에서 가져올 데이터)

### 2. **TabNavigation.tsx**

- 역할: 상단 메인 탭 네비게이션
- 탭: 캠페인, 포인트, 계정, 커뮤니티
- Props:
  - `activeTab`: 현재 활성 탭
  - `setActiveTab`: 탭 변경 함수

### 3. **StatisticsTab.tsx**

- 역할: 캠페인 상태별 통계 탭
- 탭: 신청, 선정, 완료, 취소/반려, 패널티
- 각 탭에 개수 표시
- Props:
  - `activeStatTab`: 현재 활성 통계 탭
  - `setActiveStatTab`: 탭 변경 함수
  - `stats`: 상태별 캠페인 개수

### 4. **CampaignList.tsx**

- 역할: 캠페인 목록 필터링 및 렌더링
- 기능:
  - 패널티 탭이면 `PenaltyContent` 표시
  - 그 외 탭이면 상태에 맞는 캠페인 필터링 후 `CampaignCard` 렌더링
  - 빈 상태 메시지 표시
- Props:
  - `campaigns`: 전체 캠페인 배열
  - `activeStatTab`: 현재 선택된 통계 탭

### 5. **CampaignCard.tsx**

- 역할: 개별 캠페인 정보 카드
- 기능:
  - 캠페인 정보 표시 (제목, 카테고리, 남은 일수 등)
  - 탭 상태에 따라 다른 버튼 표시
    - 신청: "신청 취소하기"
    - 선정: "콘텐츠 등록하기" / "콘텐츠 수정하기"
    - 완료: "콘텐츠 확인하기"
    - 취소/반려: "콘텐츠 재등록하기" / "패널티 내역보기"
  - 버튼 스타일 자동 결정 (primary/default/secondary/danger)
- Props:
  - `campaign`: 캠페인 데이터
  - `activeTab`: 현재 활성 탭

### 6. **PenaltyContent.tsx**

- 역할: 패널티 탭 내용
- 구성:
  - 패널티 단계 (진행 바)
  - 패널티 내역 리스트 (-3점 뱃지 포함)

### 7. **CampaignTag.tsx**

- 역할: 작은 태그/아이콘 컴포넌트들
- 컴포넌트:
  - `CamTag`: 마감임박 / D-day 태그
  - `CamType`: 배송형/방문형 태그
  - `CamIcon`: 브랜드 아이콘
  - `CamCateIcon`: 아이콘 + 타입 조합

## 📊 데이터 타입 (types/campaignManagement.ts)

```typescript
// 캠페인 정보
interface CampaignApplication {
  id: string;
  title: string;
  category: string;
  status: "신청" | "선정" | "완료" | "취소/반려";
  type: "배송형" | "방문형";
  subStatus?: "content_not_registered" | "content_registered" | ...;
  // ...
}

// 통계
interface CampaignStats {
  신청: number;
  선정: number;
  완료: number;
  "취소/반려": number;
  패널티: number;
}

// 탭 타입
type MainTab = "campaign" | "point";
type StatTab = "신청" | "선정" | "완료" | "취소/반려" | "패널티";
```

## 🎨 버튼 스타일 종류

1. **primary_button** (검은 배경)

   - 콘텐츠 등록하기
   - 콘텐츠 재등록하기
   - 패널티 해제하기

2. **default_button** (검은 테두리)

   - 신청 취소하기
   - 콘텐츠 수정하기
   - 캠페인 진행하기

3. **secondary_button** (회색 테두리)

   - 콘텐츠 확인하기

4. **danger_button** (빨간 테두리)
   - 콘텐츠 반려 사유보기
   - 패널티 내역보기

## 🔄 데이터 흐름

```
page.tsx (데이터 & 상태)
  ↓
  ├─→ TabNavigation (메인 탭)
  ├─→ StatisticsTab (통계 탭)
  └─→ CampaignList (목록 필터링)
        ├─→ CampaignCard (개별 카드)
        │     └─→ CampaignTag (태그들)
        └─→ PenaltyContent (패널티 화면)
```

## 🚀 사용 방법

```tsx
// page.tsx에서 사용
<TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
<StatisticsTab
  activeStatTab={activeStatTab}
  setActiveStatTab={setActiveStatTab}
  stats={mockStats}
/>
<CampaignList campaigns={mockApplications} activeStatTab={activeStatTab} />
```

## 📝 TODO

- [ ] API 연동 (mockApplications → 실제 API 호출)
- [ ] 캠페인 이미지 추가
- [ ] 버튼 클릭 이벤트 핸들러 구현
- [ ] 포인트 탭 구현
- [ ] 계정/커뮤니티 탭 구현
- [ ] 패널티 데이터 동적 처리
