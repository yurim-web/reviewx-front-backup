/* ========================================
   👥 전체 회원 통계 섹션 컴포넌트 (활성화 통계)
   ======================================== */

/**
 * 전체 회원 통계 섹션 컴포넌트 (활성화 통계)
 *
 * 목적: 전체 회원의 활성화 비율과 통계를 표시하는 섹션 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa (대시보드 페이지)
 */

"use client";

import { useMemo, useState, useEffect } from "react";
import { parse, differenceInDays, subDays } from "date-fns";
import styles from "@/styles/manager/common/dashboard/section/stats_section.module.css";
import MemberActivationDonutChart from "../chart/MemberActivationDonutChart";
import { useAdminReviewers } from "@/hooks/manager/ga/useAdminReviewers";
import { useAdminPartners } from "@/hooks/manager/ga/useAdminPartners";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";

interface MemberActivationSectionProps {
  dateRange: DateRange;
}

export default function MemberActivationSection({ dateRange }: MemberActivationSectionProps) {
  // 클라이언트에서만 데이터 로드 (Hydration 오류 방지)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // React Query 훅으로 데이터 로드 (API 우선, 정적 데이터 fallback)
  const { reviewers } = useAdminReviewers();
  const { partners } = useAdminPartners();

  // 날짜 범위에 따라 회원 통계 계산
  const stats = useMemo(() => {
    if (!dateRange.from || !dateRange.to) {
      return {
        totalMembers: 0,
        activeMembers: 0,
        inactiveMembers: 0,
        activePercentage: 0,
        totalMembersChange: { percentage: 0, type: "neutral" as const },
      };
    }

    // 클라이언트에서만 데이터 로드 (서버와 클라이언트 렌더링 일치를 위해)
    if (!isClient) {
      return {
        totalMembers: 0,
        activeMembers: 0,
        inactiveMembers: 0,
        activePercentage: 0,
        totalMembersChange: { percentage: 0, type: "neutral" as const },
      };
    }

    // 날짜 범위 설정 (시간 부분 제거)
    const start_date = new Date(dateRange.from);
    start_date.setHours(0, 0, 0, 0);
    const end_date = new Date(dateRange.to);
    end_date.setHours(23, 59, 59, 999);

    // 전체 회원 수 (리뷰어 + 파트너)
    const total_members = reviewers.length + partners.length;

    // 활성 회원 수 계산 (last_access_date가 날짜 범위 내에 있는 회원)
    let active_members = 0;

    // 리뷰어 활성 회원 수
    reviewers.forEach((reviewer) => {
      if (reviewer.last_access_date) {
        const access_date_str = reviewer.last_access_date.split(" ")[0];
        const access_date = parse(access_date_str, "yyyy-MM-dd", new Date());
        access_date.setHours(0, 0, 0, 0);

        if (access_date >= start_date && access_date <= end_date) {
          active_members++;
        }
      }
    });

    // 파트너 활성 회원 수
    partners.forEach((partner) => {
      if (partner.last_access_date) {
        const access_date_str = partner.last_access_date.split(" ")[0];
        const access_date = parse(access_date_str, "yyyy-MM-dd", new Date());
        access_date.setHours(0, 0, 0, 0);

        if (access_date >= start_date && access_date <= end_date) {
          active_members++;
        }
      }
    });

    // 비활성 회원 수
    const inactive_members = total_members - active_members;

    // 활성화 비율 계산
    const active_percentage =
      total_members > 0 ? Math.round((active_members / total_members) * 100) : 0;

    // 전월 대비 증감 계산
    // 선택된 기간의 길이를 계산하여 그만큼 이전 기간과 비교
    const period_days = differenceInDays(end_date, start_date) + 1;
    const previous_start_date = subDays(start_date, period_days);
    const previous_end_date = subDays(start_date, 1);
    previous_start_date.setHours(0, 0, 0, 0);
    previous_end_date.setHours(23, 59, 59, 999);

    // 이전 기간의 전체 회원 수 (join_date 기준)
    let previous_total_members = 0;
    reviewers.forEach((reviewer) => {
      if (reviewer.join_date) {
        const join_date_str = reviewer.join_date.split(" ")[0];
        const join_date = parse(join_date_str, "yyyy-MM-dd", new Date());
        join_date.setHours(0, 0, 0, 0);

        if (join_date <= previous_end_date) {
          previous_total_members++;
        }
      }
    });
    partners.forEach((partner) => {
      if (partner.join_date) {
        const join_date_str = partner.join_date.split(" ")[0];
        const join_date = parse(join_date_str, "yyyy-MM-dd", new Date());
        join_date.setHours(0, 0, 0, 0);

        if (join_date <= previous_end_date) {
          previous_total_members++;
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

    // 전체 회원 수 증감률
    const total_members_change = calculate_change_percentage(total_members, previous_total_members);

    return {
      totalMembers: total_members,
      activeMembers: active_members,
      inactiveMembers: inactive_members,
      activePercentage: active_percentage,
      totalMembersChange: total_members_change,
    };
  }, [dateRange, isClient, reviewers, partners]);

  // 숫자를 천 단위로 포맷팅하는 함수
  const format_number = (num: number): string => {
    return num.toLocaleString("ko-KR");
  };
  return (
    <div className={styles.member_activation_section_card}>
      {/* 섹션 제목 */}
      <h2 className={styles.member_activation_section_title}>전체 회원 통계</h2>

      {/* 도넛 차트와 통계 정보를 나란히 배치 */}
      <div className={styles.member_activation_section_content}>
        {/* 왼쪽: 도넛 차트 */}
        <div className={styles.member_activation_section_donut_chart_container}>
          <MemberActivationDonutChart
            key={
              isClient ? `${dateRange.from?.toISOString()}-${dateRange.to?.toISOString()}` : "init"
            }
            activePercentage={stats.activePercentage}
          />
        </div>

        {/* 오른쪽: 통계 정보 - 상단 전체 너비 + 하단 2개 나란히 */}
        <div className={styles.member_activation_section_stats_info}>
          {/* 상단: 전체 회원 수 (전체 너비) */}
          <div className={styles.member_activation_section_info_card_full}>
            <p className={styles.member_activation_section_info_label}>전체 회원 수</p>
            {/* 값 표시 */}
            <p className={styles.member_activation_section_info_value}>
              {format_number(stats.totalMembers)}명
            </p>
            {/* 변화율 표시 */}
            <p
              className={
                styles[`member_activation_section_info_change_${stats.totalMembersChange.type}`]
              }
            >
              {stats.totalMembersChange.type === "positive" && (
                <>
                  <span>↑</span> {stats.totalMembersChange.percentage}%
                </>
              )}
              {stats.totalMembersChange.type === "negative" && (
                <>
                  <span>↓</span> {stats.totalMembersChange.percentage}%
                </>
              )}
              {stats.totalMembersChange.type === "neutral" && (
                <>
                  <span>-</span> 0%
                </>
              )}
            </p>
          </div>

          {/* 하단: 활성/비활성 회원 수 (2개 나란히) */}
          <div className={styles.member_activation_section_info_grid}>
            {/* 활성 회원 수 */}
            <div className={styles.member_activation_section_info_card}>
              <p className={styles.member_activation_section_info_label}>활성 회원 수</p>
              <p className={styles.member_activation_section_info_value}>
                {format_number(stats.activeMembers)}명
              </p>
              {/* 비율 표시 */}
              <p className={styles.member_activation_section_info_percentage}>
                ({stats.activePercentage}%)
              </p>
            </div>

            {/* 비활성 회원 수 */}
            <div className={styles.member_activation_section_info_card}>
              <p className={styles.member_activation_section_info_label}>비활성 회원 수</p>
              <p className={styles.member_activation_section_info_value}>
                {format_number(stats.inactiveMembers)}명
              </p>
              {/* 비율 표시 */}
              <p className={styles.member_activation_section_info_percentage}>
                ({100 - stats.activePercentage}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
