/* ========================================
   📝 캠페인 등록 폼 컴포넌트
   ======================================== */

/**
 * 캠페인 등록 폼 컴포넌트
 *
 * 목적: 파트너가 새 캠페인을 등록하기 위한 폼 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /partner/campaign/create (파트너 새 캠페인 등록 페이지)
 *
 * 주요 기능:
 * - 캠페인 기본 정보 입력 폼
 * - 이미지 업로드 기능
 * - 참여/제출 옵션 설정
 * - 폼 유효성 검사
 * - 등록 처리
 */

"use client";

import { useState } from "react";
import styles from "../../../styles/partner/campaign_create/campaign_create.module.css";

interface CampaignCreateFormProps {
  onSubmit: (formData: CampaignFormData) => void;
  isSubmitting: boolean;
}

interface CampaignFormData {
  // 캠페인 기본 정보
  campaignType: "배송형" | "방문형" | "구매평" | "기자단" | "미션형";
  platform: string;
  title: string;
  category: string;
  thumbnailImages: File[];

  // 브랜드 정보
  brandName: string;
  productInfo: string;

  // 캠페인 상세 정보
  promotionLink: string;
  currentPoints: number;
  additionalPoints: number;
  recruitCount: number;
  recruitPeriod: string;
  selectionDate: string;
  registrationPeriod: string;
  keywords: string;
  simpleGuide: string;

  // 참여/제출 옵션
  participationOptions: {
    wordCount: number;
    imageCount: number;
    videoCount: number;
    videoDuration: number;
    linkAttachment: boolean;
    keywordAttachment: boolean;
  };
  ageRestriction: boolean;
  allowReParticipation: boolean;
  allowLateSubmission: boolean;

  // 안내 사항
  notice: string;

  // 긴급 여부
  isUrgent: boolean;
}

