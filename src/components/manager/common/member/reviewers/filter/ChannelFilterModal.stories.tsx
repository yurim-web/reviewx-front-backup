/**
 * ChannelFilterModal 컴포넌트 스토리북 (리뷰어)
 *
 * 리뷰어 채널 필터 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback, useEffect } from "react";
import ChannelFilterModal from "./ChannelFilterModal";
import type { Channel } from "@/data/manager_ga/member/reviewers";

// 안정적인 래퍼 컴포넌트 (깜빡임 방지)
const ChannelFilterModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(
    args.selected_channels || []
  );

  // args가 변경될 때 selectedChannels 업데이트
  useEffect(() => {
    if (args.selected_channels !== undefined) {
      setSelectedChannels(args.selected_channels);
    }
  }, [args.selected_channels]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleApply = useCallback(
    (channels: Channel[]) => {
      setSelectedChannels(channels);
      args.on_apply?.(channels);
    },
    [args]
  );

  return (
    <ChannelFilterModal
      {...args}
      is_open={isOpen}
      on_close={handleClose}
      selected_channels={selectedChannels}
      on_apply={handleApply}
    />
  );
};

const meta: Meta<typeof ChannelFilterModal> = {
  title: "Manager/Common/Member/Reviewers/Filter/ChannelFilterModal",
  component: ChannelFilterModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
  },
  argTypes: {
    is_open: {
      description: "모달 열림/닫힘 상태",
      control: "boolean",
    },
    on_close: {
      description: "모달 닫기 함수",
      action: "modal closed",
    },
    selected_channels: {
      description: "현재 선택된 채널들",
      control: "object",
    },
    on_apply: {
      description: "필터 적용 함수",
      action: "filter applied",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChannelFilterModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 리뷰어 채널 필터를 선택할 수 있는 모달입니다.
 */
export const Default: Story = {
  render: ChannelFilterModalWrapper,
  args: {
    selected_channels: [],
    on_apply: (channels) => console.log("Channels applied:", channels),
  },
};

/**
 * 선택된 채널이 있는 상태
 *
 * 이미 채널이 선택된 상태의 모달입니다.
 */
export const WithSelectedChannels: Story = {
  render: ChannelFilterModalWrapper,
  args: {
    selected_channels: ["Blog", "Instagram"],
    on_apply: (channels) => console.log("Channels applied:", channels),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 리뷰어 채널 필터 모달 컴포넌트
 *    - 리뷰어 목록 페이지에서 채널을 필터링하는 모달입니다
 *    - 체크박스 방식의 다중 선택 필터링을 제공합니다
 *
 * 2. 채널 옵션
 *    - Blog: 네이버 블로그
 *    - Clip: 네이버 클립
 *    - Instagram: 인스타그램
 *    - Youtube: 유튜브
 *    - Store: 네이버 스토어
 *
 * 3. BaseFilterModal 사용
 *    - 공통 BaseFilterModal 컴포넌트를 사용합니다
 *    - 일관된 UI와 동작을 제공합니다
 */


