/* ========================================
   🎯 캠페인 유형 선택 컴포넌트
   ======================================== */

/**
 * 캠페인 유형 선택 컴포넌트
 *
 * 목적: 캠페인 생성/수정 시 캠페인 유형을 선택하는 UI를 제공합니다.
 *
 * 사용 페이지:
 * - /partner/campaign_application/create (캠페인 생성 페이지)
 * - /partner/campaign_application/edit (캠페인 수정 페이지)
 *
 * 주요 기능:
 * - 5가지 캠페인 유형 중 하나 선택 (배송형, 방문형, 구매평, 기자단, 미션형)
 * - 현재 선택된 유형 하이라이트
 * - 수정 모드에서 비활성화 가능
 */

'use client';

import type { CampaignType } from '@/types/domain/user';
import { campaign_types } from '../constants/constants';
// CSS 모듈 import
import header_styles from '@/styles/partner/campaign_create/campaign_header.module.css';
import info_styles from '@/styles/partner/campaign_create/campaign_info.module.css';

/**
 * 캠페인 유형 선택 컴포넌트 Props
 *
 * 설명:
 * - currentType: 현재 선택된 캠페인 유형
 * - onTypeChange: 유형이 변경될 때 호출되는 콜백 함수
 * - disabled: 버튼 비활성화 여부 (수정 모드에서 사용)
 */
interface CampaignTypeSelectorProps {
  currentType: CampaignType;
  onTypeChange: (type: CampaignType) => void;
  disabled?: boolean;
}

/**
 * 캠페인 유형 선택 컴포넌트
 *
 * 설명:
 * - 5개의 캠페인 유형 버튼을 가로로 배치합니다.
 * - 선택된 유형은 활성화 스타일이 적용됩니다.
 * - disabled가 true이면 모든 버튼이 비활성화됩니다.
 */
export function CampaignTypeSelector({
  currentType,
  onTypeChange,
  disabled = false,
}: CampaignTypeSelectorProps) {
  return (
    <article className={info_styles.form_group}>
      <label className={info_styles.form_label}>
        캠페인 유형<span className={info_styles.required}>*</span>
      </label>
      <div className={header_styles.campaign_type_buttons}>
        {campaign_types.map((type) => (
          <button
            key={type}
            type="button"
            className={`${header_styles.campaign_type_button} ${
              currentType === type ? header_styles.active : ''
            } ${disabled ? header_styles.disabled_button : ''}`}
            onClick={disabled ? undefined : () => onTypeChange(type)}
            disabled={disabled}
          >
            {type}
          </button>
        ))}
      </div>
    </article>
  );
}
