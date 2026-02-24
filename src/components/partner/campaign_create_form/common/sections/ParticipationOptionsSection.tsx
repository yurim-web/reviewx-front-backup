/* ========================================
   ✅ 참여/제출 옵션 섹션 공통 컴포넌트
   ======================================== */

/**
 * 참여/제출 옵션 섹션 공통 컴포넌트
 *
 * 목적: 만 19세 이상 참여 허용, 이전 참여자 재참여 허용, 지각 제출 허용 등 참여/제출 옵션을 재사용 가능하게 만듭니다.
 *
 */

"use client";

import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import optionStyles from "@/styles/partner/campaign_create/campaign_guide/options.module.css";

/**
 * 참여/제출 옵션 섹션 Props
 *
 * 설명:
 * - adultOnly: 만 19세 이상 참여 허용 여부
 * - allowReParticipation: 이전 참여자 재참여 허용 여부
 * - allowLateSubmission: 지각 제출 허용 여부
 * - onAdultOnlyChange: 만 19세 이상 참여 허용 변경 시 호출되는 콜백 함수
 * - onAllowReParticipationChange: 이전 참여자 재참여 허용 변경 시 호출되는 콜백 함수
 * - onAllowLateSubmissionChange: 지각 제출 허용 변경 시 호출되는 콜백 함수
 * - isEditMode: 수정 모드 여부
 * - isEditableField: 필드 편집 가능 여부를 확인하는 함수
 * - additionalOptions: 추가 옵션들 (미션형의 경우 콘텐츠 링크/이미지 제출 등)
 */
interface ParticipationOptionsSectionProps {
  /** 만 19세 이상 참여 허용 여부 */
  adultOnly: boolean;
  /** 이전 참여자 재참여 허용 여부 */
  allowReParticipation: boolean;
  /** 지각 제출 허용 여부 */
  allowLateSubmission: boolean;
  /** 만 19세 이상 참여 허용 변경 시 호출되는 콜백 함수 */
  onAdultOnlyChange: (value: boolean) => void;
  /** 이전 참여자 재참여 허용 변경 시 호출되는 콜백 함수 */
  onAllowReParticipationChange: (value: boolean) => void;
  /** 지각 제출 허용 변경 시 호출되는 콜백 함수 */
  onAllowLateSubmissionChange: (value: boolean) => void;
  /** 수정 모드 여부 */
  isEditMode?: boolean;
  /** 필드 편집 가능 여부를 확인하는 함수 */
  isEditableField?: (field: string) => boolean;
  /** 추가 옵션들 */
  additionalOptions?: Array<{
    id: string;
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
    field: string;
  }>;
}

/**
 * 참여/제출 옵션 섹션 컴포넌트
 *
 * 설명:
 * - 만 19세 이상 참여 허용, 이전 참여자 재참여 허용, 지각 제출 허용 옵션을 제공합니다.
 * - 추가 옵션이 있으면 함께 표시합니다 (예: 미션형의 콘텐츠 링크/이미지 제출).
 */
export function ParticipationOptionsSection({
  adultOnly,
  allowReParticipation,
  allowLateSubmission,
  onAdultOnlyChange,
  onAllowReParticipationChange,
  onAllowLateSubmissionChange,
  isEditMode = false,
  isEditableField,
  additionalOptions = [],
}: ParticipationOptionsSectionProps) {
  // 필드 편집 가능 여부 확인 함수
  const canEdit = (field: string) => {
    if (!isEditableField) return !isEditMode;
    return !isEditMode || isEditableField(field);
  };

  return (
    <article className={infoStyles.form_group}>
      <label className={infoStyles.form_label}>
        참여/제출 옵션<span className={infoStyles.required}>*</span>
      </label>

      {/* 추가 옵션들 (미션형의 경우 콘텐츠 링크/이미지 제출 등) */}
      {additionalOptions.map((option) => (
        <div key={option.id} className={optionStyles.option_input_box}>
          <input
            type="checkbox"
            id={option.id}
            checked={option.checked}
            onChange={(e) => option.onChange(e.target.checked)}
            disabled={!canEdit(option.field)}
          />
          <label htmlFor={option.id} className={optionStyles.option_label}>
            {option.label}
          </label>
          <div className={optionStyles.option_input_value}></div>
        </div>
      ))}

      {/* 만 19세 이상 참여 허용 */}
      <div className={optionStyles.option_input_box}>
        <input
          type="checkbox"
          id="adultOnly"
          checked={adultOnly}
          onChange={(e) => onAdultOnlyChange(e.target.checked)}
          disabled={!canEdit("adultOnly")}
        />
        <label htmlFor="adultOnly" className={optionStyles.option_label}>
          만 19세 이상 참여 허용 (성인인증이 필요한 제품/서비스)
        </label>
        <div className={optionStyles.option_input_value}></div>
      </div>

      {/* 이전 참여자 재참여 허용 */}
      <div className={optionStyles.option_input_box}>
        <input
          type="checkbox"
          id="allowReParticipation"
          checked={allowReParticipation}
          onChange={(e) => onAllowReParticipationChange(e.target.checked)}
          disabled={!canEdit("allowReParticipation")}
        />
        <label htmlFor="allowReParticipation" className={optionStyles.option_label}>
          이전 참여자 재참여 허용
        </label>
        <div className={optionStyles.option_input_value}></div>
      </div>

      {/* 지각 제출 허용 */}
      <div className={optionStyles.option_input_box}>
        <input
          type="checkbox"
          id="allowLateSubmission"
          checked={allowLateSubmission}
          onChange={(e) => onAllowLateSubmissionChange(e.target.checked)}
          disabled={!canEdit("allowLateSubmission")}
        />
        <label htmlFor="allowLateSubmission" className={optionStyles.option_label}>
          지각 제출 허용 (7일)
        </label>
        <div className={optionStyles.option_input_value}></div>
      </div>
    </article>
  );
}
