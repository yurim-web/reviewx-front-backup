/* ========================================
   🏬 방문형 콘텐츠 내역 상세 (id 연동) - 대기/확인/완료 탭
   ======================================== */
"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/partner/campaign_contents.module.css";
import appStyles from "@/styles/partner/campaign_application/campaign_application.module.css";
import layoutStyles from "@/styles/partner/layout.module.css";
import SortFilterControl from "@/components/partner/campaign_application/SortFilterControl";
import Campaignbanner from "@/components/partner/campaign_application/CampaignInfoBox";
import PageHeader from "@/components/partner/campaign_application/PageHeader";
import ExcelDownloadBtn from "@/components/partner/campaign_application/ExcelDownloadBtn";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import { getVisitContentsById } from "@/data/campaign/visit/visitCampaigns";
import { getClosedContentsById } from "@/data/partner/sharedCampaigns";
import ExperienceInspectionCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceInspectionCard";
import ExperiencePendingCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperiencePendingCard";
import ExperienceCompletedCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceCompletedCard";
import ExperienceRejectedCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceRejectedCard";
import type { ExperienceApplicant } from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceTypes";

type TabKey = "대기" | "확인" | "완료";

export default function VisitContentsDetailPage() {
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

  // 기본 전역 헤더 숨기기 (레이아웃의 PartnerHeader만 표시)
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
  // 캠페인 상태에 따라 데이터 소스 분기
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
    const visit = getVisitContentsById(String(id));
    return visit || { waiting: [], reviewing: [], completed: [] };
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

  // ISO → 'YYYY-MM-DD HH:mm' 포맷 변환
  const formatDateTime = (iso: string) => iso.slice(0, 16).replace("T", " ");

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
      {/* 페이지 제목 - 공용 컴포넌트 */}
      <PageHeader title="캠페인 콘텐츠 내역" />

      {/* 메인 콘텐츠 */}
      <section className={appStyles.campaign_application_section}>
        {campaignInfo ? (
          <Campaignbanner
            campaignInfo={campaignInfo}
            reviewingCount={reviewCount}
            completedCount={completedCount}
          />
        ) : null}

        {/* 다운로드 버튼 */}
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
            {/* 정렬 버튼 + 모달 */}
            <SortFilterControl
              options={sortOptions}
              value={sortOrder}
              onChange={(opt) => setSortOrder(opt.value as typeof sortOrder)}
              defaultSort="latest"
            />
          </div>
        </article>

        {/* 신청내역 탭 네비게이션 - 대기/확인/완료 표시 */}
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

        {/* 카드 그리드 */}
        <article className={appStyles.applicants_grid}>
          {(activeTab === "대기"
            ? contents.waiting || []
            : activeTab === "확인"
            ? contents.reviewing || []
            : contents.completed || []
          ).map((item) => {
            // 콘텐츠 → 경험형 카드 데이터 매핑 (신청내역 카드 형태 맞춤)
            const brandChannel = campaignInfo?.brandName ?? item.channel;
            const applicant: ExperienceApplicant = {
              id: item.id,
              userType: item.userType,
              nickname: item.nickname,
              profileImage: item.profileImage,
              channel: brandChannel || "",
              channelId: item.channelId || "",
              registrationDate: formatDateTime(item.createdAt),
              updatedAt: item.updatedAt
                ? formatDateTime(item.updatedAt)
                : undefined,
            };

            const dateLabel: "등록" | "수정" | "지각 등록" = item.isLate
              ? "지각 등록"
              : item.updatedAt
              ? "수정"
              : "등록";

            // 대기 탭: 4가지 상태 유형에 따른 카드 표시
            if (activeTab === "대기") {
              // 상태 결정 로직
              let pendingState:
                | "content_not_registered"
                | "extension_requested"
                | "rejected";
              let isExtensionApproved = false;
              let extendedDeadline: string | undefined;
              let deadlineDate: string | undefined;

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
              // 3. 기본 상태: 콘텐츠 미등록
              else {
                pendingState = "content_not_registered";
              }

              return (
                <ExperiencePendingCard
                  key={item.id}
                  applicant={applicant}
                  pendingState={pendingState}
                  isExtensionApproved={isExtensionApproved}
                  extendedDeadline={extendedDeadline}
                  deadlineDate={deadlineDate}
                  onContentCheck={() => {}}
                  dateLabel={dateLabel}
                />
              );
            }

            if (activeTab === "확인") {
              if (item.isRejected) {
                return (
                  <ExperienceRejectedCard
                    key={item.id}
                    applicant={applicant}
                    onContentCheck={() => {}}
                    onHandleReject={() => {}}
                    dateLabel={dateLabel}
                  />
                );
              }
              return (
                <ExperienceInspectionCard
                  key={item.id}
                  applicant={applicant}
                  onContentCheck={() => {}}
                  onApprove={handleApprove}
                  onReject={() => {}}
                  dateLabel={dateLabel}
                />
              );
            }
            return (
              <ExperienceCompletedCard
                key={item.id}
                applicant={applicant}
                onContentCheck={() => {}}
                dateLabel={dateLabel}
                isLate={item.isLate || false}
                onApprove={handleApprove}
                onReject={() => {}}
              />
            );
          })}
        </article>
      </section>
    </>
  );
}
