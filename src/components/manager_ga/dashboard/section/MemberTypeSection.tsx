/* ========================================
   👥 전체 회원 통계 섹션 컴포넌트 (회원 유형 통계)
   ======================================== */

/**
 * 전체 회원 통계 섹션 컴포넌트 (회원 유형 통계)
 *
 * 목적: 파트너, 리뷰어, 휴면 회원의 비율을 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 회원 유형 막대 차트 표시
 * - 전체 회원 수, 파트너 수, 리뷰어 수, 휴면 회원 수 표시
 *
 * 학습 포인트:
 * - 컴포넌트 분리: 각 섹션을 독립적인 컴포넌트로 분리하여 재사용성 향상
 * - CSS 모듈: styles.member_stat_card를 사용하여 일관된 스타일 적용
 * - 그리드 레이아웃: styles.member_info_grid_three로 통계 정보를 배치
 * - 조건부 스타일: 변화율에 따라 positive 스타일 적용
 */

import memberStatsStyles from '@/styles/manager_ga/member_stats.module.css';
import campaignSummaryStyles from '@/styles/manager_ga/campaign_summary.module.css';
import MemberTypeBarChart from '../chart/MemberTypeBarChart';

export default function MemberTypeSection() {
  return (
    <div className={memberStatsStyles.member_stat_card}>
      {/* 섹션 제목 */}
      <h2 className={memberStatsStyles.member_stat_card_title}>
        전체 회원 통계
      </h2>

      {/* 막대 차트와 통계 정보를 나란히 배치 */}
      <div className={memberStatsStyles.member_stats_content}>
        {/* 왼쪽: 막대 차트 */}
        <div className={memberStatsStyles.bar_chart_container}>
          <MemberTypeBarChart />
        </div>

        {/* 오른쪽: 통계 정보 */}
        <div className={memberStatsStyles.member_stats_info}>
          {/* 파트너/리뷰어/휴면 회원 수 (하단, 3개) */}
          <div className={memberStatsStyles.member_info_grid_three}>
            {/* 전체 회원 수 (상단, 전체 너비) */}
            <div className={memberStatsStyles.member_info_card_full}>
              <p className={memberStatsStyles.member_info_label}>
                전체 회원 수
              </p>
              <div className={memberStatsStyles.member_info_value_row}>
                <p className={memberStatsStyles.member_info_value}>10,155명</p>
                {/* 변화율 표시 - positive 클래스로 증가 표시 */}
                <p className={campaignSummaryStyles.stat_card_change_positive}>
                  ↑ 50%
                </p>
              </div>
            </div>

            {/* 파트너 수 */}
            <div className={memberStatsStyles.member_info_card}>
              <p className={memberStatsStyles.member_info_label}>파트너</p>
              <p className={memberStatsStyles.member_info_value}>566명</p>
              {/* 비율 표시 */}
              <p className={memberStatsStyles.member_info_percentage}>(5%)</p>
            </div>

            {/* 리뷰어 수 */}
            <div className={memberStatsStyles.member_info_card}>
              <p className={memberStatsStyles.member_info_label}>리뷰어</p>
              <p className={memberStatsStyles.member_info_value}>9,589명</p>
              {/* 비율 표시 */}
              <p className={memberStatsStyles.member_info_percentage}>(94%)</p>
            </div>

            {/* 휴면 회원 수 */}
            <div className={memberStatsStyles.member_info_card}>
              <p className={memberStatsStyles.member_info_label}>휴면 회원</p>
              <p className={memberStatsStyles.member_info_value}>10명</p>
              {/* 비율 표시 */}
              <p className={memberStatsStyles.member_info_percentage}>(0%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
