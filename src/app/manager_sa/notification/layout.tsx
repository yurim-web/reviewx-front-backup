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
 *
 * 주요 기능:
 * - 페이지 메타데이터 설정 (제목, 설명)
 * - 공통 레이아웃 구조 제공
 *
 * 참고:
 * - 상위 /manager_sa/layout.tsx에서 이미 ManagerGAHeader와 SidebarMenuSA가 제공되지만,
 *   notification 페이지는 독립적으로 헤더와 사이드바를 관리합니다.
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | SA 관리자 알림",
  description: "SA 관리자 알림 내역을 확인하세요",
};

export default function ManagerSANotificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
