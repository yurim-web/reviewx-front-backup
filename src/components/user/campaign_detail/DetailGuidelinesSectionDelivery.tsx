/**
 * 배송형 캠페인 안내사항 섹션 컴포넌트
 *
 * 목적: 배송형 캠페인의 안내사항을 표시합니다.
 *
 * 주요 기능:
 * - 제공내역 표시
 * - 홍보링크 및 복사 버튼
 * - 키워드 및 복사 버튼
 * - 안내 사항 (요구사항 아이콘 + 상세 가이드라인)
 * - 추가 안내사항 컴포넌트
 */

import AdditionalGuidelines from "../campaign/AdditionalGuidelines";
import styles from "../../../styles/user/campaign/campaign_detail.module.css";

/**
 * 요구사항 항목 인터페이스
 */
interface RequirementItem {
  icon: string; // 아이콘 이미지 경로
  alt: string; // 아이콘 대체 텍스트
  text: string; // 요구사항 텍스트
}

// 요구사항 코드 매핑 객체 (기본 5가지 종류)
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
    text: "링크 첨부",
  },
  // 5. 키워드 관련
  keyword: {
    icon: "/images/campaign_detail/keyword_icon.svg",
    alt: "키워드아이콘",
    text: "키워드/태그 첨부",
  },
};

// 요구사항 코드를 실제 객체로 변환하는 함수
function getRequirementItems(requirementCodes: string[]): RequirementItem[] {
  // 순서를 보장하기 위해 명시적으로 순서 정의
  const orderedCodes = [
    "text_1500",
    "photo_10",
    "video_120",
    "product_link",
    "keyword",
  ];

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

/**
 * Props 인터페이스
 */
interface DetailGuidelinesSectionDeliveryProps {
  description?: string; // 제공내역 설명 (선택사항)
  promotionLink?: string; // 홍보링크 내용 (선택사항)
  keyword?: string; // 키워드 내용 (선택사항)
  onCopyPromotionLink?: () => void; // 홍보링크 복사 버튼 클릭 핸들러 (선택사항)
  onCopyKeyword?: () => void; // 키워드 복사 버튼 클릭 핸들러 (선택사항)
  requirements?: string[]; // 요구사항 코드 목록 (예: ["keyword", "product_link", "text_1500"])
  guidelineTexts?: string[]; // 페이지별 상세 가이드 문구 목록(HTML 포함 가능)
}

/**
 * 배송형 캠페인 안내사항 섹션 컴포넌트
 *
 * @param props - DetailGuidelinesSectionDeliveryProps 타입의 속성들
 * @returns 배송형 안내사항 섹션을 담은 JSX 요소
 */
export default function DetailGuidelinesSectionDelivery({
  description,
  promotionLink,
  keyword,
  onCopyPromotionLink,
  onCopyKeyword,
  requirements,
  guidelineTexts,
}: DetailGuidelinesSectionDeliveryProps) {
  // ========================================
  // 기본 요구사항 (props 미전달 시 사용)
  // ========================================
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

  // ========================================
  // 기본 가이드 문구 (props 미전달 시 사용)
  // ========================================
  const defaultGuidelineTexts: string[] = [
    "배송형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
    "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!! 네이버 멤버십 계정이시면 가격이 낮은 경우가 간혹 발생하여 안내드린 가격과 다를 경우, [ 멤버십이 아닌 네이버 계정으로 고지된 금액에 맞게 구매 ] 부탁드립니다★",
    "★제공된 제품을 모두 활용하여 작성해주세요 - 간단한 문구나 이름 인쇄 가능 - 우리 아이 이름 세 글자도 예쁘게 인쇄 가능 - 브랜드 로고, 간단한 디자인도 인쇄 가능<br />★구매평은 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★구매평 작성 시 실제 제품을 사용하시는 모습 사진 필수 첨부해주세요★<br />★구매평 리뷰 작성 시 별점은 5점으로 등록해주세요★",
    "★구매평 작성 / 페이백 캠페인 입니다 (블로그 리뷰 작성 x)★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [선구매]로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정당일 선구매 해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★구매평 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 경험한 제품 특장점에 대하여 작성해주세요]",
    "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 구매처 착오 및 제품 잘못 구매할 경우 : 페이백 미지급 및 선정취소 <br /> - 구매평 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 제품 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 제품 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 체험형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 배송형 캠페인의 경우 구매링크를 꼭 넣어주세요",
  ];

  // requirements가 문자열 배열이면 매핑하여 변환, 아니면 기본값 사용
  const activeRequirements = requirements
    ? getRequirementItems(requirements)
    : defaultRequirements;
  const activeGuidelineTexts = guidelineTexts || defaultGuidelineTexts;

  return (
    // ========================================
    // 배송형 안내 사항 섹션
    // ========================================
    <article className={styles.campaign_detail_info_container}>
      {/* 1. 제공내역 */}
      {description && (
        <div className={styles.info_item_box}>
          <div className={styles.label_box}>제공내역</div>
          <div className={styles.content_box}>{description}</div>
        </div>
      )}

      {/* 2. 홍보링크 */}
      {promotionLink && (
        <div className={styles.info_item_box}>
          <div className={styles.label_box}>
            <div className={styles.label_keyword_box}>
              <span>홍보링크</span>
              <button
                className={styles.copy_tag_button}
                onClick={onCopyPromotionLink}
              >
                복사
              </button>
            </div>
          </div>
          <div className={styles.content_box}>
            <div className={styles.keyword_text_box}>
              <a
                href={promotionLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.promotion_link}
              >
                {promotionLink}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 3. 키워드 */}
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

      {/* 4. 안내 사항 */}
      <div className={styles.info_item_box}>
        <div className={styles.label_box}>안내 사항</div>
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
                <span>{item.text}</span>
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
