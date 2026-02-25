/* ========================================
   이미지 업로드 유효성 검증
   ======================================== */

/**
 * imageUpload
 *
 * 목적: 이미지 파일 업로드 시 공통으로 사용하는 유효성 검증 로직을 제공합니다.
 *
 * 사용 위치:
 * - src/components/user/campaign_management/modals/ReceiptRegistrationModal.tsx
 * - src/components/partner/campaign_contents/ReceiptRegistrationModal.tsx
 */

/** 이미지 업로드 제약 조건 */
export const IMAGE_UPLOAD_CONSTRAINTS = {
  MAX_COUNT: 7,
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: /^image\/(jpeg|jpg|png|gif)$/i,
} as const;

/** 이미지 파일 검증 결과 */
export interface ImageValidationResult {
  validFiles: File[];
  hasExtensionError: boolean;
  hasSizeError: boolean;
  isOverLimit: boolean;
}

/**
 * 이미지 파일 배열 유효성 검증
 *
 * 파일 형식, 크기, 최대 개수를 검증하여 유효한 파일 목록을 반환합니다.
 *
 * @param files - 검증할 파일 배열
 * @param currentCount - 현재 업로드된 이미지 수
 * @returns 검증 결과 (유효 파일 목록 + 오류 플래그)
 */
export function validateImageFiles(files: File[], currentCount: number): ImageValidationResult {
  const result: ImageValidationResult = {
    validFiles: [],
    hasExtensionError: false,
    hasSizeError: false,
    isOverLimit: false,
  };

  if (currentCount + files.length > IMAGE_UPLOAD_CONSTRAINTS.MAX_COUNT) {
    result.isOverLimit = true;
    return result;
  }

  for (const file of files) {
    if (!file.type.match(IMAGE_UPLOAD_CONSTRAINTS.ALLOWED_TYPES)) {
      result.hasExtensionError = true;
      continue;
    }
    if (file.size > IMAGE_UPLOAD_CONSTRAINTS.MAX_SIZE_BYTES) {
      result.hasSizeError = true;
      continue;
    }
    result.validFiles.push(file);
  }

  return result;
}
