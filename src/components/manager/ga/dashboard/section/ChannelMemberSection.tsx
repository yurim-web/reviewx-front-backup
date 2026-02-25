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

export default function ChannelMemberSection() {
  return (
    <ChannelMemberSectionCommon
      title="채널별 회원 통계"
      chart={(channelData) => <ChannelMemberPieChart channelData={channelData} />}
    />
  );
}
