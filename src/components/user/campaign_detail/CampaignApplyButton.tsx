/* ========================================
   🎯 캠페인 신청 버튼 컴포넌트
   ======================================== */

/**
 * 캠페인 신청 버튼 컴포넌트
 *
 * 목적: 캠페인 상세 페이지 하단의 신청 버튼과 긴급 안내를 담당하는 컴포넌트입니다.
 *
 * 주요 기능:
 * - 캠페인 상태에 따른 버튼 활성화/비활성화
 * - 상태별 버튼 텍스트 변경
 * - 긴급 캠페인 안내 메시지 표시
 *
 * 버튼 상태:
 * 1. 일반 상태: "캠페인 신청하기" (활성화)
 * 2. 마감: "캠페인 마감" (비활성화)
 * 3. 오픈 예정: "캠페인 오픈 예정" (비활성화)
 * 4. 이미 참여: "이미 참여한 캠페인" (비활성화)
 *
 * 사용 예시:
 * ```tsx
 * <CampaignApplyButton
 *   applicationStart="2025-01-20"
 *   applicationEnd="2025-02-10"
 *   dayCount="D-5"
 *   isParticipated={false}
 *   onApply={() => setIsModalOpen(true)}
 * />
 * ```
 */

"use client";

import styles from "@/styles/user/campaign/campaign_detail.module.css";

interface CampaignApplyButtonProps {
  // 신청 시작일 (YYYY-MM-DD 형식)
  applicationStart: string;
  // 신청 마감일 (YYYY-MM-DD 형식)
  applicationEnd: string;
  // 남은 일수 또는 긴급 상태 (예: "D-5", "긴급", "마감임박")
  dayCount?: string;
  // 이미 참여한 캠페인인지 여부 (기본값: false)
  isParticipated?: boolean;
  // 신청 버튼 클릭 시 호출되는 함수
  onApply: () => void;
}

/**
 * 캠페인 신청 버튼 컴포넌트
 *
 * @param applicationStart - 신청 시작일
 * @param applicationEnd - 신청 마감일
 * @param dayCount - 남은 일수 또는 긴급 상태
 * @param isParticipated - 이미 참여한 캠페인인지 여부
 * @param onApply - 신청 버튼 클릭 핸들러
 */
export default function CampaignApplyButton({
  applicationStart,
  applicationEnd,
  dayCount,
  isParticipated = false,
  onApply,
}: CampaignApplyButtonProps) {
  // 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
  // Date 객체를 사용하여 오늘 날짜를 문자열로 변환
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // 날짜 비교를 위해 문자열을 Date 객체로 변환
  // 시간 부분은 00:00:00으로 설정하여 날짜만 비교
  const startDate = new Date(applicationStart);
  const endDate = new Date(applicationEnd);
  const todayDate = new Date(todayString);

  // 버튼 상태 계산
  // 1. 이미 참여한 캠페인인지 확인
  const isAlreadyParticipated = isParticipated;

  // 2. 캠페인이 마감되었는지 확인 (applicationEnd가 오늘보다 이전)
  const isClosed = endDate < todayDate;

  // 3. 캠페인이 아직 오픈되지 않았는지 확인 (applicationStart가 오늘보다 이후)
  const isNotOpened = startDate > todayDate;

  // 버튼이 비활성화되어야 하는지 확인
  // 세 가지 조건 중 하나라도 true이면 비활성화
  const isDisabled = isAlreadyParticipated || isClosed || isNotOpened;

  // 버튼 텍스트 결정
  // 조건문의 우선순위: 이미 참여 > 마감 > 오픈 예정 > 일반
  let buttonText = "캠페인 신청하기";
  if (isAlreadyParticipated) {
    buttonText = "이미 참여한 캠페인";
  } else if (isClosed) {
    buttonText = "캠페인 마감";
  } else if (isNotOpened) {
    buttonText = "캠페인 오픈 예정";
  }

  // 긴급 캠페인인지 확인 (dayCount에 "긴급"이 포함되어 있는지)
  const isUrgent = dayCount?.includes("긴급") || false;

  return (
    <>
      {/* 하단 고정 영역: 그라데이션 + 신청 버튼 */}
      <div className={styles.bottom_gradient}></div>
      <div className={styles.bottom_fixed_container}>
        <div className={styles.button_wrapper}>
          {/* 
            신청 버튼
            - 비활성화 상태일 때는 클릭 불가능
            - disabled 속성으로 버튼 비활성화
            - 비활성화 시 스타일이 자동으로 적용됨
          */}
          <button
            className={styles.apply_button}
            onClick={onApply}
            disabled={isDisabled}
          >
            {buttonText}
          </button>
          {/* 
            긴급 캠페인 안내 멘트
            - dayCount가 "긴급"을 포함할 때만 표시
            - 조건부 렌더링: && 연산자를 사용하여 조건이 true일 때만 요소를 렌더링
          */}
          {isUrgent && (
            <div className={styles.urgent_notice}>
              {/* 
                SVG 이미지 아이콘 사용
                Next.js에서 public 폴더의 이미지는 /images/... 경로로 참조
              */}
              <img
                src="/images/campaign_detail/detail_info.svg"
                alt="정보 아이콘"
                className={styles.urgent_notice_icon}
              />
              <span className={styles.urgent_notice_text}>
                이 캠페인은 참여 및 진행 기간이 짧은 대신, 완료 시 보상이 당일
                지급되는 긴급 캠페인입니다.
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

