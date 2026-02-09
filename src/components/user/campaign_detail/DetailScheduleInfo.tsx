/* ========================================
   📅 캠페인 일정 정보 컴포넌트
   ======================================== */

/**
 * 캠페인 일정 정보 컴포넌트
 *
 * 목적: 캠페인의 모집 인원, 일정 등의 정보를 표시합니다.
 *
 * 주요 기능:
 * - 모집 인원 (현재/전체) — 항상 포인트 색상 (#FF5694)
 * - 모집 기간 — 오늘이 모집 기간이면 포인트
 * - 선정 발표일 — 오늘이 선정 발표일이면 포인트
 * - 추가 일정 (등록 기간, 구매 기간 등) — 오늘이 해당 기간이면 포인트
 */

import styles from "@/styles/user/campaign/campaign_detail/detail_schedule_info.module.css";

/**
 * 일정 항목 인터페이스
 */
interface ScheduleItem {
  label: string; // 항목 라벨 (예: "구매 기간", "등록 기간")
  value: string; // 항목 값
  isRecruitmentInfo?: boolean; // 모집 기간인지 여부 (스타일 적용용)
}

/**
 * Props 인터페이스
 */
interface CampaignScheduleInfoProps {
  currentRecruitment: number; // 현재 모집 인원
  totalRecruitment: number; // 전체 모집 인원
  applicationStart: string; // 모집 시작일
  applicationEnd: string; // 모집 종료일
  announcement: string; // 선정 발표일
  additionalSchedules?: ScheduleItem[]; // 추가 일정 (선택사항)
}

/* ----- 날짜 유틸 (오늘 기준 포인트 판별용) ----- */

/** 시간 제거 후 날짜만 비교용 Date 반환 */
function to_date_only(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

/**
 * "A ~ B" 또는 "A~B" 형식의 기간 문자열을 파싱합니다.
 * 단일 날짜면 start === end 로 취급합니다.
 */
function parse_date_range(value: string): { start: Date; end: Date } | null {
  if (!value?.trim()) return null;
  const sep = value.includes(" ~ ") ? " ~ " : "~";
  const parts = value.split(sep).map((s) => s.trim()).filter(Boolean);
  const startStr = parts[0];
  const endStr = parts[1] ?? parts[0];
  if (!startStr) return null;
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  return { start: to_date_only(start), end: to_date_only(end) };
}

/** 오늘이 [applicationStart, applicationEnd] 모집 기간 안에 있는지 */
function is_today_in_recruitment(start: string, end: string): boolean {
  if (!start?.trim() || !end?.trim()) return false;
  const range = parse_date_range(`${start} ~ ${end}`);
  if (!range) return false;
  const today = to_date_only(new Date());
  return today >= range.start && today <= range.end;
}

/** 오늘이 선정 발표일인지 */
function is_today_announcement(announcement: string): boolean {
  if (!announcement?.trim()) return false;
  const d = new Date(announcement.trim());
  if (isNaN(d.getTime())) return false;
  const today = to_date_only(new Date());
  const ann = to_date_only(d);
  return today.getTime() === ann.getTime();
}

/** 오늘이 해당 기간 value("A ~ B") 안에 있는지 (등록/구매 기간 등) */
function is_today_in_schedule_value(value: string): boolean {
  const range = parse_date_range(value);
  if (!range) return false;
  const today = to_date_only(new Date());
  return today >= range.start && today <= range.end;
}

/**
 * 캠페인 일정 정보 컴포넌트
 *
 * @param props - CampaignScheduleInfoProps 타입의 속성들
 * @returns 캠페인 일정 정보를 담은 JSX 요소
 */
export default function CampaignScheduleInfo({
  currentRecruitment,
  totalRecruitment,
  applicationStart,
  applicationEnd,
  announcement,
  additionalSchedules = [],
}: CampaignScheduleInfoProps) {
  /*
   * 오늘 날짜 기준 포인트 적용 대상
   * 우선순위: 선정 발표일 > 모집 기간 > 등록 기간 / 구매 기간 (추가 일정)
   * findIndex: 조건에 맞는 첫 번째 인덱스 반환, 없으면 -1
   */
  const is_announcement_point = is_today_announcement(announcement);
  const is_recruitment_point =
    !is_announcement_point && is_today_in_recruitment(applicationStart, applicationEnd);
  const highlighted_additional_index = (() => {
    if (is_announcement_point || is_recruitment_point) return -1;
    return additionalSchedules.findIndex(
      (s) =>
        (s.label === "등록 기간" || s.label === "구매 기간") &&
        is_today_in_schedule_value(s.value)
    );
  })();

  return (
    <>
    <article className={styles.campaign_info}>
      {/* 모집 인원 — 라벨 + 신청 인원(앞 n명)만 포인트, 총 모집 인원(뒤 n명)은 기본 */}
      <div className={styles.info_item_container}>
        <span className={`${styles.label} ${styles.label_point}`}>모집 인원</span>
        <span className={styles.value}>
          <span className={`${styles.current_count} ${styles.current_count_point}`}>
            {currentRecruitment}명
          </span>
          <span className={styles.separator}> / </span>
          <span className={styles.total_count}>{totalRecruitment}명</span>
        </span>
      </div>

      {/* 모집 기간 — 오늘이 모집 기간이면 포인트 */}
      <div className={styles.info_item_container}>
        <span
          className={`${styles.label} ${is_recruitment_point ? styles.label_point : ""}`}
        >
          모집 기간
        </span>
        <span
          className={`${styles.value} ${styles.recruitment_info} ${is_recruitment_point ? styles.value_point : ""}`}
        >
          {applicationStart} ~ {applicationEnd}
        </span>
      </div>

      {/* 선정 발표 — 오늘이 선정 발표일이면 포인트 */}
      <div className={styles.info_item_container}>
        <span
          className={`${styles.label} ${is_announcement_point ? styles.label_point : ""}`}
        >
          선정 발표
        </span>
        <span
          className={`${styles.value} ${is_announcement_point ? styles.value_point : ""}`}
        >
          {announcement}
        </span>
      </div>

      {/*
       * 추가 일정 (등록 기간, 구매 기간 등) — 오늘이 해당 기간이면 포인트
       * map(): 배열 각 항목을 JSX로 변환, key는 React 리스트 렌더링 필수
       */}
      {additionalSchedules.map((schedule, index) => {
        const is_point = index === highlighted_additional_index;
        return (
          <div key={index} className={styles.info_item_container}>
            <span
              className={`${styles.label} ${is_point ? styles.label_point : ""}`}
            >
              {schedule.label}
            </span>
            <span
              className={`${styles.value} ${schedule.isRecruitmentInfo ? styles.recruitment_info : ""} ${is_point ? styles.value_point : ""}`}
            >
              {schedule.value}
            </span>
          </div>
        );
      })}
    </article>

    {/* 회색 구분선 - article 밖, 양옆 공간 없이 전체 너비 */}
    <div className={styles.separator_line} aria-hidden="true" />
    </>
  );
}
