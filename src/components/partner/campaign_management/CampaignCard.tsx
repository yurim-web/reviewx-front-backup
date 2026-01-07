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

import Link from "next/link";
import type { PartnerStatTab } from "@/types/partner/partner";
import type { PartnerCampaign } from "@/types/partner/partner";
import cardStyles from "../../../styles/partner/campaign_card.module.css";
import buttonStyles from "../../../styles/partner/buttons.module.css";
import ReceiptRegistrationModal from "../campaign_contents/ReceiptRegistrationModal";
import CampaignManagementModal from "./modals/CampaignManagementModal";
import BaseModal from "@/components/common/modal/BaseModal";
import { getCampaignTypePath } from "./utils/campaign_card_helpers";
import { useCampaignCard } from "@/hooks/partner/campaign_management/useCampaignCard";
import { getButtonClassName } from "@/components/common/campaign_management/utils/button_style_utils";

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
      waitingCount,
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
   *
   * 설명:
   * - 공통 유틸리티 함수를 사용하여 버튼 스타일을 결정합니다.
   * - User와 Partner의 CampaignCard에서 동일한 로직을 공유합니다.
   */
  const getButtonStyle = () => {
    return getButtonClassName(primaryButtonText, buttonStyles);
  };

  /**
   * 캠페인 ID를 실제 캠페인 데이터의 ID 형식으로 변환하는 함수
   *
   * 설명:
   * - campaign.id가 이미 "mission_3" 형식이면 그대로 사용
   * - "3" 같은 숫자만 있으면 "mission_3" 형식으로 변환
   * - user 캠페인 카드의 convertToCampaignDataId 함수와 동일한 로직
   */
  const convertToCampaignDataId = (type: string, id: string): string => {
    const campaignTypePath = getCampaignTypePath(
      type as PartnerCampaign["campaignType"]
    );

    // ID가 이미 "mission_3" 형식인지 확인
    if (id.startsWith(`${campaignTypePath}_`)) {
      // 이미 올바른 형식이면 그대로 반환
      return id;
    }

    // ID를 실제 캠페인 데이터 형식으로 변환
    // 예: "3" → "mission_3"
    return `${campaignTypePath}_${id}`;
  };

  /**
   * 캠페인 상세 페이지 경로 생성
   *
   * 설명:
   * - 캠페인 타입과 ID를 사용하여 상세 페이지 경로를 생성합니다.
   * - user 캠페인 카드와 동일한 형식으로 경로를 생성합니다.
   * - 예: "/campaign/delivery/delivery_1" 또는 "/campaign/mission/mission_3"
   */
  const getCampaignDetailPath = (): string => {
    const campaignTypePath = getCampaignTypePath(campaign.campaignType);
    // campaign.id를 올바른 형식으로 변환 (이미 "mission_3" 형식이면 그대로 사용)
    const campaignDataId = convertToCampaignDataId(
      campaign.campaignType,
      String(campaign.id)
    );
    const detailPath = `/campaign/${campaignTypePath}/${campaignDataId}`;
    // 디버깅: 생성된 경로 로그
    console.log("[CampaignCard] 상세 페이지 경로 생성:", {
      originalId: campaign.id,
      campaignType: campaign.campaignType,
      campaignTypePath,
      convertedId: campaignDataId,
      detailPath,
    });
    return detailPath;
  };

  const detailPath = getCampaignDetailPath();

  return (
    <div className={cardStyles.campaign_card}>
      {/* 캠페인 정보 영역 - Link로 감싸서 클릭 시 상세페이지로 이동 */}
      <Link
        href={detailPath}
        className={cardStyles.campaign_content_container}
        onClick={(e) => {
          // 버튼 영역 클릭 시에는 상세페이지로 이동하지 않도록 처리
          // 버튼은 Link 밖에 있어서 자동으로 처리되지만, 안전을 위해 추가
        }}
      >
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
              <span className={cardStyles.type_text}>
                {campaign.campaignType}
              </span>
            </div>

            {/* 신청자 수 표시 */}
            <div className={cardStyles.applicant_count}>
              {activeTab === "연장 요청" ||
              (campaignSubStatus &&
                campaignSubStatus.includes("extension_request")) ? (
                // 연장 요청 탭: 대기/확인/완료 수 표시
                // ✅ 대기 = 대기 탭(waiting)에 있는 리뷰어 수
                <>
                  <span className={cardStyles.applicant_current}>
                    대기 {waitingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_current}>
                    확인 {reviewingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>
                    완료 {completedCount}명
                  </span>
                </>
              ) : campaignStatus === "진행 중" ? (
                // 진행 중인 캠페인: 대기/확인/완료 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    대기 {waitingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_current}>
                    확인 {reviewingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>
                    완료 {completedCount}명
                  </span>
                </>
              ) : campaignStatus === "종료" ? (
                // 종료 캠페인: 대기/확인/완료 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    대기 {waitingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_current}>
                    확인 {reviewingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>
                    완료 {completedCount}명
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
      </Link>

      {/* 액션 버튼 영역 - Link 밖에 있어서 버튼 클릭 시 상세페이지로 이동하지 않음 */}
      <div className={cardStyles.campaign_actions}>
        {/* 연장 요청 탭: 등록 기한 연장 요청 버튼만 표시 */}
        {activeTab === "연장 요청" ||
        (campaignSubStatus &&
          campaignSubStatus.includes("extension_request")) ? (
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
            onClick={() => handleButtonClick(primaryButtonText)}
          >
            {primaryButtonText}
          </button>
        ) : campaignSubStatus === "campaign_edit,campaign_delete" ? (
          /* 예정 탭: 캠페인 삭제 + 캠페인 수정 */
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
          /* 신청 탭: 캠페인 수정 + 신청 내역 확인하기 */
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => handleButtonClick("캠페인 수정")}
            >
              캠페인 수정
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
                const campaignTypePath = getCampaignTypePath(
                  campaign.campaignType
                );
                window.location.href = `/partner/campaign_contents/${campaignTypePath}/${campaign.id}?tab=확인`;
              }}
            >
              콘텐츠 확인 ({reviewingCount})
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => {
                const campaignTypePath = getCampaignTypePath(
                  campaign.campaignType
                );
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
        activeTab={activeTab}
      />

      {/* 캠페인 삭제 확인 모달 */}
      <BaseModal
        is_open={isDeleteModalOpen}
        on_close={closeDeleteModal}
        message="캠페인을 삭제하시겠습니까?<br>이 작업은 되돌릴 수 없습니다."
        buttons={["취소", "확인"]}
        on_confirm={() => {
          /**
           * 캠페인 삭제 확인 핸들러
           *
           * 설명:
           * - 실제 프로덕션에서는 API를 통해 서버에서 캠페인을 삭제해야 합니다
           * - 현재는 프론트엔드 개발을 위해 localStorage에서 삭제합니다
           * - 삭제 후 페이지를 새로고침하여 목록을 업데이트합니다
           */
          // TODO: 실제 API 연동 시 여기에 삭제 API 호출
          console.log(
            `[CampaignCard] 캠페인 삭제 확인: ID=${campaign.id}, 제목=${campaign.title}`
          );

          // 모달 닫기
          closeDeleteModal();

          // TODO: 실제 삭제 로직 구현
          // const deleteSuccess = await deleteCampaignAPI(campaign.id);
          // if (deleteSuccess) {
          //   window.location.reload();
          // }
        }}
      />
    </div>
  );
}
