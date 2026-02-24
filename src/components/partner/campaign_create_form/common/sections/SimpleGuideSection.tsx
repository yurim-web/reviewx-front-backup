/* ========================================
   📋 간편 안내 섹션 공통 컴포넌트
   ======================================== */

/**
 * 간편 안내 섹션 공통 컴포넌트
 *
 * 목적: 글자 수, 이미지 장수, 동영상 개수/초수, 본문 링크/키워드 첨부 등 간편 안내 옵션을 재사용 가능하게 만듭니다.
 *
 */

"use client";

import sectionStyles from "@/styles/partner/campaign_create/campaign_guide/sections.module.css";
import optionStyles from "@/styles/partner/campaign_create/campaign_guide/options.module.css";
import inputStyles from "@/styles/partner/campaign_create/campaign_guide/inputs.module.css";

/**
 * 간편 안내 섹션 Props
 *
 * 설명:
 * - checkboxStates: 체크박스 상태 객체
 * - formData: 폼 데이터 객체
 * - onCheckboxChange: 체크박스 변경 시 호출되는 콜백 함수
 * - onNumericChange: 숫자 입력 변경 시 호출되는 콜백 함수
 * - onNumericKeyDown: 숫자 입력 키 입력 시 호출되는 콜백 함수
 * - formatNumberWithComma: 숫자에 쉼표를 추가하는 함수
 * - isEditMode: 수정 모드 여부
 * - isEditableField: 필드 편집 가능 여부를 확인하는 함수
 */
