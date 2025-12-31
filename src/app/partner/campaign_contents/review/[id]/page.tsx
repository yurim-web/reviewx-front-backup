/* ========================================
   🛒 구매평 콘텐츠 내역 상세 (id 연동)
   - 방문형 페이지와 동일한 레이아웃/구조 적용
   - 카드만 action_card(구매평/미션형)로 렌더링
   ======================================== */
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import appStyles from "@/styles/partner/campaign_application/campaign_application.module.css";
import SortFilterControl from "@/components/partner/campaign_application/SortFilterControl";
import Campaignbanner from "@/components/partner/campaign_application/CampaignInfoBox";
import PageHeader from "@/components/partner/campaign_application/PageHeader";
import ExcelDownloadBtn from "@/components/partner/campaign_application/ExcelDownloadBtn";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import { getClosedContentsById } from "@/data/partner/sharedCampaigns";
import {
  getPurchaseReviewContentsById,
  reviewCampaignsExtended,
} from "@/data/campaign/review/reviewCampaigns";
import CampaignInspectionCard from "@/components/partner/campaign_contents/card_type/shared_card/CampaignInspectionCard";
import CampaignCompletedCard from "@/components/partner/campaign_contents/card_type/shared_card/CampaignCompletedCard";
import CampaignPendingCard from "@/components/partner/campaign_contents/card_type/shared_card/CampaignPendingCard";
import ReviewRejectedReviewCard from "@/components/partner/campaign_contents/card_type/purchase_review_card/ReviewRejectedReviewCard";
import ReviewRejectedReceiptCard from "@/components/partner/campaign_contents/card_type/purchase_review_card/ReviewRejectedReceiptCard";
import ReceiptPreviewModal from "@/components/partner/campaign_contents/ReceiptPreviewModal";
import type { CampaignApplicant } from "@/components/partner/campaign_contents/card_type/shared_card/CampaignTypes";
import type { ContentItem } from "@/data/partner/sharedCampaigns";

type TabKey = "대기" | "확인" | "완료";

