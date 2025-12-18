/**
 * 캠페인 상세 페이지 공용 컴포넌트
 *
 * 사용 파일:
 * - src/app/campaign/delivery/[id]/page.tsx
 * - src/app/campaign/mission/[id]/page.tsx
 * - src/app/campaign/reporter/[id]/page.tsx
 * - src/app/campaign/review/[id]/page.tsx
 * - src/app/campaign/visit/[id]/page.tsx
 *
 * 주요 기능:
 * - 공통 레이아웃 구조 제공 (SubHeader, MainMenu, DetailHeader 등)
 * - 스크롤 이벨 고정 처리
 * - 하단 고정 신청 버튼
 */

"use client";

import { ReactNode, useState } from "react";
import SubHeader from "@/components/fragments/SubHeader";
import MainMenu from "@/components/main/MainMenu";
import DetailHeader from "@/components/user/campaign_detail/DetailHeader";
import DetailProductInfo from "@/components/user/campaign_detail/DetailProductInfo";
import DetailScheduleInfo from "@/components/user/campaign_detail/DetailScheduleInfo";
import DetailImage from "@/components/user/campaign_detail/DetailImage";
import styles from "@/styles/user/campaign/campaign_detail.module.css";
import { useCampaignDetailScroll } from "@/hooks/common/campaign/useCampaignDetailScroll";

// 캠페인 기본 타입
interface BaseCampaign {
  id: string;
  title: string;
  category: string;
  categoryIcon?: string;
  image: string;
  subcategory: string;
  points: number;
  description: string;
  recruitment: {
    current: number;
    total: number;
  };
  detailedSchedule: {
    applicationStart: string;
    applicationEnd: string;
    announcement: string;
    [key: string]: any;
  };
  campaign_detail_image: string;
  region?: string; // 방문형만
  [key: string]: any;
}

// 컴포넌트 props 타입
interface CampaignDetailPageProps {
  // 캠페인 데이터
  campaign: BaseCampaign;
  // DetailHeader의 altText
  altText: string;
  // DetailScheduleInfo의 additionalSchedules
  additionalSchedules?: Array<{ label: string; value: string }>;
  // Guidelines 컴포넌트 (각 타입별로 다름)
  guidelinesComponent: ReactNode;
  // ApplicationModal 컴포넌트 렌더 함수 (isOpen, onClose를 받아서 모달 컴포넌트 반환)
  renderApplicationModal: (isOpen: boolean, onClose: () => void) => ReactNode;
}

/**
 * 캠페인 상세 페이지 공용 컴포넌트
 *
 * @param campaign - 캠페인 데이터
 * @param altText - DetailHeader의 altText
 * @param additionalSchedules - DetailScheduleInfo의 추가 일정 정보
 * @param guidelinesComponent - Guidelines 컴포넌트
 * @param renderApplicationModal - ApplicationModal 컴포넌트 렌더 함수
 */
export default function CampaignDetailPage({
  campaign,
  altText,
  additionalSchedules = [],
  guidelinesComponent,
  renderApplicationModal,
}: CampaignDetailPageProps) {
  // 스크롤 이벨 고정 훅 사용
  const { isCampaignInfoFixed, campaignInfoLabelRef } =
    useCampaignDetailScroll();

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* 서브헤더: 항상 상단에 고정 */}
      <SubHeader />

      {/* 
        메인 카테고리 메뉴: SubHeader(80px) 아래에 고정 
        캠페인 정보 라벨이 고정되면 숨김 (isCampaignInfoFixed가 true일 때)
      */}
      {!isCampaignInfoFixed && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            left: 0,
            right: 0,
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            backgroundColor: "white",
            zIndex: 99,
          }}
        >
          <MainMenu />
        </div>
      )}

      {/* 
        레이아웃 시프트 방지를 위한 placeholder 
        - 캠페인 정보 라벨이 고정되지 않았을 때: SubHeader(80px) + MainMenu(약 69px) = 149px
        - 캠페인 정보 라벨이 고정되었을 때: SubHeader(80px)만 = 80px
      */}
      <div style={{ height: isCampaignInfoFixed ? "80px" : "149px" }}></div>

      <section className={styles.campaign_detail_container}>
        {/* 태그 및 포인트 */}
        <DetailHeader
          categoryIcon={campaign.categoryIcon || ""}
          category={campaign.category}
          subcategory={campaign.subcategory}
          {...(campaign.region ? { region: campaign.region } : {})}
          points={campaign.points}
          altText={altText}
        />

        {/* 제품 정보 */}
        <DetailProductInfo
          title={campaign.title}
          description={campaign.description}
          image={campaign.image}
        >
          {/* 캠페인 일정 정보 */}
          <DetailScheduleInfo
            currentRecruitment={campaign.recruitment.current}
            totalRecruitment={campaign.recruitment.total}
            applicationStart={campaign.detailedSchedule.applicationStart}
            applicationEnd={campaign.detailedSchedule.applicationEnd}
            announcement={campaign.detailedSchedule.announcement}
            additionalSchedules={additionalSchedules}
          />
        </DetailProductInfo>

        {/* 캠페인 정보 섹션 라벨 */}
        {/* 스크롤이 이 요소에 도달하면 fixed 클래스 추가하여 상단 고정 */}
        <div
          ref={campaignInfoLabelRef}
          className={`${styles.campaign_info_text_line} ${
            isCampaignInfoFixed ? styles.fixed : ""
          }`}
        >
          캠페인 정보
        </div>

        {/* 캠페인 정보가 fixed될 때 레이아웃 시프트 방지용 placeholder */}
        {isCampaignInfoFixed && <div style={{ height: "101px" }}></div>}

        {/* 상세 이미지 */}
        <DetailImage image={campaign.campaign_detail_image} />

        {/* 안내 사항들 */}
        {guidelinesComponent}
      </section>

      {/* 하단 고정 영역: 그라데이션 + 신청 버튼 */}
      <div className={styles.bottom_gradient}></div>
      <div className={styles.bottom_fixed_container}>
        <button
          className={styles.apply_button}
          onClick={() => setIsModalOpen(true)}
        >
          캠페인 신청하기
        </button>
      </div>

      {/* 신청 모달 */}
      {renderApplicationModal(isModalOpen, () => setIsModalOpen(false))}
    </>
  );
}

