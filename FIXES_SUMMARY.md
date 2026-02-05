# 대기 탭 카드 수정 완료 요약

## 수정된 문제들

### 문제 1: 하단 border 문제 ✅ 완료
**문제**: 대기 탭의 모든 카드에서 하단 border가 없었음
**해결**:
- 신고 카드만 `borderBottom: "none"` 적용
- 나머지 모든 카드는 `borderBottom: "1px solid #d9d9d9"` 적용

**수정된 파일**:
- `ExperiencePendingCard.tsx` - 신고 상태일 때만 borderBottom: none, 나머지는 border 추가
- `ExperienceInspectionCard.tsx` - borderBottom 추가
- `ExperienceCompletedCard.tsx` - borderBottom 추가 (footer 있을 때만)
- `MissionPendingCard.tsx` - 신고 상태일 때만 borderBottom: none, 나머지는 border 추가
- `MissionInspectionCard.tsx` - borderBottom 추가
- `MissionCompletedCard.tsx` - borderBottom 추가
- `PurchaseFirstPendingCard.tsx` - 신고 상태일 때만 borderBottom: none, 나머지는 border 추가
- `PurchaseFirstInspectionCard.tsx` - borderBottom 추가
- `PurchaseFirstCompletedCard.tsx` - borderBottom 추가

### 문제 2: 신고 카드의 시간 표시 형식 ✅ 완료
**문제**: 신고 카드에서 시간이 이상하게 표시됨
**해결**: reportedDate를 "YYYY-MM-DD HH:mm 신고" 형식으로 표시

**예시**:
```typescript
// 신고 날짜/시간을 현재 시간으로 설정 (YYYY-MM-DD HH:mm 형식)
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");
const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
```

**수정된 파일**:
- `ExperiencePendingCard.tsx`
- `MissionPendingCard.tsx`
- `PurchaseFirstPendingCard.tsx`

### 문제 3: 링크확인/이미지확인 버튼 기능 구현 ✅ 완료

#### 링크확인 버튼:
**기능**: 새 창에서 채널 URL 열기
```typescript
const url = getChannelUrl(applicant.channel, applicant.channelId);
if (url && url !== "#") {
  window.open(url, "_blank", "noopener,noreferrer");
}
```

#### 이미지확인 버튼:
**기능**: ReceiptPreviewModal 컴포넌트 사용하여 이미지 표시
```typescript
// 버튼 클릭 시
setIsReceiptModalOpen(true);

// 모달 컴포넌트
{applicant.receiptImages && applicant.receiptImages.length > 0 && (
  <ReceiptPreviewModal
    isOpen={isReceiptModalOpen}
    images={applicant.receiptImages}
    onClose={() => setIsReceiptModalOpen(false)}
  />
)}
```

**수정된 파일**:

**경험형 카드 (배송형, 방문형, 기자단)**:
- `ExperienceInspectionCard.tsx` - ReceiptPreviewModal 추가, 이미지 있으면 "이미지 확인", 없으면 "링크 확인"
- `ExperienceCompletedCard.tsx` - 동일

**미션형 카드**:
- `MissionInspectionCard.tsx` - contentType에 따라 링크/이미지 버튼 기능 구현
- `MissionCompletedCard.tsx` - 동일

**구매평 카드**:
- `PurchaseFirstInspectionCard.tsx` - "이미지 확인" 버튼으로 영수증 이미지 표시
- `PurchaseFirstCompletedCard.tsx` - 동일

## 타입 정의 업데이트 ✅ 완료

**파일**: `ExperienceTypes.ts`

추가된 필드:
```typescript
export interface ExperienceApplicant {
  // ... 기존 필드들
  /** 영수증 이미지 URL 배열 (이미지 확인 버튼용) */
  receiptImages?: string[];
}
```

## 테스트 데이터 추가 ✅ 일부 완료

**파일**: `deliveryCampaigns.ts`

테스트 캠페인 `delivery_test_all_cases`에 receiptImages 추가:
- reviewing 탭: 2개 이미지
- completed 탭: 1개 이미지

**예시 URL**:
```typescript
receiptImages: [
  "https://via.placeholder.com/800x600/FFB6C1/FFFFFF?text=Receipt+Image+1",
  "https://via.placeholder.com/800x600/87CEEB/FFFFFF?text=Receipt+Image+2",
]
```

