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
 
 */

import styles from "@/styles/manager/common/dashboard/section/stats_section.module.css";
import MemberActivationDonutChart from "../chart/MemberActivationDonutChart";
import { memberActivationStats } from "@/data/manager_ga/dashboard/dashboardData";

export default function MemberActivationSection() {
  return (
    <div className={styles.member_activation_section_card}>
      {/* 섹션 제목 */}
      <h2 className={styles.member_activation_section_title}>전체 회원 통계</h2>

      {/* 도넛 차트와 통계 정보를 나란히 배치 */}
      <div className={styles.member_activation_section_content}>
        {/* 왼쪽: 도넛 차트 */}
        <div className={styles.member_activation_section_donut_chart_container}>
          <MemberActivationDonutChart />
        </div>

        {/* 오른쪽: 통계 정보 - 상단 전체 너비 + 하단 2개 나란히 */}
        <div className={styles.member_activation_section_stats_info}>
          {/* 상단: 전체 회원 수 (전체 너비) */}
          <div className={styles.member_activation_section_info_card_full}>
            {/* 라벨과 변화율을 같은 선상에 배치 */}
            <div className={styles.member_activation_section_info_label_row}>
              <p className={styles.member_activation_section_info_label}>
                {memberActivationStats.totalMembers.label}
              </p>
              {/* 변화율 표시 */}
              {/* changeType에 따라 화살표와 색상이 달라집니다 */}
              <p
                className={
                  styles[
                    `member_activation_section_info_change_${memberActivationStats.totalMembers.changeType}`
                  ]
                }
              >
                {memberActivationStats.totalMembers.changeType ===
                  "positive" && (
                  <>
                    {/* 상승: 초록색 위쪽 화살표 */}
                    <span>↑</span>{" "}
                    {memberActivationStats.totalMembers.change.replace(
                      /^[+-]\s*/,
                      ""
                    )}
                  </>
                )}
                {memberActivationStats.totalMembers.changeType ===
                  "negative" && (
                  <>
                    {/* 하락: 빨간색 아래쪽 화살표 */}
                    <span>↓</span>{" "}
                    {memberActivationStats.totalMembers.change.replace(
                      /^[+-]\s*/,
                      ""
                    )}
                  </>
                )}
                {memberActivationStats.totalMembers.changeType ===
                  "neutral" && (
                  <>
                    {/* 변화 없음: 회색 대시 */}
                    <span>-</span>{" "}
                    {memberActivationStats.totalMembers.change.replace(
                      /^[+-]\s*/,
                      ""
                    )}
                  </>
                )}
              </p>
            </div>
            {/* 값 표시 */}
            <p className={styles.member_activation_section_info_value}>
              {memberActivationStats.totalMembers.value}
            </p>
          </div>

          {/* 하단: 활성/비활성 회원 수 (2개 나란히) */}
          <div className={styles.member_activation_section_info_grid}>
            {/* 활성 회원 수 */}
            <div className={styles.member_activation_section_info_card}>
              <p className={styles.member_activation_section_info_label}>
                {memberActivationStats.activeMembers.label}
              </p>
              <p className={styles.member_activation_section_info_value}>
                {memberActivationStats.activeMembers.value}
              </p>
              {/* 비율 표시 */}
              <p className={styles.member_activation_section_info_percentage}>
                {memberActivationStats.activeMembers.percentage}
              </p>
            </div>

            {/* 비활성 회원 수 */}
            <div className={styles.member_activation_section_info_card}>
              <p className={styles.member_activation_section_info_label}>
                {memberActivationStats.inactiveMembers.label}
              </p>
              <p className={styles.member_activation_section_info_value}>
                {memberActivationStats.inactiveMembers.value}
              </p>
              {/* 비율 표시 */}
              <p className={styles.member_activation_section_info_percentage}>
                {memberActivationStats.inactiveMembers.percentage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
