/* ========================================
   📅 캠페인 일정 정보 컴포넌트
   ======================================== */

/**
 * 캠페인 일정 정보 컴포넌트
 *
 * 목적: 캠페인의 일정 정보(모집 인원, 모집 기간, 선정 발표, 등록 기간)를 표시하는 재사용 가능한 컴포넌트입니다.
 *
 * 사용 페이지:
 * - 배송형, 방문형, 리뷰형, 기자단형, 미션형 캠페인 신청내역 페이지
 *
 * 주요 기능:
 * - 캠페인 일정 정보를 그리드 형태로 표시
 * - 재사용 가능한 컴포넌트로 코드 중복 제거
 */

import styles from "../../../styles/partner/campaign_application/campaign_infocard.module.css";

/**
 * 일정 정보 아이템 타입
 * 각 캠페인 타입마다 표시할 정보가 다를 수 있도록 유연한 구조
 */
export interface ScheduleItem {
  /** 라벨 (예: "모집 인원", "모집 기간" 등) */
  label: string;
  /** 값 (예: "20명 / 100명", "2025-09-02 ~ 2025-09-14" 등) */
  value: string | React.ReactNode; // ReactNode로 JSX도 받을 수 있음
}

/**
 * 캠페인 일정 정보 타입 정의
 * 모든 필드를 선택적으로 만들어 각 캠페인 타입에 맞게 사용 가능
 */
export interface CampaignScheduleData {
  /** 모집된 인원 수 (선택적) */
  recruitedCount?: number;
  /** 전체 모집 인원 수 (선택적) */
  totalCount?: number;
  /** 모집 기간 문자열 (선택적) */
  recruitmentPeriod?: string;
  /** 선정 발표일 문자열 (선택적) */
  announcementDate?: string;
  /** 등록 기간 문자열 (선택적) */
  registrationPeriod?: string;
  /** 기타 정보 목록 (동적으로 추가 가능) */
  customItems?: ScheduleItem[];
}

interface CampaignScheduleProps {
  /** 캠페인 일정 데이터 */
  scheduleData: CampaignScheduleData;
}

/**
 * 캠페인 일정 정보 컴포넌트
 *
 * @param {CampaignScheduleProps} props - 컴포넌트 속성
 * @returns JSX.Element 캠페인 일정 정보 UI
 */
export default function CampaignSchedule({
  scheduleData,
}: CampaignScheduleProps) {
  /**
   * 동적으로 일정 정보 목록 생성
   * 각 캠페인 타입에 맞게 필요한 정보만 표시
   */
  const scheduleItems: ScheduleItem[] = [];

  // 모집 인원 정보 추가 (있는 경우)
  if (
    scheduleData.recruitedCount !== undefined &&
    scheduleData.totalCount !== undefined
  ) {
    scheduleItems.push({
      label: "모집 인원",
      value: (
        <>
          <strong>{scheduleData.recruitedCount}명</strong> /{" "}
          {scheduleData.totalCount}명
        </>
      ),
    });
  }

  // 모집 기간 정보 추가 (있는 경우)
  if (scheduleData.recruitmentPeriod) {
    scheduleItems.push({
      label: "모집 기간",
      value: scheduleData.recruitmentPeriod,
    });
  }

  // 선정 발표 정보 추가 (있는 경우)
  if (scheduleData.announcementDate) {
    scheduleItems.push({
      label: "선정 발표",
      value: scheduleData.announcementDate,
    });
  }

  // 등록 기간 정보 추가 (있는 경우)
  if (scheduleData.registrationPeriod) {
    scheduleItems.push({
      label: "등록 기간",
      value: scheduleData.registrationPeriod,
    });
  }

  // 커스텀 정보 추가 (있는 경우)
  if (scheduleData.customItems) {
    scheduleItems.push(...scheduleData.customItems);
  }

  return (
    <div className={styles.campaign_schedule}>
      {/* 
        map 함수로 일정 정보를 동적으로 렌더링
        📌 map: 배열의 각 요소를 새로운 형태로 변환하여 새로운 배열 생성
        📌 key: React가 리스트를 효율적으로 업데이트하기 위해 필요한 고유값
      */}
      {scheduleItems.map((item, index) => (
        <div key={index} className={styles.schedule_item}>
          <span className={styles.schedule_label}>{item.label}</span>
          <span className={styles.schedule_value}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

