/* ========================================
   🎯 미션형 캠페인 상세 페이지
   ======================================== */

/**
 * 미션형 캠페인 상세 페이지
 *
 * 목적: 미션형 캠페인의 상세 정보를 보여주고 신청할 수 있는 상세 페이지입니다.
 *
 * 페이지 경로:
 * - /user/mission/[id] (동적 라우팅)
 *
 * 사용 파일:
 * - 컴포넌트: SubHeader, ApplicationModalType3, MainMenu, DetailHeader, DetailProductInfo, DetailScheduleInfo, DetailImage, DetailGuidelinesSectionMission
 * - 데이터: missionCampaigns
 * - CSS: campaign_detail.module.css
 *
 * 주요 기능:
 * - 미션형 캠페인 상세 정보 표시
 * - 스크롤 시 캠페인 정보 라벨 상단 고정
 * - 캠페인 신청 모달 (Type3)
 * - 키워드 복사 기능
 * - 하단 고정 신청 버튼
 */

"use client";

import { notFound } from "next/navigation";
import { useEffect, useState, useRef, use } from "react";
import SubHeader from "@/components/fragments/SubHeader";
import ApplicationModalType3 from "@/components/user/campaign_detail/modal/ApplicationModalType3";
import styles from "../../../../styles/user/campaign/campaign_detail.module.css";
import { missionCampaigns } from "@/data/user/mission/missionCampaigns";
import MainMenu from "@/components/main/MainMenu";
import DetailHeader from "@/components/user/campaign_detail/DetailHeader";
import DetailProductInfo from "@/components/user/campaign_detail/DetailProductInfo";
import DetailScheduleInfo from "@/components/user/campaign_detail/DetailScheduleInfo";
import DetailImage from "@/components/user/campaign_detail/DetailImage";
import DetailGuidelinesSectionMission from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionMission";

interface MissionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MissionDetailPage({ params }: MissionDetailPageProps) {
  // ========================================
  // 1. 데이터 및 상태 관리
  // ========================================

  // Next.js 15에서 params는 Promise이므로 React.use()로 unwrap
  const { id } = use(params);

  // URL의 id와 일치하는 캠페인 데이터 찾기
  const campaign = missionCampaigns.find((c) => String(c.id) === id);

  // 신청 모달 표시 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 캠페인 정보 라벨 고정 상태 관리 (스크롤 시 상단 고정 여부)
  const [isCampaignInfoFixed, setIsCampaignInfoFixed] = useState(false);

  // ========================================
  // 2. Refs (DOM 참조)
  // ========================================

  // 캠페인 정보 라벨 요소에 대한 참조
  // useRef: 컴포넌트가 리렌더링되어도 값이 유지되는 변수
  const campaignInfoLabelRef = useRef<HTMLDivElement>(null);

  // 캠페인 정보 라벨의 초기 위치를 저장 (페이지 최상단부터의 거리)
  const initialLabelPositionRef = useRef<number | null>(null);

  // 캠페인 데이터가 없으면 404 페이지로 이동
  if (!campaign) return notFound();

  // ========================================
  // 3. Side Effects (부수 효과)
  // ========================================

  // 메인 헤더 숨기기 (SubHeader만 표시)
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    // 컴포넌트가 언마운트될 때 헤더 다시 표시
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  // 초기 로드 시 캠페인 정보 라벨의 위치를 한 번만 저장
  useEffect(() => {
    // DOM이 완전히 로드된 후 위치 계산 (100ms 딜레이)
    const timer = setTimeout(() => {
      if (
        campaignInfoLabelRef.current &&
        initialLabelPositionRef.current === null
      ) {
        // 라벨의 현재 화면상 위치 가져오기
        const rect = campaignInfoLabelRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;

        // 페이지 최상단부터 라벨까지의 실제 거리 계산
        const absolutePosition = rect.top + scrollY;
        initialLabelPositionRef.current = absolutePosition;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 스크롤 이벤트: 캠페인 정보 라벨 고정 제어
  useEffect(() => {
    const handleScroll = () => {
      // 초기 위치가 아직 계산되지 않았으면 종료
      if (initialLabelPositionRef.current === null) return;

      const scrollY = window.scrollY;

      // SubHeader의 높이만큼 빼기 (80px)
      // 캠페인 정보 라벨이 화면 상단 80px 위치(SubHeader 바로 아래)에 도달하면 고정
      const triggerPoint = initialLabelPositionRef.current - 80;

      // 스크롤이 트리거 포인트에 도달했을 때 라벨 고정
      if (scrollY >= triggerPoint) {
        setIsCampaignInfoFixed(true);
      } else {
        setIsCampaignInfoFixed(false);
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);

    // 초기 로드 시에도 한 번 실행 (새로고침 시 스크롤 위치 복원 대응)
    handleScroll();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거 (메모리 누수 방지)
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ========================================
  // 4. 렌더링
  // ========================================

  return (
    <>
      {/* 서브헤더: 항상 상단에 고정 (position: fixed, top: 0) */}
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
        <DetailHeader
          categoryIcon={campaign.categoryIcon}
          category={campaign.category}
          subcategory={campaign.subcategory}
          points={campaign.points}
          altText="mission_tag"
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
            additionalSchedules={[
              {
                label: "등록 기간",
                value: campaign.detailedSchedule.registrationPeriod,
              },
            ]}
          />
        </DetailProductInfo>

        {/* 
          캠페인 정보 섹션 라벨 
          스크롤이 이 요소에 도달하면 fixed 클래스 추가하여 상단 고정 
        */}
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
        <DetailGuidelinesSectionMission
          description={campaign.description}
          productLink={campaign.productLink}
          onCopyProductLink={() => {
            if (campaign.productLink) {
              navigator.clipboard.writeText(campaign.productLink);
              alert("홍보링크가 복사되었습니다!");
            }
          }}
          keyword={campaign.keyword}
          onCopyKeyword={() => {
            navigator.clipboard.writeText(campaign.keyword);
            alert("키워드가 복사되었습니다!");
          }}
          requirements={campaign.requirements}
          guidelineTexts={campaign.guidelineTexts}
        />
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
      <ApplicationModalType3
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
