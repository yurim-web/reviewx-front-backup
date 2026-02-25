/* ========================================
   📝 Form 관련 공통 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 폼 입력, 유효성 검증, 에러 메시지 등 폼 관련 공통 타입 정의
 * - 모든 폼 컴포넌트에서 재사용 가능한 타입 제공
 *
 * 📌 사용 위치:
 * - 회원가입/로그인 폼
 * - 캠페인 생성/수정 폼
 * - 프로필 수정 폼
 */

/**
 * 폼 필드 에러
 */
export interface FormFieldError {
  field: string;
  message: string;
}

/**
 * 폼 상태
 */
export type FormStatus = "idle" | "validating" | "submitting" | "success" | "error";

/**
 * 폼 전체 상태
 */
export interface FormState<T = Record<string, unknown>> {
  status: FormStatus;
  errors: FormFieldError[];
  values: T;
  touched: Record<keyof T, boolean>;
  isDirty: boolean;
}

/**
 * 폼 제출 결과
 */
export interface FormSubmitResult {
  success: boolean;
  message?: string;
  errors?: FormFieldError[];
  data?: unknown;
}

/**
 * 입력 필드 공통 Props
 */
export interface InputFieldProps {
  name: string;
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

/**
 * 체크박스 필드 Props
 */
export interface CheckboxFieldProps {
  name: string;
  label: string;
  checked: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * 셀렉트 필드 옵션
 */
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

/**
 * 셀렉트 필드 Props
 */
export interface SelectFieldProps {
  name: string;
  label: string;
  value: string | number;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (value: string | number) => void;
}

/**
 * 파일 업로드 필드 Props
 */
export interface FileUploadFieldProps {
  name: string;
  label: string;
  accept?: string;
  maxSize?: number; // bytes
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (file: File | null) => void;
}

/**
 * 날짜 선택 필드 Props
 */
export interface DatePickerFieldProps {
  name: string;
  label: string;
  value: Date | null;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  required?: boolean;
  onChange: (date: Date | null) => void;
}

/**
 * 유효성 검증 규칙
 */
export interface ValidationRule {
  type: "required" | "email" | "phone" | "password" | "min" | "max" | "pattern" | "custom";
  message: string;
  value?: string | number | RegExp; // min, max, pattern 등에 사용
  validator?: (value: unknown) => boolean; // custom 검증 함수
}

/**
 * 필드 설정
 */
export interface FieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "tel"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "file"
    | "date";
  defaultValue?: string | number | boolean;
  validationRules?: ValidationRule[];
  placeholder?: string;
  options?: SelectOption[]; // select일 때
}

/**
 * 폼 설정
 */
export interface FormConfig {
  fields: FieldConfig[];
  onSubmit: (values: Record<string, unknown>) => Promise<FormSubmitResult>;
  initialValues?: Record<string, unknown>;
}
