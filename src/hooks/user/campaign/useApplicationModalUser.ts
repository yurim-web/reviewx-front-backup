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
import {
  type StoredUserAccount,
  resolveUserChannelUrl,
} from "@/components/user/campaign_detail/modal/applicationModalUtils";

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

  /** localStorage user_accounts에서 주소 문자열 조합 */
  function resolveAddress(account: StoredUserAccount): string {
    const addrSrc = account.address_details;
    if (addrSrc?.address) {
      const addressPart = addrSrc.detailAddress
        ? `${addrSrc.address} ${addrSrc.detailAddress}`.trim()
        : addrSrc.address;
      return addrSrc.postalCode ? `${addressPart} | ${addrSrc.postalCode}` : addressPart;
    }
    if (account.address && account.postal_code) {
      const addressPart = account.detail_address
        ? `${account.address} ${account.detail_address}`.trim()
        : account.address;
      return `${addressPart} | ${account.postal_code}`;
    }
    return "";
  }

  useEffect(() => {
    if (!isOpen) return;

    const loadFromStorage = (applyUserAccount: (account: StoredUserAccount) => void) => {
      if (typeof window === "undefined" || !user) return;
      try {
        const raw = localStorage.getItem("user_accounts");
        if (!raw) return;
        const accounts = JSON.parse(raw) as StoredUserAccount[];
        const account = accounts.find((a) => a.id === user.id || a.email === user.email);
        if (account) applyUserAccount(account);
      } catch {
        // 파싱 실패 시 기본값 유지
      }
    };

    if (user) {
      const shouldRestore = sessionStorage.getItem("shouldRestoreFormData");

      if (shouldRestore === "true") {
        // 수정 버튼을 통해 돌아온 경우: 채널·주소는 최신 localStorage에서 로드
        loadFromStorage((account) => {
          setUserName(account.name || user.name || "");
          setUserAddress(resolveAddress(account));
          if (showChannel && account.channel_details && campaignChannelName) {
            setCurrentChannelUrl(
              resolveUserChannelUrl(account.channel_details, campaignChannelName)
            );
          }
        });
        sessionStorage.removeItem("shouldRestoreFormData");
      } else {
        // 일반 진입: 입력값 초기화 후 user_accounts에서 로드
        loadFromStorage((account) => {
          setUserName(account.name || user.name || "");
          setUserAddress(resolveAddress(account));
          if (account.channel_details && campaignChannelName) {
            setCurrentChannelUrl(
              resolveUserChannelUrl(account.channel_details, campaignChannelName)
            );
          } else {
            setCurrentChannelUrl(userChannelUrl || "");
          }
        });

        // user_accounts가 없거나 계정을 못 찾은 경우 user 기본값 사용
        if (typeof window !== "undefined" && user) {
          const raw = localStorage.getItem("user_accounts");
          if (!raw) {
            setUserName(user.name || "");
            setUserAddress("");
            setCurrentChannelUrl(userChannelUrl || "");
          }
        }
      }
    } else {
      // 비로그인
      setUserName("");
      setUserAddress("");
      setCurrentChannelUrl(userChannelUrl || "");
    }
  }, [isOpen, user, campaignChannelName, userChannelUrl, showChannel]);

  return { userName, userAddress, currentChannelUrl };
}
