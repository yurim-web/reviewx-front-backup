/**
 * 재사용 가능한 캠페인 상세 페이지 컴포넌트
 */

"use client";

import { useEffect, useState } from "react";
import SubHeader from "@/components/fragments/SubHeader";
import ApplicationModal from "@/components/campaign/ApplicationModal";
import styles from "../../styles/campaign/campaign_detail.module.css";
import { Campaign, CampaignTypeConfig } from "@/types/campaign";

interface CampaignDetailProps {
  campaign: Campaign;
  config: CampaignTypeConfig;
}

export default function CampaignDetail({
  campaign,
  config,
}: CampaignDetailProps) {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 메인 헤더 숨기기
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  const showModal = config.showApplicationModal !== false;

  return (
    <>
      <SubHeader />
      <section className={styles.campaign_detail_container}>
        {/* 태그 및 포인트 */}
        <article className={styles.tags_section}>
          <div className={styles.tag_icon_container}>
            <img
              className={styles.tag_icon}
              src={campaign.categoryIcon}
              alt={config.imageAlt}
            />
            <div className={styles.tag_box}>{campaign.category}</div>
            <div className={styles.subcategory_tag}>{campaign.subcategory}</div>
          </div>

          <div className={styles.points}>
            + {campaign.points.toLocaleString()} P
          </div>
        </article>

        {/* 제품 정보 */}
        <article className={styles.product_info}>
          <div className={styles.product_info_title}>
            <h1 className={styles.product_title}>{campaign.title}</h1>
            <p className={styles.product_description}>{campaign.description}</p>
          </div>

          <div className={styles.main_image_container}>
            <img src={campaign.image} alt={campaign.title} />
          </div>

          {/* 캠페인 참여 정보 */}
          <article className={styles.campaign_info}>
            <div className={styles.gradient_background}></div>
            <div className={styles.info_item_container}>
              <span className={styles.label}>모집 인원</span>
              <span className={styles.value}>
                <span className={styles.current_count}>
                  {campaign.recruitment.current}명
                </span>
                <span className={styles.separator}> / </span>
                <span className={styles.total_count}>
                  {campaign.recruitment.total}명
                </span>
              </span>
            </div>
            <div className={styles.info_item_container}>
              <span className={styles.label}>모집 기간</span>
              <span className={`${styles.value} ${styles.recruitment_info}`}>
                {campaign.detailedSchedule.applicationStart} ~{" "}
                {campaign.detailedSchedule.applicationEnd}
              </span>
            </div>
            <div className={styles.info_item_container}>
              <span className={styles.label}>당첨 발표</span>
              <span className={styles.value}>
                {campaign.detailedSchedule.announcement}
              </span>
            </div>
            <div className={styles.info_item_container}>
              <span className={styles.label}>{config.periodLabel}</span>
              <span className={styles.value}>
                {campaign.detailedSchedule.purchasePeriod}
              </span>
            </div>
          </article>

          <button
            className={styles.apply_button}
            onClick={() => showModal && setIsModalOpen(true)}
          >
            캠페인 신청하기
          </button>
        </article>

        {/* 캠페인 정보 섹션 라벨 */}
        <div className={styles.campaign_info_text_line}>캠페인 정보</div>

        {/* 상세 이미지 */}
        <article className={styles.review_guidelines_container}>
          <div
            className={`${styles.campaign_detail_image_container} ${
              isImageExpanded ? styles.expanded : ""
            }`}
          >
            <img src={campaign.campaign_detail_image} alt="캠페인상세사진" />
            <button
              className={styles.expand_image_button}
              onClick={() => setIsImageExpanded(!isImageExpanded)}
            >
              {isImageExpanded ? "이미지 접기" : "이미지 펼쳐보기"}
            </button>
          </div>
        </article>

        {/* 안내 사항들 */}
        <article className={styles.campaign_detail_info_container}>
          <div className={styles.info_item_box}>
            <div className={styles.label_box}>제공내역</div>
            <div className={styles.content_box}>{campaign.description}</div>
          </div>

          <div className={styles.info_item_box}>
            <div className={styles.label_box}>
              <div className={styles.label_keyword_box}>
                <span>키워드</span>
                <button className={styles.copy_tag_button}>복사</button>
              </div>
            </div>
            <div className={styles.content_box}>
              <div className={styles.keyword_text_box}>
                자유롭게 입력하세요.
              </div>
            </div>
          </div>

          <div className={styles.info_item_box}>
            <div className={styles.label_box}>안내 사항</div>
            <div className={styles.content_box}>
              <div className={styles.requirement_container}>
                <div className={styles.requirement_item}>
                  <img
                    className={styles.requirement_icon}
                    src="/images/campaign_detail/keyword_icon.svg"
                    alt="키워드아이콘"
                  />
                  <span>키워드 삽입</span>
                </div>
                <div className={styles.requirement_item}>
                  <img
                    className={styles.requirement_icon}
                    src="/images/campaign_detail/product_link_icon.svg"
                    alt="제품링크아이콘"
                  />
                  <span>{config.requirements.linkLabel}</span>
                </div>
                <div className={styles.requirement_item}>
                  <img
                    className={styles.requirement_icon}
                    src="/images/campaign_detail/text_icon.svg"
                    alt="텍스트아이콘"
                  />
                  <span>{config.requirements.text}</span>
                </div>
                <div className={styles.requirement_item}>
                  <img
                    className={styles.requirement_icon}
                    src="/images/campaign_detail/photo_icon.svg"
                    alt="사진아이콘"
                  />
                  <span>{config.requirements.photos}</span>
                </div>
                <div className={styles.requirement_item}>
                  <img
                    className={styles.requirement_icon}
                    src="/images/campaign_detail/video_icon.svg"
                    alt="비디오아이콘"
                  />
                  <span>{config.requirements.video}</span>
                </div>
              </div>

              <div
                className={`${styles.requirement_container} ${styles.important_note_container}`}
              >
                <div className={styles.guideline_text}>
                  {config.guidelines.intro}
                </div>
                <div className={styles.guideline_text}>
                  {config.guidelines.mainNotice}
                </div>
                {config.guidelines.detailedInfo.map((info, index) => (
                  <div
                    key={index}
                    className={styles.guideline_text}
                    dangerouslySetInnerHTML={{ __html: info }}
                  />
                ))}
                <div className={styles.guideline_text}>
                  {config.guidelines.campaignType}
                </div>
                <div className={styles.guideline_text}>
                  {config.guidelines.warnings}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.info_item_box}>
            <div className={styles.label_box}>추가 안내 사항</div>
            <div
              className={`${styles.content_box} ${styles.additional_guideline_text}`}
            >
              · 선정된 캠페인은 타인에게 양도·판매·교환이 불가합니다. 적발 시{" "}
              <span className={styles.text_line}>
                {config.additionalGuidelines?.contentTypeText ||
                  "제품 정가 및 배송비가 청구되며, 영구 차단"}
              </span>{" "}
              될 수 있습니다.
              <br /> · 허위·과장·비방·타사 비교 등 소비자를 오인시킬 수 있는
              표현은 금지됩니다.
              <br /> · 선정 후{" "}
              {config.additionalGuidelines?.addressChangeText ||
                "제공 내역 및 배송지 변경은 불가합니다."}
              <br /> · 당첨 후 취소 시 패널티가 발생합니다.
              <br /> · 미션이 제대로 지켜지지 않을 시 수정 요청이 있을 수
              있습니다.
              <br /> · 리뷰는 반드시 해당{" "}
              {config.type === "visit" ? "매장" : "제품"} 단독으로 촬영·작성해야
              합니다. 타 {config.type === "visit" ? "매장" : "제품"}과 함께
              업로드 시 재작성 요청이 있을 수 있습니다.
              <br /> · 리뷰는 반드시 지정된 기간 내 등록해야 합니다. 기간을
              초과할 경우 제공 내역 비용이 청구되거나 패널티가 발생합니다.
              <br /> · 작성된 콘텐츠는 최소 6개월간 유지해야 하며, 유지하지 않을
              경우 패널티가 발생합니다.
              <br /> · 생성형 AI로 작성된 콘텐츠 및 이미지는 수정 요청 또는
              패널티가 발생합니다.
              <br /> · 미션 불이행, 리뷰 미제출, 기한 미준수 시 패널티가
              발생합니다.
            </div>
          </div>
        </article>
      </section>

      {/* 신청 모달 */}
      {showModal && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
