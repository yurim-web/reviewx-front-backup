/* ========================================
   📝 캠페인 목록 컴포넌트
   ======================================== */

/**
 * 캠페인 목록 컴포넌트
 *
 * 목적: 캠페인 관리 페이지에서 선택된 탭에 따라 필터링된 캠페인 목록을 표시하는 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /partner (파트너 캠페인 관리 페이지)
 *
 * 주요 기능:
 * - 선택된 탭에 따라 필터링된 캠페인 목록 표시
 * - 패널티 탭: PenaltyContent 컴포넌트 표시
 * - 나머지 탭: 해당 상태의 캠페인 카드 목록 표시
 * - 빈 상태 메시지 표시 (해당 상태의 캠페인이 없는 경우)
 * - 조건부 렌더링으로 다른 UI 표시
 */

import { useState, useEffect } from "react";
import type { PartnerStatTab } from "@/types/partner/partner";
import type { PartnerCampaign } from "@/types/partner/partner";
import CampaignCard from "./CampaignCard";
import BaseModal from "@/components/common/modal/BaseModal";
import cardStyles from "../../../styles/partner/campaign_card.module.css";

interface CampaignListProps {
  campaigns: PartnerCampaign[];
  activeStatTab: PartnerStatTab;
  /** 서버 오류 또는 네트워크 오류 발생 여부 */
  error?: boolean;
}

/**
 * 캠페인 목록을 표시하는 컴포넌트
 * - 6개 탭에 맞는 캠페인 카드 목록 필터링 및 표시
 */
export default function CampaignList({
  campaigns,
  activeStatTab,
  error = false,
}: CampaignListProps) {
  // 에러 모달 열림 상태
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

  // 에러가 발생하면 모달 표시
  useEffect(() => {
    if (error) {
      setIsErrorModalOpen(true);
    }
  }, [error]);
  /**
   * 현재 선택된 탭에 맞는 캠페인만 필터링
   *
   * 설명:
   * - PartnerCampaign의 status 값("대기 중", "모집 중", "진행 중", "종료", "취소")을 사용합니다.
   * - 탭 이름과 status 값의 매핑:
   *   - "예정" → "대기 중"
   *   - "신청" → "모집 중"
   *   - "진행" → "진행 중"
   *   - "종료" → "종료"
   *   - "취소" → "취소"
   */
  const filteredCampaigns = campaigns.filter((campaign) => {
    switch (activeStatTab) {
      case "전체":
        // 전체 탭: 모든 캠페인 표시 (연장 요청 탭의 캠페인도 포함)
        return true;
      case "예정":
        return (
          campaign.status === "대기 중" &&
          !campaign.subStatus?.includes("extension_request")
        );
      case "신청":
        return (
          campaign.status === "모집 중" &&
          !campaign.subStatus?.includes("extension_request")
        );
      case "진행":
        /**
         * 진행 탭 필터링
         *
         * 포함되는 상태:
         * - "선정 중": 모집 기간은 지났고, 선정 발표일은 아직 안 지난 캠페인
         *   → 버튼 1개: "당첨자 선정"
         * - "등록 중": 선정 발표일은 지났고, 등록 기간인 캠페인
         *   → 버튼 2개: "콘텐츠 확인", "콘텐츠 확인 완료"
         * - "진행 중": 기존 진행 중 상태 (하위 호환성)
         *
         * 제외 조건:
         * - 등록 기간이 끝났고 연장 요청한 리뷰어가 있는 캠페인은 연장 요청 탭으로 이동
         */
        // "등록 기한 연장 요청" 버튼이 있는 캠페인은 진행 탭에서 제외
        // subStatus에 extension_request가 포함되어 있으면 연장 요청 탭으로 이동
        if (campaign.subStatus?.includes("extension_request")) {
          return false;
        }

        // 선정 중 상태는 항상 진행 탭에 포함
        if (campaign.status === "선정 중") {
          return true;
        }

        // 등록 중 또는 진행 중 상태인 경우
        if (campaign.status === "등록 중" || campaign.status === "진행 중") {
          // 등록 기간이 아직 끝나지 않았거나, 연장 요청한 리뷰어가 없으면 진행 탭에 포함
          return true;
        }

        return false;
      case "종료":
        return (
          campaign.status === "종료" &&
          !campaign.subStatus?.includes("extension_request")
        );
      case "취소":
        return (
          campaign.status === "취소" &&
          !campaign.subStatus?.includes("extension_request")
        );
      case "연장 요청":
        /**
         * 연장 요청 탭 필터링
         *
         * 포함되는 조건:
         * - 캠페인이 종료되지 않았을 때 (진행 중)
         * - 등록 기간이 진행 중일 때 (등록 기간이 끝나지 않았을 때)
         * - 연장 요청한 리뷰어가 있는 캠페인
         *
         * 주의:
         * - 캠페인이 종료되었으면 무조건 종료 탭으로 이동
         * - 등록 기간이 끝났으면 연장 요청 탭에 표시되지 않음
         * - 등록 기간 중일 때만 연장 요청 탭에 표시됨
         *
         * 참고:
         * - getCampaignsByTab에서 이미 필터링이 완료되었으므로,
         *   여기서는 subStatus만 확인하면 됩니다.
         */
        // 캠페인이 종료되었으면 제외
        if (campaign.status === "종료" || campaign.status === "마감") {
          return false;
        }

        // subStatus에 extension_request가 포함되어 있어야 함
        // getCampaignsByTab에서 이미 필터링이 완료되었으므로,
        // 여기서는 subStatus만 확인하면 됩니다.
        return campaign.subStatus?.includes("extension_request") || false;
      default:
        return true;
    }
  });

  // 필터링 결과가 없는 경우 빈 상태로 처리 (메시지 없이 빈칸 유지)
  if (filteredCampaigns.length === 0) {
    return null;
  }

  // 캠페인 카드 목록 렌더링
  return (
    <>
      <div className={cardStyles.campaign_list}>
        {filteredCampaigns.map((campaign, index) => {
          // 고유한 key 생성: campaign.id가 있으면 사용하고, 없거나 중복되면 인덱스와 조합
          // campaign.id가 문자열이 아닌 경우도 대비하여 String()으로 변환
          const uniqueKey = campaign.id
            ? `${String(campaign.id)}-${campaign.campaignType || "unknown"}`
            : `campaign-${index}-${campaign.campaignType || "unknown"}`;

          return (
            <CampaignCard
              key={uniqueKey}
              campaign={campaign}
              activeTab={activeStatTab}
            />
          );
        })}
      </div>

      {/* 에러 모달 */}
      <BaseModal
        is_open={isErrorModalOpen}
        on_close={() => setIsErrorModalOpen(false)}
        message="오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
        buttons={["확인"]}
      />
    </>
  );
}
