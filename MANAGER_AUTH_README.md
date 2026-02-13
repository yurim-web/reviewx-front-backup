# 관리자 로그인 시스템 - 구현 완료

## 개요
ReviewX 관리자(SA/GA) 로그인 시스템을 **토큰 기반 인증**으로 구현했습니다.
파트너/유저와 동일한 인증 시스템을 사용하여 일관성 있는 인증 플로우를 제공합니다.

## 주요 기능

### ✅ 구현 완료
- [x] 토큰 기반 인증 (localStorage)
- [x] 관리자 로그인 페이지 (`/manager/login`)
- [x] SA/GA 역할 구분 및 권한 검증
- [x] 자동 로그인 (페이지 새로고침 시)
- [x] 인증 가드 (미인증 접근 차단)
- [x] 로그아웃 기능 (헤더 메뉴)
- [x] 역할별 대시보드 리다이렉트

### 🔐 인증 플로우
```
로그인 페이지
    ↓
이메일/비밀번호 입력
    ↓
관리자 계정 검증 (SA/GA만 허용)
    ↓
토큰 생성 및 저장
    ↓
역할별 대시보드로 이동
    ↓
인증 가드 활성화
```

## 빠른 시작

### 1. 로그인 테스트

**SA 관리자**
- URL: `http://localhost:3000/manager/login`
- 이메일: `manager_sa@test.com`
- 비밀번호: `cjdaud1!`
- 리다이렉트: `/manager_sa`

**GA 관리자**
- URL: `http://localhost:3000/manager/login`
- 이메일: `manager_ga@test.com`
- 비밀번호: `cjdaud1!`
- 리다이렉트: `/manager_ga`

### 2. 인증 확인
브라우저 개발자 도구 > Application > Local Storage 확인:
```
reviewx_auth_token: mock_token_manager_sa_001_1234567890
reviewx_auth_user: {"id":"manager_sa_001","role":"manager_sa",...}
```

### 3. 로그아웃
대시보드 헤더 > 사용자 아이콘 클릭 > "로그아웃" 버튼 클릭

## 수정된 파일

### 새로 추가된 기능
1. **`src/components/manager/common/ManagerLayoutWrapper.tsx`**
   - 인증 가드 추가
   - 권한 검증 로직

2. **`src/app/manager/login/page.tsx`**
   - 로그인 성공 로그 추가

### 기존에 구현되어 있던 파일
- `src/lib/auth.ts` - 인증 유틸리티
- `src/contexts/AuthContext.tsx` - 전역 인증 상태
- `src/components/manager/ga/common/ManagerGAHeader.tsx` - 로그아웃 버튼
- `src/data/login/unifiedAccountData.ts` - 테스트 계정

## 인증 시스템 구조

### 토큰 저장
```typescript
localStorage.setItem('reviewx_auth_token', token);
localStorage.setItem('reviewx_auth_user', JSON.stringify(user));
```

### 토큰 확인
```typescript
const token = localStorage.getItem('reviewx_auth_token');
const user = JSON.parse(localStorage.getItem('reviewx_auth_user'));
```

### 로그아웃
```typescript
localStorage.removeItem('reviewx_auth_token');
localStorage.removeItem('reviewx_auth_user');
```

## 테스트 시나리오

### ✅ 정상 로그인
1. `/manager/login` 접속
2. SA 또는 GA 계정으로 로그인
3. 역할별 대시보드로 자동 이동
4. localStorage에 토큰 저장 확인

### ✅ 인증 가드
1. localStorage 토큰 삭제
2. `/manager_sa` 또는 `/manager_ga` 직접 접속
3. `/manager/login`으로 자동 리다이렉트

### ✅ 권한 검증
1. GA 계정으로 로그인
2. `/manager_sa` 접속 시도
3. `/manager/login`으로 자동 리다이렉트

### ✅ 자동 로그인
1. SA 또는 GA 계정으로 로그인
2. 브라우저 새로고침 (F5)
3. 로그인 상태 유지 확인

