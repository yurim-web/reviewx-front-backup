# 📦 localStorage 키 목록

## 개요

이 문서는 ReviewX 프로젝트에서 사용하는 모든 localStorage 키를 정리한 문서입니다.
백엔드 API 연동 전까지 프론트엔드에서 데이터를 관리하기 위해 localStorage를 활용하고 있습니다.

---

## 🔧 0. 시스템/빌드 (자동 관리)

| 키 | 데이터 타입 | 설명 | 사용 위치 |
|---|---|---|---|
| `reviewx_build_id` | string | 현재 빌드 시점 ID. 새 빌드 배포 시 이 값이 바뀌면 **전체 localStorage가 자동으로 비워집니다.** | `src/components/dev/BuildIdLocalStorageClear.tsx` |

- `next build` 또는 `next dev` 실행 시마다 `next.config`의 `NEXT_PUBLIC_BUILD_ID`가 갱신됩니다.
- 앱 로드 시 저장된 `reviewx_build_id`와 비교해 다르면 `localStorage.clear()` 후 현재 빌드 ID만 다시 저장합니다.

---

## 🔐 1. 인증 관련 (Auth)

| 키 | 데이터 타입 | 설명 | 사용 위치 |
|---|---|---|---|
| `reviewx_auth_user` | JSON | 로그인한 사용자 정보 (id, email, name, role 등) | `src/lib/auth.ts` |
| `reviewx_auth_token` | string | 인증 토큰 (Mock) | `src/lib/auth.ts` |

**사용 예시:**
```typescript
// 사용자 정보 저장
localStorage.setItem('reviewx_auth_user', JSON.stringify(user));

// 사용자 정보 가져오기
const stored = localStorage.getItem('reviewx_auth_user');
const user = stored ? JSON.parse(stored) : null;

// 로그아웃 시 삭제
localStorage.removeItem('reviewx_auth_user');
localStorage.removeItem('reviewx_auth_token');
```

---

## 🎯 2. 캠페인 데이터 (5가지 타입)

모든 사용자(유저, 파트너, 관리자)가 공통으로 사용하는 캠페인 데이터입니다.

| 키 | 데이터 타입 | 설명 | 사용 위치 |
|---|---|---|---|
| `deliveryCampaigns` | JSON Array | 배송형 캠페인 목록 | 파트너/관리자/유저 페이지 |
| `visitCampaigns` | JSON Array | 방문형 캠페인 목록 | 파트너/관리자/유저 페이지 |
| `reviewCampaigns` | JSON Array | 리뷰형 캠페인 목록 | 파트너/관리자/유저 페이지 |
| `reporterCampaigns` | JSON Array | 기자단 캠페인 목록 | 파트너/관리자/유저 페이지 |
| `missionCampaigns` | JSON Array | 미션형 캠페인 목록 | 파트너/관리자/유저 페이지 |

**사용 예시:**
```typescript
// 캠페인 목록 가져오기
const stored = localStorage.getItem('deliveryCampaigns');
const campaigns = stored ? JSON.parse(stored) : [];

// 캠페인 목록 저장하기
localStorage.setItem('deliveryCampaigns', JSON.stringify(campaigns));
```

---

## 📝 3. 캠페인 임시 저장 (작성 중인 폼 데이터)

파트너가 캠페인을 작성하다가 페이지를 이탈할 때 자동으로 임시 저장됩니다.

| 키 | 데이터 타입 | 설명 | 사용 위치 |
|---|---|---|---|
| `temp_delivery_campaign` | JSON | 배송형 캠페인 임시 저장 | `src/app/partner/campaign/create/delivery/page.tsx` |
| `temp_visit_campaign` | JSON | 방문형 캠페인 임시 저장 | `src/app/partner/campaign/create/visit/page.tsx` |
| `temp_review_campaign` | JSON | 리뷰형 캠페인 임시 저장 | `src/app/partner/campaign/create/review/page.tsx` |
| `temp_reporter_campaign` | JSON | 기자단 캠페인 임시 저장 | `src/app/partner/campaign/create/reporter/page.tsx` |
| `temp_mission_campaign` | JSON | 미션형 캠페인 임시 저장 | `src/app/partner/campaign/create/mission/page.tsx` |

