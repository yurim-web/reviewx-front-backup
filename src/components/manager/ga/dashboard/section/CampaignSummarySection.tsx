/* ========================================
   캠페인 현황 요약 섹션
   ======================================== */

/**
 * 캠페인 관리 요약 섹션 컴포넌트
 *
 * 목적: 캠페인 관리 요약 통계를 표시하는 섹션 컴포넌트입니다.
 *
 */

"use client";

import { useMemo, useState, useEffect } from "react";
import styles from "@/styles/manager_ga/dashboard/sections/campaign_summary_section.module.css";
import StatCard, { StatCardData } from "../StatCard";
import { get_campaign_list } from "@/data/manager_ga/progress";
import { get_rejected_campaign_list } from "@/data/manager_ga/rejected";
import { get_reported_campaign_list } from "@/data/manager_ga/reported";
import type { DateRange } from "./DateRangePickerModal";
import { differenceInDays, subDays } from "date-fns";
import { isDateInRange } from "@/utils/formatting/date";

// CampaignSummarySection 컴포넌트의 props 타입 정의
interface CampaignSummarySectionProps {
  // 날짜 범위 (필터에 따라 변경됨)
  dateRange: DateRange;
}

export default function CampaignSummarySection({ dateRange }: CampaignSummarySectionProps) {
  // 데이터 로드
  const [campaign_list, set_campaign_list] = useState<ReturnType<typeof get_campaign_list>>([]);
  const [rejected_list, set_rejected_list] = useState<
    ReturnType<typeof get_rejected_campaign_list>
  >([]);
  const [reported_list, set_reported_list] = useState<
    ReturnType<typeof get_reported_campaign_list>
  >([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        set_campaign_list(get_campaign_list());
        set_rejected_list(get_rejected_campaign_list());
        set_reported_list(get_reported_campaign_list());
      } catch (_error) {
        // 데이터 로드 실패 시 빈 목록 유지
      }
    }
  }, []);

  // 증감률 계산 함수
  const calculate_change_percentage = (
    current: number,
    previous: number
  ): { change: string; changeType: "positive" | "negative" | "neutral" } => {
    if (previous === 0) {
      if (current === 0) {
        return { change: "0%", changeType: "neutral" };
      }
      return { change: "100%", changeType: "positive" };
    }

    const percentage = Math.round(((current - previous) / previous) * 100);

    if (percentage > 0) {
      return { change: `${percentage}%`, changeType: "positive" };
    } else if (percentage < 0) {
      return { change: `${Math.abs(percentage)}%`, changeType: "negative" };
    } else {
      return { change: "0%", changeType: "neutral" };
    }
  };

  // 날짜 범위에 따라 통계 계산
  const stats = useMemo<StatCardData[]>(() => {
    if (!dateRange.from || !dateRange.to) {
      return [
        {
          title: "총 모집률",
          value: "0%",
          change: "- 0%",
          changeType: "neutral",
          progress: 0,
        },
        {
          title: "콘텐츠 완료율",
          value: "0%",
          change: "- 0%",
          changeType: "neutral",
          progress: 0,
        },
        {
          title: "콘텐츠 반려율",
          value: "0%",
          change: "- 0%",
          changeType: "neutral",
          progress: 0,
          progressColor: "red",
        },
        {
          title: "신고 접수율",
          value: "0%",
          change: "- 0%",
          changeType: "neutral",
          progress: 0,
          progressColor: "red",
        },
      ];
    }

    // 날짜 범위 설정
    const start_date = new Date(dateRange.from);
    start_date.setHours(0, 0, 0, 0);
    const end_date = new Date(dateRange.to);
    end_date.setHours(23, 59, 59, 999);

    // 전월 대비 증감 계산을 위한 이전 기간 계산
    const period_days = differenceInDays(end_date, start_date) + 1;
    const previous_start_date = subDays(start_date, period_days);
    const previous_end_date = subDays(start_date, 1);
    previous_start_date.setHours(0, 0, 0, 0);
    previous_end_date.setHours(23, 59, 59, 999);

    // 날짜 필터링된 모든 캠페인 (여러 통계에서 공통 사용)
    const all_filtered_campaigns = campaign_list.filter((campaign) => {
      if (!campaign.created_at) return false;
      const campaign_date = new Date(campaign.created_at);
      return campaign_date >= start_date && campaign_date <= end_date;
    });

    // 이전 기간의 모든 캠페인 (여러 통계에서 공통 사용)
    const previous_all_campaigns = campaign_list.filter((campaign) => {
      if (!campaign.created_at) return false;
      const campaign_date = new Date(campaign.created_at);
      return campaign_date >= previous_start_date && campaign_date <= previous_end_date;
    });

    // 1. 캠페인 모집률: (Σ(각 캠페인의 모집 완료 인원 ÷ 각 캠페인의 모집 목표 인원) ÷ 캠페인 수) × 100
    // 설정된 기간 동안 존재하는 각 캠페인의 모집률을 기준으로, 캠페인별 모집률의 평균값을 산출

    // 각 캠페인별 모집률 계산 후 평균 (최대 100%로 제한)
    const campaign_recruitment_rates = all_filtered_campaigns
      .map((campaign) => {
        if (campaign.recruit_count === 0) return 0;
        const rate = (campaign.apply_count / campaign.recruit_count) * 100;
        return Math.min(rate, 100); // 각 캠페인별 모집률도 최대 100%로 제한
      })
      .filter((rate) => !isNaN(rate) && isFinite(rate));

    const recruitment_rate_raw =
      campaign_recruitment_rates.length > 0
        ? campaign_recruitment_rates.reduce((sum, rate) => sum + rate, 0) /
          campaign_recruitment_rates.length
        : 0;
    const recruitment_rate = Math.min(Math.round(recruitment_rate_raw), 100);

    // 이전 기간 계산
    const previous_campaign_recruitment_rates = previous_all_campaigns
      .map((campaign) => {
        if (campaign.recruit_count === 0) return 0;
        const rate = (campaign.apply_count / campaign.recruit_count) * 100;
        return Math.min(rate, 100); // 각 캠페인별 모집률도 최대 100%로 제한
      })
      .filter((rate) => !isNaN(rate) && isFinite(rate));

    const previous_recruitment_rate_raw =
      previous_campaign_recruitment_rates.length > 0
        ? previous_campaign_recruitment_rates.reduce((sum, rate) => sum + rate, 0) /
          previous_campaign_recruitment_rates.length
        : 0;
    const previous_recruitment_rate = Math.min(Math.round(previous_recruitment_rate_raw), 100);
    const recruitment_change = calculate_change_percentage(
      recruitment_rate,
      previous_recruitment_rate
    );

    // 2. 캠페인 달성률: 전체 완료 캠페인 수 / 결과 확정 캠페인 수 × 100
    // 전체 완료 캠페인 = 100% 모든 인원 완료 → 전체 완료, 1명이라도 미완료 → 미완료
    // 결과 확정 캠페인 = 종료된 캠페인
    const ended_campaigns = all_filtered_campaigns.filter((campaign) => campaign.status === "종료");

    // 전체 완료 캠페인: apply_count === recruit_count (100% 모든 인원 완료)
    const fully_completed_campaigns = ended_campaigns.filter(
      (campaign) => campaign.apply_count === campaign.recruit_count && campaign.recruit_count > 0
    );

    const completion_rate_raw =
      ended_campaigns.length > 0
        ? (fully_completed_campaigns.length / ended_campaigns.length) * 100
        : 0;
    const completion_rate = Math.min(Math.round(completion_rate_raw), 100);

    // 이전 기간 계산
    const previous_ended_campaigns = previous_all_campaigns.filter(
      (campaign) => campaign.status === "종료"
    );

    const previous_fully_completed_campaigns = previous_ended_campaigns.filter(
      (campaign) => campaign.apply_count === campaign.recruit_count && campaign.recruit_count > 0
    );

    const previous_completion_rate_raw =
      previous_ended_campaigns.length > 0
        ? (previous_fully_completed_campaigns.length / previous_ended_campaigns.length) * 100
        : 0;
    const previous_completion_rate = Math.min(Math.round(previous_completion_rate_raw), 100);
    const completion_change = calculate_change_percentage(
      completion_rate,
      previous_completion_rate
    );

    // 3. 콘텐츠 반려 비율
    const filtered_rejected = rejected_list.filter((item) =>
      isDateInRange(item.processed_date, start_date, end_date)
    );
    const total_rejected = filtered_rejected.reduce((sum, item) => sum + item.reject_count, 0);
    // 전체 콘텐츠 수는 모든 캠페인(진행 중, 종료 등)의 신청 수 합계
    const total_contents = all_filtered_campaigns.reduce(
      (sum, campaign) => sum + campaign.apply_count,
      0
    );
    // 반려율 계산: 반려된 콘텐츠 수 / 전체 콘텐츠 수 (최대 100%)
    // total_contents가 0이거나 total_rejected가 total_contents보다 크면 100%로 제한
    const rejection_rate_raw =
      total_contents > 0 && total_rejected <= total_contents
        ? (total_rejected / total_contents) * 100
        : total_contents > 0 && total_rejected > total_contents
          ? 100
          : 0;
    const rejection_rate = Math.min(Math.round(rejection_rate_raw), 100);

    const previous_rejected = rejected_list.filter((item) =>
      isDateInRange(item.processed_date, previous_start_date, previous_end_date)
    );
    const previous_total_rejected = previous_rejected.reduce(
      (sum, item) => sum + item.reject_count,
      0
    );
    const previous_total_contents = previous_all_campaigns.reduce(
      (sum, campaign) => sum + campaign.apply_count,
      0
    );
    const previous_rejection_rate_raw =
      previous_total_contents > 0 && previous_total_rejected <= previous_total_contents
        ? (previous_total_rejected / previous_total_contents) * 100
        : previous_total_contents > 0 && previous_total_rejected > previous_total_contents
          ? 100
          : 0;
    const previous_rejection_rate = Math.min(Math.round(previous_rejection_rate_raw), 100);
    const rejection_change = calculate_change_percentage(rejection_rate, previous_rejection_rate);

    // 4. 신고 접수율: 신고가 1건 이상 발생한 캠페인 수 / 해당 기간 노출된 캠페인 수 × 100
    const filtered_reported = reported_list.filter((item) =>
      isDateInRange(item.processed_date, start_date, end_date)
    );

    // 신고가 발생한 캠페인 번호 목록 (중복 제거)
    const reported_campaign_numbers = new Set(
      filtered_reported.map((item) => item.campaign_number)
    );

    // 해당 기간 노출된 캠페인 수 (모든 캠페인)
    const exposed_campaigns_count = all_filtered_campaigns.length;

    // 신고가 1건 이상 발생한 캠페인 수
    const reported_campaigns_count = reported_campaign_numbers.size;

    const report_rate_raw =
      exposed_campaigns_count > 0 ? (reported_campaigns_count / exposed_campaigns_count) * 100 : 0;
    const report_rate = Math.min(Math.round(report_rate_raw), 100);

    // 이전 기간 계산
    const previous_reported = reported_list.filter((item) =>
      isDateInRange(item.processed_date, previous_start_date, previous_end_date)
    );

    const previous_reported_campaign_numbers = new Set(
      previous_reported.map((item) => item.campaign_number)
    );

    const previous_exposed_campaigns_count = previous_all_campaigns.length;
    const previous_reported_campaigns_count = previous_reported_campaign_numbers.size;

    const previous_report_rate_raw =
      previous_exposed_campaigns_count > 0
        ? (previous_reported_campaigns_count / previous_exposed_campaigns_count) * 100
        : 0;
    const previous_report_rate = Math.min(Math.round(previous_report_rate_raw), 100);
    const report_change = calculate_change_percentage(report_rate, previous_report_rate);

    return [
      {
        title: "총 모집률",
        value: `${recruitment_rate}%`,
        change: recruitment_change.change,
        changeType: recruitment_change.changeType,
        progress: Math.min(recruitment_rate, 100),
      },
      {
        title: "콘텐츠 완료율",
        value: `${completion_rate}%`,
        change: completion_change.change,
        changeType: completion_change.changeType,
        progress: Math.min(completion_rate, 100),
      },
      {
        title: "콘텐츠 반려율",
        value: `${rejection_rate}%`,
        change: rejection_change.change,
        changeType: rejection_change.changeType,
        progress: Math.min(rejection_rate, 100),
      },
      {
        title: "신고 접수율",
        value: `${report_rate}%`,
        change: report_change.change,
        changeType: report_change.changeType,
        progress: Math.min(report_rate, 100),
        progressColor: "red",
      },
    ];
  }, [campaign_list, rejected_list, reported_list, dateRange]);

  return (
    <div className={styles.campaign_summary_section_container}>
      <h2 className={styles.campaign_summary_section_title}>캠페인 관리 요약</h2>
      <div className={styles.campaign_summary_section_stats_grid}>
        {/* map 함수를 사용하여 통계 카드 배열을 순회하며 렌더링 */}
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
    </div>
  );
}
