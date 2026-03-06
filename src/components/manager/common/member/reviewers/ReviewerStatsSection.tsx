/* ========================================
   📊 리뷰어 통계 섹션 컴포넌트 (공통 래퍼)
   ======================================== */

/**
 * 리뷰어 통계 섹션 컴포넌트 (공통 래퍼)
 *
 * 목적: GA/SA 관리자 리뷰어 목록 페이지에서 공통 MemberStatsSection을 사용합니다.
 *       스타일과 데이터를 전달하여 렌더링합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers (GA 관리자 리뷰어 목록 페이지)
 * - /manager_sa/member/reviewers (SA 관리자 리뷰어 목록 페이지)
 */

"use client";

import { useMemo } from "react";
import MemberStatsSectionCommon from "@/components/manager/common/member/stats/MemberStatsSection";
import styles from "@/styles/manager/common/member/reviewers/reviewer_stats_section.module.css";
import { reviewer_list } from "@/data/manager_ga/member/reviewers";
import type { ReviewerItem } from "@/data/manager_ga/member/reviewers";
import type { MemberStats } from "@/components/manager/common/member/stats/MemberStatsSection";

interface ReviewerStatsSectionProps {
  reviewers?: ReviewerItem[];
}

export default function ReviewerStatsSection({ reviewers }: ReviewerStatsSectionProps = {}) {
  // API 데이터 또는 정적 데이터 사용
  const source = reviewers ?? reviewer_list;

  // 실제 리뷰어 목록 데이터에서 통계 계산
  const stats: MemberStats = useMemo(() => {
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // 전체 가입자 수
    const total_members = source.length;

    // 월간 활동 회원 (최근 한 달 이내 접속한 회원)
    const monthly_active = source.filter((reviewer) => {
      const lastAccessDate = new Date(reviewer.last_access_date.replace(" ", "T"));
      return lastAccessDate >= oneMonthAgo;
    }).length;

    // 월간 신규 가입자 수 (최근 한 달 이내 가입한 회원)
    const monthly_new = source.filter((reviewer) => {
      const joinDate = new Date(reviewer.join_date.replace(" ", "T"));
      return joinDate >= oneMonthAgo;
    }).length;

    // 휴면 회원 (3개월 이상 접속하지 않은 회원)
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    const dormant = source.filter((reviewer) => {
      const lastAccessDate = new Date(reviewer.last_access_date.replace(" ", "T"));
      return lastAccessDate < threeMonthsAgo;
    }).length;

    return {
      total_members,
      monthly_active,
      monthly_new,
      dormant,
    };
  }, [source]);

  return (
    <MemberStatsSectionCommon
      stats={stats}
      styles={
        styles as {
          stats_section: string;
          stat_card: string;
          stat_card_label: string;
          stat_card_value: string;
        }
      }
    />
  );
}
