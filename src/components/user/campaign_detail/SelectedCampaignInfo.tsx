/* ========================================
   📋 선정 후 캠페인 상세 페이지 추가 안내 섹션
   ======================================== */

/**
 * 선정 후 캠페인 상세 페이지 추가 안내 섹션 컴포넌트
 *
 * 목적: 선정된 캠페인 상세 페이지에 공정위 안내와 문의 담당자 정보를 표시합니다.
 *
 * 주요 기능:
 * - 공정위 이미지 안내 섹션 (복사 버튼 포함)
 * - 캠페인 문의 담당자 연락처 섹션 (복사 버튼 포함)
 *
 */

"use client";

import { useState } from "react";
import styles from "@/styles/user/campaign/campaign_detail/detail_guidelines_section.module.css";
import selectedCampaignStyles from "@/styles/user/campaign/campaign_detail/selected_campaign_info.module.css";

interface SelectedCampaignInfoProps {
  /** 공정위 이미지 복사 버튼 클릭 핸들러 */
  onCopyFtcImage?: () => void;
  /** 문의 담당자 연락처 복사 버튼 클릭 핸들러 */
  onCopyContact?: () => void;
  /** 문의 담당자 연락처 (기본값: "010-1234-5678") */
  contactNumber?: string;
}

/**
 * 선정 후 캠페인 상세 페이지 추가 안내 섹션
 *
 * 설명:
 * - 공정위 이미지 안내: 리뷰 콘텐츠 작성 시 첫 부분에 공정위 문구 배너를 삽입하도록 안내합니다.
 * - 캠페인 문의: 문의 담당자 연락처를 제공합니다.
 *
 * @param props - SelectedCampaignInfoProps 타입의 속성들
 * @returns 선정 후 추가 안내 섹션을 담은 JSX 요소
 */
export default function SelectedCampaignInfo({
  onCopyFtcImage,
  onCopyContact,
  contactNumber = "010-1234-5678",
}: SelectedCampaignInfoProps) {
  // 토스트 메시지 상태 관리
  // useState: 컴포넌트의 상태를 관리하는 React 훅입니다.
  // [상태값, 상태변경함수] = useState(초기값) 형태로 사용합니다.
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  /**
   * 공정위 이미지 복사 핸들러
   *
   * 설명:
   * - 공정위 이미지 복사 버튼을 클릭하면 실행됩니다.
   * - 실제로는 공정위 이미지 URL이나 텍스트를 클립보드에 복사합니다.
   * - 현재는 예시로 빈 문자열을 복사합니다.
   */
  const handleCopyFtcImage = async () => {
    try {
      // TODO: 실제 공정위 이미지 URL이나 텍스트를 클립보드에 복사
      // 예시: await navigator.clipboard.writeText("공정위 이미지 URL 또는 텍스트");
      await navigator.clipboard.writeText("공정위 이미지");
      setToastMessage("복사되었습니다.");
      setShowToast(true);
      // 2초 후 토스트 메시지 자동 닫기
      setTimeout(() => setShowToast(false), 2000);

      // 부모 컴포넌트의 핸들러가 있으면 호출
      if (onCopyFtcImage) {
        onCopyFtcImage();
      }
    } catch (error) {
      console.error("공정위 이미지 복사 실패:", error);
    }
  };

  /**
   * 문의 담당자 연락처 복사 핸들러
   *
   * 설명:
   * - 문의 담당자 연락처 복사 버튼을 클릭하면 실행됩니다.
   * - 연락처 번호를 클립보드에 복사합니다.
   */
  const handleCopyContact = async () => {
    try {
      // navigator.clipboard.writeText: 클립보드에 텍스트를 복사하는 브라우저 API입니다.
      // async/await: 비동기 작업을 처리하는 JavaScript 문법입니다.
      await navigator.clipboard.writeText(contactNumber);
      setToastMessage("복사되었습니다.");
      setShowToast(true);
      // 2초 후 토스트 메시지 자동 닫기
      // setTimeout: 지정된 시간 후에 함수를 실행하는 JavaScript 함수입니다.
      setTimeout(() => setShowToast(false), 2000);

      // 부모 컴포넌트의 핸들러가 있으면 호출
      if (onCopyContact) {
        onCopyContact();
      }
    } catch (error) {
      console.error("연락처 복사 실패:", error);
    }
  };

  return (
    <>
      {/* 공정위 이미지 안내 섹션 */}
      <div className={styles.info_item_box}>
        <div className={styles.label_box}>
          <div className={styles.label_keyword_box}>
            <span>공정위 이미지</span>
            <button
              className={styles.copy_tag_button}
              onClick={handleCopyFtcImage}
            >
              복사
            </button>
          </div>
        </div>
        <div className={styles.content_box}>
          {/* 안내 문구 1 */}
          <p className={selectedCampaignStyles.info_text}>
            리뷰 콘텐츠 작성하실 때 첫 부분에 공정위 문구 배너를 먼저 삽입해
            주시고 작성해 주세요.
          </p>

          {/* 공정위 이미지 표시 영역 */}
          {/* 
            빈 박스 영역: 공정위 이미지를 표시하거나 붙여넣기할 수 있는 영역입니다.
            실제 구현 시에는 이미지가 표시되거나, 이미지 업로드 기능이 추가될 수 있습니다.
          */}
          <div className={selectedCampaignStyles.ftc_image_box}>
            {/* TODO: 실제 공정위 이미지가 여기에 표시되거나, 이미지 업로드 기능 추가 */}
          </div>

          {/* 안내 문구 2 */}
          <p className={selectedCampaignStyles.info_text}>
            좌측 복사 버튼을 이용해 이미지를 붙여넣기 해 주세요.
          </p>
        </div>
      </div>

      {/* 캠페인 문의 섹션 */}
      <div className={styles.info_item_box}>
        <div className={styles.label_box}>
          <div className={styles.label_keyword_box}>
            <span>캠페인 문의</span>
            <button
              className={styles.copy_tag_button}
              onClick={handleCopyContact}
            >
              복사
            </button>
          </div>
        </div>
        <div className={styles.content_box}>
          {/* 문의 담당자 연락처 */}
          <div className={selectedCampaignStyles.contact_number_box}>
            <span className={selectedCampaignStyles.contact_number}>
              {contactNumber}
            </span>
          </div>
        </div>
      </div>

      {/* 토스트 메시지 (복사 완료 알림) */}
      {showToast && (
        <div className={selectedCampaignStyles.toast_message}>
          {toastMessage}
        </div>
      )}
    </>
  );
}
