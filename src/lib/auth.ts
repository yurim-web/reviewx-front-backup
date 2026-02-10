/**
 * 인증 관련 유틸리티 함수
 * LocalStorage를 사용한 세션 관리
 */

import { AuthUser, LoginCredentials, UserRole } from "@/types/auth";
import {
  findAccountByCredentials,
  type UnifiedAccount,
} from "@/data/login/unifiedAccountData";

/**
 * UnifiedAccount를 AuthUser로 변환
 */
function mapToAuthUser(account: UnifiedAccount): AuthUser {
  // userType을 role로 매핑
  let role: UserRole;
  switch (account.userType) {
    case "admin_sa":
      role = "manager_sa";
      break;
    case "admin_ga":
      role = "manager_ga";
      break;
    case "partner":
      role = "partner";
      break;
    case "user":
      role = "user";
      break;
    default:
      throw new Error("Unknown user type");
  }

  // 기본 사용자 정보
  const authUser: AuthUser = {
    id: account.id || account.email, // ID가 있으면 사용, 없으면 이메일을 ID로 사용
    email: account.email,
    name: account.name || account.email.split("@")[0],
    role,
  };

  // 역할별 추가 정보
  if (role === "user") {
    // 리뷰어의 경우 user_accounts에서 정보 가져오기
    if (typeof window !== "undefined") {
      try {
        const storedAccounts = localStorage.getItem("user_accounts");
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);
          const userAccount = accounts.find(
            (a: any) => a.id === account.id || a.email === account.email,
          );
          if (userAccount) {
            // 기본 닉네임 데이터 매핑 (user_accounts에 nickname이 없을 때 사용)
            const defaultNicknameMap: Record<string, string> = {
              user_kakao_001: "홍길동님별명",
              user_naver_001: "은지블로그",
            };

            // nickname이 없거나 name과 같은 경우 기본 데이터에서 가져오기
            let nickname = userAccount.nickname || "";
            if (!nickname || nickname === userAccount.name) {
              nickname = defaultNicknameMap[userAccount.id || account.id] || "";

              // user_accounts에 nickname 업데이트
              if (nickname) {
                const accountIndex = accounts.findIndex(
                  (a: any) =>
                    a.id === userAccount.id || a.email === userAccount.email,
                );
                if (accountIndex >= 0) {
                  accounts[accountIndex] = {
                    ...accounts[accountIndex],
                    nickname: nickname,
                  };
                  localStorage.setItem(
                    "user_accounts",
                    JSON.stringify(accounts),
                  );
                  console.log(
                    "✅ [mapToAuthUser] user_accounts nickname 자동 업데이트:",
                    {
                      id: userAccount.id,
                      oldNickname: userAccount.nickname,
                      newNickname: nickname,
                    },
                  );
                }
              }
            }

            // user_accounts에 저장된 정보 사용
            authUser.id = userAccount.id || account.id;
            authUser.name = userAccount.name || account.name;
            // nickname은 user_accounts에서 가져오기 (name을 fallback으로 사용하지 않음)
            authUser.nickname = nickname;
            authUser.phone = userAccount.phone;
            authUser.email = userAccount.email || account.email;
            authUser.address = userAccount.address;
            authUser.detail_address = userAccount.detail_address;
            authUser.postal_code = userAccount.postal_code;
            authUser.profile_image = userAccount.profile_image;
            authUser.channels = userAccount.channels || [];
            authUser.grade = userAccount.grade || "gold";

            console.log("[mapToAuthUser] user_accounts에서 정보 로드:", {
              id: authUser.id,
              name: authUser.name,
              nickname: authUser.nickname,
              userAccountNickname: userAccount.nickname,
              finalNickname: nickname,
            });
          } else {
            // user_accounts에 없으면 기본값 사용
            authUser.id = account.id;
            authUser.name = account.name;
            authUser.nickname = (account as any).nickname || ""; // name을 fallback으로 사용하지 않음
            authUser.phone = account.phone;
            authUser.grade = account.grade || "gold";
            authUser.channels = account.channels || [];
          }
        } else {
          // localStorage에 user_accounts가 없으면 기본값 사용
          authUser.id = account.id;
          authUser.name = account.name;
          authUser.nickname = (account as any).nickname || ""; // name을 fallback으로 사용하지 않음
          authUser.phone = account.phone;
          authUser.grade = account.grade || "gold";
          authUser.channels = account.channels || [];
        }
      } catch (error) {
        console.error("유저 계정 정보 로드 실패:", error);
        authUser.grade = "gold";
        authUser.channels = [];
      }
    } else {
      authUser.grade = "gold";
      authUser.channels = [];
    }
  } else if (role === "partner") {
    // 파트너의 경우 account.id가 있으면 우선 사용 (partner_test_001 등)
    if (account.id) {
      authUser.id = account.id;
    }

    // 파트너의 경우 partner_accounts에서 실제 정보 가져오기
    if (typeof window !== "undefined") {
      try {
        const storedAccounts = localStorage.getItem("partner_accounts");
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);
          const partnerAccount = accounts.find(
            (a: any) => a.email === account.email,
          );
          if (partnerAccount) {
            authUser.id = partnerAccount.id || authUser.id;
            authUser.name =
              partnerAccount.name ||
              partnerAccount.representative_name ||
              account.name;
            authUser.phone = partnerAccount.phone;
            authUser.business_name = partnerAccount.business_name;
            authUser.business_number = partnerAccount.business_number;
            authUser.approval_status =
              partnerAccount.approval_status || "approved";
            // 추가 정보도 저장
            authUser.representative_name = partnerAccount.representative_name;
            authUser.address = partnerAccount.address;
            authUser.detail_address = partnerAccount.detail_address;
            authUser.postal_code = partnerAccount.postal_code;
            authUser.contact_phone = partnerAccount.contact_phone;
            authUser.business_type = partnerAccount.business_type;
          } else {
            // partner_accounts에 없으면 기본값 사용
            authUser.business_name = account.business_name || "테스트 사업자";
            authUser.business_number =
              account.business_number || "123-45-67890";
            authUser.approval_status = account.approval_status || "approved";
          }
        } else {
          // localStorage에 partner_accounts가 없으면 기본값 사용
          authUser.business_name = account.business_name || "테스트 사업자";
          authUser.business_number = account.business_number || "123-45-67890";
          authUser.approval_status = account.approval_status || "approved";
        }
      } catch (error) {
        console.error("파트너 계정 정보 로드 실패:", error);
        authUser.business_name = account.business_name || "테스트 사업자";
        authUser.business_number = account.business_number || "123-45-67890";
        authUser.approval_status = account.approval_status || "approved";
      }
    } else {
      authUser.business_name = account.business_name || "테스트 사업자";
      authUser.business_number = account.business_number || "123-45-67890";
      authUser.approval_status = account.approval_status || "approved";
    }
  } else if (role.startsWith("manager")) {
    authUser.admin_level = role === "manager_sa" ? "SA" : "GA";
    authUser.permissions = ["all"];
  }

  return authUser;
}

