/* ========================================
   📰 기자단 캠페인 안내사항 섹션 컴포넌트
   ======================================== */

/**
 * 기자단 캠페인 전용 가이드라인 섹션 컴포넌트
 *
 * 구성 요소:
 * - 제공내역
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

interface DetailGuidelinesSectionReporterProps {
  description?: string; // 제공내역 설명
  productLink?: string; // 홍보링크
  onCopyProductLink?: () => void; // 홍보링크 복사 핸들러
  keyword?: string; // 키워드
  onCopyKeyword?: () => void; // 키워드 복사 핸들러
  requirements?: string[]; // 요구사항 코드 목록
  guidelineTexts?: string[]; // 유의사항 텍스트 목록
}

// 기본 유의사항 텍스트 (데이터가 없을 때 사용) - 기자단 특화
const defaultGuidelineTexts: string[] = [
  "기자단 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해 주세요.",
  "★★기자단 활동은 전문적이고 객관적인 시각으로 작성해주세요!! 해당 분야에 대한 깊이있는 지식과 경험을 바탕으로 작성해주세요★",
  "★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인 리포팅 필수 - 객관적이고 정확한 정보 제공 - 독자에게 유용한 정보 포함<br />★기자단 리포팅은 전문적이고 신뢰성 있게 작성 부탁드립니다★<br />★활동 시 실제 경험하는 모습 사진 필수 첨부해주세요★<br />★기자단 활동에 대한 평가는 객관적으로 작성해주세요★",
  "★기자단 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며 캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은 [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수 있습니다<br /> 2. 당첨당일 기자단 활동 시작해주세요<br /> 3. 기간 내 리포팅 및 작성 등록 불가할 경우 페이백 미지급 및 선정취소<br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다<br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적으로 작성해주세요<br /> ★ [본인이 직접 경험하고 분석한 내용에 대하여 작성해주세요]",
  "- 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의 부탁드립니다 <br /> - 활동 불가 및 활동 착오할 경우 : 페이백 미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백 미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요 - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 기자단 활동 정보는 정확하게 기재해주세요 (활동 장소, 시간, 참여자 등)<br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대 불가합니다.<br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여 제한됩니다.<br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및 혜택 가격에 대하여 비용이 청구됩니다.<br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />- 기자단의 경우 활동 내용과 함께 관련 정보, 참고 자료등을 기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 리포팅을 꼭 해주세요",
];

export default function DetailGuidelinesSectionReporter({
  description,
  productLink,
  onCopyProductLink,
  keyword,
  onCopyKeyword,
  requirements,
  guidelineTexts,
}: DetailGuidelinesSectionReporterProps) {
  // URL 쿼리 파라미터 확인
  // useSearchParams: Next.js에서 URL 쿼리 파라미터를 읽는 Hook입니다.
  // ?selected=true 같은 쿼리 파라미터를 확인하여 선정된 캠페인인지 판단합니다.
  const searchParams = useSearchParams();
  const isParticipant =
    searchParams.get("participant") === "true" ||
    searchParams.get("selected") === "true";

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

      {/* 참여 캠페인 추가 안내 (공정위 가이드, 캠페인 문의) */}
      {isParticipant && (
        <SelectedCampaignInfo
          onGoToGuide={onCopyProductLink}
          onCopyContact={onCopyKeyword}
        />
      )}
    </article>
  );
}
