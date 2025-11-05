/* ========================================
   📸 프로필 사진 업로드 컴포넌트
   ======================================== */

/**
 * 프로필 사진 업로드 컴포넌트
 *
 * 목적: 사용자가 프로필 사진을 업로드하고 삭제할 수 있는 컴포넌트입니다.
 *
 * 주요 기능:
 * - 프로필 사진 업로드 (이미지 파일만, 5MB 제한)
 * - 프로필 사진 미리보기
 * - 프로필 사진 삭제
 * - 업로드 중 로딩 상태 표시
 *
 * 사용 위치:
 * - /partner/mypage/edit (파트너 내 정보 수정 페이지)
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "@/styles/user/mypage/edit_profile.module.css";

interface ProfilePhotoUploadProps {
  /** 현재 프로필 이미지 URL (없으면 null) */
  profileImage: string | null;
  /** 프로필 이미지 변경 핸들러 */
  onImageChange: (imageUrl: string | null) => void;
}

/**
 * 프로필 사진 업로드 컴포넌트
 */
export default function ProfilePhotoUpload({
  profileImage,
  onImageChange,
}: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false); // 업로드 중 상태

  /**
   * 프로필 사진 업로드 핸들러
   *
   * 기능 설명:
   * 1. 동적으로 숨겨진 파일 입력(input) 요소를 생성합니다.
   * 2. 이미지 파일만 선택할 수 있도록 accept 속성을 설정합니다.
   * 3. 파일 크기와 타입을 검증합니다 (5MB 제한, 이미지 파일만).
   * 4. 검증이 통과하면 FileReader API를 사용하여 이미지를 미리보기용 URL로 변환합니다.
   */
  const handleProfilePhotoUpload = () => {
    // 숨겨진 파일 입력 요소를 동적으로 생성
    const input = document.createElement("input");
    input.type = "file"; // 파일 선택 입력 타입으로 설정
    input.accept = "image/*"; // 이미지 파일만 허용 (*는 모든 이미지 타입을 의미)

    // 파일이 선택되었을 때 실행될 이벤트 핸들러
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (file) {
        // 파일 크기 검증: 5MB 제한
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          alert("파일 크기는 5MB 이하여야 합니다.");
          return;
        }

        // 이미지 파일 타입 검증
        if (!file.type.startsWith("image/")) {
          alert("이미지 파일만 업로드 가능합니다.");
          return;
        }

        // 업로드 중 상태로 변경
        setIsUploading(true);

        // FileReader API를 사용하여 파일을 데이터 URL로 변환
        // 이렇게 하면 이미지를 서버에 업로드하기 전에 미리보기를 할 수 있습니다.
        const reader = new FileReader();
        reader.onload = (e) => {
          // reader.result는 파일을 읽은 결과입니다 (Base64 인코딩된 데이터 URL)
          const imageUrl = e.target?.result as string;
          onImageChange(imageUrl);
          setIsUploading(false);
        };
        // 파일을 데이터 URL로 읽습니다
        reader.readAsDataURL(file);
      }
    };

    // 파일 선택 다이얼로그를 엽니다
    input.click();
  };

  /**
   * 프로필 사진 삭제 핸들러
   * 프로필 사진을 제거하고 기본 아바타로 되돌립니다.
   */
  const handleRemoveProfilePhoto = () => {
    onImageChange(null);
  };

  return (
    <article className={styles.field_article}>
      <label className={styles.field_label}>프로필 사진</label>
      <div className={styles.profile_upload_container}>
        <div className={styles.profile_image_wrapper}>
          <div className={styles.profile_image}>
            {/* 조건부 렌더링: profileImage가 있으면 이미지 표시, 없으면 기본 아바타 */}
            {profileImage ? (
              <img src={profileImage} alt="프로필 사진" />
            ) : (
              <div className={styles.default_avatar}>
                <div className={styles.emoji_dots}>
                  <div className={styles.emoji_dot} />
                  <div className={styles.emoji_dot} />
                </div>
                <div className={styles.emoji_mouth} />
              </div>
            )}
            {/* 업로드 중일 때 로딩 스피너 표시 */}
            {isUploading && (
              <div className={styles.upload_loading}>
                <div className={styles.loading_spinner} />
              </div>
            )}
          </div>
          {/* 프로필 사진 변경 버튼 */}
          <div
            className={styles.photo_upload_icon}
            onClick={handleProfilePhotoUpload}
            title="프로필 사진 변경"
          >
            <Image
              src="/images/icons/refresh_icon.svg"
              alt="프로필 사진 업로드"
              width={12}
              height={12}
              unoptimized
            />
          </div>
          {/* 프로필 사진이 있을 때만 삭제 버튼 표시 */}
          {profileImage && (
            <div
              className={styles.photo_remove_icon}
              onClick={handleRemoveProfilePhoto}
              title="프로필 사진 삭제"
            >
              <Image
                src="/images/icons/close_x_small.svg"
                alt="프로필 사진 삭제"
                width={12}
                height={12}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

