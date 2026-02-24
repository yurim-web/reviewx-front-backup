/* ========================================
   🔄 회원 유형 토글 버튼 컴포넌트
   ======================================== */

/**
 * 회원 유형 토글 버튼 컴포넌트
 *
 * 목적: 리뷰어와 광고주 간 회원 유형을 전환하는 토글 버튼입니다.
 *
 * 사용 페이지:
 * - /user/mypage/profile (유저 마이페이지 프로필)
 * - /partner/mypage (파트너 마이페이지)
 *
 */

"use client";

import styles from "@/styles/user/mypage/member_type_toggle.module.css";

/**
 * MemberTypeToggle 컴포넌트의 Props 타입 정의
 */
interface MemberTypeToggleProps {
  /** 현재 활성화된 회원 유형 ("reviewer" 또는 "partner") */
  activeType: "reviewer" | "partner";
  /** 회원 유형 변경 시 실행할 함수 */
  onToggle: (type: "reviewer" | "partner") => void;
}

/**
 * 회원 유형 토글 버튼 컴포넌트
 *
 * @param props - MemberTypeToggleProps 타입의 props 객체
 * @returns JSX.Element - 토글 버튼 JSX 요소
 */
export default function MemberTypeToggle({ activeType, onToggle }: MemberTypeToggleProps) {
  return (
    <div className={styles.toggle_container}>
      {/* 배경 */}
      <div className={styles.toggle_background} />

      {/* 리뷰어 버튼 */}
      <button
        type="button"
        className={`${styles.toggle_button} ${styles.reviewer_button} ${
          activeType === "reviewer" ? styles.active : ""
        }`}
        onClick={() => onToggle("reviewer")}
      >
        리뷰어
      </button>

      {/* 광고주 버튼 */}
      <button
        type="button"
        className={`${styles.toggle_button} ${styles.partner_button} ${
          activeType === "partner" ? styles.active : ""
        }`}
        onClick={() => onToggle("partner")}
      >
        광고주
      </button>
    </div>
  );
}
