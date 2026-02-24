/* ========================================
   포인트 출금 신청 레이아웃
   ======================================== */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 포인트 출금 신청",
  description: "포인트 출금 신청",
};

export default function WithdrawalRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
