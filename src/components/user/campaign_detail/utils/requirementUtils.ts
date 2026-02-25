/* ========================================
   요구사항 매핑 공통 유틸
   ======================================== */

/**
 * requirementUtils
 *
 * 목적: 캠페인 상세 페이지의 요구사항 코드를 아이콘·라벨·텍스트 객체로 변환하는 공통 유틸입니다.
 *
 * 사용 페이지:
 * - /user/campaign/[type]/[id] (캠페인 상세 - RequirementIcons, DetailGuidelinesSection)
 */

/**
 * 요구사항 항목 인터페이스
 */
export interface RequirementItem {
  icon: string; // 아이콘 이미지 경로
  alt: string; // 아이콘 대체 텍스트
  label: string; // 제목 (글자, 이미지, 동영상, 링크, 키워드/태그)
  text: string; // 요구사항 상세 (예: 1,500자 이상, 10장 이상)
}

/**
 * 요구사항 코드 기본 매핑 객체
 * label: 제목(RequirementIcons에서 표시), text: 상세 내용
 */
export const REQUIREMENT_MAPPING: Record<string, RequirementItem> = {
  // 1. 글자 관련
  text_1500: {
    icon: "/images/campaign_detail/text_icon.svg",
    alt: "텍스트아이콘",
    label: "글자",
    text: "1,500자 이상",
  },

  // 2. 사진 관련
  photo_10: {
    icon: "/images/campaign_detail/photo_icon.svg",
    alt: "사진아이콘",
    label: "이미지",
    text: "10장 이상",
  },

  // 3. 비디오 관련
  video_120: {
    icon: "/images/campaign_detail/video_icon.svg",
    alt: "비디오아이콘",
    label: "동영상",
    text: "1개 이상, 120초 이상",
  },

  // 4. 링크 관련
  product_link: {
    icon: "/images/campaign_detail/product_link_icon.svg",
    alt: "제품링크아이콘",
    label: "링크",
    text: "본문 내 첨부",
  },

  // 5. 키워드 관련
  keyword: {
    icon: "/images/campaign_detail/keyword_icon.svg",
    alt: "키워드아이콘",
    label: "키워드/태그",
    text: "본문 내 첨부",
  },
};

/**
 * 요구사항 코드 배열을 RequirementItem 배열로 변환합니다.
 * text_N, photo_N, video_N, video_N_N 패턴을 동적으로 처리합니다.
 *
 * @param requirementCodes - 요구사항 코드 배열 (예: ["keyword", "text_1500", "photo_5"])
 * @returns RequirementItem 배열
 */
export function getRequirementItems(requirementCodes: string[]): RequirementItem[] {
  return requirementCodes.map((code) => {
    // 기본 매핑에서 찾기
    if (REQUIREMENT_MAPPING[code]) {
      return REQUIREMENT_MAPPING[code];
    }

    // text_숫자 패턴 처리 (예: text_800, text_2500 등)
    const textMatch = code.match(/^text_(\d+)$/);
    if (textMatch) {
      return {
        icon: "/images/campaign_detail/text_icon.svg",
        alt: "텍스트아이콘",
        label: "글자",
        text: `${textMatch[1]}자 이상`,
      };
    }

    // photo_숫자 패턴 처리 (예: photo_5, photo_15 등)
    const photoMatch = code.match(/^photo_(\d+)$/);
    if (photoMatch) {
      return {
        icon: "/images/campaign_detail/photo_icon.svg",
        alt: "사진아이콘",
        label: "이미지",
        text: `${photoMatch[1]}장 이상`,
      };
    }

    // video_개수_시간 패턴 처리 (예: video_1_120, video_2_180 등)
    const videoDoubleMatch = code.match(/^video_(\d+)_(\d+)$/);
    if (videoDoubleMatch) {
      return {
        icon: "/images/campaign_detail/video_icon.svg",
        alt: "비디오아이콘",
        label: "동영상",
        text: `${videoDoubleMatch[1]}개 이상, ${videoDoubleMatch[2]}초 이상`,
      };
    }

    // video_숫자 패턴 처리 (예: video_60, video_180 등)
    const videoMatch = code.match(/^video_(\d+)$/);
    if (videoMatch) {
      return {
        icon: "/images/campaign_detail/video_icon.svg",
        alt: "비디오아이콘",
        label: "동영상",
        text: `1개 이상, ${videoMatch[1]}초 이상`,
      };
    }

    // 기본값
    return {
      icon: "/images/campaign_detail/keyword_icon.svg",
      alt: "기본아이콘",
      label: "키워드/태그",
      text: "요구사항",
    };
  });
}
