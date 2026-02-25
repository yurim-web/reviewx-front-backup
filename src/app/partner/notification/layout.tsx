/* ========================================
   🔔 파트너 알림 레이아웃
   ======================================== */

/**
 * 파트너 알림 레이아웃
 *
 * 목적: 파트너 알림 페이지의 공통 레이아웃을 제공하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /partner/notification
 *
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 알림",
  description: "파트너 알림 내역을 확인하세요",
};

export default function PartnerNotificationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
