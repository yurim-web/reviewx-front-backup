/* ========================================
   ⭐ 구매평 캠페인 안내사항 섹션 컴포넌트
   ======================================== */

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

"use client";

import { useSearchParams } from "next/navigation";
import styles from "@/styles/user/campaign/campaign_detail/detail_guidelines_section.module.css";
import AdditionalGuidelines from "../AdditionalGuidelines";
import RequirementIcons from "../RequirementIcons";
import SelectedCampaignInfo from "../SelectedCampaignInfo";

interface DetailGuidelinesSectionReviewProps {
  description?: string; // 제공내역 설명
  purchaseLink?: string; // 구매 링크
  onCopyPurchaseLink?: () => void; // 구매 링크 복사 핸들러
  keyword?: string; // 키워드
  onCopyKeyword?: () => void; // 키워드 복사 핸들러
  requirements?: string[]; // 요구사항 코드 목록
  guidelineTexts?: string[]; // 유의사항 텍스트 목록
}

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
  // URL 쿼리 파라미터 확인
  // useSearchParams: Next.js에서 URL 쿼리 파라미터를 읽는 Hook입니다.
  // ?selected=true 같은 쿼리 파라미터를 확인하여 선정된 캠페인인지 판단합니다.
  const searchParams = useSearchParams();
  const isSelected = searchParams.get("selected") === "true";

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
        <div>
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

      {/* 선정 후 추가 안내 섹션 (조건부 렌더링) */}
      {isSelected && (
        <SelectedCampaignInfo
          onCopyFtcImage={onCopyPurchaseLink}
          onCopyContact={onCopyKeyword}
        />
      )}
    </article>
  );
}
