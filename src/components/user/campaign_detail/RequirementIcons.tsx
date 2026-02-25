/* ========================================
   📋 요구사항 아이콘 리스트 컴포넌트
   ======================================== */

/**
 * 요구사항 아이콘 리스트 컴포넌트
 *
 * 목적: 캠페인 상세 페이지에서 공통으로 사용되는 요구사항 아이콘들을 표시합니다.
 *
 * 사용 페이지:
 * - /user/campaign/[type]/[id] (캠페인 상세 페이지)
 */

import Image from "next/image";
import { getRequirementItems } from "./utils/requirementUtils";
import styles from "@/styles/user/campaign/campaign_detail/requirement_icons.module.css";

/**
 * Props 인터페이스
 */
interface RequirementIconsProps {
  requirements?: string[]; // 요구사항 코드 목록 (예: ["keyword", "product_link", "text_1500"])
  className?: string; // 추가 CSS 클래스
}

/**
 * 요구사항 아이콘 리스트 컴포넌트
 *
 * @param props - RequirementIconsProps 타입의 속성들
 * @returns 요구사항 아이콘 리스트를 담은 JSX 요소
 */
export default function RequirementIcons({ requirements, className = "" }: RequirementIconsProps) {
  // requirements가 없으면 아무것도 렌더링하지 않음
  if (!requirements || requirements.length === 0) {
    return null;
  }

  // requirements가 있으면 매핑하여 변환
  const activeRequirements = getRequirementItems(requirements);

  return (
    <div className={`${styles.requirement_container} ${className}`}>
      {activeRequirements.map((item, index) => (
        <div key={index} className={styles.requirement_item}>
          <Image
            className={styles.requirement_icon}
            src={item.icon}
            alt={item.alt}
            width={40}
            height={40}
          />
          <span className={styles.requirement_label}>{item.label}</span>
          <span className={styles.requirement_text}>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
