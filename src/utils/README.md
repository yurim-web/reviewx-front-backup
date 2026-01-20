# 📚 Utils 폴더 사용 가이드

이 폴더는 프로젝트 전반에서 재사용 가능한 유틸리티 함수들을 체계적으로 관리합니다.

## 📁 폴더 구조

```
utils/
├── constants/      # 상수 (채널명, 메시지, 정규식 등)
├── formatting/     # 포맷팅 함수 (금액, 날짜, 전화번호 등)
├── validation/     # 유효성 검증 함수 (이메일, 비밀번호 등)
├── helpers/        # 기타 헬퍼 함수 (URL 생성, 배열/문자열 조작 등)
└── index.ts        # 통합 내보내기
```

---

## 🎯 사용 방법

### 1. constants (상수)

**언제 사용하나요?**
- 하드코딩된 값을 피하고 싶을 때
- 여러 곳에서 같은 값을 사용할 때
- 에러 메시지를 일관되게 관리하고 싶을 때

```ts
import {
  CHANNEL_NAMES,      // 채널 이름 상수
  ERROR_MESSAGES,     // 에러 메시지
  REGEX_PATTERNS,     // 정규식 패턴
  PASSWORD_CONSTRAINTS // 비밀번호 제약 조건
} from '@/utils/constants';

// 사용 예시
const minLength = PASSWORD_CONSTRAINTS.MIN_LENGTH; // 8
const errorMsg = ERROR_MESSAGES.INVALID_EMAIL; // "올바른 이메일 형식이 아닙니다."
```

---

### 2. formatting (포맷팅)

**언제 사용하나요?**
- 숫자에 쉼표를 추가하고 싶을 때
- 날짜를 특정 형식으로 보여주고 싶을 때
- 전화번호를 "010-XXXX-XXXX" 형식으로 만들고 싶을 때

```ts
import {
  formatCurrency,     // 금액 → "10,000원"
  formatDate,         // 날짜 → "2024-01-20"
  formatPhoneNumber,  // 전화번호 → "010-1234-5678"
  formatTimer         // 초 → "03:00"
} from '@/utils/formatting';

// 사용 예시
const price = formatCurrency(10000);           // "10,000원"
const date = formatDate(new Date());           // "2024-01-20"
const phone = formatPhoneNumber("01012345678"); // "010-1234-5678"
const timer = formatTimer(180);                // "03:00"
```

**주요 함수:**
- `formatCurrency(amount)` - 금액을 "원" 단위로 포맷팅
- `formatPoints(points)` - 포인트를 "P" 단위로 포맷팅
- `formatDate(date)` - "YYYY-MM-DD" 형식
- `formatDateKorean(date)` - "YYYY년 MM월 DD일" 형식
- `formatPhoneNumber(phone)` - "010-XXXX-XXXX" 형식
- `formatTimer(seconds)` - "MM:SS" 형식

---

### 3. validation (유효성 검증)

**언제 사용하나요?**
- 사용자 입력값이 올바른지 확인할 때
- 폼 제출 전에 검증이 필요할 때
- 실시간으로 입력값을 체크할 때

```ts
import {
  validateEmail,      // 이메일 검증
  validatePassword,   // 비밀번호 검증
  validatePhone,      // 휴대폰 검증
  validateAmount      // 금액 검증
} from '@/utils/validation';

// 사용 예시
const isValidEmail = validateEmail("test@example.com");     // true
const isValidPassword = validatePassword("Test123!");       // true
const isValidPhone = validatePhone("010-1234-5678");       // true

// 금액 검증 (더 상세한 검증)
const result = validateAmount(5000, {
  minAmount: 10000,
  maxAmount: 1000000,
  availablePoints: 50000
});
// { isValid: false, errorMessage: "최소 10,000원부터 입력할 수 있습니다." }
```

**주요 함수:**
- `validateEmail(email)` - 이메일 형식 검증
- `validatePassword(password)` - 비밀번호 형식 검증 (8~16자, 영문/숫자/특수문자)
- `validatePasswordMatch(pwd, confirmPwd)` - 비밀번호 일치 확인
- `validatePhone(phone)` - 휴대폰 번호 형식 검증
- `validateVerificationCode(code)` - 인증번호 검증 (6자리 숫자)
- `validateAmount(amount, options)` - 금액 검증

---

### 4. helpers (헬퍼 함수)

**언제 사용하나요?**
- URL을 동적으로 생성할 때
- 배열이나 문자열을 조작할 때
- 로컬 스토리지를 안전하게 사용할 때

#### 4-1. URL 생성

```ts
import {
  getChannelUrl,         // 채널 URL 생성
  getCampaignDetailPath  // 캠페인 상세 페이지 경로
} from '@/utils/helpers';

// 채널 URL 생성
const blogUrl = getChannelUrl("네이버블로그", "test123");
// → "https://blog.naver.com/test123"

const instaUrl = getChannelUrl("인스타그램", "test_user");
// → "https://www.instagram.com/test_user/"

// 캠페인 상세 페이지 경로
const path = getCampaignDetailPath("배송형", "1");
// → "/campaign/delivery/delivery_1"
```

