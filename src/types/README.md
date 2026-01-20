# 📦 Types 폴더 사용 가이드

## 📂 폴더 구조

```
types/
├── api/              # API Response 타입
│   ├── auth.ts      # 인증 관련 API
│   ├── campaign.ts  # 캠페인 관련 API
│   ├── point.ts     # 포인트 관련 API
│   ├── user.ts      # 사용자 관련 API
│   ├── partner.ts   # 파트너 관련 API
│   └── index.ts     # 통합 export
│
├── common/           # 공통 타입
│   ├── form.ts      # Form 관련 타입
│   ├── table.ts     # Table 관련 타입
│   ├── modal.ts     # Modal 관련 타입
│   ├── status.ts    # Status/Tag 관련 타입
│   └── index.ts     # 통합 export
│
├── domain/           # 도메인 타입
│   ├── user.ts      # 사용자(리뷰어) 도메인
│   ├── partner.ts   # 파트너 도메인
│   └── index.ts     # 통합 export
│
├── toast-ui-editor.d.ts  # 외부 라이브러리 타입 정의
├── index.ts         # 최상위 통합 export
└── README.md        # 이 파일

```

---

## 🎯 각 폴더의 역할

### 1. `api/` - API Response Types

**목적**: 백엔드 API 응답 구조를 정의합니다.

**언제 사용하나요?**
- API 호출 함수를 만들 때
- API 응답을 처리하는 hooks를 만들 때
- 서버에서 받은 데이터의 타입을 지정할 때

**예시**:
```typescript
import { LoginResponse, CampaignListResponse } from '@/types/api';

async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return response.json();
}
```

### 2. `common/` - Common Types

**목적**: 여러 곳에서 재사용되는 UI 컴포넌트 타입을 정의합니다.

**언제 사용하나요?**
- Form 컴포넌트를 만들 때
- Table 컴포넌트를 만들 때
- Modal을 만들 때
- 상태 태그(Status Tag)를 만들 때

**예시**:
```typescript
import { FormState, TableColumn, ModalProps } from '@/types/common';

// Form 컴포넌트
function MyForm() {
  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    errors: [],
    values: {},
    touched: {},
    isDirty: false
  });
}

// Table 컴포넌트
const columns: TableColumn[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: '이름' }
];
```

### 3. `domain/` - Domain Types

**목적**: 비즈니스 로직과 관련된 도메인 타입을 정의합니다.

**언제 사용하나요?**
- 캠페인 데이터를 다룰 때
- 사용자(리뷰어) 정보를 다룰 때
- 파트너 정보를 다룰 때
- Mock 데이터를 만들 때

**예시**:
```typescript
import { CampaignType, PlatformType, ReviewerInfo } from '@/types/domain';

// 캠페인 타입 지정
const campaignType: CampaignType = 'delivery';
const platform: PlatformType = 'naver_blog';

// Mock 데이터
const mockReviewer: ReviewerInfo = {
  id: '1',
  name: '홍길동',
  email: 'hong@example.com',
  // ...
};
```

---

## 💡 Import 방법

### 방법 1: 개별 카테고리에서 가져오기 ⭐ 권장

가장 명확하고 타입 충돌이 적은 방법입니다.

```typescript
// API 타입
import { LoginResponse, CampaignListResponse } from '@/types/api';

// 공통 타입
import { FormState, TableColumn } from '@/types/common';

// 도메인 타입
import { CampaignType, ReviewerInfo } from '@/types/domain';
```

### 방법 2: 최상위에서 가져오기

여러 카테고리의 타입을 한 번에 import할 때 편리합니다.

```typescript
import {
  LoginResponse,        // from api/
  FormState,           // from common/
  CampaignType         // from domain/
} from '@/types';
```

---

## 📚 주요 타입 치트시트

### API Types (`@/types/api`)

#### Auth (인증)
```typescript
LoginResponse          // 로그인 응답
SignupResponse         // 회원가입 응답
VerifyPhoneResponse    // 휴대폰 인증 응답
```

