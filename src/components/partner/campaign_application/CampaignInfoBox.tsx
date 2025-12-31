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
import { getBrandLogo } from "@/data/partner/utils/campaignHelpers";
import {
  deriveCampaignStatus,
  getStatusText,
} from "./utils/campaign_info_helpers";

/* ========================================
   🧭 파일 구조 한눈에 보기
   ========================================

   1️⃣ 날짜 기반 상태 계산 기초 함수
       - 모집/등록/선정 단계별 남은 일수와 마감 여부를 계산합니다.

   2️⃣ 날짜 파싱 유틸리티 모음
       - 문자열을 Date 객체로 변환하고 범위를 다룰 때 사용하는 공통 함수입니다.

   3️⃣ 상태 판별 & 메시지 생성 로직
       - deriveCampaignStatus: 실시간 상태를 구합니다.
       - getStatusText: 파생 상태에 맞는 안내 문구를 만듭니다.

   👉 세부 구현은 utils/campaign_info_helpers.ts에 분리되어 있으니 함께 확인하세요.

   4️⃣ 타입 정의와 메인 컴포넌트
       - CampaignInfo 인터페이스와 Campaignbanner 컴포넌트를 정의합니다.

   📌 학습 순서 추천
       ① 날짜 계산 함수 이해 → ② 유틸 모듈 구조 파악 → ③ 상태 판별 흐름 읽기 → ④ 컴포넌트에서 어떻게 사용하는지 확인
*/

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
 * 🎓
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

/* ========================================
   📦 컴포넌트 Props 타입 정의
   ======================================== */
interface CampaignbannerProps {
  campaignInfo: CampaignInfo;
  /** 콘텐츠 확인 요청 건수 (진행 중 상태일 때 사용) */
  reviewingCount?: number;
  /** 콘텐츠 확인 완료 건수 (진행 중 상태일 때 사용) */
  completedCount?: number;
}

/* ========================================
   🏷️ 캠페인 신청 정보 배너 컴포넌트
   ======================================== */
export default function Campaignbanner({
  campaignInfo,
  reviewingCount,
  completedCount,
}: CampaignbannerProps) {
  /**
   * ✅ 실시간 상태 계산
   *
   * 설명:
   * - 전달된 캠페인 정보(campaignInfo)의 날짜 데이터를 바탕으로 화면에 표시할 상태를 다시 계산합니다.
   * - useMemo 대신 함수 호출을 그대로 사용해도 되는 이유는 컴포넌트가 가볍고, 파생 값이 간단하기 때문입니다.
   *
   * - 파생 상태(derivedStatus)를 변수로 분리하면 JSX가 간결해지고 의도가 명확해집니다.
   * - 상태 계산 로직을 별도 함수로 추출하여 테스트/재사용이 쉬워집니다.
   */
  const derivedStatus = deriveCampaignStatus(campaignInfo);

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
                {derivedStatus}
              </div>
            </div>

            <h2 className={styles.campaign_title}>{campaignInfo.title}</h2>
            <p className={styles.campaign_notice}>
              {getStatusText(
                campaignInfo,
                reviewingCount,
                completedCount,
                derivedStatus
              )}
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
