/* ========================================
   캠페인 신청 버튼 컴포넌트
   ======================================== */

/**
 * 캠페인 신청 버튼 컴포넌트
 *
 * 목적: 캠페인 상세 페이지 하단의 신청 버튼과 긴급 안내를 담당하는 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /user/campaign/[type]/[id] (캠페인 상세 페이지 하단)
 */

"use client";

import Image from "next/image";
import { useModalState } from "@/hooks/useModalState";
import styles from "@/styles/user/campaign/campaign_detail.module.css";
import BaseModal from "@/components/common/modal/BaseModal";

interface CampaignApplyButtonProps {
  // 신청 시작일 (YYYY-MM-DD 형식)
  applicationStart: string;
  // 신청 마감일 (YYYY-MM-DD 형식)
  applicationEnd: string;
  // 남은 일수 또는 상태 (예: "D-5", "마감임박")
  dayCount?: string;
  // 긴급 캠페인 여부 (기본값: false)
  isUrgent?: boolean;
  // 이미 참여한 캠페인인지 여부 (기본값: false)
  isParticipated?: boolean;
  // 로그인 상태 (기본값: false)
  isLoggedIn?: boolean;
  // 일시 정지된 회원인지 여부 (기본값: false)
  isSuspended?: boolean;
  // 신청 버튼 클릭 시 호출되는 함수
  onApply: () => void;
}

export default function CampaignApplyButton({
  applicationStart,
  applicationEnd,
  dayCount,
  isUrgent: isUrgentProp = false,
  isParticipated = false,
  isLoggedIn = false,
  isSuspended = false,
  onApply,
}: CampaignApplyButtonProps) {
  const loginModal = useModalState();
  const invalidRequestModal = useModalState();

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;

  const startDate = new Date(applicationStart);
  const endDate = new Date(applicationEnd);
  const todayDate = new Date(todayString);

  // 버튼 상태 계산
  const isClosed = endDate < todayDate;
  const isNotOpened = startDate > todayDate;
  const isDisabled = isSuspended || isParticipated || isClosed || isNotOpened;

  let buttonText = "캠페인 신청";
  if (isParticipated) {
    buttonText = "이미 참여한 캠페인";
  } else if (isClosed) {
    buttonText = "캠페인 마감";
  } else if (isNotOpened) {
    buttonText = "캠페인 오픈 예정";
  }

  // isUrgent prop 우선, 없으면 dayCount에서 "긴급" 포함 여부 확인 (하위 호환성)
  const isUrgent = isUrgentProp || dayCount?.includes("긴급") || false;

  const handle_apply_click = () => {
    if (isSuspended) {
      invalidRequestModal.open();
      return;
    }
    if (isDisabled) return;
    if (!isLoggedIn) {
      loginModal.open();
      return;
    }
    onApply();
  };

  return (
    <>
      {/* 로그인 필요 모달 */}
      <BaseModal
        is_open={loginModal.isOpen}
        on_close={loginModal.close}
        message="로그인이 필요합니다."
        buttons={["확인"]}
      />

      {/* 일시 정지 상태에서 버튼이 활성화되어 있을 때 모달 */}
      <BaseModal
        is_open={invalidRequestModal.isOpen}
        on_close={invalidRequestModal.close}
        message="유효하지 않은 요청입니다."
        buttons={["확인"]}
      />

      <div className={styles.bottom_gradient}></div>
      <div className={styles.bottom_fixed_container}>
        <div className={styles.button_wrapper}>
          <button
            className={styles.apply_button}
            onClick={handle_apply_click}
            disabled={isDisabled}
          >
            {buttonText}
          </button>
          {isUrgent && (
            <div className={styles.urgent_notice}>
              <Image
                src="/images/campaign_detail/detail_info.svg"
                alt="정보 아이콘"
                width={16}
                height={16}
                className={styles.urgent_notice_icon}
              />
              <span className={styles.urgent_notice_text}>
                이 캠페인은 참여 및 진행 기간이 짧은 대신,
                <br className={styles.urgent_notice_line_break} />
                완료 시 보상이 당일 지급되는 긴급 캠페인입니다.
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
