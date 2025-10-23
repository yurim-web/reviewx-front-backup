/* ========================================
   📝 공통 캠페인 생성 폼 베이스 컴포넌트
   ======================================== */

/**
 * 공통 캠페인 생성 폼 베이스 컴포넌트
 *
 * 목적: 모든 캠페인 유형에서 공통으로 사용되는 폼 구조를 제공합니다.
 *
 * 사용 페이지:
 * - 배송형, 방문형, 구매평, 기자단, 미션형 캠페인 생성 페이지
 *
 * 주요 기능:
 * - 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 캠페인 상세 정보 입력
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/partner/campaign_create/campaign_create.module.css";

// 캠페인 유형 타입 정의
export type CampaignType = "배송형" | "방문형" | "구매평" | "기자단" | "미션형";

// 플랫폼 타입 정의
export type PlatformType =
  | "네이버 블로그"
  | "네이버 클립"
  | "인스타그램"
  | "릴스"
  | "유튜브"
  | "쇼츠";

// 폼 데이터 타입 정의
export interface CampaignFormData {
  // 기본 정보
  campaignType: CampaignType;
  platform: PlatformType;
  title: string;
  category: string;
  region?: string; // 방문형에만 필요
  thumbnailImage?: File;
  detailImages?: File[];

  // 상세 정보
  brandName: string;
  providedItems: string;
  promotionLink?: string;
  visitLink?: string; // 방문형에만 필요
  visitAddress?: string; // 방문형에만 필요
  addressDetail?: string; // 방문형에만 필요
  currentPoints: number;
  additionalPoints: number;
  recruitmentCount: number;
  recruitmentPeriod: string;
  announcementDate: string;
  registrationPeriod: string;
  keywords: string;

  // 참여/제출 옵션
  adultOnly: boolean;
  allowReParticipation: boolean;
  allowLateSubmission: boolean;
  minTextLength: number;
  minImageCount: number;
  videoCount?: number;
  videoDuration?: number;
  requireLinkAttachment: boolean;
  requireKeywordAttachment: boolean;

  // 안내 사항
  guidelines: string;

  // 긴급 여부
  isUrgent: boolean;
}

interface CampaignCreateFormBaseProps {
  campaignType: CampaignType;
  onSubmit: (data: CampaignFormData) => void;
  isSubmitting: boolean;
}

export default function CampaignCreateFormBase({
  campaignType,
  onSubmit,
  isSubmitting,
}: CampaignCreateFormBaseProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignType,
    platform: "네이버 블로그",
    title: "",
    category: "",
    region: "",
    brandName: "",
    providedItems: "",
    promotionLink: "",
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

  // 캠페인 유형 옵션
  const campaignTypes: CampaignType[] = [
    "배송형",
    "방문형",
    "구매평",
    "기자단",
    "미션형",
  ];

  // 플랫폼 옵션
  const platforms: PlatformType[] = [
    "네이버 블로그",
    "네이버 클립",
    "인스타그램",
    "릴스",
    "유튜브",
    "쇼츠",
  ];

  // 카테고리 옵션
  const categories = [
    "전체",
    "식품",
    "뷰티",
    "가전",
    "유아동",
    "여가",
    "서비스",
    "생활",
    "패션",
    "가구",
    "디지털",
    "문화",
    "반려동물",
    "기타",
  ];

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
  const handleCampaignTypeChange = (type: CampaignType) => {
    if (type === campaignType) return; // 현재 타입과 같으면 이동하지 않음

    // 캠페인 유형에 따른 페이지 경로 매핑
    const typeRoutes: Record<CampaignType, string> = {
      배송형: "/partner/campaign/create/delivery",
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
    <form onSubmit={handleSubmit} className={styles.campaign_form}>
      {/* 캠페인 정보 섹션 */}
      <section className={styles.section}>
        <h2 className={styles.section_title}>캠페인 정보</h2>

        {/* 캠페인 유형 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            캠페인 유형<span className={styles.required}>*</span>
          </label>
          <div className={styles.campaign_type_buttons}>
            {campaignTypes.map((type) => (
              <button
                key={type}
                type="button"
                className={`${styles.campaign_type_button} ${
                  campaignType === type ? styles.active : ""
                }`}
                onClick={() => handleCampaignTypeChange(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </article>

        {/* 등록 플랫폼 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            등록 플랫폼<span className={styles.required}>*</span>
          </label>
          <select
            className={styles.form_select}
            value={formData.platform}
            onChange={(e) =>
              updateFormData("platform", e.target.value as PlatformType)
            }
          >
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </article>

        {/* 썸네일/상세 이미지 */}
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
          <select
            className={styles.form_select}
            value={formData.category}
            onChange={(e) => updateFormData("category", e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </article>

        {/* 방문형 전용: 지역 */}
        {campaignType === "방문형" && (
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
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
              <option value="광주">광주</option>
              <option value="대전">대전</option>
              <option value="울산">울산</option>
              <option value="세종">세종</option>
              <option value="강원">강원</option>
              <option value="충북">충북</option>
              <option value="충남">충남</option>
              <option value="전북">전북</option>
              <option value="전남">전남</option>
              <option value="경북">경북</option>
              <option value="경남">경남</option>
              <option value="제주">제주</option>
            </select>
          </article>
        )}

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

        {/* 홍보 링크 (배송형) / 방문 링크 (방문형) */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            {campaignType === "방문형" ? "방문 링크" : "홍보 링크"}
          </label>
          <input
            type="url"
            className={styles.form_input}
            value={
              campaignType === "방문형"
                ? formData.visitLink
                : formData.promotionLink
            }
            onChange={(e) =>
              updateFormData(
                campaignType === "방문형" ? "visitLink" : "promotionLink",
                e.target.value
              )
            }
            placeholder="링크를 입력하세요"
          />
        </article>

        {/* 방문형 전용: 방문 주소 */}
        {campaignType === "방문형" && (
          <>
            <article className={styles.form_group}>
              <label className={styles.form_label}>
                방문 주소<span className={styles.required}>*</span>
              </label>
              <div className={styles.address_input_group}>
                <input
                  type="text"
                  className={styles.form_input}
                  value={formData.visitAddress}
                  onChange={(e) =>
                    updateFormData("visitAddress", e.target.value)
                  }
                  placeholder="주소를 입력하세요"
                />
                <button type="button" className={styles.postal_code_button}>
                  우편번호 찾기
                </button>
              </div>
            </article>

            <article className={styles.form_group}>
              <label className={styles.form_label}>주소 상세 안내</label>
              <input
                type="text"
                className={styles.form_input}
                value={formData.addressDetail}
                onChange={(e) =>
                  updateFormData("addressDetail", e.target.value)
                }
                placeholder="상세 주소 안내를 입력하세요"
              />
            </article>
          </>
        )}

        {/* 보유 포인트 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>보유 포인트</label>
          <div className={styles.points_input_group}>
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
            <button type="button" className={styles.charge_button}>
              포인트 충전하기
            </button>
          </div>
        </article>

        {/* 추가 지급 포인트 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>추가 지급 포인트</label>
          <div className={styles.points_input_group}>
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
        </article>

        {/* 모집 인원 */}
        <article className={styles.form_group}>
          <label className={styles.form_label}>
            모집 인원<span className={styles.required}>*</span>
          </label>
          <div className={styles.count_input_group}>
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

        {/* 유의 사항 */}
        <article className={styles.form_group}>
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
        </article>
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
