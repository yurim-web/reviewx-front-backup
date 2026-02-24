/* ========================================
   📋 신청 탭 캠페인 카드 컴포넌트
   ======================================== */

/**
 * 신청 탭 캠페인 카드 컴포넌트
 *
 * 목적: "신청" 탭에 표시되는 캠페인 카드를 렌더링합니다.
 *
 * 경우의 수: 1가지
 * - 버튼: "신청 취소하기" (1개)
 *

 */

import { useState } from "react";
import type { CampaignApplication } from "@/types/domain/user";
import buttonStyles from "../../../../styles/user/campaign_management/campaign_buttons.module.css";
import { getButtonClassName } from "@/components/common/campaign_management/utils/button_style_utils";
import CampaignCardBase from "./CampaignCardBase";
import BaseModal from "@/components/common/modal/BaseModal";
import { useAuth } from "@/hooks/useAuth";

interface ApplicationTabCardProps {
  campaign: CampaignApplication;
  /** 신청 취소 성공 시 호출되는 콜백 함수 */
  onCancelSuccess?: (campaignId: string) => void;
}

interface StoredCampaignRecord {
  campaignId: string;
  status?: string;
  campaignType?: string;
}

interface StoredApplicant {
  id?: string | number;
  userId?: string | number;
}

interface StoredCampaignData {
  id?: string | number;
  campaignInfo?: { id?: string | number };
  applicantData?: {
    applicants: StoredApplicant[];
    selectedApplicants: StoredApplicant[];
  };
}

interface StoredUserCampaigns {
  userId: string | number;
  campaigns: StoredCampaignRecord[];
}

/**
 * 신청 탭 캠페인 카드
 *
 * 설명:
 * - 사용자가 캠페인에 신청한 상태를 표시합니다.
 * - "신청 취소하기" 버튼을 통해 신청을 취소할 수 있습니다.
 * - 취소 확인 모달과 성공 모달을 순차적으로 표시합니다.
 */
