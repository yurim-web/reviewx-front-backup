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
 */

import styles from "@/styles/partner/campaign_application/campaign_infocard.module.css";

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
  /** 구매 기간 문자열 (구매평 캠페인용, 선택적) */
  purchasePeriod?: string;
  /** 등록 기간 문자열 (선택적) */
  registrationPeriod?: string;
  /** 기타 정보 목록 (동적으로 추가 가능) */
  customItems?: ScheduleItem[];
}

interface CampaignScheduleProps {
  /** 캠페인 일정 데이터 */
  scheduleData: CampaignScheduleData;
  /** 캠페인 유형 - 배송형, 방문형, 구매평, 기자단, 미션형 (선택적) */
  campaignType?: "배송형" | "방문형" | "구매평" | "기자단" | "미션형";
  /** 캠페인 상태 - 대기 중, 모집 중, 선정 중 등 (선택적) */
  status?:
    | "대기 중"
    | "모집 중"
    | "선정 중"
    | "구매 중"
    | "등록 중"
    | "마감"
    | "취소"
    | "진행 중"
    | "종료"
    | "긴급";
}

/**
 * 캠페인 일정 정보 컴포넌트
 *
 * @param {CampaignScheduleProps} props - 컴포넌트 속성
 * @returns JSX.Element 캠페인 일정 정보 UI
 */
export default function CampaignSchedule({
  scheduleData,
  campaignType: _campaignType,
  status,
}: CampaignScheduleProps) {
  /**
   * 동적으로 일정 정보 목록 생성
   * 각 캠페인 타입에 맞게 필요한 정보만 표시
   */
  const scheduleItems: ScheduleItem[] = [];

  /**
   * 포인트 스타일 적용 여부 확인 함수
   * 모든 캠페인 유형 + 상태에 따라 포인트 스타일 적용
   *
   * @param itemLabel - 일정 항목 라벨 (예: "모집 인원", "모집 기간", "선정 발표", "구매 기간", "등록 기간")
   * @returns 포인트 스타일 적용 여부
   *
   * 📌 적용 조건:
   * - 모든 캠페인 유형 (배송형, 방문형, 구매평, 기자단, 미션형)
   * - "모집 중" 상태: 모집 인원, 모집 기간에 포인트 스타일 적용
   * - "선정 중" 상태: 모집 인원, 선정 발표에 포인트 스타일 적용
   * - "구매 중" 상태(구매평): 모집 인원, 구매 기간에 포인트 스타일 적용
   * - "등록 중" 상태: 모집 인원, 등록 기간에 포인트 스타일 적용
   * - "마감" 상태: 모집 인원(n명) 숫자 부분에만 포인트 스타일 적용
   */
  const shouldApplyPointStyle = (itemLabel: string): boolean => {
    // 모집 중 상태일 때: 모집 인원과 모집 기간에 포인트 스타일 적용
    if (status === "모집 중") {
      return itemLabel === "모집 인원" || itemLabel === "모집 기간";
    }
    // 선정 중 상태일 때: 모집 인원과 선정 발표에 포인트 스타일 적용
    if (status === "선정 중") {
      return itemLabel === "모집 인원" || itemLabel === "선정 발표";
    }
    // 구매 중 상태(구매평)일 때: 모집 인원과 구매 기간에 포인트 스타일 적용
    if (status === "구매 중") {
      return itemLabel === "모집 인원" || itemLabel === "구매 기간";
    }
    // 등록 중 상태일 때: 모집 인원과 등록 기간에 포인트 스타일 적용
    if (status === "등록 중") {
      return itemLabel === "모집 인원" || itemLabel === "등록 기간";
    }
    // 마감 상태일 때: 모집 인원(n명) 숫자 부분에만 포인트 스타일 적용
    if (status === "마감") {
      return itemLabel === "모집 인원";
    }
    return false;
  };

  // 모집 인원 정보 추가 (있는 경우)
  if (scheduleData.recruitedCount !== undefined && scheduleData.totalCount !== undefined) {
    const isPointStyle = shouldApplyPointStyle("모집 인원");
    scheduleItems.push({
      label: "모집 인원",
      value: (
        <>
          <strong className={isPointStyle ? styles.schedule_value_point : undefined}>
            {scheduleData.recruitedCount}명
          </strong>{" "}
          / {scheduleData.totalCount}명
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

  // 구매 기간 정보 추가 (구매평 캠페인용, 있는 경우)
  if (scheduleData.purchasePeriod) {
    scheduleItems.push({
      label: "구매 기간",
      value: scheduleData.purchasePeriod,
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
      {scheduleItems.map((item, index) => {
        // 포인트 스타일 적용 여부 확인
        const isPointStyle = shouldApplyPointStyle(item.label);
        // 모집 인원의 경우 전체 값이 아닌 라벨과 첫 번째 숫자에만 포인트 스타일 적용
        const isRecruitmentCount = item.label === "모집 인원";
        // 라벨에 포인트를 적용할지 여부 (마감 상태의 모집 인원은 라벨은 기본색 유지)
        const applyLabelPoint = isPointStyle && !(status === "마감" && isRecruitmentCount);
        return (
          <div key={index} className={styles.schedule_item}>
            <span
              className={
                applyLabelPoint
                  ? `${styles.schedule_label} ${styles.schedule_label_point}`
                  : styles.schedule_label
              }
            >
              {item.label}
            </span>
            <span
              className={
                // 모집 인원은 전체 값에 포인트 스타일 적용하지 않음 (라벨과 첫 번째 숫자만 적용)
                isPointStyle && !isRecruitmentCount
                  ? `${styles.schedule_value} ${styles.schedule_value_point}`
                  : styles.schedule_value
              }
            >
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
