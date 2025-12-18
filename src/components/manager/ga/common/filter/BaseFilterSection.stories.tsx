/**
 * BaseFilterSection 컴포넌트 스토리북
 *
 * 공통 필터 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import BaseFilterSection, { type FilterTag } from "./BaseFilterSection";

const meta: Meta<typeof BaseFilterSection> = {
  title: "Manager/GA/Common/Filter/BaseFilterSection",
  component: BaseFilterSection,
  tags: ["autodocs"],
  argTypes: {
    search_query: {
      description: "검색어",
      control: "text",
    },
    on_search_change: {
      description: "검색어 변경 핸들러",
      action: "search changed",
    },
    filter_modal_button: {
      description: "필터 모달 버튼 (선택적)",
      control: false,
    },
    active_filter_tags: {
      description: "활성 필터 태그들",
      control: "object",
    },
    on_filter_tag_remove: {
      description: "필터 태그 제거 핸들러",
      action: "filter tag removed",
    },
    date_filter: {
      description: "날짜 필터 (선택적)",
      control: false,
    },
    search_after_buttons: {
      description: "검색 필터 뒤에 올 버튼들 (선택적)",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof BaseFilterSection>;

/**
 * 기본 상태
 *
 * 검색 필드만 있는 기본 필터 섹션입니다.
 */
export const Default: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState("");
    return (
      <BaseFilterSection
        {...args}
        search_query={searchQuery}
        on_search_change={setSearchQuery}
      />
    );
  },
  args: {},
};

/**
 * 필터 모달 버튼이 있는 상태
 *
 * 필터 모달 버튼이 추가된 필터 섹션입니다.
 */
export const WithFilterModalButton: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState("");
    return (
      <BaseFilterSection
        {...args}
        search_query={searchQuery}
        on_search_change={setSearchQuery}
        filter_modal_button={
          <button style={{ padding: "8px 16px", marginRight: "8px" }}>
            필터
          </button>
        }
      />
    );
  },
  args: {},
};

/**
 * 활성 필터 태그가 있는 상태
 *
 * 선택된 필터가 태그로 표시되는 상태입니다.
 */
export const WithActiveFilterTags: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTags, setActiveTags] = useState<FilterTag<string>[]>([
      { value: "tag1", label: "태그 1" },
      { value: "tag2", label: "태그 2" },
    ]);

    return (
      <BaseFilterSection
        {...args}
        search_query={searchQuery}
        on_search_change={setSearchQuery}
        active_filter_tags={activeTags}
        on_filter_tag_remove={(value) => {
          setActiveTags(activeTags.filter((tag) => tag.value !== value));
          args.on_filter_tag_remove?.(value);
        }}
      />
    );
  },
  args: {},
};
