/* ========================================
   🛒 구매평 콘텐츠 내역 상세 (id 연동)
   - 방문형 페이지와 동일한 레이아웃/구조 적용
   - 카드만 action_card(구매평/미션형)로 렌더링
   ======================================== */
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import appStyles from "@/styles/partner/campaign_application/campaign_application.module.css";
import SortFilterControl from "@/components/partner/campaign_application/SortFilterControl";
import Campaignbanner from "@/components/partner/campaign_application/CampaignInfoBox";
import PageHeader from "@/components/partner/campaign_application/PageHeader";
import ExcelDownloadBtn from "@/components/partner/campaign_application/ExcelDownloadBtn";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import { getClosedContentsById } from "@/data/partner/sharedCampaigns";
import { getPurchaseReviewContentsById } from "@/data/partner/review";
import ReviewInspectionCard from "@/components/partner/campaign_contents/card_type/purchase_review_card/ReviewInspectionCard";
import ReviewCompletedCard from "@/components/partner/campaign_contents/card_type/purchase_review_card/ReviewCompletedCard";
import ReviewRejectedReviewCard from "@/components/partner/campaign_contents/card_type/purchase_review_card/ReviewRejectedReviewCard";
import ReviewRejectedReceiptCard from "@/components/partner/campaign_contents/card_type/purchase_review_card/ReviewRejectedReceiptCard";
import ReviewPendingCard from "@/components/partner/campaign_contents/card_type/purchase_review_card/ReviewPendingCard";
import ReceiptPreviewModal from "@/components/partner/campaign_contents/ReceiptPreviewModal";
import type { ExperienceApplicant as ReviewApplicant } from "@/components/partner/campaign_contents/card_type/purchase_review_card/ReviewTypes";
import type { ContentItem } from "@/data/partner/sharedCampaigns";

type TabKey = "검수" | "완료";

