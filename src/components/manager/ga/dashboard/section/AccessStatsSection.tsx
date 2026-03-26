/* ========================================
   
   ======================================== */

/**
 * 접속 통계 섹션 컴포넌트
 *
 * 목적: 접속 통계와 디바이스 통계를 표시하는 섹션 컴포넌트입니다.
 *
 
 */

import { useMemo } from "react";
import styles from "@/styles/manager_ga/dashboard/sections/access_stats_section.module.css";
import DeviceStatsChart from "../chart/DeviceStatsChart";
import { accessStats as defaultAccessStats } from "@/data/manager_ga/dashboard/dashboardData";
import type { AdminDashboardResponse } from "@/types/api/admin";

interface AccessStatsSectionProps {
  dashboardData?: AdminDashboardResponse | null;
}

export default function AccessStatsSection({ dashboardData }: AccessStatsSectionProps) {
  // API 데이터가 있으면 변환, 없으면 기존 정적 데이터 사용
  const accessStats = useMemo(() => {
    if (dashboardData?.accessStats) {
      const a = dashboardData.accessStats;
      const visitChangeVal = Number(a.totalAccessChange) || 0;
      const inflowChangeVal = Number(a.inflowChange) || 0;
      return {
        visits: {
          label: "방문 수",
          value: `${a.totalAccess.toLocaleString("ko-KR")}회`,
          change: `${visitChangeVal >= 0 ? "+" : ""}${visitChangeVal}%`,
          changeType: (visitChangeVal > 0
            ? "positive"
            : visitChangeVal < 0
              ? "negative"
              : "neutral") as "positive" | "negative" | "neutral",
        },
        referrals: {
          label: "유입 수",
          value: `${(a.inflowCount ?? 0).toLocaleString("ko-KR")}회`,
          change: `${inflowChangeVal >= 0 ? "+" : ""}${inflowChangeVal}%`,
          changeType: (inflowChangeVal > 0
            ? "positive"
            : inflowChangeVal < 0
              ? "negative"
              : "neutral") as "positive" | "negative" | "neutral",
        },
      };
    }
    return defaultAccessStats;
  }, [dashboardData]);

  // API pcRate/mobileRate/tabletRate/appRate를 디바이스 차트 데이터로 변환
  const deviceData = useMemo(() => {
    if (dashboardData?.accessStats) {
      const a = dashboardData.accessStats;
      const appRate = a.appRate ?? Math.max(0, 100 - a.pcRate - a.mobileRate - a.tabletRate);
      return [
        {
          label: "PC",
          percentage: a.pcRate,
          colorKey: "pc" as const,
          description: `PC 접속 비율 ${a.pcRate}%`,
        },
        {
          label: "Tablet",
          percentage: a.tabletRate,
          colorKey: "tablet" as const,
          description: `태블릿 접속 비율 ${a.tabletRate}%`,
        },
        {
          label: "Mobile",
          percentage: a.mobileRate,
          colorKey: "mobile" as const,
          description: `모바일 접속 비율 ${a.mobileRate}%`,
        },
        {
          label: "App",
          percentage: appRate,
          colorKey: "app" as const,
          description: `앱 접속 비율 ${appRate}%`,
        },
      ];
    }
    return undefined;
  }, [dashboardData]);
  return (
    <div className={styles.access_stats_section_card}>
      <div className={styles.access_stats_section_header}>
        {/* 섹션 제목 */}
        <h2 className={styles.access_stats_section_title}>접속 통계</h2>
      </div>

      {/* 방문 수와 유입 수 통계 카드 그리드 */}
      <div className={styles.access_stats_section_grid}>
        {/* 방문 수 카드 */}
        <div className={styles.access_stats_section_stat_card}>
          {/* 라벨과 변화율을 같은 줄에 배치 (space-between) */}
          <div className={styles.access_stats_section_stat_card_label_row}>
            <p className={styles.access_stats_section_stat_card_label}>
              {accessStats.visits.label}
            </p>
            {/* 변화율 표시 */}
            {/* changeType에 따라 화살표와 색상이 달라집니다 */}
            <p
              className={
                styles[`access_stats_section_stat_card_change_${accessStats.visits.changeType}`]
              }
            >
              {accessStats.visits.changeType === "positive" && (
                <>
                  {/* 상승: 초록색 위쪽 화살표 */}
                  <span>↑</span> {accessStats.visits.change.replace(/^[+-]\s*/, "")}
                </>
              )}
              {accessStats.visits.changeType === "negative" && (
                <>
                  {/* 하락: 빨간색 아래쪽 화살표 */}
                  <span>↓</span> {accessStats.visits.change.replace(/^[+-]\s*/, "")}
                </>
              )}
            </p>
          </div>
          {/* 값 표시 */}
          <p className={styles.access_stats_section_stat_card_value}>{accessStats.visits.value}</p>
        </div>

        {/* 유입 수 카드 */}
        <div className={styles.access_stats_section_stat_card}>
          {/* 라벨과 변화율을 같은 줄에 배치 (space-between) */}
          <div className={styles.access_stats_section_stat_card_label_row}>
            <p className={styles.access_stats_section_stat_card_label}>
              {accessStats.referrals.label}
            </p>
            {/* 변화율 표시 */}
            {/* changeType에 따라 화살표와 색상이 달라집니다 */}
            <p
              className={
                styles[`access_stats_section_stat_card_change_${accessStats.referrals.changeType}`]
              }
            >
              {accessStats.referrals.changeType === "positive" && (
                <>
                  {/* 상승: 초록색 위쪽 화살표 */}
                  <span>↑</span> {accessStats.referrals.change.replace(/^[+-]\s*/, "")}
                </>
              )}
              {accessStats.referrals.changeType === "negative" && (
                <>
                  {/* 하락: 빨간색 아래쪽 화살표 */}
                  <span>↓</span> {accessStats.referrals.change.replace(/^[+-]\s*/, "")}
                </>
              )}
            </p>
          </div>
          {/* 값 표시 */}
          <p className={styles.access_stats_section_stat_card_value}>
            {accessStats.referrals.value}
          </p>
        </div>
      </div>

      {/* 디바이스 통계 섹션 */}
      <div className={styles.access_stats_section_device_stats_section}>
        <h3 className={styles.access_stats_section_device_stats_title}>디바이스 통계</h3>
        {/* recharts 라이브러리를 사용한 막대 차트 */}
        <DeviceStatsChart data={deviceData} />
      </div>
    </div>
  );
}