#### 4-2. 문자열 조작

```ts
import { truncate, isEmpty, capitalize } from '@/utils/helpers';

truncate("Hello World", 5);      // "Hello..."
isEmpty("   ");                  // true
capitalize("hello");             // "Hello"
```

#### 4-3. 배열 조작

```ts
import { chunk, unique, groupBy } from '@/utils/helpers';

chunk([1,2,3,4,5], 2);          // [[1,2], [3,4], [5]]
unique([1,2,2,3,3,3]);          // [1,2,3]

const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' }
];
groupBy(users, 'role');
// { admin: [...], user: [...] }
```

#### 4-4. 로컬 스토리지

```ts
import { setItem, getItem, removeItem } from '@/utils/helpers';

// 저장
setItem('user', { name: 'John', age: 30 });

// 가져오기
const user = getItem('user', { name: '', age: 0 });

// 삭제
removeItem('user');
```

---

## 💡 사용 팁

### 1. 개별 import vs 통합 import

**권장: 개별 카테고리에서 가져오기**
```ts
import { ERROR_MESSAGES } from '@/utils/constants';
import { formatCurrency } from '@/utils/formatting';
```

**가능: 최상위에서 가져오기**
```ts
import { ERROR_MESSAGES, formatCurrency } from '@/utils';
```

### 2. 타입 활용

많은 함수들이 TypeScript 타입을 제공합니다:

```ts
import type { CampaignType, ChannelName } from '@/utils/constants';

const type: CampaignType = '배송형';
const channel: ChannelName = '네이버블로그';
```

### 3. 에러 메시지 일관성

에러 메시지는 `constants/messages.ts`에서 관리하므로, 직접 문자열을 쓰지 말고 상수를 사용하세요:

```ts
// ❌ 나쁜 예
setError('이메일을 입력해주세요.');

// ✅ 좋은 예
import { ERROR_MESSAGES } from '@/utils/constants';
setError(ERROR_MESSAGES.EMAIL_REQUIRED);
```

---

## 🔄 마이그레이션 가이드

기존 코드를 새로운 utils 구조로 옮기려면:

### 기존 코드
```ts
// 기존 validation.ts에서 가져오기
import { validateEmail } from '@/utils/signup/validation';
```

### 새로운 코드
```ts
// 새로운 구조에서 가져오기
import { validateEmail } from '@/utils/validation';
```

---

## 📝 파일 추가 가이드

새로운 유틸리티 함수를 추가하고 싶다면:

1. **적절한 카테고리 선택**
   - 상수인가? → `constants/`
   - 포맷팅인가? → `formatting/`
   - 검증인가? → `validation/`
   - 기타 헬퍼인가? → `helpers/`

2. **파일 생성 및 함수 작성**
   ```ts
   // utils/formatting/myFormat.ts
   export const myFormat = (value: string): string => {
     // 구현
   };
   ```

3. **index.ts에 추가**
   ```ts
   // utils/formatting/index.ts
   export * from './myFormat';
   ```

---

## ❓ 자주 묻는 질문

**Q: 기존 파일들은 어떻게 하나요?**
A: 기존 파일들(`utils/signup/validation.ts` 등)은 당분간 유지하고, 점진적으로 새로운 구조로 마이그레이션하세요.

**Q: 어디에 뭘 넣어야 할지 모르겠어요.**
A:
- 값이면 → constants
- 변환하는 거면 → formatting
- 검증하는 거면 → validation
- 나머지 → helpers

**Q: 너무 많은 파일이 있는데 합쳐도 되나요?**
A: 네! 관련된 함수들은 하나의 파일에 모아도 괜찮습니다. 단, 파일이 너무 커지면 (200줄 이상) 분리를 고려하세요.

---

## 🎓 처음 개발하시는 분을 위한 추가 설명

### "유틸리티 함수"가 뭔가요?
여러 곳에서 반복적으로 사용되는 작은 기능들을 모아둔 것입니다.
마치 "도구 상자"처럼, 필요할 때마다 꺼내 쓸 수 있어요.

### 왜 이렇게 나누나요?
- **찾기 쉬워요**: "날짜 포맷팅이 필요해!" → `formatting/date.ts`로 바로 이동
- **관리하기 쉬워요**: 비슷한 기능끼리 모여있어서 수정이 편해요
- **재사용하기 쉬워요**: 한 번 만들면 여러 곳에서 사용 가능

### 언제 사용하나요?
- 같은 코드를 2번 이상 복붙하고 있다면 → 유틸리티 함수로 만들기!
- 숫자나 날짜를 보기 좋게 표시하고 싶다면 → formatting 사용!
- 사용자 입력값을 체크하고 싶다면 → validation 사용!

---

**마지막 수정일**: 2024-01-20
