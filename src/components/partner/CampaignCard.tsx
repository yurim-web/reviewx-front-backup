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
    } else if (buttonText === "패널티 내역보기") {
      // 패널티 내역 페이지로 이동
      window.location.href = "/partner/campaign_management/penalty";
    } else {
      // 다른 버튼들의 로직 처리
      console.log(`${buttonText} 버튼 클릭됨`);
    }
  };

  /**
   * 현재 탭과 캠페인 subStatus에 따른 버튼 텍스트 결정
   */
  const getButtonText = () => {
    // subStatus 기반으로 버튼 결정 (USER와 동일한 방식)
    if (campaign.subStatus === "applicant_management") {
      return "신청내역 확인하기";
    } else if (campaign.subStatus === "winner_selection") {
      return "당첨자 선정하기";
    } else if (campaign.subStatus === "content_review") {
      return `콘텐츠 확인하기 (${campaign.submissions || 0})`;
    } else if (campaign.subStatus === "penalty") {
      return "패널티 내역보기";
    }

    // fallback: subStatus가 없는 경우 탭 기반으로 결정
    switch (activeTab) {
      case "예정":
        return "캠페인 수정하기";
      case "신청":
        return "신청내역 확인하기";
      case "진행":
        return "당첨자 선정하기";
      case "종료":
        return `콘텐츠 확인하기 (${campaign.submissions || 0})`;
      case "취소":
        return "패널티 내역보기";
      default:
        return "캠페인 관리하기";
    }
  };

  /**
   * 버튼 텍스트에 따른 스타일 클래스 결정
   */
  const getButtonStyle = () => {
    const buttonText = getButtonText();

    // 주요 액션 버튼 - 검은색 배경 (콘텐츠 등록, 재등록, 구매 영수증 등록 등)
    if (
      buttonText === "콘텐츠 등록하기" ||
      buttonText === "콘텐츠 재등록하기" ||
      buttonText === "구매 영수증 등록하기" ||
      buttonText === "구매 영수증 수정하기" ||
      buttonText === "구매 영수증 재등록하기" ||
      buttonText === "패널티 해제하기" ||
      buttonText === "당첨자 선정하기" ||
      buttonText === "캠페인 수정하기"
    ) {
      return `${buttonStyles.action_button} ${buttonStyles.primary_button}`;
    }

    // 경고 버튼 - 빨간색 테두리 (패널티 관련)
    if (
      buttonText === "패널티 내역보기" ||
      buttonText === "콘텐츠 반려 사유보기"
    ) {
      return `${buttonStyles.action_button} ${buttonStyles.danger_button}`;
    }

    // 보조 버튼 - 회색 테두리 (확인하기)
    if (buttonText.includes("확인하기")) {
      return `${buttonStyles.action_button} ${buttonStyles.secondary_button}`;
    }

    // 일반 버튼 - 기본 검은색 테두리
    return `${buttonStyles.action_button} ${buttonStyles.default_button}`;
  };

  /**
   * 현재 탭에 따른 상태 텍스트 표시 (데이터 기반)
   */
  const getStatusText = () => {
    // 데이터에서 제공되는 statusMessage를 직접 사용
    // 탭에 따라 다른 메시지가 필요한 경우를 위한 fallback 로직
    if (campaign.statusMessage) {
      return campaign.statusMessage;
    }

    // fallback: 데이터에 statusMessage가 없는 경우 기본 메시지
    const fallbackMessages = {
      신청: `캠페인 선정 발표까지 ${campaign.remainingDays}일 남았습니다.`,
      선정: "캠페인에 선정되었습니다. 진행해주세요.",
      완료: "캠페인이 완료되었습니다.",
      "취소/반려": "캠페인 신청이 취소되었습니다.",
    };

    return fallbackMessages[campaign.status] || fallbackMessages["신청"];
  };

  return (
    <div className={cardStyles.campaign_card}>
      <div className={cardStyles.campaign_content_container}>
        {/* 캠페인 이미지 */}
        <div className={cardStyles.campaign_image}>
          {/* TODO: 실제 이미지 추가 시 여기에 img 태그 추가 */}
        </div>

        {/* 캠페인 상세 정보 */}
        <div className={cardStyles.campaign_info}>
          {/* 헤더: 타입 아이콘 + 신청자 수 */}
          <div className={cardStyles.campaign_header}>
            <div className={cardStyles.campaign_type}>
              {campaign.brandLogo ? (
                <img
                  src={campaign.brandLogo}
                  alt={campaign.brand || campaign.type}
                  className={cardStyles.brand_logo}
                />
              ) : (
                <div
                  className={`${cardStyles.type_icon} ${
                    cardStyles[
                      `type_${
                        campaign.type === "배송형" ? "delivery" : "visit"
                      }`
                    ]
                  }`}
                />
              )}
              <span className={cardStyles.type_text}>{campaign.type}</span>
            </div>

            {/* 신청자 수 표시 */}
            <div className={cardStyles.applicant_count}>
              {campaign.status === "선정" ? (
                // 진행 중인 캠페인: 검수/제출/선정 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    검수 {campaign.submissions || 0}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_current}>
                    제출 {campaign.submissions || 0}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>
                    선정 {campaign.selected || 0}명
                  </span>
                </>
              ) : (
                // 일반 캠페인: 신청/모집 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    신청 {campaign.applicants || 0}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>
                    모집 {campaign.recruits || 0}명
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 캠페인 제목 */}
          <h3 className={cardStyles.campaign_title}>{campaign.title}</h3>

          {/* 캠페인 상태 설명 */}
          <p className={cardStyles.campaign_status}>{getStatusText()}</p>
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div className={cardStyles.campaign_actions}>
        {/* 콘텐츠 검수 및 승인 단계: 2개 버튼 표시 */}
        {campaign.subStatus === "content_review,content_approval" ? (
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.secondary_button}`}
            >
              콘텐츠 검수하기 ({campaign.submissions || 0})
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
            >
              콘텐츠 확인하기 ({campaign.submissions || 0})
            </button>
          </>
        ) : (
          /* 그 외의 경우: 상태에 맞는 1개 버튼 표시 */
          <button
            className={getButtonStyle()}
            onClick={() => handleButtonClick(getButtonText())}
          >
            {getButtonText()}
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
