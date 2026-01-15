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
  type ReviewerDetail,
  type Channel,
} from "@/data/manager_ga/member/reviewers";
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
      // 실제 프로젝트에서는 API 호출로 대체됩니다
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
    // 캠페인 진행
    {
      label: "캠페인 진행",
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
              reviewer_detail.name,
              reviewer_detail.gender,
              `만 ${reviewer_detail.age}세`,
              reviewer_detail.email,
              reviewer_detail.phone,
              reviewer_detail.address,
            ]}
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
