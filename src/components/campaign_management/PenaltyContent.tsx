// 패널티 내역 컴포넌트
// 패널티 탭을 클릭했을 때 보여지는 화면

import styles from "../../styles/campaign_management/campaign_management.module.css";
import penaltyStyles from "../../styles/campaign_management/penalty.module.css";

/**
 * 패널티 탭의 전체 내용을 보여주는 컴포넌트
 * - 패널티 단계 (진행 바 포함)
 * - 패널티 내역 리스트
 */
export default function PenaltyContent() {
  return (
    <main className={penaltyStyles.penalty_content}>
      {/* 패널티 단계 섹션 */}
      <section className={penaltyStyles.penalty_stage_section}>
        <article className={penaltyStyles.penalty_status_header}>
          <h2 className={penaltyStyles.penalty_section_title}>패널티 현황</h2>
          <strong
            className={penaltyStyles.warning_status}
            aria-label="현재 패널티 상태"
          >
            경고 조치
          </strong>
        </article>

        <div className={penaltyStyles.penalty_stage_info}>
          {/* 진행 상태 바 */}
          <div
            className={penaltyStyles.penalty_stage_bar}
            role="progressbar"
            aria-label="패널티 진행 단계"
          >
            <div className={penaltyStyles.stage_bar_container}>
              {/* 경고 단계 (왼쪽) */}
              <span className={penaltyStyles.warning_label} aria-current="step">
                경고
              </span>
              {/* 왼쪽 진행바 (경고 단계) */}
              <div className={penaltyStyles.left_stage_bar} aria-hidden="true">
                <div
                  className={penaltyStyles.stage_bar_fill}
                  style={{ width: "30%" }}
                ></div>
              </div>
              {/* 주의 단계 (중간) */}
              <span className={penaltyStyles.caution_label}>주의</span>
              {/* 오른쪽 진행바 (주의/정지 단계) */}
              <div
                className={penaltyStyles.right_stage_bar}
                aria-hidden="true"
              ></div>
              {/* 정지 단계 (오른쪽) */}
              <span className={penaltyStyles.stop_label}>정지</span>
            </div>
          </div>
        </div>
      </section>

      {/* 패널티 내역 섹션 */}
      <section className={penaltyStyles.penalty_history_section}>
        <h2 className={penaltyStyles.penalty_section_title}>패널티 내역</h2>
        <ul className={penaltyStyles.penalty_list}>
          {/* 패널티 항목 1 */}
          <li className={penaltyStyles.penalty_item}>
            <div
              className={penaltyStyles.penalty_point_badge}
              aria-label="패널티 태그"
            >
              경고
            </div>
            <div className={penaltyStyles.penalty_details}>
              <h3 className={penaltyStyles.penalty_title_text}>
                캠페인 지각 제출
              </h3>
              <time
                className={penaltyStyles.penalty_date}
                dateTime="2024-02-10"
              >
                2025-09-12
              </time>
            </div>
          </li>

          {/* 패널티 항목 2 */}
          <li className={penaltyStyles.penalty_item}>
            <div
              className={penaltyStyles.penalty_point_badge}
              aria-label="패널티 태그"
            >
              경고
            </div>
            <div className={penaltyStyles.penalty_details}>
              <h3 className={penaltyStyles.penalty_title_text}>
                캠페인 지시 불이행
              </h3>
              <time
                className={penaltyStyles.penalty_date}
                dateTime="2024-02-10"
              >
                2025-09-10
              </time>
            </div>
          </li>

          {/* 패널티 항목 3 */}
          <li className={penaltyStyles.penalty_item}>
            <div
              className={penaltyStyles.penalty_point_badge}
              aria-label="패널티 태그"
            >
              경고
            </div>
            <div className={penaltyStyles.penalty_details}>
              <h3 className={penaltyStyles.penalty_title_text}>
                캠페인 무단 이탈 (노쇼)
              </h3>
              <time
                className={penaltyStyles.penalty_date}
                dateTime="2024-02-10"
              >
                2025-09-10
              </time>
            </div>
          </li>

          {/* 패널티 항목 4 */}
          <li className={penaltyStyles.penalty_item}>
            <div
              className={penaltyStyles.penalty_point_badge}
              aria-label="패널티 태그"
            >
              경고
            </div>
            <div className={penaltyStyles.penalty_details}>
              <h3 className={penaltyStyles.penalty_title_text}>
                캠페인 의무 노출 기간 불이행
              </h3>
              <time
                className={penaltyStyles.penalty_date}
                dateTime="2024-02-21"
              >
                2025-09-01
              </time>
            </div>
          </li>
        </ul>
      </section>
    </main>
  );
}
