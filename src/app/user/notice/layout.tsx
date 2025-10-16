import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 공지사항",
  description: "공지사항을 확인하세요",
};

export default function NoticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


