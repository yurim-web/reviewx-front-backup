import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 기자단 캠페인",
  description: "기자단 리뷰 캠페인 목록",
};

export default function ReporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


