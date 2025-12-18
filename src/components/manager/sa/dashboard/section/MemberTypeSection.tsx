/* ========================================
   👥 회원 유형 별 통계 섹션 컴포넌트
   ======================================== */

/**
 * 회원 유형 별 통계 섹션 컴포넌트
 *
 * 목적: 파트너와 리뷰어의 통계를 막대 차트와 2x2 그리드로 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 회원 유형 막대 차트 표시
 * - 전체 파트너 수, 활성 파트너 수 표시
 * - 전체 리뷰어 수, 활성 리뷰어 수 표시
 * - 2x2 그리드 레이아웃으로 4개의 통계 카드 표시
 *
 */

import styles from '@/styles/manager_sa/dashboard/sections/member_type_section.module.css';
import MemberTypeBarChart from '../chart/MemberTypeBarChart';
import { memberTypeStats } from '@/data/manager_sa/dashboard/dashboardData';

export default function MemberTypeSection() {
  return (
    <div className={styles.member_type_section_card}>
      {/* 섹션 제목 */}
      <h2 className={styles.member_type_section_title}>회원 유형 별 통계</h2>

      {/* 막대 차트와 통계 정보를 나란히 배치 */}
      <div className={styles.member_type_section_content}>
        {/* 왼쪽: 막대 차트 */}
        <div className={styles.member_type_section_bar_chart_container}>
          <MemberTypeBarChart />
        </div>

        <div className={styles.member_type_section_stats_info}>
          <div className={styles.member_type_section_grid}>
            {/* 1. 전체 파트너 수 (왼쪽 상단) */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>
                전체 파트너 수
              </p>
              <p className={styles.member_type_section_info_value}>
                {memberTypeStats.totalPartners.value}
              </p>
              <p
                className={
                  styles[
                    `member_type_section_info_change_${memberTypeStats.totalPartners.changeType}`
                  ]
                }
              >
                {memberTypeStats.totalPartners.change}
              </p>
            </div>

            {/* 2. 활성 파트너 수 (오른쪽 상단) */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>
                활성 파트너 수
              </p>
              <p className={styles.member_type_section_info_value}>
                {memberTypeStats.activePartners.value}
              </p>
              <p className={styles.member_type_section_info_percentage}>
                {memberTypeStats.activePartners.percentage}
              </p>
            </div>

            {/* 3. 전체 리뷰어 수 (왼쪽 하단) */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>
                전체 리뷰어 수
              </p>
              <p className={styles.member_type_section_info_value}>
                {memberTypeStats.totalReviewers.value}
              </p>
              <p
                className={
                  styles[
                    `member_type_section_info_change_${memberTypeStats.totalReviewers.changeType}`
                  ]
                }
              >
                {memberTypeStats.totalReviewers.change}
              </p>
            </div>

            {/* 4. 활성 리뷰어 수 (오른쪽 하단) */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>
                활성 리뷰어 수
              </p>
              <p className={styles.member_type_section_info_value}>
                {memberTypeStats.activeReviewers.value}
              </p>
              <p className={styles.member_type_section_info_percentage}>
                {memberTypeStats.activeReviewers.percentage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