export default function PurchaseReviewContentsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const initialTab: TabKey =
    searchParams?.get("tab") === "완료" ? "완료" : "검수";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [sortOrder, setSortOrder] = useState<
    "latest" | "popular" | "deadline" | "point"
  >("latest");
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptImages, setReceiptImages] = useState<string[]>([]);

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "deadline", label: "마감임박순" },
    { value: "point", label: "포인트순" },
  ];

  // 탭 초기값은 URL 쿼리로 즉시 결정하여 첫 렌더에서 플리커 제거

  // 기본 전역 헤더 숨기기 (파트너 레이아웃만 노출)
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  const campaignInfo = id
    ? getCampaignById(String(id))?.campaignInfo
    : undefined;

  // 상태에 따라 데이터 소스 분기 (종료/취소 → closed, 그 외 → review 더미)
  const contents = (() => {
    if (!id) return { reviewing: [], completed: [] };
    const info = campaignInfo;
    if (
      info &&
      (String(info.status) === "종료" || String(info.status) === "취소")
    ) {
      return (
        getClosedContentsById(String(id)) || { reviewing: [], completed: [] }
      );
    }
    return getPurchaseReviewContentsById(String(id));
  })();
  const reviewCount = contents.reviewing.length;
  const completedCount = contents.completed.length;

  const formatDateTime = (iso: string) => iso.slice(0, 16).replace("T", " ");

  const openReceiptModal = (images: string[] | undefined) => {
    setReceiptImages(images && images.length > 0 ? images : []);
    setIsReceiptModalOpen(true);
  };

  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setReceiptImages([]);
  };

  return (
    <>
      <PageHeader title="캠페인 콘텐츠 내역" />
      <section className={appStyles.campaign_application_section}>
        {campaignInfo ? <Campaignbanner campaignInfo={campaignInfo} /> : null}

        <article className={appStyles.download_section}>
          <ExcelDownloadBtn
            onDownloadApplicants={() => {}}
            onDownloadSelected={() => {}}
            onDownloadReport={() => {}}
          />
          <SortFilterControl
            options={sortOptions}
            value={sortOrder}
            onChange={(opt) => setSortOrder(opt.value as typeof sortOrder)}
            defaultSort="latest"
          />
        </article>

        <article className={appStyles.tab_navigation}>
          <button
            className={`${appStyles.tab_button} ${
              activeTab === "검수" ? appStyles.active : ""
            }`}
            onClick={() => setActiveTab("검수")}
          >
            검수 <span className={appStyles.tab_count}>{reviewCount}</span>
          </button>
          <button
            className={`${appStyles.tab_button} ${
              activeTab === "완료" ? appStyles.active : ""
            }`}
            onClick={() => setActiveTab("완료")}
          >
            완료 <span className={appStyles.tab_count}>{completedCount}</span>
          </button>
        </article>

        <article className={appStyles.applicants_grid}>
          {(activeTab === "검수" ? contents.reviewing : contents.completed).map(
            (item: ContentItem) => {
              const brandChannel = campaignInfo?.brandName ?? item.channel;
              const isReceiptFlow = item.actionType === 1; // actionType 1 = 영수증 흐름
              const applicant: ReviewApplicant = {
                id: item.id,
                userType: item.userType,
                nickname: item.nickname,
                profileImage: item.profileImage,
                channel: brandChannel || "",
                channelId: item.channelId || "",
                registrationDate: formatDateTime(item.createdAt),
                reviewType: 1,
              };

              const dateLabel: "등록" | "수정" | "지각 등록" = item.isLate
                ? "지각 등록"
                : item.updatedAt
                ? "수정"
                : "등록";

              if (activeTab === "검수") {
                // 반려 케이스
                if (item.isRejected) {
                  if (isReceiptFlow) {
                    return (
                    <ReviewRejectedReceiptCard
                        key={item.id}
                        applicant={{ ...applicant, reviewType: 6 }}
                      onCheckReceipt={() => openReceiptModal(item.receiptImages)}
                        onHandleReject={() => {}}
                        dateLabel={dateLabel}
                      />
                    );
                  }
                  return (
                    <ReviewRejectedReviewCard
                      key={item.id}
                      applicant={{ ...applicant, reviewType: 5 }}
                      onCheckReview={() =>
                        openReceiptModal(
                          item.thumbnailSrc ? [item.thumbnailSrc] : []
                        )
                      }
                      onHandleReject={() => {}}
                      dateLabel={dateLabel}
                    />
                  );
                }

                // 리뷰 대기 중 (영수증 완료 후 리뷰 대기 가정: isLate를 대기 표시 예시로 사용)
                if (isReceiptFlow && item.isLate) {
                  return (
                    <ReviewPendingCard
                      key={item.id}
                      applicant={{ ...applicant, reviewType: 4 }}
                      onCheckReceipt={() => openReceiptModal(item.receiptImages)}
                      dateLabel={dateLabel}
                    />
                  );
                }

                // 일반 검수 카드
                if (isReceiptFlow) {
                  return (
                    <ReviewInspectionCard
                      key={item.id}
                      applicant={{ ...applicant, reviewType: 2 }}
                      onCheckReceipt={() => openReceiptModal(item.receiptImages)}
                      onApprove={() => {}}
                      onReject={() => {}}
                      dateLabel={dateLabel}
                    />
                  );
                }
                  return (
                  <ReviewInspectionCard
                    key={item.id}
                    applicant={{ ...applicant, reviewType: 1 }}
                      onCheckReview={() =>
                        openReceiptModal(
                          item.thumbnailSrc ? [item.thumbnailSrc] : []
                        )
                      }
                    onApprove={() => {}}
                    onReject={() => {}}
                    dateLabel={dateLabel}
                  />
                );
              }

              // 완료 탭: 영수증 흐름이면 영수증 확인 라벨/핸들러, 아니면 리뷰 확인
              return (
                <ReviewCompletedCard
                  key={item.id}
                  applicant={{
                    ...applicant,
                    reviewType: isReceiptFlow ? 2 : 3,
                  }}
                  onCheckReceipt={isReceiptFlow ? () => openReceiptModal(item.receiptImages) : undefined}
                  onCheckReview={!isReceiptFlow
                    ? () => openReceiptModal(
                        item.thumbnailSrc ? [item.thumbnailSrc] : []
                      )
                    : undefined}
                  dateLabel={dateLabel}
                />
              );
            }
          )}
        </article>
        <ReceiptPreviewModal
          isOpen={isReceiptModalOpen}
          images={receiptImages}
          onClose={closeReceiptModal}
        />
      </section>
    </>
  );
}
