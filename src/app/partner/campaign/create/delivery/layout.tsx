import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 새 캠페인 등록 - 배송형",
  description: "배송형 캠페인을 등록하고 관리하세요",
};

export default function DeliveryCampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
