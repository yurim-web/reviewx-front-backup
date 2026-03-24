/* ========================================
   채널별 회원 통계 섹션 공통 컴포넌트
   ======================================== */

/**
 * ChannelMemberSection
 *
 * 목적: 채널별 회원 등록 통계를 파이 차트와 카드로 표시
 *
 * 사용 페이지:
 * - /manager_ga/dashboard (GA 대시보드)
 * - /manager_sa/dashboard (SA 대시보드)
 */

"use client";

import React, { useMemo, useState, useEffect } from "react";
import styles from "@/styles/manager/common/dashboard/section/channel_member_section.module.css";
import { get_reviewer_list } from "@/data/manager_ga/member/reviewers";
import type { AdminDashboardResponse } from "@/types/api/admin";

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
 * - chart: 파이 차트 컴포넌트 (channelData를 props로 받음)
 */
interface ChannelMemberSectionProps {
  title: string;
  chart: (channelData: { name: string; value: number; count: number }[]) => React.ReactNode;
  dashboardData?: AdminDashboardResponse | null;
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
  chart,
  dashboardData,
}: ChannelMemberSectionProps) {
  // 리뷰어 목록 데이터 로드
  const [reviewer_list, set_reviewer_list] = useState<ReturnType<typeof get_reviewer_list>>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const list = get_reviewer_list();
        set_reviewer_list(list);
      } catch (_error) {}
    }
  }, []);

  // 전체 리뷰어의 채널별 통계 계산 (날짜 필터 적용 안 함)
  const channel_member_stats = useMemo<ChannelMemberStats>(() => {
    // GA-01 API 데이터가 있으면 우선 사용
    if (dashboardData?.channelStats?.channels) {
      const channels = dashboardData.channelStats.channels;
      const channelMap: Record<string, { count: number; pct: number }> = {};
      channels.forEach((ch) => {
        channelMap[ch.channelName.toLowerCase()] = {
          count: ch.memberCount,
          pct: Math.round(ch.percentage),
        };
      });
      return {
        blog: {
          label: "네이버 블로그",
          value: `${channelMap.blog?.count ?? 0}명`,
          percentage: `${channelMap.blog?.pct ?? 0}%`,
        },
        instagram: {
          label: "인스타그램",
          value: `${channelMap.instagram?.count ?? 0}명`,
          percentage: `${channelMap.instagram?.pct ?? 0}%`,
        },
        clip: {
          label: "네이버 클립",
          value: `${channelMap.clip?.count ?? 0}명`,
          percentage: `${channelMap.clip?.pct ?? 0}%`,
        },
        youtube: {
          label: "유튜브",
          value: `${channelMap.youtube?.count ?? 0}명`,
          percentage: `${channelMap.youtube?.pct ?? 0}%`,
        },
      };
    }

    // Fallback: 전체 리뷰어 기준으로 채널별 카운트 계산
    let blog_count = 0;
    let instagram_count = 0;
    let clip_count = 0;
    let youtube_count = 0;

    reviewer_list.forEach((reviewer) => {
      if (reviewer.channels.includes("Blog")) blog_count++;
      if (reviewer.channels.includes("Instagram")) instagram_count++;
      if (reviewer.channels.includes("Clip")) clip_count++;
      if (reviewer.channels.includes("Youtube")) youtube_count++;
    });

    // 전체 합계
    const total = blog_count + instagram_count + clip_count + youtube_count;

    // 비율 계산
    const blog_percentage = total > 0 ? Math.round((blog_count / total) * 100) : 0;
    const instagram_percentage = total > 0 ? Math.round((instagram_count / total) * 100) : 0;
    const clip_percentage = total > 0 ? Math.round((clip_count / total) * 100) : 0;
    const youtube_percentage = total > 0 ? Math.round((youtube_count / total) * 100) : 0;

    // 안내 섹션: 괄호 없이 표시
    return {
      blog: {
        label: "네이버 블로그",
        value: `${blog_count}명`,
        percentage: `${blog_percentage}%`,
      },
      instagram: {
        label: "인스타그램",
        value: `${instagram_count}명`,
        percentage: `${instagram_percentage}%`,
      },
      clip: {
        label: "네이버 클립",
        value: `${clip_count}명`,
        percentage: `${clip_percentage}%`,
      },
      youtube: {
        label: "유튜브",
        value: `${youtube_count}명`,
        percentage: `${youtube_percentage}%`,
      },
    };
  }, [reviewer_list, dashboardData]);

  // 구조 분해 할당으로 props 사용
  const { blog, instagram, clip, youtube } = channel_member_stats;

  // 파이 차트용 데이터 생성 (표시용 괄호 제거 후 숫자만 파싱)
  const pie_chart_data = useMemo(() => {
    const parse_percentage = (s: string) => parseInt(s.replace(/%|\(|\)/g, ""), 10) || 0;
    const parse_count = (s: string) => parseInt(s.replace(/명|\(|\)/g, ""), 10) || 0;

    const blog_percentage = parse_percentage(blog.percentage);
    const instagram_percentage = parse_percentage(instagram.percentage);
    const clip_percentage = parse_percentage(clip.percentage);
    const youtube_percentage = parse_percentage(youtube.percentage);

    const blog_count = parse_count(blog.value);
    const instagram_count = parse_count(instagram.value);
    const clip_count = parse_count(clip.value);
    const youtube_count = parse_count(youtube.value);

    return [
      { name: "블로그", value: blog_percentage, count: blog_count },
      { name: "인스타그램", value: instagram_percentage, count: instagram_count },
      { name: "클립", value: clip_percentage, count: clip_count },
      { name: "유튜브", value: youtube_percentage, count: youtube_count },
    ];
  }, [blog, instagram, clip, youtube]);

  return (
    <div className={styles.channel_member_section_card}>
      {/* 섹션 제목 */}
      <h2 className={styles.channel_member_section_title}>{title}</h2>

      {/* 파이 차트와 통계 정보를 나란히 배치 */}
      <div className={styles.channel_member_section_content}>
        {/* 왼쪽: 파이 차트 */}
        <div className={styles.channel_member_section_pie_chart_container}>
          {chart(pie_chart_data)}
        </div>

        {/* 오른쪽: 통계 정보 - 2x2 그리드 */}
        <div className={styles.channel_member_section_stats_info}>
          <div className={styles.channel_member_section_info_grid}>
            {/* 블로그 등록 */}
            <div className={styles.channel_member_section_info_card}>
              <p className={styles.channel_member_section_info_label}>{blog.label}</p>
              <p className={styles.channel_member_section_info_value}>{blog.value}</p>
              {/* 비율 표시 */}
              <p className={styles.channel_member_section_info_percentage}>({blog.percentage})</p>
            </div>

            {/* 클립 등록 */}
            <div className={styles.channel_member_section_info_card}>
              <p className={styles.channel_member_section_info_label}>{clip.label}</p>
              <p className={styles.channel_member_section_info_value}>{clip.value}</p>
              {/* 비율 표시 */}
              <p className={styles.channel_member_section_info_percentage}>({clip.percentage})</p>
            </div>

            {/* 인스타그램 등록 */}
            <div className={styles.channel_member_section_info_card}>
              <p className={styles.channel_member_section_info_label}>{instagram.label}</p>
              <p className={styles.channel_member_section_info_value}>{instagram.value}</p>
              {/* 비율 표시 */}
              <p className={styles.channel_member_section_info_percentage}>
                ({instagram.percentage})
              </p>
            </div>

            {/* 유튜브 등록 */}
            <div className={styles.channel_member_section_info_card}>
              <p className={styles.channel_member_section_info_label}>{youtube.label}</p>
              <p className={styles.channel_member_section_info_value}>{youtube.value}</p>
              {/* 비율 표시 */}
              <p className={styles.channel_member_section_info_percentage}>
                ({youtube.percentage})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
