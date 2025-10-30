/* ========================================
   📰 기자단 캠페인 신청내역 페이지 (동적)
   ======================================== */

/**
 * 기자단 캠페인 신청내역 페이지 (동적)
 *
 * 목적: 파트너가 생성한 특정 기자단 캠페인에 신청한 사용자들의 목록을 확인하고 관리하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign_application/reporter/[id] (동적 라우팅)
 * - 예: /partner/campaign_application/reporter/reporter_001
 *
 * 주요 기능:
 * - URL 파라미터로 특정 캠페인 선택
 * - 선택된 캠페인의 기본 정보 표시 (제목, 이미지, 상태, 일정 등)
 * - 해당 캠페인의 신청자/선정자 탭 네비게이션
 * - 신청자 목록 그리드 표시 (프로필, 통계, 메모 등)
 * - 선정하기/이용제한 버튼 기능
 * - 필터링 및 정렬 기능
 * - 목록 다운로드 기능
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import PartnerHeader from "@/components/fragments/PartnerHeader";
import Loading from "@/app/loading";
import styles from "@/styles/partner/campaign_application/campaign_application.module.css";
import SortFilterControl from "@/components/partner/campaign_application/SortFilterControl";

import layoutStyles from "@/styles/partner/layout.module.css";
import Campaignbanner from "@/components/partner/campaign_application/CampaignInfoBox";
import ExcelDownloadBtn from "@/components/partner/campaign_application/ExcelDownloadBtn";
import PartnerSortModalFilter from "@/components/partner/campaign_application/PartnerSortModalFilter";

// 기자단 카드 컴포넌트들 import (채널별)
import NaverBlogCard from "@/components/partner/campaign_application/card_type/naverblog/NaverBlogCard";
import NaverClipCard from "@/components/partner/campaign_application/card_type/naverclip/NaverClipCard";
import NaverClipSelectedCard from "@/components/partner/campaign_application/card_type/naverclip/NaverClipSelectedCard";
import InstagramCard from "@/components/partner/campaign_application/card_type/instagram/InstagramCard";
import InstagramSelectedCard from "@/components/partner/campaign_application/card_type/instagram/InstagramSelectedCard";
import YoutubeCard from "@/components/partner/campaign_application/card_type/youtube/YoutubeCard";
import YoutubeSelectedCard from "@/components/partner/campaign_application/card_type/youtube/YoutubeSelectedCard";
import ReelsCard from "@/components/partner/campaign_application/card_type/reels/ReelsCard";
import ReelsSelectedCard from "@/components/partner/campaign_application/card_type/reels/ReelsSelectedCard";
import ShortsCard from "@/components/partner/campaign_application/card_type/shorts/ShortsCard";
import ShortsSelectedCard from "@/components/partner/campaign_application/card_type/shorts/ShortsSelectedCard";

// 📦 캠페인별 데이터 import (공용 데이터 직접 사용)
import {
  getCampaignById,
  type CampaignWithApplicants,
  type AllApplicant,
} from "@/data/partner/sharedCampaigns";

// 개별 신청자 타입들 import (카드 컴포넌트에서 사용)
import {
  type Applicant,
  type NaverClipApplicant,
  type InstagramApplicant,
  type YoutubeApplicant,
} from "@/data/partner/campaign_application/delivery_applicants";

/**
 * 기자단 캠페인 신청내역 페이지 컴포넌트 (동적)
 *
 * 🎓 학습 포인트: 동적 라우팅과 데이터 로딩
 *
 * 📌 Next.js 동적 라우팅:
 * 1. [id] 폴더명으로 동적 라우팅 설정
 * 2. useParams() 훅으로 URL 파라미터 접근
 * 3. URL: /partner/campaign_application/reporter/reporter_001
 * 4. params.id = "reporter_001"
 */
