/* ========================================
   🎠 메인 배너 슬라이드 컴포넌트
   ======================================== */

/**
 * 메인 배너 슬라이드 컴포넌트
 *
 * 목적: 메인 페이지 상단에 여러 배너 이미지를 슬라이드로 표시합니다.
 *
 * 주요 기능:
 * - 여러 배너 이미지를 슬라이드로 표시
 * - 자동 슬라이드 전환 (5초마다)
 * - 페이지네이션 도트로 현재 슬라이드 표시
 * - 도트 클릭으로 특정 슬라이드로 이동
 * - 마우스 호버 시 자동 슬라이드 일시 정지
 *
 * 사용 위치:
 * - HomePageClient.tsx (메인 홈 페이지)
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "@/styles/main/main_banner_slider.module.css";

/**
 * 배너 슬라이드 컴포넌트 Props 타입 정의
 */
interface MainBannerSliderProps {
  /**
   * 배너 이미지 배열
   * 각 이미지는 public/images/main/ 폴더에 있어야 합니다.
   */
  banners: string[];
  /**
   * 자동 슬라이드 전환 간격 (밀리초)
   * 기본값: 5000ms (5초)
   */
  autoSlideInterval?: number;
}

/**
 * 메인 배너 슬라이드 컴포넌트
 *
 * @param banners - 배너 이미지 경로 배열
 * @param autoSlideInterval - 자동 슬라이드 전환 간격 (기본값: 5000ms)
 */
export default function MainBannerSlider({
  banners,
  autoSlideInterval = 5000,
}: MainBannerSliderProps) {
  /**
   * 현재 활성화된 슬라이드 인덱스 상태
   *
   * 설명:
   * - useState Hook을 사용하여 컴포넌트의 상태를 관리합니다.
   * - 초기값은 0 (첫 번째 슬라이드)
   * - setCurrentSlide 함수를 통해 상태를 업데이트할 수 있습니다.
   */
  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * 마우스 호버 상태
   *
   * 설명:
   * - 사용자가 배너에 마우스를 올렸는지 여부를 추적합니다.
   * - 호버 중일 때는 자동 슬라이드를 일시 정지합니다.
   */
  const [isHovered, setIsHovered] = useState(false);

  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  /**
   * 다음 슬라이드로 이동하는 함수
   *
   * 설명:
   * - useCallback Hook을 사용하여 함수를 메모이제이션합니다.
   * - 의존성 배열이 변경되지 않으면 같은 함수 참조를 유지합니다.
   * - 마지막 슬라이드에 도달하면 첫 번째 슬라이드로 순환합니다.
   */
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  /**
   * 이전 슬라이드로 이동하는 함수
   *
   * 설명:
   * - 첫 번째 슬라이드에서 이전 버튼을 누르면 마지막 슬라이드로 이동합니다.
   */
  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  /**
   * 특정 슬라이드로 이동하는 함수
   *
   * @param index - 이동할 슬라이드 인덱스
   */
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  /**
   * 자동 슬라이드 효과
   *
   * 설명:
   * - useEffect Hook을 사용하여 컴포넌트가 마운트되거나 의존성이 변경될 때 실행됩니다.
   * - setInterval을 사용하여 일정 시간마다 다음 슬라이드로 이동합니다.
   * - isHovered가 true일 때는 자동 슬라이드를 일시 정지합니다.
   * - cleanup 함수에서 interval을 정리하여 메모리 누수를 방지합니다.
   */
  useEffect(() => {
    // 마우스 호버 중이면 자동 슬라이드 일시 정지
    if (isHovered) {
      return;
    }

    // setInterval: 일정 시간마다 함수를 실행합니다.
    const interval = setInterval(() => {
      goToNextSlide();
    }, autoSlideInterval);

    // cleanup 함수: 컴포넌트가 언마운트되거나 의존성이 변경될 때 실행됩니다.
    return () => clearInterval(interval);
  }, [isHovered, autoSlideInterval, goToNextSlide]);

  const threshold = 50; // 슬라이드 전환을 위한 최소 드래그/스와이프 거리 (픽셀)

  const applySlideChange = useCallback(
    (offset: number) => {
      if (Math.abs(offset) > threshold) {
        if (offset > 0) {
          goToPrevSlide();
        } else {
          goToNextSlide();
        }
      }
    },
    [goToPrevSlide, goToNextSlide]
  );

  // 마우스 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    setDragOffset(0);
  };

  // 마우스 드래그 중
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setCurrentX(e.clientX);
    setDragOffset(diff);
  };

  // 마우스 드래그 종료
  const handleMouseUp = () => {
    if (!isDragging) return;
    applySlideChange(dragOffset);
    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
    setCurrentX(0);
  };

  // 터치 스와이프 시작 (모바일)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    setDragOffset(0);
  };

  // 터치 스와이프 중 (모바일)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setCurrentX(e.touches[0].clientX);
    setDragOffset(diff);
  };

  // 터치 스와이프 종료 (모바일)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    // touchend에서는 touches가 비어있으므로 changedTouches 사용
    const endX = e.changedTouches[0]?.clientX ?? startX + dragOffset;
    const offset = endX - startX;
    applySlideChange(offset);
    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
    setCurrentX(0);
  };

  // 마우스가 영역을 벗어날 때
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
      setStartX(0);
      setCurrentX(0);
    }
    setIsHovered(false);
  };

  // 배너가 없으면 아무것도 렌더링하지 않음
  if (!banners || banners.length === 0) {
    return null;
  }

  // 드래그 중일 때는 transition을 비활성화하고 offset을 적용
  const transformValue = isDragging
    ? `translateX(calc(-${currentSlide * 100}% + ${dragOffset}px))`
    : `translateX(-${currentSlide * 100}%)`;

  return (
    <div
      className={styles.slider_container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* 슬라이드 래퍼 */}
      <div
        className={styles.slider_wrapper}
        style={{
          transform: transformValue,
          transition: isDragging ? "none" : "transform 0.5s ease-in-out",
        }}
      >
        {/* 배너 이미지들 */}
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              index === currentSlide ? styles.slide_active : ""
            }`}
          >
            <img src={banner} alt={`배너 ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* 페이지네이션 도트 */}
      <div className={styles.pagination}>
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.dot} ${
              index === currentSlide ? styles.dot_active : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`${index + 1}번째 배너로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
