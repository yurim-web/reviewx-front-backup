/* ========================================
   🚶 방문형 캠페인 안내사항 섹션 컴포넌트
   ======================================== */

/**
 * 방문형 캠페인 안내사항 섹션 컴포넌트
 *
 * 목적: 방문형 캠페인의 안내사항을 표시합니다.
 *
 * 사용 페이지:
 * - /user/campaign/visit/[id] (방문형 캠페인 상세 페이지)
 */

"use client";

import { useParticipantQuery } from "@/hooks/useParticipantQuery";
import { sanitizeSimpleHtml } from "@/utils/security/sanitize";
import { VISIT_GUIDELINE_DEFAULTS } from "@/data/user/campaign_detail/guidelineDefaults";
import AdditionalGuidelines from "../AdditionalGuidelines";
import RequirementIcons from "../RequirementIcons";
import SelectedCampaignInfo from "../SelectedCampaignInfo";
import styles from "@/styles/user/campaign/campaign_detail/detail_guidelines_section.module.css";

/**
 * Props 인터페이스
 */
interface DetailGuidelinesSectionVisitProps {
  description?: string; // 제공내역 설명 (선택사항)
  visitAddress?: string; // 방문 주소 (선택사항)
  addressGuide?: string; // 주소 상세 안내 (선택사항)
  visitLink?: string; // 방문 링크 (선택사항)
  keyword?: string; // 키워드 내용 (선택사항)
  onCopyVisitAddress?: () => void; // 방문 주소 복사 버튼 클릭 핸들러 (선택사항)
  onCopyVisitLink?: () => void; // 방문 링크 복사 버튼 클릭 핸들러 (선택사항)
  onCopyKeyword?: () => void; // 키워드 복사 버튼 클릭 핸들러 (선택사항)
  requirements?: string[]; // 요구사항 코드 목록 (예: ["keyword", "product_link", "text_1500"])
  guidelineTexts?: string[]; // 페이지별 상세 가이드 문구 목록(HTML 포함 가능)
}

/**
 * 방문형 캠페인 안내사항 섹션 컴포넌트
 *
 * @param props - DetailGuidelinesSectionVisitProps 타입의 속성들
 * @returns 방문형 안내사항 섹션을 담은 JSX 요소
 */
export default function DetailGuidelinesSectionVisit({
  description,
  visitAddress,
  addressGuide,
  visitLink,
  keyword,
  onCopyVisitAddress,
  onCopyVisitLink,
  onCopyKeyword,
  requirements,
  guidelineTexts,
}: DetailGuidelinesSectionVisitProps) {
  const isParticipant = useParticipantQuery();

  const activeGuidelineTexts = guidelineTexts ?? VISIT_GUIDELINE_DEFAULTS;

  return (
    // ========================================
    // 방문형 안내 사항 섹션
    // ========================================
    <article className={styles.campaign_detail_info_container}>
      {/* 1. 제공내역 */}
      {description && (
        <div className={styles.info_item_box}>
          <div className={styles.label_box}>제공내역</div>
          <div className={styles.content_box}>{description}</div>
        </div>
      )}

      {/* 2. 방문 주소 */}
      {visitAddress && (
        <div className={styles.info_item_box}>
          <div className={styles.label_box}>
            <div className={styles.label_keyword_box}>
              <span>방문 주소</span>
              <button className={styles.copy_tag_button} onClick={onCopyVisitAddress}>
                복사
              </button>
            </div>
          </div>
          <div className={styles.content_box}>
            <div className={styles.keyword_text_box}>{visitAddress}</div>
          </div>
        </div>
      )}

      {/* 3. 주소 상세 안내 */}
      {addressGuide && (
        <div className={styles.info_item_box}>
          <div className={styles.label_box}>주소 상세 안내</div>
          <div className={styles.content_box}>{addressGuide}</div>
        </div>
      )}

      {/* 4. 방문 링크 */}
      {visitLink && (
        <div className={styles.info_item_box}>
          <div className={styles.label_box}>
            <div className={styles.label_keyword_box}>
              <span>방문 링크</span>
              <button className={styles.copy_tag_button} onClick={onCopyVisitLink}>
                복사
              </button>
            </div>
          </div>
          <div className={styles.content_box}>
            <div className={styles.keyword_text_box}>
              <a
                href={visitLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.promotion_link}
              >
                {visitLink}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 5. 키워드 */}
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

      {/* 6. 안내 사항 */}
      <div className={styles.info_item_box}>
        <div className={styles.label_box}>안내 사항</div>
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
        <SelectedCampaignInfo onGoToGuide={onCopyVisitLink} onCopyContact={onCopyKeyword} />
      )}
    </article>
  );
}