export default function ReporterCampaignApplicationPage() {
  // URL 파라미터에서 캠페인 ID 가져오기
  const params = useParams();
  const searchParams = useSearchParams();
  const campaignId = params.id as string;

  // 캠페인 데이터 상태 관리
  const [campaignData, setCampaignData] =
    useState<CampaignWithApplicants | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 탭 상태 관리 (신청/선정만 사용)
  // URL 쿼리 파라미터에서 tab=selected가 있으면 선정 탭으로 초기화
  const [activeTab, setActiveTab] = useState<"applicants" | "selected">(() => {
    const tabParam = searchParams.get("tab");
    return tabParam === "selected" ? "selected" : "applicants";
  });

  // 정렬 상태 관리 (최신순, 인기순, 마감임박순, 포인트순)
  type SortOption = "latest" | "popular" | "deadline" | "point";
  const [sortOrder, setSortOrder] = useState<SortOption>("latest");

  // 정렬 모달 상태 관리
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  // 화면 내 로컬 상태: 신청/선정 리스트를 상태로 관리하여 카드 이동 처리
  // 🎓 학습 포인트: Hook은 항상 컴포넌트 최상단에 위치해야 함
  const [applicantsState, setApplicantsState] = useState<AllApplicant[]>([]);
  const [selectedState, setSelectedState] = useState<AllApplicant[]>([]);

  // 정렬 옵션 정의
  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "deadline", label: "마감임박순" },
    { value: "point", label: "포인트순" },
  ];

  /**
   * 🎓 학습 포인트: useEffect를 통한 데이터 로딩
   *
   * 📌 데이터 로딩 패턴:
   * 1. 컴포넌트 마운트 시 캠페인 ID로 데이터 조회
   * 2. 로딩 상태 관리 (사용자 경험 개선)
   * 3. 에러 상태 처리 (존재하지 않는 캠페인 등)
   * 4. 의존성 배열로 campaignId 변경 감지
   */
  useEffect(() => {
    const loadCampaignData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // URL 파라미터로 받은 캠페인 ID로 데이터 조회
        const data = getCampaignById(campaignId);

        if (!data) {
          setError(`캠페인을 찾을 수 없습니다. (ID: ${campaignId})`);
          return;
        }

        setCampaignData(data);

        // 캠페인 데이터가 로드되면 신청자 상태도 초기화
        setApplicantsState(data.applicantData.applicants);
        setSelectedState(data.applicantData.selectedApplicants);
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        console.error("캠페인 데이터 로딩 오류:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (campaignId) {
      loadCampaignData();
    }
  }, [campaignId]);

  // 기본 헤더 숨기기 (PartnerHeader만 표시)
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    // 컴포넌트가 언마운트될 때 헤더 다시 표시
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return <Loading />;
  }

  // 에러가 있을 때 표시할 UI
  if (error || !campaignData) {
    return (
      <div className={layoutStyles.container}>
        <PartnerHeader />
        <div className={styles.page_header}>
          <h1 className={styles.page_title}>캠페인 신청 내역</h1>
        </div>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "red" }}>{error}</p>
        </div>
      </div>
    );
  }

  /**
   * 탭별 데이터 개수 계산
   * - 신청 탭: 전체 신청자 수
   * - 선정 탭: 선정된 신청자 수
   */
  const applicantsCount = applicantsState.length;
  const selectedCount = selectedState.length;

  /**
   * 현재 활성화된 탭에 따라 표시할 데이터 결정
   *
   * 📌 신청내역 페이지 데이터 선택:
   * - 신청 탭: 모든 신청자 목록 표시
   * - 선정 탭: 선정된 신청자만 표시
   */
  const getCurrentApplicants = () => {
    switch (activeTab) {
      case "applicants":
        return applicantsState;
      case "selected":
        return selectedState;
      default:
        return applicantsState;
    }
  };

  const currentApplicants = getCurrentApplicants();

  /**
   * channel/brandName에 따라 적절한 카드 컴포넌트를 렌더링하는 함수
   * - 인스타그램 + 브랜드=릴스 → ReelsCard/Selected
   * - 유튜브 + 브랜드=숏츠 → ShortsCard/Selected
   * - 그 외는 채널 기본 카드 사용
   */
  const renderCardComponent = (
    applicant: AllApplicant,
    isSelected: boolean = false
  ) => {
    switch (applicant.channel) {
      case "네이버블로그":
        return (
          <NaverBlogCard
            applicant={applicant as Applicant}
            variant={isSelected ? "selected" : "applicant"}
            onSelect={handleSelectApplicant}
            onCancel={handleCancelApplicant}
          />
        );

      case "네이버클립":
        return isSelected ? (
          <NaverClipSelectedCard
            applicant={applicant as NaverClipApplicant}
            onCancel={handleCancelApplicant}
          />
        ) : (
          <NaverClipCard
            applicant={applicant as NaverClipApplicant}
            onSelect={handleSelectApplicant}
          />
        );

      case "인스타그램":
        if (campaignData?.campaignInfo.brandName === "릴스") {
          return isSelected ? (
            <ReelsSelectedCard
              applicant={applicant as InstagramApplicant}
              onCancel={handleCancelApplicant}
            />
          ) : (
            <ReelsCard
              applicant={applicant as InstagramApplicant}
              onSelect={handleSelectApplicant}
            />
          );
        }
        return isSelected ? (
          <InstagramSelectedCard
            applicant={applicant as InstagramApplicant}
            onCancel={handleCancelApplicant}
          />
        ) : (
          <InstagramCard
            applicant={applicant as InstagramApplicant}
            onSelect={handleSelectApplicant}
          />
        );

      case "유튜브":
        if (campaignData?.campaignInfo.brandName === "숏츠") {
          return isSelected ? (
            <ShortsSelectedCard
              applicant={applicant as YoutubeApplicant}
              onCancel={handleCancelApplicant}
            />
          ) : (
            <ShortsCard
              applicant={applicant as YoutubeApplicant}
              onSelect={handleSelectApplicant}
            />
          );
        }
        return isSelected ? (
          <YoutubeSelectedCard
            applicant={applicant as YoutubeApplicant}
            onCancel={handleCancelApplicant}
          />
        ) : (
          <YoutubeCard
            applicant={applicant as YoutubeApplicant}
            onSelect={handleSelectApplicant}
          />
        );

      default:
        // 기본값: 네이버블로그 카드 사용
        return (
          <NaverBlogCard
            applicant={applicant as Applicant}
            variant={isSelected ? "selected" : "applicant"}
            onSelect={handleSelectApplicant}
            onCancel={handleCancelApplicant}
          />
        );
    }
  };

  // 선정하기 버튼 클릭 핸들러
  const handleSelectApplicant = (applicantId: string) => {
    console.log("선정하기:", applicantId);

    // 신청 목록에서 해당 신청자 찾기
    setApplicantsState((prevApplicants) => {
      const target = prevApplicants.find((a) => a.id === applicantId);
      if (!target) {
        console.log(
          "신청 목록에서 해당 신청자를 찾을 수 없습니다:",
          applicantId
        );
        return prevApplicants;
      }

      // 신청 리스트에서 제거
      const nextApplicants = prevApplicants.filter((a) => a.id !== applicantId);

      // 상태값 업데이트: selectionStatus를 "선정하기"로 변경하여 선정 리스트로 이동
      const moved: AllApplicant = {
        ...target,
        selectionStatus: "선정하기",
      } as AllApplicant;

      // 선정 리스트에 추가 (별도로 처리)
      setSelectedState((prevSelected) => {
        const isAlreadySelected = prevSelected.some(
          (a) => a.id === applicantId
        );
        if (isAlreadySelected) return prevSelected;
        return [moved, ...prevSelected];
      });

      return nextApplicants;
    });
  };

  // 선택 취소 버튼 클릭 핸들러
  const handleCancelApplicant = (applicantId: string) => {
    console.log("선택 취소:", applicantId);

    // 선정 목록에서 해당 신청자 찾기
    setSelectedState((prevSelected) => {
      const target = prevSelected.find((a) => a.id === applicantId);
      if (!target) {
        console.log(
          "선정 목록에서 해당 신청자를 찾을 수 없습니다:",
          applicantId
        );
        return prevSelected;
      }

      // 선정 리스트에서 제거
      const nextSelected = prevSelected.filter((a) => a.id !== applicantId);

      // 상태값 업데이트: selectionStatus를 "미선택"으로 변경하여 신청 리스트로 이동
      const moved: AllApplicant = {
        ...target,
        selectionStatus: "미선택",
      } as AllApplicant;

      // 신청 리스트에 추가 (별도로 처리)
      setApplicantsState((prevApplicants) => {
        const isAlreadyInApplicants = prevApplicants.some(
          (a) => a.id === applicantId
        );
        if (isAlreadyInApplicants) return prevApplicants;
        return [moved, ...prevApplicants];
      });

      return nextSelected;
    });
  };

  // 엑셀 다운로드 핸들러
  const handleDownloadApplicants = () => {
    console.log("신청자 목록 다운로드");
  };

  const handleDownloadSelected = () => {
    console.log("선정자 목록 다운로드");
  };

  // 정렬 모달 핸들러들
  const handleSortModalOpen = () => {
    setIsSortModalOpen(true);
  };

  const handleSortModalClose = () => {
    setIsSortModalOpen(false);
  };

  const handleSortOptionChange = (option: { value: string; label: string }) => {
    setSortOrder(option.value as SortOption);
    setIsSortModalOpen(false);
    console.log("정렬 변경:", option.label);
  };

  return (
    <>
      {/* 페이지 제목 */}
      <div className={styles.page_header}>
        <h1 className={styles.page_title}>캠페인 신청 내역</h1>
      </div>

      {/* 메인 콘텐츠 */}
      <section className={styles.campaign_application_section}>
        {/* 캠페인 정보 박스 */}
        <Campaignbanner campaignInfo={campaignData.campaignInfo} />

        <article className={styles.download_section}>
          {/* 다운로드 버튼 */}
          <ExcelDownloadBtn
            onDownloadApplicants={handleDownloadApplicants}
            onDownloadSelected={handleDownloadSelected}
          />

          {/* 정렬 트리거 + 모달 통합 */}
          <SortFilterControl
            options={sortOptions}
            value={sortOrder}
            onChange={(opt) => setSortOrder(opt.value as SortOption)}
            defaultSort="latest"
          />
        </article>

        {/* 신청내역 탭 네비게이션 - 신청/선정만 표시 */}
        <article className={styles.tab_navigation}>
          <button
            className={`${styles.tab_button} ${
              activeTab === "applicants" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("applicants")}
          >
            신청 <span className={styles.tab_count}>{applicantsCount}</span>
          </button>
          <button
            className={`${styles.tab_button} ${
              activeTab === "selected" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("selected")}
          >
            선정 <span className={styles.tab_count}>{selectedCount}</span>
          </button>
        </article>

        {/* 기자단 신청자 목록 그리드 */}
        <article className={styles.applicants_grid}>
          {currentApplicants.map((applicant, index) => (
            <div key={`${activeTab}-${applicant.id}-${index}`}>
              {renderCardComponent(applicant, activeTab === "selected")}
            </div>
          ))}
        </article>
      </section>

      {/* 정렬 모달은 SortFilterControl 내부에서 관리 */}
    </>
  );
}
