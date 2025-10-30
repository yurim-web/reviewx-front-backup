/* ========================================
   🎯 미션형 콘텐츠 내역 상세 (id 연동)
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
import { getMissionContentsById } from "@/data/partner/campaign_contents/mission";
import MissionInspectionCard from "@/components/partner/campaign_contents/card_type/mission_card/MissionInspectionCard";
import MissionCompletedCard from "@/components/partner/campaign_contents/card_type/mission_card/MissionCompletedCard";
import MissionRejectedCard from "@/components/partner/campaign_contents/card_type/mission_card/MissionRejectedCard";
import type { ExperienceApplicant as MissionApplicant } from "@/components/partner/campaign_contents/card_type/mission_card/MissionTypes";
import type { ContentItem } from "@/data/partner/campaign_contents/types";

type TabKey = "검수" | "완료";

export default function MissionContentsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const initialTab: TabKey =
    searchParams?.get("tab") === "완료" ? "완료" : "검수";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [sortOrder, setSortOrder] = useState<
    "latest" | "popular" | "deadline" | "point"
  >("latest");

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

  // 상태에 따라 데이터 소스 분기 (종료/취소 → closed, 그 외 → mission)
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
    // sharedCampaigns에 contents가 있으면 우선 사용
    const shared = getCampaignById(String(id));
    if (shared && (shared as any).contents) {
      return (shared as any).contents;
    }
    return getMissionContentsById(String(id));
  })();
  const reviewCount = contents.reviewing.length;
  const completedCount = contents.completed.length;

  const formatDateTime = (iso: string) => iso.slice(0, 16).replace("T", " ");

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
              const effectiveMissionType = (item as any).missionType;
              const applicant: MissionApplicant = {
                id: item.id,
                userType: item.userType,
                nickname: item.nickname,
                profileImage: item.profileImage,
                channel: brandChannel || "",
                channelId: item.channelId || "",
                registrationDate: formatDateTime(item.createdAt),
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
              const toRejectedType = (actionType?: number): 4 | 5 | 6 => {
                if (actionType === 2) return 4; // 이미지+링크
                if (actionType === 3) return 5; // 이미지만
                if (actionType === 4) return 6; // 링크만
                return 4;
              };
              const toCompletedType = (actionType?: number): 7 | 8 | 9 => {
                if (actionType === 2) return 7;
                if (actionType === 3) return 8;
                if (actionType === 4) return 9;
                return 7;
              };

              if (activeTab === "검수") {
                if (item.isRejected) {
                  return (
                    <MissionRejectedCard
                      key={item.id}
                      applicant={{
                        ...applicant,
                        missionType:
                          (effectiveMissionType as any) ??
                          toRejectedType(item.actionType),
                      }}
                      onCheckLink={() => {}}
                      onCheckImage={() => {}}
                      onHandleReject={() => {}}
                      dateLabel={dateLabel}
                    />
                  );
                }
                return (
                  <MissionInspectionCard
                    key={item.id}
                    applicant={{
                      ...applicant,
                      missionType:
                        (effectiveMissionType as any) ??
                        toInspectionType(item.actionType),
                    }}
                    onCheckLink={() => {}}
                    onCheckImage={() => {}}
                    onApprove={() => {}}
                    onReject={() => {}}
                    dateLabel={dateLabel}
                  />
                );
              }

              return (
                <MissionCompletedCard
                  key={item.id}
                  applicant={{
                    ...applicant,
                    missionType:
                      (effectiveMissionType as any) ??
                      toCompletedType(item.actionType),
                  }}
                  onCheckLink={() => {}}
                  onCheckImage={() => {}}
                  dateLabel={dateLabel}
                />
              );
            }
          )}
        </article>
      </section>
    </>
  );
}
