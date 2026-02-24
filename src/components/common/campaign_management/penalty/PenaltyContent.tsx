/* ========================================
   ⚠️ 패널티 내역 컴포넌트 (공통)
   ======================================== */

/**
 * 패널티 내역 컴포넌트 (공통)
 *
 * 목적: 유저와 파트너의 패널티 현황과 내역을 보여주는 공통 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (유저 캠페인 관리 페이지 - 패널티 탭)
 * - /partner/campaign_management (파트너 캠페인 관리 페이지 - 패널티 탭)
 *
 */

import type {
  PenaltyStatus,
  PenaltyType,
  PenaltyItem,
  PenaltyStatusData,
} from "@/data/campaign_management/penaltyTypes";
import penaltyStyles from "@/styles/common/campaign_management/penalty.module.css";

interface PenaltyContentProps {
  penaltyData: PenaltyItem[];
  userStatus: PenaltyStatusData;
}

const getStatusConfig = (): Record<
  PenaltyStatus,
  {
    className: string;
    progress: { leftWidth: string; rightWidth: string };
  }
> => ({
  "활동 가능": {
    className: penaltyStyles.active_status,
    progress: { leftWidth: "0%", rightWidth: "0%" },
  },
  "경고 조치": {
    className: penaltyStyles.warning_status,
    progress: { leftWidth: "30%", rightWidth: "0%" },
  },
  "이용 정지 7일": {
    className: penaltyStyles.suspension_status,
    progress: { leftWidth: "100%", rightWidth: "20%" },
  },
  "이용 정지 15일": {
    className: penaltyStyles.suspension_status,
    progress: { leftWidth: "100%", rightWidth: "30%" },
  },
  "이용 정지 30일": {
    className: penaltyStyles.suspension_status,
    progress: { leftWidth: "100%", rightWidth: "50%" },
  },
  "영구 정지": {
    className: penaltyStyles.permanent_ban_status,
    progress: { leftWidth: "100%", rightWidth: "100%" },
  },
});

const getTypeBadgeClasses = (): Record<PenaltyType, string> => ({
  경고: penaltyStyles.warning_badge,
  주의: penaltyStyles.caution_badge,
  정지: penaltyStyles.stop_badge,
  제재: penaltyStyles.sanction_badge,
});

export default function PenaltyContent({ penaltyData, userStatus }: PenaltyContentProps) {
  const hasPenaltyData = penaltyData.length > 0;

  const statusConfig = getStatusConfig();
  const typeBadgeClasses = getTypeBadgeClasses();

  const config = statusConfig[userStatus.currentStatus];

  const { leftWidth, rightWidth } = config.progress;

  const isCautionActive =
    userStatus.currentStatus === "이용 정지 7일" ||
    userStatus.currentStatus === "이용 정지 15일" ||
    userStatus.currentStatus === "이용 정지 30일" ||
    userStatus.currentStatus === "영구 정지";

  const cautionLabelClass = isCautionActive
    ? penaltyStyles.caution_label_active
    : penaltyStyles.caution_label;

  return (
    <div className={penaltyStyles.penalty_content}>
      <section className={penaltyStyles.penalty_stage_section}>
        <article className={penaltyStyles.penalty_status_header}>
          <h2 className={penaltyStyles.penalty_section_title}>패널티 현황</h2>
          <strong
            className={`${penaltyStyles.penalty_status_base} ${config.className}`}
            aria-label="현재 패널티 상태"
          >
            {userStatus.currentStatus}
          </strong>
        </article>

        <div className={penaltyStyles.penalty_stage_info}>
          <div className={penaltyStyles.penalty_stage_bar} role="progressbar">
            <div className={penaltyStyles.stage_bar_container}>
              <span className={penaltyStyles.warning_label} aria-current="step">
                경고
              </span>

              <div className={penaltyStyles.left_stage_bar} aria-hidden="true">
                <div className={penaltyStyles.stage_bar_fill} style={{ width: leftWidth }}></div>
              </div>

              <span className={cautionLabelClass}>주의</span>

              <div className={penaltyStyles.right_stage_bar} aria-hidden="true">
                <div
                  className={penaltyStyles.right_stage_bar_fill}
                  style={{ width: rightWidth }}
                ></div>
              </div>

              <span className={penaltyStyles.stop_label}>정지</span>
            </div>
          </div>
        </div>
      </section>

      <section className={penaltyStyles.penalty_history_section}>
        <h2 className={penaltyStyles.penalty_history_title}>패널티 내역</h2>

        {hasPenaltyData ? (
          <ul className={penaltyStyles.penalty_list}>
            {penaltyData.map((penalty) => (
              <li key={penalty.id} className={penaltyStyles.penalty_item}>
                {/* 패널티 태그 배지 */}
                <div
                  className={`${penaltyStyles.penalty_point_badge} ${
                    typeBadgeClasses[penalty.type]
                  }`}
                  aria-label="패널티 태그"
                >
                  {penalty.type}
                </div>

                {/* 패널티 상세 정보 */}
                <div className={penaltyStyles.penalty_details}>
                  {/* 패널티 제목 */}
                  <h3 className={penaltyStyles.penalty_title_text}>{penalty.title}</h3>
                  {/* 캠페인 제목 - 캠페인으로 인한 패널티 발생 시에만 표시 */}
                  {penalty.campaignTitle && (
                    <p className={penaltyStyles.penalty_campaign_title}>{penalty.campaignTitle}</p>
                  )}
                  {/* 패널티 날짜 */}
                  <time className={penaltyStyles.penalty_date} dateTime={penalty.date}>
                    {penalty.date}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={penaltyStyles.empty_penalty_state}>
            <p className={penaltyStyles.empty_penalty_message}>패널티 내역이 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}
