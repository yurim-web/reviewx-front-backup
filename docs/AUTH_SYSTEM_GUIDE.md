# 🔐 ReviewX 인증 시스템 사용 가이드

## 개요

LocalStorage 기반 세션 관리 시스템이 구축되었습니다. 이제 로그인한 사용자의 정보를 전역에서 사용할 수 있으며, 페이지를 새로고침해도 로그인 상태가 유지됩니다.

---

## 📁 생성된 파일 목록

```
src/
├── types/
│   └── auth.ts                      # 인증 관련 타입 정의
├── lib/
│   └── auth.ts                      # 인증 유틸리티 함수 (LocalStorage 관리)
├── contexts/
│   └── AuthContext.tsx              # 전역 인증 상태 관리
├── hooks/
│   └── useAuth.ts                   # 인증 상태 사용 hook
├── components/
│   └── auth/
│       └── withAuth.tsx             # 보호된 라우트 HOC
└── app/
    └── layout.tsx (수정됨)          # AuthProvider 추가
```

---

## 🚀 기본 사용법

### 1. 로그인된 사용자 정보 가져오기

모든 페이지에서 `useAuth` hook을 사용하여 현재 로그인된 사용자 정보를 가져올 수 있습니다.

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function MyPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!isAuthenticated) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div>
      <h1>안녕하세요, {user.name}님!</h1>
      <p>이메일: {user.email}</p>
      <p>역할: {user.role}</p>

      {/* 리뷰어인 경우 */}
      {user.role === 'user' && (
        <p>등급: {user.grade}</p>
      )}

      {/* 파트너인 경우 */}
      {user.role === 'partner' && (
        <p>사업자명: {user.business_name}</p>
      )}

      {/* 관리자인 경우 */}
      {(user.role === 'manager_ga' || user.role === 'manager_sa') && (
        <p>관리자 레벨: {user.admin_level}</p>
      )}
    </div>
  );
}
```

### 2. 로그아웃 처리

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function MyPage() {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout(); // LocalStorage 클리어 & 홈으로 리다이렉트
    }
  };

  return (
    <button onClick={handleLogout}>로그아웃</button>
  );
}
```

### 3. 보호된 페이지 만들기

로그인하지 않은 사용자가 접근할 수 없는 페이지를 만들 수 있습니다.

#### 방법 1: useAuth hook으로 직접 체크

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/user/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>로딩 중...</div>;
  if (!isAuthenticated) return null;

  return <div>보호된 페이지 내용</div>;
}
```

#### 방법 2: withAuth HOC 사용 (권장)

```tsx
'use client';

import { withAuth } from '@/components/auth/withAuth';

function ProtectedPage() {
  return <div>보호된 페이지 내용</div>;
}

// 모든 로그인된 사용자 허용
export default withAuth(ProtectedPage);
```

#### 방법 3: 특정 역할만 허용

```tsx
'use client';

import { withAuth, withPartnerAuth } from '@/components/auth/withAuth';

function PartnerOnlyPage() {
  return <div>파트너 전용 페이지</div>;
}

// 옵션 1: withAuth에 역할 지정
export default withAuth(PartnerOnlyPage, { allowedRoles: ['partner'] });

// 옵션 2: 전용 HOC 사용
export default withPartnerAuth(PartnerOnlyPage);
```

---

## 📝 실제 활용 예제

### 예제 1: 파트너가 캠페인 등록할 때 자동으로 사용자 정보 포함

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function CampaignCreatePage() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');

  const handleSubmit = async () => {
    // 캠페인 생성 시 자동으로 파트너 정보 포함
    const campaignData = {
      title,
      partner_id: user?.id,        // 로그인된 파트너 ID
      partner_name: user?.name,    // 파트너 이름
      business_name: user?.business_name, // 사업자명
      created_at: new Date().toISOString(),
    };

    // LocalStorage에 저장 (나중에 API로 대체)
    const existingCampaigns = JSON.parse(
      localStorage.getItem('my_campaigns') || '[]'
    );
    localStorage.setItem(
      'my_campaigns',
      JSON.stringify([...existingCampaigns, campaignData])
    );

    alert('캠페인이 등록되었습니다!');
  };

  return (
    <div>
      <h1>캠페인 등록</h1>
      <p>등록자: {user?.name} ({user?.business_name})</p>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="캠페인 제목"
      />
      <button onClick={handleSubmit}>등록</button>
    </div>
  );
}
```

