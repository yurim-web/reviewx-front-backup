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
 * - 리뷰어 목록 데이터를 기반으로 채널별 통계 계산
 * - 날짜 필터에 따라 통계 값이 변경됨
 */

"use client";

import React, { useMemo, useState, useEffect } from "react";
import styles from "@/styles/manager/common/dashboard/section/channel_member_section.module.css";
import { get_reviewer_list } from "@/data/manager_ga/member/reviewers";

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
}: ChannelMemberSectionProps) {
  // 리뷰어 목록 데이터 로드
  const [reviewer_list, set_reviewer_list] = useState<
    ReturnType<typeof get_reviewer_list>
  >([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const list = get_reviewer_list();
        set_reviewer_list(list);
      } catch (error) {
        console.error("리뷰어 목록 로드 실패:", error);
      }
    }
  }, []);

  // 전체 리뷰어의 채널별 통계 계산 (날짜 필터 적용 안 함)
  const channel_member_stats = useMemo<ChannelMemberStats>(() => {
    // 전체 리뷰어 기준으로 채널별 카운트 계산
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
    const instagram_percentage =
      total > 0 ? Math.round((instagram_count / total) * 100) : 0;
    const clip_percentage =
      total > 0 ? Math.round((clip_count / total) * 100) : 0;
    const youtube_percentage =
      total > 0 ? Math.round((youtube_count / total) * 100) : 0;

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
  }, [reviewer_list]);

  // 구조 분해 할당으로 props 사용
  const { blog, instagram, clip, youtube } = channel_member_stats;

  // 파이 차트용 데이터 생성
  const pie_chart_data = useMemo(() => {
    const blog_percentage = parseInt(blog.percentage.replace("%", "")) || 0;
    const instagram_percentage = parseInt(instagram.percentage.replace("%", "")) || 0;
    const clip_percentage = parseInt(clip.percentage.replace("%", "")) || 0;
    const youtube_percentage = parseInt(youtube.percentage.replace("%", "")) || 0;

    const blog_count = parseInt(blog.value.replace("명", "")) || 0;
    const instagram_count = parseInt(instagram.value.replace("명", "")) || 0;
    const clip_count = parseInt(clip.value.replace("명", "")) || 0;
    const youtube_count = parseInt(youtube.value.replace("명", "")) || 0;

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

