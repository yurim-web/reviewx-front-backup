/* ========================================
   기자단 캠페인 상세 페이지
   ======================================== */

/**
 * ReporterDetailPage
 *
 * 목적: 기자단 캠페인 상세 정보 표시
 *
 * 사용 페이지:
 * - /campaign/reporter/[id] (기자단 캠페인 상세)
 */

"use client";

import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import DetailGuidelinesSectionReporter from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionReporter";
import Toast from "@/components/common/toast/Toast";
import type { ReporterCampaignData } from "@/data/campaign/reporter/reporterCampaigns";
import { useCampaignDetail } from "@/hooks/user/campaign/useCampaignDetail";
import type { CampaignDetailAdapted } from "@/hooks/user/campaign/useCampaignDetail";
import Loading from "@/app/loading";

interface ReporterDetailPageProps {
  params: Promise<{ id: string }>;
}

function adaptApiToReporter(api: CampaignDetailAdapted): ReporterCampaignData {
  return {
    id: api.id,
    title: api.title,
    category: "기자단",
    image: api.image,
    subcategory: api.subcategory,
    points: api.points,
    description: api.description,
    recruitment: api.recruitment,
    schedule: api.schedule,
    dayCount: api.dayCount,
    detailedSchedule: {
      applicationStart: api.detailedSchedule.applicationStart,
      applicationEnd: api.detailedSchedule.applicationEnd,
      announcement: api.detailedSchedule.announcement,
      registrationPeriod: api.detailedSchedule.registrationPeriod,
    },
    campaign_detail_image: api.detailImages[0] || api.image,
    campaign_detail_images: api.detailImages,
    channel: api.channel,
    keyword: api.keyword,
    requirements: api.requirements,
    guidelineTexts: api.guidelineTexts,
    isUrgent: api.isUrgent,
    productLink: api.promotionLink,
  };
}

export default function ReporterDetailPage({ params }: ReporterDetailPageProps) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<ReporterCampaignData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { data: apiCampaign, isLoading: isApiLoading } = useCampaignDetail(id);

  // 서버 API 데이터로 로드
  useEffect(() => {
    if (isApiLoading) return;

    if (apiCampaign) {
      setCampaign(adaptApiToReporter(apiCampaign));
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
        altText="reporter_tag"
        additionalSchedules={[
          {
            label: "등록 기간",
            value: campaign.detailedSchedule.registrationPeriod,
          },
        ]}
        guidelinesComponent={
          <DetailGuidelinesSectionReporter
            description={campaign.description}
            productLink={campaign.productLink}
            onCopyProductLink={async () => {
              if (campaign.productLink) {
                await navigator.clipboard.writeText(campaign.productLink);
                setToastMessage("복사되었습니다.");
                setShowToast(true);
              }
            }}
            keyword={campaign.keyword}
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
            type="reporter"
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
