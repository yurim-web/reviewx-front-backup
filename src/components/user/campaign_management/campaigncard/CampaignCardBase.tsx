/* ========================================
   📋 캠페인 카드 기본 컴포넌트 (공통 부분)
   ======================================== */

/**
 * 캠페인 카드 기본 컴포넌트
 *
 * 목적: 모든 탭에서 공통으로 사용되는 캠페인 카드의 기본 구조를 제공합니다.
 *

 */

import Link from "next/link";
import type { CampaignApplication, CampaignType } from "@/types/domain/user";
import cardStyles from "../../../../styles/user/campaign_management/campaign_card.module.css";
import { CamTag, CamCateIcon } from "../CampaignTag";

interface CampaignCardBaseProps {
  campaign: CampaignApplication;
  statusText: string;
  children: React.ReactNode; // 버튼 영역에 들어갈 내용
}

/**
 * CampaignApplication의 ID를 실제 캠페인 데이터의 ID 형식으로 변환하는 함수
 *
 * 설명:
 * - CampaignApplication의 id는 "1", "2" 같은 단순 숫자 형식입니다.
 * - 실제 캠페인 상세페이지 데이터는 "delivery_1", "delivery_2" 같은 형식을 사용합니다.
 * - 이 함수는 CampaignApplication의 id를 실제 캠페인 데이터의 id 형식으로 변환합니다.
 *
 * 예시:
 * - type: "배송형", id: "1" → "delivery_1"
 * - type: "방문형", id: "15" → "visit_15"
 * - type: "구매평", id: "14" → "review_14"
 *
 * @param type - 캠페인 타입 (예: "배송형", "방문형", "구매평", "기자단", "미션형")
 * @param id - CampaignApplication의 ID (예: "1", "2")
 * @returns 실제 캠페인 데이터의 ID 형식 (예: "delivery_1", "visit_15")
 */
const convertToCampaignDataId = (type: CampaignType, id: string): string => {
  // 캠페인 타입을 URL 경로 형식으로 매핑하는 객체
  // Record<키타입, 값타입>: TypeScript에서 객체 타입을 정의하는 방법입니다.
  const typeMap: Record<CampaignType, string> = {
    배송형: "delivery",
    방문형: "visit",
    구매평: "review",
    기자단: "reporter",
    미션형: "mission",
  };

  // 타입에 해당하는 경로 형식 가져오기
  // 예: "배송형" → "delivery"
  const typePath = typeMap[type];

  // ID가 이미 "delivery_1" 형식인지 확인
  // startsWith: 문자열이 특정 문자열로 시작하는지 확인하는 메서드입니다.
  if (id.startsWith(`${typePath}_`)) {
    // 이미 올바른 형식이면 그대로 반환
    return id;
  }

  // ID를 실제 캠페인 데이터 형식으로 변환
  // 템플릿 리터럴: 백틱(`)을 사용하여 문자열과 변수를 함께 사용할 수 있습니다.
  // 예: `delivery_1`, `visit_15`
  return `${typePath}_${id}`;
};

/**
 * 캠페인 타입에 따른 상세페이지 경로 생성 함수
 *
 * 설명:
 * - 캠페인 타입("배송형", "방문형" 등)을 URL 경로 형식("delivery", "visit" 등)으로 변환합니다.
 * - CampaignApplication의 id를 실제 캠페인 데이터의 id 형식으로 변환한 후 경로를 생성합니다.
 * - 선정 상태인 경우 쿼리 파라미터 `selected=true`를 추가합니다.
 *
 * @param type - 캠페인 타입 (예: "배송형", "방문형", "구매평", "기자단", "미션형")
 * @param id - CampaignApplication의 ID (예: "1", "2" 또는 "delivery_1", "delivery_2")
 * @param status - 캠페인 상태 (예: "신청", "선정", "완료", "취소/반려")
 * @returns 상세페이지 경로 (예: "/campaign/delivery/delivery_1" 또는 "/campaign/delivery/delivery_1?selected=true")
 */
