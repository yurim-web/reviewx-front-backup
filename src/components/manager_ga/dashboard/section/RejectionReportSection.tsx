/* ========================================
   📊 반려/신고 통계 섹션 컴포넌트
   ======================================== */

/**
 * 반려/신고 통계 섹션 컴포넌트
 *
 * 목적: 반려와 신고 통계 차트를 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 반려/신고 통계 차트 표시
 * - 날짜별 반려 건수와 신고 건수 시각화
 *
 * 학습 포인트:
 * - 컴포넌트 분리: 각 섹션을 독립적인 컴포넌트로 분리하여 재사용성 향상
 * - CSS 모듈: styles.chart_card를 사용하여 일관된 스타일 적용
 * - 컴포넌트 조합: 차트 컴포넌트를 섹션 컴포넌트 내부에서 사용
 */

import styles from '@/styles/manager_ga/dashboard/sections/rejection_report_section.module.css';
import RejectionReportChart from '../chart/RejectionReportChart';

export default function RejectionReportSection() {
  return (
    <div className={styles.rejection_report_section_card}>
      {/* 제목과 범례를 같은 줄에 배치 (제목: 왼쪽, 범례: 오른쪽) */}
      <div className={styles.rejection_report_section_header}>
        {/* 섹션 제목 */}
        <h2 className={styles.rejection_report_section_title}>반려/신고 통계</h2>

        {/* 커스텀 범례 */}
        <div className={styles.rejection_report_section_legend}>
          {/* 반려 */}
          <div className={styles.rejection_report_section_legend_item}>
            <div
              className={styles.rejection_report_section_legend_icon}
              style={{ backgroundColor: '#FF6600' }}
            ></div>
            <span>반려</span>
          </div>

          {/* 신고 */}
          <div className={styles.rejection_report_section_legend_item}>
            <div
              className={styles.rejection_report_section_legend_icon}
              style={{ backgroundColor: '#FF2626' }}
            ></div>
            <span>신고</span>
          </div>
        </div>
      </div>
      {/* recharts 라이브러리를 사용한 라인 차트 */}
      <RejectionReportChart />
    </div>
  );
}