export default function CampaignCreateForm({
  onSubmit,
  isSubmitting,
}: CampaignCreateFormProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignType: "배송형",
    platform: "",
    title: "",
    category: "",
    thumbnailImages: [],
    brandName: "",
    productInfo: "",
    promotionLink: "",
    currentPoints: 0,
    additionalPoints: 0,
    recruitCount: 0,
    recruitPeriod: "",
    selectionDate: "",
    registrationPeriod: "",
    keywords: "",
    simpleGuide: "",
    participationOptions: {
      wordCount: 0,
      imageCount: 0,
      videoCount: 0,
      videoDuration: 0,
      linkAttachment: false,
      keywordAttachment: false,
    },
    ageRestriction: false,
    allowReParticipation: false,
    allowLateSubmission: false,
    notice: "",
    isUrgent: false,
  });

  /**
   * 입력 필드 변경 처리
   */
  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * 참여 옵션 변경 처리
   */
  const handleParticipationOptionChange = (
    option: keyof CampaignFormData["participationOptions"],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      participationOptions: {
        ...prev.participationOptions,
        [option]: value,
      },
    }));
  };

  /**
   * 체크박스 변경 처리
   */
  const handleCheckboxChange = (field: keyof CampaignFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  /**
   * 이미지 업로드 처리
   */
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({
      ...prev,
      thumbnailImages: [...prev.thumbnailImages, ...files],
    }));
  };

  /**
   * 폼 제출 처리
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.campaign_create_form} onSubmit={handleSubmit}>
      {/* 캠페인 정보 섹션 */}
      <section className={styles.form_section}>
        <h2 className={styles.section_title}>캠페인 정보</h2>

        {/* 캠페인 유형 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            캠페인 유형<span className={styles.required}>*</span>
          </label>
          <div className={styles.campaign_type_buttons}>
            {["배송형", "방문형", "구매평", "기자단", "미션형"].map((type) => (
              <button
                key={type}
                type="button"
                className={`${styles.type_button} ${
                  formData.campaignType === type
                    ? styles.type_button_active
                    : ""
                }`}
                onClick={() => handleInputChange("campaignType", type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 등록 플랫폼 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            등록 플랫폼<span className={styles.required}>*</span>
          </label>
          <select
            className={styles.form_input}
            value={formData.platform}
            onChange={(e) => handleInputChange("platform", e.target.value)}
            required
          >
            <option value="">플랫폼을 선택하세요</option>
            <option value="네이버블로그">네이버 블로그</option>
            <option value="인스타그램">인스타그램</option>
            <option value="유튜브">유튜브</option>
            <option value="틱톡">틱톡</option>
          </select>
        </div>

        {/* 썸네일/상세 이미지 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            썸네일/상세 이미지<span className={styles.required}>*</span>
          </label>
          <div className={styles.image_upload_area}>
            <div className={styles.image_preview}>
              {formData.thumbnailImages.length > 0 ? (
                formData.thumbnailImages.map((file, index) => (
                  <div key={index} className={styles.image_item}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`썸네일 ${index + 1}`}
                      className={styles.uploaded_image}
                    />
                  </div>
                ))
              ) : (
                <div className={styles.image_placeholder}>
                  <img
                    src="/images/campaign_detail/detail_icon.svg"
                    alt="이미지 업로드"
                    className={styles.upload_icon}
                  />
                </div>
              )}
            </div>
            <button
              type="button"
              className={styles.add_image_button}
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <img
                src="/images/campaign_detail/detail_icon.svg"
                alt="이미지 추가"
                width={24}
                height={24}
              />
            </button>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.hidden_input}
            />
          </div>
        </div>

        {/* 캠페인 제목 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            캠페인 제목<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="캠페인 제목을 입력하세요"
            required
          />
        </div>

        {/* 카테고리 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            카테고리<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            placeholder="카테고리를 입력하세요"
            required
          />
        </div>
      </section>

      {/* 브랜드 정보 섹션 */}
      <section className={styles.form_section}>
        <h2 className={styles.section_title}>브랜드 정보</h2>

        {/* 브랜드명 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            브랜드명<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.brandName}
            onChange={(e) => handleInputChange("brandName", e.target.value)}
            placeholder="브랜드명을 입력하세요"
            required
          />
        </div>

        {/* 제공 내역 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            제공 내역<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.productInfo}
            onChange={(e) => handleInputChange("productInfo", e.target.value)}
            placeholder="제공 내역을 입력하세요"
            required
          />
        </div>
      </section>

      {/* 캠페인 상세 정보 섹션 */}
      <section className={styles.form_section}>
        <h2 className={styles.section_title}>캠페인 상세 정보</h2>

        {/* 홍보 링크 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>홍보 링크</label>
          <input
            type="url"
            className={styles.form_input}
            value={formData.promotionLink}
            onChange={(e) => handleInputChange("promotionLink", e.target.value)}
            placeholder="홍보 링크를 입력하세요"
          />
        </div>

        {/* 보유 포인트 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>보유 포인트</label>
          <input
            type="number"
            className={styles.form_input}
            value={formData.currentPoints}
            onChange={(e) =>
              handleInputChange("currentPoints", Number(e.target.value))
            }
            placeholder="보유 포인트를 입력하세요"
          />
          <span className={styles.unit}>P</span>
        </div>

        {/* 추가 지급 포인트 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>추가 지급 포인트</label>
          <input
            type="number"
            className={styles.form_input}
            value={formData.additionalPoints}
            onChange={(e) =>
              handleInputChange("additionalPoints", Number(e.target.value))
            }
            placeholder="추가 지급 포인트를 입력하세요"
          />
          <span className={styles.unit}>P</span>
        </div>

        {/* 모집 인원 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            모집 인원<span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            className={styles.form_input}
            value={formData.recruitCount}
            onChange={(e) =>
              handleInputChange("recruitCount", Number(e.target.value))
            }
            placeholder="모집 인원을 입력하세요"
            required
          />
          <span className={styles.unit}>명</span>
        </div>

        {/* 모집 기간 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            모집 기간<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.recruitPeriod}
            onChange={(e) => handleInputChange("recruitPeriod", e.target.value)}
            placeholder="예: 2025-09-30 ~ 2025-10-06"
            required
          />
        </div>

        {/* 선정 날짜 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            선정 날짜<span className={styles.required}>*</span>
          </label>
          <input
            type="date"
            className={styles.form_input}
            value={formData.selectionDate}
            onChange={(e) => handleInputChange("selectionDate", e.target.value)}
            required
          />
        </div>

        {/* 등록 기간 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            등록 기간<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.registrationPeriod}
            onChange={(e) =>
              handleInputChange("registrationPeriod", e.target.value)
            }
            placeholder="예: 2025-10-08 ~ 2025-10-19"
            required
          />
        </div>
      </section>

      {/* 캠페인 안내 섹션 */}
      <section className={styles.form_section}>
        <h2 className={styles.section_title}>캠페인 안내</h2>

        {/* 키워드 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            키워드<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.keywords}
            onChange={(e) => handleInputChange("keywords", e.target.value)}
            placeholder="예: #멜킨마사지 #마사지기 #공기압마사지기 #협찬"
            required
          />
        </div>

        {/* 간편 안내 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>간편 안내</label>
          <input
            type="text"
            className={styles.form_input}
            value={formData.simpleGuide}
            onChange={(e) => handleInputChange("simpleGuide", e.target.value)}
            placeholder="간편 안내를 입력하세요"
          />
        </div>

        {/* 참여/제출 옵션 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            참여/제출 옵션<span className={styles.required}>*</span>
          </label>

          {/* 글자 수 */}
          <div className={styles.participation_option}>
            <label className={styles.option_label}>글자 수</label>
            <input
              type="number"
              className={styles.option_input}
              value={formData.participationOptions.wordCount}
              onChange={(e) =>
                handleParticipationOptionChange(
                  "wordCount",
                  Number(e.target.value)
                )
              }
              placeholder="0"
            />
            <span className={styles.option_unit}>자 이상</span>
          </div>

          {/* 이미지 장수 */}
          <div className={styles.participation_option}>
            <label className={styles.option_label}>이미지 장수</label>
            <input
              type="number"
              className={styles.option_input}
              value={formData.participationOptions.imageCount}
              onChange={(e) =>
                handleParticipationOptionChange(
                  "imageCount",
                  Number(e.target.value)
                )
              }
              placeholder="0"
            />
            <span className={styles.option_unit}>장 이상</span>
          </div>

          {/* 동영상 개수, 초수 */}
          <div className={styles.participation_option}>
            <label className={styles.option_label}>동영상 개수, 초수</label>
            <input
              type="number"
              className={styles.option_input}
              value={formData.participationOptions.videoCount}
              onChange={(e) =>
                handleParticipationOptionChange(
                  "videoCount",
                  Number(e.target.value)
                )
              }
              placeholder="0"
            />
            <span className={styles.option_unit}>개</span>
          </div>

          {/* 본문 링크 첨부 */}
          <div className={styles.checkbox_option}>
            <input
              type="checkbox"
              id="linkAttachment"
              checked={formData.participationOptions.linkAttachment}
              onChange={(e) =>
                handleParticipationOptionChange(
                  "linkAttachment",
                  e.target.checked
                )
              }
            />
            <label htmlFor="linkAttachment">본문 링크 첨부</label>
          </div>

          {/* 본문 키워드/태그 첨부 */}
          <div className={styles.checkbox_option}>
            <input
              type="checkbox"
              id="keywordAttachment"
              checked={formData.participationOptions.keywordAttachment}
              onChange={(e) =>
                handleParticipationOptionChange(
                  "keywordAttachment",
                  e.target.checked
                )
              }
            />
            <label htmlFor="keywordAttachment">본문 키워드/태그 첨부</label>
          </div>

          {/* 만 19세 이상 참여 허용 */}
          <div className={styles.checkbox_option}>
            <input
              type="checkbox"
              id="ageRestriction"
              checked={formData.ageRestriction}
              onChange={() => handleCheckboxChange("ageRestriction")}
            />
            <label htmlFor="ageRestriction">
              만 19세 이상 참여 허용 (성인인증이 필요한 제품/서비스)
            </label>
          </div>

          {/* 이전 참여자 재참여 허용 */}
          <div className={styles.checkbox_option}>
            <input
              type="checkbox"
              id="allowReParticipation"
              checked={formData.allowReParticipation}
              onChange={() => handleCheckboxChange("allowReParticipation")}
            />
            <label htmlFor="allowReParticipation">
              이전 참여자 재참여 허용
            </label>
          </div>

          {/* 지각 제출 허용 */}
          <div className={styles.checkbox_option}>
            <input
              type="checkbox"
              id="allowLateSubmission"
              checked={formData.allowLateSubmission}
              onChange={() => handleCheckboxChange("allowLateSubmission")}
            />
            <label htmlFor="allowLateSubmission">지각 제출 허용</label>
          </div>
        </div>

        {/* 안내 사항 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>
            안내 사항<span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.form_textarea}
            value={formData.notice}
            onChange={(e) => handleInputChange("notice", e.target.value)}
            placeholder="안내 사항을 입력하세요"
            rows={10}
            required
          />
        </div>

        {/* 유의 사항 */}
        <div className={styles.form_group}>
          <label className={styles.form_label}>유의 사항</label>
          <div className={styles.notice_content}>
            <ul>
              <li>
                선정된 캠페인은 타인에게 양도 · 판매 · 교환이 불가합니다. 적발
                시{" "}
                <strong>
                  제품/서비스 정가 및 배송비가 청구되며, 영구 차단
                </strong>
                될 수 있습니다.
              </li>
              <li>
                허위 · 과장 · 비방 · 타사 비교 등 소비자를 오인시킬 수 있는
                표현은 금지됩니다.
              </li>
              <li>선정 후 제공 내역 및 배송지/방문지 변경은 불가합니다.</li>
              <li>당첨 후 취소 시 패널티가 발생합니다.</li>
              <li>
                미션이 제대로 지켜지지 않을 시 수정 요청이 있을 수 있습니다.
              </li>
              <li>
                리뷰는 반드시 해당 제품/서비스 단독으로 촬영 · 작성해야 합니다.
                타 제품/서비스와 함께 업로드 시 재작성 요청이 있을 수 있습니다.
              </li>
              <li>
                리뷰는 반드시 지정된 기간 내 등록해야 합니다. 기간을 초과할 경우
                제공 내역 비용이 청구되거나 패널티가 발생합니다.
              </li>
              <li>
                작성된 콘텐츠는 최소 6개월간 유지해야 하며, 유지하지 않을 경우
                패널티가 발생합니다.
              </li>
              <li>
                생성형 AI로 작성된 콘텐츠 및 이미지는 수정 요청 또는 패널티가
                발생합니다.
              </li>
              <li>
                미션 불이행, 리뷰 미제출, 기한 미준수 시 패널티가 발생합니다.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 등록 버튼 */}
      <div className={styles.submit_section}>
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