const getCampaignDetailPath = (
  type: CampaignType,
  id: string,
  status: CampaignApplication["status"]
): string => {
  // CampaignApplication의 ID를 실제 캠페인 데이터의 ID 형식으로 변환
  // 예: "1" → "delivery_1", "15" → "visit_15"
  const campaignDataId = convertToCampaignDataId(type, id);

  // 캠페인 타입을 URL 경로로 매핑하는 객체
  const typeMap: Record<CampaignType, string> = {
    배송형: "delivery",
    방문형: "visit",
    구매평: "review",
    기자단: "reporter",
    미션형: "mission",
  };

  // 매핑된 경로를 사용하여 상세페이지 경로 생성
  // 템플릿 리터럴: 백틱(`)을 사용하여 문자열과 변수를 함께 사용할 수 있습니다.
  // 예: `/campaign/delivery/delivery_1` → "/campaign/delivery/delivery_1"
  const basePath = `/campaign/${typeMap[type]}/${campaignDataId}`;

  // 선정 상태인 경우 쿼리 파라미터 추가
  // 쿼리 파라미터: URL 끝에 ?key=value 형태로 추가하여 페이지에 정보를 전달할 수 있습니다.
  // 예: "/campaign/delivery/delivery_1?selected=true"
  if (status === "선정") {
    return `${basePath}?selected=true`;
  }

  return basePath;
};

/**
 * 캠페인 카드의 공통 구조
 *
 * 설명:
 * - 모든 탭에서 동일하게 표시되는 캠페인 정보 영역을 담당합니다.
 * - 버튼 영역은 children으로 받아서 각 탭별 컴포넌트에서 커스터마이징할 수 있습니다.
 * - 캠페인 정보 영역을 클릭하면 해당 캠페인의 상세페이지로 이동합니다.
 * - 버튼 영역은 링크 밖에 있어서 버튼 클릭 시에는 상세페이지로 이동하지 않습니다.
 */
export default function CampaignCardBase({
  campaign,
  statusText,
  children,
}: CampaignCardBaseProps) {
  // 캠페인 상세페이지 경로 생성
  // getCampaignDetailPath 함수를 호출하여 캠페인 타입, ID, 상태로 경로를 만듭니다.
  // 선정 상태인 경우 쿼리 파라미터 ?selected=true가 추가됩니다.
  const detailPath = getCampaignDetailPath(
    campaign.type,
    campaign.id,
    campaign.status
  );

  return (
    <div className={cardStyles.campaign_card}>
      {/* 캠페인 정보 영역 - Link로 감싸서 클릭 시 상세페이지로 이동 */}
      {/* 
        Next.js Link 컴포넌트:
        - href: 이동할 경로를 지정합니다.
        - 클라이언트 사이드 라우팅: 페이지 전체를 새로고침하지 않고 빠르게 이동합니다.
        - className: CSS 모듈 클래스를 적용할 수 있습니다.
      */}
      <Link href={detailPath} className={cardStyles.campaign_content}>
        {/* 캠페인 이미지 */}
        <div className={cardStyles.campaign_image}>
          {campaign.image && <img src={campaign.image} alt={campaign.title} />}
        </div>

        {/* 캠페인 상세 정보 */}
        <div className={cardStyles.campaign_info}>
          {/* 헤더: 카테고리 아이콘 + 마감 태그 */}
          {/* 취소/반려 탭과 완료 탭에서는 태그를 표시하지 않습니다 */}
          <div className={cardStyles.campaign_header}>
            <CamCateIcon category={campaign.category} type={campaign.type} />
            {/* 취소/반려 또는 완료 상태가 아닐 때만 태그 표시 */}
            {campaign.status !== "취소/반려" && campaign.status !== "완료" && (
              <CamTag
                isUrgent={campaign.isUrgent}
                remainingDays={campaign.remainingDays}
              />
            )}
          </div>

          {/* 캠페인 제목 */}
          <h3 className={cardStyles.campaign_title}>{campaign.title}</h3>

          {/* 캠페인 상태 설명 */}
          <p className={cardStyles.campaign_status}>{statusText}</p>
        </div>
      </Link>

      {/* 액션 버튼 영역 - children으로 받아서 각 탭별로 다른 버튼 표시 */}
      {/* 
        버튼 영역은 Link 밖에 있어서:
        - 버튼 클릭 시에는 상세페이지로 이동하지 않습니다.
        - 버튼의 고유 기능(신청 취소, 콘텐츠 등록 등)만 실행됩니다.
      */}
      {children}
    </div>
  );
}
