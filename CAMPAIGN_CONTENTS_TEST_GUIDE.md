# 캠페인 콘텐츠 내역 페이지 - 모든 카드 경우의 수 테스트 가이드

## 개요
각 캠페인 유형별로 대기/확인/완료 탭의 모든 카드 경우의 수를 테스트할 수 있는 목업 데이터가 추가되었습니다.

## 테스트 캠페인 목록 및 URL

### 1. 배송형 (Delivery)

**캠페인 ID:** `delivery_test_all_cases`
**캠페인명:** [테스트] 배송형 모든 카드 경우의 수

#### 테스트 URL
```
http://localhost:3002/partner/campaign_contents/delivery/delivery_test_all_cases
```

#### 카드 경우의 수

**대기 탭 (4가지):**
1. 콘텐츠 미등록 (기한 내) - 기본 상태
2. 연장 요청됨 - extension_request_reason 포함
3. 반려됨 - isRejected: true
4. 신고됨 - isReported: true, reportedDate 포함

**확인 탭 (1가지):**
1. 검수 중 상태 - status: "검수중"

**완료 탭 (1가지):**
1. 승인 완료 상태 - status: "완료", updatedAt 포함

---

### 2. 방문형 (Visit)

**캠페인 ID:** `visit_test_all_cases`
**캠페인명:** [테스트] 방문형 모든 카드 경우의 수

#### 테스트 URL
```
http://localhost:3002/partner/campaign_contents/visit/visit_test_all_cases
```

#### 카드 경우의 수

**대기 탭 (4가지):**
1. 콘텐츠 미등록 (기한 내) - 기본 상태
2. 연장 요청됨 - extension_request_reason 포함
3. 반려됨 - isRejected: true
4. 신고됨 - isReported: true, reportedDate 포함

**확인 탭 (1가지):**
1. 검수 중 상태 - status: "검수중"

**완료 탭 (1가지):**
1. 승인 완료 상태 - status: "완료", updatedAt 포함

---

### 3. 기자단 (Reporter)

**캠페인 ID:** `reporter_test_all_cases`
**캠페인명:** [테스트] 기자단 모든 카드 경우의 수

#### 테스트 URL
```
http://localhost:3002/partner/campaign_contents/reporter/reporter_test_all_cases
```

#### 카드 경우의 수

**대기 탭 (4가지):**
1. 콘텐츠 미등록 (기한 내) - 기본 상태
2. 연장 요청됨 - extension_request_reason 포함
3. 반려됨 - isRejected: true
4. 신고됨 - isReported: true, reportedDate 포함

**확인 탭 (1가지):**
1. 검수 중 상태 - status: "검수중"

**완료 탭 (1가지):**
1. 승인 완료 상태 - status: "완료", updatedAt 포함

---

### 4. 구매평 1차 - 구매 기간 (Purchase Review 1st)

**캠페인 ID:** `review_test_1st_all_cases`
**캠페인명:** [테스트] 구매평 1차 모든 카드 경우의 수

#### 테스트 URL
```
http://localhost:3002/partner/campaign_contents/review/review_test_1st_all_cases
```

#### 특징
- 구매 기간 중인 캠페인 (purchasePeriod: 2026-01-30 ~ 2026-02-10)
- 구매 영수증 확인 카드 사용 (PurchaseFirstCard)
- actionType: 0 (구매 영수증 확인)

#### 카드 경우의 수

**대기 탭 (4가지):**
1. 구매 미인증 (기한 내) - 기본 상태
2. 연장 요청됨 - extension_request_reason 포함
3. 반려됨 - isRejected: true
4. 신고됨 - isReported: true, reportedDate 포함

**확인 탭 (1가지):**
1. 구매 인증 검수 중 - receiptImages, thumbnailSrc 포함

**완료 탭 (1가지):**
1. 구매 인증 완료 - receiptImages, thumbnailSrc 포함

---

### 5. 구매평 2차 - 등록 기간 (Purchase Review 2nd)

**캠페인 ID:** `review_test_2nd_all_cases`
**캠페인명:** [테스트] 구매평 2차 모든 카드 경우의 수

#### 테스트 URL
```
http://localhost:3002/partner/campaign_contents/review/review_test_2nd_all_cases
```

