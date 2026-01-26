/* ========================================
   📋 요구사항 아이콘 리스트 컴포넌트
   ======================================== */

/**
 * 요구사항 아이콘 리스트 컴포넌트
 *
 * 목적: 캠페인 상세 페이지에서 공통으로 사용되는 요구사항 아이콘들을 표시합니다.
 *
 * 주요 기능:
 * - 다양한 요구사항 코드를 아이콘과 텍스트로 변환
 * - 동적 패턴 매칭 (text_숫자, photo_숫자, video_숫자 등)
 * - 기본 요구사항 제공
 */

import styles from "@/styles/user/campaign/campaign_detail/requirement_icons.module.css";

/**
 * 요구사항 항목 인터페이스
 */
interface RequirementItem {
  icon: string; // 아이콘 이미지 경로
  alt: string; // 아이콘 대체 텍스트
  label: string; // 제목 (글자, 이미지, 동영상, 링크, 키워드/태그)
  text: string; // 요구사항 상세 (예: 1,500자 이상, 10장 이상)
}

/**
 * Props 인터페이스
 */
interface RequirementIconsProps {
  requirements?: string[]; // 요구사항 코드 목록 (예: ["keyword", "product_link", "text_1500"])
  className?: string; // 추가 CSS 클래스
}

// 요구사항 코드 매핑 객체 (기본 5가지 종류) — label: 제목, text: 상세
const requirementMapping: Record<
  string,
  { icon: string; alt: string; label: string; text: string }
> = {
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

// 요구사항 코드를 실제 객체로 변환하는 함수
function getRequirementItems(requirementCodes: string[]): RequirementItem[] {
  return requirementCodes.map((code) => {
    // 기본 매핑에서 찾기
    if (requirementMapping[code]) {
      return requirementMapping[code];
    }

    // text_숫자 패턴 처리 (예: text_800, text_2500 등)
    const textMatch = code.match(/^text_(\d+)$/);
    if (textMatch) {
      const number = textMatch[1];
      return {
        icon: "/images/campaign_detail/text_icon.svg",
        alt: "텍스트아이콘",
        label: "글자",
        text: `${number}자 이상`,
      };
    }

    // photo_숫자 패턴 처리 (예: photo_5, photo_15 등)
    const photoMatch = code.match(/^photo_(\d+)$/);
    if (photoMatch) {
      const number = photoMatch[1];
      return {
        icon: "/images/campaign_detail/photo_icon.svg",
        alt: "사진아이콘",
        label: "이미지",
        text: `${number}장 이상`,
      };
    }

    // video_개수_시간 패턴 처리 (예: video_1_120, video_2_180 등)
    const videoDoubleMatch = code.match(/^video_(\d+)_(\d+)$/);
    if (videoDoubleMatch) {
      const count = videoDoubleMatch[1];
      const seconds = videoDoubleMatch[2];
      return {
        icon: "/images/campaign_detail/video_icon.svg",
        alt: "비디오아이콘",
        label: "동영상",
        text: `${count}개 이상, ${seconds}초 이상`,
      };
    }

    // video_숫자 패턴 처리 (시간만, 개수는 1개로 기본값) (예: video_60, video_180 등)
    const videoMatch = code.match(/^video_(\d+)$/);
    if (videoMatch) {
      const number = videoMatch[1];
      return {
        icon: "/images/campaign_detail/video_icon.svg",
        alt: "비디오아이콘",
        label: "동영상",
        text: `1개 이상, ${number}초 이상`,
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

/**
 * 요구사항 아이콘 리스트 컴포넌트
 *
 * @param props - RequirementIconsProps 타입의 속성들
 * @returns 요구사항 아이콘 리스트를 담은 JSX 요소
 */
export default function RequirementIcons({
  requirements,
  className = "",
}: RequirementIconsProps) {
  // requirements가 없으면 아무것도 렌더링하지 않음
  if (!requirements || requirements.length === 0) {
    return null;
  }

  // requirements가 있으면 매핑하여 변환
  const activeRequirements = getRequirementItems(requirements);

  return (
    <div className={`${styles.requirement_container} ${className}`}>
      {activeRequirements.map((item, index) => (
        <div key={index} className={styles.requirement_item}>
          <img
            className={styles.requirement_icon}
            src={item.icon}
            alt={item.alt}
          />
          <span className={styles.requirement_label}>{item.label}</span>
          <span className={styles.requirement_text}>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
