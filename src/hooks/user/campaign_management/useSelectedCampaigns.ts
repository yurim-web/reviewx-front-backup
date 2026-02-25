/* ========================================
   선정 캠페인 데이터 커스텀 훅
   ======================================== */

/**
 * useSelectedCampaigns
 *
 * 목적: 선정 탭의 캠페인 데이터 로드, 남은 일수 계산, 통계 계산 로직을 관리합니다.
 *
 * 사용 페이지:
 * - /user/campaign_management/selected (선정 탭)
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWindowFocus } from "@/hooks/common/useWindowFocus";
import {
  CAMPAIGN_TYPE_KO,
  CAMPAIGN_TYPE_STORAGE_KEY,
  normalizeChannelName,
  getAllStaticCampaigns,
  type UserAppliedCampaigns,
  type CampaignTypeEn,
} from "@/lib/campaign/campaignTypeUtils";
import {
  getCampaignsByTab,
  campaignManagementStats,
} from "@/data/user/campaign_management/campaignManagementData";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";
import type { CampaignApplication } from "@/types/domain/user";

export function useSelectedCampaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignApplication[]>([]);
  const [stats, setStats] = useState(() => campaignManagementStats);

  const calculateRemainingDays = useCallback(
    (
      campaignId: string,
      campaignType: CampaignApplication["type"]
    ): { remainingDays: number; isUrgent: boolean } => {
      const actualCampaign = getAllStaticCampaigns().find((c) => c.id === campaignId);
      if (!actualCampaign?.detailedSchedule) return { remainingDays: 0, isUrgent: false };

      let registrationPeriod: string | null = null;
      if (campaignType === "방문형") {
        registrationPeriod =
          "purchasePeriod" in actualCampaign.detailedSchedule
            ? (actualCampaign.detailedSchedule.purchasePeriod as string)
            : null;
      } else {
        registrationPeriod =
          "registrationPeriod" in actualCampaign.detailedSchedule
            ? (actualCampaign.detailedSchedule.registrationPeriod as string)
            : null;
      }

      if (!registrationPeriod) return { remainingDays: 0, isUrgent: false };

      const endDateStr = registrationPeriod.split("~")[1]?.trim();
      if (!endDateStr) return { remainingDays: 0, isUrgent: false };

      const registrationEndDate = new Date(endDateStr);
      registrationEndDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffDays = Math.ceil(
        (registrationEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return { remainingDays: diffDays, isUrgent: diffDays <= 3 };
    },
    []
  );

  const getContentTypeFromCampaign = useCallback(
    (
      campaignId: string,
      campaignType: CampaignApplication["type"]
    ): "link" | "image" | "both" | undefined => {
      if (campaignType !== "미션형") return undefined;
      const mission = missionCampaigns.find((c) => c.id === campaignId);
      if (mission && "contentType" in mission) return mission.contentType;
      return undefined;
    },
    []
  );

  const loadUserSelectedCampaigns = useCallback((): CampaignApplication[] => {
    if (!user) return [];

    const mockCampaigns = getCampaignsByTab("선정");
    let localStorageCampaigns: CampaignApplication[] = [];

    const raw = localStorage.getItem("user_applied_campaigns");
    if (raw) {
      try {
        const allApplied = JSON.parse(raw) as UserAppliedCampaigns[];
        const userCampaigns = allApplied.find((uc) => uc.userId === user.id);

        if (userCampaigns?.campaigns) {
          localStorageCampaigns = userCampaigns.campaigns
            .filter((c) => c.status === "선정")
            .map((c): CampaignApplication | null => {
              const { campaignId, campaignType } = c;
              const storageKey = CAMPAIGN_TYPE_STORAGE_KEY[campaignType as CampaignTypeEn];
              let actualCampaign: Record<string, unknown> | null = null;
              let channel = c.channel ?? "";

              if (storageKey && typeof window !== "undefined") {
                try {
                  const stored = localStorage.getItem(storageKey);
                  if (stored) {
                    const storedCampaigns = JSON.parse(stored) as Array<Record<string, unknown>>;
                    const found = storedCampaigns.find((camp) => {
                      const campId = String(
                        (camp.campaignInfo as Record<string, unknown>)?.id ?? camp.id ?? ""
                      );
                      const sid = String(campaignId);
                      return campId === sid || campId.includes(sid) || sid.includes(campId);
                    });
                    if (found) {
                      actualCampaign = found;
                      if (!channel) {
                        channel =
                          String((found.campaignInfo as Record<string, unknown>)?.channel ?? "") ||
                          String(found.channel ?? "") ||
                          "";
                      }
                    }
                  }
                } catch {
                  // localStorage 읽기 실패 시 정적 데이터로 폴백
                }
              }

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
                  const sid = String(campaignId);
                  return campId === sid || campId.includes(sid) || sid.includes(campId);
                });

                if (found) {
                  actualCampaign = found as unknown as Record<string, unknown>;
                  if (!channel || channel.trim() === "") {
                    channel =
                      campaignType === "reporter"
                        ? String(actualCampaign.channel ?? "")
                        : String(
                            (actualCampaign.campaignInfo as Record<string, unknown>)?.channel ?? ""
                          ) ||
                          String(actualCampaign.channel ?? "") ||
                          "";
                  }
                }
              }

              if (!actualCampaign) return null;

              const type = CAMPAIGN_TYPE_KO[campaignType as CampaignTypeEn] ?? "배송형";
              const category = channel ? normalizeChannelName(channel) : "";
              const campaignInfo = actualCampaign.campaignInfo as
                | Record<string, unknown>
                | undefined;

              return {
                id: campaignId,
                title: String(
                  campaignInfo?.title ?? actualCampaign.title ?? c.campaignTitle ?? "캠페인명 없음"
                ),
                category,
                image: String(
                  campaignInfo?.image ??
                    actualCampaign.image ??
                    c.campaignImage ??
                    "/images/default_campaign.png"
                ),
                status: "선정" as const,
                remainingDays: 0,
                statusMessage: "콘텐츠 등록 기간입니다.",
                type,
                isUrgent: false,
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
  }, [user]);

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
      const 신청 = mockStats.신청 + list.filter((c) => c.status === "대기").length;
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
  }, [user]);

  const loadCampaigns = useCallback(() => {
    const loaded = loadUserSelectedCampaigns();
    const enriched = loaded.map((c) => {
      const { remainingDays, isUrgent } = calculateRemainingDays(c.id, c.type);
      const contentType = getContentTypeFromCampaign(c.id, c.type);
      return {
        ...c,
        remainingDays,
        isUrgent,
        contentType: contentType ?? c.contentType,
      };
    });
    setCampaigns(enriched);
  }, [loadUserSelectedCampaigns, calculateRemainingDays, getContentTypeFromCampaign]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  useWindowFocus(loadCampaigns);

  useEffect(() => {
    setStats(calculateStats());
  }, [campaigns, calculateStats]);

  return { campaigns, stats };
}