#### 특징
- 등록 기간 중인 캠페인 (registrationPeriod: 2026-01-27 ~ 2026-02-15)
- 콘텐츠 리뷰 카드 사용 (PurchaseSecondCard)
- 구매 기간은 종료 (purchasePeriod: 2026-01-16 ~ 2026-01-27)

#### 카드 경우의 수

**대기 탭 (4가지):**
1. 콘텐츠 미등록 (기한 내) - 기본 상태
2. 연장 요청됨 - extension_request_reason 포함
3. 반려됨 - isRejected: true
4. 신고됨 - isReported: true, reportedDate 포함

**확인 탭 (1가지):**
1. 콘텐츠 검수 중 - status: "검수중"

**완료 탭 (1가지):**
1. 승인 완료 - status: "완료", updatedAt 포함

---

### 6. 미션형 - 링크+이미지 (Mission Both)

**캠페인 ID:** `mission_test_both_all_cases`
**캠페인명:** [테스트] 미션형 링크+이미지 모든 카드 경우의 수

#### 테스트 URL
```
http://localhost:3002/partner/campaign_contents/mission/mission_test_both_all_cases
```

#### 특징
- contentType: "both" (링크 + 이미지)
- missionType: "both"
- 링크 입력과 이미지 업로드 모두 필요

#### 카드 경우의 수

**대기 탭 (4가지):**
1. 콘텐츠 미등록 (기한 내) - 기본 상태
2. 연장 요청됨 - extension_request_reason 포함
3. 반려됨 - isRejected: true
4. 신고됨 - isReported: true, reportedDate 포함

**확인 탭 (1가지):**
1. 검수 중 상태 - status: "검수중"

**완료 탭 (1가지):**
1. 승인 완료 상태 - status: "완료", updatedAt 포함

---

### 7. 미션형 - 링크만 (Mission Link)

**캠페인 ID:** `mission_test_link_all_cases`
**캠페인명:** [테스트] 미션형 링크만 모든 카드 경우의 수

#### 테스트 URL
```
http://localhost:3002/partner/campaign_contents/mission/mission_test_link_all_cases
```

#### 특징
- contentType: "link" (링크만)
- missionType: "link"
- 링크 입력만 필요

#### 카드 경우의 수

**대기 탭 (4가지):**
1. 콘텐츠 미등록 (기한 내) - 기본 상태
2. 연장 요청됨 - extension_request_reason 포함
3. 반려됨 - isRejected: true
4. 신고됨 - isReported: true, reportedDate 포함

**확인 탭 (1가지):**
1. 검수 중 상태 - status: "검수중"

**완료 탭 (1가지):**
1. 승인 완료 상태 - status: "완료", updatedAt 포함

---

### 8. 미션형 - 이미지만 (Mission Image)

**캠페인 ID:** `mission_test_image_all_cases`
**캠페인명:** [테스트] 미션형 이미지만 모든 카드 경우의 수

#### 테스트 URL
```
http://localhost:3002/partner/campaign_contents/mission/mission_test_image_all_cases
```

#### 특징
- contentType: "image" (이미지만)
- missionType: "image"
- 이미지 업로드만 필요

#### 카드 경우의 수

**대기 탭 (4가지):**
1. 콘텐츠 미등록 (기한 내) - 기본 상태
2. 연장 요청됨 - extension_request_reason 포함
3. 반려됨 - isRejected: true
4. 신고됨 - isReported: true, reportedDate 포함

**확인 탭 (1가지):**
1. 검수 중 상태 - status: "검수중"

**완료 탭 (1가지):**
1. 승인 완료 상태 - status: "완료", updatedAt 포함

---

## 탭별 URL 파라미터

각 탭을 직접 접근하려면 URL에 `?tab=` 쿼리 파라미터를 추가합니다.

### 예시
- 대기 탭: `?tab=대기`
- 확인 탭: `?tab=확인`
- 완료 탭: `?tab=완료`

### 전체 URL 예시
```
http://localhost:3002/partner/campaign_contents/delivery/delivery_test_all_cases?tab=대기
http://localhost:3002/partner/campaign_contents/delivery/delivery_test_all_cases?tab=확인
http://localhost:3002/partner/campaign_contents/delivery/delivery_test_all_cases?tab=완료
```

