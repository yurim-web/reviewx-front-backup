/* ========================================
   📋 유의 사항 섹션 컴포넌트
   ======================================== */

/**
 * 유의 사항 섹션 컴포넌트
 *
 * 목적: 모든 캠페인 폼에서 공통으로 사용되는 유의 사항 섹션
 *
 * 사용 컴포넌트:
 * - DeliveryCampaignForm.tsx (배송형 캠페인 폼)
 * - VisitCampaignForm.tsx (방문형 캠페인 폼)
 * - ReviewCampaignForm.tsx (구매평 캠페인 폼)
 * - ReporterCampaignForm.tsx (기자단 캠페인 폼)
 * - MissionCampaignForm.tsx (미션형 캠페인 폼)
 *
 * 사용 페이지:
 * - /partner/campaign_application/create (캠페인 생성 페이지)
 * - /partner/campaign_application/edit (캠페인 수정 페이지)
 *
 * 주요 기능:
 * - 캠페인 참여 시 유의사항 표시
 * - 10개 항목의 규칙 및 정책 안내
 * - 일관된 스타일링 적용
 */

import styles from '@/styles/partner/campaign_create/notice_section.module.css';

export default function NoticeSection() {
  return (
    <article className={styles.form_group}>
      <label className={styles.form_label}>유의 사항</label>
      <div className={styles.notice_content}>
        <ul>
          <li>
            선정된 캠페인은 타인에게 양도 · 판매 · 교환이 불가합니다. 적발 시
            <span className={styles.highlight}>
              제품/서비스 정가 및 배송비가 청구되며, 영구 차단
            </span>
            될 수 있습니다.
          </li>
          <li>
            허위 · 과장 · 비방 · 타사 비교 등 소비자를 오인시킬 수 있는 표현은
            금지됩니다.
          </li>
          <li>선정 후 제공 내역 및 배송지/방문지 변경은 불가합니다.</li>
          <li>당첨 후 취소 시 패널티가 발생합니다.</li>
          <li>미션이 제대로 지켜지지 않을 시 수정 요청이 있을 수 있습니다.</li>
          <li>
            리뷰는 반드시 해당 제품/서비스 단독으로 촬영 · 작성해야 합니다. 타
            제품/서비스와 함께 업로드 시 재작성 요청이 있을 수 있습니다.
          </li>
          <li>
            리뷰는 반드시 지정된 기간 내 등록해야 합니다. 기간을 초과할 경우
            제공 내역 비용이 청구되거나 패널티가 발생합니다.
          </li>
          <li>
            작성된 콘텐츠는 최소 6개월간 유지해야 하며, 유지하지 않을 경우
            패널티가 발생합니다.
          </li>
          <li>
            생성형 AI로 작성된 콘텐츠 및 이미지는 수정 요청 또는 패널티가
            발생합니다.
          </li>
          <li>미션 불이행, 리뷰 미제출, 기한 미준수 시 패널티가 발생합니다.</li>
        </ul>
      </div>
    </article>
  );
}
