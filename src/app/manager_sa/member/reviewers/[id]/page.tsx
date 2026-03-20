/* ========================================
   SA 관리자 리뷰어 디테일 페이지
   ======================================== */

/**
 * ReviewerDetailPage
 *
 * 목적: SA 관리자가 특정 리뷰어의 상세 정보를 확인합니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/reviewers/[id] (동적 라우트)
 */

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { type Channel } from "@/data/manager_ga/member/reviewers";
import { useReviewerDetailData } from "@/hooks/manager/common/member/useReviewerDetailData";
import CampaignHistoryModal from "@/components/manager/common/member/reviewers/CampaignHistoryModal";
import PenaltyHistoryModal from "@/components/manager/common/member/reviewers/PenaltyHistoryModal";
import MemberDetailLayout from "@/components/manager/common/member/member_detail/MemberDetailLayout";
import ProfileSection from "@/components/manager/common/member/member_detail/ProfileSection";
import ActivityInfoSection, {
  type ActivityInfoItem,
} from "@/components/manager/common/member/member_detail/ActivityInfoSection";
import ChannelInfoSection from "@/components/manager/common/member/reviewers/section/ChannelInfoSection";
import AccountInfoSection from "@/components/manager/common/member/reviewers/section/AccountInfoSection";
import styles from "@/styles/manager/common/member/member_detail/member_detail_page.module.css";
import infoCardStyles from "@/styles/manager/common/member/member_detail/info_card.module.css";

const CHANNEL_ICON_MAP: Record<Channel, string> = {
  Blog: "/images/brand_logo/naverblog.svg",
  Clip: "/images/brand_logo/naverclip.svg",
  Instagram: "/images/brand_logo/insta.svg",
  Youtube: "/images/brand_logo/youtube.svg",
  Store: "/images/brand_logo/navershop.svg",
  Mission: "/images/brand_logo/misssion.svg",
  Reels: "/images/brand_logo/reels.svg",
  Shorts: "/images/brand_logo/shots.svg",
  Review: "/images/brand_logo/navershop.svg",
};

export default function ReviewerDetailPage() {
  const params = useParams();
  const reviewer_id = params.id as string;

  // SA(최고관리자)는 탈퇴 회원도 조회 가능 (C_M11: GA만 조회 불가)
  const { reviewer_detail, is_loading } = useReviewerDetailData(reviewer_id);

  const [is_campaign_history_modal_open, set_is_campaign_history_modal_open] = useState(false);
  const [is_penalty_history_modal_open, set_is_penalty_history_modal_open] = useState(false);

  const activity_info_items: ActivityInfoItem[] = [
    {
      label: "채널 정보",
      value: (
        <div className={infoCardStyles.channel_icons}>
          {(reviewer_detail?.channel_details ?? [])
            .filter((channel_detail) => channel_detail.is_connected)
            .map((channel_detail, index) => {
              const icon = (
                <Image
                  src={CHANNEL_ICON_MAP[channel_detail.channel]}
                  alt={channel_detail.channel}
                  width={16}
                  height={16}
                  className={infoCardStyles.channel_icon}
                />
              );
              const wrapperClass = infoCardStyles.channel_icon_wrapper;
              if (channel_detail.is_connected && channel_detail.channel_url) {
                return (
                  <a
                    key={index}
                    href={channel_detail.channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${wrapperClass} ${infoCardStyles.channel_icon_link}`}
                    aria-label={`${channel_detail.channel} 채널 열기`}
                  >
                    {icon}
                  </a>
                );
              }
              return (
                <div key={index} className={wrapperClass}>
                  {icon}
                </div>
              );
            })}
        </div>
      ),
    },
    {
      label: "캠페인 참여",
      value: reviewer_detail
        ? `${reviewer_detail.campaign_participated.toLocaleString()}회`
        : "0회",
      on_button_click: () => set_is_campaign_history_modal_open(true),
      button_aria_label: "캠페인 진행 내역 보기",
    },
    {
      label: "캠페인 완료",
      value: reviewer_detail ? `${reviewer_detail.campaign_completed.toLocaleString()}회` : "0회",
    },
    {
      label: "패널티",
      value: reviewer_detail ? `${reviewer_detail.penalty_count.toLocaleString()}회` : "0회",
      on_button_click: () => set_is_penalty_history_modal_open(true),
      button_aria_label: "패널티 내역 보기",
    },
    {
      label: "접속일",
      value: reviewer_detail?.last_access_date || "-",
    },
    {
      label: "가입일",
      value: reviewer_detail?.join_date || "-",
    },
    {
      label: "보유 포인트",
      value: reviewer_detail ? reviewer_detail.current_points.toLocaleString() : "0",
    },
    {
      label: "출금 포인트",
      value: reviewer_detail ? reviewer_detail.withdrawn_points.toLocaleString() : "0",
    },
  ];

  return (
    <MemberDetailLayout
      is_loading={is_loading}
      is_error={!reviewer_detail}
      error_message="해당 리뷰어 정보를 찾을 수 없습니다."
      back_path="/manager_sa/member/reviewers"
    >
      <div className={styles.main_content}>
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

        <ActivityInfoSection items={activity_info_items} />

        {reviewer_detail && (
          <ChannelInfoSection channel_details={reviewer_detail.channel_details} />
        )}

        {reviewer_detail && <AccountInfoSection account_info={reviewer_detail.account_info} />}
      </div>

      <CampaignHistoryModal
        is_open={is_campaign_history_modal_open}
        on_close={() => set_is_campaign_history_modal_open(false)}
        campaigns={reviewer_detail?.recent_campaigns || []}
      />

      <PenaltyHistoryModal
        is_open={is_penalty_history_modal_open}
        on_close={() => set_is_penalty_history_modal_open(false)}
        penalty_history={reviewer_detail?.penalty_history || []}
      />
    </MemberDetailLayout>
  );
}
