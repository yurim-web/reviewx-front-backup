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

import { useState, useMemo, useRef } from "react";
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
  regions,
  CustomDropdown,
  platforms,
  categories,
} from "./common/CampaignFormCommon";
import NoticeSection from "./common/NoticeSection";

interface VisitCampaignFormProps
  extends Omit<CampaignCreateFormBaseProps, "campaignType"> {
  /** 캠페인 수정 시 초기 데이터 (선택사항) */
  initialData?: CampaignFormData | null;
  /** 폼 동작 모드: 생성/수정 */
  mode?: "create" | "edit";
}

export default function VisitCampaignForm({
  onSubmit,
  isSubmitting,
  initialData,
  mode = "create",
}: VisitCampaignFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  // 수정 모드에서 편집 가능 필드 정의 (이미지, 제공 내역, 방문 링크, 추가 지급 포인트, 참여/제출 옵션)
  const isEditableField = (field: string): boolean => {
    const editable = new Set([
      "images",
      "providedItems",
      "visitLink",
      "additionalPoints",
      // 참여/제출 옵션 필드들
      "adultOnly",
      "allowReParticipation",
      "allowLateSubmission",
    ]);
    return editable.has(field);
  };
  const [formData, setFormData] = useState<CampaignFormData>(
    initialData || {
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
    }
  );

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
   * 숫자에 쉼표 추가하는 포맷팅 함수
   * 학습 포인트:
   * - replace(/,/g, ''): 기존 쉼표를 모두 제거 (입력 중에 쉼표가 포함된 경우 처리)
   * - /,/g: 정규식에서 g 플래그는 전역 검색을 의미 (모든 쉼표를 찾아서 제거)
   * - Number.isNaN(): 입력값이 숫자가 아닌지 확인
   * - String(): 숫자나 undefined를 문자열로 변환
   */
  const formatNumberWithComma = (
    value: string | number | undefined
  ): string => {
    // undefined나 null이면 빈 문자열 반환
    if (value === undefined || value === null) return "";

    // 문자열로 변환
    const stringValue = String(value);

    // 쉼표 제거 후 숫자만 추출
    const numericValue = stringValue.replace(/,/g, "");

    // 빈 문자열이면 그대로 반환
    if (numericValue === "") return "";

    // 숫자가 아니면 빈 문자열 반환
    if (isNaN(Number(numericValue))) return "";

    // 숫자에 쉼표 추가하여 반환
    return Number(numericValue).toLocaleString("ko-KR");
  };

  /**
   * 숫자 입력 핸들러 (숫자만 입력 가능 + 쉼표 자동 추가)
   * 학습 포인트:
   * - 이 함수는 키 입력 전에 실행되어 특정 키만 허용
   * - 숫자(0-9), 백스페이스, Delete, Tab, 화살표 등 특수키만 허용
   * - Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X 등의 단축키도 허용
   */
  const handleNumericInput = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: keyof CampaignFormData
  ) => {
    // 허용할 키들
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];

    // Ctrl, Cmd 키와 함께 사용되는 키 (복사, 붙여넣기 등)
    const isCtrlKey = e.ctrlKey || e.metaKey;
    const isAllowedKeyWithCtrl = ["a", "c", "v", "x"].includes(
      e.key.toLowerCase()
    );

    // 입력된 키가 숫자인지 확인
    const isNumeric = /^[0-9]$/.test(e.key);

    // 허용된 키가 아니면 입력 방지
    if (
      !isNumeric &&
      !allowedKeys.includes(e.key) &&
      !(isCtrlKey && isAllowedKeyWithCtrl)
    ) {
      e.preventDefault();
    }
  };

  /**
   * 숫자 입력 변경 핸들러 (쉼표 자동 추가)
   * 학습 포인트:
   * - 사용자가 입력한 값을 포맷팅된 형태로 화면에 표시
   * - 실제 데이터는 쉼표 없이 저장
   * - 커서 위치를 보정하여 자연스러운 입력 경험 제공
   */
  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof CampaignFormData
  ) => {
    const inputValue = e.target.value;
    const inputElement = e.target;

    // 기존 커서 위치 저장
    const cursorPosition = inputElement.selectionStart || 0;

    // 쉼표 개수 계산
    const beforeCursor = inputValue.substring(0, cursorPosition);
    const commasBeforeCursor = (beforeCursor.match(/,/g) || []).length;

    // 실제 값 저장 (쉼표 제거)
    const numericValue = inputValue.replace(/,/g, "");

    // 화면에 표시할 값 업데이트
    setFormData((prev) => ({
      ...prev,
      [field]: numericValue, // 실제 저장값은 쉼표 없이
    }));

    // 다음 렌더링 후 커서 위치 복원
    setTimeout(() => {
      const newValue = formatNumberWithComma(numericValue);
      const newCommasBeforeCursor = (
        newValue.substring(0, cursorPosition).match(/,/g) || []
      ).length;
      const cursorOffset = newCommasBeforeCursor - commasBeforeCursor;
      const newCursorPosition = cursorPosition + cursorOffset;

      inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
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
   * 필수 요소 유효성 검사
   * 라벨에 *가 있는 모든 필드를 체크합니다.
   *
   * 학습 포인트:
   * - useMemo: 의존성 배열(formData, uploadedImages)이 변경될 때만 재계산
   * - trim(): 문자열의 앞뒤 공백 제거 (사용자가 스페이스만 입력한 경우 방지)
   * - 논리 연산자(&&): 모든 조건이 true여야 true 반환
   */
  const isFormValid = useMemo(() => {
    if (isEditMode) return true;
    // 이미지가 최소 1개 이상 업로드되었는지 확인
    const hasImages = uploadedImages.length > 0;

    // 필수 텍스트 필드들이 모두 입력되었는지 확인
    // platform은 CustomDropdown에서 기본값이 설정되어 있으므로 별도 체크 불필요
    const hasRequiredFields =
      formData.title.trim() !== "" &&
      formData.category !== "" &&
      formData.region !== "" &&
      formData.providedItems.trim() !== "" &&
      (formData.visitAddress?.trim() ?? "") !== "" &&
      formData.recruitmentCount !== "" &&
      formData.recruitmentPeriod.trim() !== "" &&
      formData.announcementDate.trim() !== "" &&
      formData.registrationPeriod.trim() !== "" &&
      formData.keywords.trim() !== "" &&
      formData.guidelines.trim() !== "";

    const isValid = hasImages && hasRequiredFields;

    // 버튼이 활성화되었을 때 콘솔에 로그 출력
    if (isValid) {
      console.log("필수 입력완료 버튼 활성화");
    }

    // 디버깅: 필드별 상태 확인
    console.log("=== 폼 검증 상태 ===");
    console.log("이미지 업로드:", hasImages, "개수:", uploadedImages.length);
    console.log("제목:", formData.title.trim() !== "" ? "✓" : "✗");
    console.log("카테고리:", formData.category !== "" ? "✓" : "✗");
    console.log("지역:", formData.region !== "" ? "✓" : "✗");
    console.log("제공내역:", formData.providedItems.trim() !== "" ? "✓" : "✗");
    console.log(
      "방문주소:",
      (formData.visitAddress?.trim() ?? "") !== "" ? "✓" : "✗"
    );
    console.log("모집인원:", formData.recruitmentCount !== "" ? "✓" : "✗");
    console.log(
      "모집기간:",
      formData.recruitmentPeriod.trim() !== "" ? "✓" : "✗"
    );
    console.log(
      "선정날짜:",
      formData.announcementDate.trim() !== "" ? "✓" : "✗"
    );
    console.log(
      "등록기간:",
      formData.registrationPeriod.trim() !== "" ? "✓" : "✗"
    );
    console.log("키워드:", formData.keywords.trim() !== "" ? "✓" : "✗");
    console.log("안내사항:", formData.guidelines.trim() !== "" ? "✓" : "✗");
    console.log("버튼 활성화:", isValid ? "✓" : "✗");

    return isValid;
  }, [formData, uploadedImages]);

  /**
   * 폼 제출 처리
   *
   * 설명:
   * - 폼 데이터와 업로드된 이미지를 함께 onSubmit으로 전달합니다.
   * - thumbnailImageUrl은 첫 번째 이미지의 미리보기 URL(Data URL)을 전달합니다.
   *   이는 캠페인 카드에서 썸네일을 표시하는 데 사용됩니다.
   *
   * 학습 포인트:
   * - File 객체와 Data URL(이미지 미리보기)을 함께 전달하여
   *   서버 업로드와 클라이언트 표시를 모두 지원합니다.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 업로드된 이미지 파일을 폼 데이터에 추가
    const formDataWithImages = {
      ...formData,
      // 첫 번째 이미지를 썸네일로 사용 (File 객체)
      thumbnailImage: uploadedImages[0],
      // 첫 번째 이미지의 미리보기 URL (Data URL) - 캠페인 카드 표시용
      thumbnailImageUrl: imagePreviews[0] || undefined,
      // 나머지 이미지를 상세 이미지로 사용
      detailImages: uploadedImages.slice(1),
    };

    onSubmit(formDataWithImages);
  };

  return (
    <form onSubmit={handleSubmit} className={infoStyles.campaign_form}>
      {/* 캠페인 정보 섹션 */}
      <section className={styles.section}>
        <h2 className={styles.section_title}>캠페인 정보</h2>

        {/* 캠페인 유형 선택 */}
        <CampaignTypeSelector
          currentType="방문형"
          onTypeChange={handleCampaignTypeChange}
          disabled={isEditMode}
        />

        {/* 플랫폼 선택 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            등록 플랫폼<span className={infoStyles.required}>*</span>
          </label>
          <CustomDropdown
            value={formData.platform || ""}
            options={platforms}
            onChange={(value) => updateFormData("platform", value)}
            disabled={isEditMode && !isEditableField("platform")}
            placeholder="플랫폼 선택"
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
                onClick={isEditMode && !isEditableField("images") ? undefined : handleUploadClick}
                style={isEditMode && !isEditableField("images") ? { pointerEvents: "none", opacity: 0.5 } : undefined}
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
            disabled={isEditMode && !isEditableField("images")}
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
            readOnly={isEditMode && !isEditableField("title")}
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
            disabled={isEditMode && !isEditableField("category")}
            placeholder="카테고리 선택"
          />
        </article>

        {/* 지역 선택 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            지역<span className={infoStyles.required}>*</span>
          </label>
          <CustomDropdown
            value={formData.region || ""}
            options={regions}
            onChange={(value) => updateFormData("region", value)}
            disabled={isEditMode && !isEditableField("region")}
            placeholder="지역 선택"
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
            placeholder="{상호명}"
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
            readOnly={isEditMode && !isEditableField("providedItems")}
          />
        </article>

        {/* 방문 주소 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            방문 주소<span className={infoStyles.required}>*</span>
          </label>
          <div className={infoStyles.postal_input_group}>
            <input
              type="text"
              className={infoStyles.form_input}
              value={formData.visitAddress}
              onChange={(e) => updateFormData("visitAddress", e.target.value)}
              placeholder="캠페인 방문 주소"
              readOnly={isEditMode && !isEditableField("visitAddress")}
            />
            <button type="button" className={infoStyles.charge_button}>
              우편번호 찾기
            </button>
          </div>
        </article>

        {/* 주소 상세 안내 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>주소 상세 안내</label>
          <input
            type="text"
            className={infoStyles.form_input}
            value={formData.addressDetail}
            onChange={(e) => updateFormData("addressDetail", e.target.value)}
            placeholder="캠페인 방문 상세 주소 안내"
            readOnly={isEditMode && !isEditableField("addressDetail")}
          />
        </article>

        {/* 방문 링크 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>방문 링크</label>
          <input
            type="url"
            className={infoStyles.form_input}
            value={formData.visitLink}
            onChange={(e) => updateFormData("visitLink", e.target.value)}
            placeholder="캠페인 방문 링크"
            readOnly={isEditMode && !isEditableField("visitLink")}
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
                value={formatNumberWithComma(formData.additionalPoints)}
                onChange={(e) => handleNumericChange(e, "additionalPoints")}
                onKeyDown={(e) => handleNumericInput(e, "additionalPoints")}
                placeholder="캠페인 수행에 대한 추가 지급 포인트"
                readOnly={isEditMode && !isEditableField("additionalPoints")}
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
                readOnly={isEditMode && !isEditableField("recruitmentCount")}
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
            readOnly={isEditMode && !isEditableField("recruitmentPeriod")}
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
            readOnly={isEditMode && !isEditableField("announcementDate")}
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
            readOnly={isEditMode && !isEditableField("registrationPeriod")}
          />
        </article>
      </section>

      {/* 캠페인 안내 섹션 */}
      <section className={styles.section}>
        <h2 className={styles.section_title}>캠페인 안내</h2>

        {/* 키워드 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>
            키워드/태그<span className={infoStyles.required}>*</span>
          </label>
          <input
            type="text"
            className={infoStyles.form_input}
            value={formData.keywords}
            onChange={(e) => updateFormData("keywords", e.target.value)}
            placeholder="본문 내 첨부 키워드/해시태그/계정 태그 등"
            readOnly={isEditMode && !isEditableField("keywords")}
          />
        </article>

        {/* 간편 안내 */}
        <article className={infoStyles.form_group}>
          <label className={infoStyles.form_label}>간편 안내</label>
          <div className={isEditMode ? guideStyles.locked_section : undefined}>
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
            {checkboxStates.minTextLength && (
              <div className={guideStyles.option_input_value}>
                <input
                  type="text"
                  className={guideStyles.underline_input}
                  value={formatNumberWithComma(formData.minTextLength)}
                  onChange={(e) => handleNumericChange(e, "minTextLength")}
                  onKeyDown={(e) => handleNumericInput(e, "minTextLength")}
                />
                <span className={guideStyles.unit_text}>자 이상</span>
              </div>
            )}
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
            {checkboxStates.minImageCount && (
              <div className={guideStyles.option_input_value}>
                <input
                  type="text"
                  className={guideStyles.underline_input}
                  value={formatNumberWithComma(formData.minImageCount)}
                  onChange={(e) => handleNumericChange(e, "minImageCount")}
                  onKeyDown={(e) => handleNumericInput(e, "minImageCount")}
                />
                <span className={guideStyles.unit_text}>장 이상</span>
              </div>
            )}
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
            {checkboxStates.videoCount && (
              <div className={guideStyles.option_input_value}>
                {/* 동영상 개수 입력 필드 */}
                <input
                  type="text"
                  className={guideStyles.underline_input}
                  value={formatNumberWithComma(formData.videoCount)}
                  onChange={(e) => handleNumericChange(e, "videoCount")}
                  onKeyDown={(e) => handleNumericInput(e, "videoCount")}
                />
                <span className={guideStyles.unit_text}>개 이상</span>

                {/* 동영상 초수 입력 필드 */}
                <input
                  type="text"
                  className={guideStyles.underline_input}
                  value={formatNumberWithComma(formData.videoDuration)}
                  onChange={(e) => handleNumericChange(e, "videoDuration")}
                  onKeyDown={(e) => handleNumericInput(e, "videoDuration")}
                />
                <span className={guideStyles.unit_text}>초 이상</span>
              </div>
            )}
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
              disabled={isEditMode && !isEditableField("adultOnly")}
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
              disabled={isEditMode && !isEditableField("allowReParticipation")}
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
              disabled={isEditMode && !isEditableField("allowLateSubmission")}
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
            readOnly={isEditMode && !isEditableField("guidelines")}
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
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? (isEditMode ? "저장 중..." : "등록 중...") : (isEditMode ? "저장하기" : "등록하기")}
        </button>
      </div>
    </form>
  );
}
