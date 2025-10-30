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
import type { PartnerStatTab } from "@/types/partner";
import type { PartnerCampaign } from "@/types/partner";
import cardStyles from "../../../styles/partner/campaign_card.module.css";
import buttonStyles from "../../../styles/partner/buttons.module.css";
import ReceiptRegistrationModal from "../campaign/ReceiptRegistrationModal";
import { getClosedContentsById } from "@/data/partner/sharedCampaigns";
import { getVisitContentsById } from "@/data/partner/campaign_contents/visit";
import { getDeliveryContentsById } from "@/data/partner/campaign_contents/delivery";
import { getReporterContentsById } from "@/data/partner/campaign_contents/reporter";
import { getPurchaseReviewContentsById } from "@/data/partner/campaign_contents/review";
import { getMissionContentsById } from "@/data/partner/campaign_contents/mission";

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

    const contents =
      campaign.status === "종료" || campaign.status === "취소"
        ? getClosedContentsById(id) || { reviewing: [], completed: [] }
        : getByType();
    return {
      reviewingCount: contents?.reviewing?.length ?? 0,
      completedCount: contents?.completed?.length ?? 0,
    };
  }, [campaign.id]);

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
      // 캠페인 타입에 따라 다른 신청내역 페이지로 이동 (선정 탭)
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
      window.location.href = `/partner/campaign_application/${campaignTypePath}/${campaign.id}?tab=selected`;
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

    // fallback: subStatus가 없는 경우 캠페인 status 기반으로 결정
    switch (campaign.status) {
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
        {/* 콘텐츠 검수 및 승인 단계: 2개 버튼 표시 (진행 탭 내 공존 가능) */}
        {isContentStage ? (
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
        ) : campaign.subStatus === "campaign_edit,applicant_management" ? (
          /* 캠페인 수정 및 신청 관리 단계: 2개 버튼 표시 */
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
