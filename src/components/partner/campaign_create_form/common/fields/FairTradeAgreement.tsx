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
 */

"use client";

import guideStyles from "@/styles/partner/campaign_create/campaign_guide.module.css";

/**
 * 공정위 문구 동의 Props
 *
 * 설명:
 * - agreed: 동의 여부
 * - onChange: 동의 상태 변경 시 호출되는 콜백 함수
 * - isEditMode: 수정 모드 여부
 */
interface FairTradeAgreementProps {
  /** 동의 여부 */
  agreed: boolean;
  /** 동의 상태 변경 시 호출되는 콜백 함수 */
  onChange: (agreed: boolean) => void;
  /** 수정 모드 여부 */
  isEditMode?: boolean;
}

/**
 * 공정위 문구 동의 컴포넌트
 *
 * 설명:
 * - 공정거래위원회 문구(경제적 이해관계)는 필수 안내 사항입니다.
 * - 해당 내용의 삭제 요청은 규정에 위반됨을 인지하고 캠페인을 등록하겠습니다.
 */
export function FairTradeAgreement({
  agreed,
  onChange,
  isEditMode = false,
}: FairTradeAgreementProps) {
  return (
    <div className={guideStyles.fair_trade_agreement}>
      <input
        type="checkbox"
        id="fairTradeAgreement"
        checked={agreed}
        onChange={(e) => onChange(e.target.checked)}
        disabled={isEditMode}
        className={guideStyles.fair_trade_checkbox}
      />
      <label
        htmlFor="fairTradeAgreement"
        className={`${guideStyles.fair_trade_label} ${isEditMode ? guideStyles.disabled : ""}`}
      >
        공정위 문구(경제적 이해관계)는 필수 안내 사항입니다. 해당 내용의 삭제
        요청은 규정에 위반됨을 인지하고 캠페인을 등록하겠습니다.
      </label>
    </div>
  );
}

