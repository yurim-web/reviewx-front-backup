/* ========================================
   로그인 후 계정 데이터 초기화 유틸리티
   ======================================== */

/**
 * auth/postLoginSetup
 *
 * 목적: 로그인 성공 후 user_accounts / partner_accounts LocalStorage 데이터를 생성·업데이트합니다.
 *
 * 사용 페이지:
 * - src/lib/auth.ts (인증 메인 모듈)
 */

import { AuthUser } from "@/types/auth";
import { type UnifiedAccount } from "@/data/login/unifiedAccountData";
import { StoredUserAccount, StoredChannelDetail } from "./types";

// ========================================
// 리뷰어 기본 데이터
// ========================================

type ReviewerDefaultData = StoredUserAccount & {
  withdrawn_points?: number;
  point_history?: unknown[];
};

const REVIEWER_DATA_MAP: Record<string, ReviewerDefaultData> = {
  user_kakao_001: {
    id: "user_kakao_001",
    number: "000001",
    name: "홍길동",
    nickname: "홍길동님별명",
    email: "oheunyoung@naver.com",
    phone: "010-1111-1111",
    address: "서울시 강남구 테헤란로 123",
    postal_code: "06234",
    detail_address: "",
    channels: ["Blog", "Clip", "Instagram", "Youtube"],
    channel_details: [
      {
        name: "네이버 블로그",
        url: "https://blog.naver.com/catcat12344",
        status: "connected",
        daily_visits: 100,
        total_visits: 10000,
        neighbors: 500,
      },
      {
        name: "네이버 클립",
        url: "https://clip.naver.com/catcat",
        status: "connected",
        followers: 1000,
      },
      {
        name: "인스타그램",
        url: "https://instagram.com/catcat",
        status: "connected",
        followers: 5000,
      },
      {
        name: "유튜브",
        url: "https://youtube.com/@catcat",
        status: "connected",
        subscribers: 2000,
      },
    ],
    gender: "남성",
    age: 37,
    account_holder: null,
    bank: null,
    account_number: null,
    ssn_front: "810202",
    ssn_back: "1******",
    current_points: 511200,
    available_points: 511200,
    pending_points: 0,
    withdrawn_points: 36000,
    daily_visits: 100,
    total_visits: 10000,
    neighbors: 500,
    point_history: [
      {
        id: "1",
        type: "earned",
        amount: 150000,
        description:
          "[풋필터] 트롯바비 홍지윤 pick! 아치까지 받쳐주는 발 편한 자세 교정 키높이 깔창 2set(1.5cm 1켤레 + 2.5cm 1켤레) 구매평",
        campaign_id: "camp_001",
        date: "2025-09-12",
        status: "earned",
        balance: 4311885,
      },
      {
        id: "2",
        type: "earned",
        amount: 50000,
        description:
          "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지 멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
        campaign_id: "camp_002",
        date: "2025-09-10",
        status: "earned",
        balance: 4161885,
      },
      {
        id: "3",
        type: "withdrawn",
        amount: -36000,
        description: "출금 완료",
        date: "2025-09-06",
        status: "completed",
        balance: 6161885,
      },
      {
        id: "4",
        type: "earned",
        amount: 27500,
        description:
          "[라운지엑스24h] 라운지엑스24h 원그로브점 성수샌드 2개(낱개) + 음료 2잔 체험권",
        campaign_id: "camp_004",
        date: "2025-09-01",
        status: "earned",
        balance: 6125885,
      },
      {
        id: "5",
        type: "withdrawn",
        amount: -2000000,
        description: "출금 신청 반려",
        date: "2025-09-01",
        status: "failed",
        balance: 7311885,
        rejection_reason: "예금주와 본인 명의 불일치",
      },
      {
        id: "6",
        type: "withdrawn",
        amount: -100000,
        description: "출금 신청 중",
        date: "2025-08-28",
        status: "pending",
        balance: 9311885,
      },
      {
        id: "7",
        type: "earned",
        amount: -50000,
        description: "적립 취소",
        campaign_id: "camp_003",
        date: "2025-08-25",
        status: "failed",
        balance: 9411885,
        rejection_reason:
          "콘텐츠 내 키워드에 대한 정보를 넣어 달라고 말씀드렸음에도 불구하고 키워드가 없습니다.",
      },
    ],
  },
  user_naver_001: {
    id: "user_naver_001",
    number: "000002",
    name: "김은지",
    nickname: "은지블로그",
    email: "kimeunji@gmail.com",
    phone: "010-2222-2222",
    address: "서울시 서초구 서초대로 456",
    postal_code: "06590",
    detail_address: "",
    channels: ["Blog", "Clip", "Instagram", "Youtube"],
    channel_details: [
      {
        name: "네이버 블로그",
        url: "https://blog.naver.com/eunji123",
        status: "connected",
        daily_visits: 100,
        total_visits: 10000,
        neighbors: 500,
      },
      {
        name: "네이버 클립",
        url: "https://clip.naver.com/eunji",
        status: "connected",
        followers: 1000,
      },
      {
        name: "인스타그램",
        url: "https://instagram.com/eunji",
        status: "connected",
        followers: 5000,
      },
      { name: "유튜브", url: "https://youtube.com/@eunji", status: "connected", subscribers: 2000 },
    ],
    gender: "여성",
    age: 28,
    account_holder: "김은지",
    bank: "신한은행",
    account_number: "00002469134000",
    ssn_front: "820303",
    ssn_back: "2******",
    current_points: 511200,
    available_points: 511200,
    pending_points: 0,
    withdrawn_points: 0,
    daily_visits: 100,
    total_visits: 10000,
    neighbors: 500,
    point_history: [
      {
        id: "1",
        type: "earned",
        amount: 150000,
        description:
          "[풋필터] 트롯바비 홍지윤 pick! 아치까지 받쳐주는 발 편한 자세 교정 키높이 깔창 2set(1.5cm 1켤레 + 2.5cm 1켤레) 구매평",
        campaign_id: "camp_001",
        date: "2025-09-12",
        status: "earned",
        balance: 4311885,
      },
      {
        id: "2",
        type: "withdrawn",
        amount: -500000,
        description:
          "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지 멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
        date: "2025-09-10",
        status: "completed",
        balance: 4161885,
      },
      {
        id: "3",
        type: "earned",
        amount: 36000,
        description: "출금 완료",
        campaign_id: "camp_003",
        date: "2025-09-06",
        status: "earned",
        balance: 6161885,
      },
      {
        id: "4",
        type: "earned",
        amount: 27500,
        description:
          "[라운지엑스24h] 라운지엑스24h 원그로브점 성수샌드 2개(낱개) + 음료 2잔 체험권",
        campaign_id: "camp_004",
        date: "2025-09-01",
        status: "earned",
        balance: 6125885,
      },
      {
        id: "5",
        type: "withdrawn",
        amount: -2000000,
        description: "출금 신청 반려",
        date: "2025-09-01",
        status: "failed",
        balance: 7311885,
        rejection_reason: "예금주와 본인 명의 불일치",
      },
      {
        id: "6",
        type: "earned",
        amount: 2000000,
        description: "적립 취소",
        campaign_id: "camp_006",
        date: "2025-09-01",
        status: "failed",
        balance: 7311885,
        rejection_reason:
          "콘텐츠 내 키워드에 대한 정보를 넣어 달라고 말씀드렸음에도 불구하고 키워드가 없습니다.",
      },
    ],
  },
};

