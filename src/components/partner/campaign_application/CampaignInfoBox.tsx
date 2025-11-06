/* ========================================
   📢 캠페인 신청 내역 배너 컴포넌트
   ======================================== */

/**
 * 캠페인 신청 내역 배너 컴포넌트
 *
 * 목적: 캠페인 신청 내역 페이지 상단에 표시되는 캠페인 정보 배너입니다.
 *
 * 사용 페이지:
 * - /partner/campaign_application/delivery (배송형 캠페인 신청내역)
 * - /partner/campaign_application/visit (방문형 캠페인 신청내역)
 * - /partner/campaign_application/review (리뷰형 캠페인 신청내역)
 * - /partner/campaign_application/reporter (기자단형 캠페인 신청내역)
 * - /partner/campaign_application/mission (미션형 캠페인 신청내역)
 *
 * 주요 기능:
 * - 캠페인 기본 정보 표시 (이미지, 제목, 카테고리, 상태)
 * - 캠페인 일정 정보 표시 (모집 인원, 모집 기간, 선정 발표, 등록 기간)
 * - 캠페인 상태 알림 (선정 발표까지 남은 일수)
 */

import styles from "@/styles/partner/campaign_application/campaign_infocard.module.css";
import CampaignSchedule from "./CampaignSchedule";
import {
  getStatusMessage,
  getBrandLogo,
} from "@/data/partner/utils/campaignHelpers";

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
function calculateDaysUntilAnnouncement(announcementDate?: string): number {
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
}

/**
 * 등록 기간 종료일이 지났는지 확인
 * 
 * 설명:
 * - 등록 기간 종료일이 오늘보다 이전이면 캠페인이 마감된 것으로 간주합니다.
 * - registrationPeriod 형식: "2025-11-18 ~ 2025-11-26"
 * 
 * 🎓 학습 포인트:
 * - Date 객체를 사용한 날짜 비교
 * - split("~"): 등록 기간 문자열에서 종료일 추출
 * - setHours(0, 0, 0, 0): 시간을 00:00:00으로 설정하여 날짜만 비교
 * - 날짜 비교: 종료일이 오늘보다 이전이면 true 반환
 */
