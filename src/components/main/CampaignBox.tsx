// 메인 -> 캠페인 박스 컴포넌트
// 이 컴포넌트는 메인페이지에서 각 캠페인을 카드 형태로 보여주는 역할을 합니다

/**
 * 캠페인 박스 컴포넌트
 *
 * 사용처:
 * 1. HomePageClient.tsx - 메인 홈 페이지
 *    - 선정 확률 높은 캠페인 섹션
 *    - 지금 인기 많은 캠페인 섹션
 *    - 진행 중인 캠페인 섹션
 *
 * 2. CampaignListPage.tsx - 캠페인 목록 페이지
 *    - 배송형 캠페인 목록 페이지 (/campaign/delivery)
 *    - 방문형 캠페인 목록 페이지 (/campaign/visit)
 *    - 구매평 캠페인 목록 페이지 (/campaign/review)
 *    - 미션형 캠페인 목록 페이지 (/campaign/mission)
 *    - 기자단 캠페인 목록 페이지 (/campaign/reporter)
 *
 * 3. SearchResultsSection.tsx - 검색 결과 섹션
 *    - 검색 결과 캠페인 목록 표시
 *
 * 클라이언트 컴포넌트로 선언
 *
 * 설명:
 * - "use client" 지시어를 사용하여 이 컴포넌트를 클라이언트 컴포넌트로 만듭니다.
 * - new Date()를 사용하여 날짜를 계산하므로 서버와 클라이언트에서 다른 결과가 나올 수 있습니다.
 * - useState와 useEffect를 사용하여 클라이언트에서만 날짜를 계산하여 Hydration 오류를 방지합니다.
 *
 */
"use client";

// React hooks import
// useState: 컴포넌트의 상태를 관리하기 위한 Hook
// useEffect: 컴포넌트가 렌더링된 후 부수 효과(side effect)를 수행하기 위한 Hook
import { useState, useEffect } from "react";

// Next.js의 Link 컴포넌트를 import
// Link는 페이지 간 이동을 위한 Next.js의 내장 컴포넌트입니다
// 일반 <a> 태그와 달리 클라이언트 사이드 라우팅을 지원합니다
import Link from "next/link";

// CSS 모듈을 import
// Next.js에서는 CSS 모듈을 사용하여 스타일을 컴포넌트별로 격리할 수 있습니다
// 파일명.module.css 형태로 작성하면 됩니다
import styles from "../../styles/user/campaign/campaign_box.module.css";

// 채널 로고 매핑 유틸리티 함수 import
// 채널 이름에 따라 동적으로 아이콘 경로를 반환하는 함수입니다
import { getChannelLogo } from "../../utils/channelLogoMap";

// TypeScript 인터페이스 정의
// 컴포넌트가 받을 props의 타입을 정의합니다
// 이렇게 하면 타입 안정성을 보장할 수 있습니다
interface CampaignBoxProps {
  campaign: {
    id: string; // 캠페인 고유 ID (라우팅에 사용됨)
    title: string; // 캠페인 제목
    category: string; // 캠페인 카테고리 (기자단, 구매평 등)
    channel?: string; // 채널 정보 (네이버 블로그, 인스타그램, 유튜브 등) - 아이콘 표시에 사용
    image: string; // 제품 이미지 경로
    dayCount?: string; // D-숫자 (선택적, 기본값: 6)
    isUrgent?: boolean; // 긴급 캠페인 여부 (기본값: false)
    recruitment: {
      current: number; // 현재 신청자 수
      total: number; // 총 모집 인원
    };
    schedule?: string; // 스케줄 정보 (선택적) - 오픈 예정일 안내 텍스트 (예: "12/25 (목) 10:00\n모집 오픈")
    detailedSchedule?: {
      applicationStart: string; // 신청 시작일 (예: "2025-12-20")
      applicationEnd: string; // 신청 마감일 (예: "2026-01-05")
      announcement?: string; // 선정 발표일 (선택적)
      purchasePeriod?: string; // 구매 기간 (구매평 캠페인용, 선택적)
      registrationPeriod?: string; // 등록 기간 (선택적)
    };
  };
  basePath?: string; // 링크 기본 경로 (기본값: /campaign/delivery)
}

