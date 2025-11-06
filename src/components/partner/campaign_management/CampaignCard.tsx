/* ========================================
   📋 캠페인 카드 컴포넌트
   ======================================== */

/**
 * 캠페인 카드 컴포넌트
 *
 * 목적: 캠페인 관리 페이지에서 각 상태별 캠페인을 표시하는 카드 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /partner (파트너 캠페인 관리 페이지)
 *
 * 주요 기능:
 * - 캠페인 정보 표시 (제목, 카테고리, 상태)
 * - 탭 상태에 따른 동적 버튼 텍스트 및 스타일
 * - 캠페인 상태별 액션 버튼 (신청 취소, 콘텐츠 등록, 패널티 해제 등)
 * - 카테고리 아이콘 및 마감 태그 표시
 * - 반려된 콘텐츠의 경우 2개 버튼 표시
 */

import { useMemo, useState } from "react";
import type { PartnerStatTab } from "@/types/partner/partner";
import type { PartnerCampaign } from "@/types/partner/partner";
import cardStyles from "../../../styles/partner/campaign_card.module.css";
import buttonStyles from "../../../styles/partner/buttons.module.css";
import ReceiptRegistrationModal from "../campaign_contents/ReceiptRegistrationModal";
import CampaignManagementModal from "./modals/CampaignManagementModal";
import CampaignDeleteConfirmModal from "./modals/CampaignDeleteConfirmModal";
import { getClosedContentsById, getCampaignById, deleteCampaign } from "@/data/partner/sharedCampaigns";
import { getVisitContentsById } from "@/data/partner/visit";
import { getDeliveryContentsById } from "@/data/partner/delivery";
import { getReporterContentsById } from "@/data/partner/reporter";
import { getPurchaseReviewContentsById } from "@/data/partner/review";
import { getMissionContentsById } from "@/data/partner/mission";

interface CampaignCardProps {
  campaign: PartnerCampaign;
  activeTab: PartnerStatTab;
}

/**
 * 개별 캠페인 카드
 * 탭 상태에 따라 다른 버튼과 텍스트를 표시
 */
