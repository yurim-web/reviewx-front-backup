import type { Metadata } from "next";
import CampaignLayoutScript from "@/components/campaign/CampaignLayoutScript";

async function fetchCampaignMeta(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    const res = await fetch(`${apiUrl}/admin/campaign/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const campaign = await fetchCampaignMeta(id);

  if (!campaign) {
    return {
      title: "ReviewX | 캠페인을 찾을 수 없습니다",
      description: "요청하신 배송형 캠페인을 찾을 수 없습니다",
    };
  }

  return {
    title: `${campaign.title} | ReviewX | 배송형 캠페인`,
    description: campaign.description ?? `ReviewX 배송형 캠페인 - ${campaign.title}`,
  };
}

export default function DeliveryDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CampaignLayoutScript />
      {children}
    </>
  );
}
