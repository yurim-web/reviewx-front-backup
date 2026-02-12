# 캠페인 선정 흐름 구현 문서

## 개요
파트너가 유저를 선정하면 유저의 캠페인 관리 페이지에서 "신청" 탭에서 "선정" 탭으로 자동 이동하는 기능을 구현했습니다.

## 시나리오
1. 유저(김은지)가 캠페인 `/visit/1014`에 신청
2. 파트너가 김은지님을 선정
3. 결과:
   - 김은지님에게 선정 알림 발송 (향후 구현 예정)
   - 김은지님의 캠페인 관리 페이지에서 해당 캠페인이 "신청" 탭 → "선정" 탭으로 자동 이동

---

## 데이터 구조

### 1. 유저 신청 데이터 (`localStorage.user_applied_campaigns`)
```typescript
interface UserAppliedCampaigns {
  userId: string;
  campaigns: Array<{
    campaignId: string;
    campaignType: 'delivery' | 'visit' | 'review' | 'reporter' | 'mission';
    campaignTitle: string;
    campaignImage: string;
    appliedAt: string; // ISO 8601
    status: '대기' | '선정' | '탈락';
    memo: string;
    channel: string; // 채널 정보
  }>;
}[]
```

**위치**: 유저가 캠페인 신청 시 자동 저장
**파일**: `/src/components/user/campaign_detail/modal/ApplicationModal.tsx`

### 2. 파트너 신청자 데이터 (`localStorage.{campaignType}Campaigns`)
```typescript
interface CampaignWithApplicants {
  campaignInfo: {
    id: string;
    title: string;
    status: string;
    // ... 기타 캠페인 정보
  };
  applicantData: {
    applicants: AllApplicant[]; // 신청 탭
    selectedApplicants: AllApplicant[]; // 선정 탭
  };
}
```

**위치**: 파트너가 선정/취소 시 자동 저장
**파일**: `/src/hooks/partner/campaign_application/useCampaignApplication.ts`

---

## 구현 내용

### 1. 헬퍼 함수 추가: `updateUserAppliedCampaignStatus`
**파일**: `/src/hooks/partner/campaign_application/useCampaignApplication.ts`

**기능**:
- `localStorage.user_applied_campaigns`에서 해당 유저의 신청 내역을 찾아서 상태를 업데이트합니다
- 다양한 ID 형식을 지원합니다 (`"1"`, `"visit_1"` 등)

```typescript
function updateUserAppliedCampaignStatus(
  userId: string,
  campaignId: string,
  newStatus: "대기" | "선정" | "탈락"
): void
```

### 2. 선정 핸들러 수정: `handleSelectApplicant`
**기능**:
- 기존: 파트너의 신청자 데이터만 업데이트
- 추가: 유저 신청 내역 상태를 '대기' → '선정'으로 업데이트

```typescript
const handleSelectApplicant = (applicantId: string) => {
  // ... 기존 로직 ...

  // 유저 신청 내역 업데이트
  updateUserAppliedCampaignStatus(
    applicantId,
    campaignData.campaignInfo.id,
    "선정"
  );
};
```

### 3. 선정 취소 핸들러 수정: `handleCancelApplicant`
**기능**:
- 기존: 파트너의 선정자 데이터만 업데이트
- 추가: 유저 신청 내역 상태를 '선정' → '대기'로 업데이트

```typescript
const handleCancelApplicant = (applicantId: string) => {
  // ... 기존 로직 ...

  // 유저 신청 내역 업데이트
  updateUserAppliedCampaignStatus(
    applicantId,
    campaignData.campaignInfo.id,
    "대기"
  );
};
```

### 4. 유저 선정 페이지 수정
**파일**: `/src/app/user/campaign_management/selected/page.tsx`

**변경 사항**:
- `localStorage.user_applied_campaigns`에서 `status === '선정'`인 캠페인 로드
- 실시간 업데이트를 위해 `focus` 이벤트 리스너 추가
- 통계 카운트 계산 로직 추가

```typescript
const loadUserSelectedCampaigns = () => {
  // 1. 목업 데이터 로드
  // 2. localStorage에서 선정된 캠페인 로드
  // 3. 중복 제거하여 병합
};
```

---

## 테스트 시나리오

### 준비
1. 유저 계정으로 로그인 (예: 김은지, ID: `user_001`)
2. 방문형 캠페인 `/visit/1014`에 신청
3. 파트너 계정으로 로그인

