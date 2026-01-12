/* ========================================
   📊 회원 유형 막대 차트 컴포넌트
   ======================================== */

/**
 * 회원 유형 막대 차트 컴포넌트
 *
 * 목적: 파트너, 리뷰어의 비율을 세로 프로그레스 바로 표시합니다.
 *
 * 사용 위치:
 * - MemberStatsSection 컴포넌트 (전체 회원 통계 카드 2)
 *
 * 주요 기능:
 * - 두 개의 세로 프로그레스 바 (왼쪽: 파트너, 오른쪽: 리뷰어)
 * - 각 바는 회색 배경에 아래에서 위로 채워지는 형태
 * - 애니메이션 효과로 부드럽게 채워짐
 * - 범례: 파트너(어두운 회색), 리뷰어(밝은 회색)
 *
 */

'use client';

import styles from '@/styles/manager_ga/dashboard/device_stats.module.css';
import {
  memberTypeBarData,
  MemberTypeBarData,
} from '@/data/manager_ga/dashboard/dashboardData';

// 색상 정의
const colors = {
  partner: '#2B7FFF', // 파란색 (파트너)
  reviewer: '#FF5694', // 핑크색 (리뷰어)
  background: '#ededed', // 프로그레스 바 배경 회색
};

// 범례 컴포넌트
const CustomLegend = () => {
  return (
    <div className={styles.member_type_legend}>
      <div className={styles.legend_item}>
        <div
          className={styles.legend_color}
          style={{ backgroundColor: colors.partner }}
        ></div>
        <span className={styles.legend_text}>파트너</span>
      </div>
      <div className={styles.legend_item}>
        <div
          className={styles.legend_color}
          style={{ backgroundColor: colors.reviewer }}
        ></div>
        <span className={styles.legend_text}>리뷰어</span>
      </div>
    </div>
  );
};

export default function MemberTypeBarChart() {
  // "전체" 데이터만 사용 (첫 번째 항목)
  const totalData = memberTypeBarData[0];

  return (
    <div className={styles.member_type_bar_chart_container}>
      {/* 프로그레스 바 그리드 - 두 개의 차트를 나란히 배치 */}
      <div className={styles.member_type_progress_grid_wrapper}>
        <div className={styles.member_type_progress_grid}>
          {/* 왼쪽 바: 파트너 */}
          <div className={styles.member_type_progress_chart_wrapper}>
            <div
              className={styles.member_type_progress_bar_container}
              role="img"
              aria-label={`파트너 비율 ${totalData.partner}%`}
            >
              {/* 배경 (회색) */}
              <div className={styles.member_type_progress_bar_background}></div>
              {/* 채워지는 부분 (파트너) */}
              <div
                className={styles.member_type_progress_bar_fill}
                style={{
                  height: `${totalData.partner}%`,
                  backgroundColor: colors.partner,
                }}
              ></div>
            </div>
          </div>

          {/* 오른쪽 바: 리뷰어 */}
          <div className={styles.member_type_progress_chart_wrapper}>
            <div
              className={styles.member_type_progress_bar_container}
              role="img"
              aria-label={`리뷰어 비율 ${totalData.reviewer}%`}
            >
              {/* 배경 (회색) */}
              <div className={styles.member_type_progress_bar_background}></div>
              {/* 채워지는 부분 (리뷰어) */}
              <div
                className={styles.member_type_progress_bar_fill}
                style={{
                  height: `${totalData.reviewer}%`,
                  backgroundColor: colors.reviewer,
                }}
              ></div>
            </div>
          </div>
        </div>
        {/* 바닥 선 */}
        <div className={styles.member_type_progress_bottom_line}></div>
      </div>
      {/* 범례 */}
      <CustomLegend />
    </div>
  );
}
