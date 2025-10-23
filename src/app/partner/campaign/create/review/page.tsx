/* ========================================
   🛒 구매평 캠페인 생성 페이지
   ======================================== */

/**
 * 구매평 캠페인 생성 페이지
 *
 * 목적: 파트너가 구매평 캠페인을 등록하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/create/review
 *
 * 주요 기능:
 * - 구매평 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 구매평 캠페인 상세 정보 입력
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 * - 구매평 캠페인 등록 처리
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewCampaignForm from "@/components/partner/campaign/campaign_create_form/ReviewCampaignForm";
import { CampaignFormData } from "@/types/campaign";
import campaignCreateStyles from "@/styles/partner/campaign_create/campaign_create.module.css";
import layoutStyles from "../../../../../styles/partner/layout.module.css";

export default function ReviewCampaignCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  /**
   * 캠페인 등록 처리
   */
  const handleSubmit = async (formData: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      // 긴급 상태를 폼 데이터에 추가
      const finalFormData = { ...formData, isUrgent };

      // TODO: API 호출로 구매평 캠페인 등록
      console.log("구매평 캠페인 등록 데이터:", finalFormData);

      // 등록 성공 시 캠페인 관리 페이지로 이동
      router.push("/partner");
    } catch (error) {
      console.error("구매평 캠페인 등록 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 페이지 헤더 */}
        <div className={campaignCreateStyles.page_header}>
          <h1 className={campaignCreateStyles.page_title}>새 캠페인 등록</h1>

          {/* 긴급 체크박스 */}
          <div className={campaignCreateStyles.header_urgent_checkbox}>
            <label
              className={`${campaignCreateStyles.checkbox_label} ${
                isUrgent ? campaignCreateStyles.urgent_checked : ""
              }`}
            >
              <span>긴급</span>
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
              />
            </label>
          </div>
        </div>

        {/* 구매평 캠페인 등록 폼 */}
        <ReviewCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
