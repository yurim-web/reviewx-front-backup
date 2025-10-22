/* ========================================
   🎯 미션형 캠페인 신청내역 페이지
   ======================================== */

/**
 * 미션형 캠페인 신청내역 페이지
 *
 * 목적: 파트너가 생성한 미션형 캠페인에 신청한 사용자들의 목록을 확인하고 관리하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_application/mission
 *
 * 주요 기능:
 * - 미션형 캠페인 기본 정보 표시 (제목, 이미지, 상태, 일정 등)
 * - 신청자/선정자 탭 네비게이션
 * - 신청자 목록 그리드 표시 (프로필, 통계, 메모 등)
 * - 선정하기/이용제한 버튼 기능
 * - 필터링 및 정렬 기능
 * - 목록 다운로드 기능
 */

"use client";

import { useState, useEffect } from "react";
import PartnerHeader from "@/components/fragments/PartnerHeader";
import styles from "../../../../styles/partner/campaign_application/campaign_application.module.css";
import layoutStyles from "../../../../styles/partner/layout.module.css";

// 신청자 데이터 타입 정의
interface Applicant {
  id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  channelIcon: string;
  memberType: "모범 회원" | "이용 제한";
  dailyVisits: number;
  totalVisits: number;
  neighbors: number;
  memo: string;
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정";
  channel: "네이버" | "네이버 인플루언서";
}

// 캠페인 정보 타입 정의
interface CampaignInfo {
  id: string;
  title: string;
  image: string;
  status: "모집 중" | "진행 중" | "종료";
  category: string;
  recruitmentPeriod: string;
  announcementDate: string;
  registrationPeriod: string;
  recruitedCount: number;
  totalCount: number;
  daysLeft: number;
}

// 임시 데이터 (실제로는 API에서 가져올 데이터)
const mockCampaignInfo: CampaignInfo = {
  id: "1",
  title: "SNS 미션 캠페인 [인스타그램 포스팅]",
  image: "/images/main/campaign_img/eximg_4.png",
  status: "모집 중",
  category: "미션형",
  recruitmentPeriod: "2025-09-02 ~ 2025-09-14",
  announcementDate: "2025-09-16",
  registrationPeriod: "2025-09-22 ~ 2025-09-30",
  recruitedCount: 30,
  totalCount: 60,
  daysLeft: 15,
};

const mockApplicants: Applicant[] = [
  {
    id: "1",
    nickname: "미션리뷰어1",
    userType: "리뷰어",
    profileImage: "/images/icons/phone_verified.svg",
    channelIcon: "/images/icons/phone_verified.svg",
    memberType: "모범 회원",
    dailyVisits: 160,
    totalVisits: 580000,
    neighbors: 1200,
    memo: "미션형 캠페인에 관심이 많습니다. 창의적이고 재미있는 미션을 수행하겠습니다.",
    selectionStatus: "미선택",
    channel: "네이버",
  },
  {
    id: "2",
    nickname: "미션인플루언서1",
    userType: "인플루언서",
    profileImage: "/images/icons/phone_verified.svg",
    channelIcon: "/images/icons/phone_verified.svg",
    memberType: "모범 회원",
    dailyVisits: 280,
    totalVisits: 1100000,
    neighbors: 3500,
    memo: "안녕하세요 :) 미션형 캠페인에 대한 경험이 풍부합니다. 감사히 사용하겠습니다.",
    selectionStatus: "미선택",
    channel: "네이버 인플루언서",
  },
  {
    id: "3",
    nickname: "미션리뷰어2",
    userType: "리뷰어",
    profileImage: "/images/icons/phone_verified.svg",
    channelIcon: "/images/icons/phone_verified.svg",
    memberType: "이용 제한",
    dailyVisits: 70,
    totalVisits: 120000,
    neighbors: 250,
    memo: "미션형 제품에 대한 경험이 많습니다.",
    selectionStatus: "이용제한 계정",
    channel: "네이버",
  },
];

/**
 * 미션형 캠페인 신청내역 페이지 컴포넌트
 */
