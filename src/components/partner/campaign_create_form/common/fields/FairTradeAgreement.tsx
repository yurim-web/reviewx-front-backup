/* ========================================
   ✅ 공정위 문구 동의 컴포넌트
   ======================================== */

/**
 * 공정위 문구 동의 컴포넌트
 *
 * 목적: 공정거래위원회 문구(경제적 이해관계) 동의 체크박스를 제공합니다.
 *
 * 주요 기능:
 * - 공정위 문구 동의 체크박스
 * - 필수 안내 사항 표시
 * - 등록 버튼 활성화를 위한 필수 체크
 *
 * 사용처:
 * - VisitCampaignForm.tsx (방문형 캠페인 폼)
 * - ReviewCampaignForm.tsx (구매평 캠페인 폼)
 * - ReporterCampaignForm.tsx (기자단 캠페인 폼)
 * - MissionCampaignForm.tsx (미션형 캠페인 폼)
 * - DeliveryCampaignForm.tsx (배송형 캠페인 폼)
 */

"use client";

import guideStyles from "@/styles/partner/campaign_create/campaign_guide/fair_trade.module.css";

/**
 * 공정위 문구 동의 Props
 *
 * 설명:
 *
 * - agreed: 동의 여부
 * - onChange: 동의 상태 변경 시 호출되는 콜백 함수
 * - isEditMode: 수정 모드 여부
 * - isOpen: 캠페인 오픈 여부 (오픈 후에는 체크박스 비활성화)
 */
interface FairTradeAgreementProps {
  /** 동의 여부 */
  agreed: boolean;
  /** 동의 상태 변경 시 호출되는 콜백 함수 */
  onChange: (agreed: boolean) => void;
  /** 수정 모드 여부 */
  isEditMode?: boolean;
  /** 캠페인 오픈 여부 (오픈 후에는 체크박스 비활성화) */
  isOpen?: boolean;
}

/**
 * 공정위 문구 동의 컴포넌트
 *
 * 설명:
 * - 공정거래위원회 문구(경제적 이해관계)는 필수 안내 사항입니다.
 * - 해당 내용의 삭제 요청은 규정에 위반됨을 인지하고 캠페인을 등록하겠습니다.
 * - 오픈 전: 체크박스 수정 가능
 * - 오픈 후: 체크박스 비활성화 (이미 동의한 상태 유지)
 */
export function FairTradeAgreement({
  agreed,
  onChange,
  isEditMode = false,
  isOpen = false,
}: FairTradeAgreementProps) {
  // 오픈 후에는 체크박스 비활성화 (이미 동의한 상태이므로)
  const isDisabled = isEditMode && isOpen;

  return (
    <div className={guideStyles.fair_trade_agreement}>
      <input
        type="checkbox"
        id="fairTradeAgreement"
        checked={agreed}
        onChange={(e) => onChange(e.target.checked)}
        disabled={isDisabled}
        className={guideStyles.fair_trade_checkbox}
      />
      <label
        htmlFor="fairTradeAgreement"
        className={`${guideStyles.fair_trade_label} ${
          isDisabled ? guideStyles.disabled : ""
        }`}
      >
        공정위 문구(경제적 이해관계)는 필수 안내 사항입니다. 해당 내용의 삭제
        요청은 규정에 위반됨을 인지하고 캠페인을 등록하겠습니다.
      </label>
    </div>
  );
}
