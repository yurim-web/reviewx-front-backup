import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "체험형 캠페인 - ReviewX",
  description: "체험형 리뷰 캠페인 목록",
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
