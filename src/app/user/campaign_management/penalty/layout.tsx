/* ========================================
   📊 패널티 페이지 레이아웃
   ======================================== */

/**
 * 패널티 페이지 레이아웃
 *
 * 목적: 유저의 패널티 페이지에 대한 공통 레이아웃을 제공하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/penalty (패널티 페이지)
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 패널티 내역",
  description: "유저의 패널티 현황과 내역을 확인하세요",
};

export default function PenaltyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
