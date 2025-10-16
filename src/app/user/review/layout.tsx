import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 구매평 캠페인",
  description: "구매평 리뷰 캠페인 목록",
};

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