#### Campaign (캠페인)
```typescript
CampaignListResponse      // 캠페인 목록
CampaignDetailResponse    // 캠페인 상세
ApplyCampaignResponse     // 캠페인 신청
```

#### Point (포인트)
```typescript
PointBalanceResponse      // 포인트 잔액
PointHistoryResponse      // 포인트 내역
WithdrawalRequestResponse // 출금 신청
```

### Common Types (`@/types/common`)

#### Form
```typescript
FormState<T>          // 폼 전체 상태
FormFieldError        // 폼 에러
InputFieldProps       // Input 필드 Props
```

#### Table
```typescript
TableColumn<T>        // 테이블 컬럼 정의
PaginationInfo        // 페이지네이션 정보
SortOption           // 정렬 옵션
```

#### Modal
```typescript
ConfirmModalProps     // 확인/취소 모달
AlertModalProps       // 알림 모달
FilterModalProps      // 필터 모달
```

#### Status
```typescript
StatusTagProps        // 상태 태그
CampaignStatusType    // 캠페인 상태
ApplicationStatusType // 신청 상태
```

### Domain Types (`@/types/domain`)

#### Campaign (캠페인)
```typescript
CampaignType          // 캠페인 타입 ('delivery' | 'visit' | ...)
PlatformType          // 플랫폼 타입 ('naver_blog' | 'instagram' | ...)
CampaignFormData      // 캠페인 생성 폼 데이터
```

#### User (사용자)
```typescript
ReviewerInfo          // 리뷰어 정보
UserPointInfo         // 사용자 포인트 정보
MyCampaignData        // 내 캠페인 데이터
```

#### Partner (파트너)
```typescript
PartnerInfo           // 파트너 정보
BusinessInfo          // 사업자 정보
PartnerCampaignData   // 파트너 캠페인 데이터
```

---

## 🔍 실전 예제

### 예제 1: 로그인 페이지

```typescript
import { useState } from 'react';
import { LoginResponse } from '@/types/api';
import { FormState, FormFieldError } from '@/types/common';

function LoginPage() {
  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    errors: [],
    values: { email: '', password: '' },
    touched: {},
    isDirty: false
  });

  const handleSubmit = async () => {
    setFormState(prev => ({ ...prev, status: 'submitting' }));

    try {
      const response: LoginResponse = await loginAPI(
        formState.values.email,
        formState.values.password
      );

      if (response.success) {
        // 로그인 성공
        setFormState(prev => ({ ...prev, status: 'success' }));
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        status: 'error',
        errors: [{ field: 'general', message: '로그인 실패' }]
      }));
    }
  };

  return (/* ... */);
}
```

### 예제 2: 캠페인 목록 테이블

```typescript
import { CampaignListResponse } from '@/types/api';
import { TableColumn, PaginationInfo } from '@/types/common';
import { CampaignType } from '@/types/domain';

function CampaignListPage() {
  const [campaigns, setCampaigns] = useState<CampaignListResponse['data']>();

  const columns: TableColumn[] = [
    { key: 'title', label: '캠페인 제목', sortable: true },
    { key: 'campaign_type', label: '유형', sortable: true },
    { key: 'points', label: '포인트', align: 'right' },
    {
      key: 'status',
      label: '상태',
      render: (value, row) => <StatusTag status={value} />
    }
  ];

  return (
    <Table
      columns={columns}
      data={campaigns?.campaigns || []}
      pagination={campaigns}
    />
  );
}
```

### 예제 3: 모달 사용

```typescript
import { ConfirmModalProps } from '@/types/common';
import { DeleteCampaignResponse } from '@/types/api';

function CampaignCard({ campaignId }: { campaignId: string }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async () => {
    const response: DeleteCampaignResponse = await deleteCampaign(campaignId);
    if (response.success) {
      alert('캠페인이 삭제되었습니다');
    }
  };

  const modalProps: ConfirmModalProps = {
    isOpen: modalOpen,
    onClose: () => setModalOpen(false),
    title: '캠페인 삭제',
    message: '정말 삭제하시겠습니까?',
    confirmLabel: '삭제',
    cancelLabel: '취소',
    onConfirm: handleDelete,
    confirmVariant: 'danger'
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)}>삭제</button>
      <ConfirmModal {...modalProps} />
    </>
  );
}
```

