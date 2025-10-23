// 내정보 수정 페이지 레이아웃 (메인 헤더 제외)

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 내 정보 수정",
  description: "파트너 내정보를 수정하세요",
};

export default function PartnerEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
