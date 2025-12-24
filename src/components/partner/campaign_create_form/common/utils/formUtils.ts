/* ========================================
   🛠️ 폼 유틸리티 함수들
   ======================================== */

/**
 * 폼 유틸리티 함수들
 *
 * 목적: 모든 캠페인 폼에서 공통으로 사용되는 유틸리티 함수들을 제공합니다.
 *
 * 주요 기능:
 * - 숫자 포맷팅 (쉼표 추가)
 * - 숫자 입력 검증
 * - 이미지 파일 검증
 * - 날짜 기본값 생성
 */

import { format, addDays } from "date-fns";

/**
 * 숫자에 쉼표 추가하는 포맷팅 함수
 *
 * 설명:
 * - 숫자 문자열에 천 단위 구분 쉼표를 추가합니다.
 * - undefined나 null이면 빈 문자열을 반환합니다.
 * - 숫자가 아니면 빈 문자열을 반환합니다.
 *
 * @param value - 포맷팅할 값 (문자열, 숫자, 또는 undefined)
 * @returns 쉼표가 추가된 숫자 문자열
 */
export function formatNumberWithComma(
  value: string | number | undefined
): string {
  // undefined나 null이면 빈 문자열 반환
  if (value === undefined || value === null) return "";

  // 문자열로 변환
  const stringValue = String(value);

  // 쉼표 제거 후 숫자만 추출
  const numericValue = stringValue.replace(/,/g, "");

  // 빈 문자열이면 그대로 반환
  if (numericValue === "") return "";

  // 숫자가 아니면 빈 문자열 반환
  if (isNaN(Number(numericValue))) return "";

  // 숫자에 쉼표 추가하여 반환
  return Number(numericValue).toLocaleString("ko-KR");
}

/**
 * 숫자 입력 핸들러 (숫자만 입력 가능)
 *
 * 설명:
 * - 숫자 키와 허용된 제어 키만 입력을 허용합니다.
 * - Ctrl/Cmd 키와 함께 사용되는 키(복사, 붙여넣기 등)는 허용합니다.
 *
 * @param e - 키보드 이벤트 객체
 */
export function handleNumericInput(
  e: React.KeyboardEvent<HTMLInputElement>
): void {
  // 허용할 키들
  const allowedKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ];

  // Ctrl, Cmd 키와 함께 사용되는 키 (복사, 붙여넣기 등)
  const isCtrlKey = e.ctrlKey || e.metaKey;
  const isAllowedKeyWithCtrl = ["a", "c", "v", "x"].includes(
    e.key.toLowerCase()
  );

  // 입력된 키가 숫자인지 확인
  const isNumeric = /^[0-9]$/.test(e.key);

  // 허용된 키가 아니면 입력 방지
  if (
    !isNumeric &&
    !allowedKeys.includes(e.key) &&
    !(isCtrlKey && isAllowedKeyWithCtrl)
  ) {
    e.preventDefault();
  }
}

/**
 * 숫자 입력 변경 핸들러 (쉼표 자동 추가)
 *
 * 설명:
 * - 입력된 값에서 쉼표를 제거한 후 저장합니다.
 * - 화면에는 쉼표가 포함된 값이 표시됩니다.
 * - 커서 위치를 유지합니다.
 *
 * @param e - 변경 이벤트 객체
 * @param onValueChange - 값 변경 시 호출되는 콜백 함수
 */
export function handleNumericChange(
  e: React.ChangeEvent<HTMLInputElement>,
  onValueChange: (value: string) => void
): void {
  const inputValue = e.target.value;
  const inputElement = e.target;

  // 기존 커서 위치 저장
  const cursorPosition = inputElement.selectionStart || 0;

  // 쉼표 개수 계산
  const beforeCursor = inputValue.substring(0, cursorPosition);
  const commasBeforeCursor = (beforeCursor.match(/,/g) || []).length;

  // 실제 값 저장 (쉼표 제거)
  const numericValue = inputValue.replace(/,/g, "");

  // 값 업데이트
  onValueChange(numericValue);

  // 다음 렌더링 후 커서 위치 복원
  setTimeout(() => {
    const newValue = formatNumberWithComma(numericValue);
    const newCommasBeforeCursor = (
      newValue.substring(0, cursorPosition).match(/,/g) || []
    ).length;
    const cursorOffset = newCommasBeforeCursor - commasBeforeCursor;
    const newCursorPosition = cursorPosition + cursorOffset;

    inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
  }, 0);
}

/**
 * 이미지 파일 확장자 검증
 *
 * 설명:
 * - JPG, PNG, GIF 확장자만 허용합니다.
 *
 * @param file - 검증할 파일 객체
 * @returns 확장자 검증 통과 여부
 */
