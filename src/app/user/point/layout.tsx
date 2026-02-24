/* ========================================
   포인트 레이아웃
   ======================================== */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 포인트 관리",
  description: "포인트 관리",
};

export default function PointLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
