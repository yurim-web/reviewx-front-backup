/* ========================================
   🔧 API 에러 처리 유틸리티
   ======================================== */

/**
 * 모듈 목적
 *
 * - 백엔드 API 응답에서 받은 에러 코드를 처리
 * - 에러 코드를 메시지로 변환하여 사용자에게 표시
 * - 에러 로깅 및 추적
 *
 * 📍 사용 위치:
 * - API 호출 후 에러 처리
 * - 폼 제출 실패 시
 * - 모달/알림 표시
 */

import {
  getErrorMessage,
  isValidErrorCode,
  type ErrorCode,
} from "./errorCodes";

/**
 * ========================================
 * API 에러 응답 타입 정의
 * ========================================
 *
 * 백엔드에서 반환하는 에러 응답 형식
 * 백엔드 개발자와 협의하여 이 형식에 맞춰 통신
 */
export interface ApiErrorResponse {
  /** 성공 여부 */
  success: false;
  /** 에러 코드 (기능명세서의 코드) */
  error_code: string;
  /** 에러 메시지 (선택적, 없으면 코드로부터 생성) */
  error_message?: string;
  /** 추가 데이터 (선택적) */
  data?: Record<string, unknown>;
}

/**
 * ========================================
 * API 성공 응답 타입 정의
 * ========================================
 */
export interface ApiSuccessResponse<T = unknown> {
  /** 성공 여부 */
  success: true;
  /** 응답 데이터 */
  data: T;
  /** 성공 메시지 (선택적) */
  message?: string;
}

/**
 * ========================================
 * API 응답 타입 (성공 또는 실패)
 * ========================================
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * ========================================
 * API 에러 처리 결과
 * ========================================
 */
export interface ErrorHandleResult {
  /** 사용자에게 표시할 메시지 */
  message: string;
  /** 에러 코드 */
  code: string;
  /** 원본 에러 응답 */
  originalError: ApiErrorResponse;
}

/**
 * ========================================
 * API 에러 처리 함수
 * ========================================
 *
 * 백엔드에서 받은 에러 응답을 처리하여 사용자에게 표시할 메시지를 반환
 *
 * @param errorResponse - 백엔드에서 받은 에러 응답
 * @param replaceValues - 메시지 내 변수 치환 값 (예: {SNS이름: '인스타그램'})
 * @returns 에러 처리 결과
 *
 * @example
 * ```typescript
 * try {
 *   const response = await fetch('/api/signup', { ... });
 *   const data = await response.json();
 *
 *   if (!data.success) {
 *     const error = handleApiError(data);
 *     setErrorMessage(error.message);
 *     console.error('에러 코드:', error.code);
 *   }
 * } catch (error) {
 *   // 네트워크 에러 등 기타 에러 처리
 * }
 * ```
 */
export function handleApiError(
  errorResponse: ApiErrorResponse,
  replaceValues?: Record<string, string>
): ErrorHandleResult {
  const { error_code, error_message } = errorResponse;

  // 에러 코드가 유효한지 확인
  if (isValidErrorCode(error_code)) {
    // 유효한 코드면 메시지 매핑에서 가져오기
    const message = getErrorMessage(error_code, replaceValues);

    return {
      message,
      code: error_code,
      originalError: errorResponse,
    };
  }

  // 유효하지 않은 코드이거나 백엔드에서 메시지를 직접 제공한 경우
  const message = error_message || "알 수 없는 오류가 발생했습니다.";

  // 개발 환경에서는 에러 코드를 콘솔에 출력 (디버깅용)
  if (process.env.NODE_ENV === "development") {
    console.warn("알 수 없는 에러 코드:", error_code);
  }

  return {
    message,
    code: error_code,
    originalError: errorResponse,
  };
}

/**
 * ========================================
 * API 응답 검증 함수
 * ========================================
 *
 * API 응답이 성공인지 실패인지 확인
 *
 * @param response - API 응답
 * @returns 성공 여부
 */
export function isApiSuccess<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * ========================================
 * API 응답이 에러인지 확인
 * ========================================
 *
 * @param response - API 응답
 * @returns 에러 여부
 */
export function isApiError(
  response: ApiResponse
): response is ApiErrorResponse {
  return response.success === false;
}
