/* ========================================
   ⭐ 구매평 상세페이지 신청 모달
   ======================================== */

/**
 * 캠페인 신청 모달 컴포넌트 (Type 2)
 *
 * 목적: 구매평 상세 페이지에서 캠페인 신청하기 버튼을 눌렀을 때 나오는 모달창입니다.
 *
 * 주요 기능:
 * - 신청자 정보 표시
 * - 채널 정보 표시
 * - 메모 입력
 * - 동의 체크박스
 * - 캠페인 신청 처리
 */

"use client";

import { useState } from "react";
import styles from "../../../../styles/user/campaign/application_modal.module.css";

interface ApplicationModalType2Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationModalType2({
  isOpen,
  onClose,
}: ApplicationModalType2Props) {
  const [isAgreed, setIsAgreed] = useState(false);
  const [memo, setMemo] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    // 신청 처리 로직
    console.log("캠페인 신청:", {
      memo,
      isAgreed,
    });
    onClose();
  };

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
          <h2 className={styles.modal_title}>체험단 신청</h2>
          <button className={styles.close_button} onClick={onClose}>
            <img src="/images/filter/x_icon.svg" alt="닫기" />
          </button>
        </div>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className={styles.modal_content}>
          {/* 신청자 정보 섹션 */}
          <div className={styles.section}>
            <h3 className={styles.section_title}>신청자 정보</h3>
            {/* 신청자 정보 */}
            <div className={styles.user_info_container}>
              <div className={styles.user_info}>
                {/* 이름 */}
                <div className={styles.user_name}>홍길동</div>
                <div className={styles.user_address}>
                  인천 남동구 장자로 6번길 2, 1층
                </div>
              </div>
            </div>
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
              />
            </div>
          </div>

          {/* 동의 섹션 */}
          <div className={styles.section}>
            <h3 className={styles.section_title}>동의</h3>
            <div className={styles.agreement_container}>
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
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className={styles.button_container}>
          <button
            className={styles.connect_button}
            onClick={handleSubmit}
            disabled={!isAgreed}
          >
            채널 연결하기
          </button>
        </div>
      </div>
    </div>
  );
}
