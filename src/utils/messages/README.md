# 📋 메시지 코드 관리 가이드

## 개요

이 폴더는 기능명세서에 정의된 모든 에러 메시지 코드를 관리합니다. 백엔드 개발자와 협업 시 이 코드를 공유하여 일관된 에러 처리를 할 수 있습니다.

## 파일 구조

```
src/utils/messages/
├── errorCodes.ts        # 에러 코드 상수 및 메시지 매핑 (기존 호환성)
├── messageCodes.ts      # 전체 메시지 코드 통합 관리 (신규)
├── messageHelper.ts     # 메시지 헬퍼 유틸리티 (UI 컴포넌트용)
├── apiErrorHandler.ts   # API 에러 처리 유틸리티
├── index.ts            # 통합 export
└── README.md           # 이 문서
```

## 사용 방법

### 1. 모달에서 메시지 사용 (권장)

```typescript
import { getModalProps, parseMessageWithHTML } from "@/utils/messages";

function MyModal({ code, replaceValues }: { code: string; replaceValues?: Record<string, string> }) {
  const modalProps = getModalProps(code, replaceValues);

  return (
    <div className="modal">
      <p>{parseMessageWithHTML(modalProps.message)}</p>
      <div className="buttons">
        {modalProps.buttons.map((button, index) => (
          <button key={index}>{button}</button>
        ))}
      </div>
    </div>
  );
}

// 사용 예시
<MyModal code="A_M2" /> // 캠페인 등록 확인 모달
<MyModal code="A_R4" replaceValues={{ 남은기간: "3" }} /> // 변수 치환
```

### 2. 토스트 메시지 사용

```typescript
import { getToastProps } from "@/utils/messages";

function showToast(code: string) {
  const toastProps = getToastProps(code);
  // 토스트 컴포넌트에 전달
  toast.show(toastProps.message, toastProps.type);
}

// 사용 예시
showToast("T_M1"); // "복사되었습니다."
```

### 3. 알림 메시지 사용

```typescript
import { getNotificationProps } from "@/utils/messages";

function NotificationItem({ code, replaceValues }: { code: string; replaceValues?: Record<string, string> }) {
  const notificationProps = getNotificationProps(code, replaceValues);

  return (
    <div className={`notification ${getMessageTypeClass(notificationProps.type)}`}>
      <span className="label">{notificationProps.label}</span>
      <p>{notificationProps.message}</p>
    </div>
  );
}

// 사용 예시
<NotificationItem code="A_R1" /> // 캠페인 선정 알림
<NotificationItem code="A_R9" replaceValues={{ 포인트: "1000" }} /> // 포인트 적립 알림
```

### 4. 에러 코드 상수 사용 (기존 방식)

```typescript
import { INPUT_ERROR_CODES } from "@/utils/messages";

// API 호출 시 에러 코드 확인
if (response.error_code === INPUT_ERROR_CODES.PHONE_DUPLICATE) {
  // 휴대폰 중복 에러 처리
}
```

### 2. API 에러 처리

```typescript
import { handleApiError, isApiError } from "@/utils/messages";

async function signup(formData: SignupFormData) {
  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const data: ApiResponse = await response.json();

    // 에러 응답 처리
    if (isApiError(data)) {
      const error = handleApiError(data);

      // 사용자에게 메시지 표시
      setErrorMessage(error.message);

      // 개발자 도구에서 코드 확인 가능
      console.error("에러 코드:", error.code);

      return;
    }

    // 성공 처리
    console.log("회원가입 성공:", data.data);
  } catch (error) {
    // 네트워크 에러 등 기타 에러
    console.error("네트워크 에러:", error);
  }
}
```

### 3. 변수 치환이 필요한 메시지

일부 메시지는 변수 치환이 필요합니다 (예: `{SNS이름}`).

```typescript
import { handleApiError, CHANNEL_ERROR_CODES } from "@/utils/messages";

// 백엔드에서 C_E4 코드와 함께 SNS 이름을 전달하는 경우
const error = handleApiError(
  {
    success: false,
    error_code: CHANNEL_ERROR_CODES.CHANNEL_LINK_INPUT_ERROR,
  },
  { SNS이름: "인스타그램" } // 변수 치환
);

// 결과: "인스타그램 아이디만 입력해 주세요."
```

### 4. 폼 유효성 검증에서 사용 (기존 방식)

```typescript
import { INPUT_ERROR_CODES, getErrorMessage } from "@/utils/messages";

function validatePhone(phone: string): string | null {
  // API 호출하여 중복 확인
  const isDuplicate = await checkPhoneDuplicate(phone);

  if (isDuplicate) {
    // 에러 코드를 반환하여 일관된 처리
    return getErrorMessage(INPUT_ERROR_CODES.PHONE_DUPLICATE);
  }

  return null;
}
```

