"use client";

// 캠페인 상세 페이지 (Next.js 동적 라우팅)
// 이 파일은 Next.js App Router의 동적 라우팅을 사용합니다
// [id] 폴더명은 동적 세그먼트를 의미합니다
// 예: /campaign/1, /campaign/2, /campaign/abc 등 모든 경로가 이 페이지로 매핑됩니다

// Next.js의 notFound 함수 import
// 캠페인을 찾을 수 없을 때 404 페이지를 표시하기 위해 사용합니다
import { notFound } from "next/navigation";
import { useEffect, use, useState, useRef } from "react";
import SubHeader from "@/components/fragments/SubHeader";
import ApplicationModal from "@/components/campaign/ApplicationModal";

// CSS 모듈 import
import styles from "../../../styles/campaign/campaign_detail.module.css";
import { mockCampaigns_1 } from "@/data/main/mainFirstCampaigns";
import { mockCampaigns_2 } from "@/data/main/mainSecondCampaigns";
import MainMenu from "@/components/main/MainMenu";
import DetailHeader from "@/components/campaign_detail/DetailHeader";
import DetailProductInfo from "@/components/campaign_detail/DetailProductInfo";
import DetailScheduleInfo from "@/components/campaign_detail/DetailScheduleInfo";
import DetailImage from "@/components/campaign_detail/DetailImage";
import DetailGuidelinesSection from "@/components/campaign_detail/DetailGuidelinesSection";

// TypeScript 인터페이스 정의
// Next.js App Router에서 동적 라우팅의 params 타입을 정의합니다
interface CampaignDetailPageProps {
  params: Promise<{
    id: string; // URL에서 추출된 동적 세그먼트 값
    // 예: /campaign/123 접근 시 params.id = "123"
  }>;
}

// React 함수형 컴포넌트 (기본 export)
// Next.js App Router에서 이 컴포넌트가 페이지가 됩니다
export default function CampaignDetailPage({
  params, // Next.js에서 자동으로 전달하는 params 객체
}: CampaignDetailPageProps) {
  // Next.js 15에서 params는 Promise이므로 React.use()로 unwrap
  const resolvedParams = use(params);

  // ========================================
  // 1. 데이터 및 상태 관리
  // ========================================

  // URL에서 추출된 ID로 캠페인 데이터 조회
  // 모든 캠페인 배열에서 해당 ID를 가진 캠페인을 찾습니다
  const allCampaigns = [...mockCampaigns_1, ...mockCampaigns_2];
  const campaign = allCampaigns.find((c) => c.id === resolvedParams.id);

  // 모달 열림 상태 관리
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

  // 캠페인을 찾을 수 없는 경우 404 페이지 표시
  // Next.js의 notFound() 함수를 호출하면 not-found.tsx 페이지가 표시됩니다
  if (!campaign) {
    notFound();
  }

  // ========================================
  // 3. Side Effects (부수 효과)
  // ========================================

  // 메인 헤더 숨기기 (SubHeader만 표시)
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }

    // 컴포넌트 언마운트 시 헤더 다시 보이기
    return () => {
      if (header) {
        header.style.display = "block";
      }
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
        {/* 태그 및 포인트 */}
        <DetailHeader
          categoryIcon={campaign.categoryIcon}
          category={campaign.category}
          subcategory={campaign.subcategory}
          points={campaign.points}
          altText="campaign_tag"
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
        <DetailGuidelinesSection
          description={campaign.description}
          requirements={[
            {
              icon: "/images/campaign_detail/keyword_icon.svg",
              alt: "키워드아이콘",
              text: "키워드 삽입",
            },
            {
              icon: "/images/campaign_detail/product_link_icon.svg",
              alt: "제품링크아이콘",
              text: "제품 링크 삽입",
            },
            {
              icon: "/images/campaign_detail/text_icon.svg",
              alt: "텍스트아이콘",
              text: "1,500자 이상",
            },
            {
              icon: "/images/campaign_detail/photo_icon.svg",
              alt: "사진아이콘",
              text: "10장 이상",
            },
            {
              icon: "/images/campaign_detail/video_icon.svg",
              alt: "비디오아이콘",
              text: "1개 이상",
            },
          ]}
          guidelineTexts={[
            "리뷰 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
            "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
            "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
            "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
            "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
          ]}
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
