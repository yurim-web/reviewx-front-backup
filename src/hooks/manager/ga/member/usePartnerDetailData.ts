/* ========================================
   파트너 상세 데이터 로드 훅 (하위호환 re-export)
   ======================================== */

/**
 * usePartnerDetailData
 *
 * 목적: 공통 훅으로 이동됨 → re-export로 하위호환 유지
 *
 * 사용 페이지:
 * - /manager_ga/member/partners/[id]
 */

export { usePartnerDetailData } from "@/hooks/manager/common/member/usePartnerDetailData";