---

## 테스트 시나리오

### 1. 대기 탭 테스트
1. 콘텐츠 미등록 카드가 정상적으로 표시되는지 확인
2. 연장 요청 카드에 연장 사유가 표시되는지 확인
3. 반려 카드에 반려 사유가 표시되는지 확인
4. 신고 카드에 신고 일시가 표시되는지 확인

### 2. 확인 탭 테스트
1. 검수 중 카드가 정상적으로 표시되는지 확인
2. 승인/반려/신고 버튼이 동작하는지 확인
3. 링크 확인 버튼이 동작하는지 확인 (채널 URL 생성)
4. 구매평 1차의 경우 영수증 이미지 확인 기능 테스트

### 3. 완료 탭 테스트
1. 승인 완료 카드가 정상적으로 표시되는지 확인
2. 등록일/수정일이 정확하게 표시되는지 확인
3. 링크 확인 버튼이 동작하는지 확인

### 4. 유형별 특수 기능 테스트
- **구매평 1차**: 영수증 이미지 미리보기 모달
- **구매평 2차**: 콘텐츠 링크 확인
- **미션형**: contentType에 따른 카드 UI 변화

---

## 수정된 파일 목록

1. `c:\develop\reviewx-web\src\data\campaign\delivery\deliveryCampaigns.ts`
   - 테스트 캠페인 추가: `delivery_test_all_cases`

2. `c:\develop\reviewx-web\src\data\campaign\visit\visitCampaigns.ts`
   - 테스트 캠페인 추가: `visit_test_all_cases`

3. `c:\develop\reviewx-web\src\data\campaign\reporter\reporterCampaigns.ts`
   - 테스트 캠페인 추가: `reporter_test_all_cases`

4. `c:\develop\reviewx-web\src\data\campaign\review\reviewCampaigns.ts`
   - 테스트 캠페인 추가: `review_test_1st_all_cases` (구매 기간)
   - 테스트 캠페인 추가: `review_test_2nd_all_cases` (등록 기간)

5. `c:\develop\reviewx-web\src\data\campaign\mission\missionCampaigns.ts`
   - 테스트 캠페인 추가: `mission_test_both_all_cases` (링크+이미지)
   - 테스트 캠페인 추가: `mission_test_link_all_cases` (링크만)
   - 테스트 캠페인 추가: `mission_test_image_all_cases` (이미지만)

---

## 주요 데이터 플래그

### 대기 탭
- `extension_request_reason`: 연장 요청 사유 (있으면 연장 요청 상태)
- `isRejected`: 반려 여부 (true면 반려된 상태)
- `isReported`: 신고 여부 (true면 신고된 상태)
- `reportedDate`: 신고 일시 (ISO 8601 형식)

### 확인 탭
- `status`: "검수중" (검수 중 상태)
- `isLate`: 지각 등록 여부
- `updatedAt`: 수정 일시

### 완료 탭
- `status`: "완료" (승인 완료 상태)
- `updatedAt`: 승인 일시
- `isLate`: 지각 등록 여부

### 구매평 전용
- `actionType`: 0 (구매 영수증 확인)
- `receiptImages`: 영수증 이미지 배열
- `thumbnailSrc`: 썸네일 이미지

### 미션형 전용
- `missionType`: "both" | "link" | "image"
- `contentType`: "both" | "link" | "image"

---

## 날짜 기준

모든 테스트 데이터는 2026-02-04 (오늘 날짜) 기준으로 작성되었습니다.

- 콘텐츠 생성일: 2026-02-01 ~ 2026-02-04
- 등록 기간: 2026-01-23 ~ 2026-02-10 (진행 중)
- 구매 기간 (구매평 1차): 2026-01-30 ~ 2026-02-10 (진행 중)
- 등록 기간 (구매평 2차): 2026-01-27 ~ 2026-02-15 (진행 중)

---

## 빠른 테스트 링크 모음

