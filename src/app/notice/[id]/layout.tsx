import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 공지사항 상세",
  description: "공지사항 상세 내용을 확인하세요.",
};

export default function NoticeDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