const AUTH_STORAGE_KEY = "reviewx_auth_user";
const TOKEN_STORAGE_KEY = "reviewx_auth_token";

/**
 * LocalStorage에서 사용자 정보 조회
 */
export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    return JSON.parse(stored) as AuthUser;
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    return null;
  }
}

/**
 * LocalStorage에 사용자 정보 저장
 */
export function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store user:", error);
  }
}

/**
 * LocalStorage에서 토큰 조회
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * LocalStorage에 토큰 저장
 */
export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

/**
 * LocalStorage에서 인증 정보 삭제
 */
export function clearAuthStorage(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);

  // 개발/테스트용 자동 로그인 관련 키도 함께 삭제하여
  // 로그아웃 후에도 자동으로 다시 로그인되지 않도록 처리
  try {
    localStorage.removeItem("reviewx_auth_user_reviewer");
    localStorage.removeItem("reviewx_auth_user_partner");
  } catch (error) {
    console.error("Failed to clear dev auth storage:", error);
  }
}

/**
 * 로그인 후 공통 후처리 (user_accounts / partner_accounts 관리)
 */
function applyPostLoginSideEffects(
  account: UnifiedAccount,
  authUser: AuthUser,
): void {
  // 리뷰어 로그인 시 user_accounts에 기본 데이터 생성 (리뷰어 목록 데이터 기반)
  if (authUser.role === "user" && typeof window !== "undefined") {
    try {
      const storedAccounts = localStorage.getItem("user_accounts");
      const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];

      // 이미 계정이 있는지 확인
      const existingIndex = accounts.findIndex(
        (a: any) => a.id === authUser.id || a.email === authUser.email,
      );

      // ID에 따라 기본 정보 매핑
      const reviewerDataMap: Record<string, any> = {
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
          account_holder: null, // 계좌 정보 미등록 상태
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
            {
              name: "유튜브",
              url: "https://youtube.com/@eunji",
              status: "connected",
              subscribers: 2000,
            },
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
          daily_visits: 100,
          total_visits: 10000,
          neighbors: 500,
        },
      };

      if (existingIndex === -1) {
        // 계정이 없으면 리뷰어 목록의 기본 데이터로 생성
        const defaultData = reviewerDataMap[authUser.id];
        if (defaultData) {
          accounts.push({
            ...defaultData,
            withdrawn_points: defaultData.withdrawn_points ?? 0,
            join_date: new Date()
              .toISOString()
              .replace("T", " ")
              .substring(0, 16),
            last_access_date: new Date()
              .toISOString()
              .replace("T", " ")
              .substring(0, 16),
          });
          localStorage.setItem("user_accounts", JSON.stringify(accounts));
          console.log(
            "✅ [로그인] user_accounts 기본 데이터 생성:",
            defaultData,
          );
        }
      } else {
        // 이미 계정이 있으면 nickname, channels, channel_details 업데이트
        const defaultData = reviewerDataMap[authUser.id];
        const existingAccount = accounts[existingIndex];

        // 업데이트할 필드들
        const updates: any = {
          last_access_date: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 16),
        };

        // nickname이 없거나 name과 같은 경우 기본 데이터에서 가져오기
        if (
          defaultData &&
          (!existingAccount.nickname ||
            existingAccount.nickname === existingAccount.name)
        ) {
          updates.nickname =
            defaultData.nickname || existingAccount.nickname || "";
        }

        // channels 배열 업데이트 (기본 데이터에 더 많은 채널이 있으면 병합)
        if (defaultData && defaultData.channels) {
          const existingChannels = existingAccount.channels || [];
          const defaultChannels = defaultData.channels || [];
          // 기본 데이터의 채널이 더 많으면 업데이트 (중복 제거)
          const mergedChannels = Array.from(
            new Set([...existingChannels, ...defaultChannels]),
          );
          if (mergedChannels.length > existingChannels.length) {
            updates.channels = mergedChannels;
            console.log("✅ [로그인] user_accounts channels 업데이트:", {
              id: authUser.id,
              oldChannels: existingChannels,
              newChannels: mergedChannels,
            });
          }
        }

        // channel_details 업데이트 (기본 데이터의 channel_details와 병합)
        if (defaultData && defaultData.channel_details) {
          const existingDetails = existingAccount.channel_details || [];
          const defaultDetails = defaultData.channel_details || [];

          // 기본 데이터의 channel_details를 기준으로 병합
          // 기존에 있던 채널은 유지하고, 기본 데이터에만 있는 채널은 추가
          const mergedDetails = [...existingDetails];
          defaultDetails.forEach((defaultDetail: any) => {
            const existingIndex = mergedDetails.findIndex(
              (d: any) => d.name === defaultDetail.name,
            );
            if (existingIndex >= 0) {
              // 기존 채널이 있으면 status가 'connected'인 경우 URL과 통계 정보도 업데이트
              if (
                defaultDetail.status === "connected" &&
                mergedDetails[existingIndex].status !== "connected"
              ) {
                mergedDetails[existingIndex] = {
                  ...mergedDetails[existingIndex],
                  ...defaultDetail,
                };
              } else if (
                mergedDetails[existingIndex].status === "connected" &&
                defaultDetail.status === "connected"
              ) {
                // 기존 채널이 연결되어 있고 기본 데이터도 연결되어 있으면 통계 정보 업데이트
                // 통계 정보가 없거나 0인 경우에만 기본 데이터의 통계 정보로 업데이트
                const existingDetail = mergedDetails[existingIndex];
                mergedDetails[existingIndex] = {
                  ...existingDetail,
                  // 통계 정보가 없거나 0이면 기본 데이터의 통계 정보로 업데이트
                  daily_visits:
                    existingDetail.daily_visits &&
                    existingDetail.daily_visits > 0
                      ? existingDetail.daily_visits
                      : defaultDetail.daily_visits,
                  total_visits:
                    existingDetail.total_visits &&
                    existingDetail.total_visits > 0
                      ? existingDetail.total_visits
                      : defaultDetail.total_visits,
                  neighbors:
                    existingDetail.neighbors && existingDetail.neighbors > 0
                      ? existingDetail.neighbors
                      : defaultDetail.neighbors,
                  followers:
                    existingDetail.followers && existingDetail.followers > 0
                      ? existingDetail.followers
                      : defaultDetail.followers,
                  subscribers:
                    existingDetail.subscribers && existingDetail.subscribers > 0
                      ? existingDetail.subscribers
                      : defaultDetail.subscribers,
                };
              }
            } else {
              // 기존 채널이 없으면 추가 (통계 정보 포함)
              mergedDetails.push(defaultDetail);
            }
          });

          // 정렬: 네이버 블로그, 네이버 클립, 인스타그램, 유튜브 순서
          const order = [
            "네이버 블로그",
            "네이버 클립",
            "인스타그램",
            "유튜브",
          ];
          mergedDetails.sort((a, b) => {
            const aIndex = order.indexOf(a.name);
            const bIndex = order.indexOf(b.name);
            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
          });

          updates.channel_details = mergedDetails;
          console.log("✅ [로그인] user_accounts channel_details 업데이트:", {
            id: authUser.id,
            oldDetails: existingDetails,
            newDetails: mergedDetails,
          });
        }

        // 통계 정보 업데이트 (daily_visits, total_visits, neighbors가 없으면 기본 데이터에서 가져오기)
        if (defaultData) {
          if (
            defaultData.daily_visits !== undefined &&
            (!existingAccount.daily_visits ||
              existingAccount.daily_visits === 0)
          ) {
            updates.daily_visits = defaultData.daily_visits;
          }
          if (
            defaultData.total_visits !== undefined &&
            (!existingAccount.total_visits ||
              existingAccount.total_visits === 0)
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

        // 업데이트 적용
        accounts[existingIndex] = {
          ...existingAccount,
          ...updates,
        };
        localStorage.setItem("user_accounts", JSON.stringify(accounts));

        if (
          updates.nickname ||
          updates.daily_visits ||
          updates.total_visits ||
          updates.neighbors
        ) {
          console.log("✅ [로그인] user_accounts 업데이트:", {
            id: authUser.id,
            nickname: updates.nickname,
            daily_visits: updates.daily_visits,
            total_visits: updates.total_visits,
            neighbors: updates.neighbors,
          });
        } else {
          console.log("✅ [로그인] user_accounts 접속 시간 업데이트");
        }
      }
    } catch (error) {
      console.error("❌ [로그인] user_accounts 생성 실패:", error);
    }
  }

  // 파트너 로그인 시 partner_accounts 생성 또는 업데이트
  if (authUser.role === "partner" && typeof window !== "undefined") {
    try {
      const storedAccounts = localStorage.getItem("partner_accounts");
      const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];
      const accountIndex = accounts.findIndex(
        (a: any) => a.id === authUser.id || a.email === authUser.email,
      );

      if (accountIndex >= 0) {
        // 기존 계정이 있으면 접속 시간만 업데이트
        accounts[accountIndex] = {
          ...accounts[accountIndex],
          last_access_date: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 16),
        };
        localStorage.setItem("partner_accounts", JSON.stringify(accounts));
        console.log("✅ [로그인] partner_accounts 접속 시간 업데이트");
      } else {
        // 기존 계정이 없으면 기본 데이터로 생성
        // partner_test_001인 경우 초기 포인트를 425,000으로 설정
        const initialPoints = authUser.id === "partner_test_001" ? 425000 : 0;

        const newPartnerAccount = {
          id: authUser.id,
          email: authUser.email || account.email,
          name: authUser.name || account.name,
          phone: authUser.phone || account.phone,
          business_name:
            authUser.business_name ||
            account.business_name ||
            "테스트 주식회사",
          business_number:
            authUser.business_number ||
            account.business_number ||
            "123-45-67890",
          representative_name:
            authUser.representative_name || authUser.name || account.name,
          business_type: authUser.business_type || "개인사업자",
          division: "개인" as const,
          address: authUser.address || "",
          detail_address: authUser.detail_address || "",
          postal_code: authUser.postal_code || "",
          contact_phone:
            authUser.contact_phone || authUser.phone || account.phone,
          approval_status: authUser.approval_status || ("approved" as const),
          signupDate:
            account.signupDate ||
            new Date().toISOString().split("T")[0].replace(/-/g, ". "),
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
          last_access_date: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 16),
          join_date: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 16),
        };
        accounts.push(newPartnerAccount);
        localStorage.setItem("partner_accounts", JSON.stringify(accounts));
        console.log(
          "✅ [로그인] partner_accounts 생성 (초기 포인트:",
          initialPoints,
          "):",
          newPartnerAccount,
        );
      }
    } catch (error) {
      console.error("❌ [로그인] partner_accounts 생성/업데이트 실패:", error);
    }
  }
}

