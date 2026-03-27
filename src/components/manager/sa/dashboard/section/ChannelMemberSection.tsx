/* ========================================
   📊 채널별 회원 통계 섹션 컴포넌트
   ======================================== */

/**
 * 채널별 회원 통계 섹션 컴포넌트
 *
 * 목적: 채널별 회원 등록 통계를 표시하는 섹션 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa (대시보드 페이지)
 */

import { useMemo } from "react";
import ChannelMemberSectionCommon from "@/components/manager/common/dashboard/ChannelMemberSection";
import ChannelMemberPieChart from "../chart/ChannelMemberPieChart";
import type { SAChannelMember } from "@/types/api/admin";

interface ChannelMemberSectionProps {
  apiData?: SAChannelMember | null;
}

export default function ChannelMemberSection({ apiData }: ChannelMemberSectionProps) {
  // SA API 데이터를 common 컴포넌트의 channelStatsData 형식으로 변환
  const channelStatsData = useMemo(() => {
    if (!apiData) return undefined;
    return {
      channels: [
        {
          channelName: "blog",
          memberCount: apiData.blog.count,
          percentage: apiData.blog.percentage,
        },
        {
          channelName: "instagram",
          memberCount: apiData.instagram.count,
          percentage: apiData.instagram.percentage,
        },
        {
          channelName: "clip",
          memberCount: apiData.clip.count,
          percentage: apiData.clip.percentage,
        },
        {
          channelName: "youtube",
          memberCount: apiData.youtube.count,
          percentage: apiData.youtube.percentage,
        },
      ],
    };
  }, [apiData]);

  return (
    <ChannelMemberSectionCommon
      title="채널별 회원 통계"
      chart={(channelData) => <ChannelMemberPieChart channelData={channelData} />}
      channelStatsData={channelStatsData}
    />
  );
}
