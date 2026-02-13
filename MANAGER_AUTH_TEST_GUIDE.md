# 관리자 로그인 시스템 테스트 가이드

## 개요
관리자(SA/GA) 로그인 시스템이 토큰 기반 인증으로 구현되어 있습니다.
이 문서는 시스템의 동작을 확인하고 테스트하는 방법을 안내합니다.

## 구현 내용

### 1. 토큰 기반 인증 시스템
- **토큰 저장**: `localStorage`에 `reviewx_auth_token` 키로 저장
- **사용자 정보**: `localStorage`에 `reviewx_auth_user` 키로 저장
- **토큰 형식**: `mock_token_{userId}_{timestamp}` (테스트용)

### 2. 주요 컴포넌트

#### 로그인 페이지
- **경로**: `/manager/login`
- **파일**: `src/app/manager/login/page.tsx`
- **기능**:
  - 이메일/비밀번호 입력
  - 관리자 계정 검증 (SA/GA만 허용)
  - 토큰 생성 및 저장
  - 역할별 대시보드로 자동 리다이렉트

#### 인증 가드
- **파일**: `src/components/manager/common/ManagerLayoutWrapper.tsx`
- **기능**:
  - 관리자 페이지 접근 시 토큰 확인
  - 미인증 사용자 로그인 페이지로 리다이렉트
  - SA/GA 권한 검증

#### 헤더 컴포넌트
- **파일**: `src/components/manager/ga/common/ManagerGAHeader.tsx`
- **기능**:
  - 사용자 아이콘 클릭 시 로그아웃 메뉴 표시
  - 로그아웃 버튼 클릭 시 토큰 삭제 및 로그인 페이지로 이동

### 3. 테스트 계정

| 역할 | 이메일 | 비밀번호 | 리다이렉트 경로 |
|------|--------|----------|----------------|
| SA 관리자 | `manager_sa@test.com` | `cjdaud1!` | `/manager_sa` |
| GA 관리자 | `manager_ga@test.com` | `cjdaud1!` | `/manager_ga` |

## 테스트 시나리오

### 시나리오 1: 정상 로그인 (SA)
1. 브라우저에서 `http://localhost:3000/manager/login` 접속
2. 아이디: `manager_sa@test.com` 입력
3. 비밀번호: `cjdaud1!` 입력
4. "로그인" 버튼 클릭
5. **예상 결과**:
   - `/manager_sa` 페이지로 자동 리다이렉트
   - localStorage에 토큰 저장 확인
   - 브라우저 개발자 도구 > Application > Local Storage 확인:
     - `reviewx_auth_token`: `mock_token_manager_sa_001_...`
     - `reviewx_auth_user`: `{"id":"manager_sa_001","role":"manager_sa",...}`

### 시나리오 2: 정상 로그인 (GA)
1. 브라우저에서 `http://localhost:3000/manager/login` 접속
2. 아이디: `manager_ga@test.com` 입력
3. 비밀번호: `cjdaud1!` 입력
4. "로그인" 버튼 클릭
5. **예상 결과**:
   - `/manager_ga` 페이지로 자동 리다이렉트
   - localStorage에 토큰 저장 확인

### 시나리오 3: 잘못된 비밀번호
1. 브라우저에서 `http://localhost:3000/manager/login` 접속
2. 아이디: `manager_sa@test.com` 입력
3. 비밀번호: `wrongpassword` 입력
4. "로그인" 버튼 클릭
5. **예상 결과**:
   - 에러 메시지 표시: "이메일 또는 비밀번호가 일치하지 않습니다."
   - 페이지 이동 없음

### 시나리오 4: 비관리자 계정 로그인 시도
1. 브라우저에서 `http://localhost:3000/manager/login` 접속
2. 아이디: `test@test.com` (파트너 계정) 입력
3. 비밀번호: `cjdaud1!` 입력
4. "로그인" 버튼 클릭
5. **예상 결과**:
   - 에러 메시지 표시: "관리자 계정만 로그인할 수 있습니다."
   - 페이지 이동 없음

### 시나리오 5: 인증 가드 테스트 (미인증 접근)
1. 브라우저 개발자 도구 > Application > Local Storage 열기
2. `reviewx_auth_token` 및 `reviewx_auth_user` 삭제
3. 브라우저에서 `http://localhost:3000/manager_sa` 접속
4. **예상 결과**:
   - 자동으로 `/manager/login`으로 리다이렉트
   - 콘솔에 로그: "🔒 [ManagerLayoutWrapper] 미인증 사용자 - 로그인 페이지로 이동"

### 시나리오 6: 권한 검증 테스트 (GA → SA 페이지 접근)
1. GA 계정으로 로그인 (`manager_ga@test.com`)
2. 브라우저 주소창에 `http://localhost:3000/manager_sa` 입력
3. **예상 결과**:
   - 자동으로 `/manager/login`으로 리다이렉트
   - 콘솔에 로그: "🚫 [ManagerLayoutWrapper] SA 권한 없음 - 로그인 페이지로 이동"

### 시나리오 7: 로그아웃
1. SA 또는 GA 계정으로 로그인
2. 대시보드에서 헤더 우측 상단의 사용자 아이콘 클릭
3. "로그아웃" 버튼 클릭
4. **예상 결과**:
   - `/manager/login`으로 리다이렉트
   - localStorage에서 토큰 및 사용자 정보 삭제 확인
   - 브라우저 개발자 도구 > Application > Local Storage 확인:
     - `reviewx_auth_token`: 삭제됨
     - `reviewx_auth_user`: 삭제됨

