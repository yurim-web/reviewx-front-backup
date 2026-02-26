/* ========================================
   배송형 캠페인 유틸리티 함수
   ======================================== */

/**
 * deliveryUtils
 *
 * 목적: 배송형 캠페인 날짜·상태 계산 헬퍼 함수 모음
 *
 * 사용 페이지:
 * - /campaign/delivery (배송형 캠페인 목록·상세)
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
  registrationPeriod?: string
): "대기 중" | "모집 중" | "진행 중" | "종료" {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 등록 기간 종료 확인 (종료 상태는 최우선)
  if (registrationPeriod) {
    const separator = registrationPeriod.includes(" ~ ") ? " ~ " : "~";
    const parts = registrationPeriod.split(separator);
    const endDateStr = parts[1]?.trim();

    if (endDateStr) {
      const endDate = new Date(endDateStr);
      if (!isNaN(endDate.getTime())) {
        endDate.setHours(0, 0, 0, 0);
        // 등록 기간이 종료되었으면 "종료"
        if (endDate < today) {
          return "종료";
        }
      }
    }
  }

  let campaignStatus: "대기 중" | "모집 중" | "진행 중" = "대기 중";

  // 모집 기간 체크
  if (recruitmentPeriod) {
    // "2025-11-01 ~ 2025-11-15" 또는 "2025-11-01~2025-11-15" 형식에서 시작일과 종료일 추출
    const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
    const parts = recruitmentPeriod.split(separator);
    const startDateStr = parts[0]?.trim();
    const endDateStr = parts[1]?.trim();

    if (startDateStr) {
      const startDate = new Date(startDateStr);

      // 유효한 날짜인지 확인
      if (isNaN(startDate.getTime())) {
        return campaignStatus;
      }

      startDate.setHours(0, 0, 0, 0);

      // 모집 시작일이 미래면 "대기 중"
      if (startDate > today) {
        campaignStatus = "대기 중";
      } else {
        // 모집 시작일이 과거 또는 오늘이면 모집 종료일 확인
        if (endDateStr) {
          const endDate = new Date(endDateStr);

          // 유효한 날짜인지 확인
          if (!isNaN(endDate.getTime())) {
            endDate.setHours(0, 0, 0, 0);

            // 모집 기간 내에 있는지 확인 (시작일 <= 오늘 <= 종료일)
            if (startDate <= today && today <= endDate) {
              // 선정 날짜가 미래인지 확인 (선정 전이어야 "모집 중")
              if (announcementDate) {
                const announcementDateStr = announcementDate.split(" ")[0]?.trim();
                if (announcementDateStr) {
                  const announcementDateObj = new Date(announcementDateStr);

                  if (!isNaN(announcementDateObj.getTime())) {
                    announcementDateObj.setHours(0, 0, 0, 0);

                    // 선정 날짜가 미래면 "모집 중", 지났으면 "진행 중"
                    if (announcementDateObj > today) {
                      campaignStatus = "모집 중";
                    } else {
                      campaignStatus = "진행 중";
                    }
                  } else {
                    // 선정 날짜가 없거나 유효하지 않으면 모집 기간 내이면 "모집 중"
                    campaignStatus = "모집 중";
                  }
                } else {
                  // 선정 날짜가 없으면 모집 기간 내이면 "모집 중"
                  campaignStatus = "모집 중";
                }
              } else {
                // 선정 날짜가 없으면 모집 기간 내이면 "모집 중"
                campaignStatus = "모집 중";
              }
            } else if (today > endDate) {
              // 모집 기간이 지났으면 선정 날짜 확인
              if (announcementDate) {
                const announcementDateStr = announcementDate.split(" ")[0]?.trim();
                if (announcementDateStr) {
                  const announcementDateObj = new Date(announcementDateStr);

                  if (!isNaN(announcementDateObj.getTime())) {
                    announcementDateObj.setHours(0, 0, 0, 0);

                    // 선정 날짜가 미래면 "진행 중" (선정 대기), 지났으면 "진행 중"
                    campaignStatus = "진행 중";
                  }
                }
              }
            }
          } else {
            // 모집 종료일이 없거나 유효하지 않으면 기존 로직 사용
            if (startDate < today) {
              campaignStatus = "모집 중";
            } else {
              campaignStatus = "대기 중";
            }
          }
        } else {
          // 모집 종료일이 없으면 기존 로직 사용
          if (startDate < today) {
            campaignStatus = "모집 중";
          } else {
            campaignStatus = "대기 중";
          }
        }
      }
    }
  }

  // 선정 날짜 체크 (진행 중 우선순위 - 모집 기간 체크에서 이미 처리했지만, 모집 기간 정보가 없을 때를 대비)
  if (announcementDate && campaignStatus !== "모집 중") {
    const announcementDateStr = announcementDate.split(" ")[0]?.trim();
    if (announcementDateStr) {
      const announcementDateObj = new Date(announcementDateStr);

      // 유효한 날짜인지 확인
      if (isNaN(announcementDateObj.getTime())) {
        return campaignStatus;
      }

      announcementDateObj.setHours(0, 0, 0, 0);

      // 선정 날짜가 오늘이거나 지났으면 "진행 중"
      if (announcementDateObj <= today) {
        return "진행 중";
      }
    }
  }

  return campaignStatus;
}
