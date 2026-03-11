/* ========================================
   📊 파트너 통계 섹션 컴포넌트 (공통 래퍼)
   ======================================== */

/**
 * 파트너 통계 섹션 컴포넌트 (공통 래퍼)
 *
 * 목적: GA/SA 관리자 파트너 목록 페이지에서 공통 MemberStatsSection을 사용합니다.
 *       실제 파트너 목록 데이터를 기반으로 통계를 계산하여 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/partners (GA 관리자 파트너 목록 페이지)
 * - /manager_sa/member/partners (SA 관리자 파트너 목록 페이지)
 */

"use client";

import { useMemo, useEffect, useState } from "react";
import MemberStatsSectionCommon from "@/components/manager/common/member/stats/MemberStatsSection";
import styles from "@/styles/manager/common/member/partners/partner_stats_section.module.css";
import { get_partner_list, type PartnerItem } from "@/data/manager_ga/member/partners";
import type { MemberStats } from "@/components/manager/common/member/stats/MemberStatsSection";
import { subMonths, isWithinInterval } from "date-fns";

interface PartnerStatsSectionProps {
  partners?: PartnerItem[];
}

export default function PartnerStatsSection({
  partners: partnersProp,
}: PartnerStatsSectionProps = {}) {
  // 클라이언트 마운트 상태 관리 (SSR Hydration 오류 방지)
  const [is_mounted, set_is_mounted] = useState(false);

  // 컴포넌트 마운트 후 클라이언트 사이드임을 표시
  useEffect(() => {
    set_is_mounted(true);
  }, []);

  // 실제 파트너 목록 데이터에서 통계 계산
  // SSR Hydration 오류 방지를 위해 클라이언트에서만 localStorage 데이터를 반영합니다
  const stats: MemberStats = useMemo(() => {
    // API 데이터 없고 SSR이면 빈 통계 반환
    if (!partnersProp && !is_mounted) {
      return {
        total_members: 0,
        monthly_active: 0,
        monthly_new: 0,
        dormant: 0,
      };
    }

    // API 데이터 또는 localStorage 데이터 사용
    const partner_list = partnersProp ?? get_partner_list();
    const now = new Date();
    const one_month_ago = subMonths(now, 1);
    const three_months_ago = subMonths(now, 3);

    // 전체 가입자 수
    const total_members = partner_list.length;

    // 월간 활동 회원 (최근 한 달 이내 접속한 회원)
    // last_access_date 형식: "2025-08-01 18:56"
    const monthly_active = partner_list.filter((partner) => {
      if (!partner.last_access_date) return false;
      const last_access_date = new Date(partner.last_access_date.replace(" ", "T"));
      return isWithinInterval(last_access_date, {
        start: one_month_ago,
        end: now,
      });
    }).length;

    // 월간 신규 가입자 수 (최근 한 달 이내 가입한 회원)
    // join_date 형식: "2025-08-01 18:56"
    const monthly_new = partner_list.filter((partner) => {
      if (!partner.join_date) return false;
      const join_date = new Date(partner.join_date.replace(" ", "T"));
      return isWithinInterval(join_date, {
        start: one_month_ago,
        end: now,
      });
    }).length;

    // 휴면 회원 (3개월 이상 접속하지 않은 회원)
    const dormant = partner_list.filter((partner) => {
      if (!partner.last_access_date) return false;
      const last_access_date = new Date(partner.last_access_date.replace(" ", "T"));
      return last_access_date < three_months_ago;
    }).length;

    return {
      total_members,
      monthly_active,
      monthly_new,
      dormant,
    };
  }, [partnersProp, is_mounted]);

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
