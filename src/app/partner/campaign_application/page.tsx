/* ========================================
   📋 캠페인 신청 내역 메인 페이지
   ======================================== */

/**
 * 캠페인 신청 내역 메인 페이지
 *
 * 목적: 파트너가 생성한 모든 캠페인 타입의 신청내역을 관리할 수 있는 메인 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_application
 *
 * 주요 기능:
 * - 캠페인 타입별 신청내역 페이지로 이동
 * - 각 캠페인 타입별 통계 정보 표시
 * - 빠른 접근을 위한 네비게이션 제공
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PartnerHeader from "@/components/fragments/PartnerHeader";
import styles from "../../../styles/partner/campaign_application/campaign_application.module.css";
import layoutStyles from "../../../styles/partner/layout.module.css";

// 캠페인 타입별 통계 데이터 (실제로는 API에서 가져올 데이터)
const campaignTypeStats = [
  {
    type: "배송형",
    path: "/partner/campaign_application/delivery/1", // 첫 번째 배송형 캠페인으로 직접 이동
    description: "제품을 배송받아 체험 후 리뷰 작성",
    totalCampaigns: 3,
    totalApplicants: 45,
    selectedApplicants: 12,
    icon: "📦",
  },
  {
    type: "방문형",
    path: "/partner/campaign_application/visit",
    description: "매장을 직접 방문하여 체험 후 리뷰 작성",
    totalCampaigns: 2,
    totalApplicants: 28,
    selectedApplicants: 8,
    icon: "🏪",
  },
  {
    type: "리뷰형",
    path: "/partner/campaign_application/review",
    description: "기존 구매 제품에 대한 리뷰 작성",
    totalCampaigns: 1,
    totalApplicants: 15,
    selectedApplicants: 5,
    icon: "✍️",
  },
  {
    type: "기자단형",
    path: "/partner/campaign_application/reporter",
    description: "기자단 활동을 통한 콘텐츠 제작",
    totalCampaigns: 1,
    totalApplicants: 22,
    selectedApplicants: 6,
    icon: "📰",
  },
  {
    type: "미션형",
    path: "/partner/campaign_application/mission",
    description: "특정 미션을 수행하고 인증",
    totalCampaigns: 2,
    totalApplicants: 35,
    selectedApplicants: 10,
    icon: "🎯",
  },
];

/**
 * 캠페인 신청 내역 메인 페이지 컴포넌트
 *
 * 🎓 학습 포인트: 대시보드 형태의 메인 페이지
 *
 * 📌 페이지 구조:
 * 1. 각 캠페인 타입별 카드 표시
 * 2. 통계 정보와 함께 시각적 표현
 * 3. 클릭 시 해당 타입의 목록 페이지로 이동
 * 4. 사용자 친화적인 인터페이스
 */
export default function CampaignApplicationMainPage() {
  const router = useRouter();

  /**
   * 캠페인 타입 클릭 핸들러
   *
   * @param path - 이동할 페이지 경로
   */
  const handleCampaignTypeClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className={layoutStyles.container}>
      {/* 파트너 헤더 */}
      <PartnerHeader />

      {/* 페이지 제목 */}
      <div className={styles.page_header}>
        <h1 className={styles.page_title}>캠페인 신청 내역</h1>
        <p className={styles.page_description}>
          생성한 캠페인별 신청자 관리 페이지입니다. 캠페인 타입을 선택하여
          신청자 목록을 확인하세요.
        </p>
      </div>

      {/* 캠페인 타입별 카드 그리드 */}
      <section className={styles.campaign_types_grid}>
        {campaignTypeStats.map((stat) => (
          <div
            key={stat.type}
            className={styles.campaign_type_card}
            onClick={() => handleCampaignTypeClick(stat.path)}
          >
            {/* 캠페인 타입 아이콘 */}
            <div className={styles.campaign_type_icon}>
              <span className={styles.icon_emoji}>{stat.icon}</span>
            </div>

            {/* 캠페인 타입 정보 */}
            <div className={styles.campaign_type_info}>
              <h3 className={styles.campaign_type_title}>{stat.type}</h3>
              <p className={styles.campaign_type_description}>
                {stat.description}
              </p>
            </div>

            {/* 통계 정보 */}
            <div className={styles.campaign_type_stats}>
              <div className={styles.stat_row}>
                <span className={styles.stat_label}>총 캠페인</span>
                <span className={styles.stat_value}>
                  {stat.totalCampaigns}개
                </span>
              </div>
              <div className={styles.stat_row}>
                <span className={styles.stat_label}>신청자</span>
                <span className={styles.stat_value}>
                  {stat.totalApplicants}명
                </span>
              </div>
              <div className={styles.stat_row}>
                <span className={styles.stat_label}>선정자</span>
                <span className={styles.stat_value}>
                  {stat.selectedApplicants}명
                </span>
              </div>
            </div>

            {/* 클릭 힌트 */}
            <div className={styles.click_hint}>
              클릭하여 {stat.type} 캠페인 관리하기
            </div>
          </div>
        ))}
      </section>

      {/* 전체 통계 요약 */}
      <section className={styles.summary_stats}>
        <h2 className={styles.summary_title}>전체 통계</h2>
        <div className={styles.summary_grid}>
          <div className={styles.summary_item}>
            <span className={styles.summary_number}>
              {campaignTypeStats.reduce(
                (sum, stat) => sum + stat.totalCampaigns,
                0
              )}
            </span>
            <span className={styles.summary_label}>총 캠페인</span>
          </div>
          <div className={styles.summary_item}>
            <span className={styles.summary_number}>
              {campaignTypeStats.reduce(
                (sum, stat) => sum + stat.totalApplicants,
                0
              )}
            </span>
            <span className={styles.summary_label}>총 신청자</span>
          </div>
          <div className={styles.summary_item}>
            <span className={styles.summary_number}>
              {campaignTypeStats.reduce(
                (sum, stat) => sum + stat.selectedApplicants,
                0
              )}
            </span>
            <span className={styles.summary_label}>총 선정자</span>
          </div>
        </div>
      </section>
    </div>
  );
}