**사용 예시:**
```typescript
// 임시 저장
const dataToSave = { title, description, ... };
localStorage.setItem('temp_delivery_campaign', JSON.stringify(dataToSave));

// 임시 저장 데이터 불러오기
const saved = localStorage.getItem('temp_delivery_campaign');
if (saved) {
  const data = JSON.parse(saved);
  // 폼에 데이터 복원
}
```

---

## 🎫 4. 캠페인 상태 관리

캠페인의 상태(삭제, 취소, 완료 등)를 추적하기 위한 ID 목록입니다.

| 키 | 데이터 타입 | 설명 | 사용 위치 |
|---|---|---|---|
| `deletedCampaignIds` | JSON Array | 삭제된 캠페인 ID 목록 | `src/data/partner/sharedCampaigns.ts` |
| `cancelledCampaignIds` | JSON Array | 취소된 캠페인 ID 목록 | `src/data/partner/sharedCampaigns.ts` |
| `completedCampaignIds` | JSON Array | 완료된 캠페인 ID 목록 (유저) | `src/data/user/campaign_management/campaignManagementData.ts` |
| `my_applications` | JSON Array | 유저가 신청한 캠페인 목록 | `src/app/user/campaign_management/applied/page.tsx` |
| `my_campaigns` | JSON Array | 파트너의 캠페인 목록 | `src/app/partner/campaign_management/scheduled/page.tsx` |

**사용 예시:**
```typescript
// 삭제된 캠페인 ID 추가
const stored = localStorage.getItem('deletedCampaignIds');
const deletedIds = stored ? JSON.parse(stored) : [];
deletedIds.push(campaignId);
localStorage.setItem('deletedCampaignIds', JSON.stringify(deletedIds));
```

---

## 💰 5. 포인트 관련 (파트너)

파트너의 포인트 및 결제 내역을 관리합니다.

| 키 | 데이터 타입 | 설명 | 사용 위치 |
|---|---|---|---|
| `partner_available_points` | string (number) | 파트너 보유 포인트 | `src/data/partner/point/pointData.ts` |
| `partner_point_history` | JSON Array | 파트너 포인트 내역 | `src/data/partner/point/pointData.ts` |
| `partner_new_point_history` | JSON Array | 파트너 신규 포인트 내역 | `src/components/partner/point/PartnerPointPageLayout.tsx` |
| `partner_payment_history` | JSON Array | 파트너 결제 내역 | `src/data/manager_sa/settlement/paymentHistoryData.ts` |

**사용 예시:**
```typescript
// 포인트 가져오기
const points = localStorage.getItem('partner_available_points');
const availablePoints = points ? Number(points) : 0;

// 포인트 저장하기
localStorage.setItem('partner_available_points', String(newPoints));

// 포인트 내역 저장
const history = [{ date, amount, type, ... }];
localStorage.setItem('partner_point_history', JSON.stringify(history));
```

---

## 👤 6. 계정 관련

사용자 계정 정보를 관리합니다.

| 키 | 데이터 타입 | 설명 | 사용 위치 |
|---|---|---|---|
| `partner_accounts` | JSON Array | 파트너 계정 목록 (회원가입 시 저장) | `src/app/partner/signup/page.tsx` |
| `partner_email` | string | 파트너 이메일 (비밀번호 찾기용) | `src/app/partner/reset-password/page.tsx` |
| `partner_contact_phone` | string | 파트너 연락처 | `src/components/partner/campaign_create_form/DeliveryCampaignForm.tsx` |
| `user_accounts` | JSON Array | 유저(리뷰어) 계정 목록 (프로필, 포인트, 계좌 정보 포함) | `src/lib/auth.ts`, `src/app/user/point/*` |