### ✅ 로그아웃
1. 헤더 사용자 아이콘 클릭
2. "로그아웃" 버튼 클릭
3. `/manager/login`으로 이동
4. localStorage 토큰 삭제 확인

## 파트너/유저와의 일관성

모든 역할이 동일한 인증 시스템을 사용합니다:

| 역할 | 로그인 페이지 | 인증 방식 | 대시보드 |
|------|--------------|-----------|----------|
| 관리자 SA | `/manager/login` | 이메일/비밀번호 | `/manager_sa` |
| 관리자 GA | `/manager/login` | 이메일/비밀번호 | `/manager_ga` |
| 파트너 | `/partner/login` | 이메일/비밀번호 | `/partner` |
| 유저 | `/user/login` | 소셜 로그인 | `/user` |

모든 역할은:
- `useAuth` 훅 사용
- `AuthContext`로 전역 상태 관리
- localStorage에 토큰 저장
- 인증 가드로 보호

## 문서

### 📖 상세 문서
- [구현 문서](./MANAGER_AUTH_IMPLEMENTATION.md) - 아키텍처, 코드, API 연동
- [테스트 가이드](./MANAGER_AUTH_TEST_GUIDE.md) - 테스트 시나리오, 디버깅

### 📁 주요 파일
```
src/
├── app/
│   ├── manager/login/page.tsx          # 로그인 페이지
│   ├── manager_sa/layout.tsx           # SA 레이아웃
│   └── manager_ga/layout.tsx           # GA 레이아웃
│
├── components/manager/common/
│   └── ManagerLayoutWrapper.tsx        # 인증 가드
│
├── lib/
│   └── auth.ts                         # 인증 유틸리티
│
├── contexts/
│   └── AuthContext.tsx                 # 전역 상태
│
└── data/login/
    └── unifiedAccountData.ts           # 테스트 계정
```

## 디버깅

### 콘솔 로그 확인
```
✅ [관리자 로그인] 로그인 성공
✅ [ManagerLayoutWrapper] 인증 확인 완료
🔒 [ManagerLayoutWrapper] 미인증 사용자
🚫 [ManagerLayoutWrapper] SA/GA 권한 없음
```

### localStorage 확인
```javascript
// 브라우저 콘솔
console.log(localStorage.getItem('reviewx_auth_token'));
console.log(localStorage.getItem('reviewx_auth_user'));
```

### 강제 로그아웃
```javascript
// 브라우저 콘솔
localStorage.clear();
location.reload();
```

## 보안 고려사항

### 현재 (개발/테스트)
- Mock 토큰 사용
- localStorage 저장
- 클라이언트 검증

### 프로덕션 권장
- JWT 토큰
- HttpOnly 쿠키
- 서버 사이드 검증
- HTTPS
- 토큰 만료/갱신
- Rate Limiting

## 다음 단계

### API 연동
1. 로그인 API 구현
2. 토큰 검증 API
3. JWT 토큰 사용
4. 서버 사이드 검증

### 추가 기능
1. 비밀번호 찾기
2. 로그인 이력 관리
3. 다중 기기 로그인 제한
4. 2FA (이중 인증)

## 트러블슈팅

### 로그인 후 리다이렉트 안 됨
- 브라우저 콘솔 에러 확인
- `getHomePathForRole()` 함수 확인

### 인증 가드 작동 안 함
- localStorage 토큰 확인
- `ManagerLayoutWrapper` 로그 확인

### 로그아웃 후에도 로그인 유지
- localStorage 수동 삭제
- 브라우저 캐시 삭제

## 결론

관리자 로그인 시스템이 **토큰 기반 인증**으로 완벽하게 구현되었습니다.

### 구현된 기능
✅ 토큰 저장/조회
✅ 로그인/로그아웃
✅ 자동 로그인
✅ 인증 가드
✅ 권한 검증
✅ 파트너/유저와 일관된 인증

모든 테스트 시나리오를 통과하면 시스템이 정상 작동하는 것입니다.

---

**문의**: 개발팀
**마지막 업데이트**: 2026-02-12