export default function ApplicationTabCard({
  campaign,
  onCancelSuccess,
}: ApplicationTabCardProps) {
  const { user } = useAuth();

  // 모달 상태 관리
  // useState: 컴포넌트의 상태를 관리하는 React 훅입니다.
  // [상태값, 상태변경함수] = useState(초기값) 형태로 사용합니다.
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isAlreadyCancelledModalOpen, setIsAlreadyCancelledModalOpen] =
    useState(false);

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
    setIsConfirmModalOpen(true);
  };

  /**
   * 확인 모달 닫기 핸들러
   *
   * 설명:
   * - 확인 모달의 "닫기" 버튼을 클릭하면 모달을 닫습니다.
   */
  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  /**
   * 신청 취소 확인 핸들러
   *
   * 설명:
   * - 확인 모달의 "확인" 버튼을 클릭하면 실행됩니다.
   * - localStorage의 user_applied_campaigns에서 해당 캠페인의 status를 '취소'로 변경합니다.
   * - 성공 시: 성공 모달을 먼저 표시하고, 모달이 닫힌 후에 리스트에서 제거합니다.
   * - 실패 시: 에러 타입에 따라 다른 모달을 표시합니다.
   *   - 이미 취소된 경우: "이미 취소된 캠페인입니다." 모달
   *   - 서버 오류: "오류가 발생했습니다." 모달
   */
  const handleConfirmCancel = async () => {
    try {
      // localStorage에서 user_applied_campaigns 가져오기
      if (typeof window === 'undefined') {
        throw new Error('브라우저 환경이 아닙니다.');
      }

      const userAppliedCampaigns = localStorage.getItem('user_applied_campaigns');
      if (!userAppliedCampaigns) {
        throw new Error('신청 내역을 찾을 수 없습니다.');
      }

      const allAppliedCampaigns = JSON.parse(userAppliedCampaigns);
      
      // 현재 로그인한 유저 확인
      if (!user) {
        throw new Error('로그인 정보를 찾을 수 없습니다.');
      }

      const userCampaignsIndex = allAppliedCampaigns.findIndex((uc: StoredUserCampaigns) => uc.userId === user.id);
      
      if (userCampaignsIndex === -1) {
        throw new Error('유저의 신청 내역을 찾을 수 없습니다.');
      }

      const userCampaigns = allAppliedCampaigns[userCampaignsIndex];
      
      // 해당 캠페인 찾기
      const campaignIndex = userCampaigns.campaigns.findIndex((c: StoredCampaignRecord) => c.campaignId === campaign.id);
      
      if (campaignIndex === -1) {
        throw new Error('캠페인을 찾을 수 없습니다.');
      }

      const targetCampaign = userCampaigns.campaigns[campaignIndex];
      
      // 이미 취소된 경우 (이미 제거되었을 수 있음)
      if (targetCampaign.status === '취소') {
        setIsConfirmModalOpen(false);
        setIsAlreadyCancelledModalOpen(true);
        return;
      }

      // 취소 시 user_applied_campaigns에서 완전히 제거 (취소/반려 탭으로 이동하지 않음)
      userCampaigns.campaigns = userCampaigns.campaigns.filter((c: StoredCampaignRecord) => c.campaignId !== campaign.id);

      // localStorage에 저장
      allAppliedCampaigns[userCampaignsIndex] = userCampaigns;
      localStorage.setItem('user_applied_campaigns', JSON.stringify(allAppliedCampaigns));

      // localStorage의 해당 캠페인 applicants에서도 제거 (파트너 신청내역에서 사라지도록)
      const campaignType = targetCampaign.campaignType || 
                          (campaign.id.startsWith('delivery_') ? 'delivery' :
                           campaign.id.startsWith('visit_') ? 'visit' :
                           campaign.id.startsWith('review_') ? 'review' :
                           campaign.id.startsWith('reporter_') ? 'reporter' :
                           campaign.id.startsWith('mission_') ? 'mission' : 'delivery');
      
      const storageKey = campaignType === 'delivery' ? 'deliveryCampaigns' :
                        campaignType === 'visit' ? 'visitCampaigns' :
                        campaignType === 'review' ? 'reviewCampaigns' :
                        campaignType === 'reporter' ? 'reporterCampaigns' :
                        campaignType === 'mission' ? 'missionCampaigns' : 'deliveryCampaigns';

      try {
        const storedCampaigns = localStorage.getItem(storageKey);
        if (storedCampaigns) {
          const campaigns = JSON.parse(storedCampaigns);
          const campaignIndex = campaigns.findIndex((c: StoredCampaignData) =>
            c.campaignInfo?.id === campaign.id || c.id === campaign.id
          );

          if (campaignIndex !== -1) {
            const targetCampaignInStorage = campaigns[campaignIndex];
            
            // applicants에서 현재 유저 제거
            if (targetCampaignInStorage.applicantData?.applicants) {
              targetCampaignInStorage.applicantData.applicants =
                targetCampaignInStorage.applicantData.applicants.filter((a: StoredApplicant) =>
                  a.id !== user.id && a.userId !== user.id
                );
            }

            // selectedApplicants에서도 제거 (혹시 선정된 상태였다면)
            if (targetCampaignInStorage.applicantData?.selectedApplicants) {
              targetCampaignInStorage.applicantData.selectedApplicants =
                targetCampaignInStorage.applicantData.selectedApplicants.filter((a: StoredApplicant) =>
                  a.id !== user.id && a.userId !== user.id
                );
            }

            campaigns[campaignIndex] = targetCampaignInStorage;
            localStorage.setItem(storageKey, JSON.stringify(campaigns));
            
          }
        }
      } catch (_error) {
      }


      // 확인 모달 닫기
      setIsConfirmModalOpen(false);

      // 성공 모달 열기 (먼저 모달을 표시)
      setIsSuccessModalOpen(true);
    } catch (error: unknown) {
      setIsConfirmModalOpen(false);

      const err = error as { code?: string; message?: string; response?: { data?: { error?: string } } };
      if (
        err?.code === "ALREADY_CANCELLED" ||
        err?.message?.includes("이미 취소") ||
        err?.response?.data?.error === "ALREADY_CANCELLED"
      ) {
        setIsAlreadyCancelledModalOpen(true);
      } else {
        setIsErrorModalOpen(true);
      }
    }
  };

  /**
   * 성공 모달 닫기 핸들러
   *
   * 설명:
   * - 성공 모달의 "닫기" 버튼을 클릭하면 모달을 닫습니다.
   * - 모달이 닫힌 후에 부모 컴포넌트에 취소 성공을 알려서 리스트에서 제거합니다.
   * - 이렇게 하면 성공 모달이 표시되는 동안 컴포넌트가 언마운트되지 않습니다.
   */
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);

    // 모달이 닫힌 후에 리스트에서 제거 (컴포넌트 언마운트 방지)
    if (onCancelSuccess) {
      // setTimeout을 사용하여 모달이 완전히 닫힌 후에 실행
      setTimeout(() => {
        onCancelSuccess(campaign.id);
      }, 100);
    }
  };

  /**
   * 에러 모달 닫기 핸들러
   *
   * 설명:
   * - 에러 모달의 "확인" 버튼을 클릭하면 모달을 닫습니다.
   * - 사용자가 에러를 확인하고 다시 시도할 수 있도록 합니다.
   */
  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  /**
   * 이미 취소된 캠페인 모달 닫기 핸들러
   *
   * 설명:
   * - 이미 취소된 캠페인 모달의 "확인" 버튼을 클릭하면 모달을 닫습니다.
   * - 사용자가 이미 취소된 상태임을 확인할 수 있습니다.
   */
  const handleCloseAlreadyCancelledModal = () => {
    setIsAlreadyCancelledModalOpen(false);
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
        is_open={isConfirmModalOpen}
        on_close={handleCloseConfirmModal}
        message="캠페인 신청을 취소하시겠습니까?"
        buttons={["닫기", "확인"]}
        on_confirm={handleConfirmCancel}
        type="center"
      />

      {/* 신청 취소 성공 모달 */}
      <BaseModal
        is_open={isSuccessModalOpen}
        on_close={handleCloseSuccessModal}
        message="신청하신 캠페인이 취소되었습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 신청 취소 에러 모달 */}
      <BaseModal
        is_open={isErrorModalOpen}
        on_close={handleCloseErrorModal}
        message="오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
        buttons={["확인"]}
        type="center"
      />

      {/* 이미 취소된 캠페인 모달 */}
      <BaseModal
        is_open={isAlreadyCancelledModalOpen}
        on_close={handleCloseAlreadyCancelledModal}
        message="이미 취소된 캠페인입니다."
        buttons={["확인"]}
        type="center"
      />
    </>
  );
}
