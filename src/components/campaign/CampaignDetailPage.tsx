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

import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SubHeader from "@/components/fragments/SubHeader";
import MainMenu from "@/components/main/MainMenu";
import DetailHeader from "@/components/user/campaign_detail/DetailHeader";
import DetailProductInfo from "@/components/user/campaign_detail/DetailProductInfo";
import DetailScheduleInfo from "@/components/user/campaign_detail/DetailScheduleInfo";
import DetailImage from "@/components/user/campaign_detail/DetailImage";
import CampaignApplyButton from "@/components/user/campaign_detail/CampaignApplyButton";
import styles from "@/styles/user/campaign/campaign_detail.module.css";
import { useCampaignDetailScroll } from "@/hooks/common/campaign/useCampaignDetailScroll";
import { calculateDayCount } from "@/utils/campaignDayCount";

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
  dayCount?: string; // 남은 일수 또는 긴급 상태 (예: "D-5", "긴급", "마감임박")
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
  // ApplicationModal 컴포넌트 렌더 함수 (isOpen, onClose, campaign을 받아서 모달 컴포넌트 반환)
  // campaign 객체에서 dayCount, channel 등의 정보를 추출하여 모달에 전달
  renderApplicationModal: (
    isOpen: boolean,
    onClose: () => void,
    campaign: BaseCampaign
  ) => ReactNode;
  // 이미 참여한 캠페인인지 여부 (기본값: false)
  isParticipated?: boolean;
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
  isParticipated = false,
}: CampaignDetailPageProps) {
  // 스크롤 이벨 고정 훅 사용
  const { isCampaignInfoFixed, campaignInfoLabelRef } =
    useCampaignDetailScroll();

  // 현재 경로 확인 (뒤로가기 감지용)
  const pathname = usePathname();

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 오늘 날짜와 신청 기간(applicationStart, applicationEnd)을 기준으로
  // 남은 일수/상태 텍스트(dayCount)를 계산합니다.
  const computedDayCount = calculateDayCount(
    campaign.detailedSchedule.applicationStart,
    campaign.detailedSchedule.applicationEnd,
    campaign.dayCount
  );

  // 계산된 dayCount 를 포함한 캠페인 객체 (긴급/마감/오픈 예정 계산 반영)
  const campaignWithDayCount: BaseCampaign = {
    ...campaign,
    dayCount: computedDayCount,
  };

  // 뒤로가기 시 모달 상태 복원 (sessionStorage 확인)
  // pathname이 변경될 때마다 확인하여 뒤로가기 감지
  useEffect(() => {
    // sessionStorage에서 모달 열기 플래그 확인
    const shouldOpen = sessionStorage.getItem("shouldOpenApplicationModal");
    if (shouldOpen === "true") {
      // 약간의 지연을 두어 페이지 렌더링 후 모달 열기
      setTimeout(() => {
        setIsModalOpen(true);
        // sessionStorage에서 플래그 제거 (한 번만 실행되도록)
        sessionStorage.removeItem("shouldOpenApplicationModal");
      }, 100);
    }
  }, [pathname]); // pathname이 변경될 때마다 실행 (뒤로가기 감지)

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
          channel={campaignWithDayCount.channel}
          category={campaignWithDayCount.category}
          subcategory={campaignWithDayCount.subcategory}
          {...(campaignWithDayCount.region
            ? { region: campaignWithDayCount.region }
            : {})}
          points={campaignWithDayCount.points}
          altText={altText}
          dayCount={campaignWithDayCount.dayCount}
        />

        {/* 제품 정보 */}
        <DetailProductInfo
          title={campaignWithDayCount.title}
          description={campaignWithDayCount.description}
          image={campaignWithDayCount.image}
        >
          {/* 캠페인 일정 정보 */}
          <DetailScheduleInfo
            currentRecruitment={campaignWithDayCount.recruitment.current}
            totalRecruitment={campaignWithDayCount.recruitment.total}
            applicationStart={
              campaignWithDayCount.detailedSchedule.applicationStart
            }
            applicationEnd={
              campaignWithDayCount.detailedSchedule.applicationEnd
            }
            announcement={campaignWithDayCount.detailedSchedule.announcement}
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
      <CampaignApplyButton
        applicationStart={
          campaignWithDayCount.detailedSchedule.applicationStart
        }
        applicationEnd={campaignWithDayCount.detailedSchedule.applicationEnd}
        dayCount={campaignWithDayCount.dayCount}
        isParticipated={isParticipated}
        onApply={() => setIsModalOpen(true)}
      />

      {/* 신청 모달 */}
      {renderApplicationModal(
        isModalOpen,
        () => {
          setIsModalOpen(false);
          // 모달이 닫힐 때 sessionStorage 정리
          sessionStorage.removeItem("shouldOpenApplicationModal");
        },
        campaignWithDayCount
      )}
    </>
  );
}
