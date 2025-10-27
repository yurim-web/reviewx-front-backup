import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 새 캠페인 등록 - 기자단",
  description: "기자단 캠페인을 등록하고 관리하세요",
};

export default function ReporterCampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
