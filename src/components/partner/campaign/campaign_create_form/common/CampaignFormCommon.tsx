/* ========================================
   📝 캠페인 폼 공통 컴포넌트
   ======================================== */

/**
 * 캠페인 폼에서 공통으로 사용되는 컴포넌트들
 *
 * 목적: 모든 캠페인 유형에서 공통으로 사용되는 폼 요소들을 제공
 *
 * 사용 컴포넌트:
 * - 배송형, 방문형, 구매평, 기자단, 미션형 캠페인 컴포넌트들
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CampaignType, PlatformType, CampaignFormData } from "@/types/campaign";
import styles from "@/styles/partner/campaign_create/campaign_create.module.css";
import dropdownStyles from "@/styles/partner/campaign_create/custom_dropdown.module.css";

// 캠페인 유형 옵션
export const campaignTypes: CampaignType[] = [
  "배송형",
  "방문형",
  "구매평",
  "기자단",
  "미션형",
];

// 플랫폼 옵션
export const platforms: PlatformType[] = [
  "네이버 블로그",
  "네이버 클립",
  "인스타그램",
  "릴스",
  "유튜브",
  "쇼츠",
];

// 카테고리 옵션
export const categories = [
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

// 지역 옵션
export const regions = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

/**
 * 캠페인 유형 선택 컴포넌트
 */
interface CampaignTypeSelectorProps {
  currentType: CampaignType;
  onTypeChange: (type: CampaignType) => void;
}