### 시나리오 8: 자동 로그인 (페이지 새로고침)
1. SA 또는 GA 계정으로 로그인
2. 대시보드에서 브라우저 새로고침 (F5)
3. **예상 결과**:
   - 로그인 상태 유지
   - 대시보드 페이지 그대로 표시
   - 로그인 페이지로 리다이렉트되지 않음

## 브라우저 개발자 도구 확인 방법

### localStorage 확인
1. 브라우저에서 F12 키를 눌러 개발자 도구 열기
2. "Application" 탭 선택
3. 좌측 메뉴에서 "Local Storage" > `http://localhost:3000` 선택
4. 확인할 키:
   - `reviewx_auth_token`: 토큰 문자열
   - `reviewx_auth_user`: 사용자 정보 JSON

### 콘솔 로그 확인
1. 브라우저에서 F12 키를 눌러 개발자 도구 열기
2. "Console" 탭 선택
3. 확인할 로그:
   - `✅ [관리자 로그인] 로그인 성공` (로그인 시)
   - `✅ [ManagerLayoutWrapper] 인증 확인 완료` (페이지 접근 시)
   - `🔒 [ManagerLayoutWrapper] 미인증 사용자` (미인증 접근 시)
   - `🚫 [ManagerLayoutWrapper] SA/GA 권한 없음` (권한 없는 접근 시)

## 파일 구조

```
src/
├── app/
│   ├── manager/
│   │   └── login/
│   │       └── page.tsx          # 관리자 공용 로그인 페이지
│   ├── manager_sa/
│   │   ├── layout.tsx             # SA 레이아웃 (인증 가드 포함)
│   │   └── page.tsx               # SA 대시보드
│   └── manager_ga/
│       ├── layout.tsx             # GA 레이아웃 (인증 가드 포함)
│       └── page.tsx               # GA 대시보드
├── components/
│   └── manager/
│       ├── common/
│       │   └── ManagerLayoutWrapper.tsx  # 인증 가드 컴포넌트
│       └── ga/
│           └── common/
│               └── ManagerGAHeader.tsx   # 헤더 (로그아웃 버튼)
├── lib/
│   └── auth.ts                    # 인증 유틸리티 함수
├── types/
│   └── auth.ts                    # 인증 타입 정의
├── contexts/
│   └── AuthContext.tsx            # 인증 Context (전역 상태)
└── data/
    └── login/
        └── unifiedAccountData.ts  # 테스트 계정 데이터
```

## 주요 함수

### 인증 함수 (`src/lib/auth.ts`)

```typescript
// 로그인 처리
authenticateUser(credentials, role)
  → 토큰 생성 및 localStorage 저장

// 토큰 조회
getStoredToken()
  → localStorage에서 토큰 가져오기

// 사용자 정보 조회
getStoredUser()
  → localStorage에서 사용자 정보 가져오기

// 자동 로그인 체크
checkAutoLogin()
  → 페이지 로드 시 토큰 및 사용자 정보 확인

// 로그아웃
performLogout()
  → localStorage에서 토큰 및 사용자 정보 삭제
```

## 보안 고려사항

현재 구현은 **테스트/개발 환경**을 위한 것입니다. 프로덕션 환경에서는 다음 사항을 고려해야 합니다:

1. **JWT 토큰 사용**: Mock 토큰 대신 실제 JWT 토큰 사용
2. **토큰 만료 시간**: 토큰 만료 시간 설정 및 갱신 로직
3. **HTTPS**: HTTPS 사용 (토큰 전송 보안)
4. **HttpOnly 쿠키**: localStorage 대신 HttpOnly 쿠키 사용 (XSS 방지)
5. **CSRF 토큰**: CSRF 공격 방지
6. **서버 사이드 검증**: 모든 API 요청에 대한 서버 사이드 토큰 검증

## 문제 해결

### 로그인 후 리다이렉트되지 않음
- 브라우저 콘솔에서 에러 메시지 확인
- `src/lib/auth.ts`의 `getHomePathForRole()` 함수 확인

### 인증 가드가 작동하지 않음
- 브라우저 콘솔에서 `[ManagerLayoutWrapper]` 로그 확인
- localStorage에 토큰이 있는지 확인
- `src/components/manager/common/ManagerLayoutWrapper.tsx` 파일 확인

### 로그아웃 후에도 로그인 상태 유지
- 브라우저 캐시 삭제
- localStorage 수동 삭제
- 브라우저 개발자 도구 > Application > Local Storage > Clear All

## 추가 정보

### 파트너/유저 로그인과의 일관성
관리자 로그인 시스템은 파트너/유저 로그인과 동일한 인증 시스템을 사용합니다:

- **파트너 로그인**: `/partner/login` → 이메일/비밀번호
- **유저 로그인**: `/user/login` → 소셜 로그인 (네이버/카카오)
- **관리자 로그인**: `/manager/login` → 이메일/비밀번호 (SA/GA만 허용)

모든 역할은 동일한 `useAuth` 훅과 `AuthContext`를 사용하여 인증 상태를 관리합니다.

## 결론

관리자 로그인 시스템은 토큰 기반 인증으로 완벽하게 구현되어 있으며, 다음 기능을 제공합니다:

- ✅ 토큰 저장 및 관리 (localStorage)
- ✅ 로그인/로그아웃
- ✅ 자동 로그인 (페이지 새로고침 시)
- ✅ 인증 가드 (미인증 접근 차단)
- ✅ 권한 검증 (SA/GA 구분)
- ✅ 파트너/유저와 일관된 인증 시스템

모든 테스트 시나리오를 통과하면 시스템이 정상적으로 작동하는 것입니다.
