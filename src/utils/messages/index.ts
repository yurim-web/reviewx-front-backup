/* ========================================
   📦 메시지 관련 유틸리티 통합 export
   ======================================== */

/**
 * 모듈 목적
 *
 * - 메시지 관련 모든 유틸리티를 한 곳에서 export
 * - 다른 파일에서 import 시 편의성 제공
 */

// 에러 코드 상수 (기존 호환성 유지)
export {
  INPUT_ERROR_CODES,
  CHANNEL_ERROR_CODES,
  WITHDRAWAL_ERROR_CODES,
  POINT_ERROR_CODES,
  CAMPAIGN_RESPONSE_CODES,
  ERROR_MESSAGES,
  getErrorMessage,
  isValidErrorCode,
  type ErrorCode,
  type InputErrorCode,
  type ChannelErrorCode,
  type WithdrawalErrorCode,
  type PointErrorCode,
  type CampaignResponseCode,
} from "./errorCodes";

// API 에러 처리
export {
  handleApiError,
  isApiSuccess,
  isApiError,
  type ApiErrorResponse,
  type ApiSuccessResponse,
  type ApiResponse,
  type ErrorHandleResult,
} from "./apiErrorHandler";

// 전체 메시지 코드 (통합 관리)
export {
  INPUT_ERROR_MESSAGES,
  CHANNEL_ERROR_MESSAGES,
  WITHDRAWAL_ERROR_MESSAGES,
  POINT_ERROR_MESSAGES,
  REVIEWER_NOTIFICATION_MESSAGES,
  PARTNER_NOTIFICATION_MESSAGES,
  ADMIN_NOTIFICATION_MESSAGES,
  TOAST_MESSAGES,
  ACTION_MODAL_MESSAGES,
  ERROR_MODAL_MESSAGES,
  COMPLETE_MODAL_MESSAGES,
  BLOCK_MODAL_MESSAGES,
  ALL_MESSAGES,
  getMessage,
  getMessageText,
  isValidMessageCode,
  type MessageCode,
  type MessageType,
  type ModalButtonType,
  type MessageMetadata,
} from "./messageCodes";

// 메시지 헬퍼 유틸리티
export {
  getMessageTypeClass,
  parseMessageWithHTML,
  getModalProps,
  getToastProps,
  getNotificationProps,
} from "./messageHelper";
