# 관리자 로그인 시스템 구현 문서

## 프로젝트 개요
ReviewX 관리자(SA/GA) 로그인 시스템을 파트너/유저와 동일한 토큰 기반 인증으로 구현했습니다.

## 기술 스택
- **Frontend**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **인증 방식**: 토큰 기반 (localStorage)
- **상태 관리**: React Context API
- **라우팅**: Next.js App Router

## 아키텍처

### 인증 플로우
```
1. 로그인 페이지 (/manager/login)
   ↓
2. 이메일/비밀번호 입력
   ↓
3. authenticateUser() 호출
   ↓
4. 토큰 생성 및 localStorage 저장
   ↓
5. AuthContext 상태 업데이트
   ↓
6. 역할별 대시보드로 리다이렉트
   - SA: /manager_sa
   - GA: /manager_ga
```

### 인증 가드 플로우
```
1. 관리자 페이지 접근
   ↓
2. ManagerLayoutWrapper 실행
   ↓
3. localStorage에서 토큰 확인
   ↓
4-1. 토큰 없음 → /manager/login 리다이렉트
4-2. 토큰 있음 → 권한 검증
   ↓
5-1. 권한 없음 → /manager/login 리다이렉트
5-2. 권한 있음 → 페이지 렌더링
```

## 핵심 구현

### 1. 인증 유틸리티 (`src/lib/auth.ts`)

#### 주요 함수

```typescript
// 토큰 저장
export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

// 토큰 조회
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

// 사용자 정보 저장
export function setStoredUser(user: AuthUser): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

// 사용자 정보 조회
export function getStoredUser(): AuthUser | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

// 로그인 처리
export async function authenticateUser(
  credentials: LoginCredentials,
  role?: UserRole
): Promise<AuthUser> {
  // 1. 계정 검증
  const account = findAccountByCredentials(
    credentials.email,
    credentials.password
  );

  // 2. 권한 검증
  if (role && authUser.role !== role) {
    throw new Error("해당 계정 유형으로 로그인할 수 없습니다.");
  }

  // 3. 토큰 생성
  const mockToken = `mock_token_${authUser.id}_${Date.now()}`;

  // 4. 저장
  setStoredUser(authUser);
  setStoredToken(mockToken);

  return authUser;
}

// 자동 로그인 체크
export function checkAutoLogin(): AuthUser | null {
  const user = getStoredUser();
  const token = getStoredToken();
  return (user && token) ? user : null;
}

// 로그아웃
export function performLogout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}
```

### 2. AuthContext (`src/contexts/AuthContext.tsx`)

전역 인증 상태 관리

