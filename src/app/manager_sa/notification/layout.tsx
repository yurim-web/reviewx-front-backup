/* ========================================
   🔔 SA 관리자 알림 레이아웃
   ======================================== */

/**
 * SA 관리자 알림 레이아웃
 *
 * 목적: SA 관리자 알림 페이지의 공통 레이아웃을 제공하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa/notification
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | SA 관리자 알림",
  description: "SA 관리자 알림 내역을 확인하세요",
};

export default function ManagerSANotificationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
