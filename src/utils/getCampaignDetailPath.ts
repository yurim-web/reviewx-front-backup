/**
 * 캠페인 타입에 따른 상세 페이지 경로 생성 유틸리티
 *
 * 설명:
 * - 캠페인 타입과 ID를 사용하여 상세 페이지 경로를 생성합니다.
 * - 관리자와 파트너 모두에서 사용할 수 있는 공통 유틸리티입니다.
 */

export type CampaignType = "배송형" | "방문형" | "구매평" | "기자단" | "미션형";

/**
 * 캠페인 타입을 URL 경로 형식으로 변환
 *
 * @param type - 캠페인 타입
 * @returns URL 경로 형식 (예: "delivery", "visit")
 */
export function getCampaignTypePath(type: CampaignType): string {
  const typeMap: Record<CampaignType, string> = {
    배송형: "delivery",
    방문형: "visit",
    구매평: "review",
    기자단: "reporter",
    미션형: "mission",
  };

  return typeMap[type] || "delivery";
}

/**
 * 캠페인 ID를 실제 캠페인 데이터의 ID 형식으로 변환
 *
 * 설명:
 * - ID가 이미 "delivery_1" 형식이면 그대로 반환
 * - 그렇지 않으면 타입에 맞는 형식으로 변환
 *
 * @param type - 캠페인 타입
 * @param id - 캠페인 ID
 * @returns 변환된 캠페인 ID (예: "delivery_1")
 */
export function convertToCampaignDataId(
  type: CampaignType,
  id: string
): string {
  const typePath = getCampaignTypePath(type);

  // ID가 이미 "delivery_1" 형식인지 확인
  if (id.startsWith(`${typePath}_`)) {
    return id;
  }

  // ID를 실제 캠페인 데이터 형식으로 변환
  return `${typePath}_${id}`;
}

/**
 * 캠페인 상세 페이지 경로 생성
 *
 * @param type - 캠페인 타입
 * @param id - 캠페인 ID
 * @returns 상세 페이지 경로 (예: "/campaign/delivery/delivery_1")
 */
export function getCampaignDetailPath(type: CampaignType, id: string): string {
  const campaignTypePath = getCampaignTypePath(type);
  const campaignDataId = convertToCampaignDataId(type, id);
  return `/campaign/${campaignTypePath}/${campaignDataId}`;
}
