/* ========================================
   기자단 캠페인 안내사항 섹션 컴포넌트
   ======================================== */

/**
 * DetailGuidelinesSectionReporter
 *
 * 목적: 기자단 캠페인 상세 페이지의 안내사항 섹션을 렌더링합니다.
 *
 * 사용 페이지:
 * - /user/campaign/[id] (기자단 캠페인 상세 > 안내사항 섹션)
 */

"use client";

import { useParticipantQuery } from "@/hooks/useParticipantQuery";
import { sanitizeSimpleHtml } from "@/utils/security/sanitize";
import { REPORTER_GUIDELINE_DEFAULTS } from "@/data/user/campaign_detail/guidelineDefaults";
import styles from "@/styles/user/campaign/campaign_detail/detail_guidelines_section.module.css";
import AdditionalGuidelines from "../AdditionalGuidelines";
import RequirementIcons from "../RequirementIcons";
import SelectedCampaignInfo from "../SelectedCampaignInfo";

interface DetailGuidelinesSectionReporterProps {
  description?: string; // 제공내역 설명
  productLink?: string; // 홍보링크
  onCopyProductLink?: () => void; // 홍보링크 복사 핸들러
  keyword?: string; // 키워드
  onCopyKeyword?: () => void; // 키워드 복사 핸들러
  requirements?: string[]; // 요구사항 코드 목록
  guidelineTexts?: string[]; // 유의사항 텍스트 목록
}

export default function DetailGuidelinesSectionReporter({
  description,
  productLink,
  onCopyProductLink,
  keyword,
  onCopyKeyword,
  requirements,
  guidelineTexts,
}: DetailGuidelinesSectionReporterProps) {
  const isParticipant = useParticipantQuery();

  const activeGuidelineTexts = guidelineTexts ?? REPORTER_GUIDELINE_DEFAULTS;

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
              <button className={styles.copy_tag_button} onClick={onCopyProductLink}>
                복사
              </button>
            </div>
          </div>
          <div className={styles.content_box}>
            <div className={styles.keyword_text_box}>
              <a
                href={productLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.promotion_link}
              >
                {productLink}
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
              <button className={styles.copy_tag_button} onClick={onCopyKeyword}>
                복사
              </button>
            </div>
          </div>
          <div className={styles.content_box}>
            <div className={styles.keyword_text_box}>{keyword || "자유롭게 입력하세요."}</div>
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
          <div className={`${styles.requirement_container} ${styles.important_note_container}`}>
            {activeGuidelineTexts.map((text, index) => (
              <div
                key={index}
                className={styles.guideline_text}
                dangerouslySetInnerHTML={{ __html: sanitizeSimpleHtml(text) }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 추가 안내사항 컴포넌트 */}
      <AdditionalGuidelines />

      {/* 참여 캠페인 추가 안내 (공정위 가이드, 캠페인 문의) */}
      {isParticipant && (
        <SelectedCampaignInfo onGoToGuide={onCopyProductLink} onCopyContact={onCopyKeyword} />
      )}
    </article>
  );
}
