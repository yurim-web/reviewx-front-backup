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
import ErrorModal from "./ErrorModal";
import styles from "@/styles/user/mypage/edit_profile.module.css";

interface ProfilePhotoUploadProps {
  /** 현재 프로필 이미지 URL (없으면 null) */
  profileImage: string | null;
  /** 프로필 이미지 변경 핸들러 */
  onImageChange: (imageUrl: string | null) => void;
}

const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];
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

  /** 프로필 사진 업로드 핸들러 */
  const handleProfilePhotoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (!file) return;

      if (!validateFileType(file)) {
        setModalMessage(
          "지정된 확장자(PDF, JPG, PNG)만\n업로드할 수 있습니다."
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
        <div className={styles.profile_upload_container}>
          <div className={styles.profile_image_wrapper}>
            <div className={styles.profile_image}>
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
              {isUploading && (
                <div className={styles.upload_loading}>
                  <div className={styles.loading_spinner} />
                </div>
              )}
            </div>
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
      </FormField>

      <ErrorModal message={modalMessage} onClose={handleCloseModal} />
    </>
  );
}
