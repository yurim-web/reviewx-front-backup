/* ========================================
   
   ======================================== */

/**
 * 채널별 회원 통계 섹션 컴포넌트
 *
 * 목적: 채널별 회원 등록 통계를 표시하는 섹션 컴포넌트입니다.
 *
 */

import ChannelMemberSectionCommon from "@/components/manager/common/dashboard/ChannelMemberSection";
import ChannelMemberPieChart from "../chart/ChannelMemberPieChart";
import type { AdminDashboardResponse } from "@/types/api/admin";

interface ChannelMemberSectionProps {
  dashboardData?: AdminDashboardResponse | null;
}

export default function ChannelMemberSection({ dashboardData }: ChannelMemberSectionProps) {
  return (
    <ChannelMemberSectionCommon
      title="채널별 회원 통계"
      chart={(channelData) => <ChannelMemberPieChart channelData={channelData} />}
      dashboardData={dashboardData}
    />
  );
}
