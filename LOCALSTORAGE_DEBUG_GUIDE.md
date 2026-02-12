# localStorage 데이터 로딩 문제 해결 가이드

## 문제 상황
두 페이지에서 `localStorage` 데이터가 제대로 로드되지 않는 문제 발생:
1. `/user/mypage/channel/connect` - 채널 연동 정보가 안 보임
2. `/user/mypage/address` - 주소 정보가 안 보임

## 원인 분석

### 1. 채널 연결 페이지 (`/user/mypage/channel/connect`)
- **문제**: `localStorage.getItem('current_user')`를 직접 읽고 있었음
- **원인**: `useAuth()` 훅을 사용하지 않아 사용자 정보를 제대로 가져오지 못함
- **해결**: `useAuth()` 훅 사용하도록 변경

### 2. 주소 페이지 (`/user/mypage/address`)
- **문제**: `sessionStorage`만 읽고 `localStorage`의 `user_accounts`를 확인하지 않음
- **원인**: 기존 로직이 임시 저장용 `sessionStorage`만 사용
- **해결**: `localStorage`의 `user_accounts`에서 주소 정보를 먼저 로드하도록 변경

### 3. 데이터 구조 차이
- **user_accounts 구조**:
  - 개별 필드: `address`, `postal_code`, `detail_address`
  - 또는 객체: `address_details: { postalCode, address, detailAddress }`
- **해결**: 두 가지 구조 모두 지원하도록 수정

## 수정 내용

### 1. 채널 연결 페이지 수정
**파일**: `c:\develop\reviewx-web\src\app\user\mypage\channel\connect\page.tsx`

#### 변경 사항:
1. `useAuth` 훅 import 추가
```typescript
import { useAuth } from "@/hooks/useAuth";
```

2. 컴포넌트에서 user 가져오기
```typescript
const { user } = useAuth();
```

3. localStorage 로드 로직 수정 (useEffect 의존성 변경)
```typescript
// 기존: current_user를 직접 읽음
useEffect(() => {
  const currentUser = localStorage.getItem('current_user');
  // ...
}, []);

// 수정: useAuth 훅 사용
useEffect(() => {
  if (typeof window !== 'undefined' && user) {
    // user 객체 사용
  }
}, [user]); // user 변경 시 재실행
```

4. 디버깅 로그 추가
- 사용자 정보 확인: `console.log('🔍 [채널 연결 페이지] 사용자 정보:', user)`
- user_accounts 확인: `console.log('📦 [채널 연결 페이지] user_accounts:', storedAccounts)`
- 매칭된 계정 확인: `console.log('✅ [채널 연결 페이지] userAccount:', userAccount)`
- 로드된 채널 정보: `console.log('🔄 [채널 연결 페이지] 채널 정보 로드됨:', loadedChannels)`

### 2. 주소 페이지 수정
**파일**: `c:\develop\reviewx-web\src\app\user\mypage\address\page.tsx`

#### 변경 사항:
1. `useAuth` 훅 import 추가
```typescript
import { useAuth } from "@/hooks/useAuth";
```

2. 컴포넌트에서 user 가져오기
```typescript
const { user } = useAuth();
```

3. localStorage 로드 로직 추가
```typescript
// localStorage의 user_accounts에서 주소 정보 확인
if (userAccount?.address_details) {
  // address_details 객체로 저장된 경우
  setAddressData({
    postalCode: userAccount.address_details.postalCode || userAccount.address_details.postal_code || "",
    address: userAccount.address_details.address || "",
    detailAddress: userAccount.address_details.detailAddress || userAccount.address_details.detail_address || "",
  });
} else if (userAccount?.address || userAccount?.postal_code || userAccount?.detail_address) {
  // 개별 필드로 저장된 경우
  setAddressData({
    postalCode: userAccount.postal_code || "",
    address: userAccount.address || "",
    detailAddress: userAccount.detail_address || "",
  });
}
```

4. 저장 로직에 localStorage 업데이트 추가
```typescript
// localStorage의 user_accounts에 주소 정보 저장
const accountIndex = accounts.findIndex((a: any) => a.id === user.id || a.email === user.email);
if (accountIndex >= 0) {
  accounts[accountIndex] = {
    ...accounts[accountIndex],
    address_details: {
      postalCode: addressData.postalCode,
      address: addressData.address,
      detailAddress: addressData.detailAddress,
      fullAddress: fullAddress,
    },
  };
  localStorage.setItem('user_accounts', JSON.stringify(accounts));
}
```

5. 디버깅 로그 추가
- 사용자 정보 확인: `console.log('🔍 [주소 페이지] 사용자 정보:', user)`
- user_accounts 확인: `console.log('📦 [주소 페이지] user_accounts:', storedAccounts)`
- 매칭된 계정 확인: `console.log('✅ [주소 페이지] userAccount:', userAccount)`
- 로드된 주소 정보: `console.log('🔄 [주소 페이지] localStorage에서 주소 정보 로드됨:', ...)`

## 디버깅 방법

### 브라우저 콘솔에서 확인할 로그
페이지 로드 시 다음과 같은 로그가 순서대로 출력되어야 합니다:

#### 채널 연결 페이지
```
🔍 [채널 연결 페이지] 사용자 정보: {id: "user_kakao_001", email: "...", ...}
📦 [채널 연결 페이지] user_accounts: [{id: "user_kakao_001", ...}, ...]
✅ [채널 연결 페이지] userAccount: {id: "user_kakao_001", channel_details: [...], ...}
🔄 [채널 연결 페이지] 채널 정보 로드됨: [{name: "네이버 블로그", url: "...", status: "connected"}, ...]
```

