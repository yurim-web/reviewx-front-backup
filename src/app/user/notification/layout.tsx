/* ========================================
   유저 알림 레이아웃
   ======================================== */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 유저 알림",
  description: "알림 내역을 확인하세요",
};

export default function UserNotificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
