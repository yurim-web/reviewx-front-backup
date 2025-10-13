import type { Metadata } from "next";
import { mockCampaigns_1 } from "@/data/main/mainFirstCampaigns";
import { mockCampaigns_2 } from "@/data/main/mainSecondCampaigns";

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const allCampaigns = [...mockCampaigns_1, ...mockCampaigns_2];
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
