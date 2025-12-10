/**
 * CustomDropdown 컴포넌트 스토리북
 *
 * 커스텀 드롭다운 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { CustomDropdown } from "./CustomDropdown";

const meta: Meta<typeof CustomDropdown> = {
  title: "Partner/CampaignCreateForm/Common/CustomDropdown",
  component: CustomDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    value: {
      description: "현재 선택된 값",
      control: "text",
    },
    options: {
      description: "드롭다운 옵션 목록",
      control: "object",
    },
    onChange: {
      description: "옵션 변경 핸들러",
      action: "value changed",
    },
    placeholder: {
      description: "플레이스홀더 텍스트",
      control: "text",
    },
    disabled: {
      description: "드롭다운 비활성화 여부",
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CustomDropdown>;

/**
 * 기본 드롭다운
 *
 * 옵션을 선택할 수 있는 기본 드롭다운입니다.
 */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || "");

    return React.createElement(CustomDropdown, {
      ...args,
      value,
      onChange: (newValue) => {
        setValue(newValue);
        args.onChange?.(newValue);
      },
    });
  },
  args: {
    value: "",
    options: ["옵션 1", "옵션 2", "옵션 3", "옵션 4", "옵션 5"],
    onChange: (value) => console.log("Value changed:", value),
    placeholder: "선택하세요",
    disabled: false,
  },
};

/**
 * 선택된 값이 있는 경우
 *
 * 이미 선택된 값이 있는 드롭다운입니다.
 */
export const WithValue: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || "");

    return React.createElement(CustomDropdown, {
      ...args,
      value,
      onChange: (newValue) => {
        setValue(newValue);
        args.onChange?.(newValue);
      },
    });
  },
  args: {
    value: "옵션 2",
    options: ["옵션 1", "옵션 2", "옵션 3", "옵션 4", "옵션 5"],
    onChange: (value) => console.log("Value changed:", value),
    placeholder: "선택하세요",
    disabled: false,
  },
};

/**
 * 비활성화 상태
 *
 * 비활성화된 드롭다운입니다.
 */
export const Disabled: Story = {
  render: (args) => {
    return React.createElement(CustomDropdown, args);
  },
  args: {
    value: "옵션 2",
    options: ["옵션 1", "옵션 2", "옵션 3", "옵션 4", "옵션 5"],
    onChange: (value) => console.log("Value changed:", value),
    placeholder: "선택하세요",
    disabled: true,
  },
};

/**
 * 학습 포인트:
 *
 * 1. 커스텀 드롭다운 컴포넌트
 *    - Figma 디자인에 맞는 커스텀 드롭다운 UI를 제공합니다
 *    - 네이티브 select 태그 대신 커스텀 UI를 구현합니다
 *
 * 2. 상태 관리
 *    - useState로 드롭다운 열림/닫힘 상태를 관리합니다
 *    - useRef로 DOM 요소에 직접 접근합니다
 *    - useEffect로 외부 클릭을 감지합니다
 *
 * 3. 스마트 위치 조정
 *    - 화면 하단에 공간이 부족하면 위쪽으로 열립니다
 *    - getBoundingClientRect()로 요소 위치를 계산합니다
 *
 * 4. 접근성
 *    - aria-expanded, aria-haspopup 등 접근성 속성을 제공합니다
 *    - 키보드 네비게이션을 지원합니다
 */

