/**
 * 프로필 사진 업로드 컴포넌트
 *
 * 사용자가 프로필 사진을 업로드하고 삭제할 수 있는 컴포넌트입니다.
 *
 * 사용 위치:
 * - /partner/mypage/edit (파트너 내 정보 수정 페이지)
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import FormField from "./FormField";
import BaseModal from "@/components/common/modal/BaseModal";
import photoStyles from "@/styles/user/mypage/edit_profile/photo.module.css";

interface ProfilePhotoUploadProps {
  /** 현재 프로필 이미지 URL (없으면 null) */
  profileImage: string | null;
  /** 프로필 이미지 변경 핸들러 */
  onImageChange: (imageUrl: string | null) => void;
}

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/** 파일 형식 검증 헬퍼 함수 */
const validateFileType = (file: File): boolean => {
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split(".").pop();
  const isValidExtension = fileExtension
    ? ALLOWED_EXTENSIONS.includes(fileExtension)
    : false;
  const isValidMimeType = ALLOWED_MIME_TYPES.includes(file.type);
  return isValidExtension || isValidMimeType;
};

/** 파일 크기 검증 헬퍼 함수 */
const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export default function ProfilePhotoUpload({
  profileImage,
  onImageChange,
}: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  /**
   * 프로필 사진 업로드 핸들러
   *
   * 에러 모달이 표시되는 경우:
   * 1. 파일 형식 오류: 지정된 확장자(JPG, PNG, GIF)가 아닌 경우
   *    - 메시지: "지정된 확장자(JPG, PNG, GIF)만<br>업로드할 수 있습니다."
   * 2. 파일 크기 오류: 10MB를 초과하는 경우
   *    - 메시지: "10mb 이하의 파일만 업로드할 수 있습니다."
   *
   * 검증 순서:
   * 1. 파일 선택 여부 확인
   * 2. 파일 형식 검증 (확장자 또는 MIME 타입)
   * 3. 파일 크기 검증 (10MB 이하)
   * 4. 모든 검증 통과 시 업로드 진행
   */
  const handleProfilePhotoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (!file) return;

      if (!validateFileType(file)) {
        setModalMessage(
          "지정된 확장자(JPG, PNG, GIF)만<br>업로드할 수 있습니다."
        );
        return;
      }

      if (!validateFileSize(file)) {
        setModalMessage("10mb 이하의 파일만 업로드할 수 있습니다.");
        return;
      }

      setIsUploading(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageChange(imageUrl);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  const handleCloseModal = () => {
    setModalMessage(null);
  };

  const handleRemoveProfilePhoto = () => {
    onImageChange(null);
  };

  return (
    <>
      <FormField label="프로필 사진">
        <div className={photoStyles.profile_upload_container}>
          <div className={photoStyles.profile_image_wrapper}>
            <div
              className={photoStyles.profile_image_click_area}
              onClick={handleProfilePhotoUpload}
              title="프로필 사진 변경"
              role="button"
              aria-label="프로필 사진 변경"
            >
              <div className={photoStyles.profile_image}>
                {profileImage ? (
                  <img src={profileImage} alt="프로필 사진" />
                ) : (
                  <img
                    src="/images/mypage/profile.svg"
                    alt="기본 프로필 이미지"
                    className={photoStyles.default_avatar}
                  />
                )}
                {isUploading && (
                  <div className={photoStyles.upload_loading}>
                    <div className={photoStyles.loading_spinner} />
                  </div>
                )}
              </div>
              <div className={photoStyles.photo_upload_icon}>
                <Image
                  src="/images/icons/refresh_icon.svg"
                  alt="프로필 사진 업로드"
                  width={12}
                  height={12}
                  unoptimized
                />
              </div>
            </div>
            {profileImage && (
              <div
                className={photoStyles.photo_remove_icon}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveProfilePhoto();
                }}
                title="프로필 사진 삭제"
              >
                <Image
                  src="/images/mypage/profile_delete.svg"
                  alt="프로필 사진 삭제"
                  width={24}
                  height={24}
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      </FormField>

      <BaseModal
        is_open={modalMessage !== null}
        on_close={handleCloseModal}
        message={modalMessage || ""}
        buttons={["닫기"]}
        type="center"
      />
    </>
  );
}