const CHANNEL_ORDER = ["네이버 블로그", "네이버 클립", "인스타그램", "유튜브"];

// ========================================
// 리뷰어 계정 초기화/업데이트
// ========================================

function setupReviewerAccount(authUser: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    const storedAccounts = localStorage.getItem("user_accounts");
    const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];

    const existingIndex = (accounts as StoredUserAccount[]).findIndex(
      (a) => a.id === authUser.id || a.email === authUser.email
    );

    if (existingIndex === -1) {
      const defaultData = REVIEWER_DATA_MAP[authUser.id];
      if (defaultData) {
        const now = new Date().toISOString().replace("T", " ").substring(0, 16);
        accounts.push({
          ...defaultData,
          withdrawn_points: defaultData.withdrawn_points ?? 0,
          join_date: now,
          last_access_date: now,
        });
        localStorage.setItem("user_accounts", JSON.stringify(accounts));
      }
      return;
    }

    // 기존 계정 업데이트
    const defaultData = REVIEWER_DATA_MAP[authUser.id];
    const existingAccount = accounts[existingIndex];
    const updates: Partial<StoredUserAccount> & { last_access_date: string } = {
      last_access_date: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    // nickname 업데이트
    if (
      defaultData &&
      (!existingAccount.nickname || existingAccount.nickname === existingAccount.name)
    ) {
      updates.nickname = defaultData.nickname || existingAccount.nickname || "";
    }

    // channels 병합
    if (defaultData?.channels) {
      const merged = Array.from(
        new Set([...(existingAccount.channels || []), ...defaultData.channels])
      );
      if (merged.length > (existingAccount.channels || []).length) {
        updates.channels = merged;
      }
    }

    // channel_details 병합
    if (defaultData?.channel_details) {
      const existingDetails: StoredChannelDetail[] = existingAccount.channel_details || [];
      const mergedDetails = [...existingDetails];

      (defaultData.channel_details as StoredChannelDetail[]).forEach((defaultDetail) => {
        const idx = mergedDetails.findIndex((d) => d.name === defaultDetail.name);
        if (idx >= 0) {
          const existing = mergedDetails[idx];
          if (defaultDetail.status === "connected" && existing.status !== "connected") {
            mergedDetails[idx] = { ...existing, ...defaultDetail };
          } else if (existing.status === "connected" && defaultDetail.status === "connected") {
            mergedDetails[idx] = {
              ...existing,
              daily_visits:
                existing.daily_visits && existing.daily_visits > 0
                  ? existing.daily_visits
                  : defaultDetail.daily_visits,
              total_visits:
                existing.total_visits && existing.total_visits > 0
                  ? existing.total_visits
                  : defaultDetail.total_visits,
              neighbors:
                existing.neighbors && existing.neighbors > 0
                  ? existing.neighbors
                  : defaultDetail.neighbors,
              followers:
                existing.followers && existing.followers > 0
                  ? existing.followers
                  : defaultDetail.followers,
              subscribers:
                existing.subscribers && existing.subscribers > 0
                  ? existing.subscribers
                  : defaultDetail.subscribers,
            };
          }
        } else {
          mergedDetails.push(defaultDetail);
        }
      });

      mergedDetails.sort((a, b) => {
        const aIdx = CHANNEL_ORDER.indexOf(a.name);
        const bIdx = CHANNEL_ORDER.indexOf(b.name);
        if (aIdx === -1 && bIdx === -1) return 0;
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
      });
      updates.channel_details = mergedDetails;
    }

    // 계좌 정보 업데이트 (미등록 시 기본 데이터로 채움)
    if (defaultData) {
      if (defaultData.account_holder && !existingAccount.account_holder) {
        updates.account_holder = defaultData.account_holder;
      }
      if (defaultData.bank && !existingAccount.bank) {
        updates.bank = defaultData.bank;
      }
      if (defaultData.account_number && !existingAccount.account_number) {
        updates.account_number = defaultData.account_number;
      }
      if (defaultData.ssn_front && !existingAccount.ssn_front) {
        updates.ssn_front = defaultData.ssn_front;
      }
      if (defaultData.ssn_back && !existingAccount.ssn_back) {
        updates.ssn_back = defaultData.ssn_back;
      }
    }

    // 통계 정보 업데이트
    if (defaultData) {
      if (
        defaultData.daily_visits !== undefined &&
        (!existingAccount.daily_visits || existingAccount.daily_visits === 0)
      ) {
        updates.daily_visits = defaultData.daily_visits;
      }
      if (
        defaultData.total_visits !== undefined &&
        (!existingAccount.total_visits || existingAccount.total_visits === 0)
      ) {
        updates.total_visits = defaultData.total_visits;
      }
      if (
        defaultData.neighbors !== undefined &&
        (!existingAccount.neighbors || existingAccount.neighbors === 0)
      ) {
        updates.neighbors = defaultData.neighbors;
      }
    }

    accounts[existingIndex] = { ...existingAccount, ...updates };
    localStorage.setItem("user_accounts", JSON.stringify(accounts));
  } catch (_error) {}
}

