/* ========================================
   캠페인 신청 모달 유저/주소/채널 정보 커스텀 훅
   ======================================== */

/**
 * useApplicationModalUser
 *
 * 목적: 캠페인 신청 모달에서 로그인 유저의 이름·주소·채널 URL을 API 24 데이터에서 로드합니다.
 *       API 24 실패 시 기존 useReviewerProfile(R-28) fallback
 *
 * 사용 페이지:
 * - /user/campaign/[type]/[id] (캠페인 상세 - 신청 모달)
 *
 * API: R-24 GET /campaign/{type}/{campaignId} (신청 모달 데이터)
 */

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AuthUser } from "@/types/auth";
import { fetchApplicationFormData } from "@/lib/api/campaign";
import { useReviewerProfile } from "@/hooks/user/mypage/useReviewerProfile";
import type { ReviewerProfileResponse } from "@/types/api/reviewer";
import type { ApplicationFormDataResponse } from "@/types/api/campaign";
import { toApiType } from "@/components/user/campaign_detail/modal/applicationModalUtils";

interface UseApplicationModalUserParams {
  isOpen: boolean;
  user: AuthUser | null;
  campaignId?: string;
  type?: string;
  campaignChannelName?: string;
  userChannelUrl?: string;
  showChannel: boolean;
}

export interface ApplicationModalUserData {
  userName: string;
  userAddress: string;
  currentChannelUrl: string;
  /** R-24 eligibility 정보 */
  canApply: boolean;
  eligibilityReasons: string[];
  /** R-24 requiredChannel 정보 */
  requiredChannelId: number | null;
  isChannelConnected: boolean;
  /** R-24 applicant 주소 정보 (신청 시 shippingAddress 용) */
  postNumber: number | null;
  addressRaw: string | null;
  addressDetailRaw: string | null;
}

export function useApplicationModalUser({
  isOpen,
  user,
  campaignId,
  type,
  campaignChannelName,
  userChannelUrl,
  showChannel,
}: UseApplicationModalUserParams): ApplicationModalUserData {
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [currentChannelUrl, setCurrentChannelUrl] = useState(userChannelUrl || "");
  const [canApply, setCanApply] = useState(true);
  const [eligibilityReasons, setEligibilityReasons] = useState<string[]>([]);
  const [requiredChannelId, setRequiredChannelId] = useState<number | null>(null);
  const [isChannelConnected, setIsChannelConnected] = useState(false);
  const [postNumber, setPostNumber] = useState<number | null>(null);
  const [addressRaw, setAddressRaw] = useState<string | null>(null);
  const [addressDetailRaw, setAddressDetailRaw] = useState<string | null>(null);

  // R-24 API: 신청 모달 데이터 조회
  const apiType = type ? toApiType(type) : null;
  const { data: formData } = useQuery<ApplicationFormDataResponse>({
    queryKey: ["campaign", "applicationForm", apiType, campaignId],
    queryFn: () => fetchApplicationFormData(apiType!, campaignId!),
    enabled: isOpen && !!user && !!apiType && !!campaignId,
  });

  // R-28 fallback: 기존 프로필 기반
  const { data: profile } = useReviewerProfile(user?.id);

  /** 서버 프로필에서 주소 문자열 조합 (fallback용) */
  function resolveAddress(p: ReviewerProfileResponse): string {
    const addr = p.user?.address || "";
    const postNum = p.user?.postNumber ? String(p.user.postNumber) : "";
    if (addr && postNum) {
      return `${addr} | ${postNum}`;
    }
    return addr;
  }

  /** R-28 단일 채널로부터 캠페인 채널명에 맞는 URL 반환 (fallback용) */
  function resolveChannelUrl(p: ReviewerProfileResponse, targetChannelName: string): string {
    const channel = p.reviewerProfile?.channel;
    if (!channel) return "";
    const normalized = (s: string) => s.toLowerCase().replace(/\s+/g, "");
    const target = normalized(targetChannelName);
    const channelName = normalized(channel.channelName);
    if (channelName.includes(target) || target.includes(channelName)) {
      return channel.channelUrl || "";
    }
    return "";
  }

  useEffect(() => {
    if (!isOpen) return;

    if (!user) {
      setUserName("");
      setUserAddress("");
      setCurrentChannelUrl(userChannelUrl || "");
      setCanApply(false);
      setEligibilityReasons([]);
      setRequiredChannelId(null);
      setIsChannelConnected(false);
      setPostNumber(null);
      setAddressRaw(null);
      setAddressDetailRaw(null);
      return;
    }

    const shouldRestore = sessionStorage.getItem("shouldRestoreFormData");

    // R-24 API 데이터가 있으면 우선 사용
    if (formData) {
      const applicant = formData.applicant;
      setUserName(applicant.name || user.name || "");

      // 주소 조합
      const addr = applicant.address || "";
      const pn = applicant.postNumber ? String(applicant.postNumber) : "";
      setUserAddress(addr && pn ? `${addr} | ${pn}` : addr);
      setPostNumber(applicant.postNumber);
      setAddressRaw(applicant.address);
      setAddressDetailRaw(applicant.addressDetail);

      // 채널 정보
      const rc = formData.requiredChannel;
      if (rc) {
        setRequiredChannelId(rc.userChannelId);
        setIsChannelConnected(rc.isConnected);
        if (rc.isConnected && rc.channelUrl) {
          setCurrentChannelUrl(rc.channelUrl);
        } else {
          setCurrentChannelUrl("");
        }
      } else {
        // 채널 불필요 타입 (구매평, 미션형)
        setRequiredChannelId(null);
        setIsChannelConnected(true);
        setCurrentChannelUrl(userChannelUrl || "");
      }

      // eligibility
      setCanApply(formData.eligibility.canApply);
      setEligibilityReasons(formData.eligibility.reasons);

      if (shouldRestore === "true") {
        sessionStorage.removeItem("shouldRestoreFormData");
      }
      return;
    }

    // Fallback: R-28 프로필 데이터
    if (shouldRestore === "true") {
      if (profile) {
        setUserName(profile.user?.name || user.name || "");
        setUserAddress(resolveAddress(profile));
        if (showChannel && campaignChannelName) {
          setCurrentChannelUrl(resolveChannelUrl(profile, campaignChannelName));
        }
      }
      sessionStorage.removeItem("shouldRestoreFormData");
    } else {
      if (profile) {
        setUserName(profile.user?.name || user.name || "");
        setUserAddress(resolveAddress(profile));
        if (campaignChannelName) {
          setCurrentChannelUrl(resolveChannelUrl(profile, campaignChannelName));
        } else {
          setCurrentChannelUrl(userChannelUrl || "");
        }
      } else {
        setUserName(user.name || "");
        setUserAddress("");
        setCurrentChannelUrl(userChannelUrl || "");
      }
    }
  }, [isOpen, user, formData, profile, campaignChannelName, userChannelUrl, showChannel]);

  return {
    userName,
    userAddress,
    currentChannelUrl,
    canApply,
    eligibilityReasons,
    requiredChannelId,
    isChannelConnected,
    postNumber,
    addressRaw,
    addressDetailRaw,
  };
}
