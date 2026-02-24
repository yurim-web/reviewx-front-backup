/* ========================================
📍 방문형 캠페인 등록 헬퍼
======================================== */

/**
 * 방문형 캠페인 등록 헬퍼
 *
 * 목적: 방문형 캠페인의 등록 처리 로직을 분리 (지역명 정규화 포함)
 *
 * 사용처:
 * - /partner/campaign/create/visit
 */

import { CampaignFormData } from "@/types/domain/user";
import { addVisitCampaign } from "@/data/campaign/visit/visitCampaigns";
import { getPartnerName } from "@/utils/partner/partnerHelpers";
import { saveCampaignToStorage } from "@/utils/partner/campaignStorage";

/**
 * 지역명 변환 함수
 *
 * 설명:
 * - RegionFilter.tsx의 형식에 맞게 지역명을 변환합니다.
 * - "경기도" → "경기", "인천광역시" → "인천", "충청북도" → "충북" 등으로 변환합니다.
 */
function normalizeRegionName(regionName: string): string {
  if (!regionName) return "";

  // 특정 지역명 매핑 (RegionFilter.tsx 형식에 맞춤)
  const regionMapping: Record<string, string> = {
    서울특별시: "서울",
    인천광역시: "인천",
    경기도: "경기",
    강원특별자치도: "강원",
    대전광역시: "대전",
    세종특별자치시: "세종",
    충청북도: "충북",
    충청남도: "충남",
    전라북도: "전북",
    전라남도: "전남",
    광주광역시: "광주",
    대구광역시: "대구",
    경상북도: "경북",
    경상남도: "경남",
    부산광역시: "부산",
    울산광역시: "울산",
    제주특별자치도: "제주",
  };

  // 매핑 객체에 있으면 해당 값 반환, 없으면 접미사 제거
  return (
    regionMapping[regionName] ||
    regionName.replace(/특별시|광역시|특별자치시|도|특별자치도/g, "")
  );
}

/**
 * 방문형 캠페인 등록 처리
 */
export async function registerVisitCampaign(
  formData: CampaignFormData,
  isUrgent: boolean,
  userId: string
): Promise<boolean> {
  try {
    // 긴급 상태를 폼 데이터에 추가
    const finalFormData = { ...formData, isUrgent };

    // 기본 이미지 사용
    const imageUrl = "/images/main/campaign_img/eximg_2.png";

    // 지역 정보 변환
    const normalizedRegion = normalizeRegionName(finalFormData.region || "");
    const normalizedSubRegion = finalFormData.subRegion || "";

    // 변환된 지역 정보를 포함한 폼 데이터 생성
    const formDataWithNormalizedRegion = {
      ...finalFormData,
      region: normalizedRegion,
    };

    // 폼 데이터를 Campaign 형태로 변환
    const newCampaign = addVisitCampaign(formDataWithNormalizedRegion, imageUrl);

    // 등록 시간 생성
    const registeredAt = new Date().toISOString();

    // 파트너명 가져오기
    const partnerName = getPartnerName(userId);

    // 상세 페이지에서 필요한 추가 정보를 포함한 확장 데이터 생성
    const extendedCampaign = {
      ...newCampaign,
      // 파트너 정보
      partner_id: userId,
      partnerName,
      // campaignInfo에도 partnerName 추가
      campaignInfo: {
        ...newCampaign.campaignInfo,
        partnerName,
      },
      // 긴급 캠페인 여부
      isUrgent: isUrgent === true,
      // 등록 시간
      registeredAt,
      // 채널 정보
      channel: finalFormData.platform || "",
      // 상세 정보 (방문형 특화)
      description: finalFormData.providedItems || "",
      visitAddress: finalFormData.visitAddress || "",
      addressGuide: finalFormData.addressDetail || "",
      visitLink: finalFormData.visitLink || "",
      keywords: finalFormData.keywords || "",
      guidelines: finalFormData.guidelines || "",
      // 지역 정보 (변환된 지역명 저장)
      region: normalizedRegion,
      subRegion: normalizedSubRegion,
      // Requirements 생성용 필드들
      minTextLength: finalFormData.minTextLength,
      minImageCount: finalFormData.minImageCount,
      videoCount: finalFormData.videoCount,
      videoDuration: finalFormData.videoDuration,
      requireLinkAttachment: finalFormData.requireLinkAttachment,
      requireKeywordAttachment: finalFormData.requireKeywordAttachment,
      // Points 계산용
      additionalPoints: finalFormData.additionalPoints,
    };

    // localStorage에 저장
    const saved = saveCampaignToStorage(
      extendedCampaign as Record<string, unknown>,
      "visitCampaigns"
    );

    return saved;
  } catch (_error) {
    return false;
  }
}
