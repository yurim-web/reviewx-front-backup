/* ========================================
   📋 정보 카드 컴포넌트
   ======================================== */

/**
 * 정보 카드 컴포넌트
 *
 * 목적: 디테일 페이지에서 라벨과 값을 표시하는 재사용 가능한 카드 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers/[id] (GA 관리자 리뷰어 상세 페이지)
 * - /manager_sa/member/reviewers/[id] (SA 관리자 리뷰어 상세 페이지)
 * - /manager_ga/member/partners/[id] (GA 관리자 파트너 상세 페이지)
 * - /manager_sa/member/partners/[id] (SA 관리자 파트너 상세 페이지)
 *
 * 사용 컴포넌트:
 * - AccountInfoSection.tsx (리뷰어 계정 정보 섹션)
 * - ContactPersonSection.tsx (파트너 담당자 정보 섹션)
 * - BusinessInfoSection.tsx (파트너 사업자 정보 섹션)
 * - ActivityInfoSection.tsx (회원 활동 정보 섹션)
 *
 * 주요 기능:
 * - 라벨과 값을 표시합니다
 * - 버튼이 있는 경우 버튼을 함께 표시할 수 있습니다
 * - 추가 배지나 요소를 표시할 수 있습니다
 *
 */

"use client";

import Image from "next/image";
import styles from "@/styles/manager/common/member/member_detail/info_card.module.css";

interface InfoCardProps {
  // 라벨 텍스트
  label: string;
  // 값 텍스트 또는 커스텀 요소
  value: React.ReactNode;
  // 버튼 클릭 핸들러 (선택적)
  on_button_click?: () => void;
  // 버튼 aria-label (선택적)
  button_aria_label?: string;
  // 추가 요소 (배지 등, 선택적) - value와 같은 줄에 표시
  additional_content?: React.ReactNode;
  // 추가 요소 (배지 등, 선택적) - value 아래에 표시
  children?: React.ReactNode;
}

export default function InfoCard({
  label,
  value,
  on_button_click,
  button_aria_label,
  additional_content,
  children,
}: InfoCardProps) {
  return (
    <div className={styles.info_card}>
      <div className={styles.info_label}>{label}</div>

      <div
        className={
          on_button_click || additional_content
            ? styles.info_value_with_button
            : styles.info_value
        }
      >
        {value}

        {on_button_click && (
          <button
            className={styles.arrow_button}
            onClick={on_button_click}
            aria-label={button_aria_label}
          >
            <img
              src="/images/icons/arronw_btn.svg"
              alt="화살표"
              className={styles.arrow_icon}
            />
          </button>
        )}

        {additional_content && (
          <div className={styles.additional_content}>{additional_content}</div>
        )}
      </div>

      {children}
    </div>
  );
}
