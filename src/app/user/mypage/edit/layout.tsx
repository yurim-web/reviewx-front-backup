/* ========================================
   마이페이지 내 정보 수정 레이아웃
   ======================================== */

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
