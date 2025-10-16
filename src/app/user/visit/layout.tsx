import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 방문형 캠페인",
  description: "방문형 리뷰 캠페인 목록",
};

export default function VisitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