**user_accounts 데이터 구조:**
```typescript
{
  id: string;                    // 사용자 ID (예: "user_kakao_001")
  name: string;                  // 이름
  nickname: string;              // 닉네임
  email: string;                 // 이메일
  phone: string;                 // 전화번호
  address: string;               // 주소
  detail_address: string;        // 상세주소
  postal_code: string;           // 우편번호
  channel_details: Array<{       // 채널 정보
    name: string;                // 채널 이름 (예: "네이버 블로그")
    url: string;                 // 채널 URL
    status: 'connected' | 'disconnected';
  }>;
  account_holder: string;        // 예금주
  bank: string;                  // 은행
  account_number: string;        // 계좌번호
  ssn_front: string;             // 주민등록번호 앞자리
  ssn_back: string;              // 주민등록번호 뒷자리
  available_points: number;      // 보유 포인트 (출금 가능)
  pending_points: number;        // 출금 대기 포인트
  current_points: number;        // 현재 포인트
  withdrawn_points: number;      // 출금 완료 포인트
  point_history: Array<{         // 포인트 내역
    id: string;
    type: 'earned' | 'withdrawn' | 'withdrawal_pending';
    amount: number;              // 양수(적립) 또는 음수(출금)
    description: string;
    date: string;
    status: 'earned' | 'completed' | 'pending' | 'failed';
    balance: number;             // 거래 후 잔액
    rejection_reason?: string;   // 반려 사유 (status가 'failed'일 때)
  }>;
}
```

**사용 예시:**
```typescript
// 파트너 계정 추가 (회원가입)
const existingAccounts = localStorage.getItem('partner_accounts');
const accounts = existingAccounts ? JSON.parse(existingAccounts) : [];
accounts.push(newAccount);
localStorage.setItem('partner_accounts', JSON.stringify(accounts));

// 유저 계정 정보 불러오기
const storedAccounts = localStorage.getItem('user_accounts');
const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];
const userAccount = accounts.find(a => a.id === userId);
```

---

## 💳 7. 출금 및 알림 관련

유저의 포인트 출금 및 알림을 관리합니다.

| 키 | 데이터 타입 | 설명 | 사용 위치 |
|---|---|---|---|
| `withdrawal_requests` | JSON Array | 출금 요청 목록 (관리자 승인 대기) | `src/app/user/point/withdrawal_request/page.tsx` |
| `withdrawal_history` | JSON Array | 출금 완료 내역 (관리자 승인 완료) | `src/components/manager/sa/settlement/withdrawal/section/WithdrawalTable.tsx` |
| `notifications` | JSON Array | 알림 목록 (출금 신청, 승인, 반려 알림) | `src/app/user/notification/page.tsx` |

**withdrawal_requests 데이터 구조:**
```typescript
{
  id: string;                    // 출금 요청 ID
  user_id: string;               // 사용자 ID
  user_name: string;             // 사용자 이름
  user_number: string;           // 사용자 번호
  requested_amount: number;      // 출금 신청 금액
  net_amount: number;            // 실제 지급액 (3.3% 공제 후)
  tax_amount: number;            // 세금
  bank: string;                  // 은행
  account_number: string;        // 계좌번호
  account_holder: string;        // 예금주
  status: 'pending' | 'approved' | 'rejected';  // 상태
  request_date: string;          // 신청일 (ISO)
  processed_date: string | null; // 처리일 (ISO)
  rejection_reason?: string;     // 반려 사유
}
```

**withdrawal_history 데이터 구조:**
```typescript
{
  id: string;                    // 출금 완료 ID
  number: string;                // 회원 번호
  round: string;                 // 회차 ("-" 또는 숫자)
  name: string;                  // 이름
  account: string;               // 계좌 정보 (은행 + 계좌번호 + 예금주)
  ssn: string;                   // 주민등록번호
  amount: string;                // 출금 금액 (천 단위 구분)
  remaining: string;             // 잔여 포인트 (천 단위 구분)
  requestDate: string;           // 신청일 (YYYY-MM-DD HH:mm)
  paymentDate: string;           // 지급일 (YYYY-MM-DD HH:mm)
  type: string;                  // 회원 유형
  paymentStatus: 'completed';    // 지급 상태 (항상 'completed')
  status: string;                // 회원 상태
}
```

**notifications 데이터 구조:**
```typescript
{
  id: string;                    // 알림 ID
  user_id: string;               // 사용자 ID
  type: 'withdrawal_requested' | 'withdrawal_completed' | 'withdrawal_rejected';
  title: string;                 // 알림 제목
  message: string;               // 알림 메시지
  is_read: boolean;              // 읽음 여부
  created_at: string;            // 생성 시간 (ISO)
}
```