```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 자동 로그인 체크
  useEffect(() => {
    const storedUser = checkAutoLogin();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, [pathname]);

  // 로그인
  const login = async (credentials: LoginCredentials, role: UserRole) => {
    const authUser = await authenticateUser(credentials, role);
    setUser(authUser);
    router.push(getHomePathForRole(role));
  };

  // 로그아웃
  const logout = () => {
    performLogout();
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 3. 로그인 페이지 (`src/app/manager/login/page.tsx`)

```typescript
export default function AdminLoginPage() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 관리자 계정 확인
      const account = unifiedAccountData.find(
        (acc) => acc.email === username && acc.password === password
      );

      if (!account) {
        setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
        return;
      }

      // 관리자 권한 확인
      if (account.role !== "manager_ga" && account.role !== "manager_sa") {
        setErrorMessage("관리자 계정만 로그인할 수 있습니다.");
        return;
      }

      // 로그인 (토큰 생성 및 저장)
      await login({ email: username, password }, account.role);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" disabled={isLoading}>로그인</button>
      {errorMessage && <span>{errorMessage}</span>}
    </form>
  );
}
```

### 4. 인증 가드 (`src/components/manager/common/ManagerLayoutWrapper.tsx`)

```typescript
export default function ManagerLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isManagerPath = pathname.startsWith("/manager_sa") || pathname.startsWith("/manager_ga");

    if (isManagerPath && !authLoading) {
      // 미인증 사용자 차단
      if (!isAuthenticated || !user) {
        console.log("🔒 미인증 사용자 - 로그인 페이지로 이동");
        router.replace("/manager/login");
        return;
      }

      // 권한 검증
      const isSAPath = pathname.startsWith("/manager_sa");
      const isGAPath = pathname.startsWith("/manager_ga");

      if (isSAPath && user.role !== "manager_sa") {
        console.log("🚫 SA 권한 없음");
        router.replace("/manager/login");
        return;
      }

      if (isGAPath && user.role !== "manager_ga") {
        console.log("🚫 GA 권한 없음");
        router.replace("/manager/login");
        return;
      }

      setIsReady(true);
    }
  }, [pathname, isAuthenticated, user, authLoading, router]);

  if (!isReady || authLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
```

### 5. 헤더 컴포넌트 (`src/components/manager/ga/common/ManagerGAHeader.tsx`)

```typescript
export default function ManagerGAHeader() {
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    performLogout();
    setIsLogoutMenuOpen(false);
    window.location.href = "/manager/login";
  };

  return (
    <header>
      <div className="user-menu-container">
        <button onClick={() => setIsLogoutMenuOpen(!isLogoutMenuOpen)}>
          <img src="/images/user-icon.svg" />
        </button>
        {isLogoutMenuOpen && (
          <button onClick={handleLogoutClick}>로그아웃</button>
        )}
      </div>
    </header>
  );
}
```

## 데이터 구조

### AuthUser 타입 (`src/types/auth.ts`)

```typescript
export type UserRole = 'user' | 'partner' | 'manager_ga' | 'manager_sa';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;

  // 관리자 전용 필드
  admin_level?: 'GA' | 'SA';
  permissions?: string[];
}
```

### 테스트 계정 (`src/data/login/unifiedAccountData.ts`)

```typescript
const UNIFIED_ACCOUNTS_DATA: UnifiedAccount[] = [
  // SA 관리자
  {
    id: "manager_sa_001",
    userType: "admin_sa",
    role: "manager_sa",
    name: "최고관리자",
    email: "manager_sa@test.com",
    password: "cjdaud1!",
    phone: "010-7777-7777",
    redirectUrl: "/manager_sa",
  },

  // GA 관리자
  {
    id: "manager_ga_001",
    userType: "admin_ga",
    role: "manager_ga",
    name: "일반관리자",
    email: "manager_ga@test.com",
    password: "cjdaud1!",
    phone: "010-6666-6666",
    redirectUrl: "/manager_ga",
  },
];
```

## 파일 구조

```
src/
├── app/
│   ├── layout.tsx                      # AuthProvider 적용
│   ├── manager/
│   │   └── login/
│   │       └── page.tsx                # 관리자 로그인 페이지
│   ├── manager_sa/
│   │   ├── layout.tsx                  # SA 레이아웃
│   │   └── page.tsx                    # SA 대시보드
│   └── manager_ga/
│       ├── layout.tsx                  # GA 레이아웃
│       └── page.tsx                    # GA 대시보드
│
├── components/
│   └── manager/
│       ├── common/
│       │   └── ManagerLayoutWrapper.tsx  # 인증 가드
│       └── ga/
│           └── common/
│               └── ManagerGAHeader.tsx   # 헤더 (로그아웃)
│
├── contexts/
│   └── AuthContext.tsx                 # 전역 인증 상태
│
├── hooks/
│   └── useAuth.ts                      # useAuth 훅
│
├── lib/
│   └── auth.ts                         # 인증 유틸리티
│
├── types/
│   └── auth.ts                         # 인증 타입
│
└── data/
    └── login/
        └── unifiedAccountData.ts       # 테스트 계정