/**
 * 로그인 처리 (Mock 데이터 사용)
 */
export async function authenticateUser(
  credentials: LoginCredentials,
  role?: UserRole,
): Promise<AuthUser> {
  // Mock 데이터에서 사용자 찾기
  const account = findAccountByCredentials(
    credentials.email,
    credentials.password,
  );

  if (!account) {
    throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
  }

  // 차단된 계정 확인
  if (account.isBlocked) {
    throw new Error("이용이 제한된 계정입니다.");
  }

  // 정지/탈퇴 계정 확인
  if (account.isBanned) {
    throw new Error("정지되었거나 탈퇴된 계정입니다.");
  }

  // AuthUser 객체 생성 (매핑 함수 사용)
  const authUser = mapToAuthUser(account);

  // 역할 검증
  // role 파라미터가 전달된 경우에만 검증을 수행합니다.
  // (소셜 로그인 / 자동 로그인 등에서는 role을 생략하고 사용할 수 있도록 하기 위함입니다.)
  if (role && authUser.role !== role) {
    throw new Error("해당 계정 유형으로 로그인할 수 없습니다.");
  }

  // Mock 토큰 생성 (실제 JWT 대신)
  const mockToken = `mock_token_${authUser.id}_${Date.now()}`;

  // LocalStorage에 저장
  setStoredUser(authUser);
  setStoredToken(mockToken);

  // user_accounts / partner_accounts 후처리
  applyPostLoginSideEffects(account, authUser);

  return authUser;
}

