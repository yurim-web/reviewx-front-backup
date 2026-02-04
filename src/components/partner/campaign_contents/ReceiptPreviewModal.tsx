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
  const [overlayTouchStart, setOverlayTouchStart] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  if (!isOpen) return null;

  // 📌 무한루프 제거: 이전/다음 버튼이 비활성화되도록 수정
  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    }
  };

  const goNext = () => {
    if (currentIndex < validImages.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    }
  };

  // 이전/다음 버튼 활성화 상태 확인
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < validImages.length - 1;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) {
      // 터치 시작이 없으면 스와이프가 아니므로 이벤트 전파 허용
      return;
    }
    
    if (touchEndX === null) {
      // 터치 이동이 없으면 단순 탭이므로 이벤트 전파 허용
      setTouchStartX(null);
      setTouchStartTarget(null);
      return;
    }
    
    const deltaX = touchStartX - touchEndX;
    const threshold = 40; // 스와이프 임계값
    // 📌 무한루프 제거: 스와이프도 경계 체크
    if (deltaX > threshold && hasNext) {
      goNext();
      e.stopPropagation(); // 스와이프인 경우에만 이벤트 전파 차단
    } else if (deltaX < -threshold && hasPrev) {
      goPrev();
      e.stopPropagation(); // 스와이프인 경우에만 이벤트 전파 차단
    }
    // 터치 초기화
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 오버레이 터치 핸들러
  const handleOverlayTouchStart = (e: React.TouchEvent) => {
    // 오버레이 자체를 터치한 경우에만 표시
    if (e.target === e.currentTarget) {
      setOverlayTouchStart(true);
    } else {
      setOverlayTouchStart(false);
    }
  };

  const handleOverlayTouchEnd = (e: React.TouchEvent) => {
    // 오버레이 자체를 터치했고, 터치 시작도 오버레이에서 시작한 경우에만 닫기
    if (e.target === e.currentTarget && overlayTouchStart) {
      onClose();
    }
    setOverlayTouchStart(false);
  };

  return (
    <div
      className={styles.modal_overlay}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
      onTouchStart={handleOverlayTouchStart}
      onTouchEnd={handleOverlayTouchEnd}
    >
      <div
        className={styles.modal_container}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 - 우측 상단 */}
        <button
          className={styles.close_button}
          onClick={onClose}
          aria-label="닫기"
        >
          <img
            src="/images/modal/modal_x.svg"
            alt="닫기"
            width={64}
            height={64}
          />
        </button>

        <div
          className={styles.modal_content}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={(e) => e.stopPropagation()}
        >
          {validImages.length === 0 ? (
            <div className={styles.empty_state}>
              표시할 영수증 이미지가 없습니다.
            </div>
          ) : (
            <>
              <div className={styles.image_viewer}>
                <button
                  className={`${styles.nav_button} ${styles.nav_left} ${
                    !hasPrev ? styles.nav_button_disabled : ""
                  }`}
                  onClick={goPrev}
                  disabled={!hasPrev}
                  aria-label="이전"
                >
                  <img
                    src="/images/modal/modal_arrow.svg"
                    alt="이전"
                    width={64}
                    height={64}
                  />
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
                  className={`${styles.nav_button} ${styles.nav_right} ${
                    !hasNext ? styles.nav_button_disabled : ""
                  }`}
                  onClick={goNext}
                  disabled={!hasNext}
                  aria-label="다음"
                >
                  <img
                    src="/images/modal/modal_next.svg"
                    alt="다음"
                    width={64}
                    height={64}
                  />
                </button>
              </div>
              {/* 하단 인디케이터 */}
              {validImages.length > 1 && (
                <div className={styles.indicator_container}>
                  {validImages.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.indicator_dot} ${
                        index === currentIndex
                          ? styles.indicator_dot_active
                          : ""
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
