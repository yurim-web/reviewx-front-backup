/* ========================================
   
   ======================================== */

/**
 * 회원 통계 섹션 컴포넌트
 *
 * 목적: 전체 회원 통계와 채널별 회원 통계를 표시하는 섹션 컴포넌트입니다.
 *
 */

import styles from "@/styles/manager/common/dashboard/chart/member_stats.module.css";
import MemberActivationSection from "./section/MemberActivationSection";
import MemberTypeSection from "./section/MemberTypeSection";
import ChannelMemberSection from "./section/ChannelMemberSection";
import type { DateRange } from "./section/DateRangePickerModal";

interface MemberStatsSectionProps {
  dateRange: DateRange;
}

export default function MemberStatsSection({ dateRange }: MemberStatsSectionProps) {
  return (
    <div className={styles.member_stats_grid}>
      {/* 전체 회원 통계 섹션 1 - 활성화 통계 */}
      <MemberActivationSection dateRange={dateRange} />

      {/* 전체 회원 통계 섹션 2 - 회원 유형 통계 */}
      <MemberTypeSection dateRange={dateRange} />

      {/* 채널별 회원 통계 섹션 */}
      <ChannelMemberSection />
    </div>
  );
}