---

## ❓ FAQ

### Q1. API 타입과 Domain 타입의 차이는?

**API 타입**:
- 서버 응답 그대로의 구조
- `success`, `data`, `message` 같은 래퍼 포함
- 예: `LoginResponse`, `CampaignListResponse`

**Domain 타입**:
- 비즈니스 로직에서 사용하는 데이터 구조
- 클라이언트 측에서 가공된 데이터
- 예: `CampaignType`, `ReviewerInfo`

### Q2. 타입이 너무 많은데 어떻게 찾나요?

1. **VSCode의 자동완성 활용**: `import { }` 안에서 Ctrl+Space
2. **타입 검색**: Ctrl+P → `#CampaignType` (# 붙이면 심볼 검색)
3. **이 README의 치트시트 참고**

### Q3. 새로운 타입을 추가하려면?

1. **API 응답 타입**: `types/api/` 해당 파일에 추가
2. **공통 UI 타입**: `types/common/` 해당 파일에 추가
3. **도메인 타입**: `types/domain/` 해당 파일에 추가

예시:
```typescript
// types/api/campaign.ts
export interface NewCampaignResponse extends ApiResponse {
  data: {
    // ... 새로운 필드
  };
}
```

### Q4. 타입 충돌이 발생하면?

**개별 카테고리에서 import하세요**:

```typescript
// ❌ 충돌 가능
import { CampaignType } from '@/types';

// ✅ 명확함
import { CampaignType } from '@/types/domain';
import { CampaignDetailResponse } from '@/types/api';
```

또는 **별칭 사용**:
```typescript
import { CampaignType as DomainCampaignType } from '@/types/domain';
import { CampaignType as ApiCampaignType } from '@/types/api';
```

---

## 📝 마이그레이션 전/후

### Before (기존)
```typescript
import { CampaignType } from '@/types/user/user';
import { PartnerInfo } from '@/types/partner/partner';
```

### After (현재) ✅
```typescript
import { CampaignType } from '@/types/domain/user';
import { PartnerInfo } from '@/types/domain/partner';

// 또는 더 간단하게
import { CampaignType, PartnerInfo } from '@/types/domain';
```

---

## 🚀 타입 활용 팁

### 1. Utility Types 활용

```typescript
import { CampaignDetail } from '@/types/api';

// 일부 필드만 필수로
type CampaignUpdate = Partial<CampaignDetail>;

// 특정 필드만 선택
type CampaignPreview = Pick<CampaignDetail, 'id' | 'title' | 'thumbnail_url'>;

// 특정 필드 제외
type CampaignWithoutId = Omit<CampaignDetail, 'id'>;
```

### 2. 제네릭 활용

```typescript
import { ApiResponse } from '@/types/api';
import { TableColumn } from '@/types/common';

// 모든 API 응답에 적용 가능
function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // ...
}

// 타입 안전한 테이블
function Table<T>({ columns, data }: {
  columns: TableColumn<T>[];
  data: T[];
}) {
  // ...
}
```

### 3. Type Guard 활용

```typescript
import { CampaignStatusType } from '@/types/common';

function isCampaignActive(status: CampaignStatusType): boolean {
  return status === 'recruiting' || status === 'in_progress';
}
```

---

## 📞 도움이 필요하신가요?

타입 관련 질문이나 추가가 필요한 타입이 있다면:

1. 이 README를 먼저 확인하세요
2. VSCode의 타입 정의로 이동 (F12)을 활용하세요
3. 타입 파일의 주석을 참고하세요 (모든 타입에 설명이 있습니다)

---

**Happy Typing! 🎉**
