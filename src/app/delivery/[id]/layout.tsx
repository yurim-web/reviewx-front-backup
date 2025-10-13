import type { Metadata } from "next";
import { deliveryCampaigns } from "@/data/delivery/deliveryCampaigns";

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const campaign = deliveryCampaigns.find((c) => String(c.id) === id);

  if (!campaign) {
    return {
      title: "캠페인을 찾을 수 없습니다 - ReviewX",
      description: "요청하신 배송형 캠페인을 찾을 수 없습니다",
    };
  }

  return {
    title: `${campaign.title} - 배송형 캠페인 - ReviewX`,
    description: campaign.description,
  };
}

export default function DeliveryDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
