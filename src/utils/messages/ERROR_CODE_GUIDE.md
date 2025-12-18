### 폼에서 에러 코드 사용하는 방법 정리

이 문서는 `input` 유효성 검사 에러를 **에러 코드 + 공통 컴포넌트**로 처리하는 패턴을 정리한 것입니다.

---

### 1. 기본 개념

- **에러 코드**: `I_E3`, `I_E4` 처럼 `src/utils/messages/errorCodes.ts` 에 정의된 코드 값
- **에러 메시지 조회**: `getErrorMessage(code)`
- **공통 에러 메시지 스타일**: `src/styles/common/input_error_message.module.css`
- **공통 에러 메시지 컴포넌트**: `src/components/common/form/InputErrorMessage.tsx`

폼에서는 **에러 코드를 상태로 들고 있다가**, `InputErrorMessage` 에 `code` 로 넘겨 주면 됩니다.

---

### 2. 에러 코드 상태 세팅 패턴

```tsx
import type { InputErrorCode } from "@/utils/messages";

// 1) 에러 코드 state 준비 (필드별로 코드 저장)
const [error_codes, set_error_codes] = useState<
  Record<string, InputErrorCode | undefined>
>({});

// 2) 검증 함수 안에서 코드 세팅 예시
const validate_password_fields = (data: {
  password: string;
  password_confirm: string;
}) => {
  const trimmed_password = data.password.trim();
  const trimmed_password_confirm = data.password_confirm.trim();

  const has_password = trimmed_password.length > 0;
  const has_password_confirm = trimmed_password_confirm.length > 0;

  let password_error_code: InputErrorCode | undefined;
  let password_confirm_error_code: InputErrorCode | undefined;

  // I_E3: 비밀번호 형식 오류
  if (has_password && !is_valid_password(trimmed_password)) {
    password_error_code = "I_E3";
  }

  // I_E4: 비밀번호 확인 불일치 (비밀번호 확인 input 에만 사용)
  if (has_password || has_password_confirm) {
    if (!trimmed_password || !trimmed_password_confirm) {
      password_confirm_error_code = "I_E4";
    } else if (trimmed_password !== trimmed_password_confirm) {
      password_confirm_error_code = "I_E4";
    }
  }

  set_error_codes((prev) => ({
    ...prev,
    password: password_error_code,
    password_confirm: password_confirm_error_code,
  }));
};
```

> `"I_E3"`, `"I_E4"` 는 `InputErrorCode` 타입에 포함되어 있어서 타입 세이프하게 사용됩니다.

---

### 3. 공통 에러 메시지 컴포넌트 사용

공통 컴포넌트: `src/components/common/form/InputErrorMessage.tsx`

```tsx
"use client";

import styles from "@/styles/common/input_error_message.module.css";
import { getErrorMessage, type InputErrorCode } from "@/utils/messages";

interface InputErrorMessageProps {
  code?: InputErrorCode;
  show?: boolean; // 표시 여부 (기본값: true)
}

export default function InputErrorMessage({
  code,
  show = true,
}: InputErrorMessageProps) {
  if (!code || !show) return null;

  return (
    <div className={styles.input_error_message}>
      <span className={styles.input_error_text}>{getErrorMessage(code)}</span>
    </div>
  );
}
```

공통 스타일: `src/styles/common/input_error_message.module.css`

```css
.input_error_message {
  color: #ff2626;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: -0.28px;
}

.input_error_text {
  color: inherit;
}
```

---

### 4. 폼에서 실제 사용 예시 (`AdminForm.tsx` 발췌)

```tsx
import type { InputErrorCode } from "@/utils/messages";
import InputErrorMessage from "@/components/common/form/InputErrorMessage";

// 1) 에러 코드 state
const [error_codes, set_error_codes] = useState<
  Record<string, InputErrorCode | undefined>
>({});

// 2) input 아래에서 에러 메시지 표시
<div className={styles.form_field}>
  <label htmlFor="password" className={styles.form_label}>
    비밀번호
  </label>
  <input
    type="password"
    id="password"
    name="password"
    value={form_data.password}
    onChange={handle_input_change}
    className={styles.form_input}
    placeholder="변경 시 8~16자 영문, 숫자, 특수문자 조합 입력"
  />
  <InputErrorMessage
    code={error_codes.password}
    show={form_data.password.trim().length > 0}
  />
</div>

<div className={styles.form_field}>
  <label htmlFor="password_confirm" className={styles.form_label}>
    비밀번호 확인
  </label>
  <input
    type="password"
    id="password_confirm"
    name="password_confirm"
    value={form_data.password_confirm}
    onChange={handle_input_change}
    className={styles.form_input}
    placeholder="비밀번호 재입력"
  />
  <InputErrorMessage
    code={error_codes.password_confirm}
    show={form_data.password_confirm.trim().length > 0}
  />
</div>
```

이 패턴만 따라가면:

- **검증 로직**: 에러 코드(`"I_E3"`, `"I_E4"` 등)만 세팅
- **UI**: `InputErrorMessage` 하나로 공통 스타일 + `getErrorMessage` 사용

으로 정리되어, 다른 폼에서도 그대로 재사용할 수 있습니다.
