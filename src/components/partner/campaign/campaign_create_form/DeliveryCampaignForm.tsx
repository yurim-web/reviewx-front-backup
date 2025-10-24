/* ========================================
   📦 배송형 캠페인 생성 폼 컴포넌트
   ======================================== */

/**
 * 배송형 캠페인 생성 폼 컴포넌트
 *
 * 목적: 배송형 캠페인 등록을 위한 전용 폼 컴포넌트
 *
 * 주요 기능:
 * - 배송형 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 배송형 캠페인 상세 정보 입력
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
// 분리된 CSS 모듈들 import
import headerStyles from "@/styles/partner/campaign_create/campaign_header.module.css";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";
import guideStyles from "@/styles/partner/campaign_create/campaign_guide.module.css";
import styles from "@/styles/partner/campaign_create/campaign_create.module.css";

// 공통 컴포넌트들 import
import {
  CampaignTypeSelector,
  CustomDropdown,
  platforms,
  categories,
} from "./common/CampaignFormCommon";
import NoticeSection from "./common/NoticeSection";

export default function DeliveryCampaignForm({
  onSubmit,
  isSubmitting,
}: Omit<CampaignCreateFormBaseProps, "campaignType">) {
  const router = useRouter();
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignType: "배송형",
    platform: "네이버 블로그",
    title: "",
    category: "",
    brandName: "",
    providedItems: "",
    promotionLink: "",
    currentPoints: "",
    additionalPoints: "",
    recruitmentCount: "",
    recruitmentPeriod: "",
    announcementDate: "",
    registrationPeriod: "",
    keywords: "",
    adultOnly: false,
    allowReParticipation: false,
    allowLateSubmission: false,
    minTextLength: "",
    minImageCount: "",
    videoCount: "",
    videoDuration: "",
    requireLinkAttachment: false,
    requireKeywordAttachment: false,
    guidelines: "",
    isUrgent: false,
  });

  // 이미지 업로드 관련 state
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // 체크박스 상태 관리
  const [checkboxStates, setCheckboxStates] = useState({
    minTextLength: false,
    minImageCount: false,
    videoCount: false,
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
   * 체크박스 상태 업데이트
   */
  const updateCheckboxState = (
    field: keyof typeof checkboxStates,
    checked: boolean
  ) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  /**
   * 이미지 파일 선택 처리
   */
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((file) => {
      // 이미지 파일 타입 검증
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return false;
      }
      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // 기존 이미지와 새 이미지 합치기 (최대 7개 제한)
    const totalImages = uploadedImages.length + validFiles.length;
    if (totalImages > 7) {
      alert("최대 7개의 이미지만 업로드 가능합니다.");
      return;
    }

    setUploadedImages((prev) => [...prev, ...validFiles]);

    // 이미지 미리보기 생성
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  /**
   * 이미지 제거 처리
   */
  const handleImageRemove = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * 이미지 업로드 버튼 클릭 처리
   */
  const handleUploadClick = () => {
    const input = document.getElementById("image-upload") as HTMLInputElement;
    input?.click();
  };

  /**
   * 캠페인 유형 변경 시 페이지 이동
   */
  const handleCampaignTypeChange = (type: string) => {
    if (type === "배송형") return; // 현재 타입과 같으면 이동하지 않음

    // 캠페인 유형에 따른 페이지 경로 매핑
    const typeRoutes: Record<string, string> = {
      방문형: "/partner/campaign/create/visit",
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
    <form onSubmit={handleSubmit} className={infoStyles.campaign_form}>
      {/* 캠페인 정보 섹션 */}
      <section className={styles.section}>
        <h2 className={styles.section_title}>캠페인 정보</h2>

        {/* 캠페인 유형 선택 */}
        <CampaignTypeSelector
          currentType="배송형"
          onTypeChange={handleCampaignTypeChange}
        />

        {/* 플랫폼 선택 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            등록 플랫폼<span className={infoStyles.required}>*</span>
          </label>
          <CustomDropdown
            value={formData.platform}
            options={platforms}
            onChange={(value) => updateFormData("platform", value)}
            placeholder="플랫폼을 선택하세요"
          />
        </article>

        {/* 이미지 업로드 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            썸네일/상세 이미지<span className={infoStyles.required}>*</span>
          </label>
          <div className={infoStyles.image_upload_area}>
            {/* 업로드된 이미지 미리보기 */}
            {imagePreviews.map((preview, index) => (
              <div key={index} className={infoStyles.image_preview_container}>
                <img
                  src={preview}
                  alt={`업로드된 이미지 ${index + 1}`}
                  className={infoStyles.image_preview}
                />
                <button
                  type="button"
                  className={infoStyles.image_remove_button}
                  onClick={() => handleImageRemove(index)}
                  aria-label="이미지 제거"
                >
                  ×
                </button>
              </div>
            ))}

            {/* 이미지 업로드 버튼 (최대 7개까지) */}
            {uploadedImages.length < 7 && (
              <div
                className={infoStyles.image_upload_placeholder}
                onClick={handleUploadClick}
              >
                <img
                  src="/images/icons/plus_icon.svg"
                  alt="이미지 추가"
                  width="56"
                  height="56"
                />
              </div>
            )}
          </div>

          {/* 숨겨진 파일 입력 */}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={{ display: "none" }}
          />
        </article>

        {/* 캠페인 제목 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            캠페인 제목<span className={infoStyles.required}>*</span>
          </label>
          <input
            type="text"
            className={infoStyles.form_input}
            value={formData.title}
            onChange={(e) => updateFormData("title", e.target.value)}
            placeholder="지역, 브랜드, 제공하는 서비스/제품 등"
          />
        </article>

        {/* 카테고리 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            카테고리<span className={infoStyles.required}>*</span>
          </label>
          <CustomDropdown
            value={formData.category}
            options={categories}
            onChange={(value) => updateFormData("category", value)}
            placeholder="카테고리를 선택"
          />
        </article>

        {/* 브랜드명 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            브랜드명<span className={infoStyles.required}>*</span>
          </label>
          <input
            type="text"
            className={infoStyles.form_input}
            value={formData.brandName}
            readOnly
          />
        </article>

        {/* 제공 내역 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            제공 내역<span className={infoStyles.required}>*</span>
          </label>
          <input
            type="text"
            className={infoStyles.form_input}
            value={formData.providedItems}
            onChange={(e) => updateFormData("providedItems", e.target.value)}
            placeholder="제공하는 서비스/제품/포인트 등 한줄 설명"
          />
        </article>

        {/* 홍보 링크 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>홍보 링크</label>
          <input
            type="url"
            className={infoStyles.form_input}
            value={formData.promotionLink}
            onChange={(e) => updateFormData("promotionLink", e.target.value)}
            placeholder="캠페인 홍보 링크"
          />
        </article>

        {/* 보유 포인트 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>보유 포인트</label>
          <div className={infoStyles.points_input_group}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                className={infoStyles.form_input}
                value={formData.currentPoints}
                readOnly
              />
              <span className={infoStyles.points_unit}>P</span>
            </div>
            <button type="button" className={infoStyles.charge_button}>
              포인트 충전하기
            </button>
          </div>
        </article>

        {/* 추가 지급 포인트 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>추가 지급 포인트</label>
          <div className={infoStyles.points_input_group}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                className={infoStyles.form_input}
                value={formData.additionalPoints}
                onChange={(e) =>
                  updateFormData(
                    "additionalPoints",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="캠페인 수행에 대한 추가 지급 포인트"
              />
              <span className={infoStyles.points_unit}>P</span>
            </div>
          </div>
        </article>

        {/* 모집 인원 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            모집 인원<span className={infoStyles.required}>*</span>
          </label>
          <div className={infoStyles.count_input_group}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="number"
                className={infoStyles.form_input}
                value={formData.recruitmentCount}
                onChange={(e) =>
                  updateFormData("recruitmentCount", e.target.value)
                }
                placeholder="0"
                min="0"
              />
              <span className={infoStyles.count_unit}>명</span>
            </div>
          </div>
        </article>

        {/* 모집 기간 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            모집 기간<span className={infoStyles.required}>*</span>
          </label>
          <input
            type="text"
            className={infoStyles.form_input}
            value={formData.recruitmentPeriod}
            onChange={(e) =>
              updateFormData("recruitmentPeriod", e.target.value)
            }
            placeholder=""
          />
        </article>

        {/* 선정 날짜 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            선정 날짜<span className={infoStyles.required}>*</span>
          </label>
          <input
            type="text"
            className={infoStyles.form_input}
            value={formData.announcementDate}
            onChange={(e) => updateFormData("announcementDate", e.target.value)}
            placeholder=""
          />
        </article>

        {/* 등록 기간 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            등록 기간<span className={infoStyles.required}>*</span>
          </label>
          <input
            type="text"
            className={infoStyles.form_input}
            value={formData.registrationPeriod}
            onChange={(e) =>
              updateFormData("registrationPeriod", e.target.value)
            }
            placeholder=""
          />
        </article>
      </section>

      {/* 캠페인 안내 섹션 */}
      <section className={styles.section}>
        <h2 className={styles.section_title}>캠페인 안내</h2>

        {/* 키워드 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            키워드<span className={infoStyles.required}>*</span>
          </label>
          <input
            type="text"
            className={infoStyles.form_input}
            value={formData.keywords}
            onChange={(e) => updateFormData("keywords", e.target.value)}
            placeholder="최대 10개 입력 가능"
          />
        </article>

        {/* 간편 안내 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>간편 안내</label>

          {/* 글자 수 */}
          <div className={guideStyles.option_input_box}>
            <input
              type="checkbox"
              id="minTextLength"
              checked={checkboxStates.minTextLength}
              onChange={(e) => {
                updateCheckboxState("minTextLength", e.target.checked);
                if (!e.target.checked) {
                  updateFormData("minTextLength", "");
                }
              }}
            />
            <label htmlFor="minTextLength" className={guideStyles.option_label}>
              글자 수
            </label>
            <div className={guideStyles.option_input_value}>
              <input
                type="number"
                className={guideStyles.underline_input}
                value={formData.minTextLength}
                onChange={(e) =>
                  updateFormData("minTextLength", e.target.value)
                }
                min="0"
              />
              <span className={guideStyles.unit_text}>자 이상</span>
            </div>
          </div>

          {/* 이미지 장수 */}
          <div className={guideStyles.option_input_box}>
            <input
              type="checkbox"
              id="minImageCount"
              checked={checkboxStates.minImageCount}
              onChange={(e) => {
                updateCheckboxState("minImageCount", e.target.checked);
                if (!e.target.checked) {
                  updateFormData("minImageCount", "");
                }
              }}
            />
            <label htmlFor="minImageCount" className={guideStyles.option_label}>
              이미지 장수
            </label>
            <div className={guideStyles.option_input_value}>
              <input
                type="number"
                className={guideStyles.underline_input}
                value={formData.minImageCount}
                onChange={(e) =>
                  updateFormData("minImageCount", e.target.value)
                }
                min="0"
              />
              <span className={guideStyles.unit_text}>장 이상</span>
            </div>
          </div>

          {/* 동영상 개수, 초수 */}
          <div className={guideStyles.option_input_box}>
            <input
              type="checkbox"
              id="videoCount"
              checked={checkboxStates.videoCount}
              onChange={(e) => {
                updateCheckboxState("videoCount", e.target.checked);
                if (!e.target.checked) {
                  updateFormData("videoCount", "");
                  updateFormData("videoDuration", "");
                }
              }}
            />
            <label htmlFor="videoCount" className={guideStyles.option_label}>
              동영상 개수, 초수
            </label>
            <div className={guideStyles.option_input_value}></div>
          </div>

          {/* 본문 링크 첨부 */}
          <div className={guideStyles.option_input_box}>
            <input
              type="checkbox"
              id="requireLinkAttachment"
              checked={formData.requireLinkAttachment}
              onChange={(e) =>
                updateFormData("requireLinkAttachment", e.target.checked)
              }
            />
            <label
              htmlFor="requireLinkAttachment"
              className={guideStyles.option_label}
            >
              본문 링크 첨부
            </label>
            <span className={guideStyles.option_value}></span>
          </div>

          {/* 본문 키워드/태그 첨부 */}
          <div className={guideStyles.option_input_box}>
            <input
              type="checkbox"
              id="requireKeywordAttachment"
              checked={formData.requireKeywordAttachment}
              onChange={(e) =>
                updateFormData("requireKeywordAttachment", e.target.checked)
              }
            />
            <label
              htmlFor="requireKeywordAttachment"
              className={guideStyles.option_label}
            >
              본문 키워드/태그 첨부
            </label>
            <span className={guideStyles.option_value}></span>
          </div>
        </article>

        {/* 참여/제출 옵션 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            참여/제출 옵션<span className={infoStyles.required}>*</span>
          </label>

          {/* 만 19세 이상 참여 허용 */}
          <div className={guideStyles.option_input_box}>
            <input
              type="checkbox"
              id="adultOnly"
              checked={formData.adultOnly}
              onChange={(e) => updateFormData("adultOnly", e.target.checked)}
            />
            <label htmlFor="adultOnly" className={guideStyles.option_label}>
              만 19세 이상 참여 허용 (성인인증이 필요한 제품/서비스)
            </label>
            <div className={guideStyles.option_input_value}></div>
          </div>

          {/* 이전 참여자 재참여 허용 */}
          <div className={guideStyles.option_input_box}>
            <input
              type="checkbox"
              id="allowReParticipation"
              checked={formData.allowReParticipation}
              onChange={(e) =>
                updateFormData("allowReParticipation", e.target.checked)
              }
            />
            <label
              htmlFor="allowReParticipation"
              className={guideStyles.option_label}
            >
              이전 참여자 재참여 허용
            </label>
            <div className={guideStyles.option_input_value}></div>
          </div>

          {/* 지각 제출 허용 */}
          <div className={guideStyles.option_input_box}>
            <input
              type="checkbox"
              id="allowLateSubmission"
              checked={formData.allowLateSubmission}
              onChange={(e) =>
                updateFormData("allowLateSubmission", e.target.checked)
              }
            />
            <label
              htmlFor="allowLateSubmission"
              className={guideStyles.option_label}
            >
              지각 제출 허용
            </label>
            <div className={guideStyles.option_input_value}></div>
          </div>
        </article>

        {/* 안내 사항 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            안내 사항<span className={infoStyles.required}>*</span>
          </label>
          <textarea
            className={guideStyles.fixed_height_textarea}
            value={formData.guidelines}
            onChange={(e) => updateFormData("guidelines", e.target.value)}
            placeholder="캠페인 전체 안내 사항, 미션, 기타 참고 사항 등"
          />
        </article>

        {/* 유의 사항 */}
        <NoticeSection />
      </section>

      {/* 등록하기 버튼 */}
      <div className={guideStyles.submit_button_container}>
        <button
          type="submit"
          className={guideStyles.submit_button}
          disabled={isSubmitting}
        >
          {isSubmitting ? "등록 중..." : "등록하기"}
        </button>
      </div>
    </form>
  );
}
