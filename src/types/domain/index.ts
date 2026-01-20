/* ========================================
   📦 Domain Types 통합 Export
   ======================================== */

/**
 * 모듈 목적
 *
 * - 도메인별 타입을 한 곳에서 import 할 수 있도록 통합 export
 * - 사용자(리뷰어)와 파트너의 도메인 타입 제공
 *
 * 📌 사용 예시:
 * ```typescript
 * import { CampaignType, PlatformType, ReviewerInfo } from '@/types/domain';
 * ```
 */

// User (Reviewer) Domain Types
export * from './user';

// Partner Domain Types
export * from './partner';
