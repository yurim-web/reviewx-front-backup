/* ========================================
   📰 기자단 콘텐츠 내역 상세 (id 연동) - 검수/완료 탭
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
import { getReporterContentsById } from "@/data/partner/reporter";
import { getClosedContentsById } from "@/data/partner/sharedCampaigns";
import ExperienceInspectionCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceInspectionCard";
import ExperienceCompletedCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceCompletedCard";
import ExperienceRejectedCard from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceRejectedCard";
import type { ExperienceApplicant } from "@/components/partner/campaign_contents/card_type/experience_card/ExperienceTypes";

type TabKey = "검수" | "완료";

export default function ReporterContentsDetailPage() {
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
    return getReporterContentsById(String(id));
  })();
  const reviewCount = contents.reviewing.length;
  const completedCount = contents.completed.length;

  // ISO → 'YYYY-MM-DD HH:mm' 포맷 변환
  const formatDateTime = (iso: string) => iso.slice(0, 16).replace("T", " ");

  return (
    <>
      {/* 페이지 제목 - 공용 컴포넌트 */}
      <PageHeader title="캠페인 콘텐츠 내역" />

      {/* 메인 콘텐츠 */}
      <section className={appStyles.campaign_application_section}>
        {campaignInfo ? <Campaignbanner campaignInfo={campaignInfo} /> : null}

        {/* 다운로드 버튼 */}
        <article className={appStyles.download_section}>
          <ExcelDownloadBtn
            onDownloadApplicants={() => {}}
            onDownloadSelected={() => {}}
            onDownloadReport={() => {}}
          />
          {/* 정렬 버튼 + 모달 */}
          <SortFilterControl
            options={sortOptions}
            value={sortOrder}
            onChange={(opt) => setSortOrder(opt.value as typeof sortOrder)}
            defaultSort="latest"
          />
        </article>

        {/* 신청내역 탭 네비게이션 - 신청/선정만 표시 */}
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

        {/* 카드 그리드 */}
        <article className={appStyles.applicants_grid}>
          {(activeTab === "검수" ? contents.reviewing : contents.completed).map(
            (item) => {
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
              };

              const dateLabel: "등록" | "수정" | "지각 등록" = item.isLate
                ? "지각 등록"
                : item.updatedAt
                ? "수정"
                : "등록";

              if (activeTab === "검수") {
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
                    onApprove={() => {}}
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
                />
              );
            }
          )}
        </article>
      </section>
    </>
  );
}
