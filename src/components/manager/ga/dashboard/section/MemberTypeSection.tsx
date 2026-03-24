/* ========================================
   (  )
   ======================================== */

/**
 * 전체 회원 통계 섹션 컴포넌트 (회원 유형 통계)
 *
 * 목적: 파트너, 리뷰어의 비율을 표시하는 섹션 컴포넌트입니다.
 *
 */

"use client";

import { useMemo, useState, useEffect } from "react";
import { parse, differenceInDays, subDays } from "date-fns";
import styles from "@/styles/manager_ga/dashboard/sections/member_type_section.module.css";
import MemberTypeBarChart from "../chart/MemberTypeBarChart";
import Loading from "@/app/loading";
import { useAdminReviewers } from "@/hooks/manager/ga/useAdminReviewers";
import { useAdminPartners } from "@/hooks/manager/ga/useAdminPartners";
import type { DateRange } from "./DateRangePickerModal";
import type { AdminDashboardResponse } from "@/types/api/admin";

interface MemberTypeSectionProps {
  dateRange: DateRange;
  dashboardData?: AdminDashboardResponse | null;
}

export default function MemberTypeSection({ dateRange, dashboardData }: MemberTypeSectionProps) {
  // 클라이언트에서만 데이터 로드 (Hydration 오류 방지)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // React Query 훅으로 데이터 로드 (API 우선, 정적 데이터 fallback)
  const { reviewers, isLoading: reviewersLoading } = useAdminReviewers();
  const { partners, isLoading: partnersLoading } = useAdminPartners();

  // 날짜 범위에 따라 회원 유형 통계 계산
  const stats = useMemo(() => {
    // GA-01 API 데이터가 있으면 우선 사용
    if (dashboardData?.memberTypeStats) {
      const mt = dashboardData.memberTypeStats;
      const totalMembers = mt.partner.total + mt.reviewer.total;
      const partnerPct =
        totalMembers > 0 ? Math.round((mt.partner.total / totalMembers) * 1000) / 10 : 0;
      const reviewerPct =
        totalMembers > 0 ? Math.round((mt.reviewer.total / totalMembers) * 1000) / 10 : 0;
      const partnerActivePct =
        mt.partner.total > 0 ? Math.round((mt.partner.active / mt.partner.total) * 100) : 0;
      const reviewerActivePct =
        mt.reviewer.total > 0 ? Math.round((mt.reviewer.active / mt.reviewer.total) * 100) : 0;
      return {
        totalMembers,
        totalPartners: mt.partner.total,
        activePartners: mt.partner.active,
        totalReviewers: mt.reviewer.total,
        activeReviewers: mt.reviewer.active,
        partnerPercentage: partnerPct,
        reviewerPercentage: reviewerPct,
        totalPartnersChange: {
          percentage: Math.abs(mt.partner.newMembers),
          type: mt.partner.newMembers > 0 ? ("positive" as const) : ("neutral" as const),
        },
        activePartnerPercentage: partnerActivePct,
        totalReviewersChange: {
          percentage: Math.abs(mt.reviewer.newMembers),
          type: mt.reviewer.newMembers > 0 ? ("positive" as const) : ("neutral" as const),
        },
        activeReviewerPercentage: reviewerActivePct,
      };
    }

    // Fallback: 클라이언트 계산
    if (!dateRange.from || !dateRange.to) {
      return {
        totalMembers: 0,
        totalPartners: 0,
        activePartners: 0,
        totalReviewers: 0,
        activeReviewers: 0,
        partnerPercentage: 0,
        reviewerPercentage: 0,
        activePartnerPercentage: 0,
        activeReviewerPercentage: 0,
        totalPartnersChange: { percentage: 0, type: "neutral" as const },
        totalReviewersChange: { percentage: 0, type: "neutral" as const },
      };
    }

    // 클라이언트에서만 데이터 로드 (서버와 클라이언트 렌더링 일치를 위해)
    if (!isClient) {
      return {
        totalMembers: 0,
        totalPartners: 0,
        activePartners: 0,
        totalReviewers: 0,
        activeReviewers: 0,
        partnerPercentage: 0,
        reviewerPercentage: 0,
        activePartnerPercentage: 0,
        activeReviewerPercentage: 0,
        totalPartnersChange: { percentage: 0, type: "neutral" as const },
        totalReviewersChange: { percentage: 0, type: "neutral" as const },
      };
    }

    // 날짜 범위 설정 (시간 부분 제거)
    const start_date = new Date(dateRange.from);
    start_date.setHours(0, 0, 0, 0);
    const end_date = new Date(dateRange.to);
    end_date.setHours(23, 59, 59, 999);

    // 전체 회원 수
    const total_members = reviewers.length + partners.length;
    const total_partners = partners.length;
    const total_reviewers = reviewers.length;

    // 활성 파트너 수 계산 (last_access_date가 날짜 범위 내에 있는 파트너)
    let active_partners = 0;
    partners.forEach((partner) => {
      if (partner.last_access_date) {
        const access_date_str = partner.last_access_date.split(" ")[0];
        const access_date = parse(access_date_str, "yyyy-MM-dd", new Date());
        access_date.setHours(0, 0, 0, 0);

        if (access_date >= start_date && access_date <= end_date) {
          active_partners++;
        }
      }
    });

    // 활성 리뷰어 수 계산 (last_access_date가 날짜 범위 내에 있는 리뷰어)
    let active_reviewers = 0;
    reviewers.forEach((reviewer) => {
      if (reviewer.last_access_date) {
        const access_date_str = reviewer.last_access_date.split(" ")[0];
        const access_date = parse(access_date_str, "yyyy-MM-dd", new Date());
        access_date.setHours(0, 0, 0, 0);

        if (access_date >= start_date && access_date <= end_date) {
          active_reviewers++;
        }
      }
    });

    // 전월 대비 증감 계산
    // 선택된 기간의 길이를 계산하여 그만큼 이전 기간과 비교
    const period_days = differenceInDays(end_date, start_date) + 1;
    const previous_start_date = subDays(start_date, period_days);
    const previous_end_date = subDays(start_date, 1);
    previous_start_date.setHours(0, 0, 0, 0);
    previous_end_date.setHours(23, 59, 59, 999);

    // 이전 기간의 활성 파트너 수 계산
    let _previous_active_partners = 0;
    partners.forEach((partner) => {
      if (partner.last_access_date) {
        const access_date_str = partner.last_access_date.split(" ")[0];
        const access_date = parse(access_date_str, "yyyy-MM-dd", new Date());
        access_date.setHours(0, 0, 0, 0);

        if (access_date >= previous_start_date && access_date <= previous_end_date) {
          _previous_active_partners++;
        }
      }
    });

    // 이전 기간의 활성 리뷰어 수 계산
    let _previous_active_reviewers = 0;
    reviewers.forEach((reviewer) => {
      if (reviewer.last_access_date) {
        const access_date_str = reviewer.last_access_date.split(" ")[0];
        const access_date = parse(access_date_str, "yyyy-MM-dd", new Date());
        access_date.setHours(0, 0, 0, 0);

        if (access_date >= previous_start_date && access_date <= previous_end_date) {
          _previous_active_reviewers++;
        }
      }
    });

    // 이전 기간의 전체 파트너 수 (join_date 기준)
    let previous_total_partners = 0;
    partners.forEach((partner) => {
      if (partner.join_date) {
        const join_date_str = partner.join_date.split(" ")[0];
        const join_date = parse(join_date_str, "yyyy-MM-dd", new Date());
        join_date.setHours(0, 0, 0, 0);

        if (join_date <= previous_end_date) {
          previous_total_partners++;
        }
      }
    });

    // 이전 기간의 전체 리뷰어 수 (join_date 기준)
    let previous_total_reviewers = 0;
    reviewers.forEach((reviewer) => {
      if (reviewer.join_date) {
        const join_date_str = reviewer.join_date.split(" ")[0];
        const join_date = parse(join_date_str, "yyyy-MM-dd", new Date());
        join_date.setHours(0, 0, 0, 0);

        if (join_date <= previous_end_date) {
          previous_total_reviewers++;
        }
      }
    });

    // 증감률 계산 함수
    const calculate_change_percentage = (
      current: number,
      previous: number
    ): { percentage: number; type: "positive" | "negative" | "neutral" } => {
      if (previous === 0) {
        if (current > 0) {
          return { percentage: 100, type: "positive" };
        }
        return { percentage: 0, type: "neutral" };
      }
      const change = ((current - previous) / previous) * 100;
      const rounded_change = Math.round(change);
      if (rounded_change > 0) {
        return { percentage: rounded_change, type: "positive" };
      } else if (rounded_change < 0) {
        return { percentage: Math.abs(rounded_change), type: "negative" };
      } else {
        return { percentage: 0, type: "neutral" };
      }
    };

    // 전체 파트너 수 증감률
    const total_partners_change = calculate_change_percentage(
      total_partners,
      previous_total_partners
    );

    // 전체 리뷰어 수 증감률
    const total_reviewers_change = calculate_change_percentage(
      total_reviewers,
      previous_total_reviewers
    );

    // 비율 계산
    const partner_percentage =
      total_members > 0 ? Math.round((total_partners / total_members) * 100 * 10) / 10 : 0;
    const reviewer_percentage =
      total_members > 0 ? Math.round((total_reviewers / total_members) * 100 * 10) / 10 : 0;
    const active_partner_percentage =
      total_partners > 0 ? Math.round((active_partners / total_partners) * 100) : 0;
    const active_reviewer_percentage =
      total_reviewers > 0 ? Math.round((active_reviewers / total_reviewers) * 100) : 0;

    return {
      totalMembers: total_members,
      totalPartners: total_partners,
      activePartners: active_partners,
      totalReviewers: total_reviewers,
      activeReviewers: active_reviewers,
      partnerPercentage: partner_percentage,
      reviewerPercentage: reviewer_percentage,
      activePartnerPercentage: active_partner_percentage,
      activeReviewerPercentage: active_reviewer_percentage,
      totalPartnersChange: total_partners_change,
      totalReviewersChange: total_reviewers_change,
    };
  }, [dateRange, isClient, reviewers, partners, dashboardData]);

  // 숫자를 천 단위로 포맷팅하는 함수
  const format_number = (num: number): string => {
    return num.toLocaleString("ko-KR");
  };

  if (reviewersLoading || partnersLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.member_type_section_card}>
      {/* 섹션 제목 */}
      <h2 className={styles.member_type_section_title}>회원 유형별 통계</h2>

      {/* 막대 차트와 통계 정보를 나란히 배치 */}
      <div className={styles.member_type_section_content}>
        {/* 왼쪽: 막대 차트 */}
        <div className={styles.member_type_section_bar_chart_container}>
          <MemberTypeBarChart
            key={
              isClient ? `${dateRange.from?.toISOString()}-${dateRange.to?.toISOString()}` : "init"
            }
            totalPartnerPercentage={stats.partnerPercentage}
            totalReviewerPercentage={stats.reviewerPercentage}
            activePartnerPercentage={stats.activePartnerPercentage}
            activeReviewerPercentage={stats.activeReviewerPercentage}
          />
        </div>

        {/* 오른쪽: 통계 정보 */}
        <div className={styles.member_type_section_stats_info}>
          {/* 파트너/리뷰어 통계 (2x2 그리드) */}
          <div className={styles.member_type_section_info_grid_three}>
            {/* 전체 파트너 수 */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>전체 파트너 수</p>
              <p className={styles.member_type_section_info_value}>
                {format_number(stats.totalPartners)}명
              </p>
              {/* 변화율 표시 */}
              <p
                className={
                  styles[`member_type_section_info_change_${stats.totalPartnersChange.type}`]
                }
              >
                {stats.totalPartnersChange.type === "positive" && (
                  <>
                    <span>↑</span> {stats.totalPartnersChange.percentage}%
                  </>
                )}
                {stats.totalPartnersChange.type === "negative" && (
                  <>
                    <span>↓</span> {stats.totalPartnersChange.percentage}%
                  </>
                )}
                {stats.totalPartnersChange.type === "neutral" && (
                  <>
                    <span>-</span> 0%
                  </>
                )}
              </p>
            </div>

            {/* 활성 파트너 수 */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>활성 파트너 수</p>
              <p className={styles.member_type_section_info_value}>
                {format_number(stats.activePartners)}명
              </p>
              {/* 비율 표시 */}
              <p className={styles.member_type_section_info_percentage}>
                ({stats.activePartnerPercentage}%)
              </p>
            </div>

            {/* 전체 리뷰어 수 */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>전체 리뷰어 수</p>
              <p className={styles.member_type_section_info_value}>
                {format_number(stats.totalReviewers)}명
              </p>
              {/* 변화율 표시 */}
              <p
                className={
                  styles[`member_type_section_info_change_${stats.totalReviewersChange.type}`]
                }
              >
                {stats.totalReviewersChange.type === "positive" && (
                  <>
                    <span>↑</span> {stats.totalReviewersChange.percentage}%
                  </>
                )}
                {stats.totalReviewersChange.type === "negative" && (
                  <>
                    <span>↓</span> {stats.totalReviewersChange.percentage}%
                  </>
                )}
                {stats.totalReviewersChange.type === "neutral" && (
                  <>
                    <span>-</span> 0%
                  </>
                )}
              </p>
            </div>

            {/* 활성 리뷰어 수 */}
            <div className={styles.member_type_section_info_card}>
              <p className={styles.member_type_section_info_label}>활성 리뷰어 수</p>
              <p className={styles.member_type_section_info_value}>
                {format_number(stats.activeReviewers)}명
              </p>
              {/* 비율 표시 */}
              <p className={styles.member_type_section_info_percentage}>
                ({stats.activeReviewerPercentage}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
