import type { Metadata } from "next";
// 각 캠페인 타입별 실제 데이터를 import
import { deliveryCampaigns } from "@/data/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/review/reviewCampaigns";
import { experienceCampaigns } from "@/data/experience/experienceCampaigns";
import { reporterCampaigns } from "@/data/reporter/reporterCampaigns";

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const allCampaigns = [
    ...deliveryCampaigns,
    ...visitCampaigns,
    ...reviewCampaigns,
    ...experienceCampaigns,
    ...reporterCampaigns,
  ];
  const campaign = allCampaigns.find((c) => c.id === id);

  if (!campaign) {
    return {
      title: "캠페인을 찾을 수 없습니다 - ReviewX",
      description: "요청하신 캠페인을 찾을 수 없습니다",
    };
  }

  return {
    title: `${campaign.title} - ReviewX`,
    description: campaign.description,
  };
}

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
