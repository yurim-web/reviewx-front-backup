/* ========================================
   📊 파트너 통계 섹션 컴포넌트 (공통 래퍼)
   ======================================== */

/**
 * 파트너 통계 섹션 컴포넌트 (공통 래퍼)
 *
 * 목적: GA/SA 관리자 파트너 목록 페이지에서 공통 MemberStatsSection을 사용합니다.
 *       스타일과 데이터를 전달하여 렌더링합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/partners (GA 관리자 파트너 목록 페이지)
 * - /manager_sa/member/partners (SA 관리자 파트너 목록 페이지)
 */

import MemberStatsSectionCommon from "@/components/manager/common/member/stats/MemberStatsSection";
import styles from "@/styles/manager/common/member/partners/partner_stats_section.module.css";
import { partner_stats } from "@/data/manager_ga/member/partners";

export default function PartnerStatsSection() {
  return (
    <MemberStatsSectionCommon
      stats={partner_stats}
      styles={
        styles as {
          stats_section: string;
          stat_card: string;
          stat_card_label: string;
          stat_card_value: string;
        }
      }
    />
  );
}
