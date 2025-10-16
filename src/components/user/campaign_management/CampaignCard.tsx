/* ========================================
   📋 캠페인 카드 컴포넌트
   ======================================== */

/**
 * 캠페인 카드 컴포넌트
 *
 * 목적: 캠페인 관리 페이지에서 각 상태별 캠페인을 표시하는 카드 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 페이지)
 *
 * 주요 기능:
 * - 캠페인 정보 표시 (제목, 카테고리, 상태)
 * - 탭 상태에 따른 동적 버튼 텍스트 및 스타일
 * - 캠페인 상태별 액션 버튼 (신청 취소, 콘텐츠 등록, 패널티 해제 등)
 * - 카테고리 아이콘 및 마감 태그 표시
 * - 반려된 콘텐츠의 경우 2개 버튼 표시
 */

import type { CampaignApplication, StatTab } from "@/types/campaignManagement";
import cardStyles from "../../../styles/user/campaign_management/campaign_card.module.css";
import buttonStyles from "../../../styles/user/campaign_management/buttons.module.css";
import { CamTag, CamCateIcon } from "./CampaignTag";

interface CampaignCardProps {
  campaign: CampaignApplication;
  activeTab: StatTab;
}

/**
 * 개별 캠페인 카드
 * 탭 상태에 따라 다른 버튼과 텍스트를 표시
 */
export default function CampaignCard({
  campaign,
  activeTab,
}: CampaignCardProps) {
  /**
   * 현재 탭과 캠페인 상태에 따른 버튼 텍스트 결정
   */
  const getButtonText = () => {
    switch (activeTab) {
      case "신청":
        return "신청 취소하기";
      case "선정":
        // 콘텐츠 등록 여부에 따라 다른 버튼 표시
        if (campaign.subStatus === "content_not_registered") {
          return "콘텐츠 등록하기";
        } else if (campaign.subStatus === "content_registered") {
          return "콘텐츠 수정하기";
        }
        return "캠페인 진행하기";
      case "완료":
        return "콘텐츠 확인하기";
      case "취소/반려":
        if (campaign.subStatus === "penalty") {
          return "패널티 내역보기";
        } else {
          return "콘텐츠 재등록하기";
        }
      case "패널티":
        return "패널티 해제하기";
      default:
        return "신청 취소하기";
    }
  };

  /**
   * 버튼 텍스트에 따른 스타일 클래스 결정
   */
  const getButtonStyle = () => {
    const buttonText = getButtonText();

    // 주요 액션 버튼 - 검은색 배경 (콘텐츠 등록, 재등록 등)
    if (
      buttonText === "콘텐츠 등록하기" ||
      buttonText === "콘텐츠 재등록하기" ||
      buttonText === "패널티 해제하기"
    ) {
      return `${buttonStyles.action_button} ${buttonStyles.primary_button}`;
    }

    // 경고 버튼 - 빨간색 테두리 (패널티 관련)
    if (buttonText === "패널티 내역보기") {
      return `${buttonStyles.action_button} ${buttonStyles.danger_button}`;
    }

    // 보조 버튼 - 회색 테두리 (확인하기)
    if (buttonText === "콘텐츠 확인하기") {
      return `${buttonStyles.action_button} ${buttonStyles.secondary_button}`;
    }

    // 일반 버튼 - 기본 검은색 테두리
    return `${buttonStyles.action_button} ${buttonStyles.default_button}`;
  };

  /**
   * 현재 탭에 따른 상태 텍스트 표시
   */
  const getStatusText = () => {
    switch (activeTab) {
      case "신청":
        return `캠페인 선정 발표까지 ${campaign.remainingDays}일 남았습니다.`;
      case "선정":
        return "캠페인에 선정되었습니다. 진행해주세요.";
      case "완료":
        return "캠페인이 완료되었습니다.";
      case "취소/반려":
        return "캠페인 신청이 취소되었습니다.";
      case "패널티":
        return "패널티가 부과되었습니다.";
      default:
        return `캠페인 선정 발표까지 ${campaign.remainingDays}일 남았습니다.`;
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
          {/* 헤더: 카테고리 아이콘 + 마감 태그 */}
          <div className={cardStyles.campaign_header}>
            <CamCateIcon
              category={campaign.category}
              icon={campaign.categoryIcon}
              type={campaign.type}
            />
            <CamTag
              isUrgent={campaign.isUrgent}
              remainingDays={campaign.remainingDays}
            />
          </div>

          {/* 캠페인 제목 */}
          <h3 className={cardStyles.campaign_title}>{campaign.title}</h3>

          {/* 캠페인 상태 설명 */}
          <p className={cardStyles.campaign_status}>{getStatusText()}</p>
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div className={buttonStyles.campaign_actions}>
        {/* 취소/반려 탭이면서 콘텐츠가 반려된 경우: 2개 버튼 표시 */}
        {activeTab === "취소/반려" &&
        campaign.subStatus === "content_rejected" ? (
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.danger_button}`}
            >
              콘텐츠 반려 사유보기
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
            >
              콘텐츠 재등록하기
            </button>
          </>
        ) : /* 취소/반려 탭이면서 패널티인 경우 */
        activeTab === "취소/반려" && campaign.subStatus === "penalty" ? (
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.danger_button}`}
          >
            패널티 내역보기
          </button>
        ) : (
          /* 그 외의 경우: 상태에 맞는 1개 버튼 표시 */
          <button className={getButtonStyle()}>{getButtonText()}</button>
        )}
      </div>
    </div>
  );
}



