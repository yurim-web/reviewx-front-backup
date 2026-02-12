# 캠페인 선정 알림 기능

## 개요
파트너가 유저를 캠페인에 선정하거나 선정을 취소할 때, 유저의 알림 페이지에 자동으로 알림이 추가되는 기능입니다.

## 구현된 기능

### 1. 선정 알림
- **트리거**: 파트너가 캠페인 신청자를 선정할 때
- **알림 타입**: `campaign_selected` (카테고리: `A_R1`)
- **메시지**: "축하합니다! [캠페인명] 캠페인에 선정되셨습니다."

### 2. 선정 취소 알림
- **트리거**: 파트너가 선정된 유저를 취소할 때
- **알림 타입**: `campaign_rejected` (카테고리: `A_R2`)
- **메시지**: "[캠페인명] 캠페인에서 선정이 취소되었습니다."

## 데이터 구조

### localStorage.notifications
```typescript
[
  {
    id: number,                    // 알림 고유 ID
    user_id: string,               // 유저 ID
    type: string,                  // 알림 타입 ('campaign_selected' | 'campaign_rejected')
    campaign_id: string,           // 캠페인 ID
    campaign_title: string,        // 캠페인 제목
    campaign_type: string,         // 캠페인 타입 ('delivery' | 'visit' | 'review' | 'mission' | 'reporter')
    message: string,               // 알림 메시지
    created_at: string,            // 생성 시간 (ISO 8601)
    is_read: boolean               // 읽음 여부
  }
]
```

## 수정된 파일

### 1. `/src/hooks/partner/campaign_application/useCampaignApplication.ts`
- **추가된 함수**: `addUserNotification()`
  - 유저 알림을 localStorage에 추가하는 헬퍼 함수
  - 알림 ID 자동 생성
  - 알림 타입에 따른 메시지 자동 생성

- **수정된 함수**: `handleSelectApplicant()`
  - 선정 시 `addUserNotification()` 호출 추가
  - 선정 알림 생성

- **수정된 함수**: `handleCancelApplicant()`
  - 선정 취소 시 `addUserNotification()` 호출 추가
  - 선정 취소 알림 생성

### 2. `/src/app/user/notification/page.tsx`
- **수정된 부분**: `useEffect` - localStorage에서 알림 로드
  - `campaign_selected`, `campaign_rejected` 타입 매핑 추가
  - 캠페인 정보 (campaign_id, campaign_name) 포함

### 3. `/src/components/notification/NotificationList.tsx`
- **수정된 부분**: 메시지 렌더링 로직
  - 직접 전달된 `message` prop 지원
  - 커스텀 메시지 우선 표시, 없으면 템플릿 사용

## 사용 흐름

```
1. 파트너가 캠페인 신청내역 페이지 접속
   ↓
2. 신청자 카드에서 "선정하기" 버튼 클릭
   ↓
3. useCampaignApplication.handleSelectApplicant() 실행
   ↓
4. 신청자 상태 변경 (대기 → 선정)
   ↓
5. user_applied_campaigns 업데이트 (updateUserAppliedCampaignStatus)
   ↓
6. notifications에 알림 추가 (addUserNotification)
   ↓
7. 유저가 알림 페이지 접속 시 알림 확인 가능
```

## 테스트 방법

### 1. 선정 알림 테스트
```
1. 브라우저에서 파트너 계정으로 로그인
2. /partner/campaign_application/[campaignId]?tab=applicants 접속
3. 신청자 카드의 "선정하기" 버튼 클릭
4. 콘솔에서 "✅ [addUserNotification] 알림 추가 완료" 메시지 확인
5. localStorage.notifications 확인 (개발자 도구 > Application > Local Storage)
6. 해당 유저 계정으로 로그인
7. /user/notification 접속
8. "축하합니다! [캠페인명] 캠페인에 선정되셨습니다." 알림 확인
```

### 2. 선정 취소 알림 테스트
```
1. 위의 1-3번 단계로 유저 선정
2. /partner/campaign_application/[campaignId]?tab=selected 접속 (선정 탭)
3. 선정된 유저 카드의 "선택 취소" 버튼 클릭
4. 콘솔에서 "✅ [addUserNotification] 알림 추가 완료" 메시지 확인
5. 유저 계정으로 로그인하여 알림 확인
```

## 알림 카테고리 매핑

| 알림 타입 | 카테고리 코드 | 라벨 | 색상 |
|----------|-------------|------|------|
| campaign_selected | A_R1 | 캠페인 선정 | 파란색 (blue) |
| campaign_rejected | A_R2 | 캠페인 수정 | 파란색 (blue) |

> 참고: A_R2는 원래 "캠페인 수정"이지만, 탈락 전용 카테고리가 없어 임시로 사용

## 향후 개선 사항

1. **읽음 처리 기능**
   - 알림 클릭 시 is_read를 true로 변경
   - 읽지 않은 알림 카운트 표시

2. **알림 삭제 기능**
   - 개별 알림 삭제
   - 모두 읽음 처리

3. **실시간 알림**
   - WebSocket 또는 polling을 통한 실시간 알림
   - 알림 뱃지 업데이트

4. **알림 필터링**
   - 읽음/읽지 않음 필터
   - 캠페인별 필터
   - 날짜별 필터

5. **알림 상세 페이지 연동**
   - 알림 클릭 시 해당 캠페인 상세 페이지로 이동
   - 알림 타입에 따른 동적 라우팅

## 주의 사항

- localStorage 용량 제한 (대부분 브라우저에서 5-10MB)
- 다중 탭 환경에서 storage 이벤트 트리거 필요
- 브라우저 쿠키/localStorage 삭제 시 알림 데이터 손실
- 향후 API 서버로 마이그레이션 필요
