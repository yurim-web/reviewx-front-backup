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

import type { PartnerStatTab } from "@/types/partner/partner";
import type { PartnerCampaign } from "@/types/partner/partner";
import cardStyles from "../../../styles/partner/campaign_card.module.css";
import buttonStyles from "../../../styles/partner/buttons.module.css";
import ReceiptRegistrationModal from "../campaign_contents/ReceiptRegistrationModal";
import CampaignManagementModal from "./modals/CampaignManagementModal";
import CampaignDeleteConfirmModal from "./modals/CampaignDeleteConfirmModal";
import { deleteCampaign } from "@/data/partner/sharedCampaigns";
import { getCampaignTypePath } from "./utils/campaign_card_helpers";
import { useCampaignCard } from "./hooks/useCampaignCard";

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
  const {
    state: {
      campaignStatus,
      campaignSubStatus,
      reviewingCount,
      completedCount,
      isContentStage,
      primaryButtonText,
      statusDescription,
      isReceiptModalOpen,
      isManagementModalOpen,
      isDeleteModalOpen,
    },
    actions: {
      closeReceiptModal,
      closeManagementModal,
      closeDeleteModal,
      handleButtonClick,
    },
  } = useCampaignCard({ campaign, activeTab });

  /**
   * 버튼 클릭 핸들러
   *
   *
   * 📌 네비게이션 패턴:
   * 1. 캠페인 타입에 따라 다른 신청내역 페이지로 이동
   * 2. 캠페인 ID를 URL 파라미터로 전달
   * 3. Next.js router를 사용한 프로그래밍적 네비게이션
   */
  /**
   * 버튼 텍스트에 따른 스타일 클래스 결정
   */
  const getButtonStyle = () => {
    const buttonText = primaryButtonText;

    // 주요 액션 버튼 - 검은색 배경 (중요 단계 전환)
    if (
      buttonText === "캠페인 수정하기" ||
      buttonText === "당첨자 선정" ||
      buttonText.startsWith("콘텐츠 확인 완료")
    ) {
      return `${buttonStyles.action_button} ${buttonStyles.primary_button}`;
    }

    // 경고 버튼 - 빨간색 테두리 (패널티 관련)
    if (
      buttonText === "패널티 내역 확인" ||
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

  return (
    <div className={cardStyles.campaign_card}>
      <div className={cardStyles.campaign_content_container}>
        {/* 캠페인 이미지 */}
        <div className={cardStyles.campaign_image}>
          {campaign.image ? (
            <img src={campaign.image} alt="캠페인 이미지" />
          ) : null}
        </div>

        {/* 캠페인 상세 정보 */}
        <div className={cardStyles.campaign_info}>
          {/* 헤더: 타입 아이콘 + 신청자 수 */}
          <div className={cardStyles.campaign_header}>
            <div className={cardStyles.campaign_type}>
              {campaign.brandLogo ? (
                <img
                  src={campaign.brandLogo}
                  alt={campaign.brandName || campaign.campaignType}
                  className={cardStyles.brand_logo}
                />
              ) : (
                <div
                  className={`${cardStyles.type_icon} ${
                    cardStyles[
                      (() => {
                        switch (campaign.campaignType) {
                          case "배송형":
                            return "type_delivery";
                          case "방문형":
                            return "type_visit";
                          case "구매평":
                            return "type_review";
                          case "기자단":
                            return "type_reporter";
                          case "미션형":
                            return "type_mission";
                          default:
                            return "type_delivery";
                        }
                      })()
                    ]
                  }`}
                />
              )}
              <span className={cardStyles.type_text}>{campaign.campaignType}</span>
            </div>

            {/* 신청자 수 표시 */}
            <div className={cardStyles.applicant_count}>
              {campaignStatus === "진행" ? (
                // 진행 중인 캠페인: 검수/제출/선정 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    확인 {reviewingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_current}>
                    제출 {completedCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>
                    선정 {campaign.selected || 0}명
                  </span>
                </>
              ) : campaignStatus === "종료" ? (
                // 종료 캠페인: 검수/제출/선정 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    확인 {reviewingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_current}>
                    제출 {completedCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>
                    선정 {campaign.selected || 0}명
                  </span>
                </>
              ) : campaignStatus === "취소" ? (
                // 취소 캠페인: 신청/모집/선정 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    신청 {campaign.applicants || 0}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_current}>
                    모집 {campaign.recruits || 0}명
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
          <p className={cardStyles.campaign_status}>{statusDescription}</p>
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div className={cardStyles.campaign_actions}>
        {/* 예정 탭: 캠페인 삭제 + 캠페인 수정 */}
        {campaignSubStatus === "campaign_edit,campaign_delete" ? (
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.danger_button}`}
              onClick={() => handleButtonClick("캠페인 삭제")}
            >
              캠페인 삭제
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => handleButtonClick("캠페인 수정")}
            >
              캠페인 수정
            </button>
          </>
        ) : campaignSubStatus === "campaign_edit,applicant_management" ? (
          /* 신청 탭: 캠페인 관리 + 신청 내역 확인하기 */
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => handleButtonClick("캠페인 관리")}
            >
              캠페인 관리
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.secondary_button}`}
              onClick={() => handleButtonClick("신청내역 확인")}
            >
              신청내역 확인
            </button>
          </>
        ) : isContentStage ? (
          /* 종료 탭 또는 콘텐츠 단계: 콘텐츠 확인 + 콘텐츠 확인 완료 */
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.secondary_button}`}
              onClick={() => {
                const campaignTypePath = getCampaignTypePath(campaign.campaignType);
                window.location.href = `/partner/campaign_contents/${campaignTypePath}/${campaign.id}?tab=검수`;
              }}
            >
              콘텐츠 확인 ({reviewingCount})
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => {
                const campaignTypePath = getCampaignTypePath(campaign.campaignType);
                window.location.href = `/partner/campaign_contents/${campaignTypePath}/${campaign.id}?tab=완료`;
              }}
            >
              콘텐츠 확인 완료 ({completedCount})
            </button>
          </>
        ) : (
          /* 그 외의 경우: 상태에 맞는 1개 버튼 표시 (당첨자 선정, 패널티 내역 확인 등) */
          <button
            className={getButtonStyle()}
            onClick={() => handleButtonClick(primaryButtonText)}
          >
            {primaryButtonText}
          </button>
        )}
      </div>

      {/* 구매 영수증 등록 모달 */}
      <ReceiptRegistrationModal
        isOpen={isReceiptModalOpen}
        onClose={closeReceiptModal}
        campaignTitle={campaign.title}
      />

      {/* 캠페인 관리 모달 */}
      <CampaignManagementModal
        isOpen={isManagementModalOpen}
        onClose={closeManagementModal}
        campaignTitle={campaign.title}
        campaignType={campaign.campaignType}
        campaignId={campaign.id}
      />

      {/* 캠페인 삭제 확인 모달 */}
      <CampaignDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        campaignTitle={campaign.title}
        campaignId={campaign.id}
        onConfirm={() => {
          /**
           * 캠페인 삭제 확인 핸들러
           * 
           * - 실제 프로덕션에서는 API를 통해 서버에서 캠페인을 삭제해야 합니다
           * - 현재는 프론트엔드 개발을 위해 localStorage에서 삭제합니다
           * - 삭제 후 페이지를 새로고침하여 목록을 업데이트합니다
           */
          const campaignIdString = String(campaign.id);
          const campaignType = campaign.campaignType as
            | "배송형"
            | "방문형"
            | "구매평"
            | "기자단"
            | "미션형";

          console.log(`[CampaignCard] 캠페인 삭제 시도: ID=${campaignIdString}, 타입=${campaignType}, 제목=${campaign.title}`);

          // localStorage에서 캠페인 삭제
          const deleteSuccess = deleteCampaign(campaignIdString, campaignType);

          console.log(`[CampaignCard] 삭제 결과: ${deleteSuccess ? "성공" : "실패"}`);

          if (deleteSuccess) {
            // 삭제 성공 시 알림 표시
            alert("캠페인이 삭제되었습니다.");
            // 페이지 새로고침하여 업데이트된 캠페인 목록 표시
            window.location.reload();
          } else {
            // 삭제 실패 시 에러 메시지 표시
            alert("캠페인 삭제에 실패했습니다. 다시 시도해주세요.");
          }
        }}
      />
    </div>
  );
}