/**
 * 통합 계정 객체(UnifiedAccount)를 직접 받아서 로그인 처리
 * (SNS 로그인 등 이메일/비밀번호가 없는 경우에 사용)
 */
export async function authenticateUnifiedAccount(
  account: UnifiedAccount,
): Promise<AuthUser> {
  // AuthUser 객체 생성 (매핑 함수 사용)
  const authUser = mapToAuthUser(account);

  // Mock 토큰 생성 (실제 JWT 대신)
  const mockToken = `mock_token_${authUser.id}_${Date.now()}`;

  // LocalStorage에 저장
  setStoredUser(authUser);
  setStoredToken(mockToken);

  // user_accounts / partner_accounts 후처리
  applyPostLoginSideEffects(account, authUser);

  return authUser;
}

/**
 * 자동 로그인 체크 (페이지 로드 시)
 */
export function checkAutoLogin(): AuthUser | null {
  const user = getStoredUser();
  const token = getStoredToken();

  if (!user || !token) {
    return null;
  }

  // 토큰 유효성 검증 (실제로는 서버에 요청)
  // 여기서는 간단히 존재 여부만 확인
  return user;
}

/**
 * 로그아웃 처리
 */
export function performLogout(): void {
  clearAuthStorage();
}

/**
 * 사용자 정보 업데이트
 */
export function updateStoredUser(updates: Partial<AuthUser>): AuthUser | null {
  const currentUser = getStoredUser();

  if (!currentUser) {
    return null;
  }

  const updatedUser = { ...currentUser, ...updates };
  setStoredUser(updatedUser);

  return updatedUser;
}

/**
 * 역할별 홈 경로 반환
 */
export function getHomePathForRole(role: UserRole): string {
  switch (role) {
    case "user":
      return "/user/campaign_management/applied";
    case "partner":
      return "/partner/campaign_management";
    case "manager_ga":
      return "/manager_ga";
    case "manager_sa":
      return "/manager_sa";
    default:
      return "/";
  }
}

/**
 * 역할별 로그인 경로 반환
 */
export function getLoginPathForRole(role: UserRole): string {
  switch (role) {
    case "user":
      return "/user/login";
    case "partner":
      return "/partner/login";
    case "manager_ga":
    case "manager_sa":
      return "/manager/login";
    default:
      return "/";
  }
}