export default function CampaignCard({
  campaign,
  activeTab,
}: CampaignCardProps) {
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 캠페인 타입/상태에 따른 콘텐츠 검수/완료 개수 계산 (초기 렌더 시 메모)
  const { reviewingCount, completedCount } = useMemo(() => {
    const id = String(campaign.id);

    const getByType = () => {
      switch (campaign.campaignType) {
        case "방문형":
          return getVisitContentsById(id);
        case "배송형":
          return getDeliveryContentsById(id);
        case "기자단":
          return getReporterContentsById(id);
        case "구매평":
          return getPurchaseReviewContentsById(id);
        case "미션형":
          return getMissionContentsById(id);
        default:
          return { reviewing: [], completed: [] };
      }
    };

    // 종료/취소 상태인 경우: closedCampaigns에서 먼저 찾고, 없으면 getCampaignById에서 contents 확인
    if (campaign.status === "종료" || campaign.status === "취소") {
      const closedContents = getClosedContentsById(id);
      if (closedContents) {
        return {
          reviewingCount: closedContents.reviewing?.length ?? 0,
          completedCount: closedContents.completed?.length ?? 0,
        };
      }
      // closedCampaigns에 없으면 getCampaignById에서 contents 확인
      const campaignData = getCampaignById(id);
      if (campaignData && (campaignData as any).contents) {
        const contents = (campaignData as any).contents;
        return {
          reviewingCount: contents.reviewing?.length ?? 0,
          completedCount: contents.completed?.length ?? 0,
        };
      }
      return { reviewingCount: 0, completedCount: 0 };
    }

    // 진행 중/진행 상태인 경우: getCampaignById에서 contents 확인, 없으면 타입별 함수 호출
    const campaignData = getCampaignById(id);
    if (campaignData && (campaignData as any).contents) {
      const contents = (campaignData as any).contents;
      return {
        reviewingCount: contents.reviewing?.length ?? 0,
        completedCount: contents.completed?.length ?? 0,
      };
    }

    // getCampaignById에 contents가 없으면 타입별 함수로 조회
    const contents = getByType();
    return {
      reviewingCount: contents?.reviewing?.length ?? 0,
      completedCount: contents?.completed?.length ?? 0,
    };
  }, [campaign.id, campaign.campaignType, campaign.status]);

  // 콘텐츠 검수/확인 버튼 표시 여부 판별
  const isContentStage = useMemo(() => {
    const s = campaign.subStatus || "";
    // 서브 상태로 판별
    if (s.includes("content_review") || s.includes("content_approval")) {
      return true;
    }
    // 종료 상태일 때 2버튼 형태 지원
    if (campaign.status === "종료") {
      return true;
    }
    // 진행 상태에서도 콘텐츠 데이터가 있으면 2버튼 형태 지원
    if (
      campaign.status === "진행" &&
      (reviewingCount > 0 || completedCount > 0)
    ) {
      return true;
    }
    return false;
  }, [campaign.subStatus, campaign.status, reviewingCount, completedCount]);

  /**
   * 버튼 클릭 핸들러
   *
   * 🎓 학습 포인트: 조건부 네비게이션과 동적 라우팅
   *
   * 📌 네비게이션 패턴:
   * 1. 캠페인 타입에 따라 다른 신청내역 페이지로 이동
   * 2. 캠페인 ID를 URL 파라미터로 전달
   * 3. Next.js router를 사용한 프로그래밍적 네비게이션
   */
  const handleButtonClick = (buttonText: string) => {
    if (buttonText === "구매 영수증 등록하기") {
      setIsReceiptModalOpen(true);
    } else if (buttonText === "캠페인 관리") {
      setIsManagementModalOpen(true);
    } else if (buttonText === "캠페인 수정") {
      // 캠페인 타입에 따라 다른 수정 페이지로 이동
      const getCampaignTypePath = (type: string) => {
        switch (type) {
          case "배송형":
            return "delivery";
          case "방문형":
            return "visit";
          case "구매평":
            return "review";
          case "기자단":
            return "reporter";
          case "미션형":
            return "mission";
          default:
            return "delivery"; // 기본값
        }
      };

      const campaignTypePath = getCampaignTypePath(campaign.campaignType);
      window.location.href = `/partner/campaign/edit/${campaignTypePath}/${campaign.id}`;
    } else if (buttonText === "캠페인 삭제") {
      // 삭제 확인 모달 열기
      setIsDeleteModalOpen(true);
    } else if (buttonText === "패널티 내역보기") {
      // 패널티 내역 페이지로 이동
      window.location.href = "/partner/campaign_management/penalty";
    } else if (buttonText === "신청내역 확인") {
      // 캠페인 타입에 따라 다른 신청내역 페이지로 이동 (신청 탭)
      const getCampaignTypePath = (type: string) => {
        switch (type) {
          case "배송형":
            return "delivery";
          case "방문형":
            return "visit";
          case "구매평":
            return "review";
          case "기자단":
            return "reporter";
          case "미션형":
            return "mission";
          default:
            return "delivery"; // 기본값
        }
      };

      const campaignTypePath = getCampaignTypePath(campaign.campaignType);
      window.location.href = `/partner/campaign_application/${campaignTypePath}/${campaign.id}`;
    } else if (buttonText === "당첨자 선정") {
      // 캠페인 타입에 따라 다른 신청내역 페이지로 이동 (신청 탭)
      const getCampaignTypePath = (type: string) => {
        switch (type) {
          case "배송형":
            return "delivery";
          case "방문형":
            return "visit";
          case "구매평":
            return "review";
          case "기자단":
            return "reporter";
          case "미션형":
            return "mission";
          default:
            return "delivery"; // 기본값
        }
      };

      const campaignTypePath = getCampaignTypePath(campaign.campaignType);
      window.location.href = `/partner/campaign_application/${campaignTypePath}/${campaign.id}`;
    } else {
      // 다른 버튼들의 로직 처리
      console.log(`${buttonText} 버튼 클릭됨`);
    }
  };

  /**
   * 현재 탭과 캠페인 subStatus에 따른 버튼 텍스트 결정
   */
  const getButtonText = () => {
    // subStatus 기반으로 버튼 결정 (USER와 동일한 방식)
    if (campaign.subStatus === "applicant_management") {
      return "신청내역 확인";
    } else if (campaign.subStatus === "winner_selection") {
      return "당첨자 선정";
    } else if (campaign.subStatus === "content_review") {
      return `콘텐츠 확인 완료 (${completedCount})`;
    } else if (campaign.subStatus === "penalty") {
      return "패널티 내역보기";
    }

    // fallback: subStatus가 없는 경우 캠페인 status 기반으로 결정
    switch (campaign.status) {
      case "예정":
        return "캠페인 수정하기";
      case "신청":
        return "신청내역 확인";
      case "진행":
        return "당첨자 선정";
      case "종료":
        return `콘텐츠 확인 완료 (${completedCount})`;
      case "취소":
        return "패널티 내역보기";
      default:
        return "캠페인 관리";
    }
  };

  /**
   * 버튼 텍스트에 따른 스타일 클래스 결정
   */
  const getButtonStyle = () => {
    const buttonText = getButtonText();

    // 주요 액션 버튼 - 검은색 배경 (콘텐츠 등록, 재등록, 구매 영수증 등록 등)
    if (
      buttonText === "콘텐츠 등록하기" ||
      buttonText === "콘텐츠 재등록하기" ||
      buttonText === "구매 영수증 등록하기" ||
      buttonText === "구매 영수증 수정하기" ||
      buttonText === "구매 영수증 재등록하기" ||
      buttonText === "패널티 해제하기" ||
      buttonText === "당첨자 선정" ||
      buttonText === "캠페인 수정하기"
    ) {
      return `${buttonStyles.action_button} ${buttonStyles.primary_button}`;
    }

    // 경고 버튼 - 빨간색 테두리 (패널티 관련)
    if (
      buttonText === "패널티 내역보기" ||
      buttonText === "콘텐츠 반려 사유보기"
    ) {
      return `${buttonStyles.action_button} ${buttonStyles.danger_button}`;
    }

    // 보조 버튼 - 회색 테두리 (확인하기)
    if (buttonText.includes("확인하기")) {
      return `${buttonStyles.action_button} ${buttonStyles.secondary_button}`;
    }

    // 일반 버튼 - 기본 검은색 테두리
    return `${buttonStyles.action_button} ${buttonStyles.default_button}`;
  };

  /**
   * 모집 기간에서 시작일까지 남은 일수 계산
   * 
   * 설명:
   * - "예정" 탭에서는 모집 기간 시작일까지의 남은 일수를 계산합니다.
   * - recruitmentPeriod 형식: "2025-11-10 ~ 2025-11-20"
   * 
   * 🎓 학습 포인트:
   * - Date 객체를 사용한 날짜 계산
   * - setHours(0, 0, 0, 0): 시간을 00:00:00으로 설정하여 날짜만 비교
   * - Math.ceil(): 올림 처리하여 하루 단위로 계산
   */
  const calculateDaysUntilOpen = (recruitmentPeriod?: string): number => {
    if (!recruitmentPeriod) {
      console.log("[calculateDaysUntilOpen] recruitmentPeriod가 없습니다.");
      return 0;
    }

    console.log("[calculateDaysUntilOpen] recruitmentPeriod:", recruitmentPeriod);

    try {
      // "2025-11-10 ~ 2025-11-20" 또는 "2025-11-10~2025-11-20" 형식에서 시작일 추출
      const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
      const startDateStr = recruitmentPeriod.split(separator)[0]?.trim();

      console.log("[calculateDaysUntilOpen] startDateStr:", startDateStr);

      if (!startDateStr) {
        console.log("[calculateDaysUntilOpen] startDateStr가 없습니다.");
        return 0;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startDate = new Date(startDateStr);
      if (isNaN(startDate.getTime())) {
        console.log("[calculateDaysUntilOpen] 유효하지 않은 날짜:", startDateStr);
        return 0;
      }
      startDate.setHours(0, 0, 0, 0);

      const diffTime = startDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      console.log("[calculateDaysUntilOpen] 오늘:", today.toISOString().split("T")[0]);
      console.log("[calculateDaysUntilOpen] 시작일:", startDate.toISOString().split("T")[0]);
      console.log("[calculateDaysUntilOpen] 차이 (밀리초):", diffTime);
      console.log("[calculateDaysUntilOpen] 계산된 일수:", diffDays);

      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.error("[calculateDaysUntilOpen] 모집 기간 파싱 실패:", error, recruitmentPeriod);
      return 0;
    }
  };

  /**
   * 선정 발표일까지 남은 일수 계산
   * 
   * 설명:
   * - "모집 중" 상태의 캠페인에서 선정 발표일까지 남은 일수를 계산합니다.
   * - announcementDate 형식: "2025-11-30" 또는 "2025-11-30 00:00:00"
   * 
   * 🎓 학습 포인트:
   * - Date 객체를 사용한 날짜 계산
   * - split(" ")[0]: 날짜 문자열에서 시간 부분 제거 (공백 기준으로 첫 번째 부분만 사용)
   * - setHours(0, 0, 0, 0): 시간을 00:00:00으로 설정하여 날짜만 비교
   * - Math.ceil(): 올림 처리하여 하루 단위로 계산
   * - 음수 값 처리: 선정 발표일이 지났으면 0 반환
   */
  const calculateDaysUntilAnnouncement = (announcementDate?: string): number => {
    if (!announcementDate) {
      console.log("[calculateDaysUntilAnnouncement] announcementDate가 없습니다.");
      return 0;
    }

    console.log("[calculateDaysUntilAnnouncement] announcementDate:", announcementDate);

    try {
      // "2025-11-30" 또는 "2025-11-30 00:00:00" 형식에서 날짜 부분만 추출
      const dateStr = announcementDate.split(" ")[0]?.trim();

      console.log("[calculateDaysUntilAnnouncement] dateStr:", dateStr);

      if (!dateStr) {
        console.log("[calculateDaysUntilAnnouncement] dateStr가 없습니다.");
        return 0;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const announcementDateObj = new Date(dateStr);
      if (isNaN(announcementDateObj.getTime())) {
        console.log("[calculateDaysUntilAnnouncement] 유효하지 않은 날짜:", dateStr);
        return 0;
      }
      announcementDateObj.setHours(0, 0, 0, 0);

      const diffTime = announcementDateObj.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      console.log("[calculateDaysUntilAnnouncement] 오늘:", today.toISOString().split("T")[0]);
      console.log("[calculateDaysUntilAnnouncement] 선정 발표일:", announcementDateObj.toISOString().split("T")[0]);
      console.log("[calculateDaysUntilAnnouncement] 차이 (밀리초):", diffTime);
      console.log("[calculateDaysUntilAnnouncement] 계산된 일수:", diffDays);

      // 선정 발표일이 지났으면 0 반환, 아니면 남은 일수 반환
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.error("[calculateDaysUntilAnnouncement] 선정 발표일 파싱 실패:", error, announcementDate);
      return 0;
    }
  };

  /**
   * 등록 기간 종료일까지 남은 일수 계산 (캠페인 마감일)
   * 
   * 설명:
   * - "진행" 탭에서 등록 기간 종료일까지 남은 일수를 계산합니다.
   * - registrationPeriod 형식: "2025-11-18 ~ 2025-11-26"
   * 
   * 🎓 학습 포인트:
   * - Date 객체를 사용한 날짜 계산
   * - split("~"): 등록 기간 문자열에서 종료일 추출
   * - setHours(0, 0, 0, 0): 시간을 00:00:00으로 설정하여 날짜만 비교
   * - Math.ceil(): 올림 처리하여 하루 단위로 계산
   * - 음수 값 처리: 마감일이 지났으면 0 반환
   */
  const calculateDaysUntilDeadline = (registrationPeriod?: string): number => {
    if (!registrationPeriod) {
      console.log("[calculateDaysUntilDeadline] registrationPeriod가 없습니다.");
      return 0;
    }

    console.log("[calculateDaysUntilDeadline] registrationPeriod:", registrationPeriod);

    try {
      // "2025-11-18 ~ 2025-11-26" 또는 "2025-11-18~2025-11-26" 형식에서 종료일 추출
      const separator = registrationPeriod.includes(" ~ ") ? " ~ " : "~";
      const endDateStr = registrationPeriod.split(separator)[1]?.trim();

      console.log("[calculateDaysUntilDeadline] endDateStr:", endDateStr);

      if (!endDateStr) {
        console.log("[calculateDaysUntilDeadline] endDateStr가 없습니다.");
        return 0;
      }

      // 날짜 부분만 추출 (시간 부분 제거)
      const dateStr = endDateStr.split(" ")[0]?.trim();

      if (!dateStr) {
        console.log("[calculateDaysUntilDeadline] dateStr가 없습니다.");
        return 0;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const endDate = new Date(dateStr);
      if (isNaN(endDate.getTime())) {
        console.log("[calculateDaysUntilDeadline] 유효하지 않은 날짜:", dateStr);
        return 0;
      }
      endDate.setHours(0, 0, 0, 0);

      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      console.log("[calculateDaysUntilDeadline] 오늘:", today.toISOString().split("T")[0]);
      console.log("[calculateDaysUntilDeadline] 마감일:", endDate.toISOString().split("T")[0]);
      console.log("[calculateDaysUntilDeadline] 차이 (밀리초):", diffTime);
      console.log("[calculateDaysUntilDeadline] 계산된 일수:", diffDays);

      // 마감일이 지났으면 0 반환, 아니면 남은 일수 반환
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.error("[calculateDaysUntilDeadline] 등록 기간 파싱 실패:", error, registrationPeriod);
      return 0;
    }
  };

  /**
   * 현재 탭에 따른 상태 텍스트 표시 (데이터 기반)
   * 
   * 🎓 학습 포인트: 실시간 날짜 계산
   * - 캠페인 데이터에 저장된 daysLeft는 데이터를 불러올 때 한 번만 계산됩니다.
   * - 시간이 지나면 실제 남은 일수와 차이가 발생할 수 있습니다.
   * - 따라서 "모집 중" 상태일 때는 항상 선정 발표일 기준으로 실시간 계산합니다.
   * - 진행 탭에서는 버튼 개수에 따라 다른 메시지를 표시합니다.
   * - 종료 탭에서는 항상 "캠페인이 마감되었습니다." 메시지를 표시합니다.
   */
  const getStatusText = () => {
    // activeTab이 "종료"인 경우 우선 처리
    // 종료 탭에서는 항상 "캠페인이 마감되었습니다." 메시지 표시
    if (activeTab === "종료") {
      return "캠페인이 마감되었습니다.";
    }

    // activeTab이 "예정"인 경우 우선 처리
    // 모집 기간 시작일까지의 남은 일수 계산
    if (activeTab === "예정") {
      const daysUntilOpen = calculateDaysUntilOpen(campaign.recruitmentPeriod);
      return `캠페인 오픈까지 ${daysUntilOpen}일 남았습니다.`;
    }

    // "모집 중" 상태이거나 "신청" 탭인 경우: 선정 발표일 기준으로 실시간 계산
    // statusText를 무시하고 항상 최신 날짜 기준으로 계산합니다.
    if (campaign.status === "모집 중" || activeTab === "신청") {
      const daysUntilAnnouncement = calculateDaysUntilAnnouncement(campaign.announcementDate);
      return `캠페인 선정 발표까지 ${daysUntilAnnouncement}일 남았습니다.`;
    }

    // "대기 중" 상태인 경우: 모집 기간 시작일 기준으로 실시간 계산
    if (campaign.status === "대기 중") {
      const daysUntilOpen = calculateDaysUntilOpen(campaign.recruitmentPeriod);
      return `캠페인 오픈까지 ${daysUntilOpen}일 남았습니다.`;
    }

    // "진행" 탭인 경우: 버튼 개수에 따라 다른 메시지 표시
    if (activeTab === "진행" || campaign.status === "진행") {
      // 버튼이 2개일 때 (콘텐츠 확인 단계)
      if (isContentStage) {
        const daysUntilDeadline = calculateDaysUntilDeadline(campaign.registrationPeriod);
        // 콘텐츠 확인 요청이 0건일 경우: "콘텐츠 확인 요청이 없습니다. 캠페인 마감까지 X일 남았습니다."
        if (reviewingCount === 0) {
          return `콘텐츠 확인 요청이 없습니다. 캠페인 마감까지 ${daysUntilDeadline}일 남았습니다.`;
        }
        // 콘텐츠 확인 요청이 1건 이상일 경우: "콘텐츠 확인 요청이 X건 있습니다. 캠페인 마감까지 X일 남았습니다."
        return `콘텐츠 확인 요청이 ${reviewingCount}건 있습니다. 캠페인 마감까지 ${daysUntilDeadline}일 남았습니다.`;
      }
      // 버튼이 1개일 때 (당첨자 선정): "캠페인 당첨자를 선정해 주세요."
      return "캠페인 당첨자를 선정해 주세요.";
    }

    // "종료" 상태인 경우: "캠페인이 마감되었습니다." 메시지 표시
    if (campaign.status === "종료") {
      return "캠페인이 마감되었습니다.";
    }

    // 데이터에서 제공되는 statusText를 직접 사용 (다른 상태의 경우)
    if (campaign.statusText) {
      return campaign.statusText;
    }

    // fallback: 데이터에 statusText가 없는 경우 기본 메시지
    const fallbackMessages: Record<string, string> = {
      "진행 중": "캠페인 당첨자를 선정해 주세요.",
      취소: "캠페인이 취소되었습니다.",
    };

    return fallbackMessages[campaign.status] || "캠페인을 확인해 주세요.";
  };

  return (
    <div className={cardStyles.campaign_card}>
      <div className={cardStyles.campaign_content_container}>
        {/* 캠페인 이미지 */}
        <div className={cardStyles.campaign_image}>
          {campaign.image ? (
            <img src={campaign.image} alt="캠페인 이미지" />
          ) : null}
        </div>

        {/* 캠페인 상세 정보 */}
        <div className={cardStyles.campaign_info}>
          {/* 헤더: 타입 아이콘 + 신청자 수 */}
          <div className={cardStyles.campaign_header}>
            <div className={cardStyles.campaign_type}>
              {campaign.brandLogo ? (
                <img
                  src={campaign.brandLogo}
                  alt={campaign.brandName || campaign.campaignType}
                  className={cardStyles.brand_logo}
                />
              ) : (
                <div
                  className={`${cardStyles.type_icon} ${
                    cardStyles[
                      (() => {
                        switch (campaign.campaignType) {
                          case "배송형":
                            return "type_delivery";
                          case "방문형":
                            return "type_visit";
                          case "구매평":
                            return "type_review";
                          case "기자단":
                            return "type_reporter";
                          case "미션형":
                            return "type_mission";
                          default:
                            return "type_delivery";
                        }
                      })()
                    ]
                  }`}
                />
              )}
              <span className={cardStyles.type_text}>{campaign.campaignType}</span>
            </div>

            {/* 신청자 수 표시 */}
            <div className={cardStyles.applicant_count}>
              {campaign.status === "진행" ? (
                // 진행 중인 캠페인: 검수/제출/선정 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    확인 {reviewingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_current}>
                    제출 {completedCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>
                    선정 {campaign.selected || 0}명
                  </span>
                </>
              ) : campaign.status === "종료" ? (
                // 종료 캠페인: 검수/제출/선정 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    확인 {reviewingCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_current}>
                    제출 {completedCount}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>
                    선정 {campaign.selected || 0}명
                  </span>
                </>
              ) : campaign.status === "취소" ? (
                // 취소 캠페인: 신청/모집/선정 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    신청 {campaign.applicants || 0}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_current}>
                    모집 {campaign.recruits || 0}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>
                    선정 {campaign.selected || 0}명
                  </span>
                </>
              ) : (
                // 일반 캠페인: 신청/모집 수 표시
                <>
                  <span className={cardStyles.applicant_current}>
                    신청 {campaign.applicants || 0}명
                  </span>
                  <span className={cardStyles.applicant_separator}>|</span>
                  <span className={cardStyles.applicant_total}>
                    모집 {campaign.recruits || 0}명
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 캠페인 제목 */}
          <h3 className={cardStyles.campaign_title}>{campaign.title}</h3>

          {/* 캠페인 상태 설명 */}
          <p className={cardStyles.campaign_status}>{getStatusText()}</p>
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div className={cardStyles.campaign_actions}>
        {/* 예정 탭: 캠페인 삭제 + 캠페인 수정 */}
        {campaign.subStatus === "campaign_edit,campaign_delete" ? (
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.danger_button}`}
              onClick={() => handleButtonClick("캠페인 삭제")}
            >
              캠페인 삭제
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => handleButtonClick("캠페인 수정")}
            >
              캠페인 수정
            </button>
          </>
        ) : campaign.subStatus === "campaign_edit,applicant_management" ? (
          /* 신청 탭: 캠페인 관리 + 신청 내역 확인하기 */
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => handleButtonClick("캠페인 관리")}
            >
              캠페인 관리
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.secondary_button}`}
              onClick={() => handleButtonClick("신청내역 확인")}
            >
              신청내역 확인
            </button>
          </>
        ) : isContentStage ? (
          /* 종료 탭 또는 콘텐츠 단계: 콘텐츠 확인 + 콘텐츠 확인 완료 */
          <>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.secondary_button}`}
              onClick={() => {
                const getCampaignTypePath = (type: string) => {
                  switch (type) {
                    case "배송형":
                      return "delivery";
                    case "방문형":
                      return "visit";
                    case "구매평":
                      return "review";
                    case "기자단":
                      return "reporter";
                    case "미션형":
                      return "mission";
                    default:
                      return "delivery";
                  }
                };
                const campaignTypePath = getCampaignTypePath(campaign.campaignType);
                window.location.href = `/partner/campaign_contents/${campaignTypePath}/${campaign.id}?tab=검수`;
              }}
            >
              콘텐츠 확인 ({reviewingCount})
            </button>
            <button
              className={`${buttonStyles.action_button} ${buttonStyles.primary_button}`}
              onClick={() => {
                const getCampaignTypePath = (type: string) => {
                  switch (type) {
                    case "배송형":
                      return "delivery";
                    case "방문형":
                      return "visit";
                    case "구매평":
                      return "review";
                    case "기자단":
                      return "reporter";
                    case "미션형":
                      return "mission";
                    default:
                      return "delivery";
                  }
                };
                const campaignTypePath = getCampaignTypePath(campaign.campaignType);
                window.location.href = `/partner/campaign_contents/${campaignTypePath}/${campaign.id}?tab=완료`;
              }}
            >
              콘텐츠 확인 완료 ({completedCount})
            </button>
          </>
        ) : (
          /* 그 외의 경우: 상태에 맞는 1개 버튼 표시 (당첨자 선정, 패널티 내역보기 등) */
          <button
            className={getButtonStyle()}
            onClick={() => handleButtonClick(getButtonText())}
          >
            {getButtonText()}
          </button>
        )}
      </div>

      {/* 구매 영수증 등록 모달 */}
      <ReceiptRegistrationModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        campaignTitle={campaign.title}
      />

      {/* 캠페인 관리 모달 */}
      <CampaignManagementModal
        isOpen={isManagementModalOpen}
        onClose={() => setIsManagementModalOpen(false)}
        campaignTitle={campaign.title}
        campaignType={campaign.campaignType}
        campaignId={campaign.id}
      />

      {/* 캠페인 삭제 확인 모달 */}
      <CampaignDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        campaignTitle={campaign.title}
        campaignId={campaign.id}
        onConfirm={() => {
          /**
           * 캠페인 삭제 확인 핸들러
           * 
           * 🎓 학습 포인트: localStorage 기반 데이터 삭제
           * - 실제 프로덕션에서는 API를 통해 서버에서 캠페인을 삭제해야 합니다
           * - 현재는 프론트엔드 개발을 위해 localStorage에서 삭제합니다
           * - 삭제 후 페이지를 새로고침하여 목록을 업데이트합니다
           */
          const campaignIdString = String(campaign.id);
          const campaignType = campaign.campaignType as
            | "배송형"
            | "방문형"
            | "구매평"
            | "기자단"
            | "미션형";

          console.log(`[CampaignCard] 캠페인 삭제 시도: ID=${campaignIdString}, 타입=${campaignType}, 제목=${campaign.title}`);

          // localStorage에서 캠페인 삭제
          const deleteSuccess = deleteCampaign(campaignIdString, campaignType);

          console.log(`[CampaignCard] 삭제 결과: ${deleteSuccess ? "성공" : "실패"}`);

          if (deleteSuccess) {
            // 삭제 성공 시 알림 표시
            alert("캠페인이 삭제되었습니다.");
            // 페이지 새로고침하여 업데이트된 캠페인 목록 표시
            // 🎓 학습 포인트: window.location.reload()
            // - 페이지를 새로고침하여 최신 데이터를 불러옵니다
            // - getCampaignsByTab() 함수가 매번 최신 localStorage 데이터를 읽어오므로
            //   새로고침하면 삭제된 캠페인이 목록에서 사라집니다
            window.location.reload();
          } else {
            // 삭제 실패 시 에러 메시지 표시
            alert("캠페인 삭제에 실패했습니다. 다시 시도해주세요.");
          }
        }}
      />
    </div>
  );
}
