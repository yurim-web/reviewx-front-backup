/**
 * ChannelInfoSection 컴포넌트 스토리북
 *
 * 채널 정보 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import ChannelInfoSection from "./ChannelInfoSection";
import type { ChannelDetail } from "@/data/manager_ga/member/reviewers";

// Mock 채널 상세 정보 데이터
const mockChannelDetails: ChannelDetail[] = [
  {
    channel: "Blog",
    daily_visits: 1234,
    total_visits: 56789,
    neighbors: 890,
    is_connected: true,
  },
  {
    channel: "Instagram",
    followers: 12345,
    is_connected: true,
  },
  {
    channel: "Youtube",
    subscribers: 5678,
    is_connected: true,
  },
  {
    channel: "Clip",
    followers: 2345,
    is_connected: false,
  },
];

const meta: Meta<typeof ChannelInfoSection> = {
  title: "Manager/Common/Member/Reviewers/Section/ChannelInfoSection",
  component: ChannelInfoSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    channel_details: {
      description: "채널 상세 정보 배열",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChannelInfoSection>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderChannelInfoSection = (args: any) => {
  return <ChannelInfoSection {...args} />;
};

/**
 * 기본 채널 정보 섹션
 *
 * 리뷰어의 채널 정보를 표시하는 섹션입니다.
 */
export const Default: Story = {
  render: renderChannelInfoSection,
  args: {
    channel_details: mockChannelDetails,
  },
};

/**
 * 연결되지 않은 채널만 있는 경우
 *
 * 모든 채널이 연결되지 않은 상태를 표시합니다.
 */
export const AllDisconnected: Story = {
  render: renderChannelInfoSection,
  args: {
    channel_details: [
      {
        channel: "Blog",
        is_connected: false,
      },
      {
        channel: "Instagram",
        is_connected: false,
      },
    ],
  },
};

/**
 * 학습 포인트:
 *
 * 1. 채널 정보 섹션 컴포넌트
 *    - GA/SA 관리자 리뷰어 상세 페이지에서 채널 정보를 표시하는 섹션입니다
 *    - 리뷰어의 채널 목록과 각 채널의 통계 정보를 보여줍니다
 *
 * 2. 채널별 통계 정보
 *    - Blog: 일방문, 총방문, 이웃수
 *    - Clip: 팔로워
 *    - Instagram: 팔로워
 *    - Youtube: 구독자
 *
 * 3. 연결 상태 표시
 *    - is_connected가 true이면 통계 정보를 표시합니다
 *    - is_connected가 false이면 "연결 필요" 메시지를 표시합니다
 *
 * 4. 숫자 포맷팅
 *    - toLocaleString을 사용하여 천 단위 콤마로 포맷팅합니다
 */


