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
  // 상태 유형 (모범 회원, 주의 회원 등)
  status_type: string;
  // 기본 정보 배열 (예: ['리뷰어', '김철수', '남성', '만 30세', ...])
  basic_info_items: string[];
}

export default function ProfileSection({
  name,
  status_type,
  basic_info_items,
}: ProfileSectionProps) {
  return (
    <div className={styles.profile_section}>
      <div className={styles.profile_image_wrapper}>
        <div className={styles.profile_image_placeholder} />
      </div>

      <div className={styles.profile_info}>
        <div className={styles.status_type_tag}>{status_type}</div>

        <h1 className={styles.name}>{name}</h1>

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