### 테스트 1: 선정 처리
1. 파트너 페이지: `/partner/campaign_application/visit/1014` 접속
2. 김은지님 카드에서 "선정하기" 버튼 클릭
3. 유저 계정으로 전환
4. 캠페인 관리 페이지 `/user/campaign_management/selected` 접속
5. **확인**: 해당 캠페인이 "선정" 탭에 표시됨

### 테스트 2: 선정 취소
1. 파트너 페이지: "선정" 탭에서 김은지님 카드의 "선택 취소" 버튼 클릭
2. 유저 계정으로 전환
3. 캠페인 관리 페이지 새로고침
4. **확인**: 해당 캠페인이 "신청" 탭으로 다시 이동됨

### 테스트 3: localStorage 확인
브라우저 개발자 도구 > Application > Local Storage에서 확인:
```javascript
// user_applied_campaigns 확인
JSON.parse(localStorage.getItem('user_applied_campaigns'))

// 예상 결과:
[{
  userId: "user_001",
  campaigns: [{
    campaignId: "1014",
    status: "선정", // 또는 "대기"
    // ...
  }]
}]
```

---

## 주요 파일 목록

### 수정된 파일
1. `/src/hooks/partner/campaign_application/useCampaignApplication.ts`
   - `updateUserAppliedCampaignStatus` 함수 추가
   - `handleSelectApplicant` 수정
   - `handleCancelApplicant` 수정

2. `/src/app/user/campaign_management/selected/page.tsx`
   - `loadUserSelectedCampaigns` 함수 추가
   - localStorage 로딩 로직 추가
   - 통계 계산 로직 추가
   - `withUserAuth` HOC 적용

### 관련 파일 (수정 없음)
1. `/src/components/user/campaign_detail/modal/ApplicationModal.tsx`
   - 유저 신청 시 `user_applied_campaigns` 저장

2. `/src/app/user/campaign_management/applied/page.tsx`
   - 신청 탭 페이지 (참고용)

3. `/src/data/partner/sharedCampaigns.ts`
   - `updateCampaignApplicants` 함수 (파트너 데이터 저장)

---

## 향후 개선 사항

### 1. 알림 기능 추가
- 선정 시 유저에게 알림 전송 (예: 이메일, 푸시 알림)
- 알림 센터 구현

### 2. 실시간 업데이트
- WebSocket 또는 Server-Sent Events 사용
- localStorage의 storage 이벤트 활용

### 3. 탈락 기능 추가
- 파트너가 신청자를 탈락 처리하는 기능
- 유저의 "취소/반려" 탭에 표시

### 4. 히스토리 추적
- 선정/취소 이력 기록
- 타임스탬프 추가

### 5. 에러 핸들링 개선
- localStorage 용량 초과 처리
- 네트워크 오류 처리
- 동시성 제어

---

## 디버깅 팁

### 콘솔 로그 확인
파트너 선정 시:
```
✅ [updateUserAppliedCampaignStatus] 유저 신청 내역 상태 업데이트:
   userId=user_001, campaignId=1014, 대기 -> 선정
```

유저 페이지 로드 시:
```
[SelectedPage] 현재 로그인한 user: {...}
[SelectedPage] localStorage에서 변환된 캠페인 개수: 1
✅ [SelectedPage] 최종 캠페인: [...]
```

### localStorage 초기화
테스트 후 초기화가 필요한 경우:
```javascript
// 유저 신청 내역 삭제
localStorage.removeItem('user_applied_campaigns');

// 특정 캠페인 타입 삭제
localStorage.removeItem('visitCampaigns');
```

---

## 성능 고려사항

### localStorage 읽기/쓰기
- 매번 JSON.parse/stringify 하므로 대량 데이터 시 성능 영향
- 필요 시 메모리 캐싱 고려

### 탭 간 데이터 동기화
- `storage` 이벤트로 다른 탭의 변경사항 감지
- `focus` 이벤트로 페이지 재방문 시 데이터 새로고침

### ID 매칭 로직
- 다양한 ID 형식 지원을 위해 여러 번 비교
- 캠페인 수가 많아지면 성능 영향 가능
- 필요 시 ID 정규화 로직 개선

---

## 문의사항
- 구현 관련 질문은 개발팀에 문의
- 버그 리포트는 GitHub Issues 활용