### 예제 2: 리뷰어가 캠페인 신청할 때 자동으로 사용자 정보 포함

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function CampaignDetailPage({ campaignId }: { campaignId: string }) {
  const { user } = useAuth();

  const handleApply = () => {
    // 캠페인 신청 데이터
    const applicationData = {
      campaign_id: campaignId,
      user_id: user?.id,
      user_name: user?.name,
      user_email: user?.email,
      user_grade: user?.grade,
      channels: user?.channels, // 리뷰어의 채널 정보
      applied_at: new Date().toISOString(),
      status: 'pending',
    };

    // LocalStorage에 저장
    const existingApplications = JSON.parse(
      localStorage.getItem('my_applications') || '[]'
    );
    localStorage.setItem(
      'my_applications',
      JSON.stringify([...existingApplications, applicationData])
    );

    alert('캠페인 신청이 완료되었습니다!');
  };

  return (
    <div>
      <h1>캠페인 상세</h1>
      <p>신청자: {user?.name} ({user?.grade}등급)</p>
      <button onClick={handleApply}>신청하기</button>
    </div>
  );
}
```

### 예제 3: 내가 등록한 캠페인 목록 조회 (파트너)

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { withPartnerAuth } from '@/components/auth/withAuth';

function MyCampaignsPage() {
  const { user } = useAuth();
  const [myCampaigns, setMyCampaigns] = useState([]);

  useEffect(() => {
    // LocalStorage에서 내가 등록한 캠페인만 필터링
    const allCampaigns = JSON.parse(
      localStorage.getItem('my_campaigns') || '[]'
    );

    const filtered = allCampaigns.filter(
      (campaign: any) => campaign.partner_id === user?.id
    );

    setMyCampaigns(filtered);
  }, [user]);

  return (
    <div>
      <h1>내가 등록한 캠페인</h1>
      <p>총 {myCampaigns.length}개</p>
      {myCampaigns.map((campaign: any, index) => (
        <div key={index}>
          <h3>{campaign.title}</h3>
          <p>등록일: {new Date(campaign.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default withPartnerAuth(MyCampaignsPage);
```

### 예제 4: 관리자 페이지에서 모든 파트너/리뷰어 데이터 조회

```tsx
'use client';

import { useEffect, useState } from 'react';
import { withAdminAuth } from '@/components/auth/withAuth';

function AdminDashboard() {
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [allApplications, setAllApplications] = useState([]);

  useEffect(() => {
    // 관리자는 모든 데이터 조회 가능
    const campaigns = JSON.parse(
      localStorage.getItem('my_campaigns') || '[]'
    );
    const applications = JSON.parse(
      localStorage.getItem('my_applications') || '[]'
    );

    setAllCampaigns(campaigns);
    setAllApplications(applications);
  }, []);

  return (
    <div>
      <h1>관리자 대시보드</h1>
      <div>
        <h2>전체 캠페인: {allCampaigns.length}개</h2>
        <h2>전체 신청: {allApplications.length}개</h2>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminDashboard);
```

---

## 🔑 테스트 계정 정보

Mock 데이터에서 사용 가능한 테스트 계정:

### 파트너 계정
- **이메일**: partner1@example.com
- **비밀번호**: password123
- **역할**: partner

### 리뷰어 계정 (소셜 로그인)
- 네이버/카카오 로그인 버튼 클릭 시 자동 로그인

### 관리자 계정 (GA)
- **이메일**: ga_admin1@reviewx.com
- **비밀번호**: admin123
- **역할**: manager_ga

### 최고 관리자 (SA)
- **이메일**: sa_admin@reviewx.com
- **비밀번호**: superadmin123
- **역할**: manager_sa

---

## 📊 AuthUser 타입 정보

```typescript
interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'partner' | 'manager_ga' | 'manager_sa';

  // 리뷰어 전용
  grade?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  channels?: Array<{
    platform: string;
    url: string;
    followers: number;
  }>;

  // 파트너 전용
  business_name?: string;
  business_number?: string;
  approval_status?: 'pending' | 'approved' | 'rejected';

  // 관리자 전용
  admin_level?: 'GA' | 'SA';
  permissions?: string[];
}
```

---

## 🎯 다음 단계: 실제 API 연동

현재는 LocalStorage로 작동하지만, 나중에 실제 백엔드 API로 쉽게 교체할 수 있습니다.

### 변경이 필요한 파일

1. **`src/lib/auth.ts`**
   - `authenticateUser` 함수: Mock 데이터 대신 실제 API 호출
   - API 엔드포인트: `POST /api/auth/login`

2. **`src/contexts/AuthContext.tsx`**
   - 필요시 토큰 갱신 로직 추가
   - API 에러 처리 강화

3. **캠페인 등록/신청 페이지**
   - LocalStorage 대신 API POST 요청
   - API 엔드포인트: `POST /api/campaigns`, `POST /api/applications`

---

## ✅ 현재 작동하는 기능

- ✅ 파트너/관리자 로그인 (이메일/비밀번호)
- ✅ 리뷰어 소셜 로그인 (Mock)
- ✅ 로그인 상태 전역 관리
- ✅ 새로고침 시 로그인 유지 (LocalStorage)
- ✅ 로그아웃
- ✅ 보호된 라우트 (withAuth HOC)
- ✅ 역할별 접근 제어
- ✅ 사용자 정보 업데이트

---

## 🐛 문제 해결

### "useAuth must be used within an AuthProvider" 에러
→ `app/layout.tsx`에 AuthProvider가 추가되어 있는지 확인

### 로그인 후 페이지가 리다이렉트되지 않음
→ `lib/auth.ts`의 `getHomePathForRole` 함수 확인

### 새로고침하면 로그인이 풀림
→ LocalStorage에 데이터가 저장되는지 브라우저 개발자 도구에서 확인

---

## 📞 문의

인증 시스템 관련 질문이 있으면 언제든지 물어보세요!
