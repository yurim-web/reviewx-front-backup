/**
 * 구매평 캠페인 전용 가이드라인 섹션 컴포넌트
 *
 * 구성 요소:
 * - 제공내역
 * - 구매 링크 (복사 기능)
 * - 키워드 (복사 기능)
 * - 안내사항 (요구사항)
 * - 유의사항 (가이드라인 텍스트)
 */

import styles from "../../styles/campaign/campaign_detail.module.css";
import AdditionalGuidelines from "../campaign/AdditionalGuidelines";

interface RequirementItem {
  icon: string;
  alt: string;
  text: string;
}

interface DetailGuidelinesSectionReviewProps {
  description?: string; // 제공내역 설명
  purchaseLink?: string; // 구매 링크
  onCopyPurchaseLink?: () => void; // 구매 링크 복사 핸들러
  keyword?: string; // 키워드
  onCopyKeyword?: () => void; // 키워드 복사 핸들러
  requirements?: string[]; // 요구사항 코드 목록
  guidelineTexts?: string[]; // 유의사항 텍스트 목록
}

// 요구사항 코드를 RequirementItem으로 매핑하는 객체
const requirementMapping: Record<
  string,
  { icon: string; alt: string; text: string }
> = {
  // 1. 글자 관련
  text_1500: {
    icon: "/images/campaign_detail/text_icon.svg",
    alt: "텍스트아이콘",
    text: "1,500자 이상",
  },

  // 2. 사진 관련
  photo_10: {
    icon: "/images/campaign_detail/photo_icon.svg",
    alt: "사진아이콘",
    text: "10장 이상",
  },
  // 3. 비디오 관련
  video_120: {
    icon: "/images/campaign_detail/video_icon.svg",
    alt: "비디오아이콘",
    text: "1개 이상, 120초 이상",
  },
  // 4. 링크 관련
  product_link: {
    icon: "/images/campaign_detail/product_link_icon.svg",
    alt: "제품링크아이콘",
    text: "제품 링크 삽입",
  },
  // 5. 키워드 관련
  keyword: {
    icon: "/images/campaign_detail/keyword_icon.svg",
    alt: "키워드아이콘",
    text: "키워드 삽입",
  },
};

// 요구사항 코드 배열을 RequirementItem 배열로 변환하는 함수
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
        text: `1개 이상, ${number}초 이상`,
      };
    }

    // 기본값
    return {
      icon: "/images/campaign_detail/keyword_icon.svg",
      alt: "기본아이콘",
      text: "요구사항",
    };
  });
}

// 기본 요구사항 (데이터가 없을 때 사용)
const defaultRequirements: RequirementItem[] = [
  {
    icon: "/images/campaign_detail/text_icon.svg",
    alt: "텍스트아이콘",
    text: "1,500자 이상",
  },
  {
    icon: "/images/campaign_detail/photo_icon.svg",
    alt: "사진아이콘",
    text: "10장 이상",
  },
  {
    icon: "/images/campaign_detail/video_icon.svg",
    alt: "비디오아이콘",
    text: "1개 이상, 120초 이상",
  },
  {
    icon: "/images/campaign_detail/product_link_icon.svg",
    alt: "제품링크아이콘",
    text: "제품 링크 삽입",
  },
  {
    icon: "/images/campaign_detail/keyword_icon.svg",
    alt: "키워드아이콘",
    text: "키워드 삽입",
  },
];

// 기본 유의사항 텍스트 (데이터가 없을 때 사용)
const defaultGuidelineTexts: string[] = [
  "구매평 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
  "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
  "★제공된 제품을 모두 활용하여 작성해주세요★",
  "★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★",
];

export default function DetailGuidelinesSectionReview({
  description,
  purchaseLink,
  onCopyPurchaseLink,
  keyword,
  onCopyKeyword,
  requirements,
  guidelineTexts,
}: DetailGuidelinesSectionReviewProps) {
  // 실제 사용할 요구사항과 가이드라인 텍스트 결정
  const activeRequirements = requirements
    ? getRequirementItems(requirements)
    : defaultRequirements;
  const activeGuidelineTexts = guidelineTexts || defaultGuidelineTexts;

  return (
    <article className={styles.campaign_detail_info_container}>
      {/* 제공내역 섹션 */}
      {description && (
        <div className={styles.info_item_box}>
          <div className={styles.label_box}>제공내역</div>
          <div className={styles.content_box}>{description}</div>
        </div>
      )}

      {/* 구매링크 섹션 */}
      {purchaseLink && (
        <div className={styles.info_item_box}>
          <div className={styles.label_box}>
            <div className={styles.label_keyword_box}>
              <span>구매 링크</span>
              <button
                className={styles.copy_tag_button}
                onClick={onCopyPurchaseLink}
              >
                복사
              </button>
            </div>
          </div>
          <div className={styles.content_box}>
            <div className={styles.keyword_text_box}>
              <a
                href={purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.promotion_link}
              >
                {purchaseLink}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 키워드 섹션 */}
      {keyword && (
        <div className={styles.info_item_box}>
          <div className={styles.label_box}>
            <div className={styles.label_keyword_box}>
              <span>키워드</span>
              <button
                className={styles.copy_tag_button}
                onClick={onCopyKeyword}
              >
                복사
              </button>
            </div>
          </div>
          <div className={styles.content_box}>
            <div className={styles.keyword_text_box}>
              {keyword || "자유롭게 입력하세요."}
            </div>
          </div>
        </div>
      )}

      {/* 안내사항 섹션 */}
      <div className={styles.info_item_box}>
        <div className={styles.label_box}>안내사항</div>
        <div className={styles.content_box}>
          {/* 요구사항 아이콘 리스트 */}
          <div className={styles.requirement_container}>
            {activeRequirements.map((item, index) => (
              <div key={index} className={styles.requirement_item}>
                <img
                  className={styles.requirement_icon}
                  src={item.icon}
                  alt={item.alt}
                />
                <span className={styles.requirement_text}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* 상세 가이드라인 */}
          <div
            className={`${styles.requirement_container} ${styles.important_note_container}`}
          >
            {activeGuidelineTexts.map((text, index) => (
              <div
                key={index}
                className={styles.guideline_text}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 추가 안내사항 컴포넌트 */}
      <AdditionalGuidelines />
    </article>
  );
}
