// 기자단 캠페인 상세 페이지

"use client";

import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import SubHeader from "@/components/fragments/SubHeader";
import ApplicationModal from "@/components/campaign/ApplicationModal";
import styles from "../../../styles/campaign/campaign_detail.module.css";
import { reporterCampaigns } from "@/data/reporter/reporterCampaigns";
import ApplicationModalType3 from "@/components/campaign/ApplicationModalType3";

interface ReporterDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ReporterDetailPage({
  params,
}: ReporterDetailPageProps) {
  const resolvedParams = use(params);
  const campaign = reporterCampaigns.find(
    (c) => String(c.id) === resolvedParams.id
  );
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!campaign) return notFound();

  // 메인 헤더 숨기기 (캠페인 상세와 동일 동작)
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
        {/* 태그 및 포인트 */}
        <article className={styles.tags_section}>
          <div className={styles.tag_icon_container}>
            <img
              className={styles.tag_icon}
              src={campaign.categoryIcon}
              alt="reporter_tag"
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

        {/* 캠페인 정보 섹션 라벨 */}
        <div className={styles.campaign_info_text_line}>캠페인 정보</div>

        {/* 상세 이미지 및 기자단 가이드 */}
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

        {/* 안내 사항들 (기자단 특화 내용) */}
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
                  <span>관련 링크 삽입</span>
                </div>
                <div className={styles.requirement_item}>
                  <img
                    className={styles.requirement_icon}
                    src="/images/campaign_detail/text_icon.svg"
                    alt="텍스트아이콘"
                  />
                  <span>2,000자 이상</span>
                </div>
                <div className={styles.requirement_item}>
                  <img
                    className={styles.requirement_icon}
                    src="/images/campaign_detail/photo_icon.svg"
                    alt="사진아이콘"
                  />
                  <span>15장 이상</span>
                </div>
                <div className={styles.requirement_item}>
                  <img
                    className={styles.requirement_icon}
                    src="/images/campaign_detail/video_icon.svg"
                    alt="비디오아이콘"
                  />
                  <span>리포팅 영상 2개</span>
                </div>
              </div>

              <div
                className={`${styles.requirement_container} ${styles.important_note_container}`}
              >
                <div className={styles.guideline_text}>
                  기자단 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해
                  주세요.
                </div>
                <div className={styles.guideline_text}>
                  ★★기자단 활동은 전문적이고 객관적인 시각으로 작성해주세요!!
                  해당 분야에 대한 깊이있는 지식과 경험을 바탕으로 작성해주세요★
                </div>
                <div className={styles.guideline_text}>
                  ★제공된 기자단 활동을 모두 활용하여 작성해주세요 - 전문적인
                  리포팅 필수 - 객관적이고 정확한 정보 제공 - 독자에게 유용한
                  정보 포함
                  <br />
                  ★기자단 리포팅은 전문적이고 신뢰성 있게 작성 부탁드립니다★
                  <br />
                  ★활동 시 실제 경험하는 모습 사진 필수 첨부해주세요★
                  <br />
                  ★기자단 활동에 대한 평가는 객관적으로 작성해주세요★
                </div>
                <div className={styles.guideline_text}>
                  ★기자단 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며
                  캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은
                  [기자단]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수
                  있습니다
                  <br /> 2. 당첨당일 기자단 활동 시작해주세요
                  <br /> 3. 기간 내 리포팅 및 작성 등록 불가할 경우 페이백
                  미지급 및 선정취소
                  <br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다
                  <br /> ★기자단 리포팅 작성 시에는 전문적이고 객관적으로
                  작성해주세요
                  <br /> ★ [본인이 직접 경험하고 분석한 내용에 대하여
                  작성해주세요]
                </div>
                <div className={styles.guideline_text}>
                  - 미준수 시 처리 방향에 대한 책임은 기자단에게 있는 점 주의
                  부탁드립니다 <br /> - 활동 불가 및 활동 착오할 경우 : 페이백
                  미지급 및 선정취소 <br /> - 리포팅 작성 불가할 경우 : 페이백
                  미지급 및 선정취소 <br />- 촬영은 전문적인 장비로 촬영해주세요
                  - 성의없는 리포팅은 다음 캠페인 참여에 어려울 수 있습니다.
                  정성껏 포스팅 해주세요! <br />- 기자단 활동 정보는 정확하게
                  기재해주세요 (활동 장소, 시간, 참여자 등)
                  <br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대
                  불가합니다.
                  <br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여
                  제한됩니다.
                  <br /> - 리포팅 등록기간 내 리포팅 미등록시 서비스이용료 및
                  혜택 가격에 대하여 비용이 청구됩니다.
                  <br /> - 리포팅 등록기간 필수로 지켜주시기 바랍니다. <br />-
                  기자단의 경우 활동 내용과 함께 관련 정보, 참고 자료등을
                  기재해주세요. <br />- 기자단 캠페인의 경우 전문적인 리포팅을
                  꼭 해주세요
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
                혜택 정가 및 배송비가 청구되며, 영구 차단
              </span>{" "}
              될 수 있습니다.
              <br /> · 허위·과장·비방·타사 비교 등 소비자를 오인시킬 수 있는
              표현은 금지됩니다.
              <br /> · 선정 후 제공 내역 및 활동 내용 변경은 불가합니다.
              <br /> · 당첨 후 취소 시 패널티가 발생합니다.
              <br /> · 미션이 제대로 지켜지지 않을 시 수정 요청이 있을 수
              있습니다.
              <br /> · 리포팅은 반드시 해당 활동 단독으로 촬영·작성해야 합니다.
              타 활동과 함께 업로드 시 재작성 요청이 있을 수 있습니다.
              <br /> · 리포팅은 반드시 지정된 기간 내 등록해야 합니다. 기간을
              초과할 경우 제공 내역 비용이 청구되거나 패널티가 발생합니다.
              <br /> · 작성된 콘텐츠는 최소 6개월간 유지해야 하며, 유지하지 않을
              경우 패널티가 발생합니다.
              <br /> · 생성형 AI로 작성된 콘텐츠 및 이미지는 수정 요청 또는
              패널티가 발생합니다.
              <br /> · 미션 불이행, 리포팅 미제출, 기한 미준수 시 패널티가
              발생합니다.
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
