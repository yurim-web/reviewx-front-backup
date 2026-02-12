/* ========================================
   📦 캠페인 제품 정보 컴포넌트
   ======================================== */

/**
 * 캠페인 제품 정보 컴포넌트
 *
 * 목적: 캠페인 제품의 제목, 설명, 이미지를 표시합니다.
 *
 * 주요 기능:
 * - 제품 제목 표시
 * - 제품 설명 표시
 * - 제품 메인 이미지 표시
 * - 공유: PC는 클립보드 복사 + 토스트, 모바일은 OS 공유(navigator.share)
 * - children을 통해 추가 콘텐츠 렌더링 가능
 */

"use client";

import { ReactNode, useState } from "react";
import Toast from "@/components/common/toast/Toast";
import styles from "@/styles/user/campaign/campaign_detail/detail_product_info.module.css";

const MOBILE_BREAKPOINT = 768;

/**
 * Props 인터페이스
 */
interface CampaignProductInfoProps {
  title: string; // 제품 제목
  description: string; // 제품 설명
  image: string; // 제품 이미지 경로
  children?: ReactNode; // 추가 콘텐츠 (예: 캠페인 일정 정보)
}

/**
 * 캠페인 제품 정보 컴포넌트
 *
 * @param props - CampaignProductInfoProps 타입의 속성들
 * @returns 제품 정보를 담은 JSX 요소
 */
export default function CampaignProductInfo({
  title,
  description,
  image,
  children,
}: CampaignProductInfoProps) {
  const [showToast, setShowToast] = useState(false);

  /**
   * 공유 버튼 클릭 핸들러
   * - PC: 클립보드 복사 후 "복사되었습니다." 토스트
   * - 모바일: OS 공유 시트(navigator.share) 사용
   */
  const handleShare = async () => {
    try {
      const isMobile =
        typeof window !== "undefined" &&
        window.innerWidth <= MOBILE_BREAKPOINT;

      if (isMobile && navigator.share) {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
      }
    } catch (error) {
      console.error("공유 실패:", error);
    }
  };

  return (
    // ========================================
    // 제품 정보 섹션
    // ========================================
    <article className={styles.product_info}>
      {/* 제품 제목 및 설명 */}
      <div className={styles.product_info_title}>
        {/* 제목과 공유 버튼을 포함하는 헤더 */}
        <div className={styles.title_header}>
          {/*
            h1 태그: 페이지에서 가장 중요한 제목 (SEO에 유리)
            시맨틱 HTML: 의미있는 구조로 마크업
          */}
          <h1 className={styles.product_title}>{title}</h1>

          {/* 공유 버튼 */}
          <button
            type="button"
            className={styles.share_button}
            onClick={handleShare}
            aria-label="공유하기"
          >
            <img
              src="/images/campaign_detail/share_icon.svg"
              alt="공유"
              width={32}
              height={32}
            />
          </button>
        </div>

        {/*
          p 태그: 문단(paragraph)을 나타냄
        */}
        <p className={styles.product_description}>{description}</p>
      </div>

      {/* 제품 메인 이미지 */}
      <div className={styles.main_image_container}>
        <img src={image} alt={title} />
      </div>

      {/* 
        children: 부모 컴포넌트에서 전달한 추가 콘텐츠를 여기에 렌더링
        예: <CampaignProductInfo>여기에 들어가는 내용</CampaignProductInfo>
      */}
      {children}

      {/* PC에서 링크 복사 시 토스트 */}
      <Toast
        message="복사되었습니다."
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        duration={2000}
      />
    </article>
  );
}