**사용 예시:**
```typescript
// 출금 요청 저장
const requests = JSON.parse(localStorage.getItem('withdrawal_requests') || '[]');
requests.push({
  id: `withdrawal_${userId}_${Date.now()}`,
  user_id: userId,
  requested_amount: 10000,
  status: 'pending',
  request_date: new Date().toISOString(),
  // ... 기타 정보
});
localStorage.setItem('withdrawal_requests', JSON.stringify(requests));

// 알림 추가
const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
notifications.unshift({
  id: `notif_${Date.now()}`,
  user_id: userId,
  type: 'withdrawal_requested',
  message: '포인트 출금 신청이 접수되었습니다.',
  is_read: false,
  created_at: new Date().toISOString(),
});
localStorage.setItem('notifications', JSON.stringify(notifications));
```

---

## 👨‍💼 8. 관리자 관련

관리자 페이지에서 사용하는 데이터입니다.

| 키 | 데이터 타입 | 설명 | 사용 위치 |
|---|---|---|---|
| `manager_sa_admin_list` | JSON Array | 최고관리자(SA) 목록 | `src/data/manager_sa/member/admins.ts` |
| `STORAGE_KEY_REVIEWER_STATUS_UPDATES` | JSON Array | 리뷰어 상태 변경 내역 | `src/data/manager_ga/member/reviewers.ts` |
| `STORAGE_KEY_REVIEWER_PREVIOUS_STATUS` | JSON | 리뷰어 이전 상태 | `src/data/manager_ga/member/reviewers.ts` |
| `STORAGE_KEY_PARTNER_STATUS_UPDATES` | JSON Array | 파트너 상태 변경 내역 | `src/data/manager_ga/member/partners.ts` |
| `STORAGE_KEY_PARTNER_PREVIOUS_STATUS` | JSON | 파트너 이전 상태 | `src/data/manager_ga/member/partners.ts` |

**사용 예시:**
```typescript
// 관리자 목록 불러오기
const stored = localStorage.getItem('manager_sa_admin_list');
const adminList = stored ? JSON.parse(stored) : [];

// 회원 상태 변경 내역 저장
const updates = [{ memberId, oldStatus, newStatus, timestamp }];
localStorage.setItem('STORAGE_KEY_REVIEWER_STATUS_UPDATES', JSON.stringify(updates));
```

---

## 📊 9. 캠페인 필터 상태

캠페인 목록 페이지의 필터 상태를 저장합니다.

| 키 | 데이터 타입 | 설명 | 사용 위치 |
|---|---|---|---|
| `partner_campaign_filter_state` | JSON | 파트너 캠페인 필터 상태 | `src/app/partner/campaign_management/page.tsx` |
| `campaign_filter_state` | JSON | 캠페인 필터 상태 (공통) | `src/hooks/common/campaign_management/useCampaignFilterBar.ts` |

**사용 예시:**
```typescript
// 필터 상태 저장
const filters = { status, category, searchTerm, ... };
localStorage.setItem('campaign_filter_state', JSON.stringify(filters));

// 필터 상태 불러오기
const stored = localStorage.getItem('campaign_filter_state');
const filters = stored ? JSON.parse(stored) : defaultFilters;
```

---

## 🗂️ 10. 커뮤니티 관련

커뮤니티 게시판의 게시글과 카테고리를 관리합니다.

| 키 | 데이터 타입 | 설명 | 사용 위치 |
|---|---|---|---|
| `PINNED_POSTS_STORAGE_KEY` | JSON Array | 고정된 게시글 ID 목록 | `src/utils/community/posts/pinnedPostsLocalStorage.ts` |
| `STORAGE_KEY_POSTS` | JSON Array | 게시글 목록 | `src/data/manager_ga/community/postsData.ts` |
| `STORAGE_KEY_POST_DETAILS` | JSON | 게시글 상세 정보 | `src/data/manager_ga/community/postsData.ts` |
| `STORAGE_KEY_CATEGORIES` | JSON Array | 카테고리 목록 | `src/data/manager_ga/community/categoriesData.ts` |

**사용 예시:**
```typescript
// 게시글 목록 저장
const posts = [{ id, title, content, author, ... }];
localStorage.setItem('STORAGE_KEY_POSTS', JSON.stringify(posts));

// 고정 게시글 ID 저장
const pinnedPostIds = [1, 5, 10];
window.localStorage.setItem('PINNED_POSTS_STORAGE_KEY', JSON.stringify(pinnedPostIds));
```

---

## 🚫 11. 신고/반려/차단 관련

