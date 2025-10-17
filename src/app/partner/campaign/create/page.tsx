/* ========================================
   🆕 파트너 새 캠페인 등록 페이지
   ======================================== */

/**
 * 파트너 새 캠페인 등록 페이지
 *
 * 목적: 파트너가 새로운 캠페인을 등록하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/create
 *
 * 주요 기능:
 * - 캠페인 기본 정보 입력 (제목, 유형, 플랫폼)
 * - 썸네일/상세 이미지 업로드
 * - 캠페인 상세 정보 입력 (모집 인원, 기간 등)
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 * - 캠페인 등록 처리
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CampaignCreateForm from "@/components/partner/campaign/CampaignCreateForm";
import campaignCreateStyles from "@/styles/partner/campaign_create.module.css";
import layoutStyles from "../../../../styles/partner/layout.module.css";

export default function PartnerCampaignCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 캠페인 등록 처리
   */
  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // TODO: API 호출로 캠페인 등록
      console.log("캠페인 등록 데이터:", formData);

      // 등록 성공 시 캠페인 관리 페이지로 이동
      router.push("/partner");
    } catch (error) {
      console.error("캠페인 등록 실패:", error);
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
        </div>

        {/* 캠페인 등록 폼 */}
        <CampaignCreateForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

