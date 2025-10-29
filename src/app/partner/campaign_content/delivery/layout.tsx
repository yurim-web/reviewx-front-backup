import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 배송형 캠페인 콘텐츠 내역",
  description: "배송형 캠페인 콘텐츠 내역 관리 페이지입니다",
};

export default function DeliveryCampaignContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
