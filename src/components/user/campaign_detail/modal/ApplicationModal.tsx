/* ========================================
   캠페인 신청 모달 (통합 컴포넌트)
   ======================================== */

/**
 * ApplicationModal
 *
 * 목적: 모든 캠페인 타입(배송형, 구매평, 미션형, 기자단, 방문형)에서 공통으로 사용하는 통합 신청 모달
 *
 * 사용 페이지:
 * - /user/campaign/[type]/[id] (캠페인 상세 - 신청 버튼 클릭 시)
 */

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useModalState } from "@/hooks/useModalState";
import { getChannelLogo } from "@/utils/channelLogoMap";
import BaseModal from "@/components/common/modal/BaseModal";
import { useApplicationForm } from "@/hooks/user/campaign/useApplicationForm";
import { useApplicationModalUser } from "@/hooks/user/campaign/useApplicationModalUser";
import { useApplicationSubmit } from "@/hooks/user/campaign/useApplicationSubmit";
import { useAuth } from "@/hooks/useAuth";
import { type ApplicationModalType } from "@/components/user/campaign_detail/modal/applicationModalUtils";
import styles from "@/styles/user/campaign/application_modal.module.css";

export type { ApplicationModalType };

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ApplicationModalType;
  campaignId?: string;
  dayCount?: string;
  isUrgent?: boolean;
  channelName?: string;
  channelUrl?: string;
  isParticipated?: boolean;
  isSuspended?: boolean;
  isClosed?: boolean;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  type,
  campaignId,
  dayCount,
  isUrgent: isUrgentProp = false,
  channelName: campaignChannelName,
  channelUrl: userChannelUrl,
  isParticipated = false,
  isSuspended = false,
  isClosed = false,
}: ApplicationModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  // 채널 이름 (props 또는 기본값)
  const channelName = campaignChannelName || "네이버 블로그";

  // 타입별 표시 여부
  const showAddress = type === "delivery" || type === "review" || type === "mission";
  const showChannel = type === "delivery" || type === "visit" || type === "reporter";

  // 긴급 캠페인 여부
  const isUrgent = isUrgentProp || dayCount?.includes("긴급") || false;

  // 모달 상태
  const successModal = useModalState();
  const participatedModal = useModalState();
  const closedModal = useModalState();
  const suspendedModal = useModalState();
  const invalidRequestModal = useModalState();
  const duplicateModal = useModalState();
  const serverErrorModal = useModalState();

  // 폼 상태 훅
  const {
    isAgreed,
    setIsAgreed,
    isUrgentAgreed,
    setIsUrgentAgreed,
    memo,
    setMemo,
    saveFormData,
    clearFormData,
  } = useApplicationForm(isOpen);

  // 유저/주소/채널 정보 훅 (R-24 API 우선, R-28 fallback)
  const {
    userName,
    userAddress,
    currentChannelUrl,
    canApply,
    eligibilityReasons,
    requiredChannelId,
    isChannelConnected,
    postNumber,
    addressRaw,
    addressDetailRaw,
  } = useApplicationModalUser({
    isOpen,
    user,
    campaignId,
    type,
    campaignChannelName,
    userChannelUrl,
    showChannel,
  });

  // sessionStorage에서 복원 (useApplicationModalUser가 user 로드 후 메모·동의 복원)
  // shouldRestoreFormData 플래그는 useApplicationModalUser에서 소비하므로 여기서는 별도 처리 없음
  // 단, 폼 복원은 모달 오픈 시 한 번 실행
  // (useEffect 의존성 동일하게 유지하기 위해 useApplicationForm의 restoreFormData 활용)
  // → 실제 복원 로직은 useApplicationModalUser 내에서 sessionStorage 플래그로 제어

  // 채널 URL (currentChannelUrl 우선, props 폴백)
  const channelUrl = currentChannelUrl || userChannelUrl || "";

  // 신청 제출 훅 (R-25 API 우선, localStorage fallback)
  const { handleSubmit } = useApplicationSubmit({
    campaignId,
    type,
    isParticipated,
    isSuspended,
    isClosed,
    memo,
    currentChannelUrl,
    userName,
    userAddress,
    campaignChannelName,
    showChannel,
    channelName,
    clearFormData,
    // R-24 데이터 전달
    canApply,
    eligibilityReasons,
    requiredChannelId,
    isChannelConnected,
    postNumber,
    addressRaw,
    addressDetailRaw,
    onSuccess: successModal.open,
    onDuplicate: duplicateModal.open,
    onParticipated: participatedModal.open,
    onSuspended: suspendedModal.open,
    onClosed: closedModal.open,
    onError: serverErrorModal.open,
  });

  if (!isOpen) return null;

  // 주소 수정 → 주소 등록 페이지로 이동
  const handleEditUserInfo = () => {
    saveFormData(memo, isAgreed, isUrgentAgreed);
    sessionStorage.setItem("shouldRestoreFormData", "true");
    sessionStorage.setItem("shouldOpenApplicationModal", "true");
    router.push("/user/mypage/address");
  };

  // 채널 수정 → 채널 연결 페이지로 이동
  const handleEditChannel = () => {
    saveFormData(memo, isAgreed, isUrgentAgreed);
    sessionStorage.setItem("shouldRestoreFormData", "true");
    sessionStorage.setItem("shouldOpenApplicationModal", "true");
    sessionStorage.setItem("showSubHeader", "true");
    router.push("/user/mypage/channel/connect");
  };

  // 신청 완료 모달 닫기
  const handleSuccessModalClose = () => {
    successModal.close();
    clearFormData();
    sessionStorage.removeItem("shouldRestoreFormData");
    onClose();
  };

  // X 버튼 / 오버레이 닫기
  const handleClose = () => {
    const shouldRestore = sessionStorage.getItem("shouldRestoreFormData");
    if (shouldRestore !== "true") clearFormData();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // 제출 버튼 비활성화 조건
  const isSubmitDisabled = (() => {
    if (isSuspended) return true;
    if (type === "delivery") {
      if (!channelUrl) return true;
      return isUrgent ? !isAgreed || !isUrgentAgreed : !isAgreed;
    }
    if (type === "review" || type === "mission") {
      return (
        userName.trim() === "" ||
        userAddress.trim() === "" ||
        !isAgreed ||
        (isUrgent && !isUrgentAgreed)
      );
    }
    if (type === "visit" || type === "reporter") {
      if (!channelUrl) return true;
      return userName.trim() === "" || !isAgreed || (isUrgent && !isUrgentAgreed);
    }
    return true;
  })();

  return (
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div className={styles.modal_container}>
        {/* 모달 헤더 */}
        <div className={styles.modal_header}>
          <button className={styles.back_button} onClick={handleClose} aria-label="뒤로가기">
            <Image
              src="/images/header/header_arrow_back.svg"
              alt="뒤로가기"
              width={16}
              height={16}
            />
          </button>
          <h2 className={styles.modal_title}>캠페인 신청</h2>
          <button className={styles.close_button} onClick={handleClose}>
            <Image src="/images/filter/x_icon.svg" alt="닫기" width={30} height={30} />
          </button>
        </div>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className={styles.modal_content}>
          {/* 신청자 정보 및 채널 정보 섹션 */}
          <div className={styles.application_info_container}>
            {/* 신청자 정보 섹션 */}
            <div className={styles.section}>
              <h3 className={styles.section_title}>신청자 정보</h3>
              <div className={styles.user_info_wrapper}>
                {/* 이름 */}
                <div className={styles.field_group}>
                  <div className={styles.user_info_row}>
                    <label className={styles.field_label}>이름</label>
                    <input
                      type="text"
                      value={userName}
                      readOnly
                      className={styles.user_input}
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                </div>

                {/* 주소 (타입에 따라) */}
                {showAddress && (
                  <div className={styles.field_group}>
                    <div className={styles.field_label}>
                      <span>주소</span>
                      <button
                        className={styles.edit_label}
                        onClick={handleEditUserInfo}
                        type="button"
                      >
                        수정
                      </button>
                    </div>
                    <div className={styles.address_container}>
                      <div className={styles.address_info}>
                        {userAddress.trim() ? (
                          <div className={styles.address_text}>
                            {userAddress.includes(" | ") ? (
                              <>
                                <span>{userAddress.split(" | ")[0]}</span>
                                <span className={styles.address_separator}>|</span>
                                <span className={styles.address_postal_code}>
                                  {userAddress.split(" | ").slice(1).join(" | ")}
                                </span>
                              </>
                            ) : (
                              userAddress
                            )}
                          </div>
                        ) : (
                          <div className={styles.address_text_empty}>주소지를 등록해 주세요.</div>
                        )}
                      </div>
                      <button
                        className={styles.edit_button}
                        onClick={handleEditUserInfo}
                        type="button"
                        aria-label="주소 수정"
                      >
                        <Image
                          src="/images/icons/pencil_icon.svg"
                          alt="수정"
                          width={24}
                          height={24}
                          className={styles.edit_icon}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 채널 정보 섹션 (타입에 따라) */}
            {showChannel && (
              <div className={styles.section}>
                <div className={styles.field_group}>
                  <div className={styles.field_label}>
                    <span>채널</span>
                    <button className={styles.edit_label} onClick={handleEditChannel} type="button">
                      수정
                    </button>
                  </div>
                  <div className={styles.channel_container}>
                    <div className={styles.channel_icon}>
                      <Image
                        src={getChannelLogo(channelName)}
                        alt={channelName}
                        width={28}
                        height={28}
                        className={styles.channel_icon_image}
                      />
                    </div>
                    <div className={styles.channel_info}>
                      <div className={styles.channel_name}>{channelName}</div>
                      {channelUrl ? (
                        <div className={styles.channel_url}>{channelUrl}</div>
                      ) : (
                        <div className={styles.channel_url_empty}>계정을 연결해 주세요.</div>
                      )}
                    </div>
                    <button
                      className={styles.edit_button}
                      onClick={handleEditChannel}
                      type="button"
                      aria-label="채널 수정"
                    >
                      <Image
                        src="/images/icons/pencil_icon.svg"
                        alt="수정"
                        width={24}
                        height={24}
                        className={styles.edit_icon}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 메모 섹션 */}
          <div className={styles.section}>
            <div className={styles.field_group}>
              <h3 className={styles.section_title}>메모</h3>
              <label className={`${styles.field_label} ${styles.field_label_light}`}>메모</label>
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
          </div>

          {/* 동의 섹션 */}
          <div className={styles.section}>
            <div className={styles.field_group}>
              <h3 className={styles.section_title}>동의</h3>
              <label className={`${styles.field_label} ${styles.field_label_light}`}>동의</label>
              <div className={styles.agreement_container}>
                <label className={styles.checkbox_label}>
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.agreement_text}>
                    본 캠페인과 관련된 유의사항, 개인정보 및 콘텐츠의 제3자 제공, 저작물 사용,
                    초상권 활용에 대해 동의합니다.
                  </span>
                </label>

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
        </div>

        {/* 하단 버튼 */}
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
        is_open={successModal.isOpen}
        on_close={handleSuccessModalClose}
        message="캠페인 신청이 완료되었습니다."
        buttons={["닫기", "다른 체험단 보러 가기"]}
        button_layout="column"
        confirm_first
        on_confirm={() => router.push("/user")}
      />

      {/* 이미 참여한 캠페인 모달 */}
      <BaseModal
        is_open={participatedModal.isOpen}
        on_close={participatedModal.close}
        message="이미 참여한 캠페인입니다."
        buttons={["닫기"]}
      />

      {/* 등록 마감 모달 */}
      <BaseModal
        is_open={closedModal.isOpen}
        on_close={closedModal.close}
        message="등록 기간이 마감되었습니다."
        buttons={["닫기"]}
      />

      {/* 정지 회원 모달 */}
      <BaseModal
        is_open={suspendedModal.isOpen}
        on_close={suspendedModal.close}
        message="정지 회원은 캠페인 신청이 불가합니다."
        buttons={["닫기"]}
      />

      {/* 유효하지 않은 요청 모달 */}
      <BaseModal
        is_open={invalidRequestModal.isOpen}
        on_close={invalidRequestModal.close}
        message="유효하지 않은 요청입니다."
        buttons={["확인"]}
      />

      {/* 중복 신청 모달 */}
      <BaseModal
        is_open={duplicateModal.isOpen}
        on_close={() => {
          duplicateModal.close();
          onClose();
        }}
        message="이미 참여한 캠페인입니다."
        buttons={["닫기"]}
      />

      {/* E_M5: 서버 오류 모달 */}
      <BaseModal
        is_open={serverErrorModal.isOpen}
        on_close={serverErrorModal.close}
        message={"오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."}
        buttons={["닫기", "재시도"]}
        on_cancel={serverErrorModal.close}
        on_confirm={() => {
          serverErrorModal.close();
          router.refresh();
        }}
        type="center"
      />
    </div>
  );
}