function isRegistrationPeriodEnded(registrationPeriod?: string): boolean {
  if (!registrationPeriod) {
    console.log("[isRegistrationPeriodEnded] registrationPeriod가 없습니다.");
    return false;
  }

  try {
    // "2025-11-18 ~ 2025-11-26" 또는 "2025-11-18~2025-11-26" 형식에서 종료일 추출
    const separator = registrationPeriod.includes(" ~ ") ? " ~ " : "~";
    const endDateStr = registrationPeriod.split(separator)[1]?.trim();

    if (!endDateStr) {
      console.log("[isRegistrationPeriodEnded] endDateStr가 없습니다.");
      return false;
    }

    // 날짜 부분만 추출 (시간 부분 제거)
    const dateStr = endDateStr.split(" ")[0]?.trim();

    if (!dateStr) {
      console.log("[isRegistrationPeriodEnded] dateStr가 없습니다.");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(dateStr);
    if (isNaN(endDate.getTime())) {
      console.log("[isRegistrationPeriodEnded] 유효하지 않은 날짜:", dateStr);
      return false;
    }
    endDate.setHours(0, 0, 0, 0);

    // 등록 기간 종료일이 오늘보다 이전이면 마감된 것으로 간주
    const isEnded = endDate < today;
    console.log("[isRegistrationPeriodEnded] 등록 기간 종료일:", endDate.toISOString().split("T")[0]);
    console.log("[isRegistrationPeriodEnded] 오늘:", today.toISOString().split("T")[0]);
    console.log("[isRegistrationPeriodEnded] 마감 여부:", isEnded);

    return isEnded;
  } catch (error) {
    console.error("[isRegistrationPeriodEnded] 등록 기간 파싱 실패:", error, registrationPeriod);
    return false;
  }
}

/**
 * 등록 기간 종료일까지 남은 일수 계산 (캠페인 마감일)
 * 
 * 설명:
 * - "진행 중" 탭에서 등록 기간 종료일까지 남은 일수를 계산합니다.
 * - registrationPeriod 형식: "2025-11-18 ~ 2025-11-26"
 * 
 * 🎓 학습 포인트:
 * - Date 객체를 사용한 날짜 계산
 * - split("~"): 등록 기간 문자열에서 종료일 추출
 * - setHours(0, 0, 0, 0): 시간을 00:00:00으로 설정하여 날짜만 비교
 * - Math.ceil(): 올림 처리하여 하루 단위로 계산
 * - 음수 값 처리: 마감일이 지났으면 0 반환
 */
function calculateDaysUntilDeadline(registrationPeriod?: string): number {
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
}

/**
 * 캠페인 상태 텍스트 생성
 * 
 * 🎓 학습 포인트: 실시간 날짜 계산
 * - 캠페인 데이터에 저장된 daysLeft는 데이터를 불러올 때 한 번만 계산됩니다.
 * - 시간이 지나면 실제 남은 일수와 차이가 발생할 수 있습니다.
 * - 따라서 "모집 중" 상태일 때는 항상 선정 발표일 기준으로 실시간 계산합니다.
 * - statusText가 이미 설정되어 있어도 "모집 중" 상태면 재계산합니다.
 * - 종료 상태일 때는 항상 "캠페인이 마감되었습니다." 메시지를 표시합니다.
 * - 등록 기간이 지났으면 상태와 관계없이 "캠페인이 마감되었습니다." 메시지를 표시합니다.
 * - 진행 중 상태이고 콘텐츠가 있으면 "콘텐츠 확인 요청이 X건 있습니다. 캠페인 마감까지 X일 남았습니다." 표시
 */
function getStatusText(
  campaignInfo: CampaignInfo,
  reviewingCount?: number,
  completedCount?: number
): string {
  // 디버깅: 현재 상태와 데이터 확인
  console.log("[CampaignInfoBox getStatusText] 캠페인 상태:", campaignInfo.status);
  console.log("[CampaignInfoBox getStatusText] 선정 발표일:", campaignInfo.announcementDate);
  console.log("[CampaignInfoBox getStatusText] 등록 기간:", campaignInfo.registrationPeriod);
  console.log("[CampaignInfoBox getStatusText] reviewingCount:", reviewingCount);
  console.log("[CampaignInfoBox getStatusText] completedCount:", completedCount);
  console.log("[CampaignInfoBox getStatusText] statusText:", campaignInfo.statusText);
  console.log("[CampaignInfoBox getStatusText] daysLeft:", campaignInfo.daysLeft);

  // 등록 기간 종료일이 지났으면 상태와 관계없이 "캠페인이 마감되었습니다." 표시
  // 종료 탭에 있는 캠페인은 등록 기간이 지났을 가능성이 높으므로 우선 확인합니다.
  if (isRegistrationPeriodEnded(campaignInfo.registrationPeriod)) {
    console.log("[CampaignInfoBox getStatusText] 등록 기간 종료: 캠페인이 마감되었습니다.");
    return "캠페인이 마감되었습니다.";
  }

  // "종료" 상태인 경우: "캠페인이 마감되었습니다." 메시지 표시
  // statusText를 무시하고 항상 이 메시지를 표시합니다.
  if (campaignInfo.status === "종료" || campaignInfo.status === "마감") {
    console.log("[CampaignInfoBox getStatusText] 종료 상태: 캠페인이 마감되었습니다.");
    return "캠페인이 마감되었습니다.";
  }

  // "진행 중" 상태이고 콘텐츠가 있는 경우: 진행 탭과 동일한 메시지 표시
  // reviewingCount나 completedCount가 있으면 콘텐츠 확인 단계로 간주합니다.
  if (
    campaignInfo.status === "진행 중" &&
    (reviewingCount !== undefined || completedCount !== undefined)
  ) {
    const reviewCount = reviewingCount ?? 0;
    const completeCount = completedCount ?? 0;
    
    // 콘텐츠가 있으면 (reviewingCount > 0 || completedCount > 0)
    if (reviewCount > 0 || completeCount > 0) {
      const daysUntilDeadline = calculateDaysUntilDeadline(campaignInfo.registrationPeriod);
      // 콘텐츠 확인 요청이 0건일 경우: "콘텐츠 확인 요청이 없습니다. 캠페인 마감까지 X일 남았습니다."
      if (reviewCount === 0) {
        console.log("[CampaignInfoBox getStatusText] 진행 중, 확인 요청 0건");
        return `콘텐츠 확인 요청이 없습니다. 캠페인 마감까지 ${daysUntilDeadline}일 남았습니다.`;
      }
      // 콘텐츠 확인 요청이 1건 이상일 경우: "콘텐츠 확인 요청이 X건 있습니다. 캠페인 마감까지 X일 남았습니다."
      console.log("[CampaignInfoBox getStatusText] 진행 중, 확인 요청 있음");
      return `콘텐츠 확인 요청이 ${reviewCount}건 있습니다. 캠페인 마감까지 ${daysUntilDeadline}일 남았습니다.`;
    }
    // 콘텐츠가 없으면 당첨자 선정 단계로 간주
    console.log("[CampaignInfoBox getStatusText] 진행 중, 콘텐츠 없음 - 당첨자 선정");
    return "캠페인 당첨자를 선정해 주세요.";
  }

  // "모집 중" 또는 "대기 중" 상태인 경우: 선정 발표일 기준으로 실시간 계산
  // statusText를 무시하고 항상 최신 날짜 기준으로 계산합니다.
  // 이렇게 하면 데이터에 저장된 오래된 daysLeft 값이 아닌 현재 날짜 기준으로 정확한 일수를 표시할 수 있습니다.
  if (campaignInfo.status === "모집 중" || campaignInfo.status === "대기 중") {
    const daysUntilAnnouncement = calculateDaysUntilAnnouncement(campaignInfo.announcementDate);
    console.log("[CampaignInfoBox getStatusText] 계산된 남은 일수:", daysUntilAnnouncement);
    return `캠페인 선정 발표까지 ${daysUntilAnnouncement}일 남았습니다.`;
  }

  // 선정 발표일이 있고, statusText에 "선정 발표"라는 문구가 포함되어 있으면 재계산
  // 이렇게 하면 statusText가 이미 설정되어 있어도 선정 발표일 기준으로 재계산합니다.
  if (campaignInfo.announcementDate && campaignInfo.statusText) {
    if (campaignInfo.statusText.includes("선정 발표")) {
      const daysUntilAnnouncement = calculateDaysUntilAnnouncement(campaignInfo.announcementDate);
      console.log("[CampaignInfoBox getStatusText] statusText에 선정 발표 포함, 재계산:", daysUntilAnnouncement);
      return `캠페인 선정 발표까지 ${daysUntilAnnouncement}일 남았습니다.`;
    }
  }

  // 데이터에서 제공되는 statusText를 직접 사용 (다른 상태의 경우)
  if (campaignInfo.statusText) {
    console.log("[CampaignInfoBox getStatusText] statusText 사용:", campaignInfo.statusText);
    return campaignInfo.statusText;
  }

  // fallback: 기본 메시지
  const fallbackMessage = getStatusMessage(campaignInfo.status, campaignInfo.daysLeft);
  console.log("[CampaignInfoBox getStatusText] fallback 메시지 사용:", fallbackMessage);
  return fallbackMessage;
}

// 목록 카드와 동일한 로고 매핑을 사용하기 위해 유틸의 getBrandLogo를 그대로 사용합니다.

// 캠페인 정보 타입 정의
export interface CampaignInfo {
  id: string;
  title: string;
  image: string;
  /** 캠페인 상태 - 모든 타입에서 사용 가능 */
  status:
    | "대기 중"
    | "모집 중"
    | "선정 중"
    | "구매 중"
    | "등록 중"
    | "마감"
    | "진행 중"
    | "종료"
    | "취소";
  /** 캠페인 유형 - 배송형, 방문형, 구매평, 기자단, 미션형 */
  campaignType: "배송형" | "방문형" | "구매평" | "기자단" | "미션형";
  /** 카테고리 - 식품, 뷰티, 가전, 유아동, 여가, 서비스, 생활, 패션, 가구, 디지털, 문화, 반려동물, 기타 */
  category: string;
  /** 브랜드 이름 (선택적) - 배송형 등에서만 사용 */
  brandName?: string;
  recruitmentPeriod: string;
  announcementDate: string;
  /** 구매 기간 (구매평 캠페인용, 선택적) */
  purchasePeriod?: string;
  registrationPeriod: string;
  recruitedCount: number;
  totalCount: number;
  daysLeft: number;
  /** 캠페인 상태 설명 텍스트 */
  statusText?: string;
}

/**
 * 🎓 학습 포인트
 *
 * 📌 타입 확장 전략:
 * 1. 유니온 타입: 여러 값을 |로 묶어 다양한 값 허용
 * 2. 선택적 필드(?): 있어도 되고 없어도 되는 필드
 * 3. 공통 인터페이스: 모든 타입이 공통으로 사용하는 구조
 *
 * 📌 유연한 타입 설계의 장점:
 * - 여러 상황에서 재사용 가능
 * - 타입 안정성 유지
 * - 불필요한 중복 코드 제거
 */

interface CampaignbannerProps {
  campaignInfo: CampaignInfo;
  /** 콘텐츠 확인 요청 건수 (진행 중 상태일 때 사용) */
  reviewingCount?: number;
  /** 콘텐츠 확인 완료 건수 (진행 중 상태일 때 사용) */
  completedCount?: number;
}

export default function Campaignbanner({
  campaignInfo,
  reviewingCount,
  completedCount,
}: CampaignbannerProps) {
  return (
    <article className={styles.campaign_info_card_container}>
      {/* 캠페인 정보 카드 */}
      <div className={styles.campaign_info_card}>
        <div className={styles.campaign_info_top}>
          {/* 캠페인 이미지 */}
          <div className={styles.campaign_image}>
            <img src={campaignInfo.image} alt="캠페인 이미지" />
          </div>

          {/* 캠페인 정보 */}
          <div className={styles.campaign_application}>
            <div className={styles.campaign_header}>
              {/* 캠페인 카테고리 - 브랜드 로고 표시 */}
              <div className={styles.campaign_category}>
                <img
                  src={getBrandLogo(
                    campaignInfo.brandName || "기본",
                    campaignInfo.campaignType
                  )}
                  alt={`${campaignInfo.campaignType} 브랜드 로고`}
                />
                <span>{campaignInfo.campaignType}</span>
              </div>

              <div className={styles.campaign_status}>
                {campaignInfo.status}
              </div>
            </div>

            <h2 className={styles.campaign_title}>{campaignInfo.title}</h2>
            <p className={styles.campaign_notice}>
              {getStatusText(campaignInfo, reviewingCount, completedCount)}
            </p>
          </div>
        </div>

        {/* 캠페인 일정 정보 컴포넌트 사용
            📌 컴포넌트 재사용으로 코드 중복 제거
            📌 일정 정보만 별도 컴포넌트로 분리하여 관리 용이
        */}
        <CampaignSchedule
          scheduleData={{
            recruitedCount: campaignInfo.recruitedCount,
            totalCount: campaignInfo.totalCount,
            recruitmentPeriod: campaignInfo.recruitmentPeriod,
            announcementDate: campaignInfo.announcementDate,
            purchasePeriod: campaignInfo.purchasePeriod,
            registrationPeriod: campaignInfo.registrationPeriod,
          }}
        />
      </div>
    </article>
  );
}
