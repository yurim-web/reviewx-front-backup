/* ========================================
   방문형 캠페인 상세 페이지
   ======================================== */

/**
 * VisitDetailPage
 *
 * 목적: 방문형 캠페인 상세 정보 표시
 *
 * 사용 페이지:
 * - /campaign/visit/[id] (방문형 캠페인 상세)
 */

"use client";

import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import DetailGuidelinesSectionVisit from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionVisit";
import Toast from "@/components/common/toast/Toast";
import type { VisitCampaignData } from "@/data/campaign/visit/visitCampaigns";
import { useCampaignDetail } from "@/hooks/user/campaign/useCampaignDetail";
import type { CampaignDetailAdapted } from "@/hooks/user/campaign/useCampaignDetail";
import Loading from "@/app/loading";

interface VisitDetailPageProps {
  params: Promise<{ id: string }>;
}

function adaptApiToVisit(api: CampaignDetailAdapted): VisitCampaignData {
  return {
    id: api.id,
    title: api.title,
    category: "방문형",
    image: api.image,
    subcategory: api.subcategory,
    points: api.points,
    description: api.description,
    recruitment: api.recruitment,
    schedule: api.schedule,
    dayCount: api.dayCount,
    region: api.region ?? "",
    detailedSchedule: {
      applicationStart: api.detailedSchedule.applicationStart,
      applicationEnd: api.detailedSchedule.applicationEnd,
      announcement: api.detailedSchedule.announcement,
      purchasePeriod: api.detailedSchedule.purchasePeriod,
      registrationPeriod: api.detailedSchedule.registrationPeriod,
    },
    campaign_detail_image: api.detailImages[0] || api.image,
    campaign_detail_images: api.detailImages,
    channel: api.channel,
    keyword: api.keyword,
    requirements: api.requirements,
    guidelineTexts: api.guidelineTexts,
    isUrgent: api.isUrgent,
    visitAddress: api.visitAddress,
    addressGuide: api.addressGuide ?? "",
    visitLink: api.visitLink ?? "",
  };
}

export default function VisitDetailPage({ params }: VisitDetailPageProps) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<VisitCampaignData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { data: apiCampaign, isLoading: isApiLoading } = useCampaignDetail("visit", id);

  // 서버 API 데이터로 로드
  useEffect(() => {
    if (isApiLoading) return;

    if (apiCampaign) {
      setCampaign(adaptApiToVisit(apiCampaign));
    } else {
      setCampaign(null);
    }
    setIsLoading(false);
  }, [id, apiCampaign, isApiLoading]);

  if (isLoading) return <Loading />;

  // 로딩이 완료되었는데 캠페인이 없으면 404
  if (!campaign) return notFound();

  return (
    <>
      <CampaignDetailPage
        campaign={campaign}
        altText="visit_tag"
        additionalSchedules={[
          {
            label: "등록 기간",
            value: campaign.detailedSchedule.registrationPeriod ?? "",
          },
        ]}
        guidelinesComponent={
          <DetailGuidelinesSectionVisit
            description={campaign.description}
            visitAddress={campaign.visitAddress}
            addressGuide={campaign.addressGuide}
            visitLink={campaign.visitLink}
            keyword={campaign.keyword}
            onCopyVisitAddress={async () => {
              if (campaign.visitAddress) {
                await navigator.clipboard.writeText(campaign.visitAddress);
                setToastMessage("복사되었습니다.");
                setShowToast(true);
              }
            }}
            onCopyVisitLink={async () => {
              if (campaign.visitLink) {
                await navigator.clipboard.writeText(campaign.visitLink);
                setToastMessage("복사되었습니다.");
                setShowToast(true);
              }
            }}
            onCopyKeyword={async () => {
              await navigator.clipboard.writeText(campaign.keyword);
              setToastMessage("복사되었습니다.");
              setShowToast(true);
            }}
            requirements={campaign.requirements}
            guidelineTexts={campaign.guidelineTexts || []}
          />
        }
        renderApplicationModal={(isOpen, onClose, campaign) => (
          <ApplicationModal
            isOpen={isOpen}
            onClose={onClose}
            type="visit"
            campaignId={campaign.id}
            dayCount={campaign.dayCount}
            isUrgent={campaign.isUrgent}
            channelName={campaign.channel}
            channelUrl={undefined}
          />
        )}
      />
      {/* 토스트 메시지 */}
      <Toast
        message={toastMessage}
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        duration={2000}
      />
    </>
  );
}
