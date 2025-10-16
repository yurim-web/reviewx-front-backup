/* ========================================
   🖼️ 캠페인 상세 이미지 컴포넌트 (확장/축소)
   ======================================== */

/**
 * 캠페인 상세 이미지 컴포넌트
 *
 * 목적: 캠페인 상세 이미지를 표시하고 펼치기/접기 기능을 제공합니다.
 *
 * 주요 기능:
 * - 상세 이미지 표시
 * - 이미지 펼쳐보기/접기 토글
 * - 상태 관리 (확장/축소)
 */

"use client";

import { useState } from "react";
import styles from "../../../styles/user/campaign/campaign_detail/detail_image.module.css";

/**
 * Props 인터페이스
 */
interface CampaignDetailImageProps {
  image: string; // 상세 이미지 경로
  alt?: string; // 이미지 alt 속성 (선택사항)
}

/**
 * 캠페인 상세 이미지 컴포넌트
 *
 * @param props - CampaignDetailImageProps 타입의 속성들
 * @returns 상세 이미지와 펼치기/접기 버튼을 담은 JSX 요소
 */
export default function CampaignDetailImage({
  image,
  alt = "캠페인상세사진",
}: CampaignDetailImageProps) {
  // ========================================
  // 상태 관리
  // ========================================

  // 이미지 확장 상태
  // useState: 컴포넌트의 상태를 관리하는 React Hook
  // [상태값, 상태변경함수] = useState(초기값)
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  return (
    // ========================================
    // 상세 이미지 섹션
    // ========================================
    <article className={styles.review_guidelines_container}>
      <div
        className={`${styles.campaign_detail_image_container} ${
          isImageExpanded ? styles.expanded : ""
        }`}
      >
        {/* 상세 이미지 */}
        <img src={image} alt={alt} />

        {/* 
          펼치기/접기 버튼
          onClick: 클릭 이벤트 핸들러
          화살표 함수로 상태 토글 (true ↔ false)
        */}
        <button
          className={styles.expand_image_button}
          onClick={() => setIsImageExpanded(!isImageExpanded)}
        >
          {/* 
            조건부 렌더링: 삼항 연산자 사용
            isImageExpanded가 true면 "이미지 접기", false면 "이미지 펼쳐보기"
          */}
          {isImageExpanded ? "이미지 접기" : "이미지 펼쳐보기"}
        </button>
      </div>
    </article>
  );
}