// React 함수형 컴포넌트

// props로 campaign 데이터를 받아서 UI를 렌더링합니다
export default function CampaignBox({
  campaign,
  basePath = "/campaign/delivery",
}: CampaignBoxProps) {
  /**
   * 캠페인 상태 태그 계산 함수
   *
   * 모집기간을 기준으로 캠페인 상태를 계산하여 태그 텍스트를 반환합니다.
   *
   * 로직:
   * 1. 오늘 > applicationEnd → "마감" 우선 표시 (가장 높은 우선순위)
   * 2. isUrgent가 true이면 → "긴급" 표시
   * 3. 오늘 < applicationStart → 오픈 예정 → null 반환 (태그 없음, schedule 오버레이만 표시)
   * 4. applicationStart <= 오늘 <= applicationEnd → 모집 중 → 남은 일수 계산
   *    - 남은 일수가 1일 이하 → "마감임박"
   *    - 남은 일수가 2일 이상 → "n일 전" 형태
   * 5. dayCount에 "긴급"이 있으면 → "긴급" 표시 (하위 호환성)
   *
   * @returns 상태 태그 텍스트 또는 null (태그 없음)
   */
  const getCampaignStatusTag = (): string | null => {
    // 긴급 캠페인은 마감이 아닌 경우 무조건 "긴급" 표시
    // 먼저 마감 여부를 체크하고, 마감이 아니면서 isUrgent가 true이면 "긴급" 반환

    // detailedSchedule이 없으면 기존 dayCount 사용 (하위 호환성)
    if (!campaign.detailedSchedule) {
      // 긴급 캠페인 우선 체크
      if (campaign.isUrgent === true) {
        return "긴급";
      }
      // 하위 호환성: dayCount에 "긴급"이 있으면 우선 표시
      if (campaign.dayCount === "긴급") {
        return "긴급";
      }
      return campaign.dayCount || null;
    }

    const { applicationStart, applicationEnd } = campaign.detailedSchedule;

    // 오늘 날짜 (시간 정보 제거)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 신청 시작일과 마감일 파싱
    const startDate = new Date(applicationStart);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(applicationEnd);
    endDate.setHours(0, 0, 0, 0);

    // 1. 마감 여부 우선 체크 (가장 높은 우선순위)
    // 오늘 > applicationEnd → "마감" 우선 표시
    if (today > endDate) {
      return "마감";
    }

    // 2. 오늘 < applicationStart → 오픈 예정 (태그 없음)
    // 단, 긴급 캠페인은 오픈 예정이어도 표시하지 않음 (사용자 요구사항: 마감이 아닌 경우에만)
    if (today < startDate) {
      return null;
    }

    // 3. applicationStart <= 오늘 <= applicationEnd → 모집 중
    // 3-1. 긴급 캠페인 체크 (마감이 아닌 모집 중인 경우에만)
    // isUrgent가 true이면 무조건 "긴급" 반환
    if (campaign.isUrgent === true) {
      return "긴급";
    }

    // 하위 호환성: dayCount에 "긴급"이 있으면 우선 표시
    if (campaign.dayCount === "긴급") {
      return "긴급";
    }

    // 3-2. 남은 일수 계산 (마감일까지 남은 일수)
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 남은 일수가 1일 이하 → "마감임박"
    if (diffDays <= 1) {
      return "마감임박";
    }

    // 남은 일수가 2일 이상 → "n일 전" 형태
    return `${diffDays}일 전`;
  };

  /**
   * 오픈 예정 여부 확인 함수
   *
   * 오픈 예정인 경우 태그를 표시하지 않고 schedule 오버레이만 표시합니다.
   *
   * @returns 오픈 예정 여부 (boolean)
   */
  const checkIsUpcoming = (): boolean => {
    if (!campaign.detailedSchedule) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(campaign.detailedSchedule.applicationStart);
    startDate.setHours(0, 0, 0, 0);

    return today < startDate;
  };

  // 캠페인 타입에 따른 올바른 경로 결정
  const getCampaignPath = (campaign: any) => {
    switch (campaign.category) {
      case "배송형":
        return `/campaign/delivery/${campaign.id}`;
      case "방문형":
        return `/campaign/visit/${campaign.id}`;
      case "구매평":
        return `/campaign/review/${campaign.id}`;
      case "미션형":
        return `/campaign/mission/${campaign.id}`;
      case "기자단":
        return `/campaign/reporter/${campaign.id}`;
      default:
        return `${basePath}/${campaign.id}`;
    }
  };

  // 서버와 클라이언트가 동일한 초기값 설정 (hydration 오류 방지)
  // detailedSchedule이 없을 때는 dayCount 사용 (서버/클라이언트 동일)
  const getInitialStatusTag = (): string | null => {
    // 긴급 캠페인은 초기값에서도 체크 (hydration 오류 방지를 위해 서버/클라이언트 동일하게)
    // isUrgent가 true이면 무조건 "긴급" 반환
    if (campaign.isUrgent === true) {
      return "긴급";
    }

    if (!campaign.detailedSchedule) {
      // 하위 호환성: dayCount에 "긴급"이 있으면 우선 표시
      if (campaign.dayCount === "긴급") {
        return "긴급";
      }
      return campaign.dayCount || null;
    }

    // detailedSchedule이 있는 경우 초기값은 null (클라이언트에서 계산)
    // 마감 여부는 클라이언트에서만 정확히 계산 가능
    // 단, 긴급 캠페인은 이미 위에서 처리됨
    return null;
  };

  // useState: 상태 관리 Hook
  // 초기값은 서버와 클라이언트가 동일하게 설정 (hydration 오류 방지)
  const [statusTag, setStatusTag] = useState<string | null>(
    getInitialStatusTag()
  );
  const [isUpcoming, setIsUpcoming] = useState<boolean>(false);

  // useEffect: 컴포넌트가 마운트된 후(클라이언트에서만) 실행
  // 서버와 클라이언트의 시간 차이로 인한 hydration 오류를 방지하기 위해
  // 클라이언트에서만 날짜를 계산하여 상태를 업데이트합니다
  // dependency array에 campaign의 날짜 관련 속성을 포함하여
  // 캠페인 정보가 변경될 때만 재계산하도록 합니다
  useEffect(() => {
    // 클라이언트에서만 실행되는 코드

    // 디버깅: isUrgent 값 확인 (모든 캠페인에 대해)
    if (
      campaign.isUrgent === true ||
      campaign.title?.includes("긴급") ||
      campaign.id === "review_13"
    ) {
      console.log("[CampaignBox] useEffect 실행 - 긴급 캠페인 디버깅:", {
        id: campaign.id,
        title: campaign.title,
        isUrgent: campaign.isUrgent,
        isUrgentType: typeof campaign.isUrgent,
        isUrgentStrict: campaign.isUrgent === true,
        campaignObject: campaign,
      });
    }

    const calculatedStatusTag = getCampaignStatusTag();
    const calculatedIsUpcoming = checkIsUpcoming();

    // 디버깅: 계산된 태그 확인
    if (
      campaign.isUrgent === true ||
      campaign.title?.includes("긴급") ||
      campaign.id === "review_13"
    ) {
      console.log("[CampaignBox] 계산된 태그:", {
        id: campaign.id,
        calculatedStatusTag,
        calculatedIsUpcoming,
        detailedSchedule: campaign.detailedSchedule,
        dayCount: campaign.dayCount,
      });
    }

    setStatusTag(calculatedStatusTag);
    setIsUpcoming(calculatedIsUpcoming);

    // 디버깅: 오픈 예정 캠페인 확인
    if (calculatedIsUpcoming && campaign.id === "visit_11") {
      console.log(
        "[CampaignBox] visit_11 isUpcoming:",
        calculatedIsUpcoming,
        "schedule:",
        campaign.schedule
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    campaign.id, // 캠페인 ID 변경 시 재계산
    campaign.dayCount,
    campaign.isUrgent,
    campaign.detailedSchedule?.applicationStart,
    campaign.detailedSchedule?.applicationEnd,
    campaign.title, // 제목 변경 시도 재계산 (디버깅용)
  ]);

  // 최종 표시할 태그 결정 (렌더링 시점에서 직접 계산)
  // isUrgent가 true이면 무조건 "긴급" 표시 (마감이 아닌 경우)
  const finalStatusTag = ((): string | null => {
    // 마감 체크
    if (campaign.detailedSchedule) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(campaign.detailedSchedule.applicationEnd);
      endDate.setHours(0, 0, 0, 0);
      if (today > endDate) {
        return "마감";
      }
    }

    // 긴급 캠페인 체크 (마감이 아닌 경우)
    if (campaign.isUrgent === true) {
      return "긴급";
    }

    // 기존 계산된 태그 사용
    return statusTag;
  })();

  return (
    // Next.js Link 컴포넌트 사용
    // href에 동적 경로를 설정: 캠페인 타입에 따라 올바른 경로로 이동
    <Link href={getCampaignPath(campaign)} className={styles.campaign_link}>
      <div className={styles.campaign_box}>
        {/* 상단 라벨 - 캠페인 상태 태그 표시 */}
        {/* 오픈 예정이 아닌 경우에만 상태 태그 표시 (오픈 예정은 태그 없음) */}
        {finalStatusTag && !isUpcoming && (
          <div className={styles.campaign_label}>{finalStatusTag}</div>
        )}

        {/* 제품 이미지 영역 */}
        <div className={styles.product_image_container}>
          <img
            src={campaign.image}
            alt={campaign.title}
            className={styles.product_image}
          />

          {/* 조건부 렌더링: 오픈 예정일 때만 스케줄 오버레이 표시 */}
          {/* 오픈 예정인 경우 (오늘 < applicationStart) schedule 오버레이 표시 */}
          {isUpcoming && campaign.schedule && (
            <div className={styles.schedule_overlay}>
              <span className={styles.schedule_overlay_text}>
                {campaign.schedule}
              </span>
            </div>
          )}
        </div>

        {/* 제품 정보 영역 */}
        <div className={styles.product_info}>
          <div className={styles.category}>
            {/* 아이콘 표시 로직 */}
            {/* 구매평과 미션형은 고정 아이콘 사용, 나머지는 채널 정보에 따라 동적 아이콘 표시 */}
            {campaign.category === "구매평" ? (
              <img
                src="/images/brand_logo/review.svg"
                alt="구매평"
                className={styles.category_icon}
              />
            ) : campaign.category === "미션형" ? (
              <img
                src="/images/brand_logo/misssion.svg"
                alt="미션형"
                className={styles.category_icon}
              />
            ) : campaign.channel ? (
              <img
                src={getChannelLogo(campaign.channel)}
                alt={campaign.channel}
                className={styles.category_icon}
              />
            ) : null}
            <span>{campaign.category}</span>
          </div>
          <h3 className={styles.product_title}>{campaign.title}</h3>
          <div className={styles.recruitment_status}>
            <span className={styles.recruitment_total}>
              신청 {campaign.recruitment.current}명
            </span>
            <span className={styles.recruitment_separator}>|</span>
            <span className={styles.recruitment_current}>
              모집 {campaign.recruitment.total}명
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
