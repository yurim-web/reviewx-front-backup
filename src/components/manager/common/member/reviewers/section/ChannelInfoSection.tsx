/* ========================================
   채널 정보 섹션 컴포넌트 (공통)
   ======================================== */

/**
 * ChannelInfoSection
 *
 * 목적: GA/SA 관리자 리뷰어 상세 페이지 채널 통계 정보 표시
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers/[id] (GA 리뷰어 상세)
 * - /manager_sa/member/reviewers/[id] (SA 리뷰어 상세)
 */

"use client";

import Section from "@/components/manager/common/member/member_detail/Section";
import type { ChannelDetail } from "@/data/manager_ga/member/reviewers";
import styles from "@/styles/manager/common/member/member_detail/reviewers/channel_info_section.module.css";

// 채널 아이콘 경로 매핑 객체
const _channel_icon_map: Record<string, string> = {
  Blog: "/images/brand_logo/naverblog.svg",
  Clip: "/images/brand_logo/naverclip.svg",
  Instagram: "/images/brand_logo/insta.svg",
  Youtube: "/images/brand_logo/youtube.svg",
  Store: "/images/brand_logo/navershop.svg",
};

// 채널 이름 매핑 객체
const channel_name_map: Record<string, string> = {
  Blog: "네이버 블로그",
  Clip: "네이버 클립",
  Instagram: "인스타그램",
  Youtube: "유튜브",
};

interface ChannelInfoSectionProps {
  // 채널 상세 정보 배열
  channel_details: ChannelDetail[];
}

export default function ChannelInfoSection({ channel_details }: ChannelInfoSectionProps) {
  // 숫자를 천 단위로 포맷하는 함수
  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <Section title="채널 정보">
      <div className={styles.channel_grid}>
        {channel_details.map((channel_detail, index) => (
          <div key={index} className={styles.channel_card}>
            <div className={styles.channel_name}>
              {channel_name_map[channel_detail.channel] || channel_detail.channel}
            </div>

            {channel_detail.is_connected ? (
              <div className={styles.channel_stats}>
                {channel_detail.channel === "Blog" && (
                  <>
                    <div className={styles.channel_stat_row}>
                      <span>일방문</span>
                      <span>{format_number(channel_detail.daily_visits || 0)}</span>
                    </div>
                    <div className={styles.channel_stat_row}>
                      <span>총방문</span>
                      <span>{format_number(channel_detail.total_visits || 0)}</span>
                    </div>
                    <div className={styles.channel_stat_row}>
                      <span>이웃수</span>
                      <span>{format_number(channel_detail.neighbors || 0)}</span>
                    </div>
                  </>
                )}

                {/* 네이버 클립 통계 */}
                {channel_detail.channel === "Clip" && (
                  <div className={styles.channel_stat_row}>
                    <span>팔로워</span>
                    <span>{format_number(channel_detail.followers || 0)}</span>
                  </div>
                )}

                {/* 인스타그램 통계 */}
                {channel_detail.channel === "Instagram" && (
                  <div className={styles.channel_stat_row}>
                    <span>팔로워</span>
                    <span>{format_number(channel_detail.followers || 0)}</span>
                  </div>
                )}

                {/* 유튜브 통계 */}
                {channel_detail.channel === "Youtube" && (
                  <div className={styles.channel_stat_row}>
                    <span>구독자</span>
                    <span>{format_number(channel_detail.subscribers || 0)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.channel_not_connected}>연결 필요</div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
