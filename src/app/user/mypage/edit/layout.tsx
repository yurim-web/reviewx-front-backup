// 내정보 수정 페이지 레이아웃 (메인 헤더 제외)

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 내 정보 수정",
  description: "내정보를 수정하세요",
};

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
