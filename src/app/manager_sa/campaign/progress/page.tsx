/* ========================================
   SA 관리자 진행 상황 페이지
   ======================================== */

/**
 * ProgressPage
 *
 * 목적: SA 관리자가 캠페인 진행 상황을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/campaign/progress
 */

"use client";

import ProgressPageCommon from "@/components/manager/common/campaign/progress/ProgressPageCommon";

export default function ProgressPage() {
  // 공통 페이지 컴포넌트를 사용합니다
  // manager_type='sa'를 전달하여 SA 관리자에 맞는 데이터와 스타일을 사용합니다
  return <ProgressPageCommon manager_type="sa" />;
}
