// 체험단 상세페이지

"use client";

import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import SubHeader from "@/components/fragments/SubHeader";
import ApplicationModalType3 from "@/components/campaign/ApplicationModalType3";
import styles from "../../../styles/campaign/campaign_detail.module.css";
import { experienceCampaigns } from "@/data/experience/experienceCampaigns";

interface ExperienceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ExperienceDetailPage({
  params,
}: ExperienceDetailPageProps) {
  const resolvedParams = use(params);
  const campaign = experienceCampaigns.find(
    (c) => String(c.id) === resolvedParams.id
  );
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!campaign) return notFound();

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  return (
    <>
      <SubHeader />
      <section className={styles.campaign_detail_container}>
        <article className={styles.tags_section}>
          <div className={styles.tag_icon_container}>
            <img
              className={styles.tag_icon}
              src={campaign.categoryIcon}
              alt="experience_tag"
            />
            <div className={styles.tag_box}>{campaign.category}</div>
            <div className={styles.subcategory_tag}>{campaign.subcategory}</div>
          </div>
          <div className={styles.points}>
            + {campaign.points.toLocaleString()} P
          </div>
        </article>

        <article className={styles.product_info}>
          <div className={styles.product_info_title}>
            <h1 className={styles.product_title}>{campaign.title}</h1>
            <p className={styles.product_description}>{campaign.description}</p>
          </div>
          <div className={styles.main_image_container}>
            <img src={campaign.image} alt={campaign.title} />
          </div>
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
              <span className={styles.label}>선정 발표</span>
              <span className={styles.value}>
                {campaign.detailedSchedule.announcement}
              </span>
            </div>
            <div className={styles.info_item_container}>
              <span className={styles.label}>등록 기간</span>
              <span className={styles.value}>
                {campaign.detailedSchedule.registrationPeriod}
              </span>
            </div>
          </article>
          <button
            className={styles.apply_button}
            onClick={() => setIsModalOpen(true)}
          >
            캠페인 신청하기
          </button>
        </article>

        <div className={styles.campaign_info_text_line}>캠페인 정보</div>

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
        </article>
      </section>

      {/* 신청 모달 */}
      <ApplicationModalType3
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
