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
      title: "ReviewX | 기자단 캠페인 상세",
      description: "ReviewX 기자단 캠페인 상세 페이지",
    };
  }

  return {
    title: `ReviewX | 기자단 캠페인 상세`,
    description: campaign.description ?? `ReviewX 기자단 캠페인 - ${campaign.title}`,
  };
}

export default function ReporterDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CampaignLayoutScript />
      {children}
    </>
  );
}
