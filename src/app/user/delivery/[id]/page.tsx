// 배송형 상세 페이지

"use client";

import { notFound } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import SubHeader from "@/components/fragments/SubHeader";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import styles from "../../../../styles/user/campaign/campaign_detail.module.css";
import { deliveryCampaigns } from "@/data/user/delivery/deliveryCampaigns";
import MainMenu from "@/components/main/MainMenu";
import DetailHeader from "@/components/user/campaign_detail/DetailHeader";
import DetailProductInfo from "@/components/user/campaign_detail/DetailProductInfo";
import DetailScheduleInfo from "@/components/user/campaign_detail/DetailScheduleInfo";
import DetailImage from "@/components/user/campaign_detail/DetailImage";
import DetailGuidelinesSectionDelivery from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionDelivery";

interface DeliveryDetailPageProps {
  params: { id: string };
}

export default function DeliveryDetailPage({
  params,
}: DeliveryDetailPageProps) {
  const campaign = deliveryCampaigns.find((c) => String(c.id) === params.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 캠페인 정보 라벨 고정 상태 관리
  const [isCampaignInfoFixed, setIsCampaignInfoFixed] = useState(false);

  // 캠페인 정보 라벨 요소에 대한 참조 (useRef)
  const campaignInfoLabelRef = useRef<HTMLDivElement>(null);

  // 캠페인 정보 라벨의 초기 위치를 저장 (한 번만 계산)
  const initialLabelPositionRef = useRef<number | null>(null);

  if (!campaign) return notFound();

  // 메인 헤더 숨기기 (캠페인 상세와 동일 동작)
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  // 초기 로드 시 캠페인 정보 라벨의 위치를 한 번만 저장
  useEffect(() => {
    // DOM이 완전히 로드된 후 위치 계산
    const timer = setTimeout(() => {
      if (
        campaignInfoLabelRef.current &&
        initialLabelPositionRef.current === null
      ) {
        // 라벨의 절대 위치를 저장
        // 이 시점에서는 MainMenu가 fixed로 고정되어 있음
        const rect = campaignInfoLabelRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        // 페이지 최상단부터 라벨까지의 실제 거리
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

      // 캠페인 정보 라벨 고정: 스크롤이 트리거 포인트에 도달했을 때
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
          categoryIcon={campaign.categoryIcon}
          category={campaign.category}
          subcategory={campaign.subcategory}
          points={campaign.points}
          altText="delivery_tag"
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
                label: "구매 기간",
                value: campaign.detailedSchedule.purchasePeriod,
              },
              {
                label: "등록 기간",
                value: campaign.detailedSchedule.registrationPeriod,
              },
            ]}
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
        <DetailGuidelinesSectionDelivery
          description={campaign.description}
          promotionLink={campaign.promotionLink}
          keyword={campaign.keyword}
          onCopyPromotionLink={() => {
            if (campaign.promotionLink) {
              navigator.clipboard.writeText(campaign.promotionLink);
              alert("홍보링크가 복사되었습니다!");
            }
          }}
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
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
