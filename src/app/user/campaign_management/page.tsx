/* ========================================
   📊 캠페인 관리 메인 페이지
   ======================================== */

/**
 * 캠페인 관리 메인 페이지
 *
 * 목적: 사용자가 신청/선정/완료된 캠페인을 관리하고 패널티 정보를 확인하는 통합 관리 페이지입니다.
 *
 * 페이지 경로:
 * - /user/campaign_management
 *
 * 사용 파일:
 * - 컴포넌트: TabNavigation, StatisticsTab, CampaignList
 * - 타입: CampaignApplication, MainTab
 * - CSS: campaign_management.module.css
 *
 * 주요 기능:
 * - 캠페인 상태별 통계 표시 (신청/선정/완료/취소반려/패널티)
 * - 상태별 캠페인 목록 필터링 및 표시
 * - 캠페인별 액션 버튼 (신청 취소, 콘텐츠 등록, 패널티 해제 등)
 * - 상단 고정 탭 네비게이션 (캠페인/포인트/계정)
 * - 통계 탭 네비게이션 (상태별 필터링)
 * - 패널티 내역 및 현황 표시
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BaseModal from "@/components/common/modal/BaseModal";

/**
 * 로그인 상태 확인 결과 타입
 *
 * 설명:
 * - 로그인 상태를 더 세밀하게 구분하기 위한 타입입니다.
 * - "not_logged_in": 로그인하지 않음
 * - "expired": 로그인 만료
 * - "valid": 유효한 로그인 상태
 */
type LoginStatus = "not_logged_in" | "expired" | "valid";

/**
 * 로그인 상태 확인 함수
 *
 * 설명:
 * - sessionStorage 또는 localStorage에서 로그인 토큰/정보를 확인합니다.
 * - 실제 구현 시에는 인증 토큰이나 세션 정보를 확인해야 합니다.
 * - 로그인 만료 여부도 함께 확인합니다.
 *
 * TODO: 실제 인증 시스템 연동 필요
 */
const checkLoginStatus = (): LoginStatus => {
  if (typeof window === "undefined") return "not_logged_in";

  // TODO: 실제 로그인 상태 확인 로직
  // 예시: const token = localStorage.getItem("authToken");
  // if (!token) return "not_logged_in";
  // const tokenExpiry = localStorage.getItem("tokenExpiry");
  // if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
  //   return "expired";
  // }
  // return "valid";

  // 임시: sessionStorage에서 로그인 상태 확인
  // 개발/테스트용: sessionStorage에 "isLoggedIn" = "true"로 설정하면 로그인 상태로 처리됨
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const isExpired = sessionStorage.getItem("isExpired");

  // 개발 중: 항상 로그인 상태로 처리 (테스트용)
  // 실제 배포 시에는 아래 주석을 해제하고 위의 로직을 사용하세요
  // if (isExpired === "true") return "expired";
  // if (isLoggedIn === "true") return "valid";
  // return "not_logged_in";

  // 테스트용: sessionStorage에 "isExpired" = "true"로 설정하면 만료 상태로 처리됨
  if (isExpired === "true") {
    return "expired";
  }

  // 임시: 항상 로그인 상태로 처리 (테스트용)
  return "valid";
};

/**
 * 서버 상태 확인 함수
 *
 * 설명:
 * - 실제 서버 API를 호출하여 서버 상태를 확인합니다.
 * - 서버 오류가 발생하면 에러를 throw합니다.
 *
 * TODO: 실제 API 엔드포인트로 변경 필요
 */
const checkServerStatus = async (): Promise<void> => {
  try {
    // TODO: 실제 서버 API 호출
    // 예시:
    // const response = await fetch("/api/campaign/status");
    // if (!response.ok) {
    //   throw new Error("서버 오류");
    // }

    // 임시: 서버 오류 시뮬레이션 (테스트용)
    // sessionStorage에 "serverError" = "true"로 설정하면 서버 오류로 처리됨
    const serverError = sessionStorage.getItem("serverError");
    if (serverError === "true") {
      throw new Error("서버 오류");
    }

    // 실제 구현 시에는 아래와 같이 API 호출
    // const response = await fetch("/api/user/campaign/status");
    // if (!response.ok) {
    //   throw new Error("서버 오류");
    // }
  } catch (error) {
    throw error;
  }
};

/**
 * 캠페인 관리 메인 페이지 컴포넌트
 * 전체 탭 페이지로 리다이렉트
 */
export default function CampaignManagementPage() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoginExpiredModalOpen, setIsLoginExpiredModalOpen] = useState(false);
  const [isServerErrorModalOpen, setIsServerErrorModalOpen] = useState(false);

  useEffect(() => {
    /**
     * 페이지 초기화 함수
     *
     * 설명:
     * - 로그인 상태 확인
     * - 로그인 만료 확인
     * - 서버 상태 확인
     * - 오류 발생 시 적절한 모달 표시
     */
    const initializePage = async () => {
      try {
        // 로그인 상태 확인
        const loginStatus = checkLoginStatus();

        if (loginStatus === "not_logged_in") {
          // 로그인하지 않은 경우 로그인 필요 모달 표시
          setIsLoginModalOpen(true);
          return;
        }

        if (loginStatus === "expired") {
          // 로그인 만료된 경우 로그인 만료 모달 표시
          setIsLoginExpiredModalOpen(true);
          return;
        }

        // 서버 상태 확인
        await checkServerStatus();

        // 모든 확인이 완료되면 전체 탭으로 리다이렉트
        router.replace("/user/campaign_management/all");
      } catch (error) {
        // 서버 오류 발생 시 에러 모달 표시
        console.error("서버 오류:", error);
        setIsServerErrorModalOpen(true);
      }
    };

    initializePage();
  }, [router]);

  /**
   * 로그인 필요 모달 닫기 핸들러
   *
   * 설명:
   * - 확인 버튼 클릭 시 로그인 페이지로 이동합니다.
   */
  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
    router.push("/user/login");
  };

  /**
   * 로그인 만료 모달 닫기 핸들러
   *
   * 설명:
   * - 확인 버튼 클릭 시 로그인 페이지로 이동합니다.
   */
  const handleLoginExpiredModalClose = () => {
    setIsLoginExpiredModalOpen(false);
    router.push("/user/login");
  };

  /**
   * 서버 오류 모달 닫기 핸들러
   *
   * 설명:
   * - 확인 버튼 클릭 시 모달을 닫습니다.
   * - 사용자가 다시 시도할 수 있도록 페이지를 유지합니다.
   */
  const handleServerErrorModalClose = () => {
    setIsServerErrorModalOpen(false);
    // 필요시 페이지 새로고침 또는 재시도 로직 추가 가능
  };

  return (
    <>
      {/* 로그아웃 상태에서 탭 진입 시 로그인 필요 모달 */}
      <BaseModal
        is_open={isLoginModalOpen}
        on_close={handleLoginModalClose}
        message="로그인이 필요합니다."
        buttons={["확인"]}
      />

      {/* 로그인 만료 모달 */}
      <BaseModal
        is_open={isLoginExpiredModalOpen}
        on_close={handleLoginExpiredModalClose}
        message="로그인이 만료되었습니다.<br>다시 로그인해주세요."
        buttons={["확인"]}
      />

      {/* 서버 오류 모달 */}
      <BaseModal
        is_open={isServerErrorModalOpen}
        on_close={handleServerErrorModalClose}
        message="오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
        buttons={["확인"]}
      />
    </>
  );
}
