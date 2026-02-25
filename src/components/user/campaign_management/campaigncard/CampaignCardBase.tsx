/* ========================================
   캠페인 카드 기본 컴포넌트
   ======================================== */

/**
 * CampaignCardBase
 *
 * 목적: 모든 탭에서 공통으로 사용되는 캠페인 카드의 기본 구조를 제공합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 페이지)
 */

import Link from "next/link";
import Image from "next/image";
import type { CampaignApplication, CampaignType } from "@/types/domain/user";
import { getCampaignTypePath } from "@/utils/helpers/url";
import cardStyles from "../../../../styles/user/campaign_management/campaign_card.module.css";
import { CamTag, CamCateIcon } from "../CampaignTag";

interface CampaignCardBaseProps {
  campaign: CampaignApplication;
  statusText: string;
  children: React.ReactNode;
}

const convertToCampaignDataId = (type: CampaignType, id: string): string => {
  const typePath = getCampaignTypePath(type as Parameters<typeof getCampaignTypePath>[0]);
  if (id.startsWith(`${typePath}_`)) {
    return id;
  }
  return `${typePath}_${id}`;
};

const getCampaignDetailPath = (
  type: CampaignType,
  id: string,
  status: CampaignApplication["status"]
): string => {
  const campaignDataId = convertToCampaignDataId(type, id);
  const typePath = getCampaignTypePath(type as Parameters<typeof getCampaignTypePath>[0]);
  const basePath = `/campaign/${typePath}/${campaignDataId}`;

  // 캠페인 관리(참여 캠페인)에서 들어온 경우 항상 participant=true
  // → 상세 페이지에서 공정위 가이드·캠페인 문의 섹션 표시
  const params = new URLSearchParams();
  params.set("participant", "true");
  if (status === "선정") {
    params.set("selected", "true");
  }
  return `${basePath}?${params.toString()}`;
};

export default function CampaignCardBase({
  campaign,
  statusText,
  children,
}: CampaignCardBaseProps) {
  const detailPath = getCampaignDetailPath(campaign.type, campaign.id, campaign.status);

  return (
    <div className={cardStyles.campaign_card}>
      {/* 캠페인 정보 영역 - 클릭 시 상세페이지로 이동 */}
      <Link href={detailPath} className={cardStyles.campaign_content}>
        <div className={cardStyles.campaign_image}>
          {campaign.image && (
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              style={{ objectFit: "cover", borderRadius: "4px" }}
            />
          )}
        </div>

        <div className={cardStyles.campaign_info}>
          <div className={cardStyles.campaign_header}>
            <CamCateIcon category={campaign.category} type={campaign.type} />
            {/* 취소/반려, 완료 상태에서는 태그 미표시 */}
            {campaign.status !== "취소/반려" && campaign.status !== "완료" && (
              <CamTag isUrgent={campaign.isUrgent} remainingDays={campaign.remainingDays} />
            )}
          </div>

          <h3 className={cardStyles.campaign_title}>{campaign.title}</h3>

          {/* PC 전용 상태 텍스트 */}
          <p className={cardStyles.campaign_status_pc}>{statusText}</p>
        </div>
      </Link>

      {/* 모바일 전용 상태 텍스트 */}
      <p className={cardStyles.campaign_status_mobile}>{statusText}</p>

      {/* 액션 버튼 영역 (Link 밖에 위치 - 버튼 클릭 시 상세페이지 미이동) */}
      {children}
    </div>
  );
}
