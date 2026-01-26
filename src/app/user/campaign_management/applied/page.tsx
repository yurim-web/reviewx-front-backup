/* ========================================
   📝 신청 탭 전용 페이지
   ======================================== */

/**
 * 신청 탭 전용 페이지
 *
 * 목적: 신청 상태의 캠페인 목록을 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /user/campaign_management/applied
 *
 * 주요 기능:
 * - 신청 상태의 캠페인 목록 표시
 * - 캠페인별 액션 버튼 (신청 취소 등)
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

// 실제 캠페인 데이터 import (applicationEnd 날짜 가져오기 위해)
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";

/**
 * 신청 탭 전용 페이지 컴포넌트
 */
function AppliedPage() {
  const { user } = useAuth();

  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");

  // 통계 탭 상태 - 신청 탭이 활성화된 상태로 설정
  const [activeStatTab, setActiveStatTab] = useState<
    "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  >("신청");

  /**
   * 채널 이름을 정규화하여 표준 채널 이름으로 변환하는 함수
   * 
   * @param channelName - 원본 채널 이름 (예: "클립", "네이버 클립", "네이버클립", "Blog", "Clip")
   * @returns 표준 채널 이름 (예: "네이버클립", "네이버블로그", "인스타그램" 등)
   */
  const normalizeChannelName = (channelName: string | undefined | null): string => {
    if (!channelName) return '';
    
    // 공백 제거하여 정규화 (한글은 대소문자가 없으므로 toLowerCase 불필요)
    const normalized = channelName.replace(/\s+/g, "");
    const normalizedLower = normalized.toLowerCase();
    
    // 채널 이름 매핑 (다양한 형식 지원)
    // 한글 형식
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
    
    // 이미 정규화된 형식인 경우 그대로 반환
    // category_icon_map의 키와 일치하는지 확인
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
    
    // 기본값: 원본 반환 (공백만 제거)
    return normalized;
  };

  // 필터링된 캠페인 목록 상태
  const [filteredCampaigns, setFilteredCampaigns] = useState<
    CampaignApplication[]
  >([]);

  /**
   * 실제 캠페인 데이터에서 선정 발표일이 지났는지 확인하는 함수
   *
   * 설명:
   * - 선정 발표일(announcement)이 오늘 날짜와 같거나 이전이면 true를 반환합니다.
   * - 선정 발표일이 오늘이거나 지난 캠페인은 신청 탭에서 제거되어야 합니다.
   * - 선정된 캠페인은 선정 탭으로 이동합니다.
   *
   * @param campaignId - 캠페인 ID
   * @returns 선정 발표일이 오늘이거나 지났으면 true, 아니면 false
   */
  const isAnnouncementDatePassed = (campaignId: string): boolean => {
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

    if (!actualCampaign || !actualCampaign.detailedSchedule?.announcement) {
      // 실제 데이터를 찾을 수 없으면 false 반환 (제거하지 않음)
      console.log(
        `[AppliedPage] 캠페인 데이터를 찾을 수 없음: ${campaignId} - 필터링하지 않음`
      );
      return false;
    }

    // 선정 발표일 문자열 가져오기 (예: "2026-01-07")
    const announcementDateStr =
      actualCampaign.detailedSchedule.announcement.trim();

    // 날짜 문자열을 안전하게 파싱 (YYYY-MM-DD 형식)
    const [year, month, day] = announcementDateStr.split("-").map(Number);
    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
      console.warn(
        `[AppliedPage] 유효하지 않은 선정 발표일: ${announcementDateStr} (캠페인: ${campaignId})`
      );
      return false;
    }

    // 선정 발표일 Date 객체 생성 (로컬 시간대 기준)
    const announcementDate = new Date(year, month - 1, day);
    announcementDate.setHours(0, 0, 0, 0);

    // 오늘 날짜 (로컬 시간대 기준, 시간을 00:00:00으로 설정)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 선정 발표일이 오늘이거나 이전이면 true (지났거나 오늘)
    // 오늘이 선정 발표일이면 이미 발표가 끝났으므로 제거해야 함
    const isPassed = announcementDate <= today;

    if (isPassed) {
      console.log(
        `[AppliedPage] 선정 발표일 지남: ${campaignId} - 선정 발표일: ${announcementDateStr}, 오늘: ${
          today.toISOString().split("T")[0]
        }`
      );
    }

    return isPassed;
  };

  /**
   * 실제 캠페인 데이터에서 선정 발표일(announcement)을 기준으로
   * 남은 일수를 계산하는 함수
   *
   * 설명:
   * - 신청 탭의 캠페인은 "캠페인 선정 발표까지 n일 남았습니다"라는 메시지를 표시합니다.
   * - 따라서 선정 발표일(announcement)을 기준으로 남은 일수를 계산해야 합니다.
   * - 예: 선정 발표일이 2026-01-07이고 오늘이 2026-01-06이면 1일 남은 것입니다.
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

    if (!actualCampaign || !actualCampaign.detailedSchedule?.announcement) {
      // 실제 데이터를 찾을 수 없으면 기본값 반환 (7일로 설정하여 표시되도록 함)
      console.log(
        `[AppliedPage] 캠페인 데이터를 찾을 수 없음: ${campaignId} - 기본값 7일 반환`
      );
      return { remainingDays: 7, isUrgent: false };
    }

    // 선정 발표일 문자열 가져오기 (예: "2026-01-07")
    const announcementDateStr =
      actualCampaign.detailedSchedule.announcement.trim();

    // 날짜 문자열을 안전하게 파싱 (YYYY-MM-DD 형식)
    const [year, month, day] = announcementDateStr.split("-").map(Number);
    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
      console.warn(
        `[AppliedPage] 유효하지 않은 선정 발표일: ${announcementDateStr} (캠페인: ${campaignId})`
      );
      return { remainingDays: 0, isUrgent: false };
    }

    // 선정 발표일 Date 객체 생성 (로컬 시간대 기준)
    const announcementDate = new Date(year, month - 1, day);
    announcementDate.setHours(0, 0, 0, 0);

    // 오늘 날짜 (로컬 시간대 기준, 시간을 00:00:00으로 설정)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 남은 일수 계산 (밀리초를 일수로 변환)
    // Math.ceil 대신 Math.floor를 사용하여 정확한 일수 계산
    // 예: 오늘이 2026-01-06이고 선정 발표일이 2026-01-07이면 1일 남은 것입니다.
    const diffTime = announcementDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 3일 이하이면 마감임박
    const isUrgent = diffDays <= 3 && diffDays >= 0;

    return { remainingDays: diffDays, isUrgent };
  };

  /**
   * 선정 발표일이 지난 캠페인을 필터링하는 함수
   *
   * 설명:
   * - 신청 탭에서 선정 발표일이 지난 캠페인을 제거합니다.
   * - 선정된 캠페인은 선정 탭으로 이동해야 하므로 신청 탭에서는 보이지 않습니다.
   *
   * @param campaigns - 필터링할 캠페인 목록
   * @param tab - 현재 활성화된 탭 (기본값: activeStatTab)
   * @returns 선정 발표일이 지나지 않은 캠페인만 포함된 목록
   */
  const filterCampaignsByAnnouncementDate = (
    campaigns: CampaignApplication[],
    tab: typeof activeStatTab = activeStatTab
  ): CampaignApplication[] => {
    // 신청 탭인 경우에만 선정 발표일이 지난 캠페인 제거
    if (tab === "신청") {
      const filtered = campaigns.filter((campaign) => {
        const passed = isAnnouncementDatePassed(campaign.id);
        if (passed) {
          console.log(
            `[AppliedPage] 선정 발표일 지난 캠페인 제거: ${campaign.id} - ${campaign.title}`
          );
        }
        return !passed;
      });
      return filtered;
    }
    // 다른 탭은 필터링하지 않음
    return campaigns;
  };

  /**
   * 캠페인 목록에 remainingDays와 isUrgent를 계산하여 추가하는 함수
   *
   * 설명:
   * - 신청 탭의 캠페인만 신청일 기준으로 계산합니다.
   * - 다른 탭의 캠페인은 기존 데이터를 그대로 사용합니다.
   */
  const enrichCampaignsWithRemainingDays = (
    campaigns: CampaignApplication[]
  ): CampaignApplication[] => {
    // 신청 탭인 경우에만 신청일 기준으로 계산
    if (activeStatTab === "신청") {
      return campaigns.map((campaign) => {
        const { remainingDays, isUrgent } = calculateRemainingDays(
          campaign.id,
          campaign.type
        );
        return {
          ...campaign,
          remainingDays,
          isUrgent,
        };
      });
    }
    // 다른 탭은 기존 데이터 그대로 사용
    return campaigns;
  };

  // 캠페인 목록 상태 (취소 시 제거하기 위해 상태로 관리)
  const [campaigns, setCampaigns] = useState<CampaignApplication[]>([]);

  /**
   * localStorage에서 유저의 신청 캠페인 불러오기 + 목업 데이터 합치기
   */
  const loadUserAppliedCampaigns = () => {
    if (!user) {
      console.log('[AppliedPage] user가 없음');
      return [];
    }

    console.log('[AppliedPage] 현재 로그인한 user:', user);

    // 1. 목업 데이터에서 신청 탭 캠페인 가져오기
    const mockCampaigns = getCampaignsByTab('신청');
    console.log('[AppliedPage] 목업 캠페인 개수:', mockCampaigns.length);

    // 2. LocalStorage에서 내가 신청한 캠페인 가져오기
    const userAppliedCampaigns = localStorage.getItem('user_applied_campaigns');
    console.log('[AppliedPage] localStorage에서 가져온 user_applied_campaigns:', userAppliedCampaigns);

    let localStorageCampaigns: CampaignApplication[] = [];

    if (userAppliedCampaigns) {
      try {
        const allAppliedCampaigns = JSON.parse(userAppliedCampaigns);
        console.log('[AppliedPage] 파싱된 allAppliedCampaigns:', allAppliedCampaigns);

        // 현재 로그인한 유저의 신청 내역 찾기
        const userCampaigns = allAppliedCampaigns.find((uc: any) => uc.userId === user.id);
        console.log('[AppliedPage] 현재 유저의 캠페인:', userCampaigns);

        if (userCampaigns && userCampaigns.campaigns) {
          // 신청 상태인 캠페인만 필터링하고 CampaignApplication 형식으로 변환
          localStorageCampaigns = userCampaigns.campaigns
            .filter((c: any) => c.status === '대기')
            .map((c: any) => {
              // 1. localStorage에서 직접 캠페인 데이터 찾기 (최신 데이터 우선)
              let actualCampaign: any = null;
              // user_applied_campaigns에 저장된 채널 정보를 먼저 확인 (최우선)
              let channel = c.channel || '';
              
              console.log(`[AppliedPage] 캠페인 처리 시작:`, {
                campaignId: c.campaignId,
                campaignType: c.campaignType,
                storedChannel: c.channel,
                hasStoredChannel: !!c.channel,
              });
              
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
                    const foundCampaign = storedCampaigns.find((camp: any) => {
                      const campId = String(camp.campaignInfo?.id || camp.id);
                      const storedId = String(c.campaignId);
                      
                      // 정확히 일치하는 경우
                      if (campId === storedId) return true;
                      
                      // ID 형식 변환 시도
                      const typePrefix = c.campaignType === 'delivery' ? 'delivery_' :
                                         c.campaignType === 'visit' ? 'visit_' :
                                         c.campaignType === 'review' ? 'review_' :
                                         c.campaignType === 'reporter' ? 'reporter_' :
                                         c.campaignType === 'mission' ? 'mission_' : '';
                      
                      if (typePrefix && campId === `${typePrefix}${storedId}`) return true;
                      if (storedId.startsWith(typePrefix)) {
                        const storedIdWithoutPrefix = storedId.replace(new RegExp(`^${typePrefix}`), '');
                        if (campId === storedIdWithoutPrefix) return true;
                      }
                      
                      return false;
                    });
                    
                    if (foundCampaign) {
                      actualCampaign = foundCampaign;
                      // localStorage의 CampaignWithApplicants 구조에서 채널 정보 가져오기
                      // 기자단 캠페인의 경우 campaignInfo.channel 또는 최상위 channel 확인
                      // 단, user_applied_campaigns에 이미 channel이 있으면 그것을 우선 사용
                      if (!channel) {
                        channel = foundCampaign.campaignInfo?.channel || 
                                 (foundCampaign as any).channel || '';
                      }
                      
                      console.log(`[AppliedPage] localStorage에서 ${c.campaignType} 캠페인 찾음:`, {
                        campaignId: c.campaignId,
                        foundCampaignId: foundCampaign.campaignInfo?.id || foundCampaign.id,
                        extractedChannel: channel,
                        campaignInfoChannel: foundCampaign.campaignInfo?.channel,
                        topLevelChannel: (foundCampaign as any).channel,
                        usingStoredChannel: !!c.channel,
                      });
                    }
                  }
                } catch (error) {
                  console.error(`[AppliedPage] localStorage에서 ${campaignTypeKey} 로드 실패:`, error);
                }
              }
              
              // 2. localStorage에서 찾지 못한 경우 정적 데이터에서 찾기
              if (!actualCampaign) {
                const allCampaigns = [
                  ...deliveryCampaigns,
                  ...visitCampaigns,
                  ...reviewCampaigns,
                  ...reporterCampaigns,
                  ...missionCampaigns,
                ];
                
                const foundInStatic = allCampaigns.find((camp: any) => {
                  const campId = String(camp.campaignInfo?.id || camp.id);
                  const storedId = String(c.campaignId);
                  
                  // 정확히 일치하는 경우
                  if (campId === storedId) return true;
                  
                  // ID 형식 변환 시도
                  const typePrefix = c.campaignType === 'delivery' ? 'delivery_' :
                                     c.campaignType === 'visit' ? 'visit_' :
                                     c.campaignType === 'review' ? 'review_' :
                                     c.campaignType === 'reporter' ? 'reporter_' :
                                     c.campaignType === 'mission' ? 'mission_' : '';
                  
                  if (typePrefix && campId === `${typePrefix}${storedId}`) return true;
                  if (storedId.startsWith(typePrefix)) {
                    const storedIdWithoutPrefix = storedId.replace(new RegExp(`^${typePrefix}`), '');
                    if (campId === storedIdWithoutPrefix) return true;
                  }
                  
                  return false;
                });
                
                if (foundInStatic) {
                  actualCampaign = foundInStatic;
                  // 정적 데이터 구조에서 채널 정보 가져오기
                  // 기자단 캠페인(ReporterCampaignData)은 channel이 최상위에 있음
                  // 단, user_applied_campaigns에 이미 channel이 있으면 그것을 우선 사용
                  if (!channel || channel.trim() === '') {
                    // 기자단 캠페인은 channel이 최상위에 있음
                    if (c.campaignType === 'reporter') {
                      channel = (foundInStatic as any)?.channel || '';
                      // 기자단 캠페인인데 여전히 채널이 없으면 reporterCampaigns에서 직접 찾기
                      if (!channel || channel.trim() === '') {
                        const reporterCampaign = reporterCampaigns.find((camp: any) => {
                          const campId = String(camp.id || '');
                          const storedId = String(c.campaignId);
                          return campId === storedId || campId === `reporter_${storedId}` || storedId === `reporter_${campId}`;
                        });
                        if (reporterCampaign) {
                          channel = (reporterCampaign as any)?.channel || '';
                        }
                      }
                    } else {
                      channel = (foundInStatic as any)?.campaignInfo?.channel || 
                               (foundInStatic as any)?.channel || '';
                    }
                  }
                  
                  console.log(`[AppliedPage] 정적 데이터에서 ${c.campaignType} 캠페인 찾음:`, {
                    campaignId: c.campaignId,
                    foundCampaignId: (foundInStatic as any)?.campaignInfo?.id || (foundInStatic as any)?.id,
                    extractedChannel: channel,
                    campaignInfoChannel: (foundInStatic as any)?.campaignInfo?.channel,
                    topLevelChannel: (foundInStatic as any)?.channel,
                    usingStoredChannel: !!c.channel,
                    actualCampaignStructure: {
                      hasCampaignInfo: !!(foundInStatic as any)?.campaignInfo,
                      hasChannel: !!(foundInStatic as any)?.channel,
                      channelValue: (foundInStatic as any)?.channel,
                    },
                  });
                }
              }
              
              if (!actualCampaign) {
                console.warn('[AppliedPage] 캠페인 데이터를 찾을 수 없음:', c.campaignId);
                // 캠페인 데이터를 찾을 수 없어도 기본 정보로 생성
                return {
                  id: c.campaignId,
                  title: c.campaignTitle || '캠페인명 없음',
                  category: '',
                  image: c.campaignImage || '/images/default_campaign.png',
                  status: '신청' as const,
                  remainingDays: 0,
                  statusMessage: '캠페인 선정 발표까지 대기 중입니다.',
                  type: (c.campaignType === 'delivery' ? '배송형' :
                         c.campaignType === 'review' ? '구매평' :
                         c.campaignType === 'mission' ? '미션형' :
                         c.campaignType === 'reporter' ? '기자단' :
                         c.campaignType === 'visit' ? '방문형' : '배송형') as CampaignApplication['type'],
                  isUrgent: false,
                };
              }
              
              // 타입 결정 (campaignType 우선, 없으면 ID에서 추론)
              let type: CampaignApplication['type'];
              if (c.campaignType) {
                type = (c.campaignType === 'delivery' ? '배송형' :
                        c.campaignType === 'review' ? '구매평' :
                        c.campaignType === 'mission' ? '미션형' :
                        c.campaignType === 'reporter' ? '기자단' :
                        c.campaignType === 'visit' ? '방문형' : '배송형') as CampaignApplication['type'];
              } else if (c.campaignId.startsWith('delivery_')) {
                type = '배송형';
              } else if (c.campaignId.startsWith('visit_')) {
                type = '방문형';
              } else if (c.campaignId.startsWith('review_')) {
                type = '구매평';
              } else if (c.campaignId.startsWith('reporter_')) {
                type = '기자단';
              } else if (c.campaignId.startsWith('mission_')) {
                type = '미션형';
              } else {
                type = '배송형';
              }
              
              // 카테고리 결정 (채널 정보 정규화)
              // 위에서 이미 channel 정보를 가져왔으므로 정규화만 수행
              // 기자단 캠페인의 경우 채널 정보가 없거나 빈 문자열이면 actualCampaign 또는 정적 데이터에서 다시 시도
              let category = '';
              if ((!channel || channel.trim() === '') && type === '기자단') {
                console.log(`[AppliedPage] 기자단 캠페인 채널 정보 없음, 재시도 시작:`, {
                  campaignId: c.campaignId,
                  currentChannel: channel,
                  hasActualCampaign: !!actualCampaign,
                });
                
                // 1. actualCampaign에서 직접 가져오기
                if (actualCampaign) {
                  channel = (actualCampaign as any)?.channel || 
                           (actualCampaign as any)?.campaignInfo?.channel || '';
                  console.log(`[AppliedPage] actualCampaign에서 채널 추출:`, {
                    campaignId: c.campaignId,
                    extractedChannel: channel,
                    actualCampaignChannel: (actualCampaign as any)?.channel,
                    campaignInfoChannel: (actualCampaign as any)?.campaignInfo?.channel,
                  });
                }
                
                // 2. 여전히 없으면 정적 데이터에서 직접 찾기
                if (!channel || channel.trim() === '') {
                  const storedId = String(c.campaignId);
                  const reporterCampaign = reporterCampaigns.find((camp: any) => {
                    const campId = String(camp.id || '');
                    // 다양한 ID 형식 매칭 시도
                    if (campId === storedId) return true;
                    if (campId === `reporter_${storedId}`) return true;
                    if (storedId === `reporter_${campId}`) return true;
                    // 숫자만 있는 경우 (예: "12" -> "reporter_12")
                    if (storedId.match(/^\d+$/)) {
                      return campId === `reporter_${storedId}`;
                    }
                    if (campId.match(/^reporter_\d+$/)) {
                      const campNum = campId.replace('reporter_', '');
                      return campNum === storedId;
                    }
                    return false;
                  });
                  
                  if (reporterCampaign) {
                    channel = (reporterCampaign as any)?.channel || '';
                    console.log(`[AppliedPage] 정적 데이터에서 기자단 캠페인 찾음:`, {
                      campaignId: c.campaignId,
                      foundCampaignId: reporterCampaign.id,
                      extractedChannel: channel,
                    });
                  } else {
                    console.warn(`[AppliedPage] 정적 데이터에서 기자단 캠페인을 찾을 수 없음:`, {
                      campaignId: c.campaignId,
                      storedId,
                      availableIds: reporterCampaigns.slice(0, 5).map((c: any) => c.id),
                    });
                  }
                }
              }
              
              if (channel && typeof channel === 'string' && (type === '배송형' || type === '방문형' || type === '기자단')) {
                // 채널 이름 정규화 (클립, 네이버 클립 -> 네이버클립 등)
                category = normalizeChannelName(channel);
                console.log(`[AppliedPage] 채널 정규화:`, {
                  campaignId: c.campaignId,
                  type,
                  originalChannel: channel,
                  normalizedCategory: category,
                });
              } else {
                console.warn(`[AppliedPage] 채널 정보 없음 또는 타입 불일치:`, {
                  campaignId: c.campaignId,
                  type,
                  channel,
                  channelType: typeof channel,
                  hasActualCampaign: !!actualCampaign,
                });
              }
              
              // actualCampaign의 구조에 따라 title과 image 가져오기
              const campaignTitle = (actualCampaign as any)?.campaignInfo?.title || 
                                   (actualCampaign as any)?.title || 
                                   c.campaignTitle || 
                                   '캠페인명 없음';
              const campaignImage = (actualCampaign as any)?.campaignInfo?.image || 
                                   (actualCampaign as any)?.image || 
                                   c.campaignImage || 
                                   '/images/default_campaign.png';
              const campaignIsUrgent = (actualCampaign as any)?.isUrgent || false;
              
              const campaign: CampaignApplication = {
                id: c.campaignId,
                title: campaignTitle,
                category,
                image: campaignImage,
                status: '신청' as const,
                remainingDays: 0, // calculateRemainingDays에서 계산됨
                statusMessage: '캠페인 선정 발표까지 대기 중입니다.', // calculateRemainingDays에서 업데이트됨
                type,
                isUrgent: campaignIsUrgent,
              };
              
              console.log(`[AppliedPage] 최종 캠페인 객체 생성:`, {
                campaignId: c.campaignId,
                type,
                channel,
                category,
                hasCategory: !!category,
                categoryLength: category.length,
              });
              
              return campaign;
            });
          console.log('[AppliedPage] localStorage에서 변환된 캠페인 개수:', localStorageCampaigns.length);
          console.log('[AppliedPage] localStorage에서 변환된 캠페인:', localStorageCampaigns);
        }
      } catch (e) {
        console.error('Failed to parse user_applied_campaigns:', e);
      }
    }

    // 3. 목업 데이터 + localStorage 데이터 합치기 (중복 제거)
    const allCampaigns = [...mockCampaigns];

    // localStorage 캠페인을 추가하되, 중복된 ID는 제외
    localStorageCampaigns.forEach((lsCampaign) => {
      const isDuplicate = allCampaigns.some((c) => c.id === lsCampaign.id);
      if (!isDuplicate) {
        allCampaigns.push(lsCampaign);
      }
    });

    console.log('[AppliedPage] 최종 합쳐진 캠페인 개수:', allCampaigns.length);
    return allCampaigns;
  };

  /**
   * 컴포넌트 마운트 및 포커스 시 데이터 로드
   */
  useEffect(() => {
    const loadCampaigns = () => {
      const loadedCampaigns = loadUserAppliedCampaigns();
      console.log('[AppliedPage] 로드된 신청 캠페인:', loadedCampaigns);
      console.log('[AppliedPage] 로드된 캠페인 개수:', loadedCampaigns.length);

      // 선정 발표일이 지난 캠페인 필터링
      const filteredCampaigns = filterCampaignsByAnnouncementDate(loadedCampaigns);
      console.log('[AppliedPage] 선정 발표일 필터링 후 캠페인 개수:', filteredCampaigns.length);
      console.log('[AppliedPage] 필터링 후 캠페인:', filteredCampaigns);

      // remainingDays와 isUrgent 계산
      const enrichedCampaigns = enrichCampaignsWithRemainingDays(filteredCampaigns);
      console.log('[AppliedPage] remainingDays 계산 후 캠페인 개수:', enrichedCampaigns.length);
      console.log('[AppliedPage] 최종 캠페인:', enrichedCampaigns);

      setCampaigns(enrichedCampaigns);
    };

    loadCampaigns();

    // 페이지가 포커스를 받을 때마다 새로고침
    const handleFocus = () => {
      console.log('[AppliedPage] 페이지 포커스 - 데이터 새로고침');
      loadCampaigns();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  /**
   * 통계 계산 함수
   *
   * 설명:
   * - 목업 데이터 + localStorage의 user_applied_campaigns에서 실제 통계를 계산합니다.
   * - 선정 발표일 필터링도 적용하여 실제 표시되는 개수와 일치시킵니다.
   *
   * @returns 각 탭별 캠페인 수 통계
   */
  const calculateStats = () => {
    if (!user) {
      return campaignManagementStats;
    }

    // 1. 목업 데이터 통계 가져오기
    const mockStats = { ...campaignManagementStats };

    // 2. localStorage 통계 계산
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

      // 3. 신청 탭의 경우 선정 발표일이 지나지 않은 캠페인만 카운트
      const appliedCampaigns = campaigns.filter((c: any) => {
        if (c.status !== '대기') return false;
        // 선정 발표일이 지나지 않은 캠페인만 카운트
        return !isAnnouncementDatePassed(c.campaignId);
      });

      // 4. localStorage 통계를 목업 통계에 추가
      return {
        신청: mockStats.신청 + appliedCampaigns.length,
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

  // 통계 상태 (카운트 갱신을 위해 상태로 관리)
  const [stats, setStats] = useState(() => calculateStats());

  /**
   * 캠페인 목록이 변경될 때마다 통계 업데이트
   */
  useEffect(() => {
    setStats(calculateStats());
  }, [campaigns, user]);

  /**
   * 필터링된 캠페인 목록 변경 핸들러
   *
   * 설명:
   * - CampaignFilterBar 컴포넌트에서 필터링된 결과를 받아서 상태를 업데이트합니다.
   * - 이제 필터링 로직은 CampaignFilterBar 내부에서 처리됩니다.
   */
  const handleFilteredCampaignsChange = (filtered: CampaignApplication[]) => {
    console.log('[AppliedPage] CampaignFilterBar에서 필터링된 캠페인 개수:', filtered.length);
    console.log('[AppliedPage] CampaignFilterBar에서 필터링된 캠페인:', filtered);
    setFilteredCampaigns(filtered);
  };


  /**
   * 신청 취소 성공 핸들러
   *
   * 설명:
   * - 캠페인 신청 취소가 성공하면 해당 캠페인을 리스트에서 제거합니다.
   * - 통계 카운트도 즉시 갱신합니다.
   *
   */
  const handleCancelSuccess = (campaignId: string) => {
    // 리스트에서 해당 캠페인 제거
    setCampaigns((prevCampaigns) =>
      prevCampaigns.filter((campaign) => campaign.id !== campaignId)
    );

    // 필터링된 목록에서도 제거
    setFilteredCampaigns((prevFiltered) =>
      prevFiltered.filter((campaign) => campaign.id !== campaignId)
    );

    // 통계 카운트 갱신 (신청 탭 카운트 감소)
    setStats((prevStats) => ({
      ...prevStats,
      신청: Math.max(0, prevStats.신청 - 1),
    }));
  };

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
        />

        {/* 필터링된 캠페인 목록 */}
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

// 유저(리뷰어) 전용 페이지로 보호
export default withUserAuth(AppliedPage);
