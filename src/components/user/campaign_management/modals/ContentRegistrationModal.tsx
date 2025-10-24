/* ========================================
   📄 콘텐츠 등록 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 콘텐츠 등록 모달 컴포넌트 (유저용)
 *
 * 목적: 사용자가 콘텐츠를 등록할 수 있는 모달입니다.
 *
 * 사용 위치:
 * - 유저 캠페인 관리 페이지에서 "콘텐츠 등록하기" 버튼 클릭 시
 *
 * 주요 기능:
 * - 콘텐츠 파일 업로드
 * - 업로드된 파일명 표시
 * - 콘텐츠 등록 완료
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../../../../styles/user/campaign_management/modals/content_registration.module.css";

interface ContentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
}

export default function ContentRegistrationModal({
  isOpen,
  onClose,
  campaignTitle,
}: ContentRegistrationModalProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // 링크 입력 핸들러
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(e.target.value);
  };

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 콘텐츠 등록 완료
  const handleSubmit = async () => {
    if (!linkUrl.trim()) {
      alert("콘텐츠 링크를 입력해주세요.");
      return;
    }

    // URL 형식 검증
    try {
      new URL(linkUrl);
    } catch {
      alert("올바른 URL 형식을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 실제 API 호출로 콘텐츠 등록
      console.log("콘텐츠 등록:", linkUrl);

      // 성공 시 모달 닫기
      alert("콘텐츠가 성공적으로 등록되었습니다.");
      onClose();
      setLinkUrl(""); // 입력창 초기화
    } catch (error) {
      console.error("콘텐츠 등록 실패:", error);
      alert("콘텐츠 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div className={styles.modal_container}>
        {/* 모달 제목 */}
        <h2 className={styles.modal_title}>콘텐츠 등록</h2>

        {/* 링크 섹션 */}
        <div className={styles.link_section}>
          <p className={styles.link_label}>링크</p>
          <input
            type="url"
            className={styles.link_input}
            placeholder="https://example.com"
            value={linkUrl}
            onChange={handleLinkChange}
          />
        </div>

        {/* 등록 버튼 */}
        <button
          className={styles.submit_button}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "등록 중..." : "등록하기"}
        </button>

        {/* 닫기 버튼 */}
        <button className={styles.close_button} onClick={onClose}>
          <Image
            src="/images/filter/x_icon.svg"
            alt="닫기"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
}
