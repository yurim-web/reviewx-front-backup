/* ========================================
   🎯 선정 탭 전용 페이지
   ======================================== */

/**
 * 선정 탭 전용 페이지
 *
 * 목적: 선정 상태의 캠페인 목록을 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /user/campaign_management/selected
 *
 * 주요 기능:
 * - 선정 상태의 캠페인 목록 표시
 * - 캠페인별 액션 버튼 (콘텐츠 등록, 구매 영수증 등록 등)
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 */

"use client";

import { useState, useEffect } from "react";
import CampaignManagementHeader from "@/components/user/campaign_management/CampaignManagementHeader";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import CampaignFilterBar from "@/components/common/campaign_management/CampaignFilterBar";
import type { MainTab } from "@/types/domain/user";
import type { CampaignApplication } from "@/types/domain/user";
import layoutStyles from "../../../../styles/user/campaign_management/layout.module.css";
import { withUserAuth } from "@/components/auth/withAuth";
import { useAuth } from "@/hooks/useAuth";

// 임시 데이터 import
import {
  getCampaignsByTab,
  campaignManagementStats,
} from "@/data/user/campaign_management/campaignManagementData";

// 실제 캠페인 데이터 import (registrationPeriod 날짜 가져오기 위해)
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";

/**
 * 선정 탭 전용 페이지 컴포넌트
 */