// ========================================
// 파트너 계정 초기화/업데이트
// ========================================

function setupPartnerAccount(authUser: AuthUser, account: UnifiedAccount): void {
  if (typeof window === "undefined") return;
  try {
    const storedAccounts = localStorage.getItem("partner_accounts");
    const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];
    const accountIndex = accounts.findIndex(
      (a: { id?: string; email?: string }) => a.id === authUser.id || a.email === authUser.email
    );

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    if (accountIndex >= 0) {
      accounts[accountIndex] = { ...accounts[accountIndex], last_access_date: now };
    } else {
      const initialPoints = authUser.id === "partner_test_001" ? 425000 : 0;
      accounts.push({
        id: authUser.id,
        email: authUser.email || account.email,
        name: authUser.name || account.name,
        phone: authUser.phone || account.phone,
        business_name: authUser.business_name || account.business_name || "테스트 주식회사",
        business_number: authUser.business_number || account.business_number || "123-45-67890",
        representative_name: authUser.representative_name || authUser.name || account.name,
        business_type: authUser.business_type || "개인사업자",
        division: "개인" as const,
        address: authUser.address || "",
        detail_address: authUser.detail_address || "",
        postal_code: authUser.postal_code || "",
        contact_phone: authUser.contact_phone || authUser.phone || account.phone,
        approval_status: authUser.approval_status || ("approved" as const),
        signupDate:
          account.signupDate || new Date().toISOString().split("T")[0].replace(/-/g, ". "),
        isBlocked: false,
        isBanned: false,
        redirectUrl: "/partner",
        marketing_agreed: false,
        third_party_marketing_agreed: false,
        campaign_in_progress: 0,
        campaign_completed: 0,
        current_points: initialPoints,
        used_points: 0,
        status_type: "일반 회원" as const,
        status: "정상" as const,
        last_access_date: now,
        join_date: now,
      });
    }

    localStorage.setItem("partner_accounts", JSON.stringify(accounts));
  } catch (_error) {}
}

// ========================================
// 메인 함수
// ========================================

export function applyPostLoginSideEffects(account: UnifiedAccount, authUser: AuthUser): void {
  if (authUser.role === "user") {
    setupReviewerAccount(authUser);
  }
  if (authUser.role === "partner") {
    setupPartnerAccount(authUser, account);
  }
}
