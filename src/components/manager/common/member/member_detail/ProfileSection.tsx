/* ========================================
   👤 프로필 섹션 컴포넌트
   ======================================== */

/**
 * 프로필 섹션 컴포넌트
 *
 * 목적: 리뷰어와 파트너 디테일 페이지에서 공통으로 사용되는 프로필 섹션입니다.
 *
 * 사용 위치:
 * - 리뷰어 디테일 페이지
 * - 파트너 디테일 페이지
 *
 * 주요 기능:
 * - 프로필 이미지 (플레이스홀더)
 * - 이름/상호명
 * - 상태 유형 태그
 * - 기본 정보 (역할, 구분, 이메일, 전화번호, 주소 등)
 *
 */

"use client";

import styles from "@/styles/manager/common/member/member_detail/profile_section.module.css";

interface ProfileSectionProps {
  // 이름 또는 상호명
  name: string;
  // 상태 유형 (일반 회원, 주의 회원, 이용 제한 회원)
  status_type: string;
  // 기본 정보 배열 (예: ['리뷰어', '김철수', '남성', '만 30세', ...])
  basic_info_items: string[];
  // 프로필 이미지 URL (선택적)
  // 이미지가 없으면 기본 이미지(/images/mypage/profile.svg)를 사용합니다
  profile_image?: string | null;
  // 파트너 상세일 때 true (상호명 색상 #2B7FFF 적용)
  is_partner?: boolean;
}

export default function ProfileSection({
  name,
  status_type,
  basic_info_items,
  profile_image,
  is_partner = false,
}: ProfileSectionProps) {
  // 프로필 이미지 URL 결정
  // profile_image가 있으면 사용하고, 없으면 기본 이미지를 사용합니다
  const profile_image_url = profile_image || "/images/mypage/profile.svg";

  return (
    <div className={styles.profile_section}>
      <div className={styles.profile_image_wrapper}>
        {/* 프로필 이미지 또는 기본 이미지 표시 */}

        <img
          src={profile_image_url}
          alt={`${name} 프로필`}
          className={styles.profile_image}
        />
      </div>

      <div className={styles.profile_info}>
        <div
          className={`${styles.status_type_tag} ${
            status_type === "이용 제한 회원" ? styles.status_type_tag_restricted : ""
          }`}
        >
          {status_type}
        </div>

        <h1
          className={`${styles.name} ${is_partner ? styles.name_partner : ""}`}
        >
          {name}
        </h1>

        <div className={styles.basic_info}>
          {basic_info_items.map((item, index) => (
            <span key={index}>
              {item}
              {index < basic_info_items.length - 1 && (
                <span className={styles.separator}>·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
