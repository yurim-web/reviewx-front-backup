/* ========================================
   📍 방문형 캠페인 생성 폼 컴포넌트
   ======================================== */

/**
 * 방문형 캠페인 생성 폼 컴포넌트
 *
 * 목적: 방문형 캠페인 등록을 위한 전용 폼 컴포넌트
 *
 * 주요 기능:
 * - 방문형 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 방문형 캠페인 상세 정보 입력 (지역, 방문 주소 등)
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
  regions,
} from "./common/CampaignFormCommon";

export default function VisitCampaignForm({
  onSubmit,
  isSubmitting,
}: Omit<CampaignCreateFormBaseProps, "campaignType">) {
  const router = useRouter();
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignType: "방문형",
    platform: "네이버 블로그",
    title: "",
    category: "",
    region: "",
    brandName: "",
    providedItems: "",
    visitLink: "",
    visitAddress: "",
    addressDetail: "",
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
    if (type === "방문형") return; // 현재 타입과 같으면 이동하지 않음

    // 캠페인 유형에 따른 페이지 경로 매핑
    const typeRoutes: Record<string, string> = {
      배송형: "/partner/campaign/create/delivery",
      구매평: "/partner/campaign/create/review",
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
          currentType="방문형"
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

        {/* 지역 선택 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            지역<span className={styles.required}>*</span>
          </label>
          <select
            className={styles.form_select}
            value={formData.region}
            onChange={(e) => updateFormData("region", e.target.value)}
          >
            <option value="">지역을 선택하세요</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </article>

        {/* 방문 링크 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>방문 링크</label>
          <input
            type="url"
            className={styles.form_input}
            value={formData.visitLink}
            onChange={(e) => updateFormData("visitLink", e.target.value)}
            placeholder="링크를 입력하세요"
          />
        </article>

        {/* 방문 주소 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            방문 주소<span className={styles.required}>*</span>
          </label>
          <div className={styles.address_input_group}>
            <input
              type="text"
              className={styles.form_input}
              value={formData.visitAddress}
              onChange={(e) => updateFormData("visitAddress", e.target.value)}
              placeholder="주소를 입력하세요"
            />
            <button type="button" className={styles.postal_code_button}>
              우편번호 찾기
            </button>
          </div>
        </article>

        {/* 주소 상세 안내 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>주소 상세 안내</label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.addressDetail}
            onChange={(e) => updateFormData("addressDetail", e.target.value)}
            placeholder="상세 주소 안내를 입력하세요"
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
