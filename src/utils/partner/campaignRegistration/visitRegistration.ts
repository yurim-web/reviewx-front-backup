/* ========================================
   방문형 캠페인 등록 헬퍼
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
import { registerCampaignBase } from "./registerCampaignBase";

/**
 * 지역명 변환 함수
 *
 * RegionFilter.tsx의 형식에 맞게 지역명을 변환합니다.
 * "경기도" → "경기", "인천광역시" → "인천", "충청북도" → "충북" 등
 */
function normalizeRegionName(regionName: string): string {
  if (!regionName) return "";

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

  return (
    regionMapping[regionName] || regionName.replace(/특별시|광역시|특별자치시|도|특별자치도/g, "")
  );
}

/** 방문형 캠페인 등록 처리 */
export async function registerVisitCampaign(
  formData: CampaignFormData,
  isUrgent: boolean,
  userId: string
): Promise<boolean> {
  return registerCampaignBase(formData, isUrgent, userId, {
    addCampaignFn: addVisitCampaign,
    imageUrl: "/images/main/campaign_img/eximg_2.png",
    storageKey: "visitCampaigns",
    preprocessFormData: (fd) => ({
      ...fd,
      region: normalizeRegionName(fd.region || ""),
    }),
    getExtraFields: (fd) => {
      const region = normalizeRegionName(fd.region || "");
      const subRegion = fd.subRegion || "";
      return {
        visitLink: fd.visitLink || "",
        visitZipCode: fd.visitZipCode || "",
        visitBaseAddress: fd.visitBaseAddress || fd.visitAddress || "",
        visitDetailAddress: fd.visitDetailAddress || "",
        visitAddress: fd.visitBaseAddress || fd.visitAddress || "",
        addressGuide: fd.addressDetail || "",
        region: subRegion ? `${region} > ${subRegion}` : region,
        subRegion,
      };
    },
  });
}
