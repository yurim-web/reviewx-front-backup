/* ========================================
   캠페인 신청 제출 커스텀 훅
   ======================================== */

/**
 * useApplicationSubmit
 *
 * 목적: 캠페인 신청 모달에서 handleSubmit 로직
 *       R-25 API(POST /campaign/{type}/{id}) 우선, localStorage fallback
 *
 * 사용 페이지:
 * - /user/campaign/[type]/[id] (캠페인 상세 - 신청 모달)
 *
 * API: R-25 POST /campaign/{type}/{campaignId}
 * 에러 코드: ALREADY_APPLIED(409), CAMPAIGN_NOT_RECRUITING(400),
 *           RECRUIT_FULL(400), CHANNEL_NOT_CONNECTED(400)
 */

import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { submitCampaignApplication } from "@/lib/api/campaign";
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
  toApiType,
} from "@/components/user/campaign_detail/modal/applicationModalUtils";
import { useReviewerProfile, getReviewerIdNum } from "@/hooks/user/mypage/useReviewerProfile";
import type { CampaignApplyRequest } from "@/types/api/campaign";
import { AxiosError } from "axios";

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
  // R-24 데이터
  canApply?: boolean;
  eligibilityReasons?: string[];
  requiredChannelId: number | null;
  isChannelConnected?: boolean;
  postNumber: number | null;
  addressRaw: string | null;
  addressDetailRaw: string | null;
  // 콜백
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
    // R-24 데이터
    requiredChannelId,
    postNumber,
    addressRaw,
    addressDetailRaw,
    // 콜백
    onSuccess,
    onDuplicate,
    onParticipated,
    onSuspended,
    onClosed,
    onError,
  } = params;

  const { user } = useAuth();
  const { data: profile } = useReviewerProfile(user?.id);

  /** R-25 API로 신청 시도 */
  const submitViaApi = useCallback(async (): Promise<boolean> => {
    if (!campaignId) return false;

    const apiType = toApiType(type);
    const numericId = campaignId.replace(/\D+/g, "") || campaignId;

    // 배송형: requiredChannelId + shippingAddress + memo
    // 방문형/기자단: requiredChannelId + memo
    // 구매평/미션형: requiredChannelId(null) + memo
    const body: CampaignApplyRequest = {
      requiredChannelId: requiredChannelId ?? null,
      isAgreed: true,
      memo: memo || undefined,
    };

    // 배송형은 배송지 정보 포함
    if (type === "delivery" && addressRaw && postNumber) {
      body.shippingAddress = {
        postNumber,
        address: addressRaw,
        addressDetail: addressDetailRaw || "",
      };
    }

    const response = await submitCampaignApplication(apiType, numericId, body);
    return response.result === "OK" || !!response.applicationId;
  }, [campaignId, type, memo, requiredChannelId, postNumber, addressRaw, addressDetailRaw]);

  /** R-25 에러 코드에 따라 적절한 콜백 호출. 처리된 경우 true 반환 */
  const handleApiError = useCallback(
    (error: unknown): boolean => {
      if (error instanceof AxiosError && error.response?.data) {
        const errorCode = error.response.data.error?.code || error.response.data.code;
        switch (errorCode) {
          case "ALREADY_APPLIED":
            onDuplicate();
            return true;
          case "CAMPAIGN_NOT_RECRUITING":
          case "RECRUIT_FULL":
            onClosed();
            return true;
          case "CHANNEL_NOT_CONNECTED":
            onError();
            return true;
        }
      }
      return false;
    },
    [onDuplicate, onClosed, onError]
  );

  /** localStorage fallback 신청 로직 (mock 모드용) */
  const submitViaLocalStorage = useCallback(async (): Promise<boolean> => {
    if (!user || !campaignId) return false;

    const storageKey = getStorageKey(type);
    const rawCampaigns = localStorage.getItem(storageKey);
    const campaigns: StoredCampaign[] = rawCampaigns ? JSON.parse(rawCampaigns) : [];

    // 캠페인 찾기
    let campaign: StoredCampaign | null = null;
    let insertAtEnd = false;

    const idx = findCampaignIndex(campaigns, campaignId, type);
    if (idx >= 0) {
      campaign = campaigns[idx];
    } else {
      // mock 데이터에서 찾기
      const typePrefix = getTypePrefix(type);
      campaign =
        getCampaignById(campaignId) ??
        getCampaignById(campaignId.replace(new RegExp(`^${typePrefix}`), "")) ??
        getCampaignById(`${typePrefix}${campaignId}`) ??
        null;
      if (campaign) insertAtEnd = true;
    }

    if (!campaign) return false;

    // 중복 체크
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

    // 서버 프로필 → userAccount
    const userAccount = profile
      ? {
          id: String(profile.user?.userId ?? ""),
          name: profile.user?.name,
          nickname: profile.user?.name,
          profile_image: profile.user?.profileImage?.filePath,
          daily_visits: undefined,
          total_visits: undefined,
          neighbors: undefined,
          channel_details: profile.reviewerProfile?.channel
            ? [
                {
                  name: profile.reviewerProfile.channel.channelName,
                  url: profile.reviewerProfile.channel.channelUrl,
                  status: "connected" as const,
                },
              ]
            : [],
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
      const i = findCampaignIndex(updatedCampaigns, campaignId, type);
      if (i >= 0) updatedCampaigns[i] = campaign;
    }
    localStorage.setItem(storageKey, JSON.stringify(updatedCampaigns));

    // mock API에도 저장 시도
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
    } catch (_) {
      // mock 서버 미실행 시 무시
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
  }, [
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
  ]);

  const handleSubmit = useCallback(async () => {
    if (!campaignId) {
      onError();
      return;
    }

    // 사전 조건 검사
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
      // 1차: R-25 API로 신청 시도
      const ok = await submitViaApi();
      if (ok) {
        clearFormData();
        onSuccess();
        return;
      }
    } catch (apiError) {
      // R-25 에러 코드 처리
      if (handleApiError(apiError)) return;

      // API 실패 시 localStorage fallback
      console.warn("R-25 API 실패, localStorage fallback:", apiError);
    }

    // 2차: localStorage fallback (mock 모드)
    try {
      const ok = await submitViaLocalStorage();
      if (ok) {
        clearFormData();
        onSuccess();
      } else {
        // localStorage에서도 실패 (캠페인 못 찾음)
        onError();
      }
    } catch (_error) {
      onError();
    }
  }, [
    campaignId,
    isParticipated,
    isSuspended,
    isClosed,
    user,
    submitViaApi,
    handleApiError,
    submitViaLocalStorage,
    clearFormData,
    onSuccess,
    onParticipated,
    onSuspended,
    onClosed,
    onError,
  ]);

  return { handleSubmit };
}
