/* ========================================
   📊 채널별 회원 통계 섹션 컴포넌트
   ======================================== */

/**
 * 채널별 회원 통계 섹션 컴포넌트
 *
 * 목적: 채널별 회원 등록 통계를 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 채널별 회원 파이 차트 표시
 * - 블로그, 인스타그램, 클립, 유튜브 등록 수 표시
 *
 * 학습 포인트:
 * - 컴포넌트 분리: 각 섹션을 독립적인 컴포넌트로 분리하여 재사용성 향상
 * - CSS 모듈: styles.member_stat_card를 사용하여 일관된 스타일 적용
 * - 그리드 레이아웃: styles.member_info_grid로 통계 정보를 2x2 그리드로 배치
 * - 비율 표시: 각 채널별 등록 수와 비율을 함께 표시
 */

import styles from '@/styles/manager_ga/member_stats.module.css';
import ChannelMemberPieChart from '../chart/ChannelMemberPieChart';

export default function ChannelMemberSection() {
  return (
    <div className={styles.member_stat_card}>
      {/* 섹션 제목 */}
      <h2 className={styles.member_stat_card_title}>채널별 회원 통계</h2>
      
      {/* 파이 차트와 통계 정보를 나란히 배치 */}
      <div className={styles.member_stats_content}>
        {/* 왼쪽: 파이 차트 */}
        <div className={styles.pie_chart_container}>
          <ChannelMemberPieChart />
        </div>
        
        {/* 오른쪽: 통계 정보 - 2x2 그리드 */}
        <div className={styles.member_stats_info}>
          <div className={styles.member_info_grid}>
            {/* 블로그 등록 */}
            <div className={styles.member_info_card}>
              <p className={styles.member_info_label}>블로그 등록</p>
              <p className={styles.member_info_value}>12,589명</p>
              {/* 비율 표시 */}
              <p className={styles.member_info_percentage}>(50%)</p>
            </div>
            
            {/* 인스타그램 등록 */}
            <div className={styles.member_info_card}>
              <p className={styles.member_info_label}>인스타그램 등록</p>
              <p className={styles.member_info_value}>10,124명</p>
              {/* 비율 표시 */}
              <p className={styles.member_info_percentage}>(25%)</p>
            </div>
            
            {/* 클립 등록 */}
            <div className={styles.member_info_card}>
              <p className={styles.member_info_label}>클립 등록</p>
              <p className={styles.member_info_value}>8,869명</p>
              {/* 비율 표시 */}
              <p className={styles.member_info_percentage}>(20%)</p>
            </div>
            
            {/* 유튜브 등록 */}
            <div className={styles.member_info_card}>
              <p className={styles.member_info_label}>유튜브 등록</p>
              <p className={styles.member_info_value}>569명</p>
              {/* 비율 표시 */}
              <p className={styles.member_info_percentage}>(5%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

