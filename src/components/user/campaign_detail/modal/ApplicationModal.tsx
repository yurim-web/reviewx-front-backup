/* ========================================
   📋 캠페인 신청 모달 (통합 컴포넌트)
   ======================================== */

/**
 * 캠페인 신청 모달 컴포넌트
 *
 * 목적: 모든 캠페인 타입(배송형, 구매평, 미션형, 기자단, 방문형)에서 사용하는 통합 모달입니다.
 *
 * 주요 기능:
 * - 신청자 정보 표시 (이름, 주소, 채널 - 타입에 따라 다름)
 * - 메모 입력 (200자 제한)
 * - 동의 체크박스
 * - 긴급 캠페인 추가 동의 체크박스
 * - 캠페인 신청 처리
 *
 * 타입별 차이점:
 * - delivery: 이름 + 주소 + 채널 정보, 버튼 활성화: 동의만
 * - review: 이름 + 주소, 버튼 활성화: 이름 + 주소 + 동의
 * - mission/reporter: 이름 + 주소, 버튼 활성화: 이름 + 주소 + 동의
 * - visit: 이름 + 채널 정보, 버튼 활성화: 이름 + 동의
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getChannelLogo } from "@/utils/channelLogoMap";
import styles from "@/styles/user/campaign/application_modal.module.css";

export type ApplicationModalType =
  | "delivery"
  | "review"
  | "mission"
  | "reporter"
  | "visit";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ApplicationModalType; // 모달 타입 (delivery, review, mission, reporter, visit)
  dayCount?: string; // 남은 일수 또는 긴급 상태 (예: "D-5", "긴급", "마감임박")
  channelName?: string; // 캠페인에서 요구하는 채널 이름 (예: "인스타그램", "네이버 블로그")
  channelUrl?: string; // 사용자가 연결한 채널 URL (없을 수 있음)
}

export default function ApplicationModal({
  isOpen,
  onClose,
  type,
  dayCount,
  channelName: campaignChannelName,
  channelUrl: userChannelUrl,
}: ApplicationModalProps) {
  const router = useRouter();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isUrgentAgreed, setIsUrgentAgreed] = useState(false);
  const [memo, setMemo] = useState("");
  const [userName, setUserName] = useState("홍길동");
  const [userAddress, setUserAddress] = useState(
    "인천 남동구 장자로 6번길 2, 1층"
  );

  // 채널 정보: 캠페인에서 요구하는 채널 이름을 사용 (없으면 기본값)
  const channelName = campaignChannelName || "네이버 블로그";
  // 사용자가 연결한 채널 URL (없을 수 있음)
  const channelUrl = userChannelUrl;

  // dayCount가 "긴급"을 포함하는지 확인
  const isUrgent = dayCount?.includes("긴급") || false;

  // 타입별 표시 여부 결정
  const showAddress =
    type === "delivery" ||
    type === "review" ||
    type === "mission" ||
    type === "reporter";
  const showChannel = type === "delivery" || type === "visit";

  if (!isOpen) return null;

  // 연필 버튼 클릭 시 사용자 정보 수정 페이지로 이동
  // 모달 상태를 sessionStorage에 저장하여 뒤로가기 시 모달이 열린 상태로 복원
  const handleEditUserInfo = () => {
    // sessionStorage에 모달 상태 저장
    sessionStorage.setItem("shouldOpenApplicationModal", "true");
    router.push("/user/mypage/edit");
  };

  // 채널 연필 버튼 클릭 시 채널 설정 페이지로 이동
  // 모달 상태를 sessionStorage에 저장하여 뒤로가기 시 모달이 열린 상태로 복원
  // SubHeader 표시 플래그도 함께 저장
  const handleEditChannel = () => {
    // sessionStorage에 모달 상태 저장
    sessionStorage.setItem("shouldOpenApplicationModal", "true");
    // SubHeader 표시 플래그 저장
    sessionStorage.setItem("showSubHeader", "true");
    router.push("/user/mypage/channel");
  };

  const handleSubmit = () => {
    // 신청 처리 로직
    console.log("캠페인 신청:", {
      type,
      memo,
      isAgreed,
      isUrgentAgreed: isUrgent ? isUrgentAgreed : undefined,
    });
    onClose();
  };

  // 타입별 버튼 활성화 조건
  const getSubmitDisabled = () => {
    // delivery: 채널 연결 + 동의 체크
    if (type === "delivery") {
      // 채널이 연결되지 않았으면 비활성화
      if (!channelUrl) {
        return true;
      }
      return isUrgent ? !isAgreed || !isUrgentAgreed : !isAgreed;
    }

    // review, mission, reporter: 이름 + 주소 + 동의
    if (type === "review" || type === "mission" || type === "reporter") {
      return (
        userName.trim() === "" ||
        userAddress.trim() === "" ||
        !isAgreed ||
        (isUrgent && !isUrgentAgreed)
      );
    }

    // visit: 채널 연결 + 이름 + 동의
    if (type === "visit") {
      // 채널이 연결되지 않았으면 비활성화
      if (!channelUrl) {
        return true;
      }
      return (
        userName.trim() === "" || !isAgreed || (isUrgent && !isUrgentAgreed)
      );
    }

    return true;
  };

  const isSubmitDisabled = getSubmitDisabled();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div className={styles.modal_container}>
        {/* 모달 헤더 */}
        <div className={styles.modal_header}>
          <h2 className={styles.modal_title}>캠페인 신청</h2>
          <button className={styles.close_button} onClick={onClose}>
            <img src="/images/filter/x_icon.svg" alt="닫기" />
          </button>
        </div>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className={styles.modal_content}>
          {/* 신청자 정보 및 채널 정보 섹션 */}
          <div className={styles.application_info_container}>
            {/* 신청자 정보 섹션 */}
            <div className={styles.section}>
              <h3 className={styles.section_title}>신청자 정보</h3>
              {/* 신청자 정보 컨테이너 */}
              <div className={styles.user_info_wrapper}>
                {/* 이름 입력칸 - 읽기 전용 (자동으로 불러오는 값) */}
                <div className={styles.user_info_row}>
                  <input
                    type="text"
                    value={userName}
                    readOnly
                    className={styles.user_input}
                    placeholder="이름을 입력하세요"
                  />
                </div>
                {/* 주소 정보 - 타입에 따라 표시 여부 결정 */}
                {showAddress && (
                  <div className={styles.address_container}>
                    <div className={styles.address_info}>
                      <div className={styles.address_text}>{userAddress}</div>
                    </div>
                    {/* 수정 버튼 - 클릭 시 사용자 정보 수정 페이지로 이동 */}
                    <button
                      className={styles.edit_button}
                      onClick={handleEditUserInfo}
                      type="button"
                    >
                      <img
                        src="/images/campaign_detail/pencil_icon.svg"
                        alt="수정"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 채널 정보 섹션 - 타입에 따라 표시 여부 결정 */}
            {showChannel && (
              <div className={styles.section}>
                <div className={styles.channel_container}>
                  {/* 채널 아이콘 - 채널 이름에 따라 동적으로 표시 */}
                  <div className={styles.channel_icon}>
                    <img
                      src={getChannelLogo(channelName)}
                      alt={channelName}
                      className={styles.channel_icon_image}
                    />
                  </div>
                  <div className={styles.channel_info}>
                    <div className={styles.channel_name}>{channelName}</div>
                    {channelUrl ? (
                      <div className={styles.channel_url}>{channelUrl}</div>
                    ) : (
                      <div className={styles.channel_url_empty}>
                        계정을 연결해 주세요.
                      </div>
                    )}
                  </div>
                  {/* 수정 버튼 - 클릭 시 채널 설정 페이지로 이동 */}
                  <button
                    className={styles.edit_button}
                    onClick={handleEditChannel}
                    type="button"
                  >
                    <img
                      src="/images/campaign_detail/pencil_icon.svg"
                      alt="수정"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 메모 섹션 */}
          <div className={styles.section}>
            <h3 className={styles.section_title}>메모</h3>
            <div className={styles.memo_container}>
              <input
                type="text"
                placeholder="신청 사유 혹은 캠페인에 대한 옵션 작성"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className={styles.memo_input}
                maxLength={200}
              />
            </div>
          </div>

          {/* 동의 섹션 */}
          <div className={styles.section}>
            <h3 className={styles.section_title}>동의</h3>
            <div className={styles.agreement_container}>
              {/* 첫 번째 동의 체크박스 */}
              <label className={styles.checkbox_label}>
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.agreement_text}>
                  본 캠페인과 관련된 유의사항, 개인정보 및 콘텐츠의 제3자 제공,
                  저작물 사용, 초상권 활용에 대해 동의합니다.
                </span>
              </label>

              {/* 긴급 캠페인 추가 동의 체크박스 - 긴급 캠페인일 때만 표시 */}
              {isUrgent && (
                <label className={styles.checkbox_label}>
                  <input
                    type="checkbox"
                    checked={isUrgentAgreed}
                    onChange={(e) => setIsUrgentAgreed(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.agreement_text}>
                    긴급 캠페인과 관련된 유의사항에 대해 확인했습니다.
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className={styles.button_container}>
          <button
            className={styles.connect_button}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            신청
          </button>
        </div>
      </div>
    </div>
  );
}
