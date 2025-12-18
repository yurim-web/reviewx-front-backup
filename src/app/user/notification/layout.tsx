/* ========================================
   🔔 유저 알림 레이아웃
   ======================================== */

/**
 * 유저 알림 레이아웃
 *
 * 목적: 유저 알림 페이지의 공통 레이아웃을 제공하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /user/notification
 *
 * 주요 기능:
 * - 페이지 메타데이터 설정 (제목, 설명)
 * - 공통 레이아웃 구조 제공
 */

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