관리자가 신고, 반려, 차단을 관리할 때 사용합니다.

| 키 | 데이터 타입 | 설명 | 사용 위치 |
|---|---|---|---|
| `STORAGE_KEY_REMOVED_REPORTED_IDS` | JSON Array | 제거된 신고 ID 목록 | `src/data/manager_ga/reported.ts` |
| `STORAGE_KEY_ADDITIONAL_REPORTED` | JSON Array | 추가된 신고 목록 | `src/data/manager_ga/reported.ts` |
| `STORAGE_KEY_REMOVED_REJECTED_IDS` | JSON Array | 제거된 반려 ID 목록 | `src/data/manager_ga/rejected.ts` |
| `STORAGE_KEY_ADDITIONAL_BLACKLIST` | JSON Array | 추가된 차단 목록 | `src/data/manager_ga/member/blacklist.ts` |
| `STORAGE_KEY_REMOVED_IDS` | JSON Array | 제거된 차단 ID 목록 | `src/data/manager_ga/member/blacklist.ts` |

**사용 예시:**
```typescript
// 제거된 신고 ID 저장
const stored = localStorage.getItem('STORAGE_KEY_REMOVED_REPORTED_IDS');
const removedIds = stored ? JSON.parse(stored) : [];
removedIds.push(reportId);
localStorage.setItem('STORAGE_KEY_REMOVED_REPORTED_IDS', JSON.stringify(removedIds));
```

---

## 📌 주요 특징 및 사용 패턴

### 1. 인증 시스템
- `reviewx_auth_user`와 `reviewx_auth_token`으로 로그인 상태 유지
- 로그아웃 시 반드시 두 키 모두 삭제

### 2. 캠페인 5가지 타입
- 모든 캠페인이 localStorage에 저장되어 관리됨
- 배송형, 방문형, 리뷰형, 기자단, 미션형으로 구분

### 3. 임시 저장 기능
- 작성 중인 폼 데이터를 `temp_*` 키로 자동 저장
- 페이지 재방문 시 자동으로 복원

### 4. 상태 추적
- 삭제/취소/완료 상태를 별도 ID 목록으로 관리
- 원본 데이터를 수정하지 않고 상태만 추적

### 5. 포인트 시스템
- 파트너의 포인트 및 결제 내역 관리
- 유저의 포인트 적립, 출금 관리
- 충전 및 출금 시 자동으로 업데이트

### 6. 출금 시스템
- 유저가 출금 신청 → `withdrawal_requests`에 저장 (status: 'pending')
- 관리자가 승인 → `withdrawal_requests` 상태 업데이트 (status: 'approved')
- 출금 완료 → `withdrawal_history`에 기록 추가
- 각 단계마다 `notifications`에 알림 생성

### 7. 알림 시스템
- 출금 신청 시: A_R10 카테고리 알림
- 출금 승인 시: A_R11 카테고리 알림
- 출금 반려 시: A_R12 카테고리 알림
- 24시간 형식 시간 표시 (hour12: false)

---

## ⚠️ 주의사항

1. **SSR 체크 필수**: Next.js에서는 `typeof window !== "undefined"` 체크 필요
2. **객체는 JSON 변환**: `JSON.stringify()`로 저장, `JSON.parse()`로 읽기
3. **에러 처리**: localStorage 접근 시 try-catch 사용 권장
4. **백엔드 연동 시**: 모든 localStorage 키는 API로 대체 예정
5. **포인트 계산**:
   - `available_points`: 출금 가능한 포인트
   - `pending_points`: 출금 대기 중인 포인트
   - 출금 신청 시 `pending_points` 증가, 승인 시 `available_points` 차감
6. **시간 형식**: 모든 날짜/시간은 ISO 8601 형식으로 저장 후 필요 시 변환

---

## 🔄 백엔드 연동 후 마이그레이션 계획

백엔드 API가 완성되면 다음과 같이 변경됩니다:

- **인증**: JWT 토큰 방식으로 전환
- **캠페인 데이터**: API에서 실시간으로 가져오기
- **포인트**: 서버에서 관리하는 실제 포인트 시스템
- **임시 저장**: 서버 세션 또는 DB에 임시 저장

현재는 localStorage를 사용하지만, 향후 API 연동 시에는 대부분의 키가 제거될 예정입니다.
