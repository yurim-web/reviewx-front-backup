/* ========================================
   👥 전체 회원 통계 섹션 컴포넌트 (활성화 통계)
   ======================================== */

/**
 * 전체 회원 통계 섹션 컴포넌트 (활성화 통계)
 *
 * 목적: 전체 회원의 활성화 비율과 파트너/리뷰어 통계를 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 회원 활성화 도넛 차트 표시
 * - 전체 파트너 수, 활성 파트너 수 표시
 * - 전체 리뷰어 수, 활성 리뷰어 수 표시
 *
 * 학습 포인트:
 * - 컴포넌트 분리: 각 섹션을 독립적인 컴포넌트로 분리하여 재사용성 향상
 * - CSS 모듈: styles.member_stat_card를 사용하여 일관된 스타일 적용
 * - 그리드 레이아웃: styles.member_info_grid로 통계 정보를 2x2 그리드로 배치
 * - 조건부 스타일: 변화율에 따라 positive/neutral 스타일 적용
 */

import memberStatsStyles from '@/styles/manager_ga/member_stats.module.css';
import campaignSummaryStyles from '@/styles/manager_ga/campaign_summary.module.css';
import MemberActivationDonutChart from '../chart/MemberActivationDonutChart';

export default function MemberActivationSection() {
  return (
    <div className={memberStatsStyles.member_stat_card}>
      {/* 섹션 제목 */}
      <h2 className={memberStatsStyles.member_stat_card_title}>전체 회원 통계</h2>
      
      {/* 도넛 차트와 통계 정보를 나란히 배치 */}
      <div className={memberStatsStyles.member_stats_content}>
        {/* 왼쪽: 도넛 차트 */}
        <div className={memberStatsStyles.donut_chart_container}>
          <MemberActivationDonutChart />
        </div>
        
        {/* 오른쪽: 통계 정보 - 2x2 그리드 */}
        <div className={memberStatsStyles.member_stats_info_first}>
          <div className={memberStatsStyles.member_info_grid}>
            {/* 상단 왼쪽: 전체 파트너 수 */}
            <div className={memberStatsStyles.member_info_card}>
              <p className={memberStatsStyles.member_info_label}>전체 파트너 수</p>
              <div className={memberStatsStyles.member_info_value_row}>
                <p className={memberStatsStyles.member_info_value}>566명</p>
                {/* 변화율 표시 - positive 클래스로 증가 표시 */}
                <p className={campaignSummaryStyles.stat_card_change_positive}>↑ 50%</p>
              </div>
            </div>
            
            {/* 상단 오른쪽: 활성 파트너 수 */}
            <div className={memberStatsStyles.member_info_card}>
              <p className={memberStatsStyles.member_info_label}>활성 파트너 수</p>
              <p className={memberStatsStyles.member_info_value}>267명</p>
              {/* 비율 표시 */}
              <p className={memberStatsStyles.member_info_percentage}>(49%)</p>
            </div>
            
            {/* 하단 왼쪽: 전체 리뷰어 수 */}
            <div className={memberStatsStyles.member_info_card}>
              <p className={memberStatsStyles.member_info_label}>전체 리뷰어 수</p>
              <div className={memberStatsStyles.member_info_value_row}>
                <p className={memberStatsStyles.member_info_value}>9,589명</p>
                {/* 변화율 표시 - neutral 클래스로 변화 없음 표시 */}
                <p className={campaignSummaryStyles.stat_card_change_neutral}>- 0%</p>
              </div>
            </div>
            
            {/* 하단 오른쪽: 활성 리뷰어 수 */}
            <div className={memberStatsStyles.member_info_card}>
              <p className={memberStatsStyles.member_info_label}>활성 리뷰어 수</p>
              <p className={memberStatsStyles.member_info_value}>7,589명</p>
              {/* 비율 표시 */}
              <p className={memberStatsStyles.member_info_percentage}>(82%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

