/* ========================================
   📋 캠페인 신청 모달 (통합 컴포넌트)
   ======================================== */

/**
 * 캠페인 신청 모달 컴포넌트
 *
 * 목적: 모든 캠페인 타입(배송형, 구매평, 미션형, 기자단, 방문형)에서 사용하는 통합 모달입니다.
 *
 * 주요 기능:
 * - 신청자 정보 표시 (이름, 주소, 채널 - 타입에 따라 다름)
 * - 메모 입력 (200자 제한)
 * - 동의 체크박스
 * - 긴급 캠페인 추가 동의 체크박스
 * - 캠페인 신청 처리
 *
 * 타입별 차이점:
 * - delivery: 이름 + 주소 + 채널 정보, 버튼 활성화: 채널 연결 + 동의
 * - review: 이름 + 주소, 버튼 활성화: 이름 + 주소 + 동의
 * - mission: 이름 + 주소, 버튼 활성화: 이름 + 주소 + 동의
 * - reporter: 이름 + 채널 정보, 버튼 활성화: 채널 연결 + 이름 + 동의
 * - visit: 이름 + 채널 정보, 버튼 활성화: 채널 연결 + 이름 + 동의
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getChannelLogo } from "@/utils/channelLogoMap";
import BaseModal from "@/components/common/modal/BaseModal";
import { useAuth } from "@/hooks/useAuth";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import { convertExtendedToCampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import styles from "@/styles/user/campaign/application_modal.module.css";

export type ApplicationModalType =
  | "delivery"
  | "review"
  | "mission"
  | "reporter"
  | "visit";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ApplicationModalType; // 모달 타입 (delivery, review, mission, reporter, visit)
  campaignId?: string; // 캠페인 ID
  dayCount?: string; // 남은 일수 또는 상태 (예: "D-5", "마감임박")
  isUrgent?: boolean; // 긴급 캠페인 여부 (기본값: false)
  channelName?: string; // 캠페인에서 요구하는 채널 이름 (예: "인스타그램", "네이버 블로그")
  channelUrl?: string; // 사용자가 연결한 채널 URL (없을 수 있음)
  isParticipated?: boolean; // 이미 참여한 캠페인인지 여부 (기본값: false)
  isSuspended?: boolean; // 일시 정지된 회원인지 여부 (기본값: false)
  isClosed?: boolean; // 등록 기간이 마감되었는지 여부 (기본값: false)
}

export default function ApplicationModal({
  isOpen,
  onClose,
  type,
  campaignId,
  dayCount,
  isUrgent: isUrgentProp = false,
  channelName: campaignChannelName,
  channelUrl: userChannelUrl,
  isParticipated = false,
  isSuspended = false,
  isClosed = false,
}: ApplicationModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  // sessionStorage에서 이전 입력값 복원
  const getStoredFormData = () => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("applicationModalFormData");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  };

  // sessionStorage에 입력값 저장
  const saveFormData = (
    memo: string,
    isAgreed: boolean,
    isUrgentAgreed: boolean
  ) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(
      "applicationModalFormData",
      JSON.stringify({ memo, isAgreed, isUrgentAgreed })
    );
  };

  // sessionStorage에서 입력값 삭제
  const clearFormData = () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("applicationModalFormData");
  };

  // 기본값으로 초기화 (수정 버튼을 통해 돌아온 경우에만 복원)
  const [isAgreed, setIsAgreed] = useState(false);
  const [isUrgentAgreed, setIsUrgentAgreed] = useState(false);
  const [memo, setMemo] = useState("");
  const [userName, setUserName] = useState("");
  // 주소 정보 (등록되어 있지 않으면 빈 문자열)
  const [userAddress, setUserAddress] = useState("");
  // 채널 URL 정보 (props로 받은 값 또는 sessionStorage에서 불러온 값)
  const [currentChannelUrl, setCurrentChannelUrl] = useState(
    userChannelUrl || ""
  );

  // 신청 완료 모달 상태
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // 에러 모달 상태들
  const [isParticipatedModalOpen, setIsParticipatedModalOpen] = useState(false);
  const [isClosedModalOpen, setIsClosedModalOpen] = useState(false);
  const [isSuspendedModalOpen, setIsSuspendedModalOpen] = useState(false);
  const [isInvalidRequestModalOpen, setIsInvalidRequestModalOpen] =
    useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  // 채널 정보: 캠페인에서 요구하는 채널 이름을 사용 (없으면 기본값)
  const channelName = campaignChannelName || "네이버 블로그";
  // 사용자가 연결한 채널 URL (없을 수 있음)
  // sessionStorage에서 불러온 값이 있으면 우선 사용, 없으면 props로 받은 값 사용
  const channelUrl = currentChannelUrl || userChannelUrl || "";

  // 긴급 캠페인 여부 확인
  // isUrgent prop이 있으면 우선 사용, 없으면 dayCount에서 "긴급" 포함 여부 확인 (하위 호환성)
  const isUrgent = isUrgentProp || dayCount?.includes("긴급") || false;

  // 타입별 표시 여부 결정
  const showAddress =
    type === "delivery" ||
    type === "review" ||
    type === "mission";
  const showChannel = type === "delivery" || type === "visit" || type === "reporter";

  // 디버깅: 채널 정보 확인
  useEffect(() => {
    if (isOpen && showChannel) {
      console.log('🔍 [캠페인 신청 모달] 채널 정보:', {
        type,
        campaignChannelName,
        channelName,
        channelUrl,
      });
    }
  }, [isOpen, showChannel, type, campaignChannelName, channelName, channelUrl]);

  // 모달이 열릴 때 사용자 정보 불러오기
  useEffect(() => {
    if (isOpen && user) {
      // 수정 버튼을 통해 돌아온 경우인지 확인
      const shouldRestore = sessionStorage.getItem("shouldRestoreFormData");

      if (shouldRestore === "true") {
        // 저장된 데이터 복원
        const stored = getStoredFormData();
        if (stored) {
          setMemo(stored.memo || "");
          setIsAgreed(stored.isAgreed || false);
          setIsUrgentAgreed(stored.isUrgentAgreed || false);
        }

        // sessionStorage에서 주소 정보 불러오기
        if (typeof window !== "undefined") {
          const storedAddress = sessionStorage.getItem("userAddress");
          if (storedAddress) {
            try {
              const addressData = JSON.parse(storedAddress);
              // 전체 주소 문자열 사용 (기본 주소 + 상세 주소 | 우편번호 + 우편번호값)
              // 예: "인천 남동구 장자로 6번길 2, 1층 | 우편번호 12345"
              // fullAddress가 있으면 사용, 없으면 기존 형식으로 생성 (하위 호환성)
              if (addressData.fullAddress) {
                setUserAddress(addressData.fullAddress);
              } else if (
                addressData.postalCode &&
                addressData.address &&
                addressData.detailAddress
              ) {
                // 기존 형식의 데이터가 있는 경우 새 형식으로 변환
                const addressPart =
                  `${addressData.address} ${addressData.detailAddress}`.trim();
                const postalCodePart = `우편번호 ${addressData.postalCode}`;
                setUserAddress(`${addressPart} | ${postalCodePart}`);
              } else {
                setUserAddress("");
              }
            } catch {
              // 파싱 실패 시 빈 문자열
              setUserAddress("");
            }
          }
        }

        // sessionStorage에서 채널 정보 불러오기
        if (typeof window !== "undefined") {
          const storedChannelInfo = sessionStorage.getItem("userChannelInfo");
          if (storedChannelInfo) {
            try {
              const channelData = JSON.parse(storedChannelInfo);
              // 캠페인에서 요구하는 채널 이름과 일치하는 경우에만 URL 업데이트
              if (channelData.channelName === channelName) {
                setCurrentChannelUrl(channelData.channelUrl || "");
              }
            } catch {
              // 파싱 실패 시 props로 받은 값 유지
              setCurrentChannelUrl(userChannelUrl || "");
            }
          }
        }

        // 복원 플래그 제거
        sessionStorage.removeItem("shouldRestoreFormData");
      } else {
        // 다른 경로로 모달을 열었을 때는 저장된 데이터 삭제하고 로그인된 사용자 정보 불러오기
        clearFormData();
        // 입력값 초기화
        setMemo("");
        setIsAgreed(false);
        setIsUrgentAgreed(false);

        // 로그인된 사용자 정보 불러오기
        if (typeof window !== "undefined") {
          try {
            const storedAccounts = localStorage.getItem('user_accounts');
            if (storedAccounts) {
              const accounts = JSON.parse(storedAccounts);
              const userAccount = accounts.find((a: any) =>
                a.id === user.id || a.email === user.email
              );

              if (userAccount) {
                // 이름 설정
                setUserName(userAccount.name || user.name || "");

                // 주소 설정
                if (userAccount.address && userAccount.postal_code) {
                  const addressPart = userAccount.detail_address
                    ? `${userAccount.address} ${userAccount.detail_address}`.trim()
                    : userAccount.address;
                  const postalCodePart = `우편번호 ${userAccount.postal_code}`;
                  setUserAddress(`${addressPart} | ${postalCodePart}`);
                } else {
                  setUserAddress("");
                }

                // 채널 정보 설정 (캠페인에서 요구하는 채널 확인)
                if (userAccount.channel_details && campaignChannelName) {
                  // 채널 이름을 정규화하여 매칭 (소문자 변환 + 공백 제거)
                  const normalizeChannelName = (name: string) =>
                    name.toLowerCase().replace(/\s+/g, '');

                  const normalizedCampaignChannel = normalizeChannelName(campaignChannelName);

                  const matchedChannel = userAccount.channel_details.find((ch: any) => {
                    const normalizedUserChannel = normalizeChannelName(ch.name);
                    // 양방향 매칭: 캠페인 채널이 유저 채널에 포함되거나, 유저 채널이 캠페인 채널에 포함
                    return normalizedUserChannel.includes(normalizedCampaignChannel) ||
                           normalizedCampaignChannel.includes(normalizedUserChannel);
                  });

                  if (matchedChannel && matchedChannel.status === 'connected' && matchedChannel.url) {
                    setCurrentChannelUrl(matchedChannel.url);
                    console.log('✅ [캠페인 신청] 채널 자동 연동:', {
                      campaignChannel: campaignChannelName,
                      userChannel: matchedChannel.name,
                      url: matchedChannel.url
                    });
                  } else {
                    setCurrentChannelUrl("");
                    console.log('⚠️ [캠페인 신청] 연결된 채널 없음:', {
                      campaignChannel: campaignChannelName,
                      userChannels: userAccount.channel_details
                    });
                  }
                } else {
                  setCurrentChannelUrl(userChannelUrl || "");
                }
              } else {
                // user_accounts에 없으면 user 정보 사용
                setUserName(user.name || "");
                setUserAddress("");
                setCurrentChannelUrl(userChannelUrl || "");
              }
            } else {
              // localStorage에 user_accounts가 없으면 user 정보 사용
              setUserName(user.name || "");
              setUserAddress("");
              setCurrentChannelUrl(userChannelUrl || "");
            }
          } catch (error) {
            console.error('사용자 정보 로드 실패:', error);
            setUserName(user.name || "");
            setUserAddress("");
            setCurrentChannelUrl(userChannelUrl || "");
          }
        }
      }
    } else if (isOpen && !user) {
      // 로그인하지 않은 경우 초기화
      setUserName("");
      setUserAddress("");
      setCurrentChannelUrl(userChannelUrl || "");
    }
  }, [isOpen, user, channelName, userChannelUrl, campaignChannelName]);

  if (!isOpen) return null;

  // 주소 수정 버튼 클릭 시 주소 등록 페이지로 이동
  // 모달 상태를 sessionStorage에 저장하여 뒤로가기 시 모달이 열린 상태로 복원
  // 현재 입력값도 함께 저장하여 뒤로가기 시 복원
  const handleEditUserInfo = () => {
    // 현재 입력값을 sessionStorage에 저장
    saveFormData(memo, isAgreed, isUrgentAgreed);
    // 수정 버튼을 통해 이동했음을 표시하는 플래그 설정
    sessionStorage.setItem("shouldRestoreFormData", "true");
    // sessionStorage에 모달 상태 저장
    sessionStorage.setItem("shouldOpenApplicationModal", "true");
    // 주소만 등록하는 페이지로 이동
    router.push("/user/mypage/address");
  };

  // 채널 연필 버튼 클릭 시 채널 연결 페이지로 이동
  // 모달 상태를 sessionStorage에 저장하여 뒤로가기 시 모달이 열린 상태로 복원
  // SubHeader 표시 플래그도 함께 저장
  // 현재 입력값도 함께 저장하여 뒤로가기 시 복원
  const handleEditChannel = () => {
    // 현재 입력값을 sessionStorage에 저장
    saveFormData(memo, isAgreed, isUrgentAgreed);
    // 수정 버튼을 통해 이동했음을 표시하는 플래그 설정
    sessionStorage.setItem("shouldRestoreFormData", "true");
    // sessionStorage에 모달 상태 저장
    sessionStorage.setItem("shouldOpenApplicationModal", "true");
    // SubHeader 표시 플래그 저장
    sessionStorage.setItem("showSubHeader", "true");
    // 채널 연결 페이지로 이동
    router.push("/user/mypage/channel/connect");
  };

  const handleSubmit = () => {
    // campaignId가 없으면 에러
    if (!campaignId) {
      console.error('❌ [캠페인 신청 실패] campaignId가 없습니다.');
      alert('캠페인 정보를 불러올 수 없습니다. 페이지를 새로고침하고 다시 시도해주세요.');
      return;
    }

    // 1. 이미 참여한 캠페인인지 확인
    if (isParticipated) {
      setIsParticipatedModalOpen(true);
      return;
    }

    // 2. 일시 정지된 회원인지 확인
    if (isSuspended) {
      setIsSuspendedModalOpen(true);
      return;
    }

    // 3. 등록 기간이 마감되었는지 확인
    if (isClosed) {
      setIsClosedModalOpen(true);
      return;
    }

    // 4. 로그인되지 않은 경우
    if (!user) {
      console.error('로그인이 필요합니다');
      return;
    }

    // 5. 캠페인 ID가 없는 경우
    if (!campaignId) {
      console.error('캠페인 ID가 없습니다');
      return;
    }

    // 신청자 정보 저장
    try {
      // user_accounts에서 사용자 상세 정보 가져오기
      const storedAccounts = localStorage.getItem('user_accounts');
      let userAccount: any = null;

      if (storedAccounts) {
        const accounts = JSON.parse(storedAccounts);
        userAccount = accounts.find((a: any) =>
          a.id === user.id || a.email === user.email
        );
      }

      // userAccount 다시 로드 (최신 정보 확인)
      let latestUserAccount = userAccount;
      if (typeof window !== 'undefined') {
        try {
          const storedAccounts = localStorage.getItem('user_accounts');
          if (storedAccounts) {
            const accounts = JSON.parse(storedAccounts);
            const foundAccount = accounts.find((a: any) =>
              a.id === user.id || a.email === user.email
            );
            if (foundAccount) {
              latestUserAccount = foundAccount;
              console.log('✅ [캠페인 신청] user_accounts에서 최신 정보 로드:', {
                id: foundAccount.id,
                daily_visits: foundAccount.daily_visits,
                total_visits: foundAccount.total_visits,
                neighbors: foundAccount.neighbors,
              });
            }
          }
        } catch (error) {
          console.error('❌ [캠페인 신청] user_accounts 로드 실패:', error);
        }
      }

      // 신청자 데이터 생성
      const applicantData = {
        id: user.id,
        userId: user.id,
        email: user.email,
        // 닉네임 우선 사용 (userAccount의 nickname, 없으면 name 사용하지 않고 빈 문자열)
        nickname: latestUserAccount?.nickname || "",
        name: userName, // 이름은 별도로 저장 (하지만 카드에는 표시하지 않음)
        address: userAddress,
        channelUrl: currentChannelUrl,
        channelName: campaignChannelName,
        memo: memo,
        userType: latestUserAccount?.user_type || "리뷰어",
        profileImage: latestUserAccount?.profile_image || "/images/default_profile.png",
        memberType: latestUserAccount?.member_type || "일반 회원",
        dailyVisits: latestUserAccount?.daily_visits || 0,
        totalVisits: latestUserAccount?.total_visits || 0,
        neighbors: latestUserAccount?.neighbors || 0,
        appliedAt: new Date().toISOString(),
        status: "대기", // 신청 상태: 대기, 선정, 탈락
      };

      console.log('✅ [캠페인 신청] 신청자 데이터 생성:', {
        userId: user.id,
        nickname: applicantData.nickname,
        dailyVisits: applicantData.dailyVisits,
        totalVisits: applicantData.totalVisits,
        neighbors: applicantData.neighbors,
        userAccountSource: latestUserAccount ? 'user_accounts' : '없음',
      });

      // localStorage의 해당 캠페인 applicants에 추가
      const campaignType = type === 'delivery' ? 'deliveryCampaigns' :
                          type === 'review' ? 'reviewCampaigns' :
                          type === 'mission' ? 'missionCampaigns' :
                          type === 'reporter' ? 'reporterCampaigns' :
                          'visitCampaigns';

      console.log('🔍 [캠페인 신청] 시작:', {
        campaignId,
        campaignType,
        type,
        userId: user.id,
      });

      const storedCampaigns = localStorage.getItem(campaignType);
      console.log('🔍 [캠페인 신청] localStorage 확인:', {
        campaignType,
        hasStoredCampaigns: !!storedCampaigns,
      });

      if (storedCampaigns) {
        const campaigns = JSON.parse(storedCampaigns);
        console.log('🔍 [캠페인 신청] 캠페인 목록:', {
          totalCampaigns: campaigns.length,
          campaignIds: campaigns.map((c: any) => c.campaignInfo?.id || c.id).slice(0, 5),
        });

        // ID 매칭 로직 개선 (다양한 ID 형식 지원)
        const campaignIndex = campaigns.findIndex((c: any) => {
          const storedId = String(c.campaignInfo?.id || c.id || '');
          const searchId = String(campaignId);
          
          // 정확히 일치하는 경우
          if (storedId === searchId) return true;
          
          // ID 형식 변환 시도 (prefix 제거)
          const typePrefix = type === 'delivery' ? 'delivery_' :
                            type === 'visit' ? 'visit_' :
                            type === 'review' ? 'review_' :
                            type === 'reporter' ? 'reporter_' :
                            type === 'mission' ? 'mission_' : '';
          
          if (typePrefix) {
            // searchId가 "reporter_1" 형식이고 storedId가 "1" 형식인 경우
            if (searchId.startsWith(typePrefix)) {
              const searchIdWithoutPrefix = searchId.replace(new RegExp(`^${typePrefix}`), '');
              if (storedId === searchIdWithoutPrefix) return true;
            }
            // storedId가 "reporter_1" 형식이고 searchId가 "1" 형식인 경우
            if (storedId.startsWith(typePrefix)) {
              const storedIdWithoutPrefix = storedId.replace(new RegExp(`^${typePrefix}`), '');
              if (storedIdWithoutPrefix === searchId) return true;
            }
          }
          
          return false;
        });

        console.log('🔍 [캠페인 신청] 캠페인 찾기 결과:', {
          campaignIndex,
          campaignId,
          found: campaignIndex >= 0,
        });

        if (campaignIndex >= 0) {
          const campaign = campaigns[campaignIndex];

          // applicantData가 없으면 초기화
          if (!campaign.applicantData) {
            campaign.applicantData = {
              applicants: [],
              selectedApplicants: [],
            };
          }

          // 중복 신청 체크
          const isDuplicate = campaign.applicantData.applicants.some((a: any) =>
            a.id === user.id || a.userId === user.id
          );

          if (isDuplicate) {
            // 중복 신청 시 모달 표시
            setIsDuplicateModalOpen(true);
            return;
          }

          // 신청자 추가
          campaign.applicantData.applicants.push(applicantData);

          // campaignInfo의 recruitedCount 증가
          if (campaign.campaignInfo) {
            campaign.campaignInfo.recruitedCount =
              (campaign.campaignInfo.recruitedCount || 0) + 1;
          }

          // localStorage에 저장
          campaigns[campaignIndex] = campaign;
          localStorage.setItem(campaignType, JSON.stringify(campaigns));

          console.log('✅ 캠페인 신청 완료:', {
            campaignId,
            campaignType,
            applicant: applicantData,
          });

          // 유저 신청 내역에도 추가
          const userAppliedCampaigns = localStorage.getItem('user_applied_campaigns');
          let appliedCampaigns: any[] = [];

          if (userAppliedCampaigns) {
            appliedCampaigns = JSON.parse(userAppliedCampaigns);
          }

          // 유저별 신청 내역 찾기
          let userCampaigns = appliedCampaigns.find((uc: any) => uc.userId === user.id);

          if (!userCampaigns) {
            userCampaigns = {
              userId: user.id,
              campaigns: []
            };
            appliedCampaigns.push(userCampaigns);
          }

          // 신청 내역에 캠페인 추가
          userCampaigns.campaigns.push({
            campaignId: campaignId,
            campaignType: type,
            campaignTitle: campaign.campaignInfo?.title || campaign.title || '',
            campaignImage: campaign.campaignInfo?.image || campaign.image || '',
            appliedAt: applicantData.appliedAt,
            status: '대기', // 대기, 선정, 탈락
            memo: memo,
            channel: campaignChannelName || campaign.campaignInfo?.channel || campaign.channel || '', // 채널 정보 추가
          });

          localStorage.setItem('user_applied_campaigns', JSON.stringify(appliedCampaigns));

          console.log('✅ 유저 신청 내역에 추가 완료:', {
            userId: user.id,
            campaignId,
          });

          // 신청 완료 모달 열기
          setIsSuccessModalOpen(true);
        } else {
          // 캠페인을 찾지 못한 경우 - 목업 데이터에서 찾아서 localStorage에 추가
          console.log('🔍 [캠페인 신청] localStorage에서 찾지 못함, 목업 데이터에서 찾기 시도:', {
            campaignId,
            campaignType,
          });

          // getCampaignById로 목업 데이터에서 찾기 (다양한 ID 형식 시도)
          let mockCampaign = getCampaignById(campaignId);
          
          // 찾지 못한 경우 ID 형식 변환 시도
          if (!mockCampaign) {
            const typePrefix = type === 'delivery' ? 'delivery_' :
                              type === 'visit' ? 'visit_' :
                              type === 'review' ? 'review_' :
                              type === 'reporter' ? 'reporter_' :
                              type === 'mission' ? 'mission_' : '';
            
            if (typePrefix && campaignId.startsWith(typePrefix)) {
              // "reporter_1" -> "1"로 변환 시도
              const idWithoutPrefix = campaignId.replace(new RegExp(`^${typePrefix}`), '');
              mockCampaign = getCampaignById(idWithoutPrefix);
            } else if (typePrefix) {
              // "1" -> "reporter_1"로 변환 시도
              const idWithPrefix = `${typePrefix}${campaignId}`;
              mockCampaign = getCampaignById(idWithPrefix);
            }
          }
          
          if (mockCampaign) {
            console.log('✅ [캠페인 신청] 목업 데이터에서 캠페인 찾음, localStorage에 추가:', {
              campaignId,
              campaignType,
              title: mockCampaign.campaignInfo.title,
            });

            // applicantData가 없으면 초기화
            if (!mockCampaign.applicantData) {
              mockCampaign.applicantData = {
                applicants: [],
                selectedApplicants: [],
              };
            }

            // 중복 신청 체크
            const isDuplicate = mockCampaign.applicantData.applicants.some((a: any) =>
              a.id === user.id || a.userId === user.id
            );

            if (isDuplicate) {
              // 중복 신청 시 모달 표시
              setIsDuplicateModalOpen(true);
              return;
            }

            // 신청자 추가
            mockCampaign.applicantData.applicants.push(applicantData);

            // campaignInfo의 recruitedCount 증가
            mockCampaign.campaignInfo.recruitedCount =
              (mockCampaign.campaignInfo.recruitedCount || 0) + 1;

            // localStorage에 추가
            campaigns.push(mockCampaign);
            localStorage.setItem(campaignType, JSON.stringify(campaigns));

            console.log('✅ [캠페인 신청] 목업 데이터 캠페인 localStorage에 추가 완료:', {
              campaignId,
              campaignType,
              applicant: applicantData,
            });

            // 유저 신청 내역에도 추가
            const userAppliedCampaigns = localStorage.getItem('user_applied_campaigns');
            let appliedCampaigns: any[] = [];

            if (userAppliedCampaigns) {
              appliedCampaigns = JSON.parse(userAppliedCampaigns);
            }

            // 유저별 신청 내역 찾기
            let userCampaigns = appliedCampaigns.find((uc: any) => uc.userId === user.id);

            if (!userCampaigns) {
              userCampaigns = {
                userId: user.id,
                campaigns: []
              };
              appliedCampaigns.push(userCampaigns);
            }

            // 신청 내역에 캠페인 추가
            userCampaigns.campaigns.push({
              campaignId: campaignId,
              campaignType: type,
              campaignTitle: mockCampaign.campaignInfo.title || '',
              campaignImage: mockCampaign.campaignInfo.image || '',
              appliedAt: applicantData.appliedAt,
              status: '대기',
              memo: memo,
              channel: campaignChannelName || mockCampaign.campaignInfo.brandName || '',
            });

            localStorage.setItem('user_applied_campaigns', JSON.stringify(appliedCampaigns));

            console.log('✅ [캠페인 신청] 유저 신청 내역에 추가 완료:', {
              userId: user.id,
              campaignId,
            });

            // 신청 완료 모달 열기
            setIsSuccessModalOpen(true);
          } else {
            // 목업 데이터에서도 찾지 못한 경우
            console.error('❌ [캠페인 신청 실패] 목업 데이터에서도 캠페인을 찾을 수 없습니다:', {
              campaignId,
              campaignType,
              availableIds: campaigns.map((c: any) => c.campaignInfo?.id || c.id).slice(0, 10),
            });
            alert('캠페인을 찾을 수 없습니다. 페이지를 새로고침하고 다시 시도해주세요.');
            return;
          }
        }
      } else {
        // localStorage에 캠페인 데이터가 없는 경우 - 목업 데이터에서 가져와서 초기화
        console.log('🔍 [캠페인 신청] localStorage에 데이터 없음, 목업 데이터에서 찾기 시도:', {
          campaignType,
          campaignId,
        });

        // getCampaignById로 목업 데이터에서 찾기 (다양한 ID 형식 시도)
        let mockCampaign = getCampaignById(campaignId);
        
        // 찾지 못한 경우 ID 형식 변환 시도
        if (!mockCampaign) {
          const typePrefix = type === 'delivery' ? 'delivery_' :
                            type === 'visit' ? 'visit_' :
                            type === 'review' ? 'review_' :
                            type === 'reporter' ? 'reporter_' :
                            type === 'mission' ? 'mission_' : '';
          
          if (typePrefix && campaignId.startsWith(typePrefix)) {
            // "reporter_1" -> "1"로 변환 시도
            const idWithoutPrefix = campaignId.replace(new RegExp(`^${typePrefix}`), '');
            mockCampaign = getCampaignById(idWithoutPrefix);
          } else if (typePrefix) {
            // "1" -> "reporter_1"로 변환 시도
            const idWithPrefix = `${typePrefix}${campaignId}`;
            mockCampaign = getCampaignById(idWithPrefix);
          }
        }
        
        if (mockCampaign) {
          console.log('✅ [캠페인 신청] 목업 데이터에서 캠페인 찾음, localStorage 초기화:', {
            campaignId,
            campaignType,
            title: mockCampaign.campaignInfo.title,
          });

          // applicantData가 없으면 초기화
          if (!mockCampaign.applicantData) {
            mockCampaign.applicantData = {
              applicants: [],
              selectedApplicants: [],
            };
          }

          // 중복 신청 체크
          const isDuplicate = mockCampaign.applicantData.applicants.some((a: any) =>
            a.id === user.id || a.userId === user.id
          );

          if (isDuplicate) {
            // 중복 신청 시 모달 표시
            setIsDuplicateModalOpen(true);
            return;
          }

          // 신청자 추가
          mockCampaign.applicantData.applicants.push(applicantData);

          // campaignInfo의 recruitedCount 증가
          mockCampaign.campaignInfo.recruitedCount =
            (mockCampaign.campaignInfo.recruitedCount || 0) + 1;

          // localStorage에 초기화 (목업 데이터를 기반으로)
          const initialCampaigns = [mockCampaign];
          localStorage.setItem(campaignType, JSON.stringify(initialCampaigns));

          console.log('✅ [캠페인 신청] 목업 데이터로 localStorage 초기화 완료:', {
            campaignId,
            campaignType,
            applicant: applicantData,
          });

          // 유저 신청 내역에도 추가
          const userAppliedCampaigns = localStorage.getItem('user_applied_campaigns');
          let appliedCampaigns: any[] = [];

          if (userAppliedCampaigns) {
            appliedCampaigns = JSON.parse(userAppliedCampaigns);
          }

          // 유저별 신청 내역 찾기
          let userCampaigns = appliedCampaigns.find((uc: any) => uc.userId === user.id);

          if (!userCampaigns) {
            userCampaigns = {
              userId: user.id,
              campaigns: []
            };
            appliedCampaigns.push(userCampaigns);
          }

          // 신청 내역에 캠페인 추가
          userCampaigns.campaigns.push({
            campaignId: campaignId,
            campaignType: type,
            campaignTitle: mockCampaign.campaignInfo.title || '',
            campaignImage: mockCampaign.campaignInfo.image || '',
            appliedAt: applicantData.appliedAt,
            status: '대기',
            memo: memo,
            channel: campaignChannelName || mockCampaign.campaignInfo.brandName || '',
          });

          localStorage.setItem('user_applied_campaigns', JSON.stringify(appliedCampaigns));

          console.log('✅ [캠페인 신청] 유저 신청 내역에 추가 완료:', {
            userId: user.id,
            campaignId,
          });

          // 신청 완료 모달 열기
          setIsSuccessModalOpen(true);
        } else {
          // 목업 데이터에서도 찾지 못한 경우
          console.error('❌ [캠페인 신청 실패] 목업 데이터에서도 캠페인을 찾을 수 없습니다:', {
            campaignType,
            campaignId,
          });
          alert('캠페인 데이터를 불러올 수 없습니다. 페이지를 새로고침하고 다시 시도해주세요.');
          return;
        }
      }
    } catch (error) {
      console.error('❌ [캠페인 신청 저장 실패]', error);
      alert('캠페인 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
      return;
    }
  };

  // 신청 완료 모달 닫기 핸들러
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    // 신청 완료 후 저장된 입력값 및 플래그 삭제
    clearFormData();
    sessionStorage.removeItem("shouldRestoreFormData");
    // 기존 모달도 닫기
    onClose();
  };

  // 타입별 버튼 활성화 조건
  const getSubmitDisabled = () => {
    // 일시 정지된 회원은 항상 비활성화
    if (isSuspended) {
      return true;
    }

    // delivery: 채널 연결 + 동의 체크
    if (type === "delivery") {
      // 채널이 연결되지 않았으면 비활성화
      if (!channelUrl) {
        return true;
      }
      return isUrgent ? !isAgreed || !isUrgentAgreed : !isAgreed;
    }

    // review, mission: 이름 + 주소 + 동의
    if (type === "review" || type === "mission") {
      return (
        userName.trim() === "" ||
        userAddress.trim() === "" ||
        !isAgreed ||
        (isUrgent && !isUrgentAgreed)
      );
    }

    // visit, reporter: 채널 연결 + 이름 + 동의
    if (type === "visit" || type === "reporter") {
      // 채널이 연결되지 않았으면 비활성화
      if (!channelUrl) {
        return true;
      }
      return (
        userName.trim() === "" || !isAgreed || (isUrgent && !isUrgentAgreed)
      );
    }

    return true;
  };

  const isSubmitDisabled = getSubmitDisabled();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // 모달을 닫을 때는 입력값을 유지 (뒤로가기 시 복원을 위해)
      onClose();
    }
  };

  // 모달이 닫힐 때 (X 버튼 클릭 등)
  // 수정 버튼을 통해 이동한 게 아닌 경우 저장된 데이터 삭제
  const handleClose = () => {
    // 수정 버튼을 통해 돌아온 게 아닌 경우에만 데이터 삭제
    const shouldRestore = sessionStorage.getItem("shouldRestoreFormData");
    if (shouldRestore !== "true") {
      clearFormData();
    }
    onClose();
  };

  return (
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div className={styles.modal_container}>
        {/* 모달 헤더 */}
        <div className={styles.modal_header}>
          <h2 className={styles.modal_title}>캠페인 신청</h2>
          <button className={styles.close_button} onClick={handleClose}>
            <img src="/images/filter/x_icon.svg" alt="닫기" />
          </button>
        </div>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className={styles.modal_content}>
          {/* 신청자 정보 및 채널 정보 섹션 */}
          <div className={styles.application_info_container}>
            {/* 신청자 정보 섹션 */}
            <div className={styles.section}>
              <h3 className={styles.section_title}>신청자 정보</h3>
              {/* 신청자 정보 컨테이너 */}
              <div className={styles.user_info_wrapper}>
                {/* 이름 입력칸 - 읽기 전용 (자동으로 불러오는 값) */}
                <div className={styles.user_info_row}>
                  <input
                    type="text"
                    value={userName}
                    readOnly
                    className={styles.user_input}
                    placeholder="이름을 입력하세요"
                  />
                </div>
                {/* 주소 정보 - 타입에 따라 표시 여부 결정 */}
                {showAddress && (
                  <div className={styles.address_container}>
                    <div className={styles.address_info}>
                      {userAddress.trim() ? (
                        <div className={styles.address_text}>{userAddress}</div>
                      ) : (
                        <div className={styles.address_text_empty}>
                          주소지를 등록해 주세요.
                        </div>
                      )}
                    </div>
                    {/* 수정 버튼 - 클릭 시 주소 등록 페이지로 이동 */}
                    <button
                      className={styles.edit_button}
                      onClick={handleEditUserInfo}
                      type="button"
                    >
                      <img
                        src="/images/campaign_detail/pencil_icon.svg"
                        alt="수정"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 채널 정보 섹션 - 타입에 따라 표시 여부 결정 */}
            {showChannel && (
              <div className={styles.section}>
                <div className={styles.channel_container}>
                  {/* 채널 아이콘 - 채널 이름에 따라 동적으로 표시 */}
                  <div className={styles.channel_icon}>
                    <img
                      src={getChannelLogo(channelName)}
                      alt={channelName}
                      className={styles.channel_icon_image}
                    />
                  </div>
                  <div className={styles.channel_info}>
                    <div className={styles.channel_name}>{channelName}</div>
                    {channelUrl ? (
                      <div className={styles.channel_url}>{channelUrl}</div>
                    ) : (
                      <div className={styles.channel_url_empty}>
                        계정을 연결해 주세요.
                      </div>
                    )}
                  </div>
                  {/* 수정 버튼 - 클릭 시 채널 설정 페이지로 이동 */}
                  <button
                    className={styles.edit_button}
                    onClick={handleEditChannel}
                    type="button"
                  >
                    <img
                      src="/images/campaign_detail/pencil_icon.svg"
                      alt="수정"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 메모 섹션 */}
          <div className={styles.section}>
            <h3 className={styles.section_title}>메모</h3>
            <div className={styles.memo_container}>
              <input
                type="text"
                placeholder="신청 사유 혹은 캠페인에 대한 옵션 작성"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className={styles.memo_input}
                maxLength={200}
              />
            </div>
          </div>

          {/* 동의 섹션 */}
          <div className={styles.section}>
            <h3 className={styles.section_title}>동의</h3>
            <div className={styles.agreement_container}>
              {/* 첫 번째 동의 체크박스 */}
              <label className={styles.checkbox_label}>
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.agreement_text}>
                  본 캠페인과 관련된 유의사항, 개인정보 및 콘텐츠의 제3자 제공,
                  저작물 사용, 초상권 활용에 대해 동의합니다.
                </span>
              </label>

              {/* 긴급 캠페인 추가 동의 체크박스 - 긴급 캠페인일 때만 표시 */}
              {isUrgent && (
                <label className={styles.checkbox_label}>
                  <input
                    type="checkbox"
                    checked={isUrgentAgreed}
                    onChange={(e) => setIsUrgentAgreed(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.agreement_text}>
                    긴급 캠페인과 관련된 유의사항에 대해 확인했습니다.
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className={styles.button_container}>
          <button
            className={styles.connect_button}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            신청
          </button>
        </div>
      </div>

      {/* 신청 완료 모달 */}
      <BaseModal
        is_open={isSuccessModalOpen}
        on_close={handleSuccessModalClose}
        message="캠페인 신청이 완료되었습니다."
        buttons={["닫기"]}
      />

      {/* 이미 참여했는데 신청 버튼이 활성화 되어있는 상태에서 다시 신청 눌렀을 때 모달 */}
      <BaseModal
        is_open={isParticipatedModalOpen}
        on_close={() => setIsParticipatedModalOpen(false)}
        message="이미 참여한 캠페인입니다."
        buttons={["확인"]}
      />

      {/* 신청 버튼이 활성화 되어있는 상태에서 마감되었을 경우 모달 */}
      <BaseModal
        is_open={isClosedModalOpen}
        on_close={() => setIsClosedModalOpen(false)}
        message="등록 기간이 마감되었습니다."
        buttons={["닫기"]}
      />

      {/* 일시 정지된 회원이 캠페인 신청 시 모달 */}
      <BaseModal
        is_open={isSuspendedModalOpen}
        on_close={() => setIsSuspendedModalOpen(false)}
        message="정지 회원은 캠페인 신청이 불가합니다."
        buttons={["닫기"]}
      />

      {/* 일시 정지 상태에서 버튼이 활성화되어 있을 때 모달 */}
      <BaseModal
        is_open={isInvalidRequestModalOpen}
        on_close={() => setIsInvalidRequestModalOpen(false)}
        message="유효하지 않은 요청입니다."
        buttons={["확인"]}
      />

      {/* 중복 신청 시 모달 */}
      <BaseModal
        is_open={isDuplicateModalOpen}
        on_close={() => {
          setIsDuplicateModalOpen(false);
          onClose(); // 신청 모달도 닫기
        }}
        message="이미 참여한 캠페인입니다."
        buttons={["확인"]}
      />
    </div>
  );
}
