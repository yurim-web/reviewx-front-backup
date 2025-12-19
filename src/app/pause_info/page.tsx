/* ========================================
   🚫 정지/탈퇴 안내 페이지
   ======================================== */

/**
 * 정지/탈퇴 안내 페이지
 *
 * 페이지 경로:
 * - /pause_info
 */

import type { Metadata } from "next";
import PauseInfoContent from "@/components/common/blocked/PauseInfoContent";

export const metadata: Metadata = {
  title: "ReviewX | 정지 · 탈퇴 안내",
};

export default function PauseInfoPage() {
  return <PauseInfoContent />;
}
