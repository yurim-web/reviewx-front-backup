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
 */

import styles from '@/styles/manager_ga/sections/member_type_section.module.css';
import MemberTypeBarChart from '../chart/MemberTypeBarChart';

export default function MemberTypeSection() {
  return (
    <div className={styles.member_type_section_card}>
      {/* 섹션 제목 */}
      <h2 className={styles.member_type_section_title}>전체 회원 통계</h2>

      {/* 막대 차트와 통계 정보를 나란히 배치 */}
      <div className={styles.member_type_section_content}>
        {/* 왼쪽: 막대 차트 */}
        <div className={styles.member_type_section_bar_chart_container}>
          <MemberTypeBarChart />
        </div>

        {/* 오른쪽: 통계 정보 */}
        <div className={styles.member_type_section_stats_info}>
          {/* 파트너/리뷰어/휴면 회원 수 (하단, 3개) */}
          <div className={styles.member_type_section_info_grid_three}>
            {/* 전체 회원 수 (상단, 전체 너비) */}
            <div className={styles.member_type_section_info_card_full}>
              <p className={styles.member_type_section_info_label}>
                전체 회원 수
              </p>
              <p className={styles.member_type_section_info_value}>10,155명</p>
              {/* 변화율 표시 - positive 클래스로 증가 표시 */}
              <p className={styles.member_type_section_info_change_positive}>
                ↑ 50%
              </p>
            </div>

            {/* 파트너 수 */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>파트너</p>
              <p className={styles.member_type_section_info_value}>566명</p>
              {/* 비율 표시 */}
              <p className={styles.member_type_section_info_percentage}>(5%)</p>
            </div>

            {/* 리뷰어 수 */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>리뷰어</p>
              <p className={styles.member_type_section_info_value}>9,589명</p>
              {/* 비율 표시 */}
              <p className={styles.member_type_section_info_percentage}>
                (94%)
              </p>
            </div>

            {/* 휴면 회원 수 */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>휴면 회원</p>
              <p className={styles.member_type_section_info_value}>10명</p>
              {/* 비율 표시 */}
              <p className={styles.member_type_section_info_percentage}>(0%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
