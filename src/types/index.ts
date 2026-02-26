/* ========================================
   Types 최상위 통합 Export
   ======================================== */

/**
 * types/index
 *
 * 목적: API·Common 타입을 한 곳에서 import할 수 있도록 통합 export
 *
 * 사용 페이지:
 * - 전체 (공통 타입 배럴)
 *
 * 주의: Domain 타입(@/types/domain/*)은 API 타입과 이름이 충돌하므로
 *       각 파일에서 직접 import하세요.
 *   예: import { CampaignType } from '@/types/domain/user'
 */

// ===== API Response Types =====
// 인증, 캠페인, 포인트, 사용자, 파트너 관련 API 응답 타입
export * from "./api";

// ===== Common Types =====
// Form, Table, Modal, Status 등 공통 컴포넌트 타입
export * from "./common";