export default function PurchaseReviewContentsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const initialTab: TabKey =
    searchParams?.get("tab") === "완료"
      ? "완료"
      : searchParams?.get("tab") === "확인"
      ? "확인"
      : "대기";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [sortOrder, setSortOrder] = useState<
    "latest" | "popular" | "deadline" | "point"
  >("latest");
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptImages, setReceiptImages] = useState<string[]>([]);
  // 승인된 콘텐츠 ID 목록 (로컬 상태 관리)
  const [approvedContentIds, setApprovedContentIds] = useState<Set<string>>(
    new Set()
  );

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

  // 캠페인의 contentType 및 등록 기간 가져오기
  const campaignData = id
    ? reviewCampaignsExtended.find((c) => c.id === id)
    : undefined;
  const campaignContentType = campaignData?.contentType || "link";

  // 등록 기간에서 기한 날짜 추출 (예: "2025-11-20 ~ 2025-11-27" -> "2025-11-27")
  const getDeadlineDate = (): string | undefined => {
    if (!campaignData?.detailedSchedule?.registrationPeriod) return undefined;
    const period = campaignData.detailedSchedule.registrationPeriod;
    const match = period.match(/~\s*(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : undefined;
  };
  const deadlineDate = getDeadlineDate();

  // 상태에 따라 데이터 소스 분기 (종료/취소 → closed, 그 외 → review 더미)
  const baseContents = (() => {
    if (!id) return { waiting: [], reviewing: [], completed: [] };
    const info = campaignInfo;
    if (
      info &&
      (String(info.status) === "종료" || String(info.status) === "취소")
    ) {
      const closed = getClosedContentsById(String(id));
      return closed || { waiting: [], reviewing: [], completed: [] };
    }
    const review = getPurchaseReviewContentsById(String(id));
    return review || { waiting: [], reviewing: [], completed: [] };
  })();

  // 승인된 콘텐츠를 reviewing에서 completed로 이동
  const contents = (() => {
    const reviewing = baseContents.reviewing || [];
    const completed = baseContents.completed || [];

    // 승인된 콘텐츠 필터링
    const approvedItems = reviewing.filter((item) =>
      approvedContentIds.has(item.id)
    );
    const remainingReviewing = reviewing.filter(
      (item) => !approvedContentIds.has(item.id)
    );

    return {
      waiting: baseContents.waiting || [],
      reviewing: remainingReviewing,
      completed: [...completed, ...approvedItems],
    };
  })();
  const waitingCount = contents.waiting?.length || 0;
  const reviewCount = contents.reviewing?.length || 0;
  const completedCount = contents.completed?.length || 0;

  const formatDateTime = (iso: string) => iso.slice(0, 16).replace("T", " ");

  const openReceiptModal = (images: string[] | undefined) => {
    setReceiptImages(images && images.length > 0 ? images : []);
    setIsReceiptModalOpen(true);
  };

  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setReceiptImages([]);
  };

  // 승인 핸들러: 콘텐츠를 완료 상태로 변경하고 완료 탭으로 이동
  const handleApprove = (contentId: string) => {
    setApprovedContentIds((prev) => new Set([...prev, contentId]));
    // 완료 탭으로 이동
    setActiveTab("완료");
    // URL 쿼리 파라미터도 업데이트 (선택적)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", "완료");
      window.history.pushState({}, "", url.toString());
    }
  };

  return (
    <>
      <PageHeader title="캠페인 콘텐츠 내역" />
      <section className={appStyles.campaign_application_section}>
        {campaignInfo ? (
          <Campaignbanner
            campaignInfo={campaignInfo}
            reviewingCount={reviewCount}
            completedCount={completedCount}
          />
        ) : null}

        <article className={appStyles.download_section}>
          <ExcelDownloadBtn
            onDownloadApplicants={() => {}}
            onDownloadReport={() => {}}
            hasApplicants={waitingCount + reviewCount + completedCount > 0}
            hasReport={
              campaignInfo?.status === "마감" || campaignInfo?.status === "취소"
            }
          />
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* 일괄 기한 연장 버튼 */}
            <button
              className={appStyles.batch_extension_button}
              onClick={() => {
                // TODO: 일괄 기한 연장 기능 구현
                console.log("일괄 기한 연장 클릭");
              }}
            >
              <Image
                src="/images/management_page/clock_icon.svg"
                alt="시계 아이콘"
                width={16}
                height={16}
              />
              <span>일괄 기한 연장</span>
            </button>
            <SortFilterControl
              options={sortOptions}
              value={sortOrder}
              onChange={(opt) => setSortOrder(opt.value as typeof sortOrder)}
              defaultSort="latest"
            />
          </div>
        </article>

        <article className={appStyles.tab_navigation}>
          <button
            className={`${appStyles.tab_button} ${
              activeTab === "대기" ? appStyles.active : ""
            }`}
            onClick={() => setActiveTab("대기")}
          >
            대기 <span className={appStyles.tab_count}>{waitingCount}</span>
          </button>
          <button
            className={`${appStyles.tab_button} ${
              activeTab === "확인" ? appStyles.active : ""
            }`}
            onClick={() => setActiveTab("확인")}
          >
            확인 <span className={appStyles.tab_count}>{reviewCount}</span>
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
          {(activeTab === "대기"
            ? contents.waiting || []
            : activeTab === "확인"
            ? contents.reviewing || []
            : contents.completed || []
          ).map((item: ContentItem) => {
            const brandChannel = campaignInfo?.brandName ?? item.channel;
            const isReceiptFlow = item.actionType === 1; // actionType 1 = 영수증 흐름
            const applicant: CampaignApplicant = {
              id: item.id,
              userType: item.userType,
              nickname: item.nickname,
              profileImage: item.profileImage,
              channel: brandChannel || "",
              channelId: item.channelId || "",
              registrationDate: formatDateTime(item.createdAt),
              campaignType: "review",
              reviewType: 1,
            };

            const dateLabel: "등록" | "수정" | "지각 등록" = item.isLate
              ? "지각 등록"
              : item.updatedAt
              ? "수정"
              : "등록";

            // 대기 탭: 4가지 상태 유형에 따른 카드 표시
            if (activeTab === "대기") {
              const isReceiptFlow = item.actionType === 1;
              const hasReceipt =
                item.receiptImages && item.receiptImages.length > 0;
              const hasContent = item.thumbnailSrc || item.createdAt;

              // 상태 결정 로직
              let pendingState:
                | "receipt_not_registered"
                | "content_not_registered"
                | "extension_requested"
                | "rejected";
              let isExtensionApproved = false;
              let extendedDeadline: string | undefined;

              // 1. 반려 처리된 경우
              if (item.isRejected) {
                pendingState = "rejected";
              }
              // 2. 연장 요청 상태 (추후 확장 가능: item.hasExtensionRequest 등)
              // TODO: 실제 데이터에 연장 요청 필드가 추가되면 이 부분을 수정해야 합니다
              // else if (item.hasExtensionRequest) {
              //   pendingState = "extension_requested";
              //   isExtensionApproved = item.isExtensionApproved || false;
              //   extendedDeadline = item.extendedDeadline;
              // }
              // 3. 영수증 흐름이고 영수증이 없는 경우
              else if (isReceiptFlow && !hasReceipt) {
                pendingState = "receipt_not_registered";
              }
              // 4. 콘텐츠가 없는 경우 (링크 형식)
              else {
                pendingState = "content_not_registered";
              }

              if (isReceiptFlow) {
                return (
                  <CampaignPendingCard
                    key={item.id}
                    applicant={{ ...applicant, reviewType: 4 }}
                    pendingState={pendingState}
                    isExtensionApproved={isExtensionApproved}
                    extendedDeadline={extendedDeadline}
                    deadlineDate={deadlineDate}
                    onCheckReceipt={() =>
                      openReceiptModal(item.receiptImages || [])
                    }
                    dateLabel={dateLabel}
                  />
                );
              }
              return (
                <CampaignPendingCard
                  key={item.id}
                  applicant={{ ...applicant, reviewType: 1 }}
                  pendingState={pendingState}
                  isExtensionApproved={isExtensionApproved}
                  extendedDeadline={extendedDeadline}
                  deadlineDate={deadlineDate}
                  onCheckReview={() =>
                    openReceiptModal(
                      item.thumbnailSrc ? [item.thumbnailSrc] : []
                    )
                  }
                  dateLabel={dateLabel}
                />
              );
            }

            if (activeTab === "확인") {
              // 반려 케이스
              if (item.isRejected) {
                if (isReceiptFlow) {
                  return (
                    <ReviewRejectedReceiptCard
                      key={item.id}
                      applicant={{ ...applicant, reviewType: 6 }}
                      onCheckReceipt={() =>
                        openReceiptModal(item.receiptImages)
                      }
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
                  <CampaignPendingCard
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
                  <CampaignInspectionCard
                    key={item.id}
                    applicant={{ ...applicant, reviewType: 2 }}
                    onCheckReceipt={() => openReceiptModal(item.receiptImages)}
                    onApprove={handleApprove}
                    onReject={() => {}}
                    contentType={campaignContentType}
                    dateLabel={dateLabel}
                  />
                );
              }
              return (
                <CampaignInspectionCard
                  key={item.id}
                  applicant={{ ...applicant, reviewType: 1 }}
                  onCheckReview={() =>
                    openReceiptModal(
                      item.thumbnailSrc ? [item.thumbnailSrc] : []
                    )
                  }
                  onCheckImage={
                    campaignContentType === "image"
                      ? () =>
                          openReceiptModal(
                            item.thumbnailSrc ? [item.thumbnailSrc] : []
                          )
                      : undefined
                  }
                  onCheckLink={() => {
                    // 링크 확인: 실제로는 링크 URL을 열어야 함
                    // TODO: 실제 링크 URL을 item에서 가져와서 열기
                    console.log("링크 확인 클릭", applicant.id);
                    // 예시: window.open(linkUrl, '_blank');
                  }}
                  onApprove={handleApprove}
                  onReject={() => {}}
                  contentType={campaignContentType}
                  dateLabel={dateLabel}
                />
              );
            }

            // 완료 탭: 영수증 흐름이면 영수증 확인 라벨/핸들러, 아니면 리뷰 확인
            return (
              <CampaignCompletedCard
                key={item.id}
                applicant={{
                  ...applicant,
                  reviewType: isReceiptFlow ? 2 : 3,
                }}
                onCheckReceipt={
                  isReceiptFlow
                    ? () => openReceiptModal(item.receiptImages)
                    : undefined
                }
                onCheckReview={
                  !isReceiptFlow
                    ? () =>
                        openReceiptModal(
                          item.thumbnailSrc ? [item.thumbnailSrc] : []
                        )
                    : undefined
                }
                onCheckImage={
                  campaignContentType === "both" ||
                  campaignContentType === "image"
                    ? () =>
                        openReceiptModal(
                          item.thumbnailSrc ? [item.thumbnailSrc] : []
                        )
                    : undefined
                }
                onCheckLink={
                  campaignContentType === "both"
                    ? () => {
                        // 링크 확인: 실제로는 링크 URL을 열어야 함
                        // TODO: 실제 링크 URL을 item에서 가져와서 열기
                        console.log("링크 확인 클릭", applicant.id);
                        // 예시: window.open(linkUrl, '_blank');
                      }
                    : undefined
                }
                contentType={campaignContentType}
                dateLabel={dateLabel}
              />
            );
          })}
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
