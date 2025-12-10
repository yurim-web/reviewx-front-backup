/**
 * createFilterModal 팩토리 함수 스토리북
 *
 * 필터 모달을 생성하는 팩토리 함수의 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import { createFilterModal } from "./createFilterModal";

// 채널 필터 모달 생성 예시
const ChannelFilterModal = createFilterModal({
  options: ["Blog", "Instagram", "Youtube", "NaverClip"] as const,
  section_title: "채널 선택",
  label_map: {
    Blog: "네이버블로그",
    Instagram: "인스타그램",
    Youtube: "유튜브",
    NaverClip: "네이버클립",
  },
});

// 상태 필터 모달 생성 예시
const StatusFilterModal = createFilterModal({
  options: ["정상", "경고", "일시정지", "정지"] as const,
  section_title: "상태 선택",
});

// 유형 필터 모달 생성 예시
const TypeFilterModal = createFilterModal({
  options: ["프로모즈", "서포터즈", "일반"] as const,
  section_title: "유형 선택",
});

const meta: Meta<typeof ChannelFilterModal> = {
  title: "Manager/Common/Campaign/Progress/Filter/createFilterModal",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChannelFilterModal>;

/**
 * 채널 필터 모달
 *
 * createFilterModal 팩토리 함수를 사용하여 채널 필터 모달을 생성한 예시입니다.
 */
export const ChannelFilter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

    const handleClose = useCallback(() => {
      setIsOpen(false);
    }, []);

    const handleApply = useCallback((values: string[]) => {
      setSelectedChannels(values);
      console.log("선택된 채널:", values);
    }, []);

    return (
      <div style={{ padding: "20px" }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#d90074",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          채널 필터 열기
        </button>
        <div style={{ marginBottom: "10px" }}>
          선택된 채널: {selectedChannels.join(", ") || "없음"}
        </div>
        <ChannelFilterModal
          is_open={isOpen}
          on_close={handleClose}
          selected_values={selectedChannels}
          on_apply={handleApply}
        />
      </div>
    );
  },
};

/**
 * 상태 필터 모달
 *
 * createFilterModal 팩토리 함수를 사용하여 상태 필터 모달을 생성한 예시입니다.
 */
export const StatusFilter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    const handleClose = useCallback(() => {
      setIsOpen(false);
    }, []);

    const handleApply = useCallback((values: string[]) => {
      setSelectedStatuses(values);
      console.log("선택된 상태:", values);
    }, []);

    return (
      <div style={{ padding: "20px" }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#d90074",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          상태 필터 열기
        </button>
        <div style={{ marginBottom: "10px" }}>
          선택된 상태: {selectedStatuses.join(", ") || "없음"}
        </div>
        <StatusFilterModal
          is_open={isOpen}
          on_close={handleClose}
          selected_values={selectedStatuses}
          on_apply={handleApply}
        />
      </div>
    );
  },
};

/**
 * 유형 필터 모달
 *
 * createFilterModal 팩토리 함수를 사용하여 유형 필터 모달을 생성한 예시입니다.
 */
export const TypeFilter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const handleClose = useCallback(() => {
      setIsOpen(false);
    }, []);

    const handleApply = useCallback((values: string[]) => {
      setSelectedTypes(values);
      console.log("선택된 유형:", values);
    }, []);

    return (
      <div style={{ padding: "20px" }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#d90074",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          유형 필터 열기
        </button>
        <div style={{ marginBottom: "10px" }}>
          선택된 유형: {selectedTypes.join(", ") || "없음"}
        </div>
        <TypeFilterModal
          is_open={isOpen}
          on_close={handleClose}
          selected_values={selectedTypes}
          on_apply={handleApply}
        />
      </div>
    );
  },
};

/**
 * 학습 포인트:
 *
 * 1. 팩토리 함수 패턴
 *    - createFilterModal은 동일한 패턴의 필터 모달을 쉽게 생성할 수 있게 해주는 팩토리 함수입니다
 *    - 각 필터 타입(채널, 상태, 유형)마다 별도의 컴포넌트를 만들 필요 없이 함수 호출로 생성할 수 있습니다
 *
 * 2. 제네릭 타입 사용
 *    - <T extends string>을 사용하여 타입 안정성을 보장합니다
 *    - 각 필터 모달은 특정 문자열 리터럴 타입을 사용합니다
 *
 * 3. 옵션과 라벨 매핑
 *    - options: 필터 옵션 배열
 *    - section_title: 모달에서 표시할 제목
 *    - label_map: value와 label을 다르게 표시할 때 사용 (선택사항)
 *
 * 4. BaseFilterModal 재사용
 *    - 내부적으로 BaseFilterModal 컴포넌트를 사용하여 일관된 UI를 제공합니다
 *    - 각 필터 모달은 동일한 구조와 동작을 가집니다
 */
