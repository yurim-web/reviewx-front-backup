// 메인 -> 캠페인 박스 컴포넌트
// 이 컴포넌트는 메인페이지에서 각 캠페인을 카드 형태로 보여주는 역할을 합니다

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
   * 1. 오늘 < applicationStart → 오픈 예정 → null 반환 (태그 없음, schedule 오버레이만 표시)
   * 2. applicationStart <= 오늘 <= applicationEnd → 모집 중 → 남은 일수 계산
   *    - 남은 일수가 1일 이하 → "마감임박"
   *    - 남은 일수가 2일 이상 → "n일 전" 형태
   * 3. 오늘 > applicationEnd → "마감"
   * 4. dayCount에 "긴급"이 있으면 → "긴급" 우선 표시
   *
   * @returns 상태 태그 텍스트 또는 null (태그 없음)
   */
  const getCampaignStatusTag = (): string | null => {
    // 긴급 상태 우선 체크 (dayCount에 "긴급"이 있으면 우선 표시)
    if (campaign.dayCount === "긴급") {
      return "긴급";
    }

    // detailedSchedule이 없으면 기존 dayCount 사용 (하위 호환성)
    if (!campaign.detailedSchedule) {
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

    // 오늘 < applicationStart → 오픈 예정 (태그 없음)
    if (today < startDate) {
      return null;
    }

    // 오늘 > applicationEnd → 마감
    if (today > endDate) {
      return "마감";
    }

    // applicationStart <= 오늘 <= applicationEnd → 모집 중
    // 남은 일수 계산 (마감일까지 남은 일수)
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 남은 일수가 3일 이하 → "마감임박"
    if (diffDays <= 3) {
      return "마감임박";
    }

    // 남은 일수가 4일 이상 → "n일 전" 형태
    return `${diffDays}일 전`;
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

  // 캠페인 상태 태그 계산
  const statusTag = getCampaignStatusTag();

  // 오픈 예정 여부 확인 (오늘 < applicationStart)
  // 오픈 예정인 경우 태그를 표시하지 않고 schedule 오버레이만 표시합니다
  const isUpcoming = (): boolean => {
    if (!campaign.detailedSchedule) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(campaign.detailedSchedule.applicationStart);
    startDate.setHours(0, 0, 0, 0);

    return today < startDate;
  };

  return (
    // Next.js Link 컴포넌트 사용
    // href에 동적 경로를 설정: 캠페인 타입에 따라 올바른 경로로 이동
    <Link href={getCampaignPath(campaign)} className={styles.campaign_link}>
      <div className={styles.campaign_box}>
        {/* 상단 라벨 - 캠페인 상태 태그 표시 */}
        {/* 오픈 예정이 아닌 경우에만 상태 태그 표시 (오픈 예정은 태그 없음) */}
        {statusTag && !isUpcoming() && (
          <div className={styles.campaign_label}>{statusTag}</div>
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
          {isUpcoming() && campaign.schedule && (
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
