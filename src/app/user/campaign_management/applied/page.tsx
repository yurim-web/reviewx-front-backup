/* ========================================
   캠페인 관리 - 신청 탭 페이지
   ======================================== */

/**
 * AppliedPage
 *
 * 목적: 신청 상태의 캠페인 목록을 보여주는 페이지
 *
 * 사용 페이지:
 * - /user/campaign_management/applied (신청 탭)
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import CampaignManagementHeader from "@/components/user/campaign_management/CampaignManagementHeader";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import type { MainTab } from "@/types/domain/user";
import type { CampaignApplication } from "@/types/domain/user";
import layoutStyles from "@/styles/user/campaign_management/campaign_management_layout.module.css";
import { withUserAuth } from "@/components/auth/withAuth";
import { useAuth } from "@/hooks/useAuth";
import { useWindowFocus } from "@/hooks/common/useWindowFocus";
import {
  CAMPAIGN_TYPE_KO,
  CAMPAIGN_TYPE_STORAGE_KEY,
  CAMPAIGN_TYPE_ID_PREFIX,
  normalizeChannelName,
  getAllStaticCampaigns,
  matchCampaignId,
  type StoredCampaignEntry,
  type UserAppliedCampaigns,
  type CampaignTypeEn,
} from "@/lib/campaign/campaignTypeUtils";

import {
  getCampaignsByTab,
  campaignManagementStats,
} from "@/data/user/campaign_management/campaignManagementData";

import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";

function AppliedPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<MainTab>("campaign");
  const [activeStatTab] = useState<"신청">("신청");
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignApplication[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignApplication[]>([]);
  const [statsReady, setStatsReady] = useState(false);

  /** 선정 발표일이 오늘이거나 지났는지 확인 */
  const isAnnouncementDatePassed = useCallback((campaignId: string): boolean => {
    const actualCampaign = getAllStaticCampaigns().find((c) => c.id === campaignId);

    if (!actualCampaign?.detailedSchedule?.announcement) return false;

    const announcementDateStr = actualCampaign.detailedSchedule.announcement.trim();
    const [year, month, day] = announcementDateStr.split("-").map(Number);

    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) return false;

    const announcementDate = new Date(year, month - 1, day);
    announcementDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return announcementDate <= today;
  }, []);

  /** 선정 발표일 기준 남은 일수 계산 */
  const calculateRemainingDays = useCallback(
    (campaignId: string): { remainingDays: number; isUrgent: boolean } => {
      const actualCampaign = getAllStaticCampaigns().find((c) => c.id === campaignId);

      if (!actualCampaign?.detailedSchedule?.announcement) {
        return { remainingDays: 7, isUrgent: false };
      }

      const announcementDateStr = actualCampaign.detailedSchedule.announcement.trim();
      const [year, month, day] = announcementDateStr.split("-").map(Number);

      if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
        return { remainingDays: 0, isUrgent: false };
      }

      const announcementDate = new Date(year, month - 1, day);
      announcementDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (announcementDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return { remainingDays: diffDays, isUrgent: diffDays <= 3 && diffDays >= 0 };
    },
    []
  );

  /** localStorage에서 캠페인 데이터를 찾고 채널 정보를 추출 */
  const findCampaignAndChannel = useCallback(
    (entry: StoredCampaignEntry): { actualCampaign: unknown; channel: string } => {
      const { campaignId, campaignType, channel: storedChannel } = entry;
      let actualCampaign: unknown = null;
      let channel = storedChannel ?? "";

      const storageKey = CAMPAIGN_TYPE_STORAGE_KEY[campaignType as CampaignTypeEn];
      const prefix = CAMPAIGN_TYPE_ID_PREFIX[campaignType as CampaignTypeEn] ?? "";

      // 1. localStorage에서 찾기
      if (storageKey && typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(storageKey);
          if (stored) {
            const storedCampaigns = JSON.parse(stored) as Array<Record<string, unknown>>;
            const found = storedCampaigns.find((camp) => {
              const campId = String(
                (camp.campaignInfo as Record<string, unknown>)?.id ?? camp.id ?? ""
              );
              return matchCampaignId(campId, String(campaignId), prefix);
            });
            if (found) {
              actualCampaign = found;
              if (!channel) {
                channel =
                  String((found.campaignInfo as Record<string, unknown>)?.channel ?? "") ||
                  String((found as Record<string, unknown>).channel ?? "") ||
                  "";
              }
            }
          }
        } catch {
          // localStorage 읽기 실패 시 정적 데이터로 폴백
        }
      }

      // 2. 정적 데이터에서 찾기
      if (!actualCampaign) {
        const allCampaigns = getAllStaticCampaigns();
        const found = allCampaigns.find((camp) => {
          const campId = String(
            (camp as unknown as Record<string, unknown>).campaignInfo
              ? (
                  (camp as unknown as Record<string, unknown>).campaignInfo as Record<
                    string,
                    unknown
                  >
                )?.id
              : camp.id
          );
          return matchCampaignId(campId, String(campaignId), prefix);
        });

        if (found) {
          actualCampaign = found;
          if (!channel || channel.trim() === "") {
            if (campaignType === "reporter") {
              channel = String((found as unknown as Record<string, unknown>).channel ?? "");
              // 기자단 전용 재시도
              if (!channel) {
                const reporterCampaign = reporterCampaigns.find((camp) => {
                  const campId = String(camp.id ?? "");
                  return matchCampaignId(campId, String(campaignId), "reporter_");
                });
                channel = String(
                  (reporterCampaign as unknown as Record<string, unknown>)?.channel ?? ""
                );
              }
            } else {
              channel =
                String(
                  (found as unknown as Record<string, unknown>).campaignInfo
                    ? (
                        (found as unknown as Record<string, unknown>).campaignInfo as Record<
                          string,
                          unknown
                        >
                      )?.channel
                    : ""
                ) ||
                String((found as unknown as Record<string, unknown>).channel ?? "") ||
                "";
            }
          }
        }
      }

      return { actualCampaign, channel };
    },
    []
  );

  /** localStorage + 목업 데이터에서 신청 캠페인 로드 */
  const loadUserAppliedCampaigns = useCallback((): CampaignApplication[] => {
    if (!user) return [];

    const mockCampaigns = getCampaignsByTab("신청");
    let localStorageCampaigns: CampaignApplication[] = [];

    const raw = localStorage.getItem("user_applied_campaigns");
    if (raw) {
      try {
        const allApplied = JSON.parse(raw) as UserAppliedCampaigns[];
        const userCampaigns = allApplied.find((uc) => uc.userId === user.id);

        if (userCampaigns?.campaigns) {
          localStorageCampaigns = userCampaigns.campaigns
            .filter((c) => c.status === "대기")
            .map((c): CampaignApplication | null => {
              const { actualCampaign, channel } = findCampaignAndChannel(c);
              const type = CAMPAIGN_TYPE_KO[c.campaignType as CampaignTypeEn] ?? "배송형";

              if (!actualCampaign) {
                return {
                  id: c.campaignId,
                  title: c.campaignTitle ?? "캠페인명 없음",
                  category: "",
                  image: c.campaignImage ?? "/images/default_campaign.png",
                  status: "신청" as const,
                  remainingDays: 0,
                  statusMessage: "캠페인 선정 발표까지 대기 중입니다.",
                  type,
                  isUrgent: false,
                };
              }

              const ac = actualCampaign as Record<string, unknown>;
              const campaignInfo = ac.campaignInfo as Record<string, unknown> | undefined;
              const category =
                channel && ["배송형", "방문형", "기자단"].includes(type)
                  ? normalizeChannelName(channel)
                  : "";

              return {
                id: c.campaignId,
                title: String(
                  campaignInfo?.title ?? ac.title ?? c.campaignTitle ?? "캠페인명 없음"
                ),
                category,
                image: String(
                  campaignInfo?.image ??
                    ac.image ??
                    c.campaignImage ??
                    "/images/default_campaign.png"
                ),
                status: "신청" as const,
                remainingDays: 0,
                statusMessage: "캠페인 선정 발표까지 대기 중입니다.",
                type,
                isUrgent: Boolean(ac.isUrgent ?? false),
              };
            })
            .filter((c): c is CampaignApplication => c !== null);
        }
      } catch {
        // 파싱 실패 시 목업 데이터만 사용
      }
    }

    const allCampaigns = [...mockCampaigns];
    localStorageCampaigns.forEach((lsCampaign) => {
      if (!allCampaigns.some((c) => c.id === lsCampaign.id)) {
        allCampaigns.push(lsCampaign);
      }
    });

    return allCampaigns;
  }, [user, findCampaignAndChannel]);

  /** 신청 탭 통계 계산 */
  const calculateStats = useCallback(() => {
    if (!user) return campaignManagementStats;

    const mockStats = { ...campaignManagementStats };
    const raw = localStorage.getItem("user_applied_campaigns");
    if (!raw) return mockStats;

    try {
      const allApplied = JSON.parse(raw) as UserAppliedCampaigns[];
      const userCampaigns = allApplied.find((uc) => uc.userId === user.id);
      if (!userCampaigns?.campaigns) return mockStats;

      const list = userCampaigns.campaigns;
      const 신청 =
        mockStats.신청 +
        list.filter((c) => c.status === "대기" && !isAnnouncementDatePassed(c.campaignId)).length;
      const 선정 = mockStats.선정 + list.filter((c) => c.status === "선정").length;
      const 완료 = mockStats.완료 + list.filter((c) => c.status === "완료").length;
      const 취소반려 =
        mockStats["취소/반려"] +
        list.filter((c) => c.status === "취소" || c.status === "반려").length;

      return {
        신청,
        선정,
        완료,
        "취소/반려": 취소반려,
        전체: 신청 + 선정 + 완료 + 취소반려,
        패널티: mockStats.패널티,
      };
    } catch {
      return mockStats;
    }
  }, [user, isAnnouncementDatePassed]);

  const loadCampaigns = useCallback(() => {
    const loaded = loadUserAppliedCampaigns();
    // 선정 발표일 지난 캠페인 제거
    const filtered = loaded.filter((c) => !isAnnouncementDatePassed(c.id));
    // remainingDays / isUrgent 계산
    const enriched = filtered.map((c) => {
      const { remainingDays, isUrgent } = calculateRemainingDays(c.id);
      return { ...c, remainingDays, isUrgent };
    });
    setCampaigns(enriched);
  }, [loadUserAppliedCampaigns, isAnnouncementDatePassed, calculateRemainingDays]);

  useEffect(() => {
    loadCampaigns();
    setStatsReady(true);
  }, [loadCampaigns]);

  useWindowFocus(loadCampaigns);

  const displayStats = (() => {
    const base = calculateStats();
    const 신청 = campaigns.length;
    return {
      ...base,
      신청,
      전체: 신청 + base.선정 + base.완료 + base["취소/반려"],
    };
  })();

  const handleFilteredCampaignsChange = (filtered: CampaignApplication[]) => {
    setFilteredCampaigns(filtered);
  };

  const handleCancelSuccess = (campaignId: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    setFilteredCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
  };

  return (
    <div className={layoutStyles.container}>
      <div className={layoutStyles.main_content}>
        <CampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
          stats={statsReady ? displayStats : undefined}
        />
        <CampaignFilterBar<CampaignApplication>
          campaigns={campaigns}
          onFilteredCampaignsChange={handleFilteredCampaignsChange}
          showSearch={false}
        />
        <CampaignList
          campaigns={filteredCampaigns}
          activeStatTab="신청"
          onCancelSuccess={handleCancelSuccess}
          originalCampaigns={campaigns}
        />
      </div>
    </div>
  );
}

export default withUserAuth(AppliedPage);
