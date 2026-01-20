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
        {/* 
          조건부 렌더링:
          - 접혀있을 때(isAllExpanded === false): 첫 번째 이미지만 표시
          - 펼쳐져 있을 때(isAllExpanded === true): 모든 이미지 표시
        */}
        {imageList.length > 0 && (
          <>
            {/* 첫 번째 이미지: 항상 표시, 펼쳐졌을 때는 원본 크기 */}
            <div
              className={`${styles.campaign_detail_image_container} ${
                isAllExpanded ? styles.expanded : ""
              }`}
            >
              <img src={imageList[0]} alt={`${alt} 1`} />
            </div>

            {/* 
              나머지 이미지들: 펼쳐져 있을 때만 표시
              - slice(1): 첫 번째 이미지를 제외한 나머지 이미지들
              - isAllExpanded가 true일 때만 렌더링됨
              - 항상 expanded 클래스 적용하여 원본 크기로 표시
            */}
            {isAllExpanded &&
              imageList.slice(1).map((img, index) => (
                <div
                  key={index + 1} // index가 0부터 시작하므로 +1을 해서 2, 3, 4... 순서로
                  className={`${styles.campaign_detail_image_container} ${styles.expanded}`}
                >
                  {/* 상세 이미지 */}
                  <img src={img} alt={`${alt} ${index + 2}`} />
                </div>
              ))}

            {/* 
              펼치기/접기 버튼
              - 이미지가 1개 이상이면 항상 버튼 표시
              - onClick: 클릭 이벤트 핸들러
              - 화살표 함수로 상태 토글 (true ↔ false)
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
          </>
        )}
      </div>
    </article>
  );
}
