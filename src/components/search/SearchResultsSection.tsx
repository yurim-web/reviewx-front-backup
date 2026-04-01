"use client";

import { useState, useEffect } from "react";

import CampaignBox from "@/components/main/CampaignBox";
import Titletext from "@/components/main/Titletext";
import home_styles from "@/styles/home/home.module.css";
import mainStyles from "@/styles/filter/filter_bar/main.module.css";
import SortModalFilter from "@/components/campaign/filter/SortModalFilter";
import { apiClient } from "@/lib/api/client";
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";

interface SearchApiItem {
  campaignId: number;
  title: string;
  recruitLimit: number;
  campaignApplicationCount: number;
  imageUrl: string;
  categoryId: number;
  channelId: number;
  recruit?: {
    recruitLimit: number;
    recruitStartAt: string;
    recruitEndAt: string;
  };
}

interface SearchApiResponse {
  result: string;
  generatedAt: string;
  items: SearchApiItem[];
}

interface SearchCampaign {
  id: string;
  title: string;
  category: string;
  channel?: string;
  image: string;
  dayCount?: string;
  isUrgent?: boolean;
  points?: number;
  recruitment: {
    current: number;
    total: number;
  };
  schedule?: string;
  detailedSchedule?: {
    applicationStart: string;
    applicationEnd: string;
    announcement?: string;
    purchasePeriod?: string;
    registrationPeriod?: string;
  };
}

function adaptApiItem(item: SearchApiItem): SearchCampaign {
  return {
    id: String(item.campaignId),
    title: item.title,
    category: "캠페인",
    image: item.imageUrl,
    recruitment: {
      current: item.campaignApplicationCount,
      total: item.recruitLimit,
    },
    isUrgent: false,
    detailedSchedule: item.recruit?.recruitStartAt
      ? {
          applicationStart: item.recruit.recruitStartAt,
          applicationEnd: item.recruit.recruitEndAt,
        }
      : undefined,
  };
}

function getStaticFallback(keyword: string): SearchCampaign[] {
  const normalized = keyword.toLowerCase();
  const all = [
    ...deliveryCampaigns,
    ...reviewCampaigns,
    ...visitCampaigns,
    ...missionCampaigns,
    ...reporterCampaigns,
  ];
  if (!keyword) return all as SearchCampaign[];
  return all.filter((campaign) => {
    const title = campaign.title?.toLowerCase() ?? "";
    const description = (campaign as { description?: string }).description?.toLowerCase() ?? "";
    return title.includes(normalized) || description.includes(normalized);
  }) as SearchCampaign[];
}

interface SearchResultsSectionProps {
  keyword?: string;
  campaigns?: SearchCampaign[];
  totalCount?: number;
}

const SORT_OPTIONS = ["최신순", "인기순", "마감임박순", "포인트높은순"];

const DEFAULT_SORT = "최신순";

// 마감까지 남은 일수를 정렬 가능한 숫자로 변환
const get_remaining_days = (campaign: SearchCampaign): number => {
  if (campaign.isUrgent) return 0;

  if (campaign.detailedSchedule?.applicationEnd) {
    const end = new Date(campaign.detailedSchedule.applicationEnd);
    end.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff < 0 ? -1 : diff;
  }

  return Number.MAX_SAFE_INTEGER;
};

const sort_campaigns = (campaigns: SearchCampaign[], sort_by: string) => {
  const copied = [...campaigns];

  switch (sort_by) {
    case "인기순":
      // 지원자 수가 많은 순
      return copied.sort((a, b) => (b.recruitment?.current ?? 0) - (a.recruitment?.current ?? 0));
    case "마감임박순":
      // 남은 일수가 적은 순 (긴급 우선)
      return copied.sort((a, b) => get_remaining_days(a) - get_remaining_days(b));
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
  keyword = "",
  campaigns: externalCampaigns,
  totalCount: _totalCount,
}: SearchResultsSectionProps) {
  const [selected_sort, set_selected_sort] = useState<string>(DEFAULT_SORT);
  const [is_sort_modal_open, set_is_sort_modal_open] = useState(false);
  const [temp_sort, set_temp_sort] = useState<string>(DEFAULT_SORT);
  const [campaigns, set_campaigns] = useState<SearchCampaign[]>(externalCampaigns ?? []);
  const [is_loading, set_is_loading] = useState(!externalCampaigns);

  // externalCampaigns가 변경되면 반영
  useEffect(() => {
    if (externalCampaigns) {
      set_campaigns(externalCampaigns);
      set_is_loading(false);
    }
  }, [externalCampaigns]);

  // R-21: GET /search?keyword={keyword}
  // externalCampaigns가 없을 때만 리뷰어 검색 API 호출
  useEffect(() => {
    if (externalCampaigns) return;

    let cancelled = false;
    set_is_loading(true);

    const params = keyword ? { keyword } : {};
    apiClient
      .get<SearchApiResponse>("/search", { params })
      .then((res) => {
        if (cancelled) return;
        const items = res.data.items ?? [];
        set_campaigns(items.map(adaptApiItem));
      })
      .catch(() => {
        if (cancelled) return;
        set_campaigns(getStaticFallback(keyword));
      })
      .finally(() => {
        if (!cancelled) set_is_loading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [keyword, externalCampaigns]);

  const sorted_campaigns = sort_campaigns(campaigns, selected_sort);
  const has_result = sorted_campaigns.length > 0;

  const handle_click_sort_button = () => {
    set_temp_sort(selected_sort);
    set_is_sort_modal_open(true);
  };

  const handle_close_sort_modal = () => {
    set_is_sort_modal_open(false);
  };

  const handle_change_sort_option = (option: string | { value: string; label: string }) => {
    const sort_value = typeof option === "string" ? option : option.value;

    set_temp_sort(sort_value);
    set_selected_sort(sort_value);
    set_is_sort_modal_open(false);
  };

  if (is_loading) {
    return (
      <section
        className={`${home_styles.campaign_container} ${home_styles.search_campaign_container}`}
      >
        <div className={home_styles.search_header_row}>
          <Titletext main_title="검색 결과" />
        </div>
        <div className={home_styles.empty_state}>
          <p className={home_styles.empty_text}>검색 중...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        className={`${home_styles.campaign_container} ${home_styles.search_campaign_container}`}
      >
        <div className={home_styles.search_header_row}>
          <Titletext main_title="검색 결과" />

          <button
            type="button"
            className={mainStyles.sort_button}
            onClick={handle_click_sort_button}
          >
            <span>{selected_sort}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/filter/dropdown_icon.svg"
              alt="정렬"
              className={mainStyles.dropdown_icon}
            />
          </button>
        </div>

        {has_result ? (
          <div className={home_styles.campaign_grid}>
            {sorted_campaigns.map((campaign) => (
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : keyword ? (
          <div className={home_styles.empty_state}>
            <p className={home_styles.empty_text}>검색 결과가 없습니다.</p>
          </div>
        ) : null}
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
