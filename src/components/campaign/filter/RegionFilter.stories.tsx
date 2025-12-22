/**
 * RegionFilter 컴포넌트 스토리북
 *
 * 지역 필터 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import RegionFilter from "./RegionFilter";

const meta: Meta<typeof RegionFilter> = {
  title: "Campaign/Filter/RegionFilter",
  component: RegionFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isOpen: {
      description: "모달 열림 여부",
      control: "boolean",
    },
    onClose: {
      description: "모달 닫기 핸들러",
      action: "closed",
    },
    title: {
      description: "모달 제목",
      control: "text",
    },
    selectedRegions: {
      description: "선택된 지역 목록",
      control: "object",
    },
    onRegionChange: {
      description: "지역 변경 핸들러",
      action: "region changed",
    },
    onApply: {
      description: "필터 적용 핸들러",
      action: "applied",
    },
    onReset: {
      description: "필터 초기화 핸들러",
      action: "reset",
    },
  },
};

export default meta;

type Story = StoryObj<typeof RegionFilter>;

/**
 * 기본 지역 필터
 *
 * 계층적 지역 구조를 지원하는 지역 필터입니다.
 */
export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen || true);
    const [selectedRegions, setSelectedRegions] = useState<string[]>(
      args.selectedRegions || []
    );

    return React.createElement(RegionFilter, {
      ...args,
      isOpen,
      onClose: () => {
        setIsOpen(false);
        args.onClose?.();
      },
      selectedRegions,
      onRegionChange: (regions) => {
        setSelectedRegions(regions);
        args.onRegionChange?.(regions);
      },
      onApply: (regions) => {
        args.onApply?.(regions);
      },
      onReset: () => {
        setSelectedRegions([]);
        args.onReset?.();
      },
    });
  },
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    title: "지역",
    selectedRegions: [],
  },
};

/**
 * 선택된 지역이 있는 경우
 *
 * 이미 선택된 지역이 있는 지역 필터입니다.
 */
export const WithSelectedRegions: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen || true);
    const [selectedRegions, setSelectedRegions] = useState<string[]>(
      args.selectedRegions || []
    );

    return React.createElement(RegionFilter, {
      ...args,
      isOpen,
      onClose: () => {
        setIsOpen(false);
        args.onClose?.();
      },
      selectedRegions,
      onRegionChange: (regions) => {
        setSelectedRegions(regions);
        args.onRegionChange?.(regions);
      },
      onApply: (regions) => {
        args.onApply?.(regions);
      },
      onReset: () => {
        setSelectedRegions([]);
        args.onReset?.();
      },
    });
  },
  args: {
    isOpen: true,
    onClose: () => console.log("Modal closed"),
    title: "지역",
    selectedRegions: ["서울 > 강북구", "서울 > 서초구", "경기 > 수원시"],
  },
};

/**
 * 학습 포인트:
 *
 * 1. 계층적 지역 구조
 *    - 시/도 > 세부 지역의 계층적 구조를 지원합니다
 *    - 메인 지역 탭 전환 기능이 있습니다
 *
 * 2. 지역별 선택 개수 표시
 *    - 각 메인 지역별로 선택된 세부 지역 개수를 표시합니다
 *    - 예: "서울 (2)" - 서울에서 2개 지역 선택됨
 *
 * 3. 전체 선택/해제 기능
 *    - 메인 지역별로 전체 선택/해제가 가능합니다
 *    - "전체" 탭에서 모든 지역을 한 번에 선택/해제할 수 있습니다
 *
 * 4. 복잡한 상태 관리
 *    - useState와 useEffect를 사용하여 지역 선택 상태를 관리합니다
 *    - 메인 지역 탭 전환 시 세부 지역 목록이 변경됩니다
 */