## 추가 작업 필요 ⚠️

다음 파일들에 동일한 수정 적용 필요:

### Purchase Second 카드:
- `c:\develop\reviewx-web\src\components\partner\campaign_contents\card_type\purchase_card\purchase_second_card\PurchaseSecondPendingCard.tsx`
- `c:\develop\reviewx-web\src\components\partner\campaign_contents\card_type\purchase_card\purchase_second_card\PurchaseSecondInspectionCard.tsx`
- `c:\develop\reviewx-web\src\components\partner\campaign_contents\card_type\purchase_card\purchase_second_card\PurchaseSecondCompletedCard.tsx`

### 테스트 데이터:
다음 캠페인 데이터에 receiptImages 추가 필요:
- `visit_test_all_cases` (visitCampaigns.ts)
- `reporter_test_all_cases` (reporterCampaigns.ts)
- `review_test_1st_all_cases` (reviewCampaigns.ts)
- `review_test_2nd_all_cases` (reviewCampaigns.ts)
- `mission_test_both_all_cases` (missionCampaigns.ts)
- `mission_test_link_all_cases` (missionCampaigns.ts)
- `mission_test_image_all_cases` (missionCampaigns.ts)

## 수정 패턴

모든 카드에 동일하게 적용된 패턴:

1. **Import 추가**:
```typescript
import ReceiptPreviewModal from "../../ReceiptPreviewModal";
import { getChannelUrl } from "@/utils/helpers/url"; // 링크 확인용
```

2. **State 추가**:
```typescript
const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
```

3. **Border 스타일 추가**:
```typescript
// Pending 카드
style={
  localPendingState === "reported"
    ? { minHeight: "190px", borderBottom: "none" }
    : { borderBottom: "1px solid #d9d9d9" }
}

// Inspection/Completed 카드
style={{ borderBottom: "1px solid #d9d9d9" }}
```

4. **버튼 핸들러 수정**:
```typescript
// 이미지 확인
onClick={() => setIsReceiptModalOpen(true)}

// 링크 확인
onClick={() => {
  const url = getChannelUrl(applicant.channel, applicant.channelId);
  if (url && url !== "#") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}}
```

5. **모달 추가**:
```typescript
{applicant.receiptImages && applicant.receiptImages.length > 0 && (
  <ReceiptPreviewModal
    isOpen={isReceiptModalOpen}
    images={applicant.receiptImages}
    onClose={() => setIsReceiptModalOpen(false)}
  />
)}
```

## 검증 체크리스트

- [x] 신고 카드만 하단 border 없음
- [x] 나머지 모든 카드는 하단 border 있음
- [x] 신고 카드 시간 형식: "YYYY-MM-DD HH:mm 신고"
- [x] 링크확인 버튼: 새 창으로 URL 열기
- [x] 이미지확인 버튼: ReceiptPreviewModal로 이미지 표시
- [x] TypeScript 타입 정의 업데이트
- [ ] 모든 테스트 데이터에 receiptImages 추가 (일부만 완료)
- [ ] Purchase Second 카드 수정 (미완료)

## 주요 파일 경로

**컴포넌트**:
- Experience: `c:\develop\reviewx-web\src\components\partner\campaign_contents\card_type\experience_card\`
- Mission: `c:\develop\reviewx-web\src\components\partner\campaign_contents\card_type\mission_card\`
- Purchase First: `c:\develop\reviewx-web\src\components\partner\campaign_contents\card_type\purchase_card\purchase_first_card\`

**타입**:
- `c:\develop\reviewx-web\src\components\partner\campaign_contents\card_type\experience_card\ExperienceTypes.ts`

**테스트 데이터**:
- `c:\develop\reviewx-web\src\data\campaign\delivery\deliveryCampaigns.ts`
- `c:\develop\reviewx-web\src\data\campaign\visit\visitCampaigns.ts`
- `c:\develop\reviewx-web\src\data\campaign\reporter\reporterCampaigns.ts`
- `c:\develop\reviewx-web\src\data\campaign\review\reviewCampaigns.ts`
- `c:\develop\reviewx-web\src\data\campaign\mission\missionCampaigns.ts`
