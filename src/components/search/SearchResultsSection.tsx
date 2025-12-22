"use client";

import { useState } from "react";

import CampaignBox from "@/components/main/CampaignBox";
import Titletext from "@/components/main/Titletext";
import home_styles from "@/styles/home/home.module.css";
import filter_styles from "@/styles/filter/filter_bar.module.css";
import SortModalFilter from "@/components/campaign/filter/SortModalFilter";

interface SearchResultsSectionProps {
  campaigns: any[];
}

const SORT_OPTIONS = ["최신순", "인기순", "마감임박순", "포인트높은순"];

const DEFAULT_SORT = "최신순";

// 남은 일수(D-값)를 정렬 가능한 숫자로 변환
const get_day_count_value = (day_count?: string): number => {
  if (!day_count) return Number.MAX_SAFE_INTEGER;

  // "긴급" 같은 특수 케이스는 가장 앞으로 오도록 0으로 처리
  if (day_count.includes("긴급")) return 0;

  const match = day_count.match(/D-(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }

  return Number.MAX_SAFE_INTEGER;
};

const sort_campaigns = (campaigns: any[], sort_by: string) => {
  const copied = [...campaigns];

  switch (sort_by) {
    case "인기순":
      // 지원자 수가 많은 순
      return copied.sort(
        (a, b) => (b.recruitment?.current ?? 0) - (a.recruitment?.current ?? 0)
      );
    case "마감임박순":
      // 남은 일수가 적은 순 (긴급 우선)
      return copied.sort(
        (a, b) =>
          get_day_count_value(a.dayCount) - get_day_count_value(b.dayCount)
      );
    case "포인트높은순":
      // 포인트가 높은 순
      return copied.sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
    case "최신순":
    default:
      // 목업 데이터에서는 기본 배열 순서를 최신순으로 가정
      return copied;
  }
};

export default function SearchResultsSection({
  campaigns,
}: SearchResultsSectionProps) {
  const [selected_sort, set_selected_sort] = useState<string>(DEFAULT_SORT);
  const [is_sort_modal_open, set_is_sort_modal_open] = useState(false);
  const [temp_sort, set_temp_sort] = useState<string>(DEFAULT_SORT);

  const sorted_campaigns = sort_campaigns(campaigns, selected_sort);
  const has_result = sorted_campaigns.length > 0;

  const handle_click_sort_button = () => {
    set_temp_sort(selected_sort);
    set_is_sort_modal_open(true);
  };

  const handle_close_sort_modal = () => {
    set_is_sort_modal_open(false);
  };

  const handle_change_sort_option = (
    option: string | { value: string; label: string }
  ) => {
    const sort_value = typeof option === "string" ? option : option.value;

    set_temp_sort(sort_value);
    set_selected_sort(sort_value);
    set_is_sort_modal_open(false);
  };

  return (
    <>
      <section
        className={`${home_styles.campaign_container} ${home_styles.search_campaign_container}`}
      >
        <div className={home_styles.search_header_row}>
          <Titletext main_title="검색 결과" />

          <button
            type="button"
            className={filter_styles.sort_button}
            onClick={handle_click_sort_button}
          >
            <span>{selected_sort}</span>
            <img
              src="/images/filter/dropdown_icon.svg"
              alt="정렬"
              className={filter_styles.dropdown_icon}
            />
          </button>
        </div>

        {has_result ? (
          <div className={home_styles.campaign_grid}>
            {sorted_campaigns.map((campaign) => (
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className={home_styles.empty_state}>
            <p className={home_styles.empty_text}>검색 결과가 없습니다.</p>
          </div>
        )}
      </section>

      <SortModalFilter
        isOpen={is_sort_modal_open}
        onClose={handle_close_sort_modal}
        title="정렬"
        options={SORT_OPTIONS}
        selectedValue={temp_sort}
        onOptionChange={handle_change_sort_option}
        defaultSort={DEFAULT_SORT}
      />
    </>
  );
}
