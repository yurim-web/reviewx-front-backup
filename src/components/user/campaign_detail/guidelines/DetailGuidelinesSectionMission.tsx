/* ========================================
   🎯 미션형 캠페인 안내사항 섹션 컴포넌트
   ======================================== */

/**
 * 미션형 캠페인 전용 가이드라인 섹션 컴포넌트
 *
 * 구성 요소:
 * - 제공내역
 * - 키워드 (복사 기능)
 * - 안내사항 (요구사항)
 * - 유의사항 (가이드라인 텍스트)
 */

import styles from "@/styles/user/campaign/campaign_detail/detail_guidelines_section.module.css";
import AdditionalGuidelines from "../AdditionalGuidelines";
import RequirementIcons from "../RequirementIcons";

interface DetailGuidelinesSectionMissionProps {
  description?: string; // 제공내역 설명
  productLink?: string; // 홍보링크
  onCopyProductLink?: () => void; // 홍보링크 복사 핸들러
  keyword?: string; // 키워드
  onCopyKeyword?: () => void; // 키워드 복사 핸들러
  requirements?: string[]; // 요구사항 코드 목록
  guidelineTexts?: string[]; // 유의사항 텍스트 목록
}

// 기본 유의사항 텍스트 (데이터가 없을 때 사용)
const defaultGuidelineTexts: string[] = [
  "미션형 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
  "★★안내된 가격과 주문 가격이 상이한 경우 임의 주문하지 마시고, 꼭 1:1문의로 제보 부탁드립니다!!★",
  "★제공된 제품을 모두 활용하여 작성해주세요 - 체험 제품의 모든 기능을 체험해보세요 - 사용법, 효과, 만족도 등 다양한 측면에서 리뷰 작성 - 실제 체험 모습과 후기를 솔직하게 작성<br />★미션형 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★미션형 작성 시 실제 제품을 체험하시는 모습 사진 필수 첨부해주세요★<br />★미션형 리뷰 작성 시 별점은 5점으로 등록해주세요★",
  "★미션형 작성 / 무료 체험 캠페인 입니다 (구매 없이 체험 후 리뷰 작성)★ <br /> 1. 본 캠페인은 [무료 체험]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 선정 후 제품 수령 후 체험 진행해주세요<br /> 3. 기간 내 리뷰 작성 및 등록 불가할 경우 다음 캠페인 참여 제한<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★미션형 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 체험한 제품 특장점에 대하여 작성해주세요]",
  "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 제품 미수령 및 체험 불가할 경우 : 다음 캠페인 참여 제한 <br /> - 미션형 리뷰 작성 불가할 경우 : 다음 캠페인 참여 제한 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 공정배너의 경우 리뷰등록화면 내에 코드를 복사하여 등록 부탁드립니다.(스크린샷 불가) <br />- 제공받은 제품으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 다음 캠페인 참여가 제한됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 미션형의 경우 체험 과정과 결과를 상세히 기록해주세요",
];

export default function DetailGuidelinesSectionMission({
  description,
  productLink,
  onCopyProductLink,
  keyword,
  onCopyKeyword,
  requirements,
  guidelineTexts,
}: DetailGuidelinesSectionMissionProps) {
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

      {/* 홍보링크 섹션 */}
      {productLink && (
        <div className={styles.info_item_box}>
          <div className={styles.label_box}>
            <div className={styles.label_keyword_box}>
              <span>홍보링크</span>
              <button
                className={styles.copy_tag_button}
                onClick={onCopyProductLink}
              >
                복사
              </button>
            </div>
          </div>
          <div className={styles.content_box}>
            <div className={styles.keyword_text_box}>{productLink}</div>
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
          <RequirementIcons requirements={requirements} />

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
