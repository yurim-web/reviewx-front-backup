import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 새 캠페인 등록 - 미션형",
  description: "미션형 캠페인을 등록하고 관리하세요",
};

export default function MissionCampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
