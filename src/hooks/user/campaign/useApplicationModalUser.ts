/* ========================================
   캠페인 신청 모달 유저/주소/채널 정보 커스텀 훅
   ======================================== */

/**
 * useApplicationModalUser
 *
 * 목적: 캠페인 신청 모달에서 로그인 유저의 이름·주소·채널 URL을 localStorage에서 로드합니다.
 *
 * 사용 페이지:
 * - /user/campaign/[type]/[id] (캠페인 상세 - 신청 모달)
 */

import { useState, useEffect } from "react";
import type { AuthUser } from "@/types/auth";
import { resolveUserChannelUrl } from "@/components/user/campaign_detail/modal/applicationModalUtils";
import { useReviewerProfile } from "@/hooks/user/mypage/useReviewerProfile";
import type { ReviewerProfileResponse } from "@/types/api/reviewer";

interface UseApplicationModalUserParams {
  isOpen: boolean;
  user: AuthUser | null;
  campaignChannelName?: string;
  userChannelUrl?: string;
  showChannel: boolean;
}

export function useApplicationModalUser({
  isOpen,
  user,
  campaignChannelName,
  userChannelUrl,
  showChannel,
}: UseApplicationModalUserParams) {
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [currentChannelUrl, setCurrentChannelUrl] = useState(userChannelUrl || "");
  const { data: profile } = useReviewerProfile(user?.id);

  /** 서버 프로필에서 주소 문자열 조합 */
  function resolveAddress(p: ReviewerProfileResponse): string {
    if (p.address && p.postal_code) {
      const addressPart = p.detail_address ? `${p.address} ${p.detail_address}`.trim() : p.address;
      return `${addressPart} | ${p.postal_code}`;
    }
    return p.address || "";
  }

  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      const shouldRestore = sessionStorage.getItem("shouldRestoreFormData");

      if (shouldRestore === "true") {
        // 수정 버튼을 통해 돌아온 경우
        if (profile) {
          setUserName(profile.name || user.name || "");
          setUserAddress(resolveAddress(profile));
          if (showChannel && profile.channel_details && campaignChannelName) {
            setCurrentChannelUrl(
              resolveUserChannelUrl(profile.channel_details, campaignChannelName)
            );
          }
        }
        sessionStorage.removeItem("shouldRestoreFormData");
      } else {
        // 일반 진입
        if (profile) {
          setUserName(profile.name || user.name || "");
          setUserAddress(resolveAddress(profile));
          if (profile.channel_details && campaignChannelName) {
            setCurrentChannelUrl(
              resolveUserChannelUrl(profile.channel_details, campaignChannelName)
            );
          } else {
            setCurrentChannelUrl(userChannelUrl || "");
          }
        } else {
          // 서버 프로필이 없으면 user 기본값 사용
          setUserName(user.name || "");
          setUserAddress("");
          setCurrentChannelUrl(userChannelUrl || "");
        }
      }
    } else {
      // 비로그인
      setUserName("");
      setUserAddress("");
      setCurrentChannelUrl(userChannelUrl || "");
    }
  }, [isOpen, user, profile, campaignChannelName, userChannelUrl, showChannel]);

  return { userName, userAddress, currentChannelUrl };
}
