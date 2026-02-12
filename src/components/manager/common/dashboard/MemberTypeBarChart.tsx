/* ========================================
   📊 회원 유형 막대 차트 공통 컴포넌트
   ======================================== */

/**
 * 회원 유형 막대 차트 공통 컴포넌트
 *
 * 목적: 파트너/리뷰어 비율을 세로 프로그레스 바로 표시합니다.
 *
 * 사용 위치:
 * - GA/SA 대시보드의 회원 유형 통계 카드
 *
 * 주요 기능:
 * - 두 개의 세로 프로그레스 바 (왼쪽: 파트너, 오른쪽: 리뷰어)
 * - 각 바는 회색 배경에 아래에서 위로 채워지는 형태
 * - 범례를 통해 색상 의미를 표시
 */

"use client";

import styles from "@/styles/manager/common/chart/member_type_bar_chart.module.css";

/* ========================================
   📌 타입 정의 (TypeScript)
   ======================================== */

/**
 * MemberTypeBarItem
 * - category: 카테고리명 (예: "전체", "활성")
 * - partner: 파트너 비율 값
 * - reviewer: 리뷰어 비율 값
 */
interface MemberTypeBarItem {
  category: string;
  partner: number;
  reviewer: number;
}

/**
 * MemberTypeBarChartProps
 * - member_type_bar_data: 막대 차트에 표시할 데이터 배열
 */
interface MemberTypeBarChartProps {
  member_type_bar_data: MemberTypeBarItem[];
}

/* ========================================
   🎨 색상 상수
   ======================================== */

// 색상 정의 (스타일 인라인으로 사용)
const colors = {
  partner: "#2B7FFF", // 파란색 (파트너)
  reviewer: "#FF5694", // 핑크색 (리뷰어)
  background: "#ededed", // 프로그레스 바 배경 회색
};

/* ========================================
   🧩 범례 컴포넌트
   ======================================== */

// 범례 컴포넌트 (JSX: UI를 함수로 분리해 재사용)
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

/* ========================================
   ✅ 메인 컴포넌트
   ======================================== */

/**
 * React 컴포넌트
 * - props로 받은 데이터로 화면을 구성합니다.
 * - 배열의 첫 번째 항목만 사용해 "전체" 비율을 보여줍니다.
 */
export default function MemberTypeBarChart({
  member_type_bar_data,
}: MemberTypeBarChartProps) {
  // 구조 분해 할당으로 props 사용
  // "전체" 데이터만 사용 (첫 번째 항목)
  const total_data = member_type_bar_data[0];

  // 툴팁 위치 계산: 채워진 영역의 맨 위에 배치
  const get_tooltip_top = (value: number) => {
    if (value <= 0) {
      return 100;
    }
    if (value >= 100) {
      return 0;
    }
    return 100 - value;
  };

  return (
    <div className={styles.member_type_bar_chart_container}>
      {/* 프로그레스 바 그리드 - 두 개의 차트를 나란히 배치 */}
      <div className={styles.member_type_progress_grid_wrapper}>
        <div className={styles.member_type_progress_grid}>
          {/* 왼쪽 바: 파트너 */}
          <div className={styles.member_type_progress_chart_wrapper}>
            <div className={styles.member_type_progress_bar_wrapper}>
              {/* 툴팁: 퍼센트 표시 */}
              <span
                className={styles.member_type_tooltip}
                style={{ top: `${get_tooltip_top(total_data.partner)}%` }}
                aria-hidden="true"
              >
                {total_data.partner}%
              </span>
              <div
                className={styles.member_type_progress_bar_container}
                role="img"
                aria-label={`파트너 비율 ${total_data.partner}%`}
              >
                {/* 배경 (회색) */}
                <div
                  className={styles.member_type_progress_bar_background}
                ></div>
                {/* 채워지는 부분 (파트너) */}
                <div
                  className={styles.member_type_progress_bar_fill}
                  style={{
                    height: `${total_data.partner}%`,
                    backgroundColor: colors.partner,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* 오른쪽 바: 리뷰어 */}
          <div className={styles.member_type_progress_chart_wrapper}>
            <div className={styles.member_type_progress_bar_wrapper}>
              {/* 툴팁: 퍼센트 표시 */}
              <span
                className={styles.member_type_tooltip}
                style={{
                  top: `${get_tooltip_top(total_data.reviewer)}%`,
                }}
                aria-hidden="true"
              >
                {total_data.reviewer}%
              </span>
              <div
                className={styles.member_type_progress_bar_container}
                role="img"
                aria-label={`리뷰어 비율 ${total_data.reviewer}%`}
              >
                {/* 배경 (회색) */}
                <div
                  className={styles.member_type_progress_bar_background}
                ></div>
                {/* 채워지는 부분 (리뷰어) */}
                <div
                  className={styles.member_type_progress_bar_fill}
                  style={{
                    height: `${total_data.reviewer}%`,
                    backgroundColor: colors.reviewer,
                  }}
                ></div>
              </div>
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
