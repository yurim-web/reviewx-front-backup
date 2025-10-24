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
  regions,
  CustomDropdown,
  platforms,
  categories,
} from "./common/CampaignFormCommon";
import NoticeSection from "./common/NoticeSection";

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
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            등록 플랫폼<span className={styles.required}>*</span>
          </label>
          <CustomDropdown
            value={formData.platform}
            options={platforms}
            onChange={(value) => updateFormData("platform", value)}
            placeholder="플랫폼을 선택하세요"
          />
        </article>

        {/* 이미지 업로드 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            썸네일/상세 이미지<span className={styles.required}>*</span>
          </label>
          <div className={styles.image_upload_area}>
            <div className={styles.image_upload_placeholder}>
              <span>+</span>
            </div>
          </div>
        </article>

        {/* 캠페인 제목 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            캠페인 제목<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.title}
            onChange={(e) => updateFormData("title", e.target.value)}
            placeholder="캠페인 제목을 입력하세요"
          />
        </article>

        {/* 카테고리 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            카테고리<span className={styles.required}>*</span>
          </label>
          <CustomDropdown
            value={formData.category}
            options={categories}
            onChange={(value) => updateFormData("category", value)}
            placeholder="카테고리를 선택하세요"
          />
        </article>

        {/* 브랜드명 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            브랜드명<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.brandName}
            onChange={(e) => updateFormData("brandName", e.target.value)}
            placeholder="브랜드명을 입력하세요"
          />
        </article>

        {/* 제공 내역 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            제공 내역<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.providedItems}
            onChange={(e) => updateFormData("providedItems", e.target.value)}
            placeholder="제공 내역을 입력하세요"
          />
        </article>

        {/* 지역 선택 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            지역<span className={styles.required}>*</span>
          </label>
          <CustomDropdown
            value={formData.region || ""}
            options={regions}
            onChange={(value) => updateFormData("region", value)}
            placeholder="지역을 선택하세요"
          />
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

        {/* 보유 포인트 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>보유 포인트</label>
          <div className={styles.points_input_group}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="number"
                className={styles.form_input}
                value={formData.currentPoints}
                onChange={(e) =>
                  updateFormData("currentPoints", parseInt(e.target.value) || 0)
                }
                placeholder="0"
              />
              <span className={styles.points_unit}>P</span>
            </div>
            <button type="button" className={styles.charge_button}>
              포인트 충전하기
            </button>
          </div>
        </article>

        {/* 추가 지급 포인트 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>추가 지급 포인트</label>
          <div className={styles.points_input_group}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                className={styles.form_input}
                value={formData.additionalPoints}
                onChange={(e) =>
                  updateFormData(
                    "additionalPoints",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="캠페인 수행에 대한 추가 지급 포인트"
              />
              <span className={styles.points_unit}>P</span>
            </div>
          </div>
        </article>

        {/* 모집 인원 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            모집 인원<span className={styles.required}>*</span>
          </label>
          <div className={styles.count_input_group}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="number"
                className={styles.form_input}
                value={formData.recruitmentCount}
                onChange={(e) =>
                  updateFormData(
                    "recruitmentCount",
                    parseInt(e.target.value) || 1
                  )
                }
                min="1"
              />
              <span className={styles.count_unit}>명</span>
            </div>
          </div>
        </article>

        {/* 모집 기간 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            모집 기간<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.recruitmentPeriod}
            onChange={(e) =>
              updateFormData("recruitmentPeriod", e.target.value)
            }
            placeholder="2025-09-30 ~ 2025-10-06"
          />
        </article>

        {/* 선정 날짜 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            선정 날짜<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.announcementDate}
            onChange={(e) => updateFormData("announcementDate", e.target.value)}
            placeholder="2025-10-08"
          />
        </article>

        {/* 등록 기간 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            등록 기간<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.registrationPeriod}
            onChange={(e) =>
              updateFormData("registrationPeriod", e.target.value)
            }
            placeholder="2025-10-08 ~ 2025-10-19"
          />
        </article>

        {/* 키워드 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            키워드<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.keywords}
            onChange={(e) => updateFormData("keywords", e.target.value)}
            placeholder="#키워드 #태그 #입력"
          />
        </article>
      </section>

      {/* 캠페인 안내 섹션 */}
      <section className={styles.section}>
        <h2 className={styles.section_title}>캠페인 안내</h2>

        {/* 간편 안내 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>간편 안내</label>
          <textarea
            className={styles.form_textarea}
            value={formData.guidelines}
            onChange={(e) => updateFormData("guidelines", e.target.value)}
            placeholder="캠페인 안내 사항을 입력하세요"
            rows={10}
          />
        </article>

        {/* 안내 사항 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            안내 사항<span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.form_textarea}
            value={formData.guidelines}
            onChange={(e) => updateFormData("guidelines", e.target.value)}
            placeholder="상세한 안내 사항을 입력하세요"
            rows={10}
          />
        </article>

        {/* 참여/제출 옵션 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            참여/제출 옵션<span className={styles.required}>*</span>
          </label>

          <div className={styles.checkbox_group}>
            <label className={styles.checkbox_label}>
              <input
                type="checkbox"
                checked={formData.adultOnly}
                onChange={(e) => updateFormData("adultOnly", e.target.checked)}
              />
              <span>
                만 19세 이상 참여 허용 (성인인증이 필요한 제품/서비스)
              </span>
            </label>

            <label className={styles.checkbox_label}>
              <input
                type="checkbox"
                checked={formData.allowReParticipation}
                onChange={(e) =>
                  updateFormData("allowReParticipation", e.target.checked)
                }
              />
              <span>이전 참여자 재참여 허용</span>
            </label>

            <label className={styles.checkbox_label}>
              <input
                type="checkbox"
                checked={formData.allowLateSubmission}
                onChange={(e) =>
                  updateFormData("allowLateSubmission", e.target.checked)
                }
              />
              <span>지각 제출 허용</span>
            </label>
          </div>

          {/* 글자 수 */}
          <div className={styles.option_input_group}>
            <label className={styles.option_label}>글자 수</label>
            <div className={styles.number_input_group}>
              <input
                type="number"
                className={styles.number_input}
                value={formData.minTextLength}
                onChange={(e) =>
                  updateFormData("minTextLength", parseInt(e.target.value) || 0)
                }
                min="0"
              />
              <span className={styles.input_unit}>자 이상</span>
            </div>
          </div>

          {/* 이미지 장수 */}
          <div className={styles.option_input_group}>
            <label className={styles.option_label}>이미지 장수</label>
            <div className={styles.number_input_group}>
              <input
                type="number"
                className={styles.number_input}
                value={formData.minImageCount}
                onChange={(e) =>
                  updateFormData("minImageCount", parseInt(e.target.value) || 0)
                }
                min="0"
              />
              <span className={styles.input_unit}>장 이상</span>
            </div>
          </div>

          {/* 동영상 개수, 초수 */}
          <div className={styles.option_input_group}>
            <label className={styles.option_label}>동영상 개수, 초수</label>
            <div className={styles.video_input_group}>
              <input
                type="number"
                className={styles.number_input}
                value={formData.videoCount}
                onChange={(e) =>
                  updateFormData("videoCount", parseInt(e.target.value) || 0)
                }
                min="0"
              />
              <span className={styles.input_unit}>개 이상,</span>
              <input
                type="number"
                className={styles.number_input}
                value={formData.videoDuration}
                onChange={(e) =>
                  updateFormData("videoDuration", parseInt(e.target.value) || 0)
                }
                min="0"
              />
              <span className={styles.input_unit}>초 이상</span>
            </div>
          </div>

          {/* 본문 링크 첨부 */}
          <label className={styles.checkbox_label}>
            <input
              type="checkbox"
              checked={formData.requireLinkAttachment}
              onChange={(e) =>
                updateFormData("requireLinkAttachment", e.target.checked)
              }
            />
            <span>본문 링크 첨부</span>
          </label>

          {/* 본문 키워드/태그 첨부 */}
          <label className={styles.checkbox_label}>
            <input
              type="checkbox"
              checked={formData.requireKeywordAttachment}
              onChange={(e) =>
                updateFormData("requireKeywordAttachment", e.target.checked)
              }
            />
            <span>본문 키워드/태그 첨부</span>
          </label>
        </article>

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
