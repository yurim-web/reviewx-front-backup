/* ========================================
   캠페인 관리 메인 페이지
   ======================================== */

/**
 * CampaignManagementPage
 *
 * 목적: 로그인 상태 확인 후 /user/campaign_management/all 로 리다이렉트하는 진입 페이지
 *
 * 사용 페이지:
 * - /user/campaign_management (진입점, all 탭으로 리다이렉트)
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BaseModal from "@/components/common/modal/BaseModal";
import Loading from "@/app/loading";

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

  const token = localStorage.getItem("reviewx_auth_token");
  if (!token) return "not_logged_in";

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
  } catch (_error) {
    throw _error;
  }
};

/**
 * 캠페인 관리 메인 페이지 컴포넌트
 * 전체 탭 페이지로 리다이렉트
 */
export default function CampaignManagementPage() {
  const router = useRouter();
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

        if (loginStatus === "not_logged_in" || loginStatus === "expired") {
          // 비로그인/만료 → 로그인 페이지로 바로 이동
          router.replace("/user/login");
          return;
        }

        // 서버 상태 확인
        await checkServerStatus();

        // 모든 확인이 완료되면 전체 탭으로 리다이렉트
        router.replace("/user/campaign_management/all");
      } catch (_error) {
        // 서버 오류 발생 시 에러 모달 표시
        setIsServerErrorModalOpen(true);
      }
    };

    initializePage();
  }, [router]);

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
      {/* 리다이렉트 중 로딩 표시 */}
      <Loading />

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
