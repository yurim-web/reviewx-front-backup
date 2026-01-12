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

import styles from "@/styles/manager_ga/dashboard/sections/member_type_section.module.css";
import MemberTypeBarChart from "../chart/MemberTypeBarChart";
import { memberTypeStats } from "@/data/manager_ga/dashboard/dashboardData";

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
                {memberTypeStats.totalMembers.label}
              </p>
              <p className={styles.member_type_section_info_value}>
                {memberTypeStats.totalMembers.value}
              </p>
              {/* 변화율 표시 */}
              {/* changeType에 따라 화살표와 색상이 달라집니다 */}
              <p
                className={
                  styles[
                    `member_type_section_info_change_${memberTypeStats.totalMembers.changeType}`
                  ]
                }
              >
                {memberTypeStats.totalMembers.changeType === "positive" && (
                  <>
                    {/* 상승: 초록색 위쪽 화살표 */}
                    <span>↑</span>{" "}
                    {memberTypeStats.totalMembers.change.replace(
                      /^[+-]\s*/,
                      ""
                    )}
                  </>
                )}
                {memberTypeStats.totalMembers.changeType === "negative" && (
                  <>
                    {/* 하락: 빨간색 아래쪽 화살표 */}
                    <span>↓</span>{" "}
                    {memberTypeStats.totalMembers.change.replace(
                      /^[+-]\s*/,
                      ""
                    )}
                  </>
                )}
                {memberTypeStats.totalMembers.changeType === "neutral" && (
                  <>
                    {/* 변화 없음: 회색 대시 */}
                    <span>-</span>{" "}
                    {memberTypeStats.totalMembers.change.replace(
                      /^[+-]\s*/,
                      ""
                    )}
                  </>
                )}
              </p>
            </div>

            {/* 파트너 수 */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>
                {memberTypeStats.activePartners.label}
              </p>
              <p className={styles.member_type_section_info_value}>
                {memberTypeStats.activePartners.value}
              </p>
              {/* 비율 표시 */}
              <p className={styles.member_type_section_info_percentage}>
                {memberTypeStats.activePartners.percentage}
              </p>
            </div>

            {/* 리뷰어 수 */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>
                {memberTypeStats.totalReviewers.label}
              </p>
              <p className={styles.member_type_section_info_value}>
                {memberTypeStats.totalReviewers.value}
              </p>
              {/* 변화율 표시 */}
              {/* changeType에 따라 화살표와 색상이 달라집니다 */}
              <p
                className={
                  styles[
                    `member_type_section_info_change_${memberTypeStats.totalReviewers.changeType}`
                  ]
                }
              >
                {memberTypeStats.totalReviewers.changeType === "positive" && (
                  <>
                    {/* 상승: 초록색 위쪽 화살표 */}
                    <span>↑</span>{" "}
                    {memberTypeStats.totalReviewers.change.replace(
                      /^[+-]\s*/,
                      ""
                    )}
                  </>
                )}
                {memberTypeStats.totalReviewers.changeType === "negative" && (
                  <>
                    {/* 하락: 빨간색 아래쪽 화살표 */}
                    <span>↓</span>{" "}
                    {memberTypeStats.totalReviewers.change.replace(
                      /^[+-]\s*/,
                      ""
                    )}
                  </>
                )}
                {memberTypeStats.totalReviewers.changeType === "neutral" && (
                  <>
                    {/* 변화 없음: 회색 대시 */}
                    <span>-</span>{" "}
                    {memberTypeStats.totalReviewers.change.replace(
                      /^[+-]\s*/,
                      ""
                    )}
                  </>
                )}
              </p>
            </div>

            {/* 휴면 회원 수 */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>
                {memberTypeStats.activeReviewers.label}
              </p>
              <p className={styles.member_type_section_info_value}>
                {memberTypeStats.activeReviewers.value}
              </p>
              {/* 비율 표시 */}
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
