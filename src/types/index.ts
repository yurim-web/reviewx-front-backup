/* ========================================
   📦 Types 최상위 통합 Export
   ======================================== */

/**
 * 모듈 목적
 *
 * - 모든 타입 정의를 한 곳에서 import 할 수 있도록 통합 export
 * - API, Common, Domain 타입을 쉽게 가져올 수 있음
 *
 * 📌 사용 예시:
 * ```typescript
 * // 개별 카테고리에서 가져오기 (권장)
 * import { LoginResponse, CampaignListResponse } from '@/types/api';
 * import { FormState, TableColumn } from '@/types/common';
 * import { CampaignType, ReviewerInfo } from '@/types/domain';
 *
 * // 또는 최상위에서 가져오기
 * import { LoginResponse, FormState, CampaignType } from '@/types';
 * ```
 *
 * 💡 권장사항:
 * - 가능하면 개별 카테고리에서 import하세요 (타입 충돌 방지)
 * - 예: '@/types/api', '@/types/common', '@/types/domain'
 */

// ===== API Response Types =====
// 인증, 캠페인, 포인트, 사용자, 파트너 관련 API 응답 타입
export * from './api';

// ===== Common Types =====
// Form, Table, Modal, Status 등 공통 컴포넌트 타입
export * from './common';

// ===== Domain Types =====
// 사용자(리뷰어)와 파트너의 도메인 타입
export * from './domain';
