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

/* ========================================
   🎓 학습 포인트 & 사용 예시
   ========================================

   📌 컴포넌트 분리의 장점:
   1. 재사용성: 같은 기능을 여러 곳에서 사용 가능
   2. 유지보수: 한 곳만 수정하면 모든 곳에 반영
   3. 가독성: 코드가 더 간결하고 이해하기 쉬움
   4. 테스트: 작은 단위로 테스트 가능

   📌 선택적 필드(Optional Fields):
   - 필드명 뒤에 ?를 붙이면 선택적 필드가 됨
   - 예: `recruitedCount?: number` → 있어도 되고 없어도 됨
   - 각 캠페인 타입에 맞게 필요한 정보만 전달 가능

   📌 동적 렌더링:
   - 배열을 동적으로 생성하고 map으로 렌더링
   - 조건부로 필요한 정보만 추가하여 유연한 구조

   📌 React.ReactNode:
   - 문자열뿐만 아니라 JSX 요소도 값으로 받을 수 있음
   - 복잡한 UI 구조를 값으로 전달 가능

   📌 사용 예시:

   // 1. 모든 정보 표시 (기본)
   <CampaignSchedule
     scheduleData={{
       recruitedCount: 20,
       totalCount: 100,
       recruitmentPeriod: "2025-09-02 ~ 2025-09-14",
       announcementDate: "2025-09-16",
       registrationPeriod: "2025-09-22 ~ 2025-09-30",
     }}
   />

   // 2. 일부 정보만 표시
   <CampaignSchedule
     scheduleData={{
       recruitmentPeriod: "2025-09-02 ~ 2025-09-14",
       announcementDate: "2025-09-16",
     }}
   />

   // 3. 커스텀 정보 추가
   <CampaignSchedule
     scheduleData={{
       recruitedCount: 20,
       totalCount: 100,
       customItems: [
         { label: "특별 혜택", value: "무료 배송" },
         { label: "제한 인원", value: "선착순 50명" },
       ],
     }}
   />

   📌 학습 추천 순서:
   1. 선택적 필드 (Optional Fields)
   2. React.ReactNode 타입
   3. 배열 메서드 (map, push, spread operator)
   4. 조건부 렌더링 패턴
*/
