/* ========================================
   파트너 상세 데이터 로드 훅
   ======================================== */

/**
 * usePartnerDetailData
 *
 * 목적: GA 관리자 파트너 상세 페이지의 localStorage 파싱·API 조회 로직을 제공합니다.
 *
 * 사용 위치:
 * - PartnerDetailPage (/manager_ga/member/partners/[id])
 */

import { useState, useEffect } from "react";
import {
  get_partner_detail_by_id,
  type PartnerDetail,
  type RecentCampaign,
} from "@/data/manager_ga/member/partners";
import { map_brand_name_to_channel, type CampaignType } from "@/data/manager_ga/progress";

// localStorage 파싱용 로컬 인터페이스
interface StoredPartnerAccount {
  id?: string;
  email?: string;
  name?: string;
  business_name?: string;
  business_number?: string;
  representative_name?: string;
  business_type?: string;
  division?: string;
  current_points?: number;
  used_points?: number;
  last_access_date?: string;
  join_date?: string;
  created_at?: string;
  phone?: string;
  contact_phone?: string;
  address?: string;
  detail_address?: string;
  profile_image?: string | null;
}

interface StoredCampaignData {
  id?: string;
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
  channel?: string;
  points?: number;
  point?: number;
}

interface StoredPointHistoryItem {
  type: string;
  amount?: number;
}

// 캠페인 상태 문자열 → RecentCampaign status 변환
function map_status(status: string): "신청" | "진행" | "종료" | "취소" | "예정" | "긴급" {
  if (status === "긴급") return "긴급";
  if (status === "취소") return "취소";
  if (status === "종료" || status === "마감") return "종료";
  if (status === "대기 중") return "예정";
  if (status === "모집 중") return "신청";
  if (status === "진행 중") return "진행";
  return "신청";
}

// localStorage에서 파트너 상세 정보를 로드 (partner_test_001 전용)
async function fetch_partner_from_local_storage(
  accounts: StoredPartnerAccount[]
): Promise<PartnerDetail | null> {
  const testAccount = accounts.find(
    (a: StoredPartnerAccount) => a.email === "test@test.com" || a.id === "partner_test_001"
  );
  if (!testAccount) return null;

  // 모든 캠페인 로드
  let allCampaigns: StoredCampaignData[] = [];
  try {
    const keys = [
      "deliveryCampaigns",
      "missionCampaigns",
      "reviewCampaigns",
      "visitCampaigns",
      "reporterCampaigns",
    ];
    allCampaigns = keys.flatMap((key) => {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as StoredCampaignData[]) : [];
    });
  } catch (_error) {
    // 캠페인 데이터 로드 실패 시 빈 배열 사용
  }

  const campaignCount = allCampaigns.filter(
    (c: StoredCampaignData) => c.partner_id === "partner_test_001"
  ).length;

  const currentPoints = testAccount.current_points || 0;
  const usedPoints = testAccount.used_points || 0;

  // 결제 포인트 계산 (총 충전 금액)
  let paymentPoints = 0;
  try {
    const pointHistoryKey = `partner_point_history_partner_test_001`;
    const storedHistory = localStorage.getItem(pointHistoryKey);
    if (storedHistory) {
      const history = JSON.parse(storedHistory);
      paymentPoints = (history as StoredPointHistoryItem[])
        .filter((h: StoredPointHistoryItem) => h.type === "earned")
        .reduce((sum: number, h: StoredPointHistoryItem) => sum + (h.amount || 0), 0);
    }
  } catch (_error) {
    // 결제 포인트 계산 실패 시 0 사용
  }

  // 최근 캠페인 목록 생성
  const recentCampaigns: RecentCampaign[] = allCampaigns
    .filter((c: StoredCampaignData) => c.partner_id === "partner_test_001")
    .map((campaign: StoredCampaignData) => {
      const campaignInfo = {
        id: campaign.campaignInfo?.id ?? campaign.id,
        title: campaign.campaignInfo?.title,
        status: campaign.campaignInfo?.status,
        campaignType: campaign.campaignInfo?.campaignType,
        brandName: campaign.campaignInfo?.brandName,
        channel: campaign.campaignInfo?.channel ?? campaign.channel,
        point: campaign.campaignInfo?.point ?? campaign.point,
        points: campaign.campaignInfo?.points ?? campaign.points,
      };

      const campaignStatus = campaignInfo.status || "모집 중";
      const status = map_status(campaignStatus);
      const brandName = campaignInfo.brandName || campaignInfo.channel || campaign.channel || "";
      const campaignType = (campaignInfo.campaignType || "배송형") as CampaignType;
      const channel = map_brand_name_to_channel(brandName, campaignType);
      const points =
        campaignInfo.point || campaignInfo.points || campaign.points || campaign.point || 0;

      return {
        campaign_number: campaignInfo.id || "",
        campaign_name: campaignInfo.title || "",
        status: status as RecentCampaign["status"],
        type: campaignType as RecentCampaign["type"],
        channel: channel as RecentCampaign["channel"],
        points,
      };
    });

  return {
    id: "partner_test_001",
    number: "999999",
    business_name: testAccount.business_name || "테스트 주식회사",
    business_number: testAccount.business_number || "123-45-67890",
    representative_name: testAccount.representative_name || testAccount.name || "테스트파트너",
    division: (testAccount.division ||
      (testAccount.business_type === "개인사업자" ? "개인" : "법인")) as PartnerDetail["division"],
    campaign_in_progress: campaignCount,
    campaign_completed: 0,
    current_points: currentPoints,
    used_points: usedPoints,
    status_type: "일반 회원",
    status: "정상",
    last_access_date:
      testAccount.last_access_date || new Date().toISOString().replace("T", " ").substring(0, 16),
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
    recent_campaigns: recentCampaigns,
    penalty_history: [],
    profile_image: testAccount.profile_image || null,
  };
}

interface UsePartnerDetailDataResult {
  partner_detail: PartnerDetail | null;
  is_loading: boolean;
  is_withdrawn_modal_open: boolean;
  set_is_withdrawn_modal_open: (open: boolean) => void;
}

export function usePartnerDetailData(partner_id: string): UsePartnerDetailDataResult {
  const [partner_detail, set_partner_detail] = useState<PartnerDetail | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [is_withdrawn_modal_open, set_is_withdrawn_modal_open] = useState(false);

  useEffect(() => {
    const fetch_partner_detail = async () => {
      set_is_loading(true);

      // partner_test_001은 localStorage에서 데이터 로드
      if (partner_id === "partner_test_001" && typeof window !== "undefined") {
        try {
          const storedAccounts = localStorage.getItem("partner_accounts");
          if (storedAccounts) {
            const accounts: StoredPartnerAccount[] = JSON.parse(storedAccounts);
            const detail = await fetch_partner_from_local_storage(accounts);
            if (detail) {
              set_partner_detail(detail);
              set_is_loading(false);
              return;
            }
          }
        } catch (_error) {
          // 로드 실패 시 기존 데이터 사용
        }
      }

      // 일반 파트너는 정적 데이터 사용
      const detail = get_partner_detail_by_id(partner_id);
      set_partner_detail(detail);

      if (detail && detail.status === "탈퇴") {
        set_is_withdrawn_modal_open(true);
      }

      set_is_loading(false);
    };

    fetch_partner_detail();
  }, [partner_id]);

  return {
    partner_detail,
    is_loading,
    is_withdrawn_modal_open,
    set_is_withdrawn_modal_open,
  };
}