function SelectedPage() {
  const { user } = useAuth();

  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");

  // 통계 탭 상태 - 선정 탭이 활성화된 상태로 설정
  const [activeStatTab, setActiveStatTab] = useState<
    "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  >("선정");

  // 필터링된 캠페인 목록 상태
  const [filteredCampaigns, setFilteredCampaigns] = useState<
    CampaignApplication[]
  >([]);

  /**
   * 실제 캠페인 데이터에서 registrationPeriod 날짜를 가져와서
   * 등록기간 기준으로 남은 일수를 계산하는 함수
   *
   * 설명:
   * - 선정 탭의 캠페인 태그는 등록기간 기준으로 남은 일수를 표시합니다.
   * - 3일 이하일 때는 "마감임박"으로 표시합니다.
   *
   */
  const calculateRemainingDays = (
    campaignId: string,
    campaignType: CampaignApplication["type"]
  ): { remainingDays: number; isUrgent: boolean } => {
    // 모든 캠페인 데이터를 하나의 배열로 합치기
    const allCampaigns = [
      ...deliveryCampaigns,
      ...visitCampaigns,
      ...reviewCampaigns,
      ...reporterCampaigns,
      ...missionCampaigns,
    ];

    // 캠페인 ID로 실제 캠페인 데이터 찾기
    const actualCampaign = allCampaigns.find((c) => c.id === campaignId);

    if (!actualCampaign || !actualCampaign.detailedSchedule) {
      // 실제 데이터를 찾을 수 없으면 기본값 반환
      return { remainingDays: 0, isUrgent: false };
    }

    // 캠페인 타입에 따라 등록기간 필드명이 다릅니다
    // - 방문형: purchasePeriod
    // - 배송형/구매평/미션형/기자단: registrationPeriod
    let registrationPeriod: string | null = null;

    if (campaignType === "방문형") {
      // 방문형은 purchasePeriod를 사용
      registrationPeriod =
        "purchasePeriod" in actualCampaign.detailedSchedule
          ? (actualCampaign.detailedSchedule.purchasePeriod as string)
          : null;
    } else {
      // 나머지 타입은 registrationPeriod를 사용
      registrationPeriod =
        "registrationPeriod" in actualCampaign.detailedSchedule
          ? (actualCampaign.detailedSchedule.registrationPeriod as string)
          : null;
    }

    if (!registrationPeriod) {
      // 등록기간이 없으면 기본값 반환
      return { remainingDays: 0, isUrgent: false };
    }

    // registrationPeriod에서 끝 날짜 추출 (예: "2026-01-10 ~ 2026-01-17" → "2026-01-17")
    const endDateStr = registrationPeriod.split("~")[1]?.trim();

    if (!endDateStr) {
      return { remainingDays: 0, isUrgent: false };
    }

    // 등록기간 끝 날짜 가져오기
    const registrationEndDate = new Date(endDateStr);
    registrationEndDate.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정

    // 오늘 날짜 (시간을 00:00:00으로 설정)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 남은 일수 계산 (밀리초를 일수로 변환)
    const diffTime = registrationEndDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 3일 이하이면 마감임박
    const isUrgent = diffDays <= 3;

    return { remainingDays: diffDays, isUrgent };
  };

  /**
   * 실제 캠페인 데이터에서 contentType을 가져오는 함수
   *
   * 설명:
   * - 미션형 캠페인의 경우 실제 캠페인 데이터에서 contentType을 찾아서 설정합니다.
   * - contentType은 "link", "image", "both" 중 하나입니다.
  
   */
  const getContentTypeFromCampaign = (
    campaignId: string,
    campaignType: CampaignApplication["type"]
  ): "link" | "image" | "both" | undefined => {
    // 미션형이 아닌 경우 contentType이 필요 없음
    if (campaignType !== "미션형") {
      return undefined;
    }

    // 미션형 캠페인 데이터에서만 찾기
    const missionCampaign = missionCampaigns.find((c) => c.id === campaignId);

    // contentType 반환 (없으면 undefined)
    // 타입 가드: missionCampaign이 있고 contentType 속성이 있는지 확인
    if (missionCampaign && "contentType" in missionCampaign) {
      return missionCampaign.contentType;
    }

    return undefined;
  };

  /**
   * 캠페인 목록에 remainingDays, isUrgent, contentType을 계산하여 추가하는 함수
   *
   * 설명:
   * - 선정 탭의 캠페인만 등록기간 기준으로 계산합니다.
   * - 미션형 캠페인의 경우 실제 캠페인 데이터에서 contentType을 가져옵니다.
   * - 다른 탭의 캠페인은 기존 데이터를 그대로 사용합니다.
   */
  const enrichCampaignsWithRemainingDays = (
    campaigns: CampaignApplication[]
  ): CampaignApplication[] => {
    // 선정 탭인 경우에만 등록기간 기준으로 계산
    if (activeStatTab === "선정") {
      return campaigns.map((campaign) => {
        const { remainingDays, isUrgent } = calculateRemainingDays(
          campaign.id,
          campaign.type
        );

        // 미션형 캠페인의 경우 contentType 가져오기
        const contentType = getContentTypeFromCampaign(
          campaign.id,
          campaign.type
        );

        return {
          ...campaign,
          remainingDays,
          isUrgent,
          // contentType이 없으면 기존 값 유지, 있으면 새로 설정
          contentType: contentType ?? campaign.contentType,
        };
      });
    }
    // 다른 탭은 기존 데이터 그대로 사용
    return campaigns;
  };

  /**
   * 채널 이름을 정규화하여 표준 채널 이름으로 변환하는 함수
   */
  const normalizeChannelName = (channelName: string | undefined | null): string => {
    if (!channelName) return '';

    const normalized = channelName.replace(/\s+/g, "");
    const normalizedLower = normalized.toLowerCase();

    if (normalized === "네이버블로그" || normalized === "블로그" || normalizedLower === "blog") {
      return "네이버블로그";
    }
    if (normalized === "네이버클립" || normalized === "클립" || normalizedLower === "clip") {
      return "네이버클립";
    }
    if (normalized === "인스타그램" || normalizedLower === "instagram" || normalizedLower === "insta") {
      return "인스타그램";
    }
    if (normalized === "유튜브" || normalizedLower === "youtube" || normalizedLower === "yt") {
      return "유튜브";
    }
    if (normalized === "릴스" || normalizedLower === "reels") {
      return "릴스";
    }
    if (normalized === "쇼츠" || normalized === "숏츠" || normalizedLower === "shorts") {
      return "쇼츠";
    }

    const categoryIconMap: Record<string, string> = {
      네이버블로그: "네이버블로그",
      네이버클립: "네이버클립",
      클립: "네이버클립",
      인스타그램: "인스타그램",
      유튜브: "유튜브",
      릴스: "릴스",
      쇼츠: "쇼츠",
      숏츠: "쇼츠",
    };

    if (categoryIconMap[normalized]) {
      return categoryIconMap[normalized];
    }

    return normalized;
  };

  // 캠페인 목록 상태
  const [campaigns, setCampaigns] = useState<CampaignApplication[]>([]);

  /**
   * 필터링된 캠페인 목록 변경 핸들러
   *
   * 설명:
   * - CampaignFilterBar 컴포넌트에서 필터링된 결과를 받아서 상태를 업데이트합니다.
   * - 이제 필터링 로직은 CampaignFilterBar 내부에서 처리됩니다.
   */
  const handleFilteredCampaignsChange = (filtered: CampaignApplication[]) => {
    setFilteredCampaigns(filtered);
  };

  /**
   * localStorage에서 유저의 선정 캠페인 불러오기 + 목업 데이터 합치기
   */
  const loadUserSelectedCampaigns = () => {
    if (!user) {
      console.log('[SelectedPage] user가 없음');
      return [];
    }

    console.log('[SelectedPage] 현재 로그인한 user:', user);

    // 1. 목업 데이터에서 선정 탭 캠페인 가져오기
    const mockCampaigns = getCampaignsByTab('선정');
    console.log('[SelectedPage] 목업 캠페인 개수:', mockCampaigns.length);

    // 2. LocalStorage에서 내가 선정된 캠페인 가져오기
    const userAppliedCampaigns = localStorage.getItem('user_applied_campaigns');
    console.log('[SelectedPage] localStorage에서 가져온 user_applied_campaigns:', userAppliedCampaigns);

    let localStorageCampaigns: CampaignApplication[] = [];

    if (userAppliedCampaigns) {
      try {
        const allAppliedCampaigns = JSON.parse(userAppliedCampaigns);
        console.log('[SelectedPage] 파싱된 allAppliedCampaigns:', allAppliedCampaigns);

        // 현재 로그인한 유저의 신청 내역 찾기
        const userCampaigns = allAppliedCampaigns.find((uc: any) => uc.userId === user.id);
        console.log('[SelectedPage] 현재 유저의 캠페인:', userCampaigns);

        if (userCampaigns && userCampaigns.campaigns) {
          // 선정 상태인 캠페인만 필터링하고 CampaignApplication 형식으로 변환
          localStorageCampaigns = userCampaigns.campaigns
            .filter((c: any) => c.status === '선정')
            .map((c: any) => {
              // 캠페인 데이터 찾기
              const allCampaigns = [
                ...deliveryCampaigns,
                ...visitCampaigns,
                ...reviewCampaigns,
                ...reporterCampaigns,
                ...missionCampaigns,
              ];

              let actualCampaign: any = null;
              let channel = c.channel || '';

              // localStorage에서 찾기
              const campaignTypeKey = c.campaignType === 'delivery' ? 'deliveryCampaigns' :
                                     c.campaignType === 'visit' ? 'visitCampaigns' :
                                     c.campaignType === 'review' ? 'reviewCampaigns' :
                                     c.campaignType === 'reporter' ? 'reporterCampaigns' :
                                     c.campaignType === 'mission' ? 'missionCampaigns' : null;

              if (campaignTypeKey && typeof window !== 'undefined') {
                try {
                  const stored = localStorage.getItem(campaignTypeKey);
                  if (stored) {
                    const storedCampaigns = JSON.parse(stored);
                    actualCampaign = storedCampaigns.find((camp: any) => {
                      const campId = String(camp.campaignInfo?.id || camp.id);
                      const storedId = String(c.campaignId);
                      return campId === storedId || campId.includes(storedId) || storedId.includes(campId);
                    });

                    if (actualCampaign && !channel) {
                      channel = actualCampaign.campaignInfo?.channel || actualCampaign.channel || '';
                    }
                  }
                } catch (error) {
                  console.error(`[SelectedPage] localStorage에서 ${campaignTypeKey} 로드 실패:`, error);
                }
              }

              // 정적 데이터에서 찾기
              if (!actualCampaign) {
                actualCampaign = allCampaigns.find((camp: any) => {
                  const campId = String(camp.campaignInfo?.id || camp.id);
                  const storedId = String(c.campaignId);
                  return campId === storedId || campId.includes(storedId) || storedId.includes(campId);
                });

                if (actualCampaign && (!channel || channel.trim() === '')) {
                  if (c.campaignType === 'reporter') {
                    channel = actualCampaign?.channel || '';
                  } else {
                    channel = actualCampaign?.campaignInfo?.channel || actualCampaign?.channel || '';
                  }
                }
              }

              if (!actualCampaign) {
                console.warn('[SelectedPage] 캠페인 데이터를 찾을 수 없음:', c.campaignId);
                return null;
              }

              // 타입 결정
              const type: CampaignApplication['type'] =
                c.campaignType === 'delivery' ? '배송형' :
                c.campaignType === 'review' ? '구매평' :
                c.campaignType === 'mission' ? '미션형' :
                c.campaignType === 'reporter' ? '기자단' :
                c.campaignType === 'visit' ? '방문형' : '배송형';

              // 카테고리 정규화
              const category = channel ? normalizeChannelName(channel) : '';

              const campaignTitle = actualCampaign?.campaignInfo?.title ||
                                   actualCampaign?.title ||
                                   c.campaignTitle ||
                                   '캠페인명 없음';
              const campaignImage = actualCampaign?.campaignInfo?.image ||
                                   actualCampaign?.image ||
                                   c.campaignImage ||
                                   '/images/default_campaign.png';

              return {
                id: c.campaignId,
                title: campaignTitle,
                category,
                image: campaignImage,
                status: '선정' as const,
                remainingDays: 0,
                statusMessage: '콘텐츠 등록 기간입니다.',
                type,
                isUrgent: false,
              };
            })
            .filter((c: any) => c !== null);

          console.log('[SelectedPage] localStorage에서 변환된 캠페인 개수:', localStorageCampaigns.length);
          console.log('[SelectedPage] localStorage에서 변환된 캠페인:', localStorageCampaigns);
        }
      } catch (e) {
        console.error('Failed to parse user_applied_campaigns:', e);
      }
    }

    // 3. 목업 데이터 + localStorage 데이터 합치기 (중복 제거)
    const allCampaigns = [...mockCampaigns];

    localStorageCampaigns.forEach((lsCampaign) => {
      const isDuplicate = allCampaigns.some((c) => c.id === lsCampaign.id);
      if (!isDuplicate) {
        allCampaigns.push(lsCampaign);
      }
    });

    console.log('[SelectedPage] 최종 합쳐진 캠페인 개수:', allCampaigns.length);
    return allCampaigns;
  };

  /**
   * 컴포넌트 마운트 및 포커스 시 데이터 로드
   */
  useEffect(() => {
    const loadCampaigns = () => {
      const loadedCampaigns = loadUserSelectedCampaigns();
      console.log('[SelectedPage] 로드된 선정 캠페인:', loadedCampaigns);
      console.log('[SelectedPage] 로드된 캠페인 개수:', loadedCampaigns.length);

      // remainingDays와 isUrgent 계산
      const enrichedCampaigns = enrichCampaignsWithRemainingDays(loadedCampaigns);
      console.log('[SelectedPage] remainingDays 계산 후 캠페인 개수:', enrichedCampaigns.length);
      console.log('[SelectedPage] 최종 캠페인:', enrichedCampaigns);

      setCampaigns(enrichedCampaigns);
    };

    loadCampaigns();

    // 페이지가 포커스를 받을 때마다 새로고침
    const handleFocus = () => {
      console.log('[SelectedPage] 페이지 포커스 - 데이터 새로고침');
      loadCampaigns();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  /**
   * 통계 계산 함수
   */
  const calculateStats = () => {
    if (!user) {
      return campaignManagementStats;
    }

    const mockStats = { ...campaignManagementStats };

    const userAppliedCampaigns = localStorage.getItem('user_applied_campaigns');
    if (!userAppliedCampaigns) {
      return mockStats;
    }

    try {
      const allAppliedCampaigns = JSON.parse(userAppliedCampaigns);
      const userCampaigns = allAppliedCampaigns.find((uc: any) => uc.userId === user.id);

      if (!userCampaigns || !userCampaigns.campaigns) {
        return mockStats;
      }

      const campaigns = userCampaigns.campaigns;

      return {
        신청: mockStats.신청 + campaigns.filter((c: any) => c.status === '대기').length,
        선정: mockStats.선정 + campaigns.filter((c: any) => c.status === '선정').length,
        완료: mockStats.완료 + campaigns.filter((c: any) => c.status === '완료').length,
        "취소/반려": mockStats["취소/반려"] + campaigns.filter((c: any) => c.status === '취소' || c.status === '반려').length,
        패널티: mockStats.패널티,
      };
    } catch (e) {
      console.error('Failed to calculate stats:', e);
      return mockStats;
    }
  };

  // 통계 상태
  const [stats, setStats] = useState(() => calculateStats());

  /**
   * 캠페인 목록이 변경될 때마다 통계 업데이트
   */
  useEffect(() => {
    setStats(calculateStats());
  }, [campaigns, user]);

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 공통 헤더: 상단 탭 네비게이션 + 통계 탭 */}
        <CampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
          stats={stats}
        />

        {/* 필터 바: 유형, 채널 필터 및 검색 */}
        <CampaignFilterBar<CampaignApplication>
          campaigns={campaigns}
          onFilteredCampaignsChange={handleFilteredCampaignsChange}
          showSearch={false}
        />

        {/* 필터링된 캠페인 목록 */}
        <CampaignList
          campaigns={filteredCampaigns}
          activeStatTab="선정"
          originalCampaigns={campaigns}
        />
      </div>
    </div>
  );
}

// 유저(리뷰어) 전용 페이지로 보호
export default withUserAuth(SelectedPage);
