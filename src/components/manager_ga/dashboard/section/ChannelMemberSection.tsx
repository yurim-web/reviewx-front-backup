/* ========================================
   📊 채널별 회원 통계 섹션 컴포넌트
   ======================================== */

/**
 * 채널별 회원 통계 섹션 컴포넌트
 *
 * 목적: 채널별 회원 등록 통계를 표시하는 섹션 컴포넌트입니다.
 *
 * 주요 기능:
 * - 채널별 회원 파이 차트 표시
 * - 블로그, 인스타그램, 클립, 유튜브 등록 수 표시
 *
 * 학습 포인트:
 * - 컴포넌트 분리: 각 섹션을 독립적인 컴포넌트로 분리하여 재사용성 향상
 * - CSS 모듈: styles.member_stat_card를 사용하여 일관된 스타일 적용
 * - 그리드 레이아웃: styles.member_info_grid로 통계 정보를 2x2 그리드로 배치
 * - 비율 표시: 각 채널별 등록 수와 비율을 함께 표시
 */

import styles from '@/styles/manager_ga/dashboard/sections/channel_member_section.module.css';
import ChannelMemberPieChart from '../chart/ChannelMemberPieChart';
import { channelMemberStats } from '@/data/manager_ga/dashboard/dashboardData';

export default function ChannelMemberSection() {
  return (
    <div className={styles.channel_member_section_card}>
      {/* 섹션 제목 */}
      <h2 className={styles.channel_member_section_title}>채널별 회원 통계</h2>

      {/* 파이 차트와 통계 정보를 나란히 배치 */}
      <div className={styles.channel_member_section_content}>
        {/* 왼쪽: 파이 차트 */}
        <div className={styles.channel_member_section_pie_chart_container}>
          <ChannelMemberPieChart />
        </div>

        {/* 오른쪽: 통계 정보 - 2x2 그리드 */}
        <div className={styles.channel_member_section_stats_info}>
          <div className={styles.channel_member_section_info_grid}>
            {/* 블로그 등록 */}
            <div className={styles.channel_member_section_info_card}>
              <p className={styles.channel_member_section_info_label}>
                {channelMemberStats.blog.label}
              </p>
              <p className={styles.channel_member_section_info_value}>
                {channelMemberStats.blog.value}
              </p>
              {/* 비율 표시 */}
              <p className={styles.channel_member_section_info_percentage}>
                {channelMemberStats.blog.percentage}
              </p>
            </div>

            {/* 인스타그램 등록 */}
            <div className={styles.channel_member_section_info_card}>
              <p className={styles.channel_member_section_info_label}>
                {channelMemberStats.instagram.label}
              </p>
              <p className={styles.channel_member_section_info_value}>
                {channelMemberStats.instagram.value}
              </p>
              {/* 비율 표시 */}
              <p className={styles.channel_member_section_info_percentage}>
                {channelMemberStats.instagram.percentage}
              </p>
            </div>

            {/* 클립 등록 */}
            <div className={styles.channel_member_section_info_card}>
              <p className={styles.channel_member_section_info_label}>
                {channelMemberStats.clip.label}
              </p>
              <p className={styles.channel_member_section_info_value}>
                {channelMemberStats.clip.value}
              </p>
              {/* 비율 표시 */}
              <p className={styles.channel_member_section_info_percentage}>
                {channelMemberStats.clip.percentage}
              </p>
            </div>

            {/* 유튜브 등록 */}
            <div className={styles.channel_member_section_info_card}>
              <p className={styles.channel_member_section_info_label}>
                {channelMemberStats.youtube.label}
              </p>
              <p className={styles.channel_member_section_info_value}>
                {channelMemberStats.youtube.value}
              </p>
              {/* 비율 표시 */}
              <p className={styles.channel_member_section_info_percentage}>
                {channelMemberStats.youtube.percentage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
