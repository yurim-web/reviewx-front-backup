import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 캠페인 관리",
  description: "파트너 캠페인 관리 대시보드",
};

export default function CampaignManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
