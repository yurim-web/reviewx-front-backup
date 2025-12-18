/* ========================================
   🔔 알림 페이지 레이아웃
   ======================================== */

/**
 * 알림 페이지 전용 레이아웃
 *
 * 목적: 알림 페이지에서 전역 main 태그의 max-width 제한을 제거하기 위한 레이아웃
 *
 * 주요 기능:
 * - 전역 main 태그 스타일 override
 * - 알림 페이지 전용 스타일 적용
 *
 * 참고사항:
 * - globals.css의 전역 main 태그에 max-width: 1000px가 적용되어 있음
 * - 알림 페이지는 전체 너비를 사용하되, 내부 콘텐츠만 max-width: 1000px로 제한
 */

import { Metadata } from "next";
// 알림 페이지 전용 전역 스타일 (전역 main 태그 스타일 override)
import "@/styles/user/notification/notification_global.css";

// 알림 페이지 메타데이터
export const metadata: Metadata = {
  title: "ReviewX | 알림",
  description: "알림을 확인하세요",
};

/**
 * 알림 페이지 레이아웃 컴포넌트
 *
 * @param children - 알림 페이지 컴포넌트
 */
export default function NotificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
