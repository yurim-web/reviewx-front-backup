/* ========================================
   신청 탭 캠페인 카드 컴포넌트
   ======================================== */

/**
 * ApplicationTabCard
 *
 * 목적: "신청" 탭에 표시되는 캠페인 카드를 렌더링합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 > 신청 탭)
 */

import { useModalState } from "@/hooks/useModalState";
import type { CampaignApplication } from "@/types/domain/user";
import buttonStyles from "../../../../styles/user/campaign_management/campaign_buttons.module.css";
import { getButtonClassName } from "@/components/common/campaign_management/utils/button_style_utils";
import CampaignCardBase from "./CampaignCardBase";
import BaseModal from "@/components/common/modal/BaseModal";
import { useAuth } from "@/hooks/useAuth";
import { cancelAppliedCampaign } from "@/components/user/campaign_management/utils/campaignCancelUtils";

interface ApplicationTabCardProps {
  campaign: CampaignApplication;
  /** 신청 취소 성공 시 호출되는 콜백 함수 */
  onCancelSuccess?: (campaignId: string) => void;
}

/**
 * 신청 탭 캠페인 카드
 *
 * 설명:
 * - 사용자가 캠페인에 신청한 상태를 표시합니다.
 * - "신청 취소하기" 버튼을 통해 신청을 취소할 수 있습니다.
 * - 취소 확인 모달과 성공 모달을 순차적으로 표시합니다.
 */
export default function ApplicationTabCard({ campaign, onCancelSuccess }: ApplicationTabCardProps) {
  const { user } = useAuth();

  // 모달 상태 관리
  const confirmModal = useModalState();
  const successModal = useModalState();
  const errorModal = useModalState();
  const alreadyCancelledModal = useModalState();

  /**
   * 상태 텍스트: 선정 발표까지 남은 일수 표시
   *
   * 설명:
   * - remainingDays가 음수이면 이미 선정 발표일이 지난 것입니다.
   * - 하지만 필터링에서 이미 제거되어야 하므로, 음수 값이 나오는 경우는 예외 상황입니다.
   * - 안전을 위해 음수일 때도 적절한 메시지를 표시합니다.
   */
  const getStatusText = (): string => {
    // remainingDays가 음수이면 이미 선정 발표일이 지난 것입니다
    if (campaign.remainingDays < 0) {
      return `캠페인 선정 발표일이 지났습니다.`;
    }
    // remainingDays가 0이면 오늘이 선정 발표일입니다
    if (campaign.remainingDays === 0) {
      return `오늘 선정 발표일입니다.`;
    }
    // 양수이면 남은 일수를 표시합니다
    return `캠페인 선정 발표까지 ${campaign.remainingDays}일 남았습니다.`;
  };

  const statusText = getStatusText();

  // 버튼 텍스트
  const buttonText = "신청 취소";

  // 버튼 스타일 클래스 가져오기
  const buttonStyle = getButtonClassName(buttonText, buttonStyles);

  /**
   * 버튼 클릭 핸들러
   *
   * 설명:
   * - "신청 취소하기" 버튼을 클릭하면 확인 모달을 엽니다.
   */
  const handleButtonClick = () => {
    confirmModal.open();
  };

  /**
   * 신청 취소 확인 핸들러
   */
  const handleConfirmCancel = () => {
    if (!user) {
      confirmModal.close();
      errorModal.open();
      return;
    }

    const result = cancelAppliedCampaign(user.id, campaign.id);
    confirmModal.close();

    if (result.success) {
      successModal.open();
    } else if (result.reason === "already_cancelled") {
      alreadyCancelledModal.open();
    } else {
      errorModal.open();
    }
  };

  const handleCloseSuccessModal = () => {
    successModal.close();

    // 모달이 닫힌 후에 리스트에서 제거 (컴포넌트 언마운트 방지)
    if (onCancelSuccess) {
      setTimeout(() => {
        onCancelSuccess(campaign.id);
      }, 100);
    }
  };

  return (
    <>
      <CampaignCardBase campaign={campaign} statusText={statusText}>
        <div className={buttonStyles.campaign_actions}>
          <button className={buttonStyle} onClick={handleButtonClick}>
            {buttonText}
          </button>
        </div>
      </CampaignCardBase>

      {/* 신청 취소 확인 모달 */}
      <BaseModal
        is_open={confirmModal.isOpen}
        on_close={confirmModal.close}
        message="캠페인 신청을 취소하시겠습니까?"
        buttons={["닫기", "확인"]}
        on_confirm={handleConfirmCancel}
        type="center"
      />

      {/* 신청 취소 성공 모달 */}
      <BaseModal
        is_open={successModal.isOpen}
        on_close={handleCloseSuccessModal}
        message="신청하신 캠페인이 취소되었습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 신청 취소 에러 모달 */}
      <BaseModal
        is_open={errorModal.isOpen}
        on_close={errorModal.close}
        message="오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
        buttons={["확인"]}
        type="center"
      />

      {/* 이미 취소된 캠페인 모달 */}
      <BaseModal
        is_open={alreadyCancelledModal.isOpen}
        on_close={alreadyCancelledModal.close}
        message="이미 취소된 캠페인입니다."
        buttons={["확인"]}
        type="center"
      />
    </>
  );
}
