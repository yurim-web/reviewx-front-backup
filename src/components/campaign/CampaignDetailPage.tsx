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
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import MainMenu from "@/components/main/MainMenu";
import DetailHeader from "@/components/user/campaign_detail/DetailHeader";
import DetailProductInfo from "@/components/user/campaign_detail/DetailProductInfo";
import DetailScheduleInfo from "@/components/user/campaign_detail/DetailScheduleInfo";
import DetailImage from "@/components/user/campaign_detail/DetailImage";
import CampaignApplyButton from "@/components/user/campaign_detail/CampaignApplyButton";
import BaseModal from "@/components/common/modal/BaseModal";
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
  dayCount?: string; // 남은 일수 또는 상태 (예: "D-5", "마감임박")
  isUrgent?: boolean; // 긴급 캠페인 여부 (기본값: false)
  adultOnly?: boolean; // 성인 전용 여부 (만 19세 이상만 참여 가능)
  [key: string]: any;
}

// 컴포넌트 props 타입
interface CampaignDetailPageProps {
  // 캠페인 데이터 (없을 수 있음 - 조회 실패 시 null)
  campaign: BaseCampaign | null;
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
  // 로그인 상태 (기본값: true)
  isLoggedIn?: boolean;
  // 미성년자 여부 (기본값: false)
  isMinor?: boolean;
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
  isLoggedIn = true,
  isMinor = false,
}: CampaignDetailPageProps) {
  // 스크롤 이벨 고정 훅 사용
  const { isCampaignInfoFixed, campaignInfoLabelRef } =
    useCampaignDetailScroll();

  // 현재 경로 확인 (뒤로가기 감지용)
  const pathname = usePathname();

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 파트너 여부 확인 및 파트너 신청 불가 모달 상태
  const [isPartner, setIsPartner] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  // 캠페인 데이터 조회 실패 에러 모달 상태
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // 미성년자 차단 모달 상태
  const [isMinorBlockModalOpen, setIsMinorBlockModalOpen] = useState(false);

  // 캠페인 데이터가 없으면 에러 모달 표시
  useEffect(() => {
    if (!campaign) {
      setIsErrorModalOpen(true);
    }
  }, [campaign]);

  // 미성년자가 성인 인증이 필요한 캠페인 조회 시 차단 모달 표시
  useEffect(() => {
    if (campaign && campaign.adultOnly === true && isMinor === true) {
      setIsMinorBlockModalOpen(true);
    }
  }, [campaign, isMinor]);

  // 캠페인 데이터가 없으면 렌더링하지 않음 (에러 모달만 표시)
  if (!campaign) {
    return (
      <>
        {/* 서브헤더: 항상 상단에 고정 */}
        {/* 📌 조건부 렌더링:
            - 파트너인 경우 PartnerSubHeader 사용
            - 일반 사용자인 경우 SubHeader 사용
        */}
        {isPartner ? <PartnerSubHeader /> : <SubHeader />}
        {/* 에러 모달 */}
        <BaseModal
          is_open={isErrorModalOpen}
          on_close={() => setIsErrorModalOpen(false)}
          message="오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
          buttons={["확인"]}
        />
      </>
    );
  }

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
    // isUrgent는 원본 campaign에서 가져옴 (dayCount 계산과 무관)
    isUrgent: campaign.isUrgent,
  };

  // 파트너 여부 확인 (sessionStorage와 document.referrer 모두 확인)
  // 파트너 페이지(/partner)에서 온 경우 파트너로 판단
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1순위: sessionStorage에서 headerContext 확인 (ConditionalHeader에서 저장한 값)
    const savedContext = sessionStorage.getItem("headerContext");
    if (savedContext === "partner") {
      setIsPartner(true);
      return;
    }

    // 2순위: document.referrer 확인: 파트너 페이지에서 온 경우
    const referrer = document.referrer;
    if (referrer && referrer.includes("/partner")) {
      setIsPartner(true);
      // sessionStorage에도 저장하여 다음에도 사용
      sessionStorage.setItem("headerContext", "partner");
      return;
    }

    // 3순위: URL 쿼리 파라미터 확인 (추가 확인 방법)
    const urlParams = new URLSearchParams(window.location.search);
    const userType = urlParams.get("user");
    if (userType === "partner") {
      setIsPartner(true);
      // sessionStorage에도 저장하여 다음에도 사용
      sessionStorage.setItem("headerContext", "partner");
      return;
    }

    // 기본값: 유저
    setIsPartner(false);
  }, [pathname]);

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

  /**
   * 캠페인 신청 버튼 클릭 핸들러
   *
   * 설명:
   * - 파트너인 경우: BaseModal을 사용하여 신청 불가 메시지 표시
   * - 유저인 경우: 기존 ApplicationModal 표시
   */
  const handleApplyClick = () => {
    if (isPartner) {
      // 파트너인 경우 신청 불가 모달 표시
      setIsPartnerModalOpen(true);
    } else {
      // 유저인 경우 기존 신청 모달 표시
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* 서브헤더: 항상 상단에 고정 */}
      {/* 📌 조건부 렌더링:
          - 파트너인 경우 PartnerSubHeader 사용
          - 일반 사용자인 경우 SubHeader 사용
          - isPartner는 document.referrer를 통해 파트너 페이지에서 온 경우 true로 설정됨
      */}
      {isPartner ? <PartnerSubHeader /> : <SubHeader />}

      {/*
        메인 카테고리 메뉴: 캠페인 상세 페이지에서는 표시하지 않음
        TODO: 추후 디자인 변경 시 다시 활성화
      */}
      {/* {!isCampaignInfoFixed && (
        <div className={styles.main_menu_fixed_container}>
          <MainMenu />
        </div>
      )} */}

      {/*
        레이아웃 시프트 방지를 위한 placeholder
        - MainMenu 제거로 인해 SubHeader(80px)만 = 80px
      */}
      <div className={styles.layout_placeholder_fixed}></div>

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
          isUrgent={campaignWithDayCount.isUrgent}
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
        {isCampaignInfoFixed && (
          <div className={styles.campaign_info_placeholder}></div>
        )}

        {/* 상세 이미지 */}
        <DetailImage 
          image={campaign.campaign_detail_image} 
          images={campaign.campaign_detail_images}
        />

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
        isUrgent={campaignWithDayCount.isUrgent}
        isParticipated={isParticipated}
        isLoggedIn={isLoggedIn}
        onApply={handleApplyClick}
      />

      {/* 파트너 신청 불가 모달 */}
      <BaseModal
        is_open={isPartnerModalOpen}
        on_close={() => setIsPartnerModalOpen(false)}
        message="파트너 계정은 캠페인 신청이 불가합니다."
        buttons={["닫기"]}
      />

      {/* 캠페인 데이터 조회 실패 에러 모달 */}
      <BaseModal
        is_open={isErrorModalOpen}
        on_close={() => setIsErrorModalOpen(false)}
        message="오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
        buttons={["확인"]}
      />

      {/* 미성년자 차단 모달 */}
      <BaseModal
        is_open={isMinorBlockModalOpen}
        on_close={() => setIsMinorBlockModalOpen(false)}
        message="해당 캠페인은 만 19세 이상만<br>참여할 수 있습니다."
        buttons={["닫기"]}
      />

      {/* 신청 모달 (유저만 사용) */}
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
