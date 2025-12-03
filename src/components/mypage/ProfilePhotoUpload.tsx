/* ========================================
   📸 프로필 사진 업로드 컴포넌트
   ======================================== */

/**
 * 프로필 사진 업로드 컴포넌트
 *
 * 목적: 사용자가 프로필 사진을 업로드하고 삭제할 수 있는 컴포넌트입니다.
 *
 * 주요 기능:
 * - 프로필 사진 업로드 (PDF, JPG, PNG만 허용, 10MB 제한)
 * - 프로필 사진 미리보기
 * - 프로필 사진 삭제
 * - 업로드 중 로딩 상태 표시
 * - 파일 형식/크기 오류 모달 표시
 *
 * 사용 위치:
 * - /partner/mypage/edit (파트너 내 정보 수정 페이지)
 * - /user/mypage/edit (유저 내 정보 수정 페이지)
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/user/mypage/edit_profile.module.css';

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
  const [modalMessage, setModalMessage] = useState<string | null>(null); // 모달 메시지 상태

  /**
   * 프로필 사진 업로드 핸들러
   *
   * 기능 설명:
   * 1. 동적으로 숨겨진 파일 입력(input) 요소를 생성합니다.
   * 2. PDF, JPG, PNG 파일만 선택할 수 있도록 accept 속성을 설정합니다.
   * 3. 파일 크기와 타입을 검증합니다 (10MB 제한, PDF/JPG/PNG만 허용).
   * 4. 검증이 통과하면 FileReader API를 사용하여 이미지를 미리보기용 URL로 변환합니다.
   * 5. 검증 실패 시 모달을 표시합니다.
   *
   * - 파일 확장자를 확인하여 허용된 형식인지 검증합니다
   * - 파일 크기를 확인하여 제한을 초과하지 않는지 검증합니다
   * - 검증 실패 시 사용자에게 명확한 오류 메시지를 표시합니다
   */
  const handleProfilePhotoUpload = () => {
    // 숨겨진 파일 입력 요소를 동적으로 생성
    const input = document.createElement('input');
    input.type = 'file'; // 파일 선택 입력 타입으로 설정
    // PDF, JPG, PNG 파일만 허용
    input.accept = '.pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf';

    // 파일이 선택되었을 때 실행될 이벤트 핸들러
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (file) {
        // 파일 확장자 추출 (소문자로 변환하여 대소문자 구분 없이 비교)
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.split('.').pop(); // 마지막 점 이후의 문자열 (확장자)

        // 허용된 파일 형식: PDF, JPG, PNG
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

        // 파일 형식 검증: 확장자 또는 MIME 타입으로 확인
        const isValidExtension = fileExtension
          ? allowedExtensions.includes(fileExtension)
          : false;
        const isValidMimeType = allowedMimeTypes.includes(file.type);

        if (!isValidExtension && !isValidMimeType) {
          // 파일 형식이 허용되지 않으면 모달 표시
          setModalMessage(
            '지정된 확장자(PDF, JPG, PNG)만\n업로드할 수 있습니다.',
          );
          return;
        }

        // 파일 크기 검증: 10MB 제한
        const maxSize = 10 * 1024 * 1024; // 10MB (10 * 1024 * 1024 바이트)
        if (file.size > maxSize) {
          // 파일 크기가 제한을 초과하면 모달 표시
          setModalMessage('10mb 이하의 파일만 업로드할 수 있습니다.');
          return;
        }

        // 검증 통과: 업로드 중 상태로 변경
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
   * 모달 닫기 핸들러
   * 모달 메시지를 null로 설정하여 모달을 닫습니다.
   *
   * - modalMessage가 null이 아니면 모달이 열려있고, null이면 닫혀있습니다
   * - 조건부 렌더링을 통해 모달의 표시/숨김을 제어합니다
   */
  const handleCloseModal = () => {
    setModalMessage(null);
  };

  /**
   * 모달 오버레이 클릭 핸들러
   * 사용자가 모달 배경을 클릭하면 모달을 닫습니다.
   *
   * - e.target: 실제로 클릭된 요소
   * - e.currentTarget: 이벤트 핸들러가 등록된 요소 (오버레이)
   * - 두 값이 같으면 오버레이를 직접 클릭한 것이므로 모달을 닫습니다
   */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  /**
   * 프로필 사진 삭제 핸들러
   * 프로필 사진을 제거하고 기본 아바타로 되돌립니다.
   */
  const handleRemoveProfilePhoto = () => {
    onImageChange(null);
  };

  return (
    <>
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

      {/* 파일 업로드 오류 모달 */}
      {/* 조건부 렌더링: modalMessage가 있으면 모달 표시 */}
      {modalMessage && (
        <div
          className={styles.upload_alert_overlay}
          onClick={handleOverlayClick}
        >
          <div className={styles.upload_alert_container}>
            <div className={styles.upload_alert_content}>
              {/* 모달 메시지 (줄바꿈을 위해 pre-line 스타일 사용) */}
              <p className={styles.upload_alert_message}>{modalMessage}</p>
              {/* 닫기 버튼 */}
              <button
                type="button"
                className={styles.upload_alert_close_button}
                onClick={handleCloseModal}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
