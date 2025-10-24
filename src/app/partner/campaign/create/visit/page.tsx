/* ========================================
   📍 방문형 캠페인 생성 페이지
   ======================================== */

/**
 * 방문형 캠페인 생성 페이지
 *
 * 목적: 파트너가 방문형 캠페인을 등록하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/create/visit
 *
 * 주요 기능:
 * - 방문형 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 방문형 캠페인 상세 정보 입력 (지역, 방문 주소 등)
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 * - 방문형 캠페인 등록 처리
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VisitCampaignForm from "@/components/partner/campaign/campaign_create_form/VisitCampaignForm";
import { CampaignFormData } from "@/types/campaign";
// 분리된 CSS 모듈들 import
import layoutStyles from "../../../../../styles/partner/layout.module.css";
import PageHeader from "@/components/partner/campaign/campaign_create_form/common/PageHeader";

export default function VisitCampaignCreatePage() {
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

      // TODO: API 호출로 방문형 캠페인 등록
      console.log("방문형 캠페인 등록 데이터:", finalFormData);

      // 등록 성공 시 캠페인 관리 페이지로 이동
      router.push("/partner");
    } catch (error) {
      console.error("방문형 캠페인 등록 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 페이지 헤더 */}
        <PageHeader
          title="새 캠페인 등록"
          onUrgentChange={setIsUrgent}
          initialUrgent={isUrgent}
        />

        {/* 방문형 캠페인 등록 폼 */}
        <VisitCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