#### 주소 페이지
```
🔍 [주소 페이지] 사용자 정보: {id: "user_kakao_001", email: "...", ...}
📦 [주소 페이지] user_accounts: [{id: "user_kakao_001", ...}, ...]
✅ [주소 페이지] userAccount: {id: "user_kakao_001", address: "...", ...}
🔄 [주소 페이지] localStorage에서 주소 정보 로드됨 (개별 필드): {address: "...", postal_code: "...", ...}
```

### localStorage 직접 확인
브라우저 개발자 도구 > Application > Local Storage에서 다음 키 확인:

1. **reviewx_auth_user**: 현재 로그인한 사용자 정보
2. **user_accounts**: 모든 사용자 계정 정보 배열
   - 채널 정보: `channel_details` 배열
   - 주소 정보: `address`, `postal_code`, `detail_address` 또는 `address_details` 객체

### 문제 해결 체크리스트

#### 데이터가 보이지 않는 경우
1. [ ] 브라우저 콘솔에서 사용자 정보 로그 확인
   - `⚠️ [페이지] 사용자 정보가 없습니다.` → 로그인 필요
2. [ ] user_accounts 로그 확인
   - `⚠️ [페이지] user_accounts가 없습니다.` → 로그인 후 자동 생성됨
3. [ ] userAccount 로그 확인
   - `userAccount: undefined` → 사용자 매칭 실패 (id/email 확인)
4. [ ] 채널/주소 정보 로그 확인
   - `channel_details가 없습니다.` → 채널 연결 필요
   - `주소 정보가 없습니다.` → 주소 등록 필요

#### 데이터 매칭 문제
- **증상**: userAccount를 찾을 수 없음
- **원인**: `user.id`와 `userAccount.id`가 다름
- **확인**: 콘솔에서 두 값 비교
  ```javascript
  // 콘솔에서 실행
  const currentUser = JSON.parse(localStorage.getItem('reviewx_auth_user'));
  const accounts = JSON.parse(localStorage.getItem('user_accounts'));
  console.log('current user id:', currentUser.id);
  console.log('user_accounts ids:', accounts.map(a => a.id));
  ```
- **해결**: 매칭 로직이 `id` 또는 `email`로 찾도록 되어 있음 (이미 적용됨)

## 테스트 방법

### 1. 채널 연결 페이지 테스트
1. 로그인 (리뷰어 계정: `oheunyoung@naver.com` / `test1234`)
2. `/user/mypage/channel/connect` 페이지 접속
3. 브라우저 콘솔 확인 (위의 로그 확인)
4. 채널 목록이 보이는지 확인
5. 기존에 연결된 채널이 있다면 URL이 표시되는지 확인

### 2. 주소 페이지 테스트
1. 로그인 (리뷰어 계정: `oheunyoung@naver.com` / `test1234`)
2. `/user/mypage/address` 페이지 접속
3. 브라우저 콘솔 확인 (위의 로그 확인)
4. 기존에 등록된 주소가 있다면 자동으로 입력되는지 확인
5. 주소 입력 후 저장
6. 다시 페이지 접속하여 저장된 주소가 로드되는지 확인

### 3. 데이터 흐름 테스트
1. 캠페인 신청 모달 열기
2. "채널 수정" 버튼 클릭 → `/user/mypage/channel/connect` 이동
3. 채널 연결/수정 후 뒤로가기
4. 모달에 변경된 채널 정보 반영 확인
5. "주소 수정" 버튼 클릭 → `/user/mypage/address` 이동
6. 주소 입력 후 저장
7. 뒤로가기하여 모달에 주소 반영 확인

## localStorage 데이터 구조

### user_accounts
```json
[
  {
    "id": "user_kakao_001",
    "email": "oheunyoung@naver.com",
    "name": "홍길동",
    "nickname": "홍길동님별명",
    "phone": "010-1111-1111",
    "address": "서울시 강남구 테헤란로 123",
    "postal_code": "06234",
    "detail_address": "",
    "address_details": {
      "postalCode": "06234",
      "address": "서울시 강남구 테헤란로 123",
      "detailAddress": "",
      "fullAddress": "서울시 강남구 테헤란로 123 | 우편번호 06234"
    },
    "channel_details": [
      {
        "name": "네이버 블로그",
        "url": "https://blog.naver.com/catcat12344",
        "status": "connected",
        "daily_visits": 100,
        "total_visits": 10000,
        "neighbors": 500
      },
      {
        "name": "네이버 클립",
        "url": "https://clip.naver.com/catcat",
        "status": "connected",
        "followers": 1000
      },
      {
        "name": "인스타그램",
        "url": "https://instagram.com/catcat",
        "status": "connected",
        "followers": 5000
      },
      {
        "name": "유튜브",
        "url": "https://youtube.com/@catcat",
        "status": "connected",
        "subscribers": 2000
      }
    ],
    "channels": ["Blog", "Clip", "Instagram", "Youtube"],
    "grade": "gold",
    "current_points": 511200
  }
]
```

## 참고 파일
- `c:\develop\reviewx-web\src\app\user\mypage\channel\connect\page.tsx` - 채널 연결 페이지
- `c:\develop\reviewx-web\src\app\user\mypage\address\page.tsx` - 주소 페이지
- `c:\develop\reviewx-web\src\app\user\mypage\channel\page.tsx` - 채널 페이지 (정상 작동 참고용)
- `c:\develop\reviewx-web\src\hooks\useAuth.ts` - 인증 훅
- `c:\develop\reviewx-web\src\contexts\AuthContext.tsx` - 인증 컨텍스트
- `c:\develop\reviewx-web\src\lib\auth.ts` - 인증 로직 (user_accounts 생성)
