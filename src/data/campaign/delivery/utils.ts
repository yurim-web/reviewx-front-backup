/**
 * 배송형 캠페인 유틸리티 함수
 * 
 * 설명:
 * - 배송형 캠페인 관련 헬퍼 함수들을 모아놓은 파일입니다.
 * - 캠페인 상태 계산, 날짜 계산 등의 공통 로직을 제공합니다.
 */

/**
 * 선정 날짜까지 남은 일수 계산
 * 
 * 설명:
 * - 오늘 날짜와 선정 날짜를 비교하여 남은 일수를 계산합니다.
 * - 양수면 남은 일수, 음수면 지난 일수를 반환합니다.
 * 
 * @param dateString - 선정 날짜 (예: "2025-11-30")
 * @returns 남은 일수 (양수면 남은 일수, 음수면 지난 일수)
 */
export function calculateDaysLeft(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 캠페인 상태 결정 (날짜 기반)
 * 
 * 설명:
 * - 예정 탭: 캠페인 오픈 예정 (모집 시작일이 미래) → "대기 중"
 * - 신청 탭: 캠페인 오픈 후, 선정 전 (모집 시작일이 과거, 선정 날짜가 미래) → "모집 중"
 * - 진행 탭: 모집 시작일이 오늘이거나 선정 날짜가 지났지만 등록 기간이 아직 안 끝남 → "진행 중"
 * - 종료: 등록 기간이 끝났을 때 → "종료"
 * 
 * @param recruitmentPeriod - 모집 기간 (예: "2025-11-01 ~ 2025-11-15")
 * @param announcementDate - 선정 날짜 (예: "2025-11-30")
 * @param registrationPeriod - 등록 기간 (예: "2025-11-23 ~ 2025-11-30")
 * @returns "대기 중" | "모집 중" | "진행 중" | "종료"
 */
export function calculateCampaignStatus(
  recruitmentPeriod?: string,
  announcementDate?: string,
  registrationPeriod?: string,
): '대기 중' | '모집 중' | '진행 중' | '종료' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 등록 기간 체크 (가장 우선순위)
  if (registrationPeriod) {
    // "2025-11-23 ~ 2025-11-30" 또는 "2025-11-23~2025-11-30" 형식에서 시작일과 종료일 추출
    const separator = registrationPeriod.includes(' ~ ') ? ' ~ ' : '~';
    const parts = registrationPeriod.split(separator);
    const startDateStr = parts[0]?.trim();
    const endDateStr = parts[1]?.trim();

    if (startDateStr && endDateStr) {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      // 유효한 날짜인지 확인
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        // 등록 기간이 시작하지 않았으면 무조건 "대기 중" 반환 (예정 탭)
        if (startDate > today) {
          return '대기 중';
        }

        // 등록 기간이 시작되었고 종료일이 지났으면 "종료"
        if (startDate <= today && endDate < today) {
          return '종료';
        }
      }
    }
  }

  let campaignStatus: '대기 중' | '모집 중' | '진행 중' = '대기 중';

  // 모집 기간 체크
  if (recruitmentPeriod) {
    // "2025-11-01 ~ 2025-11-15" 또는 "2025-11-01~2025-11-15" 형식에서 시작일 추출
    const separator = recruitmentPeriod.includes(' ~ ') ? ' ~ ' : '~';
    const startDateStr = recruitmentPeriod.split(separator)[0]?.trim();

    if (startDateStr) {
      const startDate = new Date(startDateStr);

      // 유효한 날짜인지 확인
      if (isNaN(startDate.getTime())) {
        console.error(`유효하지 않은 모집 시작일: ${startDateStr}`);
        return campaignStatus;
      }

      startDate.setHours(0, 0, 0, 0);

      // 모집 시작일이 오늘이면 "진행 중"
      if (startDate.getTime() === today.getTime()) {
        return '진행 중';
      }

      // 모집 시작일이 과거면 "모집 중", 미래면 "대기 중"
      if (startDate < today) {
        campaignStatus = '모집 중';
      } else {
        campaignStatus = '대기 중';
      }
    }
  }

  // 선정 날짜 체크 (진행 중 우선순위)
  if (announcementDate) {
    const announcementDateStr = announcementDate.split(' ')[0]?.trim();
    if (announcementDateStr) {
      const announcementDateObj = new Date(announcementDateStr);

      // 유효한 날짜인지 확인
      if (isNaN(announcementDateObj.getTime())) {
        console.error(`유효하지 않은 선정 날짜: ${announcementDateStr}`);
        return campaignStatus;
      }

      announcementDateObj.setHours(0, 0, 0, 0);

      // 선정 날짜가 오늘이거나 지났으면 "진행 중"
      if (announcementDateObj <= today) {
        return '진행 중';
      }
    }
  }

  return campaignStatus;
}