function isValidImageExtension(file: File): boolean {
  // 파일 확장자 추출 (소문자로 변환)
  const fileName = file.name.toLowerCase();
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  
  // 확장자 검증
  return validExtensions.some((ext) => fileName.endsWith(ext));
}

/**
 * 이미지 파일 검증 함수
 *
 * 설명:
 * - 이미지 파일 타입인지 확인합니다.
 * - 파일 크기가 10MB 이하인지 확인합니다.
 * - 확장자가 JPG, PNG, GIF인지 확인합니다.
 *
 * @param file - 검증할 파일 객체
 * @returns 검증 통과 여부 및 에러 타입
 */
export function validateImageFile(file: File): {
  isValid: boolean;
  errorType?: "extension" | "size";
  errorMessage?: string;
} {
  // 확장자 검증 (JPG, PNG, GIF만 허용)
  if (!isValidImageExtension(file)) {
    return {
      isValid: false,
      errorType: "extension",
      errorMessage: "지정된 확장자(JPG, PNG, GIF)만<br>업로드할 수 있습니다.",
    };
  }

  // 파일 크기 검증 (10MB 제한)
  if (file.size > 10 * 1024 * 1024) {
    return {
      isValid: false,
      errorType: "size",
      errorMessage: "10mb 이하의 파일만 업로드할 수 있습니다.",
    };
  }

  return { isValid: true };
}

/**
 * 이미지 업로드 검증 함수 (모달용)
 *
 * 설명:
 * - 우선순위: 개수 > 용량 > 확장자
 * - 첫 번째 에러만 반환합니다.
 *
 * @param files - 검증할 파일 배열
 * @param currentCount - 현재 업로드된 이미지 개수
 * @param maxCount - 최대 허용 개수
 * @returns 검증 통과 여부 및 에러 정보
 */
export function validateImagesForUpload(
  files: File[],
  currentCount: number,
  maxCount: number
): {
  isValid: boolean;
  errorType?: "count" | "size" | "extension";
  errorMessage?: string;
} {
  // 1. 개수 검증 (최우선)
  const totalCount = currentCount + files.length;
  if (totalCount > maxCount) {
    return {
      isValid: false,
      errorType: "count",
      errorMessage: "이미지는 최대 7장까지 등록할 수 있습니다.",
    };
  }

  // 2. 용량 검증
  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      return {
        isValid: false,
        errorType: "size",
        errorMessage: "10mb 이하의 파일만 업로드할 수 있습니다.",
      };
    }
  }

  // 3. 확장자 검증
  for (const file of files) {
    if (!isValidImageExtension(file)) {
      return {
        isValid: false,
        errorType: "extension",
        errorMessage: "지정된 확장자(JPG, PNG, GIF)만<br>업로드할 수 있습니다.",
      };
    }
  }

  return { isValid: true };
}

/**
 * 날짜 기본값 생성 함수
 *
 * 설명:
 * - 모집 기간: 오늘부터 7일 후까지 (예: 2025-11-21 ~ 2025-11-28)
 * - 선정 날짜: 모집 기간 종료일 다음 날 (예: 2025-11-29)
 * - 등록 기간: 선정 날짜 다음 날부터 7일간 (예: 2025-11-30 ~ 2025-12-07)
 *
 * @returns 날짜 기본값 객체
 */
export function getDefaultCampaignDates(): {
  recruitmentPeriod: string;
  announcementDate: string;
  registrationPeriod: string;
} {
  // 오늘 날짜 (시간 정보 제거)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 모집 기간: 오늘부터 7일 후까지
  const recruitmentStart = today;
  const recruitmentEnd = addDays(today, 7);
  const recruitmentPeriod = `${format(recruitmentStart, "yyyy-MM-dd")} ~ ${format(
    recruitmentEnd,
    "yyyy-MM-dd"
  )}`;

  // 선정 날짜: 모집 기간 종료일 다음 날 (8일 후)
  const announcementDate = format(addDays(today, 8), "yyyy-MM-dd");

  // 등록 기간: 선정 날짜 다음 날부터 7일간 (9일 후부터 15일 후까지)
  const registrationStart = addDays(today, 9);
  const registrationEnd = addDays(today, 15);
  const registrationPeriod = `${format(registrationStart, "yyyy-MM-dd")} ~ ${format(
    registrationEnd,
    "yyyy-MM-dd"
  )}`;

  return {
    recruitmentPeriod,
    announcementDate,
    registrationPeriod,
  };
}

