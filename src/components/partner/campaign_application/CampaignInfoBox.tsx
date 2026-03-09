/* ========================================
   📢 캠페인 신청 내역 배너 컴포넌트
   ======================================== */
/* eslint-disable @next/next/no-img-element */

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
 */

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "@/styles/partner/campaign_application/campaign_infocard.module.css";
import CampaignSchedule from "./CampaignSchedule";
import { getBrandLogo } from "@/data/partner/utils/campaignHelpers";
import { deriveCampaignStatus, getStatusText } from "./utils/campaign_info_helpers";

/** 캠페인 이미지 로드 실패 시 사용할 기본 이미지 */
const FALLBACK_CAMPAIGN_IMAGE = "/images/main/campaign_img/eximg_1.png";

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
    | "진행 중"
    | "종료"
    | "취소"
    | "긴급";
  /** 캠페인 유형 - 배송형, 방문형, 구매평, 기자단, 미션형 */
  campaignType: "배송형" | "방문형" | "구매평" | "기자단" | "미션형";
  /** 카테고리 - 식품, 뷰티, 가전, 유아동, 여가, 서비스, 생활, 패션, 가구, 디지털, 문화, 반려동물, 기타 */
  category: string;
  /** 브랜드 이름 (선택적) - 배송형 등에서만 사용 */
  brandName?: string;
  /** 채널명 (선택적) - 기자단 등에서 사용, brandName이 없을 때 사용 */
  channel?: string;
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
  /** 포인트 (미션형 등) */
  point?: number;
  /** 방문 지역 (방문형 캠페인용, 선택적) */
  region?: string;
  /** 방문 하위 지역 (방문형 캠페인용, 선택적) */
  subRegion?: string;
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
  /** 실제 신청자 수 (모집 인원 표시용) */
  applicantsCount?: number;
}

/* ========================================
   🏷️ 캠페인 신청 정보 배너 컴포넌트
   ======================================== */
export default function Campaignbanner({
  campaignInfo,
  reviewingCount,
  completedCount,
  applicantsCount,
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
   *
   * 📌 타입 호환성:
   * - CampaignInfo를 CampaignInfoForHelper 타입으로 변환하여 전달합니다
   * - 필요한 필드만 추출하여 타입 안정성을 확보합니다
   */
  const campaignInfoForHelper = {
    status: campaignInfo.status,
    campaignType: campaignInfo.campaignType,
    recruitmentPeriod: campaignInfo.recruitmentPeriod,
    announcementDate: campaignInfo.announcementDate,
    purchasePeriod: campaignInfo.purchasePeriod,
    registrationPeriod: campaignInfo.registrationPeriod,
    daysLeft: campaignInfo.daysLeft,
    statusText: campaignInfo.statusText,
  };
  const derivedStatus = deriveCampaignStatus(campaignInfoForHelper);
  const [campaignImageSrc, setCampaignImageSrc] = useState(
    campaignInfo.image || FALLBACK_CAMPAIGN_IMAGE
  );

  useEffect(() => {
    setCampaignImageSrc(campaignInfo.image || FALLBACK_CAMPAIGN_IMAGE);
  }, [campaignInfo.image]);

  const handleCampaignImageError = () => {
    setCampaignImageSrc(FALLBACK_CAMPAIGN_IMAGE);
  };

  return (
    <article className={styles.campaign_info_card_container}>
      {/* 캠페인 정보 카드 */}
      <div className={styles.campaign_info_card}>
        <div className={styles.campaign_info_top}>
          {/* 캠페인 이미지 - 일반 img 사용 (Next/Image 블러 플레이스홀더 이슈 방지) */}
          <div className={styles.campaign_image}>
            <img
              src={campaignImageSrc}
              alt="캠페인 이미지"
              width={92}
              height={92}
              onError={handleCampaignImageError}
            />
          </div>

          {/* 캠페인 정보 */}
          <div className={styles.campaign_application}>
            <div className={styles.campaign_header}>
              {/* 캠페인 카테고리 - 브랜드 로고 표시 */}
              <div className={styles.campaign_category}>
                {(() => {
                  const logoSrc = getBrandLogo(
                    campaignInfo.brandName || campaignInfo.channel || "기본",
                    campaignInfo.campaignType
                  );
                  return logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt={`${campaignInfo.campaignType} 브랜드 로고`}
                      width={20}
                      height={20}
                      unoptimized
                    />
                  ) : null;
                })()}
                <span>{campaignInfo.campaignType}</span>
              </div>

              <div className={styles.campaign_status}>{derivedStatus}</div>
            </div>

            <h2 className={styles.campaign_title}>{campaignInfo.title}</h2>
            {/* PC에서는 여기에 표시, 모바일에서는 아래로 이동 */}
            <p className={`${styles.campaign_notice} ${styles.campaign_notice_pc}`}>
              {getStatusText(campaignInfoForHelper, reviewingCount, completedCount, derivedStatus)}
            </p>
          </div>
        </div>

        {/* 모바일에서만 표시되는 campaign_notice */}
        <p className={`${styles.campaign_notice} ${styles.campaign_notice_mobile}`}>
          {getStatusText(campaignInfoForHelper, reviewingCount, completedCount, derivedStatus)}
        </p>

        {/* 캠페인 일정 정보 컴포넌트 사용
            📌 컴포넌트 재사용으로 코드 중복 제거
            📌 일정 정보만 별도 컴포넌트로 분리하여 관리 용이
            📌 applicantsCount가 있으면 실제 신청자 수를 사용, 없으면 기존 recruitedCount 사용
        */}
        <CampaignSchedule
          scheduleData={{
            recruitedCount:
              applicantsCount !== undefined ? applicantsCount : campaignInfo.recruitedCount,
            totalCount: campaignInfo.totalCount,
            recruitmentPeriod: campaignInfo.recruitmentPeriod,
            announcementDate: campaignInfo.announcementDate,
            purchasePeriod: campaignInfo.purchasePeriod,
            registrationPeriod: campaignInfo.registrationPeriod,
          }}
          campaignType={campaignInfo.campaignType}
          status={derivedStatus}
        />
      </div>
    </article>
  );
}
