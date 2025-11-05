/* ========================================
   📄 구매 영수증 미리보기 모달 (파트너용)
   - 이미지 좌우 넘김, 인디케이터, 닫기
   ======================================== */

"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/styles/partner/campaign_contents/receipt_preview_modal.module.css";

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  images: string[];
  onClose: () => void;
  initialIndex?: number;
}

export default function ReceiptPreviewModal({
  isOpen,
  images,
  onClose,
  initialIndex = 0,
}: ReceiptPreviewModalProps) {
  const validImages = useMemo(() => images.filter(Boolean), [images]);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  if (!isOpen) return null;

  const goPrev = () => {
    setCurrentIndex((idx) => (idx - 1 + validImages.length) % validImages.length);
  };

  const goNext = () => {
    setCurrentIndex((idx) => (idx + 1) % validImages.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const deltaX = touchStartX - touchEndX;
    const threshold = 40; // 스와이프 임계값
    if (deltaX > threshold) {
      goNext();
    } else if (deltaX < -threshold) {
      goPrev();
    }
  };

  return (
    <div className={styles.modal_overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={styles.modal_container} onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 - 우측 상단 */}
        <button className={styles.close_button} onClick={onClose} aria-label="닫기">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 16L48 48M48 16L16 48"
              stroke="#444444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          className={styles.modal_content}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {validImages.length === 0 ? (
            <div className={styles.empty_state}>표시할 영수증 이미지가 없습니다.</div>
          ) : (
            <>
              <div className={styles.image_viewer}>
                <button
                  className={`${styles.nav_button} ${styles.nav_left}`}
                  onClick={goPrev}
                  aria-label="이전"
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M40 16L24 32L40 48"
                      stroke="#444444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className={styles.image_wrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={validImages[currentIndex]}
                    alt={`영수증 ${currentIndex + 1}`}
                    className={styles.receipt_image}
                  />
                </div>
                <button
                  className={`${styles.nav_button} ${styles.nav_right}`}
                  onClick={goNext}
                  aria-label="다음"
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 16L40 32L24 48"
                      stroke="#444444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              {/* 하단 인디케이터 */}
              {validImages.length > 1 && (
                <div className={styles.indicator_container}>
                  {validImages.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.indicator_dot} ${
                        index === currentIndex ? styles.indicator_dot_active : ""
                      }`}
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`${index + 1}번째 이미지`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}


