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
 */

import Link from "next/link";
import Image from "next/image";
import type { PartnerStatTab } from "@/types/domain/partner";
import type { PartnerCampaign } from "@/types/domain/partner";
import cardStyles from "../../../styles/partner/campaign_card.module.css";
import buttonStyles from "../../../styles/partner/partner_campaign_buttons.module.css";
import ReceiptRegistrationModal from "../campaign_contents/ReceiptRegistrationModal";
import CampaignManagementModal from "./modals/CampaignManagementModal";
import BaseModal from "@/components/common/modal/BaseModal";
import { getCampaignTypePath, convertToCampaignDataId } from "./utils/campaign_card_helpers";
import { useCampaignCard } from "@/hooks/partner/campaign_management/useCampaignCard";
import { getButtonClassName } from "@/components/common/campaign_management/utils/button_style_utils";
import { deleteCampaign, cancelCampaign } from "@/data/partner/sharedCampaigns";
import { getPartnerTabByDates } from "@/data/partner/utils/campaignHelpers";

interface CampaignCardProps {
  campaign: PartnerCampaign;
  activeTab: PartnerStatTab;
}

/**
 * 개별 캠페인 카드
 * 탭 상태에 따라 다른 버튼과 텍스트를 표시
 */
export default function CampaignCard({ campaign, activeTab }: CampaignCardProps) {
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
    actions: { closeReceiptModal, closeManagementModal, closeDeleteModal, handleButtonClick },
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
    const campaignDataId = convertToCampaignDataId(campaign.campaignType, String(campaign.id));
    const detailPath = `/campaign/${campaignTypePath}/${campaignDataId}`;
    // 디버깅: 생성된 경로 로그
    // console.log("[CampaignCard] 상세 페이지 경로 생성:", {
    //   originalId: campaign.id,
    //   campaignType: campaign.campaignType,
    //   campaignTypePath,
    //   convertedId: campaignDataId,
    //   detailPath,
    // });
    return detailPath;
  };

  const detailPath = getCampaignDetailPath();

  return (
    <div className={cardStyles.campaign_card}>
      {/* 캠페인 정보 영역 - Link로 감싸서 클릭 시 상세페이지로 이동 */}
      <Link
        href={detailPath}
        className={cardStyles.campaign_content_container}
        onClick={(_e) => {
          // 버튼 영역 클릭 시에는 상세페이지로 이동하지 않도록 처리
          // 버튼은 Link 밖에 있어서 자동으로 처리되지만, 안전을 위해 추가
        }}
      >
        {/* 캠페인 이미지 */}
        <div className={cardStyles.campaign_image}>
          {campaign.image ? <Image src={campaign.image} alt="캠페인 이미지" fill /> : null}
        </div>

        {/* 캠페인 상세 정보 */}
        <div className={cardStyles.campaign_info}>
          {/* 헤더: 타입 아이콘 + 태그 */}
          <div className={cardStyles.campaign_header}>
            <div className={cardStyles.campaign_type}>
              {campaign.brandLogo ? (
                <Image
                  src={campaign.brandLogo}
                  alt={campaign.brandName || campaign.campaignType}
                  className={cardStyles.brand_logo}
                  width={40}
                  height={40}
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

            {/* 상태 태그 표시 - 취소/종료 상태가 아닐 때만 표시 */}
            {campaignStatus !== "취소" && campaignStatus !== "종료" && (
              <div
                className={`${cardStyles.cam_tag} ${
                  campaign.daysLeft <= 2 ? cardStyles.urgent : cardStyles.normal
                }`}
              >
                <span>{campaign.daysLeft <= 2 ? "마감임박" : `${campaign.daysLeft}일 전`}</span>
              </div>
            )}

            {/* 신청자 수 표시 - PC에서만 표시 */}
            <div className={cardStyles.applicant_count}>
              {activeTab === "연장 요청" ||
              (activeTab === "전체" &&
                campaignSubStatus &&
                campaignSubStatus.includes("extension_request")) ||
              (activeTab !== "전체" &&
                campaignSubStatus &&
                campaignSubStatus.includes("extension_request")) ? (
                <>
                  {/* ======================================== */}
                  {/* 연장 요청 탭: 대기/확인/완료 수 표시 */}
                  {/* ✅ 대기 = 대기 탭(waiting)에 있는 리뷰어 수 */}
                  {/* "전체" 탭에서도 연장 요청이 있는 캠페인은 확인 항목에 핑크색 */}
                  {/* ======================================== */}
                  <span
                    className={`${cardStyles.applicant_current} ${cardStyles.applicant_current_gray}`}
                  >
                    대기 {waitingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span
                    className={`${cardStyles.applicant_current} ${cardStyles.applicant_current_pink}`}
                  >
                    확인 {reviewingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>완료 {completedCount}명</span>
                </>
              ) : (activeTab === "전체" && campaignStatus === "진행 중") ||
                campaignStatus === "진행 중" ||
                activeTab === "진행" ? (
                <>
                  {/* ======================================== */}
                  {/* 진행 중인 캠페인: 대기/확인/완료 수 표시 */}
                  {/* "전체" 탭에서도 진행 중 캠페인은 확인 항목에 핑크색 */}
                  {/* ======================================== */}
                  <span
                    className={`${cardStyles.applicant_current} ${cardStyles.applicant_current_gray}`}
                  >
                    대기 {waitingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span
                    className={`${cardStyles.applicant_current} ${cardStyles.applicant_current_pink}`}
                  >
                    확인 {reviewingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>완료 {completedCount}명</span>
                </>
              ) : (activeTab === "전체" && campaignStatus === "종료") ||
                campaignStatus === "종료" ||
                activeTab === "종료" ? (
                <>
                  {/* ======================================== */}
                  {/* 종료 캠페인: 대기/확인/완료 수 표시 */}
                  {/* "전체" 탭에서도 종료 캠페인은 확인 항목에 핑크색 */}
                  {/* ======================================== */}
                  <span
                    className={`${cardStyles.applicant_current} ${cardStyles.applicant_current_gray}`}
                  >
                    대기 {waitingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span
                    className={`${cardStyles.applicant_current} ${cardStyles.applicant_current_pink}`}
                  >
                    확인 {reviewingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>완료 {completedCount}명</span>
                </>
              ) : (activeTab === "전체" && campaignStatus === "취소") ||
                campaignStatus === "취소" ||
                activeTab === "취소" ? (
                <>
                  {/* ======================================== */}
                  {/* 취소 캠페인: 신청/모집/선정 수 표시 */}
                  {/* "전체" 탭에서도 취소 캠페인은 신청 항목에 핑크색 */}
                  {/* ======================================== */}
                  <span
                    className={`${cardStyles.applicant_current} ${cardStyles.applicant_current_pink}`}
                  >
                    신청 {campaign.applicants || 0}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span
                    className={`${cardStyles.applicant_current} ${cardStyles.applicant_current_gray}`}
                  >
                    모집 {campaign.recruits || 0}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>
                    선정 {campaign.selected || 0}명
                  </span>
                </>
              ) : (
                <>
                  {/* ======================================== */}
                  {/* 일반 캠페인: 신청/모집 수 표시 */}
                  {/* "전체" 탭에서는 getPartnerTabByDates로 계산한 탭이 "예정"이면 포인트 컬러 */}
                  {/* ======================================== */}
                  <span
                    className={`${cardStyles.applicant_current} ${
                      activeTab === "전체"
                        ? (() => {
                            // 전체 탭에서는 날짜 기반으로 실제 탭을 계산
                            const calculatedTab = getPartnerTabByDates(
                              campaign.recruitmentPeriod,
                              campaign.registrationPeriod,
                              undefined,
                              campaign.announcementDate
                            );
                            return calculatedTab === "예정" || calculatedTab === "신청"
                              ? cardStyles.applicant_current_pink
                              : cardStyles.applicant_current_gray;
                          })()
                        : activeTab === "예정" || activeTab === "신청"
                          ? cardStyles.applicant_current_pink
                          : cardStyles.applicant_current_gray
                    }`}
                  >
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

          {/* 캠페인 상태 설명 - PC에서만 표시 */}
          <p className={cardStyles.campaign_status_pc}>{statusDescription}</p>
        </div>
      </Link>

      {/* 캠페인 상태 설명 - 모바일에서만 표시 (이미지+정보 아래에 분리) */}
      <p className={cardStyles.campaign_status_mobile}>{statusDescription}</p>

      {/* 액션 버튼 영역 - Link 밖에 있어서 버튼 클릭 시 상세페이지로 이동하지 않음 */}
      <div className={cardStyles.campaign_actions}>
        {/* ======================================== */}
        {/* 연장 요청 탭: 등록 기한 연장 요청 버튼만 표시 */}
        {/* ======================================== */}
        {activeTab === "연장 요청" ||
        (campaignSubStatus && campaignSubStatus.includes("extension_request")) ? (
          <button
            className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
            onClick={() => handleButtonClick(primaryButtonText)}
          >
            {primaryButtonText}
          </button>
        ) : campaignSubStatus === "campaign_edit,campaign_delete" ? (
          /* ======================================== */
          /* 예정 탭: 캠페인 삭제 + 캠페인 수정 */
          /* ======================================== */
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => handleButtonClick("캠페인 수정")}
            >
              캠페인 수정
            </button>
            <button
              className={`${buttonStyles.action_button} ${cardStyles.delete_button}`}
              onClick={() => handleButtonClick("캠페인 삭제")}
            >
              캠페인 삭제
            </button>
          </>
        ) : campaignSubStatus === "campaign_edit,applicant_management" ? (
          /* ======================================== */
          /* 신청 탭: 캠페인 수정 + 신청 내역 확인하기 */
          /* ======================================== */
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => handleButtonClick("캠페인 수정")}
            >
              캠페인 수정
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.secondary_button} ${cardStyles.applicant_list_check_button}`}
              onClick={() => handleButtonClick("신청 내역 확인")}
            >
              신청 내역 확인
            </button>
          </>
        ) : isContentStage ? (
          /* ======================================== */
          /* 종료 탭 또는 콘텐츠 단계: 콘텐츠 확인 + 콘텐츠 확인 완료 */
          /* ======================================== */
          <>
            {/* 📌 콘텐츠 확인 버튼 스타일:
                - 진행 탭 또는 종료 탭일 때: 배경색 #ffffff, 테두리색 #FF5694, 글자색 #FF5694
            */}
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.secondary_button} ${cardStyles.content_check_button}`}
              onClick={() => {
                const campaignTypePath = getCampaignTypePath(campaign.campaignType);
                window.location.href = `/partner/campaign_contents/${campaignTypePath}/${campaign.id}?tab=확인`;
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
            className={`${getButtonClassName(primaryButtonText, buttonStyles)} ${
              primaryButtonText === "당첨자 선정" &&
              (activeTab === "진행" || campaignStatus === "진행 중")
                ? cardStyles.winner_selection_button
                : ""
            }`}
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

      {/* 캠페인 삭제 확인 모달 (BaseModal 통일, 삭제 시에만 확인 버튼 빨강) */}
      <BaseModal
        is_open={isDeleteModalOpen}
        on_close={closeDeleteModal}
        message="캠페인을 삭제하시겠습니까?<br>이 작업은 되돌릴 수 없습니다."
        buttons={["취소", "확인"]}
        button_variant="red"
        on_confirm={() => {
          /**
           * 캠페인 삭제/취소 확인 핸들러
           *
           * 설명:
           * - 예정 탭에서 삭제할 때: 취소 탭으로 이동 (cancelCampaign 호출)
           * - 그 외 탭에서 삭제할 때: 완전 삭제 (deleteCampaign 호출)
           * - 실제 프로덕션에서는 API를 통해 서버에서 캠페인을 삭제/취소해야 합니다
           * - 현재는 프론트엔드 개발을 위해 localStorage에서 처리합니다
           * - 삭제/취소 후 페이지를 새로고침하여 목록을 업데이트합니다
           */
          // console.log(
          //   `[CampaignCard] 캠페인 ${
          //     activeTab === "예정" ? "취소" : "삭제"
          //   } 확인: ID=${campaign.id}, 제목=${campaign.title}, 탭=${activeTab}`
          // );

          // 모달 닫기
          closeDeleteModal();

          // 예정 탭이면 취소 처리, 그 외는 삭제 처리
          if (activeTab === "예정") {
            // 예정 탭: 취소 탭으로 이동
            const result = cancelCampaign(String(campaign.id), campaign.campaignType);

            if (result.success) {
              window.location.reload();
            } else if (result.error === "ALREADY_CANCELLED") {
              alert("이미 취소된 캠페인입니다.");
            } else {
              alert("캠페인 취소에 실패했습니다. 다시 시도해주세요.");
            }
          } else {
            // 그 외 탭: 완전 삭제
            const deleteSuccess = deleteCampaign(String(campaign.id), campaign.campaignType);

            if (deleteSuccess) {
              alert("캠페인이 삭제되었습니다.");
              window.location.reload();
            } else {
              alert("캠페인 삭제에 실패했습니다. 다시 시도해주세요.");
            }
          }
        }}
      />
    </div>
  );
}
