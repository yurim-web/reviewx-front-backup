import type { Metadata } from "next";
import { visitCampaigns } from "@/data/user/visit/visitCampaigns";

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const campaign = visitCampaigns.find((c) => String(c.id) === id);

  if (!campaign) {
    return {
      title: "ReviewX | 캠페인을 찾을 수 없습니다",
      description: "요청하신 방문형 캠페인을 찾을 수 없습니다",
    };
  }

  return {
    title: `ReviewX | ${campaign.title}`,
    description: campaign.description,
  };
}

export default function VisitDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


