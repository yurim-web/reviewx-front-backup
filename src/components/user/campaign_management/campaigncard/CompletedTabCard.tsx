/* ========================================
   📋 완료 탭 캠페인 카드 컴포넌트
   ======================================== */

/**
 * 완료 탭 캠페인 카드 컴포넌트
 *
 * 목적: "완료" 탭에 표시되는 캠페인 카드를 렌더링합니다.
 *
 * 주요 기능:
 * - 완료된 캠페인 정보 표시
 * - 완료 탭에서는 버튼이 표시되지 않습니다.

 */

import type { CampaignApplication } from "@/types/domain/user";
import CampaignCardBase from "./CampaignCardBase";

interface CompletedTabCardProps {
  campaign: CampaignApplication;
}

/**
 * 완료 탭 캠페인 카드
 *
 * 설명:
 * - 캠페인이 완료된 상태를 표시합니다.
 * - 완료 탭에서는 버튼 없이 캠페인 정보만 표시됩니다.
 */
export default function CompletedTabCard({ campaign }: CompletedTabCardProps) {
  // 상태 텍스트
  const statusText = "캠페인이 완료되었습니다.";

  return (
    <CampaignCardBase campaign={campaign} statusText={statusText}>
      {/* 완료 탭에서는 버튼이 없습니다 */}
      {null}
    </CampaignCardBase>
  );
}
