/* ========================================
   📊 채널별 회원 통계 섹션 공통 컴포넌트
   ======================================== */

/**
 * 채널별 회원 통계 섹션 공통 컴포넌트
 *
 * 목적: 채널별 회원 등록 통계를 파이 차트와 2x2 카드로 표시합니다.
 *
 * 사용 위치:
 * - GA/SA 대시보드의 채널별 회원 통계 카드
 *
 * 주요 기능:
 * - 파이 차트 영역 렌더링 (props로 전달받음)
 * - 블로그/인스타그램/클립/유튜브 통계 카드 표시
 */

"use client";

import React from "react";
import styles from "@/styles/manager/common/dashboard/section/channel_member_section.module.css";

/* ========================================
   📌 타입 정의 (TypeScript)
   ======================================== */

/**
 * ChannelMemberStatItem
 * - label: 라벨 텍스트
 * - value: 값 텍스트
 * - percentage: 비율 텍스트
 */
interface ChannelMemberStatItem {
  label: string;
  value: string;
  percentage: string;
}

/**
 * ChannelMemberStats
 * - blog/instagram/clip/youtube: 각 채널 통계 정보
 */
interface ChannelMemberStats {
  blog: ChannelMemberStatItem;
  instagram: ChannelMemberStatItem;
  clip: ChannelMemberStatItem;
  youtube: ChannelMemberStatItem;
}

/**
 * ChannelMemberSectionProps
 * - title: 섹션 제목
 * - channel_member_stats: 채널별 통계 데이터
 * - chart: 파이 차트 컴포넌트
 */
interface ChannelMemberSectionProps {
  title: string;
  channel_member_stats: ChannelMemberStats;
  chart: React.ReactNode;
}

/* ========================================
   ✅ 메인 컴포넌트
   ======================================== */

/**
 * React 컴포넌트
 * - props로 받은 데이터/차트를 화면에 배치합니다.
 * - JSX로 레이아웃을 구성하고, props로 UI를 재사용합니다.
 */
export default function ChannelMemberSection({
  title,
  channel_member_stats,
  chart,
}: ChannelMemberSectionProps) {
  // 구조 분해 할당으로 props 사용
  const { blog, instagram, clip, youtube } = channel_member_stats;

  return (
    <div className={styles.channel_member_section_card}>
      {/* 섹션 제목 */}
      <h2 className={styles.channel_member_section_title}>{title}</h2>

      {/* 파이 차트와 통계 정보를 나란히 배치 */}
      <div className={styles.channel_member_section_content}>
        {/* 왼쪽: 파이 차트 */}
        <div className={styles.channel_member_section_pie_chart_container}>
          {chart}
        </div>

        {/* 오른쪽: 통계 정보 - 2x2 그리드 */}
        <div className={styles.channel_member_section_stats_info}>
          <div className={styles.channel_member_section_info_grid}>
            {/* 블로그 등록 */}
            <div className={styles.channel_member_section_info_card}>
              <p className={styles.channel_member_section_info_label}>
                {blog.label}
              </p>
              <p className={styles.channel_member_section_info_value}>
                {blog.value}
              </p>
              {/* 비율 표시 */}
              <p className={styles.channel_member_section_info_percentage}>
                {blog.percentage}
              </p>
            </div>

            {/* 인스타그램 등록 */}
            <div className={styles.channel_member_section_info_card}>
              <p className={styles.channel_member_section_info_label}>
                {instagram.label}
              </p>
              <p className={styles.channel_member_section_info_value}>
                {instagram.value}
              </p>
              {/* 비율 표시 */}
              <p className={styles.channel_member_section_info_percentage}>
                {instagram.percentage}
              </p>
            </div>

            {/* 클립 등록 */}
            <div className={styles.channel_member_section_info_card}>
              <p className={styles.channel_member_section_info_label}>
                {clip.label}
              </p>
              <p className={styles.channel_member_section_info_value}>
                {clip.value}
              </p>
              {/* 비율 표시 */}
              <p className={styles.channel_member_section_info_percentage}>
                {clip.percentage}
              </p>
            </div>

            {/* 유튜브 등록 */}
            <div className={styles.channel_member_section_info_card}>
              <p className={styles.channel_member_section_info_label}>
                {youtube.label}
              </p>
              <p className={styles.channel_member_section_info_value}>
                {youtube.value}
              </p>
              {/* 비율 표시 */}
              <p className={styles.channel_member_section_info_percentage}>
                {youtube.percentage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