interface SimpleGuideSectionProps {
  /** 체크박스 상태 객체 */
  checkboxStates: {
    minTextLength: boolean;
    minImageCount: boolean;
    videoCount: boolean;
  };
  /** 폼 데이터 객체 */
  formData: {
    minTextLength: string;
    minImageCount: string;
    videoCount: string;
    videoDuration: string;
    requireLinkAttachment: boolean;
    requireKeywordAttachment: boolean;
  };
  /** 체크박스 변경 시 호출되는 콜백 함수 */
  onCheckboxChange: (
    field: "minTextLength" | "minImageCount" | "videoCount",
    checked: boolean
  ) => void;
  /** 숫자 입력 변경 시 호출되는 콜백 함수 */
  onNumericChange: (field: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 숫자 입력 키 입력 시 호출되는 콜백 함수 */
  onNumericKeyDown: (field: string, e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** 숫자에 쉼표를 추가하는 함수 */
  formatNumberWithComma: (value: string | number | undefined) => string;
  /** 체크박스 해제 시 필드 초기화 함수 */
  onFieldClear: (field: string) => void;
  /** 본문 링크/키워드 첨부 변경 시 호출되는 콜백 함수 */
  onAttachmentChange: (
    field: "requireLinkAttachment" | "requireKeywordAttachment",
    value: boolean
  ) => void;
  /** 수정 모드 여부 */
  isEditMode?: boolean;
  /** 필드 편집 가능 여부를 확인하는 함수 */
  isEditableField?: (field: string) => boolean;
  /** 캠페인 오픈 여부 (오픈 후에만 locked_section 클래스 적용) */
  isOpen?: boolean;
}

/**
 * 간편 안내 섹션 컴포넌트
 *
 * 설명:
 * - 글자 수, 이미지 장수, 동영상 개수/초수, 본문 링크/키워드 첨부 옵션을 제공합니다.
 * - 체크박스를 선택하면 해당 옵션의 입력 필드가 표시됩니다.
 * - 기본 미션 설정에서 설정된 항목(체크된 항목)만 노출됩니다.
 */
export function SimpleGuideSection({
  checkboxStates,
  formData,
  onCheckboxChange,
  onNumericChange,
  onNumericKeyDown,
  formatNumberWithComma,
  onFieldClear,
  onAttachmentChange,
  isEditMode = false,
  isEditableField,
  isOpen = false,
}: SimpleGuideSectionProps) {
  // 필드 편집 가능 여부 확인 함수
  const canEdit = (field: string) => {
    if (!isEditableField) return !isEditMode;
    return !isEditMode || isEditableField(field);
  };

  // 오픈 후에만 locked_section 클래스 적용
  const shouldLock = isEditMode && isOpen;

  return (
    <div
      className={
        shouldLock
          ? `${sectionStyles.guide_section} ${sectionStyles.locked_section}`
          : sectionStyles.guide_section
      }
      data-locked={shouldLock ? "true" : undefined}
    >
      {/* 글자 수 */}
      <div className={optionStyles.option_input_box}>
        <input
          type="checkbox"
          id="minTextLength"
          checked={checkboxStates.minTextLength}
          onChange={(e) => {
            onCheckboxChange("minTextLength", e.target.checked);
            if (!e.target.checked) {
              onFieldClear("minTextLength");
            }
          }}
          disabled={!canEdit("minTextLength")}
        />
        <label htmlFor="minTextLength" className={optionStyles.option_label}>
          글자 수
        </label>
        {checkboxStates.minTextLength && (
          <div className={optionStyles.option_input_value}>
            <input
              type="text"
              className={inputStyles.underline_input}
              value={formatNumberWithComma(formData.minTextLength)}
              onChange={(e) => onNumericChange("minTextLength", e)}
              onKeyDown={(e) => onNumericKeyDown("minTextLength", e)}
              readOnly={!canEdit("minTextLength")}
            />
            <span className={inputStyles.unit_text}>자 이상</span>
          </div>
        )}
      </div>

      {/* 이미지 장수 */}
      <div className={optionStyles.option_input_box}>
        <input
          type="checkbox"
          id="minImageCount"
          checked={checkboxStates.minImageCount}
          onChange={(e) => {
            onCheckboxChange("minImageCount", e.target.checked);
            if (!e.target.checked) {
              onFieldClear("minImageCount");
            }
          }}
          disabled={!canEdit("minImageCount")}
        />
        <label htmlFor="minImageCount" className={optionStyles.option_label}>
          이미지 장수
        </label>
        {checkboxStates.minImageCount && (
          <div className={optionStyles.option_input_value}>
            <input
              type="text"
              className={inputStyles.underline_input}
              value={formatNumberWithComma(formData.minImageCount)}
              onChange={(e) => onNumericChange("minImageCount", e)}
              onKeyDown={(e) => onNumericKeyDown("minImageCount", e)}
              readOnly={!canEdit("minImageCount")}
            />
            <span className={inputStyles.unit_text}>장 이상</span>
          </div>
        )}
      </div>

      {/* 동영상 개수, 초수 */}
      <div className={`${optionStyles.option_input_box} ${optionStyles.video_option_box}`}>
        <input
          type="checkbox"
          id="videoCount"
          checked={checkboxStates.videoCount}
          onChange={(e) => {
            onCheckboxChange("videoCount", e.target.checked);
            if (!e.target.checked) {
              onFieldClear("videoCount");
              onFieldClear("videoDuration");
            }
          }}
          disabled={!canEdit("videoCount")}
        />
        <label htmlFor="videoCount" className={optionStyles.option_label}>
          동영상 개수, 초수
        </label>
        {checkboxStates.videoCount && (
          <div className={`${optionStyles.option_input_value} ${optionStyles.video_input_value}`}>
            {/* 동영상 개수 입력 필드 */}
            <div className={optionStyles.video_input_row}>
              <input
                type="text"
                className={inputStyles.underline_input}
                value={formatNumberWithComma(formData.videoCount)}
                onChange={(e) => onNumericChange("videoCount", e)}
                onKeyDown={(e) => onNumericKeyDown("videoCount", e)}
                readOnly={!canEdit("videoCount")}
              />
              <span className={inputStyles.unit_text}>개 이상,</span>
            </div>

            {/* 동영상 초수 입력 필드 */}
            <div className={optionStyles.video_input_row}>
              <input
                type="text"
                className={inputStyles.underline_input}
                value={formatNumberWithComma(formData.videoDuration)}
                onChange={(e) => onNumericChange("videoDuration", e)}
                onKeyDown={(e) => onNumericKeyDown("videoDuration", e)}
                readOnly={!canEdit("videoDuration")}
              />
              <span className={inputStyles.unit_text}>초 이상</span>
            </div>
          </div>
        )}
      </div>

      {/* 본문 링크 첨부 */}
      <div className={optionStyles.option_input_box}>
        <input
          type="checkbox"
          id="requireLinkAttachment"
          checked={formData.requireLinkAttachment}
          onChange={(e) => onAttachmentChange("requireLinkAttachment", e.target.checked)}
          disabled={!canEdit("requireLinkAttachment")}
        />
        <label htmlFor="requireLinkAttachment" className={optionStyles.option_label}>
          본문 링크 첨부
        </label>
      </div>

      {/* 본문 키워드/태그 첨부 */}
      <div className={optionStyles.option_input_box}>
        <input
          type="checkbox"
          id="requireKeywordAttachment"
          checked={formData.requireKeywordAttachment}
          onChange={(e) => onAttachmentChange("requireKeywordAttachment", e.target.checked)}
          disabled={!canEdit("requireKeywordAttachment")}
        />
        <label htmlFor="requireKeywordAttachment" className={optionStyles.option_label}>
          본문 키워드/태그 첨부
        </label>
      </div>
    </div>
  );
}
