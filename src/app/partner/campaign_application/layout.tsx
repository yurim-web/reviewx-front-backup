import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 캠페인 신청내역",
  description: "파트너 캠페인 신청내역 관리 페이지입니다",
};

export default function CampaignApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
