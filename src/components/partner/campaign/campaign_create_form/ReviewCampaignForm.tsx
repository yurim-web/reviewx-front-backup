/* ========================================
   🛒 구매평 캠페인 생성 폼 컴포넌트
   ======================================== */

/**
 * 구매평 캠페인 생성 폼 컴포넌트
 *
 * 목적: 구매평 캠페인 등록을 위한 전용 폼 컴포넌트
 *
 * 주요 기능:
 * - 구매평 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 구매평 캠페인 상세 정보 입력
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CampaignFormData,
  CampaignCreateFormBaseProps,
} from "@/types/campaign";
import styles from "@/styles/partner/campaign_create/campaign_create.module.css";

// 공통 컴포넌트들 import
import {
  CampaignTypeSelector,
  PlatformSelector,
  ImageUpload,
  BasicInfo,
  PointsSection,
  RecruitmentInfo,
  ParticipationOptions,
  Guidelines,
  NoticeSection,
} from "./common/CampaignFormCommon";

export default function ReviewCampaignForm({
  onSubmit,
  isSubmitting,
}: Omit<CampaignCreateFormBaseProps, "campaignType">) {
  const router = useRouter();
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignType: "구매평",
    platform: "네이버 블로그",
    title: "",
    category: "",
    brandName: "",
    providedItems: "",
    promotionLink: "",
    currentPoints: 0,
    additionalPoints: 0,
    recruitmentCount: 1,
    recruitmentPeriod: "",
    announcementDate: "",
    registrationPeriod: "",
    keywords: "",
    adultOnly: false,
    allowReParticipation: false,
    allowLateSubmission: false,
    minTextLength: 0,
    minImageCount: 0,
    videoCount: 0,
    videoDuration: 0,
    requireLinkAttachment: false,
    requireKeywordAttachment: false,
    guidelines: "",
    isUrgent: false,
  });

  /**
   * 폼 데이터 업데이트
   */
  const updateFormData = (field: keyof CampaignFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * 캠페인 유형 변경 시 페이지 이동
   */
  const handleCampaignTypeChange = (type: string) => {
    if (type === "구매평") return; // 현재 타입과 같으면 이동하지 않음

    // 캠페인 유형에 따른 페이지 경로 매핑
    const typeRoutes: Record<string, string> = {
      배송형: "/partner/campaign/create/delivery",
      방문형: "/partner/campaign/create/visit",
      기자단: "/partner/campaign/create/reporter",
      미션형: "/partner/campaign/create/mission",
    };

    router.push(typeRoutes[type]);
  };

  /**
   * 폼 제출 처리
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.campaign_form}>
      {/* 캠페인 정보 섹션 */}
      <section className={styles.section}>
        <h2 className={styles.section_title}>캠페인 정보</h2>

        {/* 캠페인 유형 선택 */}
        <CampaignTypeSelector
          currentType="구매평"
          onTypeChange={handleCampaignTypeChange}
        />

        {/* 플랫폼 선택 */}
        <PlatformSelector
          value={formData.platform}
          onChange={(platform) => updateFormData("platform", platform)}
        />

        {/* 이미지 업로드 */}
        <ImageUpload />

        {/* 기본 정보 */}
        <BasicInfo formData={formData} onUpdate={updateFormData} />

        {/* 홍보 링크 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>홍보 링크</label>
          <input
            type="url"
            className={styles.form_input}
            value={formData.promotionLink}
            onChange={(e) => updateFormData("promotionLink", e.target.value)}
            placeholder="링크를 입력하세요"
          />
        </article>

        {/* 포인트 관련 */}
        <PointsSection formData={formData} onUpdate={updateFormData} />

        {/* 모집 정보 */}
        <RecruitmentInfo formData={formData} onUpdate={updateFormData} />
      </section>

      {/* 캠페인 안내 섹션 */}
      <section className={styles.section}>
        <h2 className={styles.section_title}>캠페인 안내</h2>

        {/* 안내 사항 */}
        <Guidelines formData={formData} onUpdate={updateFormData} />

        {/* 참여/제출 옵션 */}
        <ParticipationOptions formData={formData} onUpdate={updateFormData} />

        {/* 유의 사항 */}
        <NoticeSection />
      </section>

      {/* 등록하기 버튼 */}
      <div className={styles.submit_button_container}>
        <button
          type="submit"
          className={styles.submit_button}
          disabled={isSubmitting}
        >
          {isSubmitting ? "등록 중..." : "등록하기"}
        </button>
      </div>
    </form>
  );
}