export default function MissionCampaignApplicationPage() {
  // 탭 상태 관리 (신청/선정)
  const [activeTab, setActiveTab] = useState<"applicants" | "selected">(
    "applicants"
  );

  // 정렬 상태 관리
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  // 기본 헤더 숨기기 (PartnerHeader만 표시)
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    // 컴포넌트가 언마운트될 때 헤더 다시 표시
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  // 선정하기 버튼 클릭 핸들러
  const handleSelectApplicant = (applicantId: string) => {
    console.log("선정하기:", applicantId);
    // 실제로는 API 호출로 선정 처리
  };

  // 신청자 카드 컴포넌트
  const ApplicantCard = ({ applicant }: { applicant: Applicant }) => (
    <div className={styles.applicant_card}>
      {/* 프로필 영역 */}
      <div className={styles.profile_section}>
        <img
          src={applicant.profileImage}
          alt="프로필"
          className={styles.profile_image}
        />
        <div className={styles.profile_info}>
          <div className={styles.nickname}>{applicant.nickname}</div>
          <div className={styles.user_type}>{applicant.userType}</div>
        </div>
      </div>

      {/* 채널 아이콘 */}
      <div className={styles.channel_section}>
        <img
          src={applicant.channelIcon}
          alt="채널"
          className={styles.channel_icon}
        />
        <span className={styles.channel_id}>id</span>
      </div>

      {/* 회원 타입 */}
      <div className={styles.member_type}>{applicant.memberType}</div>

      {/* 통계 정보 */}
      <div className={styles.stats_section}>
        <div className={styles.stat_item}>
          <span className={styles.stat_label}>일방문</span>
          <span className={styles.stat_value}>
            {applicant.dailyVisits.toLocaleString()}
          </span>
        </div>
        <div className={styles.stat_item}>
          <span className={styles.stat_label}>총방문</span>
          <span className={styles.stat_value}>
            {applicant.totalVisits.toLocaleString()}
          </span>
        </div>
        <div className={styles.stat_item}>
          <span className={styles.stat_label}>이웃수</span>
          <span className={styles.stat_value}>
            {applicant.neighbors.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 메모 영역 */}
      <div className={styles.memo_section}>
        <div className={styles.memo_text}>{applicant.memo}</div>
        <div className={styles.memo_divider}></div>
      </div>

      {/* 액션 버튼 */}
      <div className={styles.action_button}>
        {applicant.selectionStatus === "미선택" && (
          <button
            className={styles.select_button}
            onClick={() => handleSelectApplicant(applicant.id)}
          >
            선정하기
          </button>
        )}
        {applicant.selectionStatus === "이용제한 계정" && (
          <button className={styles.restricted_button} disabled>
            이용 제한 계정
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={layoutStyles.container}>
      {/* 파트너 헤더 */}
      <PartnerHeader />

      {/* 메인 콘텐츠 */}
      <div className={layoutStyles.main_content}>
        {/* 페이지 제목 */}
        <div className={styles.page_header}>
          <h1 className={styles.page_title}>미션형 캠페인 신청 내역</h1>
        </div>

        {/* 캠페인 정보 카드 */}
        <div className={styles.campaign_info_card}>
          <div className={styles.campaign_image}>
            <img src={mockCampaignInfo.image} alt="캠페인 이미지" />
          </div>

          <div className={styles.campaign_details}>
            <div className={styles.campaign_header}>
              <div className={styles.campaign_category}>
                <img
                  src="/images/icons/phone_verified.svg"
                  alt="카테고리 아이콘"
                />
                <span>{mockCampaignInfo.category}</span>
              </div>
              <div className={styles.campaign_status}>
                {mockCampaignInfo.status}
              </div>
            </div>

            <h2 className={styles.campaign_title}>{mockCampaignInfo.title}</h2>
            <p className={styles.campaign_notice}>
              캠페인 선정 발표까지 {mockCampaignInfo.daysLeft}일 남았습니다.
            </p>
          </div>

          <div className={styles.campaign_schedule}>
            <div className={styles.schedule_item}>
              <span className={styles.schedule_label}>모집 인원</span>
              <span className={styles.schedule_value}>
                <strong>{mockCampaignInfo.recruitedCount}명</strong> /{" "}
                {mockCampaignInfo.totalCount}명
              </span>
            </div>
            <div className={styles.schedule_item}>
              <span className={styles.schedule_label}>모집 기간</span>
              <span className={styles.schedule_value}>
                {mockCampaignInfo.recruitmentPeriod}
              </span>
            </div>
            <div className={styles.schedule_item}>
              <span className={styles.schedule_label}>선정 발표</span>
              <span className={styles.schedule_value}>
                {mockCampaignInfo.announcementDate}
              </span>
            </div>
            <div className={styles.schedule_item}>
              <span className={styles.schedule_label}>등록 기간</span>
              <span className={styles.schedule_value}>
                {mockCampaignInfo.registrationPeriod}
              </span>
            </div>
          </div>
        </div>

        {/* 필터 및 다운로드 버튼 */}
        <div className={styles.filter_section}>
          <button className={styles.download_button}>
            <img src="/images/icons/phone_verified.svg" alt="다운로드" />
            신청자 목록 다운로드
          </button>
          <button className={styles.download_button}>
            <img src="/images/icons/phone_verified.svg" alt="다운로드" />
            선정자 목록 다운로드
          </button>
          <div className={styles.sort_filter}>
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "latest" | "oldest")
              }
              className={styles.sort_select}
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className={styles.tab_navigation}>
          <button
            className={`${styles.tab_button} ${
              activeTab === "applicants" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("applicants")}
          >
            신청 <span className={styles.tab_count}>18</span>
          </button>
          <button
            className={`${styles.tab_button} ${
              activeTab === "selected" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("selected")}
          >
            선정 <span className={styles.tab_count}>6</span>
          </button>
        </div>

        {/* 신청자 목록 그리드 */}
        <div className={styles.applicants_grid}>
          {mockApplicants.map((applicant) => (
            <ApplicantCard key={applicant.id} applicant={applicant} />
          ))}
        </div>
      </div>
    </div>
  );
}
