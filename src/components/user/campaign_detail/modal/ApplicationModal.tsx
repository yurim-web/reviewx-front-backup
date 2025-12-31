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

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getChannelLogo } from "@/utils/channelLogoMap";
import BaseModal from "@/components/common/modal/BaseModal";
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
  isParticipated?: boolean; // 이미 참여한 캠페인인지 여부 (기본값: false)
  isSuspended?: boolean; // 일시 정지된 회원인지 여부 (기본값: false)
  isClosed?: boolean; // 등록 기간이 마감되었는지 여부 (기본값: false)
}

export default function ApplicationModal({
  isOpen,
  onClose,
  type,
  dayCount,
  channelName: campaignChannelName,
  channelUrl: userChannelUrl,
  isParticipated = false,
  isSuspended = false,
  isClosed = false,
}: ApplicationModalProps) {
  const router = useRouter();

  // sessionStorage에서 이전 입력값 복원
  const getStoredFormData = () => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("applicationModalFormData");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  };

  // sessionStorage에 입력값 저장
  const saveFormData = (
    memo: string,
    isAgreed: boolean,
    isUrgentAgreed: boolean
  ) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(
      "applicationModalFormData",
      JSON.stringify({ memo, isAgreed, isUrgentAgreed })
    );
  };

  // sessionStorage에서 입력값 삭제
  const clearFormData = () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("applicationModalFormData");
  };

  // 기본값으로 초기화 (수정 버튼을 통해 돌아온 경우에만 복원)
  const [isAgreed, setIsAgreed] = useState(false);
  const [isUrgentAgreed, setIsUrgentAgreed] = useState(false);
  const [memo, setMemo] = useState("");
  const [userName, setUserName] = useState("홍길동");
  // 주소 정보 (등록되어 있지 않으면 빈 문자열)
  const [userAddress, setUserAddress] = useState("");

  // 신청 완료 모달 상태
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // 에러 모달 상태들
  const [isParticipatedModalOpen, setIsParticipatedModalOpen] = useState(false);
  const [isClosedModalOpen, setIsClosedModalOpen] = useState(false);
  const [isSuspendedModalOpen, setIsSuspendedModalOpen] = useState(false);
  const [isInvalidRequestModalOpen, setIsInvalidRequestModalOpen] =
    useState(false);

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

  // 모달이 열릴 때 수정 버튼을 통해 돌아온 경우에만 입력값 복원
  useEffect(() => {
    if (isOpen) {
      // 수정 버튼을 통해 돌아온 경우인지 확인
      const shouldRestore = sessionStorage.getItem("shouldRestoreFormData");

      if (shouldRestore === "true") {
        // 저장된 데이터 복원
        const stored = getStoredFormData();
        if (stored) {
          setMemo(stored.memo || "");
          setIsAgreed(stored.isAgreed || false);
          setIsUrgentAgreed(stored.isUrgentAgreed || false);
        }
        // 복원 플래그 제거
        sessionStorage.removeItem("shouldRestoreFormData");
      } else {
        // 다른 경로로 모달을 열었을 때는 저장된 데이터 삭제
        clearFormData();
        // 입력값 초기화
        setMemo("");
        setIsAgreed(false);
        setIsUrgentAgreed(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 주소 수정 버튼 클릭 시 주소 등록 페이지로 이동
  // 모달 상태를 sessionStorage에 저장하여 뒤로가기 시 모달이 열린 상태로 복원
  // 현재 입력값도 함께 저장하여 뒤로가기 시 복원
  const handleEditUserInfo = () => {
    // 현재 입력값을 sessionStorage에 저장
    saveFormData(memo, isAgreed, isUrgentAgreed);
    // 수정 버튼을 통해 이동했음을 표시하는 플래그 설정
    sessionStorage.setItem("shouldRestoreFormData", "true");
    // sessionStorage에 모달 상태 저장
    sessionStorage.setItem("shouldOpenApplicationModal", "true");
    // 주소만 등록하는 페이지로 이동
    router.push("/user/mypage/address");
  };

  // 채널 연필 버튼 클릭 시 채널 연결 페이지로 이동
  // 모달 상태를 sessionStorage에 저장하여 뒤로가기 시 모달이 열린 상태로 복원
  // SubHeader 표시 플래그도 함께 저장
  // 현재 입력값도 함께 저장하여 뒤로가기 시 복원
  const handleEditChannel = () => {
    // 현재 입력값을 sessionStorage에 저장
    saveFormData(memo, isAgreed, isUrgentAgreed);
    // 수정 버튼을 통해 이동했음을 표시하는 플래그 설정
    sessionStorage.setItem("shouldRestoreFormData", "true");
    // sessionStorage에 모달 상태 저장
    sessionStorage.setItem("shouldOpenApplicationModal", "true");
    // SubHeader 표시 플래그 저장
    sessionStorage.setItem("showSubHeader", "true");
    // 채널 연결 페이지로 이동
    router.push("/user/mypage/channel/connect");
  };

  const handleSubmit = () => {
    // 1. 이미 참여한 캠페인인지 확인
    if (isParticipated) {
      setIsParticipatedModalOpen(true);
      return;
    }

    // 2. 일시 정지된 회원인지 확인
    if (isSuspended) {
      setIsSuspendedModalOpen(true);
      return;
    }

    // 3. 등록 기간이 마감되었는지 확인
    if (isClosed) {
      setIsClosedModalOpen(true);
      return;
    }

    // 신청 처리 로직
    console.log("캠페인 신청:", {
      type,
      memo,
      isAgreed,
      isUrgentAgreed: isUrgent ? isUrgentAgreed : undefined,
    });
    // 신청 완료 모달 열기
    setIsSuccessModalOpen(true);
  };

  // 신청 완료 모달 닫기 핸들러
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    // 신청 완료 후 저장된 입력값 및 플래그 삭제
    clearFormData();
    sessionStorage.removeItem("shouldRestoreFormData");
    // 기존 모달도 닫기
    onClose();
  };

  // 타입별 버튼 활성화 조건
  const getSubmitDisabled = () => {
    // 일시 정지된 회원은 항상 비활성화
    if (isSuspended) {
      return true;
    }

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
      // 모달을 닫을 때는 입력값을 유지 (뒤로가기 시 복원을 위해)
      onClose();
    }
  };

  // 모달이 닫힐 때 (X 버튼 클릭 등)
  // 수정 버튼을 통해 이동한 게 아닌 경우 저장된 데이터 삭제
  const handleClose = () => {
    // 수정 버튼을 통해 돌아온 게 아닌 경우에만 데이터 삭제
    const shouldRestore = sessionStorage.getItem("shouldRestoreFormData");
    if (shouldRestore !== "true") {
      clearFormData();
    }
    onClose();
  };

  return (
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div className={styles.modal_container}>
        {/* 모달 헤더 */}
        <div className={styles.modal_header}>
          <h2 className={styles.modal_title}>캠페인 신청</h2>
          <button className={styles.close_button} onClick={handleClose}>
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
                      {userAddress.trim() ? (
                        <div className={styles.address_text}>{userAddress}</div>
                      ) : (
                        <div className={styles.address_text_empty}>
                          주소지를 등록해 주세요.
                        </div>
                      )}
                    </div>
                    {/* 수정 버튼 - 클릭 시 주소 등록 페이지로 이동 */}
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

      {/* 신청 완료 모달 */}
      <BaseModal
        is_open={isSuccessModalOpen}
        on_close={handleSuccessModalClose}
        message="캠페인 신청이 완료되었습니다."
        buttons={["닫기"]}
      />

      {/* 이미 참여했는데 신청 버튼이 활성화 되어있는 상태에서 다시 신청 눌렀을 때 모달 */}
      <BaseModal
        is_open={isParticipatedModalOpen}
        on_close={() => setIsParticipatedModalOpen(false)}
        message="이미 참여한 캠페인입니다."
        buttons={["확인"]}
      />

      {/* 신청 버튼이 활성화 되어있는 상태에서 마감되었을 경우 모달 */}
      <BaseModal
        is_open={isClosedModalOpen}
        on_close={() => setIsClosedModalOpen(false)}
        message="등록 기간이 마감되었습니다."
        buttons={["닫기"]}
      />

      {/* 일시 정지된 회원이 캠페인 신청 시 모달 */}
      <BaseModal
        is_open={isSuspendedModalOpen}
        on_close={() => setIsSuspendedModalOpen(false)}
        message="정지 회원은 캠페인 신청이 불가합니다."
        buttons={["닫기"]}
      />

      {/* 일시 정지 상태에서 버튼이 활성화되어 있을 때 모달 */}
      <BaseModal
        is_open={isInvalidRequestModalOpen}
        on_close={() => setIsInvalidRequestModalOpen(false)}
        message="유효하지 않은 요청입니다."
        buttons={["확인"]}
      />
    </div>
  );
}
