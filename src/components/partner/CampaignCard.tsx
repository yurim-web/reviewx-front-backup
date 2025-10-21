/* ========================================
   📋 캠페인 카드 컴포넌트
   ======================================== */

/**
 * 캠페인 카드 컴포넌트
 *
 * 목적: 캠페인 관리 페이지에서 각 상태별 캠페인을 표시하는 카드 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /partner (파트너 캠페인 관리 페이지)
 *
 * 주요 기능:
 * - 캠페인 정보 표시 (제목, 카테고리, 상태)
 * - 탭 상태에 따른 동적 버튼 텍스트 및 스타일
 * - 캠페인 상태별 액션 버튼 (신청 취소, 콘텐츠 등록, 패널티 해제 등)
 * - 카테고리 아이콘 및 마감 태그 표시
 * - 반려된 콘텐츠의 경우 2개 버튼 표시
 */

import { useState } from "react";
import type { PartnerStatTab } from "@/types/partner";
import type { PartnerCampaign } from "@/types/partner";
import cardStyles from "../../styles/partner/campaign_card.module.css";
import buttonStyles from "../../styles/partner/buttons.module.css";
import ReceiptRegistrationModal from "./campaign/ReceiptRegistrationModal";

interface CampaignCardProps {
  campaign: PartnerCampaign;
  activeTab: PartnerStatTab;
}

/**
 * 개별 캠페인 카드
 * 탭 상태에 따라 다른 버튼과 텍스트를 표시
 */
export default function CampaignCard({
  campaign,
  activeTab,
}: CampaignCardProps) {
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  /**
   * 버튼 클릭 핸들러
   */
  const handleButtonClick = (buttonText: string) => {
    if (buttonText === "구매 영수증 등록하기") {
      setIsReceiptModalOpen(true);
    } else {
      // 다른 버튼들의 로직 처리
      console.log(`${buttonText} 버튼 클릭됨`);
    }
  };

  /**
   * 현재 탭과 캠페인 상태에 따른 버튼 텍스트 결정
   */
  const getButtonText = () => {
    switch (activeTab) {
      case "전체":
        // 전체 탭에서는 캠페인 상태에 따라 버튼 텍스트 결정
        switch (campaign.status) {
          case "신청":
            return "신청 취소하기";
          case "선정":
            return "콘텐츠 등록하기";
          case "완료":
            return "콘텐츠 확인하기";
          case "취소/반려":
            return "콘텐츠 재등록하기";
          default:
            return "신청 취소하기";
        }
      case "예정":
        return "신청 취소하기";
      case "신청":
        return "신청 취소하기";
      case "진행":
        return "콘텐츠 등록하기";
      case "종료":
        return "콘텐츠 확인하기";
      case "취소":
        return "콘텐츠 재등록하기";
      default:
        return "신청 취소하기";
    }
  };

  /**
   * 진행 탭일 때 두 번째 버튼 텍스트
   */
  const getSecondButtonText = () => {
    if (
      activeTab === "진행" ||
      (activeTab === "전체" && campaign.status === "선정")
    ) {
      return "구매 영수증 등록하기";
    }
    return null;
  };

  /**
   * 버튼 텍스트에 따른 스타일 클래스 결정
   */
  const getButtonStyle = () => {
    const buttonText = getButtonText();

    // 주요 액션 버튼 - 검은색 배경 (콘텐츠 등록, 재등록 등)
    if (
      buttonText === "콘텐츠 등록하기" ||
      buttonText === "콘텐츠 재등록하기"
    ) {
      return `${buttonStyles.action_button} ${buttonStyles.primary_button}`;
    }

    // 보조 버튼 - 회색 테두리 (확인하기)
    if (buttonText === "콘텐츠 확인하기") {
      return `${buttonStyles.action_button} ${buttonStyles.secondary_button}`;
    }

    // 일반 버튼 - 기본 검은색 테두리
    return `${buttonStyles.action_button} ${buttonStyles.default_button}`;
  };

  /**
   * 두 번째 버튼의 스타일 클래스 결정
   */
  const getSecondButtonStyle = () => {
    const secondButtonText = getSecondButtonText();

    if (secondButtonText === "구매 영수증 등록하기") {
      return `${buttonStyles.action_button} ${buttonStyles.secondary_button}`;
    }

    return `${buttonStyles.action_button} ${buttonStyles.default_button}`;
  };

  /**
   * 현재 탭에 따른 상태 텍스트 표시
   */
  const getStatusText = () => {
    switch (activeTab) {
      case "전체":
        // 전체 탭에서는 캠페인 상태에 따라 텍스트 결정
        switch (campaign.status) {
          case "신청":
            return `캠페인 선정 발표까지 1일 남았습니다.`;
          case "선정":
            return "캠페인에 선정되었습니다. 진행해주세요.";
          case "완료":
            return "캠페인이 완료되었습니다.";
          case "취소/반려":
            return "캠페인 신청이 취소되었습니다.";
          default:
            return `캠페인 선정 발표까지 1일 남았습니다.`;
        }
      case "예정":
        return `캠페인 선정 발표까지 1일 남았습니다.`;
      case "신청":
        return `캠페인 선정 발표까지 1일 남았습니다.`;
      case "진행":
        return "캠페인에 선정되었습니다. 진행해주세요.";
      case "종료":
        return "캠페인이 완료되었습니다.";
      case "취소":
        return "캠페인 신청이 취소되었습니다.";
      default:
        return `캠페인 선정 발표까지 1일 남았습니다.`;
    }
  };

  return (
    <div className={cardStyles.campaign_card}>
      {/* 캠페인 정보 영역 */}
      <div className={cardStyles.campaign_content}>
        {/* 캠페인 이미지 */}
        <div className={cardStyles.campaign_image}>
          {/* TODO: 실제 이미지 추가 시 여기에 img 태그 추가 */}
        </div>

        {/* 캠페인 상세 정보 */}
        <div className={cardStyles.campaign_info}>
          {/* 헤더: 타입 아이콘 + 마감 태그 */}
          <div className={cardStyles.campaign_header}>
            <div className={cardStyles.campaign_type}>
              <div
                className={`${cardStyles.type_icon} ${
                  cardStyles[
                    `type_${campaign.type === "배송형" ? "delivery" : "visit"}`
                  ]
                }`}
              />
              <span className={cardStyles.type_text}>{campaign.type}</span>
            </div>
          </div>

          {/* 캠페인 제목 */}
          <h3 className={cardStyles.campaign_title}>{campaign.title}</h3>

          {/* 캠페인 상태 설명 */}
          <p className={cardStyles.campaign_status}>{getStatusText()}</p>
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div className={buttonStyles.campaign_actions}>
        <button
          className={getButtonStyle()}
          onClick={() => handleButtonClick(getButtonText())}
        >
          {getButtonText()}
        </button>
        {getSecondButtonText() && (
          <button
            className={getSecondButtonStyle()}
            onClick={() => handleButtonClick(getSecondButtonText()!)}
          >
            {getSecondButtonText()}
          </button>
        )}
      </div>

      {/* 구매 영수증 등록 모달 */}
      <ReceiptRegistrationModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        campaignTitle={campaign.title}
      />
    </div>
  );
}
