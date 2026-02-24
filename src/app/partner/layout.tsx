/* ========================================
   파트너 루트 레이아웃
   ======================================== */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 캠페인 관리",
  description: "파트너 캠페인 관리 플랫폼입니다",
};

/**
 * 파트너 레이아웃 컴포넌트
 *
 * 설명:
 * - 루트 레이아웃의 ConditionalHeader가 파트너 경로를 감지하여
 *   자동으로 파트너 헤더를 표시하므로 여기서는 헤더를 렌더링하지 않습니다.
 * - 포인트 충전 페이지 등의 특수 케이스는 ConditionalPartnerHeader에서 처리합니다.
 */
export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
