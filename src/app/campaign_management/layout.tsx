import { Metadata } from "next";

export const metadata: Metadata = {
  title: "캠페인 관리 - ReviewX",
  description: "신청한 캠페인을 관리하고 상태를 확인하세요",
};

export default function CampaignManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
