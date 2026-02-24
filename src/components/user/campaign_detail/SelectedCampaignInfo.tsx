/* ========================================
   📋 참여 캠페인 상세 페이지 추가 안내 섹션
   ======================================== */

/**
 * 참여 캠페인 상세 페이지 추가 안내 섹션 컴포넌트
 *
 * 목적: 유저가 참여한 캠페인(캠페인 관리 목록에서 진입) 상세 페이지에
 *       공정위 가이드 안내와 캠페인 문의 정보를 표시합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (선정 탭 - 참여 캠페인 상세 진입 시)
 */

"use client";

import styles from "@/styles/user/campaign/campaign_detail/detail_guidelines_section.module.css";
import selectedCampaignStyles from "@/styles/user/campaign/campaign_detail/selected_campaign_info.module.css";

interface SelectedCampaignInfoProps {
  /** 공정위 가이드 이동 버튼 클릭 핸들러 (가이드 페이지 준비 전까지는 미사용) */
  onGoToGuide?: () => void;
  /** 문의 담당자 연락처 복사 버튼 클릭 핸들러 */
  onCopyContact?: () => void;
  /** 문의 담당자 연락처 (기본값: "010-1234-5678") */
  contactNumber?: string;
}

export default function SelectedCampaignInfo({
  onGoToGuide,
  onCopyContact,
  contactNumber = "010-1234-5678",
}: SelectedCampaignInfoProps) {
  const handleGoToGuide = () => {
    // 가이드 페이지가 준비되기 전까지 안내 알림만 표시
    alert("가이드 페이지 이동 예정입니다.");
  };

  const handleCopyContact = async () => {
    try {
      await navigator.clipboard.writeText(contactNumber);
      if (onCopyContact) {
        onCopyContact();
      }
    } catch (_error) {
    }
  };

  return (
    <>
      {/* 공정위 가이드 안내 섹션 */}
      <div className={styles.info_item_box}>
        <div className={styles.label_box}>
          <div className={styles.label_keyword_box}>
            <span>공정위 가이드</span>
            <button
              className={styles.copy_tag_button}
              onClick={handleGoToGuide}
              type="button"
            >
              이동
            </button>
          </div>
        </div>
        <div className={styles.content_box}>
          <p className={selectedCampaignStyles.info_text}>
            좌측 이동 버튼을 통해 가이드를 참고하여 콘텐츠 작성하실 때 첫
            부분에 공정위 문구 혹은 이미지를 먼저 삽입해 주시고 작성해
            주세요.
          </p>
        </div>
      </div>

      {/* 캠페인 문의 섹션 */}
      <div className={styles.info_item_box}>
        <div className={styles.label_box}>
          <div className={styles.label_keyword_box}>
            <span>캠페인 문의</span>
            <button
              className={styles.copy_tag_button}
              onClick={handleCopyContact}
              type="button"
            >
              복사
            </button>
          </div>
        </div>
        <div className={styles.content_box}>
          {/* 문의 담당자 연락처 */}
          <div className={selectedCampaignStyles.contact_number_box}>
            <span className={selectedCampaignStyles.contact_number}>
              {contactNumber}
            </span>
          </div>
        </div>
      </div>

    </>
  );
}