### 5. 폼 유효성 검증에서 사용 (공통 에러 컴포넌트 + 에러 코드)

`InputErrorMessage` 컴포넌트와 에러 코드를 함께 사용하는 패턴입니다.

```typescript
import type { InputErrorCode } from "@/utils/messages";
import InputErrorMessage from "@/components/common/form/InputErrorMessage";

// 1) 에러 코드 state
const [error_codes, set_error_codes] = useState<
  Record<string, InputErrorCode | undefined>
>({});

// 2) 검증 로직에서 에러 코드 세팅
const validate_password_fields = (data: { password: string; password_confirm: string }) => {
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

// 3) input 아래에서 공통 컴포넌트 사용
<div className={styles.form_field}>
  <label htmlFor="password" className={styles.form_label}>
    비밀번호
  </label>
  <input
    id="password"
    name="password"
    value={form_data.password}
    onChange={handle_input_change}
    className={styles.form_input}
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
    id="password_confirm"
    name="password_confirm"
    value={form_data.password_confirm}
    onChange={handle_input_change}
    className={styles.form_input}
  />
  <InputErrorMessage
    code={error_codes.password_confirm}
    show={form_data.password_confirm.trim().length > 0}
  />
</div>
```

## 백엔드 개발자를 위한 API 응답 형식

백엔드에서 에러 응답을 반환할 때는 다음 형식을 사용해주세요:

```json
{
  "success": false,
  "error_code": "I_E1",
  "error_message": "이미 가입된 휴대폰 번호입니다.",
  "data": {}
}
```

### 필수 필드

- `success`: 항상 `false`
- `error_code`: 기능명세서에 정의된 코드 (예: `I_E1`, `C_E2`)

### 선택 필드

- `error_message`: 백엔드에서 직접 메시지를 제공할 수도 있지만, 프론트엔드에서 코드로부터 자동 생성 가능
- `data`: 추가 데이터가 필요한 경우

## 에러 코드 목록

### 입력 오류 (I_E)

