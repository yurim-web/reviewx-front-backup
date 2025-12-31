/* ========================================
   🎯 미션형 콘텐츠 내역 상세 (id 연동)
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
  getMissionContentsById,
  missionCampaignsExtended,
} from "@/data/campaign/mission/missionCampaigns";
import CampaignInspectionCard from "@/components/partner/campaign_contents/card_type/shared_card/CampaignInspectionCard";
import CampaignCompletedCard from "@/components/partner/campaign_contents/card_type/shared_card/CampaignCompletedCard";
import CampaignPendingCard from "@/components/partner/campaign_contents/card_type/shared_card/CampaignPendingCard";
import type { CampaignApplicant } from "@/components/partner/campaign_contents/card_type/shared_card/CampaignTypes";
import type { ContentItem } from "@/data/partner/sharedCampaigns";

type TabKey = "대기" | "확인" | "완료";

export default function MissionContentsDetailPage() {
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
  // 승인된 콘텐츠 ID 추적
  const [approvedContentIds, setApprovedContentIds] = useState<Set<string>>(
    new Set()
  );

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "deadline", label: "마감임박순" },
    { value: "point", label: "포인트순" },
  ];

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
    ? missionCampaignsExtended.find((c) => c.id === id)
    : undefined;
  const campaignContentType = campaignData?.contentType || "link";

  // 등록 기간에서 기한 날짜 추출 (예: "2025-12-23 ~ 2025-12-30" -> "2025-12-30")
  const getDeadlineDate = (): string | undefined => {
    if (!campaignData?.detailedSchedule?.registrationPeriod) return undefined;
    const period = campaignData.detailedSchedule.registrationPeriod;
    const match = period.match(/~\s*(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : undefined;
  };
  const deadlineDate = getDeadlineDate();

  // 상태에 따라 데이터 소스 분기 (종료/취소 → closed, 그 외 → mission)
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
    // sharedCampaigns에 contents가 있으면 우선 사용
    const shared = getCampaignById(String(id));
    if (shared && (shared as any).contents) {
      return (shared as any).contents;
    }
    const mission = getMissionContentsById(String(id));
    return mission || { waiting: [], reviewing: [], completed: [] };
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
            const effectiveMissionType = (item as any).missionType;
            const applicant: CampaignApplicant = {
              id: item.id,
              userType: item.userType,
              nickname: item.nickname,
              profileImage: item.profileImage,
              channel: brandChannel || "",
              channelId: item.channelId || "",
              registrationDate: formatDateTime(item.createdAt),
              campaignType: "mission",
              missionType: (effectiveMissionType as any) ?? 1,
            };

            const dateLabel: "등록" | "수정" | "지각 등록" = item.isLate
              ? "지각 등록"
              : item.updatedAt
              ? "수정"
              : "등록";

            const toInspectionType = (actionType?: number): 1 | 2 | 3 => {
              if (actionType === 2) return 1; // 이미지+링크
              if (actionType === 3) return 2; // 이미지만
              if (actionType === 4) return 3; // 링크만
              return 1; // 기본값
            };
            const toCompletedType = (actionType?: number): 7 | 8 | 9 => {
              if (actionType === 2) return 7;
              if (actionType === 3) return 8;
              if (actionType === 4) return 9;
              return 7;
            };

            // 대기 탭: 콘텐츠 미등록 상태 카드 표시
            if (activeTab === "대기") {
              // 미션형 대기 탭 상태 결정
              let pendingState:
                | "receipt_not_registered"
                | "content_not_registered"
                | "extension_requested"
                | "rejected" = "content_not_registered";

              if (item.isRejected) {
                pendingState = "rejected";
              }
              // TODO: 연장 요청 상태는 추후 데이터에 필드가 추가되면 처리

              return (
                <CampaignPendingCard
                  key={item.id}
                  applicant={{
                    ...applicant,
                    missionType:
                      (effectiveMissionType as any) ??
                      toInspectionType(item.actionType),
                  }}
                  pendingState={pendingState}
                  deadlineDate={deadlineDate}
                  onCheckLink={() => {}}
                  onCheckImage={() => {}}
                  onApprove={() => {}}
                  onReject={() => {}}
                  contentType={campaignContentType}
                  dateLabel={dateLabel}
                />
              );
            }

            if (activeTab === "확인") {
              if (item.isRejected) {
                // 반려된 항목은 CampaignPendingCard로 표시 (pendingState: "rejected")
                return (
                  <CampaignPendingCard
                    key={item.id}
                    applicant={{
                      ...applicant,
                      missionType:
                        (effectiveMissionType as any) ??
                        toInspectionType(item.actionType),
                    }}
                    pendingState="rejected"
                    onCheckLink={() => {}}
                    onCheckImage={() => {}}
                    contentType={campaignContentType}
                    dateLabel={dateLabel}
                  />
                );
              }
              return (
                <CampaignInspectionCard
                  key={item.id}
                  applicant={{
                    ...applicant,
                    missionType:
                      (effectiveMissionType as any) ??
                      toInspectionType(item.actionType),
                  }}
                  onCheckLink={() => {}}
                  onCheckImage={() => {}}
                  onApprove={handleApprove}
                  onReject={() => {}}
                  contentType={campaignContentType}
                  dateLabel={dateLabel}
                />
              );
            }

            return (
              <CampaignCompletedCard
                key={item.id}
                applicant={{
                  ...applicant,
                  missionType:
                    (effectiveMissionType as any) ??
                    toCompletedType(item.actionType),
                }}
                onCheckLink={() => {}}
                onCheckImage={() => {}}
                contentType={campaignContentType}
                dateLabel={dateLabel}
              />
            );
          })}
        </article>
      </section>
    </>
  );
}
