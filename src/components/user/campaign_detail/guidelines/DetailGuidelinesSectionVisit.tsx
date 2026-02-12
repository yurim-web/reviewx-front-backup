/* ========================================
   🚶 방문형 캠페인 안내사항 섹션 컴포넌트
   ======================================== */

/**
 * 방문형 캠페인 안내사항 섹션 컴포넌트
 *
 * 목적: 방문형 캠페인의 안내사항을 표시합니다.
 *
 * 주요 기능:
 * - 제공내역 표시
 * - 방문 주소 및 복사 버튼
 * - 주소 상세 안내
 * - 방문 링크 및 복사 버튼
 * - 키워드 및 복사 버튼
 * - 안내 사항 (요구사항 아이콘 + 상세 가이드라인)
 * - 추가 안내사항 컴포넌트
 */

"use client";

import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const isParticipant =
    searchParams.get("participant") === "true" ||
    searchParams.get("selected") === "true";

  // ========================================
  // 기본 가이드 문구 (props 미전달 시 사용)
  // ========================================
  const defaultGuidelineTexts: string[] = [
    "방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
    "★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장 방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한 시간대에 맞춰 캠페인을 신청해주세요★",
    "★제공된 혜택을 모두 활용하여 작성해주세요 - 매장 방문 체험 필수 - 실제 방문 사진 및 영상 필수 - 매장 분위기 및 서비스 체험 내용 포함<br />★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성 부탁드립니다★<br />★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★<br />★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★",
    "★방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 매장 방문 해주세요<br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게 작성해주세요<br /> ★ [본인이 직접 방문하여 경험한 매장의 특장점에 대하여 작성해주세요]",
    "- 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의 부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요 (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장 정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차 가능 여부)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />- 방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을 기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭 넣어주세요",
  ];

  const activeGuidelineTexts = guidelineTexts || defaultGuidelineTexts;

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
              <button
                className={styles.copy_tag_button}
                onClick={onCopyVisitAddress}
              >
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
              <button
                className={styles.copy_tag_button}
                onClick={onCopyVisitLink}
              >
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

      {/* 6. 안내 사항 */}
      <div className={styles.info_item_box}>
        <div className={styles.label_box}>안내 사항</div>
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

      {/* 참여 캠페인 추가 안내 (공정위 가이드, 캠페인 문의) */}
      {isParticipant && (
        <SelectedCampaignInfo
          onGoToGuide={onCopyVisitLink}
          onCopyContact={onCopyKeyword}
        />
      )}
    </article>
  );
}
