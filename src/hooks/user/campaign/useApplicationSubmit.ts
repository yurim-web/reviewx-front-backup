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
import {
  type ApplicationModalType,
  type StoredUserAccount,
  type StoredApplicant,
  type StoredCampaign,
  getStorageKey,
  getTypePrefix,
  findCampaignIndex,
  buildApplicantData,
  addToUserAppliedCampaigns,
} from "@/components/user/campaign_detail/modal/applicationModalUtils";

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
  } = params;

  const { user } = useAuth();

  /** 캠페인 데이터에 신청자를 추가하고 localStorage에 저장 */
  const addApplicantToCampaign = useCallback(
    (
      campaign: StoredCampaign,
      campaigns: StoredCampaign[],
      storageKey: string,
      insertAtEnd: boolean
    ): boolean => {
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

      const userAccount = (() => {
        try {
          const raw = localStorage.getItem("user_accounts");
          if (!raw) return null;
          const accounts = JSON.parse(raw) as StoredUserAccount[];
          return accounts.find((a) => a.id === user.id || a.email === user.email) ?? null;
        } catch {
          return null;
        }
      })();

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

  const handleSubmit = useCallback(() => {
    if (!campaignId) {
      alert("캠페인 정보를 불러올 수 없습니다. 페이지를 새로고침하고 다시 시도해주세요.");
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
        // localStorage에 해당 타입 캠페인이 있는 경우
        const campaigns: StoredCampaign[] = JSON.parse(rawCampaigns);
        const idx = findCampaignIndex(campaigns, campaignId, type);

        if (idx >= 0) {
          // localStorage에서 캠페인을 찾은 경우
          const ok = addApplicantToCampaign(campaigns[idx], campaigns, storageKey, false);
          if (ok) {
            clearFormData();
            onSuccess();
          }
        } else {
          // localStorage에 있지만 해당 캠페인이 없는 경우 → 목업 데이터에서 찾기
          const mockCampaign = findMockCampaign(campaignId);
          if (!mockCampaign) {
            alert("캠페인을 찾을 수 없습니다. 페이지를 새로고침하고 다시 시도해주세요.");
            return;
          }
          const ok = addApplicantToCampaign(mockCampaign, campaigns, storageKey, true);
          if (ok) {
            clearFormData();
            onSuccess();
          }
        }
      } else {
        // localStorage에 캠페인 데이터가 없는 경우 → 목업 데이터로 초기화
        const mockCampaign = findMockCampaign(campaignId);
        if (!mockCampaign) {
          alert("캠페인 데이터를 불러올 수 없습니다. 페이지를 새로고침하고 다시 시도해주세요.");
          return;
        }
        const ok = addApplicantToCampaign(mockCampaign, [], storageKey, true);
        if (ok) {
          clearFormData();
          onSuccess();
        }
      }
    } catch (_error) {
      alert("캠페인 신청 중 오류가 발생했습니다. 다시 시도해주세요.");
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
  ]);

  return { handleSubmit };
}
