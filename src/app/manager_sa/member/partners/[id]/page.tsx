/* ========================================
   SA 관리자 파트너 디테일 페이지
   ======================================== */

/**
 * PartnerDetailPage
 *
 * 목적: SA 관리자가 특정 파트너의 상세 정보를 확인할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/partners/[id] (동적 라우트)
 */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  get_partner_detail_by_id,
  type PartnerDetail,
  type RecentCampaign,
} from "@/data/manager_ga/member/partners";
import CampaignHistoryModal from "@/components/manager/common/member/partners/CampaignHistoryModal";
import PenaltyHistoryModal from "@/components/manager/common/member/partners/PenaltyHistoryModal";
import MemberDetailLayout from "@/components/manager/common/member/member_detail/MemberDetailLayout";
import ProfileSection from "@/components/manager/common/member/member_detail/ProfileSection";
import ActivityInfoSection, {
  type ActivityInfoItem,
} from "@/components/manager/common/member/member_detail/ActivityInfoSection";
import BusinessInfoSection from "@/components/manager/common/member/partners/section/BusinessInfoSection";
import ContactPersonSection from "@/components/manager/common/member/partners/section/ContactPersonSection";
import styles from "@/styles/manager/common/member/member_detail/member_detail_page.module.css";

interface StoredPartnerAccount {
  id?: string;
  email?: string;
  business_name?: string;
  business_number?: string;
  representative_name?: string;
  name?: string;
  division?: string;
  business_type?: string;
  current_points?: number;
  used_points?: number;
  last_access_date?: string;
  join_date?: string;
  created_at?: string;
  phone?: string;
  address?: string;
  detail_address?: string;
  contact_phone?: string;
  profile_image?: string | null;
}

interface StoredCampaign {
  partner_id?: string;
  campaignInfo?: {
    id?: string;
    title?: string;
    status?: string;
    campaignType?: string;
    brandName?: string;
    channel?: string;
    point?: number;
    points?: number;
  };
  id?: string;
  title?: string;
  status?: string;
  campaignType?: string;
  brandName?: string;
  channel?: string;
  point?: number;
  points?: number;
}

interface StoredPointHistory {
  type: string;
  amount?: number;
}

interface RecentCampaignItem {
  campaign_number: string;
  campaign_name: string;
  status: "신청" | "진행" | "종료" | "취소" | "예정" | "긴급";
  type: string;
  channel: string;
  points: number;
}