```

## 테스트 계정

| 역할 | 이메일 | 비밀번호 | 대시보드 경로 |
|------|--------|----------|--------------|
| SA 관리자 | manager_sa@test.com | cjdaud1! | /manager_sa |
| GA 관리자 | manager_ga@test.com | cjdaud1! | /manager_ga |

## localStorage 키

| 키 | 값 | 설명 |
|----|-----|------|
| `reviewx_auth_token` | `mock_token_{userId}_{timestamp}` | 인증 토큰 |
| `reviewx_auth_user` | `{"id":"...","role":"..."}` | 사용자 정보 JSON |

## 보안 고려사항

### 현재 구현 (개발/테스트)
- Mock 토큰 사용
- localStorage 저장
- 클라이언트 사이드 검증

### 프로덕션 권장사항
1. **JWT 토큰**: 실제 JWT 사용
2. **서버 사이드 검증**: 모든 API 요청 검증
3. **HttpOnly 쿠키**: XSS 공격 방지
4. **HTTPS**: 전송 보안
5. **토큰 만료**: 자동 갱신 로직
6. **CSRF 방지**: CSRF 토큰 사용
7. **Rate Limiting**: 무차별 대입 공격 방지

## 개선 사항 (v2)

### 추가된 기능
1. **인증 가드**: 미인증 사용자 자동 리다이렉트
2. **권한 검증**: SA/GA 역할별 접근 제어
3. **자동 로그인**: 페이지 새로고침 시 상태 유지
4. **로그 추가**: 디버깅을 위한 콘솔 로그

### 기존 기능 (이미 구현됨)
1. **토큰 관리**: localStorage 기반
2. **로그인/로그아웃**: useAuth 훅 사용
3. **전역 상태**: AuthContext로 관리
4. **일관된 인증**: 파트너/유저와 동일한 시스템

## API 연동 가이드

실제 백엔드 API 연동 시 수정할 부분:

### 1. 로그인 API 호출

```typescript
// src/lib/auth.ts
export async function authenticateUser(credentials: LoginCredentials, role?: UserRole) {
  // Mock 데이터 대신 실제 API 호출
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...credentials, role }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  // 실제 JWT 토큰 저장
  setStoredToken(data.token);
  setStoredUser(data.user);

  return data.user;
}
```

### 2. 토큰 검증 API

```typescript
// src/lib/auth.ts
export async function verifyToken(token: string): Promise<boolean> {
  const response = await fetch('/api/auth/verify', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  return response.ok;
}
```

### 3. API 요청 인터셉터

```typescript
// src/lib/api.ts
export async function fetchWithAuth(url: string, options = {}) {
  const token = getStoredToken();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
}
```

## 디버깅 팁

### 콘솔 로그
- `✅ [관리자 로그인] 로그인 성공`: 로그인 성공 시
- `✅ [ManagerLayoutWrapper] 인증 확인 완료`: 인증 성공 시
- `🔒 [ManagerLayoutWrapper] 미인증 사용자`: 미인증 접근 시
- `🚫 [ManagerLayoutWrapper] SA/GA 권한 없음`: 권한 없는 접근 시

### localStorage 확인
```javascript
// 브라우저 콘솔에서 실행
localStorage.getItem('reviewx_auth_token')
localStorage.getItem('reviewx_auth_user')
```

### 강제 로그아웃
```javascript
// 브라우저 콘솔에서 실행
localStorage.removeItem('reviewx_auth_token')
localStorage.removeItem('reviewx_auth_user')
location.reload()
```

## 참고 문서
- [테스트 가이드](./MANAGER_AUTH_TEST_GUIDE.md)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Context API](https://react.dev/reference/react/createContext)

## 변경 이력

### v1.0 (초기 구현)
- 관리자 로그인 페이지 구현
- useAuth 훅 사용
- 토큰 저장/조회

### v2.0 (현재)
- 인증 가드 추가
- 권한 검증 추가
- 로그 추가
- 문서 작성

## 문의
구현 관련 문의사항은 개발팀에 문의해주세요.