export function CampaignTypeSelector({
  currentType,
  onTypeChange,
}: CampaignTypeSelectorProps) {
  return (
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
              currentType === type ? styles.active : ""
            }`}
            onClick={() => onTypeChange(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </article>
  );
}

/**
 * 이미지 업로드 컴포넌트
 */
export function ImageUpload() {
  return (
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
  );
}

/**
 * 커스텀 드롭다운 컴포넌트
 *
 * 목적: Figma 디자인에 맞는 커스텀 드롭다운 UI 제공
 *
 * 주요 기능:
 * - 클릭 시 옵션 리스트 표시/숨김
 * - 옵션 선택 시 드롭다운 닫기
 * - 외부 클릭 시 드롭다운 닫기
 * - 키보드 네비게이션 지원
 */
interface CustomDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CustomDropdown({
  value,
  options,
  onChange,
  placeholder = "선택하세요",
}: CustomDropdownProps) {
  // 드롭다운 열림/닫힘 상태 관리
  const [is_open, setIsOpen] = useState(false);
  // 드롭다운이 위쪽으로 열릴지 아래쪽으로 열릴지 결정하는 상태
  const [is_open_upward, setIsOpenUpward] = useState(false);

  // 드롭다운 컨테이너 참조
  const dropdown_ref = useRef<HTMLDivElement>(null);

  // 선택된 옵션의 표시 텍스트
  const display_text = value || placeholder;

  // 옵션 선택 핸들러
  const handle_option_select = (option: string) => {
    onChange(option);
    setIsOpen(false); // 선택 후 드롭다운 닫기
  };

  // 드롭다운 토글 핸들러
  const toggle_dropdown = () => {
    const new_is_open = !is_open;
    setIsOpen(new_is_open);

    // 드롭다운이 열릴 때 화면 위치 계산
    if (new_is_open && dropdown_ref.current) {
      const rect = dropdown_ref.current.getBoundingClientRect();
      const viewport_height = window.innerHeight;
      const dropdown_height = 400; // 드롭다운 최대 높이

      // 화면 하단에서 드롭다운 높이만큼의 여유 공간이 있는지 확인
      const space_below = viewport_height - rect.bottom;
      const space_above = rect.top;

      // 아래쪽 공간이 부족하고 위쪽 공간이 충분하면 위쪽으로 열기
      if (space_below < dropdown_height && space_above > dropdown_height) {
        setIsOpenUpward(true);
      } else {
        setIsOpenUpward(false);
      }

      // 드롭다운이 열릴 때 해당 요소로 스크롤 (위쪽으로 열릴 때만)
      if (!is_open_upward) {
        setTimeout(() => {
          dropdown_ref.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }, 100);
      }
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handle_click_outside = (event: MouseEvent) => {
      if (
        dropdown_ref.current &&
        !dropdown_ref.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // 드롭다운이 열려있을 때만 이벤트 리스너 추가
    if (is_open) {
      document.addEventListener("mousedown", handle_click_outside);
    }

    // 클린업 함수
    return () => {
      document.removeEventListener("mousedown", handle_click_outside);
    };
  }, [is_open]);

  return (
    <div ref={dropdown_ref} className={dropdownStyles.custom_dropdown}>
      {/* 드롭다운 버튼 (선택된 값 표시) */}
      <button
        type="button"
        className={`${dropdownStyles.dropdown_button} ${
          is_open ? dropdownStyles.open : ""
        }`}
        onClick={toggle_dropdown}
        aria-expanded={is_open}
        aria-haspopup="listbox"
      >
        <span className={dropdownStyles.dropdown_text}>{display_text}</span>
        {/* 화살표 아이콘 */}
        <img
          src="/images/icons/dropdown_arrow.svg"
          alt="드롭다운 화살표"
          className={`${dropdownStyles.dropdown_arrow} ${
            is_open ? dropdownStyles.rotated : ""
          }`}
        />
      </button>

      {/* 드롭다운 옵션 리스트 */}
      {is_open && (
        <div
          className={`${dropdownStyles.dropdown_options} ${
            is_open_upward ? dropdownStyles.dropdown_options_upward : ""
          }`}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`${dropdownStyles.dropdown_option} ${
                value === option ? dropdownStyles.selected : ""
              }`}
              onClick={() => handle_option_select(option)}
              role="option"
              aria-selected={value === option}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 포인트 관련 컴포넌트
 */
interface PointsSectionProps {
  formData: CampaignFormData;
  onUpdate: (field: keyof CampaignFormData, value: any) => void;
}

export function PointsSection({ formData, onUpdate }: PointsSectionProps) {
  return (
    <>
      {/* 보유 포인트 */}
      <article className={styles.form_group}>
        <label className={styles.form_label}>보유 포인트</label>
        <div className={styles.points_input_group}>
          <input
            type="number"
            className={styles.form_input}
            value={formData.currentPoints}
            onChange={(e) =>
              onUpdate("currentPoints", parseInt(e.target.value) || 0)
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
              onUpdate("additionalPoints", parseInt(e.target.value) || 0)
            }
            placeholder="캠페인 수행에 대한 추가 지급 포인트"
          />
          <span className={styles.points_unit}>P</span>
        </div>
      </article>
    </>
  );
}

/**
 * 모집 정보 컴포넌트
 */
interface RecruitmentInfoProps {
  formData: CampaignFormData;
  onUpdate: (field: keyof CampaignFormData, value: any) => void;
}

export function RecruitmentInfo({ formData, onUpdate }: RecruitmentInfoProps) {
  return (
    <>
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
              onUpdate("recruitmentCount", parseInt(e.target.value) || 1)
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
          onChange={(e) => onUpdate("recruitmentPeriod", e.target.value)}
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
          onChange={(e) => onUpdate("announcementDate", e.target.value)}
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
          onChange={(e) => onUpdate("registrationPeriod", e.target.value)}
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
          onChange={(e) => onUpdate("keywords", e.target.value)}
          placeholder="#키워드 #태그 #입력"
        />
      </article>
    </>
  );
}

/**
 * 참여/제출 옵션 컴포넌트
 */
interface ParticipationOptionsProps {
  formData: CampaignFormData;
  onUpdate: (field: keyof CampaignFormData, value: any) => void;
}

export function ParticipationOptions({
  formData,
  onUpdate,
}: ParticipationOptionsProps) {
  return (
    <article className={styles.form_group}>
      <label className={styles.form_label}>
        참여/제출 옵션<span className={styles.required}>*</span>
      </label>

      <div className={styles.checkbox_group}>
        <label className={styles.checkbox_label}>
          <input
            type="checkbox"
            checked={formData.adultOnly}
            onChange={(e) => onUpdate("adultOnly", e.target.checked)}
          />
          <span>만 19세 이상 참여 허용 (성인인증이 필요한 제품/서비스)</span>
        </label>

        <label className={styles.checkbox_label}>
          <input
            type="checkbox"
            checked={formData.allowReParticipation}
            onChange={(e) => onUpdate("allowReParticipation", e.target.checked)}
          />
          <span>이전 참여자 재참여 허용</span>
        </label>

        <label className={styles.checkbox_label}>
          <input
            type="checkbox"
            checked={formData.allowLateSubmission}
            onChange={(e) => onUpdate("allowLateSubmission", e.target.checked)}
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
              onUpdate("minTextLength", parseInt(e.target.value) || 0)
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
              onUpdate("minImageCount", parseInt(e.target.value) || 0)
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
              onUpdate("videoCount", parseInt(e.target.value) || 0)
            }
            min="0"
          />
          <span className={styles.input_unit}>개 이상,</span>
          <input
            type="number"
            className={styles.number_input}
            value={formData.videoDuration}
            onChange={(e) =>
              onUpdate("videoDuration", parseInt(e.target.value) || 0)
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
          onChange={(e) => onUpdate("requireLinkAttachment", e.target.checked)}
        />
        <span>본문 링크 첨부</span>
      </label>

      {/* 본문 키워드/태그 첨부 */}
      <label className={styles.checkbox_label}>
        <input
          type="checkbox"
          checked={formData.requireKeywordAttachment}
          onChange={(e) =>
            onUpdate("requireKeywordAttachment", e.target.checked)
          }
        />
        <span>본문 키워드/태그 첨부</span>
      </label>
    </article>
  );
}

/**
 * 안내 사항 컴포넌트
 */
interface GuidelinesProps {
  formData: CampaignFormData;
  onUpdate: (field: keyof CampaignFormData, value: any) => void;
}

export function Guidelines({ formData, onUpdate }: GuidelinesProps) {
  return (
    <>
      {/* 간편 안내 */}
      <article className={styles.form_group}>
        <label className={styles.form_label}>간편 안내</label>
        <textarea
          className={styles.form_textarea}
          value={formData.guidelines}
          onChange={(e) => onUpdate("guidelines", e.target.value)}
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
          onChange={(e) => onUpdate("guidelines", e.target.value)}
          placeholder="상세한 안내 사항을 입력하세요"
          rows={10}
        />
      </article>
    </>
  );
}

/**
 * 유의 사항 컴포넌트
 */
export function NoticeSection() {
  return (
    <article className={styles.form_group}>
      <label className={styles.form_label}>유의 사항</label>
      <div className={styles.notice_content}>
        <ul>
          <li>
            선정된 캠페인은 타인에게 양도 · 판매 · 교환이 불가합니다. 적발 시{" "}
            <strong>제품/서비스 정가 및 배송비가 청구되며, 영구 차단</strong>될
            수 있습니다.
          </li>
          <li>
            허위 · 과장 · 비방 · 타사 비교 등 소비자를 오인시킬 수 있는 표현은
            금지됩니다.
          </li>
          <li>선정 후 제공 내역 및 배송지/방문지 변경은 불가합니다.</li>
          <li>당첨 후 취소 시 패널티가 발생합니다.</li>
          <li>미션이 제대로 지켜지지 않을 시 수정 요청이 있을 수 있습니다.</li>
          <li>
            리뷰는 반드시 해당 제품/서비스 단독으로 촬영 · 작성해야 합니다. 타
            제품/서비스와 함께 업로드 시 재작성 요청이 있을 수 있습니다.
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
          <li>미션 불이행, 리뷰 미제출, 기한 미준수 시 패널티가 발생합니다.</li>
        </ul>
      </div>
    </article>
  );
}
