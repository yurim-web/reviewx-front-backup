/* ========================================
   캠페인 신청 제출 커스텀 훅
   ======================================== */

/**
 * useApplicationSubmit
 *
 * 목적: 캠페인 신청 모달에서 handleSubmit 로직(유효성 검사, localStorage 저장)을 분리합니다.
 *
 * 사용 페이지:
 * - /user/campaign/[type]/[id] (캠페인 상세 - 신청 모달)
 */

import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import { postCampaignApplication } from "@/lib/api/campaign";
import {
  type ApplicationModalType,
  type StoredApplicant,
  type StoredCampaign,
  getStorageKey,
  getTypePrefix,
  findCampaignIndex,
  buildApplicantData,
  addToUserAppliedCampaigns,
} from "@/components/user/campaign_detail/modal/applicationModalUtils";
import { useReviewerProfile, getReviewerIdNum } from "@/hooks/user/mypage/useReviewerProfile";

interface UseApplicationSubmitParams {
  campaignId?: string;
  type: ApplicationModalType;
  isParticipated: boolean;
  isSuspended: boolean;
  isClosed: boolean;
  memo: string;
  currentChannelUrl: string;
  userName: string;
  userAddress: string;
  campaignChannelName?: string;
  showChannel: boolean;
  channelName: string;
  clearFormData: () => void;
  onSuccess: () => void;
  onDuplicate: () => void;
  onParticipated: () => void;
  onSuspended: () => void;
  onClosed: () => void;
  onError: () => void;
}

export function useApplicationSubmit(params: UseApplicationSubmitParams) {
  const {
    campaignId,
    type,
    isParticipated,
    isSuspended,
    isClosed,
    memo,
    currentChannelUrl,
    campaignChannelName,
    showChannel,
    channelName,
    clearFormData,
    onSuccess,
    onDuplicate,
    onParticipated,
    onSuspended,
    onClosed,
    onError,
  } = params;

  const { user } = useAuth();
  const { data: profile } = useReviewerProfile(user?.id);

  /** 캠페인 데이터에 신청자를 추가하고 localStorage + API에 저장 */
  const addApplicantToCampaign = useCallback(
    async (
      campaign: StoredCampaign,
      campaigns: StoredCampaign[],
      storageKey: string,
      insertAtEnd: boolean
    ): Promise<boolean> => {
      if (!user || !campaignId) return false;

      if (!campaign.applicantData) {
        campaign.applicantData = { applicants: [], selectedApplicants: [] };
      }

      const isDuplicate = campaign.applicantData.applicants.some(
        (a: StoredApplicant) => a.id === user.id || a.userId === user.id
      );
      if (isDuplicate) {
        onDuplicate();
        return false;
      }

      // 서버 프로필 데이터를 userAccount 형식으로 변환
      const userAccount = profile
        ? {
            id: String(profile.id),
            name: profile.name,
            nickname: profile.nickname,
            profile_image: profile.profile_image,
            daily_visits: profile.daily_visits,
            total_visits: profile.total_visits,
            neighbors: profile.neighbors,
            channel_details: profile.channel_details,
          }
        : null;

      const applicantData = buildApplicantData({
        userId: user.id,
        showChannel,
        channelName,
        campaignChannelName,
        currentChannelUrl,
        memo,
        userAccount,
      });

      campaign.applicantData.applicants.push(applicantData);

      if (campaign.campaignInfo) {
        campaign.campaignInfo.recruitedCount = (campaign.campaignInfo.recruitedCount || 0) + 1;
      }

      const updatedCampaigns = insertAtEnd ? [...campaigns, campaign] : [...campaigns];
      if (!insertAtEnd) {
        const idx = findCampaignIndex(updatedCampaigns, campaignId, type);
        if (idx >= 0) updatedCampaigns[idx] = campaign;
      }
      localStorage.setItem(storageKey, JSON.stringify(updatedCampaigns));

      // mock API에 신청 데이터 저장 (서버 응답 확인)
      const campaignIdNum = parseInt(campaignId.replace(/\D+/g, ""), 10) || 0;
      const reviewerIdNum = getReviewerIdNum(user.id) ?? 1;
      try {
        await postCampaignApplication({
          campaign_id: campaignIdNum,
          reviewer_id: reviewerIdNum,
          status: "APPLIED",
          apply_date: new Date().toISOString(),
          channel_url: currentChannelUrl,
          introduction: memo,
        });
      } catch (_apiError) {
        // mock 서버 미실행 시 localStorage 저장 완료 상태로 진행
        console.warn("캠페인 신청 API 호출 실패 (localStorage 저장 완료):", _apiError);
      }

      const appliedAt = new Date().toISOString();
      addToUserAppliedCampaigns({
        userId: user.id,
        campaignId,
        type,
        campaign,
        memo,
        campaignChannelName,
        appliedAt,
      });

      return true;
    },
    [
      user,
      profile,
      campaignId,
      type,
      showChannel,
      channelName,
      campaignChannelName,
      currentChannelUrl,
      memo,
      onDuplicate,
    ]
  );

  /** ID 변형을 시도하며 목업 데이터에서 캠페인 찾기 */
  const findMockCampaign = useCallback(
    (id: string) => {
      let campaign = getCampaignById(id);
      if (campaign) return campaign;

      const typePrefix = getTypePrefix(type);
      if (id.startsWith(typePrefix)) {
        campaign = getCampaignById(id.replace(new RegExp(`^${typePrefix}`), ""));
      } else {
        campaign = getCampaignById(`${typePrefix}${id}`);
      }
      return campaign ?? null;
    },
    [type]
  );

  const handleSubmit = useCallback(async () => {
    if (!campaignId) {
      onError();
      return;
    }

    // 1. 사전 조건 검사
    if (isParticipated) {
      onParticipated();
      return;
    }
    if (isSuspended) {
      onSuspended();
      return;
    }
    if (isClosed) {
      onClosed();
      return;
    }
    if (!user) return;

    try {
      const storageKey = getStorageKey(type);
      const rawCampaigns = localStorage.getItem(storageKey);

      if (rawCampaigns) {
        const campaigns: StoredCampaign[] = JSON.parse(rawCampaigns);
        const idx = findCampaignIndex(campaigns, campaignId, type);

        if (idx >= 0) {
          const ok = await addApplicantToCampaign(campaigns[idx], campaigns, storageKey, false);
          if (ok) {
            clearFormData();
            onSuccess();
          }
        } else {
          const mockCampaign = findMockCampaign(campaignId);
          if (!mockCampaign) {
            onError();
            return;
          }
          const ok = await addApplicantToCampaign(mockCampaign, campaigns, storageKey, true);
          if (ok) {
            clearFormData();
            onSuccess();
          }
        }
      } else {
        const mockCampaign = findMockCampaign(campaignId);
        if (!mockCampaign) {
          onError();
          return;
        }
        const ok = await addApplicantToCampaign(mockCampaign, [], storageKey, true);
        if (ok) {
          clearFormData();
          onSuccess();
        }
      }
    } catch (_error) {
      onError();
    }
  }, [
    campaignId,
    type,
    isParticipated,
    isSuspended,
    isClosed,
    user,
    addApplicantToCampaign,
    findMockCampaign,
    clearFormData,
    onSuccess,
    onParticipated,
    onSuspended,
    onClosed,
    onError,
  ]);

  return { handleSubmit };
}