### 배송형, 방문형, 기자단 (동일한 카드 구조)
```
배송형 대기 탭: http://localhost:3002/partner/campaign_contents/delivery/delivery_test_all_cases?tab=대기
배송형 확인 탭: http://localhost:3002/partner/campaign_contents/delivery/delivery_test_all_cases?tab=확인
배송형 완료 탭: http://localhost:3002/partner/campaign_contents/delivery/delivery_test_all_cases?tab=완료

방문형 대기 탭: http://localhost:3002/partner/campaign_contents/visit/visit_test_all_cases?tab=대기
방문형 확인 탭: http://localhost:3002/partner/campaign_contents/visit/visit_test_all_cases?tab=확인
방문형 완료 탭: http://localhost:3002/partner/campaign_contents/visit/visit_test_all_cases?tab=완료

기자단 대기 탭: http://localhost:3002/partner/campaign_contents/reporter/reporter_test_all_cases?tab=대기
기자단 확인 탭: http://localhost:3002/partner/campaign_contents/reporter/reporter_test_all_cases?tab=확인
기자단 완료 탭: http://localhost:3002/partner/campaign_contents/reporter/reporter_test_all_cases?tab=완료
```

### 구매평 (1차/2차 구분)
```
구매평 1차 대기 탭: http://localhost:3002/partner/campaign_contents/review/review_test_1st_all_cases?tab=대기
구매평 1차 확인 탭: http://localhost:3002/partner/campaign_contents/review/review_test_1st_all_cases?tab=확인
구매평 1차 완료 탭: http://localhost:3002/partner/campaign_contents/review/review_test_1st_all_cases?tab=완료

구매평 2차 대기 탭: http://localhost:3002/partner/campaign_contents/review/review_test_2nd_all_cases?tab=대기
구매평 2차 확인 탭: http://localhost:3002/partner/campaign_contents/review/review_test_2nd_all_cases?tab=확인
구매평 2차 완료 탭: http://localhost:3002/partner/campaign_contents/review/review_test_2nd_all_cases?tab=완료
```

### 미션형 (링크+이미지, 링크만, 이미지만)
```
미션형 링크+이미지 대기 탭: http://localhost:3002/partner/campaign_contents/mission/mission_test_both_all_cases?tab=대기
미션형 링크+이미지 확인 탭: http://localhost:3002/partner/campaign_contents/mission/mission_test_both_all_cases?tab=확인
미션형 링크+이미지 완료 탭: http://localhost:3002/partner/campaign_contents/mission/mission_test_both_all_cases?tab=완료

미션형 링크만 대기 탭: http://localhost:3002/partner/campaign_contents/mission/mission_test_link_all_cases?tab=대기
미션형 링크만 확인 탭: http://localhost:3002/partner/campaign_contents/mission/mission_test_link_all_cases?tab=확인
미션형 링크만 완료 탭: http://localhost:3002/partner/campaign_contents/mission/mission_test_link_all_cases?tab=완료

미션형 이미지만 대기 탭: http://localhost:3002/partner/campaign_contents/mission/mission_test_image_all_cases?tab=대기
미션형 이미지만 확인 탭: http://localhost:3002/partner/campaign_contents/mission/mission_test_image_all_cases?tab=확인
미션형 이미지만 완료 탭: http://localhost:3002/partner/campaign_contents/mission/mission_test_image_all_cases?tab=완료
```

---

## 총 카드 경우의 수 정리

### 배송형/방문형/기자단 (각각 동일)
- 대기 탭: 4가지
- 확인 탭: 1가지
- 완료 탭: 1가지
- **총 6가지**

### 구매평 1차 (구매기간)
- 대기 탭: 4가지
- 확인 탭: 1가지
- 완료 탭: 1가지
- **총 6가지**

### 구매평 2차 (등록기간)
- 대기 탭: 4가지
- 확인 탭: 1가지
- 완료 탭: 1가지
- **총 6가지**

### 미션형 (링크+이미지, 링크만, 이미지만 각각)
- 대기 탭: 4가지
- 확인 탭: 1가지
- 완료 탭: 1가지
- **각 타입당 6가지, 총 18가지**

### 전체 합계
**54가지 카드 경우의 수**
(배송형 6 + 방문형 6 + 기자단 6 + 구매평1차 6 + 구매평2차 6 + 미션형 18)