export default function PartnerDetailPage() {
  // ============================================
  // 1. URL 파라미터 가져오기
  // ============================================
  const params = useParams();
  const partner_id = params.id as string;

  // ============================================
  // 2. 상태 관리 (State)
  // ============================================
  // 파트너 상세 정보
  const [partner_detail, set_partner_detail] = useState<PartnerDetail | null>(null);
  // 로딩 상태
  const [is_loading, set_is_loading] = useState(true);
  // 캠페인 내역 모달 열림/닫힘 상태
  const [is_campaign_history_modal_open, set_is_campaign_history_modal_open] = useState(false);
  // 패널티 내역 모달 열림/닫힘 상태
  const [is_penalty_history_modal_open, set_is_penalty_history_modal_open] = useState(false);

  // ============================================
  // 3. 데이터 가져오기 (useEffect)
  // ============================================
  useEffect(() => {
    const fetch_partner_detail = async () => {
      set_is_loading(true);

      // partner_test_001의 경우 직접 localStorage에서 데이터 로드
      if (partner_id === "partner_test_001") {
        try {
          const storedAccounts = localStorage.getItem("partner_accounts");

          if (storedAccounts) {
            const accounts = JSON.parse(storedAccounts);
            const testAccount = (accounts as StoredPartnerAccount[]).find(
              (a) => a.email === "test@test.com" || a.id === "partner_test_001"
            );

            if (testAccount) {
              // 캠페인 개수 계산
              let campaignCount = 0;
              try {
                const deliveryCampaigns = localStorage.getItem("deliveryCampaigns");
                const missionCampaigns = localStorage.getItem("missionCampaigns");
                const reviewCampaigns = localStorage.getItem("reviewCampaigns");
                const visitCampaigns = localStorage.getItem("visitCampaigns");
                const reporterCampaigns = localStorage.getItem("reporterCampaigns");

                const allCampaigns = [
                  ...(deliveryCampaigns ? JSON.parse(deliveryCampaigns) : []),
                  ...(missionCampaigns ? JSON.parse(missionCampaigns) : []),
                  ...(reviewCampaigns ? JSON.parse(reviewCampaigns) : []),
                  ...(visitCampaigns ? JSON.parse(visitCampaigns) : []),
                  ...(reporterCampaigns ? JSON.parse(reporterCampaigns) : []),
                ];

                campaignCount = (allCampaigns as StoredCampaign[]).filter(
                  (c) => c.partner_id === "partner_test_001"
                ).length;
              } catch (_error) {
                // 캠페인 개수 계산 실패 시 0으로 유지
              }

              // 포인트 정보를 testAccount에서 직접 가져오기
              const currentPoints = testAccount.current_points || 0;
              const usedPoints = testAccount.used_points || 0;

              // 결제 포인트 계산 (총 충전 금액)
              let paymentPoints = 0;
              try {
                const pointHistoryKey = `partner_point_history_partner_test_001`;
                const storedHistory = localStorage.getItem(pointHistoryKey);
                if (storedHistory) {
                  const history = JSON.parse(storedHistory);
                  // type이 'earned'인 내역의 amount 합계
                  paymentPoints = (history as StoredPointHistory[])
                    .filter((h) => h.type === "earned")
                    .reduce((sum: number, h) => sum + (h.amount || 0), 0);
                }
              } catch (_error) {
                // 결제 포인트 계산 실패 시 0으로 유지
              }

              // 최근 캠페인 목록 생성
              const recentCampaigns: RecentCampaignItem[] = [];
              try {
                const deliveryCampaigns = localStorage.getItem("deliveryCampaigns");
                const missionCampaigns = localStorage.getItem("missionCampaigns");
                const reviewCampaigns = localStorage.getItem("reviewCampaigns");
                const visitCampaigns = localStorage.getItem("visitCampaigns");
                const reporterCampaigns = localStorage.getItem("reporterCampaigns");

                const allCampaigns = [
                  ...(deliveryCampaigns ? JSON.parse(deliveryCampaigns) : []),
                  ...(missionCampaigns ? JSON.parse(missionCampaigns) : []),
                  ...(reviewCampaigns ? JSON.parse(reviewCampaigns) : []),
                  ...(visitCampaigns ? JSON.parse(visitCampaigns) : []),
                  ...(reporterCampaigns ? JSON.parse(reporterCampaigns) : []),
                ];

                // 해당 파트너의 캠페인만 필터링하고 RecentCampaign 형식으로 변환
                const partnerCampaigns = (allCampaigns as StoredCampaign[]).filter(
                  (c) => c.partner_id === "partner_test_001"
                );

                partnerCampaigns.forEach((campaign) => {
                  const campaignInfo = campaign.campaignInfo || campaign;

                  // 상태 변환 함수 (progress.ts의 map_status_to_progress_status 참고)
                  const map_status_to_progress_status = (
                    status: string
                  ): "신청" | "진행" | "종료" | "취소" | "예정" | "긴급" => {
                    if (status === "긴급") return "긴급";
                    if (status === "취소") return "취소";
                    if (status === "종료" || status === "마감") return "종료";
                    if (status === "대기 중") return "예정";
                    if (status === "모집 중") return "신청";
                    if (status === "진행 중") return "진행";
                    // 기본값: 모집 중이면 "신청", 아니면 "진행"
                    return "신청";
                  };

                  // 채널 매핑 함수 (progress.ts의 map_brand_name_to_channel 참고)
                  const map_brand_name_to_channel = (
                    brandName: string,
                    campaignType: string
                  ): string => {
                    // 구매평은 항상 "Review"로 변환
                    if (campaignType === "구매평") {
                      return "Review";
                    }
                    // 미션형은 항상 "Mission"으로 변환
                    if (campaignType === "미션형") {
                      return "Mission";
                    }
                    // 공백 제거 및 정규화
                    const normalizedBrandName = brandName.replace(/\s+/g, "");
                    // 브랜드명 매핑
                    const brand_map: Record<string, string> = {
                      네이버블로그: "Blog",
                      블로그: "Blog",
                      인스타그램: "Instagram",
                      네이버클립: "Clip",
                      클립: "Clip",
                      유튜브: "Youtube",
                      릴스: "Reels",
                      쇼츠: "Shorts",
                      숏츠: "Shorts",
                      스토어: "Store",
                    };
                    return brand_map[normalizedBrandName] || "Store";
                  };

                  // 캠페인 상태 결정
                  const campaignStatus = campaignInfo.status || "모집 중";
                  const status = map_status_to_progress_status(campaignStatus);

                  // 채널 정보 추출 - 여러 소스에서 시도
                  const brandName =
                    campaignInfo.brandName || campaignInfo.channel || campaign.channel || "";
                  const campaignType = campaignInfo.campaignType || "배송형";
                  const channel = map_brand_name_to_channel(brandName, campaignType);

                  // 포인트 정보 추출 (point 또는 points 필드)
                  const points =
                    campaignInfo.point ||
                    campaignInfo.points ||
                    campaign.points ||
                    campaign.point ||
                    0;

                  recentCampaigns.push({
                    campaign_number: campaignInfo.id || "",
                    campaign_name: campaignInfo.title || "",
                    status: status,
                    type: campaignType,
                    channel: channel,
                    points: points,
                  });
                });
              } catch (_error) {
                // 캠페인 목록 로드 실패 시 빈 목록 유지
              }

              // PartnerDetail 직접 생성
              const detail: PartnerDetail = {
                id: "partner_test_001",
                number: "999999",
                business_name: testAccount.business_name || "테스트 주식회사",
                business_number: testAccount.business_number || "123-45-67890",
                representative_name:
                  testAccount.representative_name || testAccount.name || "테스트파트너",
                division: (testAccount.division ||
                  (testAccount.business_type === "개인사업자" ? "개인" : "법인")) as
                  | "개인"
                  | "법인",
                campaign_in_progress: campaignCount,
                campaign_completed: 0,
                current_points: currentPoints,
                used_points: usedPoints,
                status_type: "일반 회원",
                status: "정상",
                last_access_date:
                  testAccount.last_access_date ||
                  new Date().toISOString().replace("T", " ").substring(0, 16),
                join_date: testAccount.join_date || testAccount.created_at || "2024-03-01 10:00",
                email: testAccount.email || "test@test.com",
                phone: testAccount.phone || "010-5555-5555",
                address: testAccount.address
                  ? `${testAccount.address}${testAccount.detail_address ? " " + testAccount.detail_address : ""}`
                  : "서울시 강남구 테헤란로 123",
                contact_name: testAccount.name || testAccount.representative_name || "테스트파트너",
                contact_phone: testAccount.contact_phone || testAccount.phone || "010-5555-5555",
                penalty_count: 0,
                payment_points: paymentPoints,
                recent_campaigns: recentCampaigns as RecentCampaign[],
                penalty_history: [],
                profile_image: testAccount.profile_image || null,
              };

              set_partner_detail(detail);
              set_is_loading(false);
              return;
            }
          }
        } catch (_error) {
          // 테스트 파트너 정보 로드 실패 시 기존 함수로 폴백
        }
      }

      // 다른 파트너들은 기존 함수 사용
      const detail = get_partner_detail_by_id(partner_id);

      set_partner_detail(detail);
      set_is_loading(false);
    };

    // 클라이언트에서만 실행되도록 보장
    if (typeof window !== "undefined") {
      fetch_partner_detail();
    }
  }, [partner_id]);

  // ============================================
  // 4. 헬퍼 함수들
  // ============================================
  // 숫자를 천 단위로 포맷팅 (예: 1000 -> "1,000")
  const format_number = (num: number | undefined): string => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString();
  };

  // 사업자등록증 다운로드 핸들러
  const handle_download_business_certificate = () => {
    // TODO: 실제 다운로드 기능 구현
  };

  // ============================================
  // 5. 활동 정보 데이터 준비
  // ============================================
  // ActivityInfoSection 컴포넌트에 전달할 활동 정보 배열
  const activity_info_items: ActivityInfoItem[] = [
    {
      label: "캠페인 진행",
      value: partner_detail ? `${format_number(partner_detail.campaign_in_progress)}회` : "0회",
      on_button_click: () => set_is_campaign_history_modal_open(true),
      button_aria_label: "캠페인 진행 내역 보기",
    },
    {
      label: "캠페인 완료",
      value: partner_detail ? `${format_number(partner_detail.campaign_completed)}회` : "0회",
    },
    {
      label: "패널티",
      value: partner_detail ? `${format_number(partner_detail.penalty_count)}회` : "0회",
      on_button_click: () => set_is_penalty_history_modal_open(true),
      button_aria_label: "패널티 내역 보기",
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
      value: partner_detail ? format_number(partner_detail.current_points) : "0",
    },
    {
      label: "결제 포인트",
      value: partner_detail ? format_number(partner_detail.payment_points) : "0",
    },
  ];

  // ============================================
  // 6. 화면 렌더링 (JSX)
  // ============================================
  return (
    <MemberDetailLayout
      is_loading={is_loading}
      is_error={!partner_detail}
      error_message="파트너를 찾을 수 없습니다."
      back_path="/manager_sa/member/partners"
    >
      {/* 메인 콘텐츠 영역 */}
      <div className={styles.main_content}>
        {/* 프로필 섹션: 상호명, 구분, 이메일, 전화번호, 주소 */}
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
            profile_image={partner_detail.profile_image}
            is_partner
          />
        )}

        {/* 활동 정보 섹션: 캠페인 진행/완료, 패널티, 접속일, 가입일, 포인트 */}
        <ActivityInfoSection items={activity_info_items} layout_type="partner" />

        {/* 사업자 정보 섹션: 상호명, 대표자명, 사업자등록번호, 사업자등록증 다운로드 */}
        {partner_detail && (
          <BusinessInfoSection
            business_name={partner_detail.business_name}
            representative_name={partner_detail.representative_name}
            business_number={partner_detail.business_number}
            on_download={handle_download_business_certificate}
          />
        )}

        {/* 담당자 정보 섹션: 담당자 이름, 문의 담당자 휴대폰 번호 */}
        {partner_detail && (
          <ContactPersonSection
            contact_name={partner_detail.contact_name}
            contact_phone={partner_detail.contact_phone}
          />
        )}
      </div>

      {/* 모달 영역 */}
      {/* 캠페인 진행 내역 모달 */}
      {partner_detail && (
        <CampaignHistoryModal
          is_open={is_campaign_history_modal_open}
          on_close={() => set_is_campaign_history_modal_open(false)}
          campaigns={partner_detail.recent_campaigns}
        />
      )}

      {/* 패널티 내역 모달 */}
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
