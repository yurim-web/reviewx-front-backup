/**
 * GA 관리자 파트너 디테일 페이지
 *
 * GA 관리자가 특정 파트너의 상세 정보를 확인할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/member/partners/[id] (동적 라우트)
 */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  get_partner_detail_by_id,
  type PartnerDetail,
} from "@/data/manager_ga/member/partners";
import CampaignHistoryModal from "@/components/manager/ga/member/partners/modal/CampaignHistoryModal";
import PenaltyHistoryModal from "@/components/manager/ga/member/partners/modal/PenaltyHistoryModal";
import MemberDetailLayout from "@/components/manager/ga/member/member_detail/MemberDetailLayout";
import ProfileSection from "@/components/manager/ga/member/member_detail/ProfileSection";
import ActivityInfoSection, {
  type ActivityInfoItem,
} from "@/components/manager/ga/member/member_detail/ActivityInfoSection";
import BusinessInfoSection from "@/components/manager/ga/member/partners/section/BusinessInfoSection";
import ContactPersonSection from "@/components/manager/ga/member/partners/section/ContactPersonSection";
import styles from "@/styles/manager_ga/member/member_detail/detail_page.module.css";

export default function PartnerDetailPage() {
  const params = useParams();
  const partner_id = params.id as string;

  const [partner_detail, set_partner_detail] = useState<PartnerDetail | null>(
    null
  );
  const [is_loading, set_is_loading] = useState(true);
  const [is_campaign_history_modal_open, set_is_campaign_history_modal_open] =
    useState(false);
  const [is_penalty_history_modal_open, set_is_penalty_history_modal_open] =
    useState(false);

  useEffect(() => {
    const fetch_partner_detail = async () => {
      set_is_loading(true);
      const detail = get_partner_detail_by_id(partner_id);
      set_partner_detail(detail);
      set_is_loading(false);
    };

    fetch_partner_detail();
  }, [partner_id]);

  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  const handle_download_business_certificate = () => {
    // TODO: 실제 다운로드 기능 구현
  };

  const activity_info_items: ActivityInfoItem[] = [
    {
      label: "캠페인 진행",
      value: partner_detail
        ? `${format_number(partner_detail.campaign_in_progress)}회`
        : "0회",
      on_button_click: () => set_is_campaign_history_modal_open(true),
      button_aria_label: "캠페인 진행 내역 보기",
    },
    {
      label: "캠페인 완료",
      value: partner_detail
        ? `${format_number(partner_detail.campaign_completed)}회`
        : "0회",
    },
    {
      label: "패널티",
      value: partner_detail
        ? `${format_number(partner_detail.penalty_count)}회`
        : "0회",
      on_button_click: () => set_is_penalty_history_modal_open(true),
      button_aria_label: "패널티 내역 보기",
      additional_content:
        partner_detail?.status_type === "모범 회원" ? (
          <div className={styles.status_type_badge}>모범 회원</div>
        ) : undefined,
    },
    {
      label: "접속일",
      value: partner_detail?.last_access_date || "-",
    },
    {
      label: "가입일",
      value: partner_detail?.join_date || "-",
    },
    {
      label: "보유 포인트",
      value: partner_detail
        ? format_number(partner_detail.current_points)
        : "0",
    },
    {
      label: "결제 포인트",
      value: partner_detail
        ? format_number(partner_detail.payment_points)
        : "0",
    },
  ];

  return (
    <MemberDetailLayout
      is_loading={is_loading}
      is_error={!partner_detail}
      error_message="파트너를 찾을 수 없습니다."
      back_path="/manager_ga/member/partners"
    >
      <div className={styles.main_content}>
        {partner_detail && (
          <ProfileSection
            name={partner_detail.business_name}
            status_type={partner_detail.status_type}
            basic_info_items={[
              "파트너",
              partner_detail.division,
              partner_detail.email,
              partner_detail.phone,
              partner_detail.address,
            ]}
          />
        )}

        <ActivityInfoSection items={activity_info_items} />

        {partner_detail && (
          <BusinessInfoSection
            business_name={partner_detail.business_name}
            representative_name={partner_detail.representative_name}
            business_number={partner_detail.business_number}
            on_download={handle_download_business_certificate}
          />
        )}

        {partner_detail && (
          <ContactPersonSection contact_phone={partner_detail.contact_phone} />
        )}
      </div>

      {partner_detail && (
        <CampaignHistoryModal
          is_open={is_campaign_history_modal_open}
          on_close={() => set_is_campaign_history_modal_open(false)}
          campaigns={partner_detail.recent_campaigns}
        />
      )}

      {partner_detail && (
        <PenaltyHistoryModal
          is_open={is_penalty_history_modal_open}
          on_close={() => set_is_penalty_history_modal_open(false)}
          penalty_history={partner_detail.penalty_history}
        />
      )}
    </MemberDetailLayout>
  );
}
