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

import styles from "../../../styles/partner/campaign_application/campaign_infocard.module.css";
import CampaignSchedule from "./CampaignSchedule";

// 브랜드 로고 매핑 객체
// 브랜드 이름을 입력하면 해당하는 로고 이미지 경로를 반환
const brandLogoMap: Record<string, string> = {
  "네이버 쇼핑": "/images/brand_logo/navershop.svg",
  쿠팡: "/images/brand_logo/coupang.svg",
  인스타: "/images/brand_logo/insta.svg",
  카카오선물하기: "/images/brand_logo/kakaopre.svg",
  "네이버 블로그": "/images/brand_logo/naverblog.svg",
  올리브영: "/images/brand_logo/oliveyoung.svg",
  "오늘의 집": "/images/brand_logo/todayhouse.svg",
  유튜브: "/images/brand_logo/youtube.svg",
};

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
    | "종료";
  category: string;
  /** 브랜드 이름 (선택적) - 배송형 등에서만 사용 */
  brandName?: string;
  recruitmentPeriod: string;
  announcementDate: string;
  registrationPeriod: string;
  recruitedCount: number;
  totalCount: number;
  daysLeft: number;
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
}

export default function Campaignbanner({ campaignInfo }: CampaignbannerProps) {
  /**
   * 브랜드 로고 이미지 경로 결정 함수
   * 1. brandName이 있으면 매핑 객체에서 로고 경로 가져오기
   * 2. 없으면 기본 아이콘 사용
   */
  const getBrandLogo = () => {
    if (campaignInfo.brandName && brandLogoMap[campaignInfo.brandName]) {
      return brandLogoMap[campaignInfo.brandName];
    }
    return "/images/icons/phone_verified.svg";
  };

  return (
    <article className={styles.campaign_info_card_conainer}>
      {/* 캠페인 정보 카드 */}
      <div className={styles.campaign_info_card}>
        <div className={styles.campaign_info_top}>
          {/* 캠페인 이미지 */}
          <div className={styles.campaign_image}>
            <img src={campaignInfo.image} alt="캠페인 이미지" />
          </div>

          {/* 캠페인 정보 */}
          <div className={styles.campaign_details}>
            <div className={styles.campaign_header}>
              {/* 캠페인 카테고리 - 브랜드 로고 표시 */}
              <div className={styles.campaign_category}>
                <img
                  src={getBrandLogo()}
                  alt={`${campaignInfo.category} 브랜드 로고`}
                />
                <span>{campaignInfo.category}</span>
              </div>

              <div className={styles.campaign_status}>
                {campaignInfo.status}
              </div>
            </div>

            <h2 className={styles.campaign_title}>{campaignInfo.title}</h2>
            <p className={styles.campaign_notice}>
              캠페인 선정 발표까지 {campaignInfo.daysLeft}일 남았습니다.
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
            registrationPeriod: campaignInfo.registrationPeriod,
          }}
        />
      </div>
    </article>
  );
}
