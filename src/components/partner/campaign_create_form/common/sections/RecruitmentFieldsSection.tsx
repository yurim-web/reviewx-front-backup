/* ========================================
   👥 모집 관련 필드 섹션 공통 컴포넌트
   ======================================== */

/**
 * 모집 관련 필드 섹션 공통 컴포넌트
 *
 * 목적: 모집 인원, 모집 기간, 선정 날짜, 등록 기간 등 모집 관련 필드를 재사용 가능하게 만듭니다.
 *
 * 주요 기능:
 * - 모집 인원 입력 (숫자)
 * - 모집 기간 입력
 * - 선정 날짜 입력
 * - 등록 기간 입력
 */

"use client";

import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import { DateRangeField } from "../fields/DateRangeField";

/**
 * 모집 관련 필드 섹션 Props
 *
 * 설명:
 * - recruitmentCount: 모집 인원 값
 * - recruitmentPeriod: 모집 기간 값
 * - announcementDate: 선정 날짜 값
 * - registrationPeriod: 등록 기간 값
 * - onRecruitmentCountChange: 모집 인원 변경 시 호출되는 콜백 함수
 * - onRecruitmentPeriodChange: 모집 기간 변경 시 호출되는 콜백 함수
 * - onAnnouncementDateChange: 선정 날짜 변경 시 호출되는 콜백 함수
 * - onRegistrationPeriodChange: 등록 기간 변경 시 호출되는 콜백 함수
 * - isEditMode: 수정 모드 여부
 * - isEditableField: 필드 편집 가능 여부를 확인하는 함수
 * - showRecruitmentCount: 모집 인원 필드 표시 여부 (기본값: true)
 */
interface RecruitmentFieldsSectionProps {
  /** 모집 인원 값 */
  recruitmentCount: string;
  /** 모집 기간 값 */
  recruitmentPeriod: string;
  /** 선정 날짜 값 */
  announcementDate: string;
  /** 등록 기간 값 */
  registrationPeriod: string;
  /** 모집 인원 변경 시 호출되는 콜백 함수 */
  onRecruitmentCountChange: (value: string) => void;
  /** 모집 기간 변경 시 호출되는 콜백 함수 */
  onRecruitmentPeriodChange: (value: string) => void;
  /** 선정 날짜 변경 시 호출되는 콜백 함수 */
  onAnnouncementDateChange: (value: string) => void;
  /** 등록 기간 변경 시 호출되는 콜백 함수 */
  onRegistrationPeriodChange: (value: string) => void;
  /** 수정 모드 여부 */
  isEditMode?: boolean;
  /** 필드 편집 가능 여부를 확인하는 함수 */
  isEditableField?: (field: string) => boolean;
  /** 모집 인원 필드 표시 여부 (기본값: true) */
  showRecruitmentCount?: boolean;
}

/**
 * 모집 관련 필드 섹션 컴포넌트
 *
 * 설명:
 * - 모집 인원, 모집 기간, 선정 날짜, 등록 기간 필드를 한 번에 렌더링합니다.
 * - 모든 필드는 필수 필드입니다.
 */
export function RecruitmentFieldsSection({
  recruitmentCount,
  recruitmentPeriod,
  announcementDate,
  registrationPeriod,
  onRecruitmentCountChange,
  onRecruitmentPeriodChange,
  onAnnouncementDateChange,
  onRegistrationPeriodChange,
  isEditMode = false,
  isEditableField,
  showRecruitmentCount = true,
}: RecruitmentFieldsSectionProps) {
  // 필드 편집 가능 여부 확인 함수
  // 설명: isEditableField 함수가 제공되지 않으면 기본적으로 편집 가능하다고 가정합니다.
  const canEdit = (field: string) => {
    if (!isEditableField) return !isEditMode;
    return !isEditMode || isEditableField(field);
  };

  return (
    <>
      {/* 모집 인원 - showRecruitmentCount가 true일 때만 표시 */}
      {showRecruitmentCount && (
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            모집 인원<span className={infoStyles.required}>*</span>
          </label>
          <div className={infoStyles.count_input_group}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="number"
                className={infoStyles.form_input}
                value={recruitmentCount}
                onChange={(e) => onRecruitmentCountChange(e.target.value)}
                placeholder="0"
                min="0"
                readOnly={!canEdit("recruitmentCount")}
              />
              <span className={infoStyles.count_unit}>명</span>
            </div>
          </div>
        </article>
      )}

      {/* 모집 기간 */}
      <article className={infoStyles.form_group}>
        <label className={infoStyles.form_label}>
          모집 기간<span className={infoStyles.required}>*</span>
        </label>
        <DateRangeField
          value={recruitmentPeriod}
          onChange={onRecruitmentPeriodChange}
          placeholder=""
          isEditMode={isEditMode}
          isEditable={canEdit("recruitmentPeriod")}
        />
      </article>

      {/* 선정 날짜 */}
      <article className={infoStyles.form_group}>
        <label className={infoStyles.form_label}>
          선정 날짜<span className={infoStyles.required}>*</span>
        </label>
        <input
          type="text"
          className={infoStyles.form_input}
          value={announcementDate}
          onChange={(e) => onAnnouncementDateChange(e.target.value)}
          placeholder=""
          readOnly={!canEdit("announcementDate")}
        />
      </article>

      {/* 등록 기간 */}
      <article className={infoStyles.form_group}>
        <label className={infoStyles.form_label}>
          등록 기간<span className={infoStyles.required}>*</span>
        </label>
        <DateRangeField
          value={registrationPeriod}
          onChange={onRegistrationPeriodChange}
          placeholder=""
          isEditMode={isEditMode}
          isEditable={canEdit("registrationPeriod")}
        />
      </article>
    </>
  );
}

