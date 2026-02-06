/* ========================================
   👤 GA 관리자 리뷰어 디테일 페이지
   ======================================== */

/**
 * GA 관리자 리뷰어 디테일 페이지
 *
 * 목적: GA 관리자가 특정 리뷰어의 상세 정보를 확인할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/member/reviewers/[id] (동적 라우트)
 *
 * 주요 기능:
 * - 리뷰어 프로필 정보 (닉네임, 이름, 성별, 나이, 이메일, 전화번호, 주소)
 * - 활동 정보 (채널 정보, 캠페인 진행/완료, 패널티, 접속일, 가입일, 보유 포인트, 출금 포인트)
 * - 채널 상세 정보 (네이버 블로그, 네이버 클립, 인스타그램, 유튜브)
 * - 계좌 정보 (예금주, 은행, 계좌번호, 주민등록번호)
 * - 최근 진행 캠페인 정보 테이블
 *
 *
 * @returns 리뷰어 디테일 페이지 JSX
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  get_reviewer_detail_by_id,
  reviewer_list,
  type ReviewerDetail,
  type Channel,
} from "@/data/manager_ga/member/reviewers";
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import CampaignHistoryModal from "@/components/manager/common/member/reviewers/CampaignHistoryModal";
import PenaltyHistoryModal from "@/components/manager/common/member/reviewers/PenaltyHistoryModal";
import MemberDetailLayout from "@/components/manager/common/member/member_detail/MemberDetailLayout";
import ProfileSection from "@/components/manager/common/member/member_detail/ProfileSection";
import ActivityInfoSection, {
  type ActivityInfoItem,
} from "@/components/manager/common/member/member_detail/ActivityInfoSection";
import ChannelInfoSection from "@/components/manager/common/member/reviewers/section/ChannelInfoSection";
import AccountInfoSection from "@/components/manager/common/member/reviewers/section/AccountInfoSection";
import BaseModal from "@/components/common/modal/BaseModal";
import styles from "@/styles/manager/common/member/member_detail/detail_page.module.css";
import infoCardStyles from "@/styles/manager/common/member/member_detail/info_card.module.css";

// 채널 아이콘 경로 매핑
const channel_icon_map: Record<Channel, string> = {
  Blog: "/images/brand_logo/naverblog.svg",
  Clip: "/images/brand_logo/naverclip.svg",
  Instagram: "/images/brand_logo/insta.svg",
  Youtube: "/images/brand_logo/youtube.svg",
  Store: "/images/brand_logo/navershop.svg",
  Mission: "/images/brand_logo/misssion.svg",
  Reels: "/images/brand_logo/reels.svg",
  Shorts: "/images/brand_logo/shots.svg",
};

export default function ReviewerDetailPage() {
  // useParams: Next.js에서 제공하는 훅으로, URL 파라미터를 가져옵니다
  // [id] 폴더 구조에서 id 값을 추출합니다
  const params = useParams();
  const router = useRouter();
  const reviewer_id = params.id as string;

  // 리뷰어 디테일 정보 상태 관리
  const [reviewer_detail, set_reviewer_detail] =
    useState<ReviewerDetail | null>(null);
  const [is_loading, set_is_loading] = useState(true);

  // 캠페인 진행 내역 모달 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  const [is_campaign_history_modal_open, set_is_campaign_history_modal_open] =
    useState(false);

  // 패널티 내역 모달 상태 관리
  const [is_penalty_history_modal_open, set_is_penalty_history_modal_open] =
    useState(false);

  // 탈퇴 회원 조회 불가 모달 상태
  const [is_withdrawn_modal_open, set_is_withdrawn_modal_open] =
    useState(false);

  // 컴포넌트가 마운트될 때 리뷰어 정보를 가져옵니다
  // useEffect: React의 Hook으로, 컴포넌트가 렌더링된 후에 실행됩니다
  useEffect(() => {
    // 비동기 함수를 정의합니다
    const fetch_reviewer_detail = async () => {
      set_is_loading(true);

      // user_kakao_001, user_naver_001, 1, 2의 경우 직접 localStorage에서 데이터 로드
      if ((reviewer_id === 'user_kakao_001' || reviewer_id === 'user_naver_001' || reviewer_id === '1' || reviewer_id === '2') && typeof window !== 'undefined') {
        try {
          const storedAccounts = localStorage.getItem('user_accounts');
          console.log('🔍 [리뷰어 상세] useEffect에서 읽은 user_accounts:', storedAccounts);

          if (storedAccounts) {
            const accounts = JSON.parse(storedAccounts);
            // ID 매핑: 1 -> user_kakao_001, 2 -> user_naver_001
            const mappedId = reviewer_id === '1' ? 'user_kakao_001' : reviewer_id === '2' ? 'user_naver_001' : reviewer_id;
            const userAccount = accounts.find((a: any) =>
              a.id === mappedId
            );

            console.log('✅ [리뷰어 상세] useEffect에서 찾은 user 계정:', userAccount);

            if (userAccount) {
              // 채널 이름 매핑 (한글 -> 영문)
              const channelNameMap: Record<string, Channel> = {
                '네이버 블로그': 'Blog',
                '네이버 클립': 'Clip',
                '인스타그램': 'Instagram',
                '유튜브': 'Youtube',
              };

              // channel_details에서 모든 채널 추출 (연결, 미연결 모두 포함)
              const connectedChannels: Channel[] = [];
              const channelDetails: any[] = [];

              if (userAccount.channel_details) {
                userAccount.channel_details.forEach((ch: any) => {
                  const channelType = channelNameMap[ch.name];
                  if (channelType) {
                    const isConnected = ch.status === 'connected';

                    // 연결된 채널만 connectedChannels에 추가
                    if (isConnected) {
                      connectedChannels.push(channelType);
                    }

                    // 모든 채널을 channelDetails에 추가 (연결 여부 포함)
                    if (channelType === 'Blog') {
                      channelDetails.push({
                        channel: channelType,
                        daily_visits: isConnected ? 100 : undefined,
                        total_visits: isConnected ? 10000 : undefined,
                        neighbors: isConnected ? 500 : undefined,
                        is_connected: isConnected,
                      });
                    } else if (channelType === 'Clip' || channelType === 'Instagram') {
                      channelDetails.push({
                        channel: channelType,
                        followers: isConnected ? (channelType === 'Instagram' ? 5000 : 1000) : undefined,
                        is_connected: isConnected,
                      });
                    } else if (channelType === 'Youtube') {
                      channelDetails.push({
                        channel: channelType,
                        subscribers: isConnected ? 2000 : undefined,
                        is_connected: isConnected,
                      });
                    }
                  }
                });
              }

              // channel_details가 없으면 기본값 설정 (모든 채널을 미연결 상태로)
              if (channelDetails.length === 0) {
                channelDetails.push(
                  { channel: 'Blog', daily_visits: undefined, total_visits: undefined, neighbors: undefined, is_connected: false },
                  { channel: 'Clip', followers: undefined, is_connected: false },
                  { channel: 'Instagram', followers: undefined, is_connected: false },
                  { channel: 'Youtube', subscribers: undefined, is_connected: false }
                );
              }

              // localStorage에서 신청한 캠페인 정보 가져오기
              let campaignParticipated = 0;
              let campaignCompleted = 0;
              let recentCampaigns: any[] = [];

              try {
                const userAppliedCampaigns = localStorage.getItem('user_applied_campaigns');
                if (userAppliedCampaigns) {
                  const allAppliedCampaigns = JSON.parse(userAppliedCampaigns);
                  const userCampaigns = allAppliedCampaigns.find((uc: any) => uc.userId === mappedId);

                  if (userCampaigns && userCampaigns.campaigns) {
                    const campaigns = userCampaigns.campaigns;

                    // 캠페인 진행 = 대기 + 선정 상태인 캠페인 수
                    campaignParticipated = campaigns.filter((c: any) =>
                      c.status === '대기' || c.status === '선정'
                    ).length;

                    // 캠페인 완료 = 완료 상태인 캠페인 수
                    campaignCompleted = campaigns.filter((c: any) => c.status === '완료').length;

                    // 실제 캠페인 데이터에서 포인트와 채널 정보 가져오기
                    const getCampaignInfo = (campaignId: string, campaignType: string): { points: number; channel: Channel } => {
                      try {
                        const campaignTypeKey = campaignType === 'delivery' ? 'deliveryCampaigns' :
                                                 campaignType === 'review' ? 'reviewCampaigns' :
                                                 campaignType === 'mission' ? 'missionCampaigns' :
                                                 campaignType === 'reporter' ? 'reporterCampaigns' :
                                                 campaignType === 'visit' ? 'visitCampaigns' : null;
                        
                        if (!campaignTypeKey) return { points: 0, channel: 'Blog' as Channel };
                        
                        const storedCampaigns = localStorage.getItem(campaignTypeKey);
                        if (storedCampaigns) {
                          const allCampaigns = JSON.parse(storedCampaigns);
                          
                          // ID 매칭 로직 개선 (다양한 ID 형식 지원)
                          const campaign = allCampaigns.find((c: any) => {
                            // localStorage의 캠페인은 campaignInfo 구조를 가지고 있음
                            const campId = String(c.campaignInfo?.id || c.id || '');
                            const storedId = String(campaignId);
                            
                            // 정확히 일치하는 경우
                            if (campId === storedId) return true;
                            
                            // ID 형식 변환 시도
                            const typePrefix = campaignType === 'delivery' ? 'delivery_' :
                                               campaignType === 'visit' ? 'visit_' :
                                               campaignType === 'review' ? 'review_' :
                                               campaignType === 'reporter' ? 'reporter_' :
                                               campaignType === 'mission' ? 'mission_' : '';
                            
                            if (typePrefix) {
                              // storedId가 "reporter_13"이고 campId가 "reporter_13"인 경우
                              if (storedId.startsWith(typePrefix) && campId === storedId) return true;
                              // storedId가 "reporter_13"이고 campId가 "13"인 경우
                              if (storedId.startsWith(typePrefix)) {
                                const storedIdWithoutPrefix = storedId.replace(new RegExp(`^${typePrefix}`), '');
                                if (campId === storedIdWithoutPrefix) return true;
                              }
                              // storedId가 "13"이고 campId가 "reporter_13"인 경우
                              if (campId.startsWith(typePrefix)) {
                                const campIdWithoutPrefix = campId.replace(new RegExp(`^${typePrefix}`), '');
                                if (campIdWithoutPrefix === storedId) return true;
                              }
                              // storedId가 "13"이고 campId가 "13"인 경우 (둘 다 prefix 없음)
                              if (!storedId.startsWith(typePrefix) && !campId.startsWith(typePrefix)) {
                                if (campId === storedId) return true;
                              }
                            }
                            
                            return false;
                          });
                          
                          if (campaign) {
                            // 포인트 정보 찾기 (다양한 경로 확인)
                            const points = campaign.campaignInfo?.points || 
                                          campaign.points || 
                                          campaign.totalPoints || 
                                          0;
                            
                            // 채널 정보 찾기
                            let channel: Channel = 'Blog';
                            const channelName = campaign.campaignInfo?.channel || campaign.channel || '';
                            
                            // 채널 이름을 Channel 타입으로 변환
                            if (channelName) {
                              const channelMap: Record<string, Channel> = {
                                '네이버블로그': 'Blog',
                                '네이버 블로그': 'Blog',
                                '블로그': 'Blog',
                                'Blog': 'Blog',
                                '네이버클립': 'Clip',
                                '네이버 클립': 'Clip',
                                '클립': 'Clip',
                                'Clip': 'Clip',
                                '인스타그램': 'Instagram',
                                'Instagram': 'Instagram',
                                '유튜브': 'Youtube',
                                'Youtube': 'Youtube',
                                '릴스': 'Reels',
                                'Reels': 'Reels',
                                '쇼츠': 'Shorts',
                                'Shorts': 'Shorts',
                                '숏츠': 'Shorts',
                              };
                              
                              const normalizedChannel = channelName.replace(/\s+/g, '');
                              channel = channelMap[normalizedChannel] || channelMap[channelName] || 'Blog';
                            }
                            
                            console.log(`[GA 리뷰어 상세] 캠페인 정보 찾음:`, {
                              campaignId,
                              campaignType,
                              foundCampaignId: campaign.campaignInfo?.id || campaign.id,
                              points,
                              channel,
                              channelName,
                            });
                            
                            return { points, channel };
                          } else {
                            // localStorage에서 찾지 못한 경우 정적 데이터에서 찾기
                            const allStaticCampaigns = [
                              ...deliveryCampaigns,
                              ...visitCampaigns,
                              ...reviewCampaigns,
                              ...reporterCampaigns,
                              ...missionCampaigns,
                            ];
                            
                            const foundInStatic = allStaticCampaigns.find((c: any) => {
                              // 정적 데이터는 campaignInfo 구조가 없을 수 있으므로 직접 id 확인
                              const campId = String(c.campaignInfo?.id || c.id || '');
                              const storedId = String(campaignId);
                              
                              // 정확히 일치하는 경우
                              if (campId === storedId) return true;
                              
                              // ID 형식 변환 시도
                              const typePrefix = campaignType === 'delivery' ? 'delivery_' :
                                                 campaignType === 'visit' ? 'visit_' :
                                                 campaignType === 'review' ? 'review_' :
                                                 campaignType === 'reporter' ? 'reporter_' :
                                                 campaignType === 'mission' ? 'mission_' : '';
                              
                              // prefix가 있는 경우와 없는 경우 모두 처리
                              if (typePrefix) {
                                // storedId가 "reporter_13"이고 campId가 "reporter_13"인 경우
                                if (storedId.startsWith(typePrefix) && campId === storedId) return true;
                                // storedId가 "reporter_13"이고 campId가 "13"인 경우
                                if (storedId.startsWith(typePrefix)) {
                                  const storedIdWithoutPrefix = storedId.replace(new RegExp(`^${typePrefix}`), '');
                                  if (campId === storedIdWithoutPrefix) return true;
                                }
                                // storedId가 "13"이고 campId가 "reporter_13"인 경우
                                if (campId.startsWith(typePrefix)) {
                                  const campIdWithoutPrefix = campId.replace(new RegExp(`^${typePrefix}`), '');
                                  if (campIdWithoutPrefix === storedId) return true;
                                }
                                // storedId가 "13"이고 campId가 "13"인 경우 (둘 다 prefix 없음)
                                if (!storedId.startsWith(typePrefix) && !campId.startsWith(typePrefix)) {
                                  if (campId === storedId) return true;
                                }
                              }
                              
                              return false;
                            });
                            
                            if (foundInStatic) {
                              // 정적 데이터는 campaignInfo 구조가 없을 수 있으므로 직접 필드 확인
                              const points = (foundInStatic as any)?.campaignInfo?.points || 
                                            (foundInStatic as any)?.points || 
                                            (foundInStatic as any)?.totalPoints || 
                                            0;
                              
                              // 채널 정보 찾기
                              let channel: Channel = 'Blog';
                              const channelName = (foundInStatic as any)?.campaignInfo?.channel || 
                                                 (foundInStatic as any)?.channel || 
                                                 '';
                              
                              // 채널 이름을 Channel 타입으로 변환
                              if (channelName) {
                                const channelMap: Record<string, Channel> = {
                                  '네이버블로그': 'Blog',
                                  '네이버 블로그': 'Blog',
                                  '블로그': 'Blog',
                                  'Blog': 'Blog',
                                  '네이버클립': 'Clip',
                                  '네이버 클립': 'Clip',
                                  '클립': 'Clip',
                                  'Clip': 'Clip',
                                  '인스타그램': 'Instagram',
                                  'Instagram': 'Instagram',
                                  '유튜브': 'Youtube',
                                  'Youtube': 'Youtube',
                                  '릴스': 'Reels',
                                  'Reels': 'Reels',
                                  '쇼츠': 'Shorts',
                                  'Shorts': 'Shorts',
                                  '숏츠': 'Shorts',
                                };
                                
                                const normalizedChannel = channelName.replace(/\s+/g, '');
                                channel = channelMap[normalizedChannel] || channelMap[channelName] || 'Blog';
                              }
                              
                              console.log(`[GA 리뷰어 상세] 정적 데이터에서 캠페인 정보 찾음:`, {
                                campaignId,
                                campaignType,
                                foundCampaignId: (foundInStatic as any)?.campaignInfo?.id || (foundInStatic as any)?.id,
                                points,
                                channel,
                                channelName,
                              });
                              
                              return { points, channel };
                            } else {
                              console.warn(`[GA 리뷰어 상세] 캠페인을 찾을 수 없음:`, {
                                campaignId,
                                campaignType,
                                campaignTypeKey,
                              });
                            }
                          }
                        }
                      } catch (error) {
                        console.error('[GA 리뷰어 상세] 캠페인 정보 가져오기 실패:', error);
                      }
                      return { points: 0, channel: 'Blog' as Channel };
                    };

                    // 캠페인 진행 페이지와 동일한 로직으로 데이터 변환
                    // format_campaign_number와 map_brand_name_to_channel 함수 import 필요
                    const format_campaign_number = (id: string): string => {
                      // "reporter_13" 형식에서 숫자만 추출
                      const numMatch = id.match(/\d+/);
                      if (numMatch) {
                        const num_id = parseInt(numMatch[0], 10);
                        if (!isNaN(num_id)) {
                          return String(num_id).padStart(6, '0');
                        }
                      }
                      return '000000';
                    };

                    const map_brand_name_to_channel = (brandName: string, campaignType: string): Channel => {
                      // 미션형은 brandName이 빈 문자열이므로 'Mission'으로 변환
                      if (campaignType === '미션형' && !brandName) {
                        return 'Mission';
                      }

                      // 브랜드명 매핑
                      const brand_map: Record<string, Channel> = {
                        '네이버블로그': 'Blog',
                        '인스타그램': 'Instagram',
                        '네이버클립': 'Clip',
                        '유튜브': 'Youtube',
                        '릴스': 'Reels',
                        '쇼츠': 'Shorts',
                        '스토어': 'Store',
                        '기본': 'Store',
                      };

                      return brand_map[brandName] || 'Store';
                    };

                    // 최근 진행 캠페인 목록 (최대 10개)
                    recentCampaigns = campaigns
                      .filter((c: any) => c.status === '대기' || c.status === '선정' || c.status === '완료')
                      .slice(0, 10)
                      .map((c: any) => {
                        // getCampaignById로 실제 캠페인 데이터 가져오기
                        const actualCampaign = getCampaignById(c.campaignId);
                        
                        if (actualCampaign) {
                          // 캠페인 진행 페이지와 동일한 로직 사용
                          const campaignType = actualCampaign.campaignInfo.campaignType;
                          const campaignNumber = format_campaign_number(actualCampaign.campaignInfo.id);
                          const channel = map_brand_name_to_channel(
                            actualCampaign.campaignInfo.brandName || '',
                            campaignType
                          );
                          // 지급 포인트: campaignInfo.point 또는 campaignInfo.points 확인
                          const points = (actualCampaign.campaignInfo as any).point !== undefined 
                            ? (actualCampaign.campaignInfo as any).point 
                            : (actualCampaign as any).points || 0;

                          return {
                            campaign_number: campaignNumber,
                            partner_name: '', // 리뷰어용이므로 빈 문자열
                            campaign_name: actualCampaign.campaignInfo.title,
                            status: (c.status === '대기' || c.status === '선정') ? '진행' : '종료',
                            type: campaignType,
                            channel: channel,
                            points: points,
                          };
                        } else {
                          // 캠페인을 찾지 못한 경우 기본값 사용
                          const campaignInfo = getCampaignInfo(c.campaignId, c.campaignType);
                          return {
                            campaign_number: format_campaign_number(c.campaignId || '0'),
                            partner_name: '',
                            campaign_name: c.campaignTitle || '캠페인명 없음',
                            status: (c.status === '대기' || c.status === '선정') ? '진행' : '종료',
                            type: c.campaignType === 'delivery' ? '배송형' :
                                  c.campaignType === 'review' ? '구매평' :
                                  c.campaignType === 'mission' ? '미션형' :
                                  c.campaignType === 'reporter' ? '기자단' :
                                  c.campaignType === 'visit' ? '방문형' : '배송형',
                            channel: campaignInfo.channel,
                            points: campaignInfo.points,
                          };
                        }
                      });
                  }
                }
              } catch (error) {
                console.error('[리뷰어 상세] 캠페인 정보 로드 중 오류:', error);
              }

              // localStorage에서 status_type 업데이트 정보 가져오기
              let statusType: '일반 회원' | '주의 회원' | '이용 제한 회원' = '일반 회원';
              try {
                const statusUpdates = localStorage.getItem('reviewer_status_type_updates');
                if (statusUpdates) {
                  const updates = JSON.parse(statusUpdates);
                  // ID 매핑: 1 -> user_kakao_001, 2 -> user_naver_001
                  const statusForMappedId = updates[mappedId] || updates[reviewer_id];
                  if (statusForMappedId) {
                    statusType = statusForMappedId;
                  } else {
                    // reviewer_list에서 기본값 가져오기
                    const reviewerFromList = reviewer_list.find(r => r.id === reviewer_id || r.id === mappedId);
                    if (reviewerFromList) {
                      statusType = reviewerFromList.status_type;
                    }
                  }
                } else {
                  // reviewer_list에서 기본값 가져오기
                  const reviewerFromList = reviewer_list.find(r => r.id === reviewer_id || r.id === mappedId);
                  if (reviewerFromList) {
                    statusType = reviewerFromList.status_type;
                  }
                }
              } catch (error) {
                console.error('[리뷰어 상세 GA] status_type 로드 실패:', error);
                // reviewer_list에서 기본값 가져오기
                const reviewerFromList = reviewer_list.find(r => r.id === reviewer_id || r.id === mappedId);
                if (reviewerFromList) {
                  statusType = reviewerFromList.status_type;
                }
              }

              // ReviewerDetail 직접 생성
              const detail: ReviewerDetail = {
                id: reviewer_id,
                number: userAccount.number || (mappedId === 'user_kakao_001' ? '000001' : '000002'),
                name: userAccount.name || '카카오유저',
                nickname: userAccount.nickname || '테스트닉네임',
                channels: connectedChannels,
                type: '일반',
                campaign_participated: campaignParticipated,
                campaign_completed: campaignCompleted,
                current_points: userAccount.current_points || 0,
                withdrawn_points: userAccount.withdrawn_points || 0,
                status_type: statusType,
                status: '정상',
                last_access_date: userAccount.last_access_date || new Date().toISOString().replace('T', ' ').substring(0, 16),
                join_date: userAccount.join_date || '2024-04-01 10:00',
                gender: userAccount.gender || '여성',
                age: userAccount.age || 30,
                email: userAccount.email || '',
                phone: userAccount.phone || '010-1111-1111',
                address: userAccount.address
                  ? `${userAccount.address}${userAccount.detail_address ? ' ' + userAccount.detail_address : ''}`
                  : '서울시 강남구 테헤란로 123',
                profile_image: userAccount.profile_image || null,
                penalty_count: 0,
                channel_details: channelDetails,
                account_info: {
                  account_holder: userAccount.account_holder || userAccount.name || '',
                  bank: userAccount.bank || '',
                  account_number: userAccount.account_number || '',
                  resident_number: userAccount.ssn_front && userAccount.ssn_back
                    ? `${userAccount.ssn_front}-${userAccount.ssn_back}`
                    : '',
                },
                recent_campaigns: recentCampaigns,
                penalty_history: [],
              };

              console.log('📄 [리뷰어 상세] 최종 생성된 detail:', detail);
              set_reviewer_detail(detail);
              set_is_loading(false);
              return;
            }
          }
        } catch (error) {
          console.error('[리뷰어 상세] user 정보 로드 중 오류:', error);
        }
      }

      // 다른 리뷰어들은 기존 함수 사용
      const detail = get_reviewer_detail_by_id(reviewer_id);
      set_reviewer_detail(detail);

      // 일반 관리자(manager_ga)에서는 탈퇴 회원 조회 불가
      // 탈퇴 회원이면 모달 표시
      if (detail && detail.status === "탈퇴") {
        set_is_withdrawn_modal_open(true);
      }

      set_is_loading(false);
    };

    fetch_reviewer_detail();

    // 페이지가 포커스될 때마다 데이터 다시 로드 (user_accounts 변경 감지용)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 [리뷰어 상세] 페이지 포커스 - 데이터 다시 로드');
        fetch_reviewer_detail();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reviewer_id]);

  // 탈퇴 회원 조회 불가 모달 닫기 핸들러
  // 모달을 닫으면 리뷰어 목록 페이지로 이동합니다
  const handle_withdrawn_modal_close = () => {
    set_is_withdrawn_modal_open(false);
    router.push("/manager_ga/member/reviewers");
  };

  // 숫자를 천 단위로 포맷팅하는 함수
  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  // 탈퇴 회원 여부 확인
  // 일반 관리자(manager_ga)에서는 탈퇴 회원 상세 페이지를 렌더링하지 않습니다
  const is_withdrawn = reviewer_detail?.status === "탈퇴";

  // 탈퇴 회원이면 상세 페이지를 렌더링하지 않고 모달만 표시
  if (is_withdrawn) {
    return (
      <BaseModal
        is_open={is_withdrawn_modal_open}
        on_close={handle_withdrawn_modal_close}
        message="탈퇴한 회원은 조회할 수 없습니다."
        buttons={["닫기"]}
        close_on_overlay_click={false}
        close_on_escape={true}
      />
    );
  }

  // 활동 정보 아이템 배열 생성
  // ActivityInfoSection 컴포넌트에 전달할 데이터를 준비합니다
  const activity_info_items: ActivityInfoItem[] = [
    // 채널 정보
    {
      label: "채널 정보",
      value: (
        <div className={infoCardStyles.channel_icons}>
          {reviewer_detail?.channels.map((channel, index) => (
            <div key={index} className={infoCardStyles.channel_icon_wrapper}>
              <Image
                src={channel_icon_map[channel]}
                alt={channel}
                width={16}
                height={16}
                className={infoCardStyles.channel_icon}
              />
            </div>
          ))}
        </div>
      ),
    },
    // 캠페인 참여여
    {
      label: "캠페인 참여",
      value: reviewer_detail
        ? `${format_number(reviewer_detail.campaign_participated)}회`
        : "0회",
      on_button_click: () => set_is_campaign_history_modal_open(true),
      button_aria_label: "캠페인 진행 내역 보기",
    },
    // 캠페인 완료
    {
      label: "캠페인 완료",
      value: reviewer_detail
        ? `${format_number(reviewer_detail.campaign_completed)}회`
        : "0회",
    },
    // 패널티
    {
      label: "패널티",
      value: reviewer_detail
        ? `${format_number(reviewer_detail.penalty_count)}회`
        : "0회",
      on_button_click: () => set_is_penalty_history_modal_open(true),
      button_aria_label: "패널티 내역 보기",
    },
    // 접속일
    {
      label: "접속일",
      value: reviewer_detail?.last_access_date || "-",
    },
    // 가입일
    {
      label: "가입일",
      value: reviewer_detail?.join_date || "-",
    },
    // 보유 포인트
    {
      label: "보유 포인트",
      value: reviewer_detail
        ? format_number(reviewer_detail.current_points)
        : "0",
    },
    // 출금 포인트
    {
      label: "출금 포인트",
      value: reviewer_detail
        ? format_number(reviewer_detail.withdrawn_points)
        : "0",
    },
  ];

  return (
    <MemberDetailLayout
      is_loading={is_loading}
      is_error={!reviewer_detail}
      error_message="해당 리뷰어 정보를 찾을 수 없습니다."
      back_path="/manager_ga/member/reviewers"
    >
      <div className={styles.main_content}>
        {/* 프로필 섹션 */}
        {reviewer_detail && (
          <ProfileSection
            name={reviewer_detail.name}
            status_type={reviewer_detail.status_type}
            basic_info_items={[
              "리뷰어",
              reviewer_detail.nickname,
              reviewer_detail.gender,
              `만 ${reviewer_detail.age}세`,
              reviewer_detail.email,
              reviewer_detail.phone,
              reviewer_detail.address,
            ]}
            profile_image={reviewer_detail.profile_image}
          />
        )}

        {/* 활동 정보 섹션 */}
        <ActivityInfoSection items={activity_info_items} />

        {/* 채널 정보 섹션 */}
        {reviewer_detail && (
          <ChannelInfoSection
            channel_details={reviewer_detail.channel_details}
          />
        )}

        {/* 계좌 정보 섹션 */}
        {reviewer_detail && (
          <AccountInfoSection account_info={reviewer_detail.account_info} />
        )}
      </div>

      {/* 캠페인 진행 내역 모달 */}
      {/* 
        모달은 항상 렌더링되지만, is_open이 false이면 모달 컴포넌트 내부에서 null을 반환하여 화면에 표시되지 않습니다.
        데이터가 없을 경우 빈 배열을 전달하며, 모달 컴포넌트 내부에서 "데이터가 없습니다" 메시지를 표시합니다.
      */}
      <CampaignHistoryModal
        is_open={is_campaign_history_modal_open}
        on_close={() => {
          // 모달 닫기: set_is_campaign_history_modal_open(false)로 모달 상태를 변경합니다
          set_is_campaign_history_modal_open(false);
        }}
        campaigns={reviewer_detail?.recent_campaigns || []}
      />

      {/* 패널티 내역 모달 */}
      {/* 
        모달은 항상 렌더링되지만, is_open이 false이면 모달 컴포넌트 내부에서 null을 반환하여 화면에 표시되지 않습니다.
        데이터가 없을 경우 빈 배열을 전달하며, 모달 컴포넌트 내부에서 "데이터가 없습니다" 메시지를 표시합니다.
      */}
      <PenaltyHistoryModal
        is_open={is_penalty_history_modal_open}
        on_close={() => {
          // 모달 닫기: set_is_penalty_history_modal_open(false)로 모달 상태를 변경합니다
          set_is_penalty_history_modal_open(false);
        }}
        penalty_history={reviewer_detail?.penalty_history || []}
      />
    </MemberDetailLayout>
  );
}
