/* ========================================
   리뷰어 상세 데이터 로드 훅 (하위호환 re-export)
   ======================================== */

/**
 * useReviewerDetailData
 *
 * 목적: 공통 훅으로 이동됨 → re-export로 하위호환 유지
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers/[id]
 */

export { useReviewerDetailData } from "@/hooks/manager/common/member/useReviewerDetailData";
