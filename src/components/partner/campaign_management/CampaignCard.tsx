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

import { useMemo, useState } from "react";
import type { PartnerStatTab } from "@/types/partner/partner";
import type { PartnerCampaign } from "@/types/partner/partner";
import cardStyles from "../../../styles/partner/campaign_card.module.css";
import buttonStyles from "../../../styles/partner/buttons.module.css";
import ReceiptRegistrationModal from "../campaign_contents/ReceiptRegistrationModal";
import CampaignManagementModal from "./modals/CampaignManagementModal";
import CampaignDeleteConfirmModal from "./modals/CampaignDeleteConfirmModal";
import { getClosedContentsById, getCampaignById, deleteCampaign } from "@/data/partner/sharedCampaigns";
import { getVisitContentsById } from "@/data/partner/visit";
import { getDeliveryContentsById } from "@/data/partner/delivery";
import { getReporterContentsById } from "@/data/partner/reporter";
import { getPurchaseReviewContentsById } from "@/data/partner/review";
import { getMissionContentsById } from "@/data/partner/mission";

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
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 캠페인 타입/상태에 따른 콘텐츠 검수/완료 개수 계산 (초기 렌더 시 메모)
  const { reviewingCount, completedCount } = useMemo(() => {
    const id = String(campaign.id);

    const getByType = () => {
      switch (campaign.type) {
        case "방문형":
          return getVisitContentsById(id);
        case "배송형":
          return getDeliveryContentsById(id);
        case "기자단":
          return getReporterContentsById(id);
        case "구매평":
          return getPurchaseReviewContentsById(id);
        case "미션형":
          return getMissionContentsById(id);
        default:
          return { reviewing: [], completed: [] };
      }
    };

    // 종료/취소 상태인 경우: closedCampaigns에서 먼저 찾고, 없으면 getCampaignById에서 contents 확인
    if (campaign.status === "종료" || campaign.status === "취소") {
      const closedContents = getClosedContentsById(id);
      if (closedContents) {
        return {
          reviewingCount: closedContents.reviewing?.length ?? 0,
          completedCount: closedContents.completed?.length ?? 0,
        };
      }
      // closedCampaigns에 없으면 getCampaignById에서 contents 확인
      const campaignData = getCampaignById(id);
      if (campaignData && (campaignData as any).contents) {
        const contents = (campaignData as any).contents;
        return {
          reviewingCount: contents.reviewing?.length ?? 0,
          completedCount: contents.completed?.length ?? 0,
        };
      }
      return { reviewingCount: 0, completedCount: 0 };
    }

    // 진행 중/진행 상태인 경우: getCampaignById에서 contents 확인, 없으면 타입별 함수 호출
    const campaignData = getCampaignById(id);
    if (campaignData && (campaignData as any).contents) {
      const contents = (campaignData as any).contents;
      return {
        reviewingCount: contents.reviewing?.length ?? 0,
        completedCount: contents.completed?.length ?? 0,
      };
    }

    // getCampaignById에 contents가 없으면 타입별 함수로 조회
    const contents = getByType();
    return {
      reviewingCount: contents?.reviewing?.length ?? 0,
      completedCount: contents?.completed?.length ?? 0,
    };
  }, [campaign.id, campaign.type, campaign.status]);

  // 콘텐츠 검수/확인 버튼 표시 여부 판별
  const isContentStage = useMemo(() => {
    const s = campaign.subStatus || "";
    // 서브 상태로 판별
    if (s.includes("content_review") || s.includes("content_approval")) {
      return true;
    }
    // 종료 상태일 때 2버튼 형태 지원
    if (campaign.status === "종료") {
      return true;
    }
    // 진행 상태에서도 콘텐츠 데이터가 있으면 2버튼 형태 지원
    if (
      campaign.status === "진행" &&
      (reviewingCount > 0 || completedCount > 0)
    ) {
      return true;
    }
    return false;
  }, [campaign.subStatus, campaign.status, reviewingCount, completedCount]);

  /**
   * 버튼 클릭 핸들러
   *
   * 🎓 학습 포인트: 조건부 네비게이션과 동적 라우팅
   *
   * 📌 네비게이션 패턴:
   * 1. 캠페인 타입에 따라 다른 신청내역 페이지로 이동
   * 2. 캠페인 ID를 URL 파라미터로 전달
   * 3. Next.js router를 사용한 프로그래밍적 네비게이션
   */
  const handleButtonClick = (buttonText: string) => {
    if (buttonText === "구매 영수증 등록하기") {
      setIsReceiptModalOpen(true);
    } else if (buttonText === "캠페인 관리하기") {
      setIsManagementModalOpen(true);
    } else if (buttonText === "캠페인 수정하기") {
      // 캠페인 타입에 따라 다른 수정 페이지로 이동
      const getCampaignTypePath = (type: string) => {
        switch (type) {
          case "배송형":
            return "delivery";
          case "방문형":
            return "visit";
          case "구매평":
            return "review";
          case "기자단":
            return "reporter";
          case "미션형":
            return "mission";
          default:
            return "delivery"; // 기본값
        }
      };

      const campaignTypePath = getCampaignTypePath(campaign.type);
      window.location.href = `/partner/campaign/edit/${campaignTypePath}/${campaign.id}`;
    } else if (buttonText === "캠페인 삭제") {
      // 삭제 확인 모달 열기
      setIsDeleteModalOpen(true);
    } else if (buttonText === "패널티 내역보기") {
      // 패널티 내역 페이지로 이동
      window.location.href = "/partner/campaign_management/penalty";
    } else if (buttonText === "신청내역 확인하기") {
      // 캠페인 타입에 따라 다른 신청내역 페이지로 이동 (신청 탭)
      const getCampaignTypePath = (type: string) => {
        switch (type) {
          case "배송형":
            return "delivery";
          case "방문형":
            return "visit";
          case "구매평":
            return "review";
          case "기자단":
            return "reporter";
          case "미션형":
            return "mission";
          default:
            return "delivery"; // 기본값
        }
      };

      const campaignTypePath = getCampaignTypePath(campaign.type);
      window.location.href = `/partner/campaign_application/${campaignTypePath}/${campaign.id}`;
    } else if (buttonText === "당첨자 선정하기") {
      // 캠페인 타입에 따라 다른 신청내역 페이지로 이동 (신청 탭)
      const getCampaignTypePath = (type: string) => {
        switch (type) {
          case "배송형":
            return "delivery";
          case "방문형":
            return "visit";
          case "구매평":
            return "review";
          case "기자단":
            return "reporter";
          case "미션형":
            return "mission";
          default:
            return "delivery"; // 기본값
        }
      };

      const campaignTypePath = getCampaignTypePath(campaign.type);
      window.location.href = `/partner/campaign_application/${campaignTypePath}/${campaign.id}`;
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
      return `콘텐츠 확인하기 (${completedCount})`;
    } else if (campaign.subStatus === "penalty") {
      return "패널티 내역보기";
    }

    // fallback: subStatus가 없는 경우 캠페인 status 기반으로 결정
    switch (campaign.status) {
      case "예정":
        return "캠페인 수정하기";
      case "신청":
        return "신청내역 확인하기";
      case "진행":
        return "당첨자 선정하기";
      case "종료":
        return `콘텐츠 확인하기 (${completedCount})`;
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
    // 데이터에서 제공되는 statusMessage를 직접 사용 (우선순위 1)
    if (campaign.statusMessage) {
      return campaign.statusMessage;
    }

    // fallback: 데이터에 statusMessage가 없는 경우 기본 메시지
    const fallbackMessages: Record<string, string> = {
      신청: `캠페인 선정 발표까지 ${campaign.remainingDays}일 남았습니다.`,
      선정: "캠페인에 선정되었습니다. 진행해주세요.",
      완료: "캠페인이 완료되었습니다.",
      "취소/반려": "캠페인 신청이 취소되었습니다.",
      예정: "캠페인이 예정되어 있습니다.",
      진행: "캠페인 당첨자를 선정해 주세요.",
      종료: "캠페인 콘텐츠를 검수해 주세요.",
      취소: "캠페인이 취소되었습니다.",
    };

    return fallbackMessages[campaign.status] || fallbackMessages["신청"];
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
              {campaign.status === "진행" ? (
                // 진행 중인 캠페인: 검수/제출/선정 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    검수 {reviewingCount}명
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
              ) : campaign.status === "종료" ? (
                // 종료 캠페인: 검수/제출/선정 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    검수 {reviewingCount}명
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
              ) : campaign.status === "취소" ? (
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
          <p className={cardStyles.campaign_status}>{getStatusText()}</p>
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div className={cardStyles.campaign_actions}>
        {/* 예정 탭: 캠페인 삭제 + 캠페인 수정하기 */}
        {campaign.subStatus === "campaign_edit,campaign_delete" ? (
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.danger_button}`}
              onClick={() => handleButtonClick("캠페인 삭제")}
            >
              캠페인 삭제
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => handleButtonClick("캠페인 수정하기")}
            >
              캠페인 수정하기
            </button>
          </>
        ) : campaign.subStatus === "campaign_edit,applicant_management" ? (
          /* 신청 탭: 캠페인 관리하기 + 신청 내역 확인하기 */
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => handleButtonClick("캠페인 관리하기")}
            >
              캠페인 관리하기
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.secondary_button}`}
              onClick={() => handleButtonClick("신청내역 확인하기")}
            >
              신청내역 확인하기
            </button>
          </>
        ) : isContentStage ? (
          /* 종료 탭 또는 콘텐츠 단계: 콘텐츠 검수하기 + 콘텐츠 확인하기 */
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.secondary_button}`}
              onClick={() => {
                const getCampaignTypePath = (type: string) => {
                  switch (type) {
                    case "배송형":
                      return "delivery";
                    case "방문형":
                      return "visit";
                    case "구매평":
                      return "review";
                    case "기자단":
                      return "reporter";
                    case "미션형":
                      return "mission";
                    default:
                      return "delivery";
                  }
                };
                const campaignTypePath = getCampaignTypePath(campaign.type);
                window.location.href = `/partner/campaign_contents/${campaignTypePath}/${campaign.id}?tab=검수`;
              }}
            >
              콘텐츠 검수하기 ({reviewingCount})
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => {
                const getCampaignTypePath = (type: string) => {
                  switch (type) {
                    case "배송형":
                      return "delivery";
                    case "방문형":
                      return "visit";
                    case "구매평":
                      return "review";
                    case "기자단":
                      return "reporter";
                    case "미션형":
                      return "mission";
                    default:
                      return "delivery";
                  }
                };
                const campaignTypePath = getCampaignTypePath(campaign.type);
                window.location.href = `/partner/campaign_contents/${campaignTypePath}/${campaign.id}?tab=완료`;
              }}
            >
              콘텐츠 확인하기 ({completedCount})
            </button>
          </>
        ) : (
          /* 그 외의 경우: 상태에 맞는 1개 버튼 표시 (당첨자 선정하기, 패널티 내역보기 등) */
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

      {/* 캠페인 관리 모달 */}
      <CampaignManagementModal
        isOpen={isManagementModalOpen}
        onClose={() => setIsManagementModalOpen(false)}
        campaignTitle={campaign.title}
        campaignType={campaign.type}
        campaignId={campaign.id}
      />

      {/* 캠페인 삭제 확인 모달 */}
      <CampaignDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        campaignTitle={campaign.title}
        campaignId={campaign.id}
        onConfirm={() => {
          /**
           * 캠페인 삭제 확인 핸들러
           * 
           * 🎓 학습 포인트: localStorage 기반 데이터 삭제
           * - 실제 프로덕션에서는 API를 통해 서버에서 캠페인을 삭제해야 합니다
           * - 현재는 프론트엔드 개발을 위해 localStorage에서 삭제합니다
           * - 삭제 후 페이지를 새로고침하여 목록을 업데이트합니다
           */
          const campaignIdString = String(campaign.id);
          const campaignType = campaign.type as
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
            // 🎓 학습 포인트: window.location.reload()
            // - 페이지를 새로고침하여 최신 데이터를 불러옵니다
            // - getCampaignsByTab() 함수가 매번 최신 localStorage 데이터를 읽어오므로
            //   새로고침하면 삭제된 캠페인이 목록에서 사라집니다
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
