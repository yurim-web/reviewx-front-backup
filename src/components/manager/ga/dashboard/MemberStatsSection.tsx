/* ========================================
   👥 회원 통계 섹션 컴포넌트
   ======================================== */

/**
 * 회원 통계 섹션 컴포넌트
 *
 * 목적: 전체 회원 통계와 채널별 회원 통계를 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 전체 회원 통계 (활성화 비율)
 * - 파트너/리뷰어 통계
 * - 채널별 회원 통계
 *
 */

import styles from '@/styles/manager_ga/dashboard/member_stats.module.css';
import MemberActivationSection from './section/MemberActivationSection';
import MemberTypeSection from './section/MemberTypeSection';
import ChannelMemberSection from './section/ChannelMemberSection';

export default function MemberStatsSection() {
  return (
    <div className={styles.member_stats_grid}>
      {/* 전체 회원 통계 섹션 1 - 활성화 통계 */}
      <MemberActivationSection />

      {/* 전체 회원 통계 섹션 2 - 회원 유형 통계 */}
      <MemberTypeSection />

      {/* 채널별 회원 통계 섹션 */}
      <ChannelMemberSection />
    </div>
  );
}
