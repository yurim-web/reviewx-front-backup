/* ========================================
   📋 완료 탭 캠페인 카드 컴포넌트
   ======================================== */

/**
 * 완료 탭 캠페인 카드 컴포넌트
 *
 * 목적: "완료" 탭에 표시되는 캠페인 카드를 렌더링합니다.
 *
 * 경우의 수: 1가지
 * - 버튼: "콘텐츠 확인하기" (1개)
 *
 * 학습 포인트:
 * - 완료된 상태의 UI: 사용자가 완료한 캠페인을 확인할 수 있는 간단한 구조입니다.
 */

import { useState } from "react";
import type { CampaignApplication } from "@/types/user/user";
import buttonStyles from "../../../../styles/user/campaign_management/buttons.module.css";
import { getButtonClassName } from "@/components/common/campaign_management/utils/button_style_utils";
import CampaignCardBase from "./CampaignCardBase";
import ContentVerificationModal from "../modals/ContentVerificationModal";

interface CompletedTabCardProps {
  campaign: CampaignApplication;
}

/**
 * 완료 탭 캠페인 카드
 *
 * 설명:
 * - 캠페인이 완료된 상태를 표시합니다.
 * - "콘텐츠 확인하기" 버튼을 통해 등록한 콘텐츠를 확인할 수 있습니다.
 */
export default function CompletedTabCard({ campaign }: CompletedTabCardProps) {
  // 모달 상태 관리
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // 상태 텍스트
  const statusText = "캠페인이 완료되었습니다.";

  // 버튼 텍스트
  const buttonText = "콘텐츠 확인하기";

  // 버튼 스타일 클래스 가져오기
  const buttonStyle = getButtonClassName(buttonText, buttonStyles);

  /**
   * 버튼 클릭 핸들러
   *
   * 설명:
   * - 콘텐츠 확인 모달을 엽니다.
   */
  const handleButtonClick = () => {
    setIsVerificationModalOpen(true);
  };

  /**
   * 모달 닫기 핸들러
   *
   * 설명:
   * - 콘텐츠 확인 모달을 닫습니다.
   */
  const handleCloseModal = () => {
    setIsVerificationModalOpen(false);
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

      {/* 콘텐츠 확인 모달 */}
      <ContentVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={handleCloseModal}
        campaignTitle={campaign.title}
        campaignId={campaign.id}
        campaignType={campaign.type}
        missionItems={campaign.missionItems}
      />
    </>
  );
}
