/**
 * TypeFilterModal 컴포넌트 스토리북
 *
 * 유형 필터 모달 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback, useEffect } from "react";
import TypeFilterModal, { type PartnerType } from "./TypeFilterModal";

// 안정적인 래퍼 컴포넌트 (깜빡임 방지)
const TypeFilterModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<PartnerType[]>(args.selected_types || []);

  // args가 변경될 때 selectedTypes 업데이트
  useEffect(() => {
    if (args.selected_types !== undefined) {
      setSelectedTypes(args.selected_types);
    }
  }, [args.selected_types]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleApply = useCallback(
    (types: PartnerType[]) => {
      setSelectedTypes(types);
      args.on_apply?.(types);
    },
    [args]
  );

  return (
    <TypeFilterModal
      {...args}
      is_open={isOpen}
      on_close={handleClose}
      selected_types={selectedTypes}
      on_apply={handleApply}
    />
  );
};

const meta: Meta<typeof TypeFilterModal> = {
  title: "Manager/Common/Member/Partners/Filter/TypeFilterModal",
  component: TypeFilterModal,
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
    selected_types: {
      description: "현재 선택된 유형들",
      control: "object",
    },
    on_apply: {
      description: "필터 적용 함수",
      action: "filter applied",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TypeFilterModal>;

/**
 * 기본 모달 (열림 상태)
 *
 * 유형 필터를 선택할 수 있는 모달입니다.
 */
export const Default: Story = {
  render: TypeFilterModalWrapper,
  args: {
    selected_types: [],
    on_apply: (types) => console.log("Types applied:", types),
  },
};

/**
 * 선택된 유형이 있는 상태
 *
 * 이미 유형이 선택된 상태의 모달입니다.
 */
export const WithSelectedTypes: Story = {
  render: TypeFilterModalWrapper,
  args: {
    selected_types: ["일반 회원"],
    on_apply: (types) => console.log("Types applied:", types),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 유형 필터 모달 컴포넌트
 *    - 파트너 목록 페이지에서 유형을 필터링하는 모달입니다
 *    - 체크박스 방식의 다중 선택 필터링을 제공합니다
 *
 * 2. 유형 옵션
 *    - 프로모즈: 프로모즈 파트너
 *    - 일반: 일반 파트너
 *    - 인플루언서: 인플루언서 파트너
 *
 * 3. BaseFilterModal 사용
 *    - 공통 BaseFilterModal 컴포넌트를 사용합니다
 *    - 일관된 UI와 동작을 제공합니다
 */
