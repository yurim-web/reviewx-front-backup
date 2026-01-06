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
import styles from "@/styles/user/campaign/campaign_detail/detail_image.module.css";

/**
 * Props 인터페이스
 */
interface CampaignDetailImageProps {
  image?: string; // 상세 이미지 경로 (단일 이미지용, 하위 호환성)
  images?: string[]; // 상세 이미지 경로 배열 (여러 이미지용)
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
  images,
  alt = "캠페인상세사진",
}: CampaignDetailImageProps) {
  // ========================================
  // 상태 관리
  // ========================================

  // 전체 이미지 확장 상태 (모든 이미지를 한번에 제어)
  // useState: 컴포넌트의 상태를 관리하는 React Hook
  // [상태값, 상태변경함수] = useState(초기값)
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  // 이미지 배열 결정: images가 있으면 사용, 없으면 image를 배열로 변환
  const imageList = images && images.length > 0 ? images : image ? [image] : [];

  // 전체 이미지 확장/축소 토글 함수
  const toggleAllImages = () => {
    setIsAllExpanded((prev) => !prev);
  };

  return (
    // ========================================
    // 상세 이미지 섹션
    // ========================================
    <article className={styles.review_guidelines_container}>
      {/* 모든 이미지를 감싸는 컨테이너 */}
      <div className={styles.all_images_container}>
        {imageList.map((img, index) => (
          <div
            key={index}
            className={`${styles.campaign_detail_image_container} ${
              isAllExpanded ? styles.expanded : ""
            }`}
          >
            {/* 상세 이미지 */}
            <img src={img} alt={`${alt} ${index + 1}`} />
          </div>
        ))}

        {/* 
          펼치기/접기 버튼 (마지막 이미지 아래에 하나만 표시)
          onClick: 클릭 이벤트 핸들러
          화살표 함수로 상태 토글 (true ↔ false)
        */}
        {imageList.length > 0 && (
          <button
            className={styles.expand_image_button}
            onClick={toggleAllImages}
          >
            {/* 
              조건부 렌더링: 삼항 연산자 사용
              isAllExpanded가 true면 "이미지 접기", false면 "이미지 펼쳐보기"
            */}
            {isAllExpanded ? "이미지 접기" : "이미지 펼쳐보기"}
          </button>
        )}
      </div>
    </article>
  );
}
