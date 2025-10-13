// 방문형 캠페인 상세 페이지

"use client";

import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import SubHeader from "@/components/fragments/SubHeader";
import ApplicationModal from "@/components/campaign/ApplicationModal";
import styles from "../../../styles/campaign/campaign_detail.module.css";
import { visitCampaigns } from "@/data/visit/visitCampaigns";
import ApplicationModalType3 from "@/components/campaign/ApplicationModalType3";

interface VisitDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function VisitDetailPage({ params }: VisitDetailPageProps) {
  const resolvedParams = use(params);
  const campaign = visitCampaigns.find(
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
            {/* 스토어 아이콘 */}
            <img
              className={styles.tag_icon}
              src={campaign.categoryIcon}
              alt="visit_tag"
            />
            {/* 방문형 (고정) */}
            <div className={styles.tag_box}>{campaign.category}</div>
            {/* 지역 부분(서브 카테고리) */}
            <div className={styles.subcategory_tag}>{campaign.subcategory}</div>
          </div>
          {/* 포인트 부분 */}
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
                {campaign.detailedSchedule.purchasePeriod}
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

        {/* 상세 이미지 및 방문 가이드 */}
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

        {/* 안내 사항들 (방문형 특화 내용) */}
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
                  <span>매장 정보 삽입</span>
                </div>
                <div className={styles.requirement_item}>
                  <img
                    className={styles.requirement_icon}
                    src="/images/campaign_detail/text_icon.svg"
                    alt="텍스트아이콘"
                  />
                  <span>1,000자 이상</span>
                </div>
                <div className={styles.requirement_item}>
                  <img
                    className={styles.requirement_icon}
                    src="/images/campaign_detail/photo_icon.svg"
                    alt="사진아이콘"
                  />
                  <span>8장 이상</span>
                </div>
                <div className={styles.requirement_item}>
                  <img
                    className={styles.requirement_icon}
                    src="/images/campaign_detail/video_icon.svg"
                    alt="비디오아이콘"
                  />
                  <span>방문 영상 1개</span>
                </div>
              </div>

              <div
                className={`${styles.requirement_container} ${styles.important_note_container}`}
              >
                <div className={styles.guideline_text}>
                  방문형 캠페인 작성시 아래의 내용을 참고하여 작성을 진행해
                  주세요.
                </div>
                <div className={styles.guideline_text}>
                  ★★방문 전 반드시 매장 영업시간 및 휴무일을 확인해주세요!! 매장
                  방문 불가시에는 1:1문의로 제보 부탁드립니다!! 방문 가능한
                  시간대에 맞춰 캠페인을 신청해주세요★
                </div>
                <div className={styles.guideline_text}>
                  ★제공된 혜택을 모두 활용하여 작성해주세요 - 매장 방문 체험
                  필수 - 실제 방문 사진 및 영상 필수 - 매장 분위기 및 서비스
                  체험 내용 포함
                  <br />
                  ★방문 리뷰는 인위적이기 않고 최대한 자연스럽게 작성
                  부탁드립니다★
                  <br />
                  ★방문 시 실제 체험하는 모습 사진 필수 첨부해주세요★
                  <br />
                  ★방문 리뷰 작성 시 별점은 5점으로 등록해주세요★
                </div>
                <div className={styles.guideline_text}>
                  ★방문형 캠페인 입니다★ -페이백은 클라우드리뷰 캐쉬로 지급되며
                  캐쉬환급시 3.3% 공제 후 지급됩니다 <br /> 1. 본 캠페인은
                  [방문형]으로 진행되며, 포스팅은 업체 홍보목적으로 이용될 수
                  있습니다
                  <br /> 2. 당첨당일 매장 방문 해주세요
                  <br /> 3. 기간 내 방문 및 리뷰 작성 등록 불가할 경우 페이백
                  미지급 및 선정취소
                  <br /> 4. 안내된 사항 필수로 숙지하시어 진행해 주셔야 합니다
                  <br /> ★방문 리뷰 작성 시에는 너무 인위적이지 않게 자연스럽게
                  작성해주세요
                  <br /> ★ [본인이 직접 방문하여 경험한 매장의 특장점에 대하여
                  작성해주세요]
                </div>
                <div className={styles.guideline_text}>
                  - 미준수 시 처리 방향에 대한 책임은 리뷰어에게 있는 점 주의
                  부탁드립니다 <br /> - 매장 방문 불가 및 방문 착오할 경우 :
                  페이백 미지급 및 선정취소 <br /> - 방문 리뷰 작성 불가할 경우
                  : 페이백 미지급 및 선정취소 <br />- 촬영은 DSLR로 촬영해주세요
                  (DSLR 급 휴대폰 대체가능) - 성의없는 리뷰는 다음 캠페인 참여에
                  어려울 수 있습니다. 정성껏 포스팅 해주세요! <br />- 매장
                  정보는 정확하게 기재해주세요 (주소, 영업시간, 연락처, 주차
                  가능 여부)
                  <br />- 제공받은 혜택으로 리뷰 용도 외 재판매는 절대
                  불가합니다.
                  <br />- 재판매건 적발 시 혜택 가격 환불 및 캠페인 참여
                  제한됩니다.
                  <br /> - 리뷰 등록기간 내 리뷰 미등록시 서비스이용료 및 혜택
                  가격에 대하여 비용이 청구됩니다.
                  <br /> - 리뷰 등록기간 필수로 지켜주시기 바랍니다. <br />-
                  방문형의 경우 지도와 함께 매장 주소,영업시간,주차유무등을
                  기재해주세요. <br />- 방문형 캠페인의 경우 매장 정보를 꼭
                  넣어주세요
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
              <br /> · 선정 후 제공 내역 및 방문 매장 변경은 불가합니다.
              <br /> · 당첨 후 취소 시 패널티가 발생합니다.
              <br /> · 미션이 제대로 지켜지지 않을 시 수정 요청이 있을 수
              있습니다.
              <br /> · 리뷰는 반드시 해당 매장 단독으로 촬영·작성해야 합니다. 타
              매장과 함께 업로드 시 재작성 요청이 있을 수 있습니다.
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
      <ApplicationModalType3
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