| 코드  | 설명                   | 메시지                                                                |
| ----- | ---------------------- | --------------------------------------------------------------------- |
| I_E1  | 휴대폰 중복            | 이미 가입된 휴대폰 번호입니다.                                        |
| I_E2  | 닉네임 중복            | 이미 사용 중인 닉네임입니다.                                          |
| I_E3  | 비밀번호 형식 오류     | 8~16자 영문, 숫자, 특수문자(!@#$%^&\*()-\_=+) 조합으로 입력해 주세요. |
| I_E4  | 비밀번호 확인 불일치   | 비밀번호가 일치하지 않습니다.                                         |
| I_E5  | 인증번호 불일치        | 인증번호가 일치하지 않습니다.                                         |
| I_E6  | 인증번호 안내          | 인증번호를 받지 못 하셨나요?                                          |
| I_E7  | 아이디/비밀번호 불일치 | 아이디 또는 비밀번호가 일치하지 않습니다.                             |
| I_E8  | 비밀번호 재설정 오류   | 기존 비밀번호는 사용할 수 없습니다.                                   |
| I_E9  | 주민등록번호 오류      | 주민등록번호를 정확히 입력해 주세요.                                  |
| I_E10 | 인증번호 시간 초과     | 인증번호 입력 시간을 초과했습니다.                                    |
| I_E11 | 정지/탈퇴된 계정       | 정지되었거나 탈퇴된 계정입니다.                                       |
| I_E12 | 계정 정보 불일치       | 입력하신 정보와 일치하는 계정을 찾을 수 없습니다.                     |
| I_E13 | 아이디 중복            | 이미 사용 중인 아이디입니다.                                          |
| I_E14 | 인증번호 5회 초과      | 인증번호 요청 횟수를 모두 사용했습니다. 24시간 후 다시 시도해 주세요. |
| I_E15 | 카테고리 중복          | 이미 사용 중인 카테고리명입니다.                                      |

### 채널 연동 오류 (C_E)

| 코드 | 설명                  | 메시지                                                      |
| ---- | --------------------- | ----------------------------------------------------------- |
| C_E1 | 채널 확인 불가        | 채널을 찾을 수 없습니다.                                    |
| C_E2 | 중복 채널             | 이미 등록된 채널입니다.                                     |
| C_E3 | 검증 실패             | 채널 정보를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요. |
| C_E4 | 링크 입력 오류        | {SNS이름} 아이디만 입력해 주세요.                           |
| C_E5 | 유튜브 링크 입력 오류 | {SNS이름} 핸들(아이디)만 입력해 주세요.                     |

### 출금 신청 오류 (W_E)

| 코드 | 설명             | 메시지                                            |
| ---- | ---------------- | ------------------------------------------------- |
| W_E1 | 출금 최소 금액   | 출금은 최소 10,000원부터 신청할 수 있습니다.      |
| W_E2 | 출금 최대 금액   | 출금은 최대 500,000원까지 신청할 수 있습니다.     |
| W_E3 | 보유 포인트 부족 | 출금은 보유 포인트 이내에서만 신청할 수 있습니다. |

### 포인트 오류 (P_E)

| 코드 | 설명             | 메시지                                                           |
| ---- | ---------------- | ---------------------------------------------------------------- |
| P_E3 | 보유 포인트 부족 | 보유 포인트가 부족합니다. 포인트를 충전한 후 다시 시도해 주세요. |

### 캠페인 관련 (A_R)

| 코드 | 설명        | 메시지                                  |
| ---- | ----------- | --------------------------------------- |
| A_R1 | 캠페인 선정 | 축하드립니다! 캠페인에 선정되셨습니다.  |
| A_R2 | 캠페인 수정 | 참여 중인 캠페인 정보가 수정되었습니다. |

## 주의사항

1. **에러 코드는 대소문자 구분**: `I_E1`과 `i_e1`은 다릅니다.
2. **변수 치환**: `{SNS이름}` 같은 변수가 있는 메시지는 `handleApiError`의 두 번째 인자로 치환 값을 전달해야 합니다.
3. **새로운 에러 코드 추가**: 기능명세서에 새로운 코드가 추가되면 `errorCodes.ts` 파일을 업데이트해야 합니다.

## 메시지 코드 전체 목록

### 입력 오류 (I_E) - 15개

- `I_E1` ~ `I_E15`: 회원가입, 로그인, 비밀번호 재설정 등 입력 관련 에러

### 채널 연동 오류 (C_E) - 5개

- `C_E1` ~ `C_E5`: SNS 채널 연동 관련 에러

### 출금 신청 오류 (W_E) - 3개

- `W_E1` ~ `W_E3`: 포인트 출금 관련 에러

### 포인트 오류 (P_E) - 1개

- `P_E3`: 포인트 부족 에러

### 리뷰어 알림 (A_R) - 17개

- `A_R1` ~ `A_R17`: 리뷰어에게 보내는 캠페인/포인트 관련 알림

### 파트너 알림 (A_P) - 7개

- `A_P1` ~ `A_P7`: 파트너에게 보내는 캠페인 관련 알림

### 관리자 알림 (A_A) - 6개

- `A_A1` ~ `A_A6`: 관리자에게 보내는 시스템 알림

### 토스트 메시지 (T_M) - 3개

- `T_M1` ~ `T_M3`: 복사, 인증번호 요청, 저장 완료 등

### 액션 모달 (A_M) - 13개

- `A_M1` ~ `A_M13`: 사용자 액션 확인 모달 (회원가입, 캠페인 등록, 삭제 등)

### 오류/예외 모달 (E_M) - 20개

- `E_M1` ~ `E_M20`: 권한 없음, 로그인 필요, 서버 오류 등

### 완료 안내 모달 (C_M) - 14개

- `C_M1` ~ `C_M14`: 저장 완료, 출금 신청 완료, 결제 완료 등

### 차단/조건 충족 모달 (B_M) - 10개

- `B_M1` ~ `B_M10`: 출금 주기 제한, 계좌 정보 미등록, 탈퇴 불가 등

**총 114개 메시지 코드**

## 변수 치환 가이드

일부 메시지는 변수 치환이 필요합니다:

```typescript
// 변수가 포함된 메시지
const message = getMessage("A_R4", { 남은기간: "3" });
// "콘텐츠 등록 기간이 3일 남았습니다. 콘텐츠를 등록해 주세요."

const message = getMessage("A_R9", { 포인트: "1000" });
// "캠페인이 완료되어 1000 P가 적립되었습니다."

const message = getMessage("C_E4", { SNS이름: "인스타그램" });
// "인스타그램 아이디만 입력해 주세요."
```

### 주요 변수 목록

- `{남은기간}`: 남은 일수
- `{포인트}`: 포인트 금액
- `{정지기간}`: 정지 일수
- `{개수}`: 건수
- `{SNS이름}`: SNS 플랫폼 이름
- `{경과일}`: 경과 일수
- `{보유포인트}`: 보유 포인트
- `{가입된 아이디(이메일)}`: 가입된 이메일
- `{가입일}`: 가입 날짜

## 백엔드 개발자 협업 체크리스트

- [ ] API 에러 응답에 `error_code` 필드 포함
- [ ] 에러 코드는 기능명세서의 코드와 일치
- [ ] 변수 치환이 필요한 경우 추가 데이터 제공 (예: `{SNS이름}`, `{남은기간}`)
- [ ] 성공/실패 구분을 위해 `success` 필드 사용
- [ ] 알림 메시지의 경우 `notification_code` 필드 사용 가능
