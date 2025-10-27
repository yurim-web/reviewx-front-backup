import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 새 캠페인 등록 - 구매평",
  description: "구매평 캠페인을 등록하고 관리하세요",
};

export default function ReviewCampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
