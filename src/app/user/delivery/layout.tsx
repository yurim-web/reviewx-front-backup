import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 배송형 캠페인 ",
  description: "배송형 리뷰 캠페인 목록",
};

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
