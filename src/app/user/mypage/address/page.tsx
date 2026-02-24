/* ========================================
   주소 등록 페이지
   ======================================== */

/**
 * AddressPage
 *
 * 목적: 사용자의 배송 주소를 등록/수정하는 페이지
 *
 * 사용 페이지:
 * - /user/mypage/address (주소 등록)
 * - 캠페인 신청 모달에서 주소 수정 시 이동
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface LocalAccount {
  id?: string;
  email?: string;
  address?: string;
  postal_code?: string;
  detail_address?: string;
  address_details?: {
    postalCode?: string;
    postal_code?: string;
    address?: string;
    detailAddress?: string;
    detail_address?: string;
  };
}
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import AddressInput from "@/components/common/mypage/AddressInput";
import { useAuth } from "@/hooks/useAuth";
import layoutStyles from "@/styles/user/mypage/edit_profile/edit_profile_layout.module.css";
import buttonStyles from "@/styles/user/mypage/edit_profile/profile_buttons.module.css";

export default function AddressPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  // 주소 정보 상태 관리
  const [addressData, setAddressData] = useState({
    postalCode: "",
    address: "",
    detailAddress: "",
  });

  // 필수 입력 필드 검증 함수
  const validateRequiredFields = () => {
    return (
      addressData.postalCode.trim() !== "" &&
      addressData.address.trim() !== "" &&
      addressData.detailAddress.trim() !== ""
    );
  };

  // 저장하기 버튼 활성화 상태
  const isSaveButtonEnabled = validateRequiredFields();

  /**
   * 페이지 로드 시 저장된 주소 데이터 불러오기
   *
   * 설명:
   * - 컴포넌트가 처음 마운트될 때 실행됩니다.
   * - localStorage의 user_accounts에서 주소 정보를 먼저 확인합니다.
   * - 없으면 sessionStorage에서 임시 저장된 주소 정보를 불러옵니다.
   * - 저장된 데이터가 없으면 빈 값으로 유지됩니다.
   */
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      try {
        const storedAccounts = localStorage.getItem("user_accounts");
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts) as LocalAccount[];
          const userAccount = accounts.find(
            (a) => a.id === user.id || a.email === user.email,
          );

          if (userAccount?.address_details) {
            setAddressData({
              postalCode:
                userAccount.address_details.postalCode ||
                userAccount.address_details.postal_code ||
                "",
              address: userAccount.address_details.address || "",
              detailAddress:
                userAccount.address_details.detailAddress ||
                userAccount.address_details.detail_address ||
                "",
            });
            return;
          } else if (
            userAccount?.address ||
            userAccount?.postal_code ||
            userAccount?.detail_address
          ) {
            setAddressData({
              postalCode: userAccount.postal_code || "",
              address: userAccount.address || "",
              detailAddress: userAccount.detail_address || "",
            });
            return;
          }
        }

        const savedAddress = sessionStorage.getItem("userAddress");
        if (savedAddress) {
          const parsedAddress = JSON.parse(savedAddress);
          setAddressData({
            postalCode: parsedAddress.postalCode || "",
            address: parsedAddress.address || "",
            detailAddress: parsedAddress.detailAddress || "",
          });
        }
      } catch (_error) {
      }
    }
  }, [user]);

  /**
   * 뒤로가기 시 모달 상태 복원
   *
   * 설명:
   * - 캠페인 신청 모달에서 주소 수정 버튼을 눌러 이 페이지로 온 경우,
   *   뒤로가기 시 모달이 다시 열리도록 처리합니다.
   * - SubHeader의 뒤로가기 버튼을 통해 이전 페이지로 돌아가면,
   *   CampaignDetailPage에서 모달이 자동으로 열립니다.
   */
  useEffect(() => {
    // sessionStorage에서 모달 열기 플래그 확인
    const shouldOpen = sessionStorage.getItem("shouldOpenApplicationModal");
    if (shouldOpen === "true") {
      // 뒤로가기 시 모달이 열리도록 플래그 유지
      // (모달은 CampaignDetailPage에서 처리)
    }
  }, [pathname]);

  /**
   * 우편번호 찾기 핸들러
   *
   * 설명:
   * - 다음 우편번호 API를 사용하여 우편번호를 검색합니다.
   * - 우편번호 검색 팝업을 열고, 선택한 주소를 자동으로 입력합니다.
   *
   * TODO: 실제 우편번호 찾기 API 연동 필요
   */
  const handlePostalSearch = () => {
    // TODO: 실제 우편번호 찾기 API 연동 필요
  };

  /**
   * 주소 정보 변경 핸들러
   *
   * 설명:
   * - 각 주소 필드의 변경 사항을 상태에 반영합니다.
   */
  const handlePostalCodeChange = (value: string) => {
    setAddressData((prev) => ({ ...prev, postalCode: value }));
  };

  const handleAddressChange = (value: string) => {
    setAddressData((prev) => ({ ...prev, address: value }));
  };

  const handleDetailAddressChange = (value: string) => {
    setAddressData((prev) => ({ ...prev, detailAddress: value }));
  };

  /**
   * 저장하기 핸들러
   *
   * 설명:
   * - 입력한 주소 정보를 저장합니다.
   * - localStorage의 user_accounts에 주소 정보를 저장합니다.
   * - sessionStorage에도 주소 정보를 저장하여 캠페인 신청 모달로 돌아갔을 때 불러올 수 있도록 합니다.
   * - 저장 완료 후 이전 페이지로 돌아갑니다.
   */
  const handleSave = () => {
    if (!isSaveButtonEnabled) return;

    // 전체 주소 문자열 생성 (기본 주소 + 상세 주소 | 우편번호 + 우편번호값)
    // 예: "인천 남동구 장자로 6번길 2, 1층 | 우편번호 12345"
    const addressPart =
      `${addressData.address} ${addressData.detailAddress}`.trim();
    const postalCodePart = addressData.postalCode
      ? `우편번호 ${addressData.postalCode}`
      : "";
    const fullAddress = postalCodePart
      ? `${addressPart} | ${postalCodePart}`
      : addressPart;

    if (typeof window !== "undefined" && user) {
      try {
        const storedAccounts = localStorage.getItem("user_accounts");
        const accounts: LocalAccount[] = storedAccounts
          ? JSON.parse(storedAccounts)
          : [];

        const accountIndex = accounts.findIndex(
          (a) => a.id === user.id || a.email === user.email,
        );

        if (accountIndex >= 0) {
          accounts[accountIndex] = {
            ...accounts[accountIndex],
            address_details: {
              postalCode: addressData.postalCode,
              address: addressData.address,
              detailAddress: addressData.detailAddress,
            },
          };
          localStorage.setItem("user_accounts", JSON.stringify(accounts));
        }
      } catch (_error) {
      }
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "userAddress",
        JSON.stringify({
          postalCode: addressData.postalCode,
          address: addressData.address,
          detailAddress: addressData.detailAddress,
          fullAddress,
        }),
      );
    }

    // 저장 후 뒤로가기
    router.back();
  };

  return (
    <div className={layoutStyles.edit_profile_container}>
      {/* 서브헤더: 항상 상단에 고정 */}
      <SubHeader />

      {/* 메인 컨텐츠 영역 */}
      <main className={`${layoutStyles.main_content} ${buttonStyles.address_page_main}`}>
        {/* 페이지 제목 */}
        <PageTitle title="주소 등록" />

        {/* 폼 영역 */}
        <section className={layoutStyles.section_container}>
          {/* 주소 입력 */}
          <AddressInput
            postalCode={addressData.postalCode}
            address={addressData.address}
            detailAddress={addressData.detailAddress}
            onPostalCodeChange={handlePostalCodeChange}
            onAddressChange={handleAddressChange}
            onDetailAddressChange={handleDetailAddressChange}
            onPostalCodeSearch={handlePostalSearch}
            postalCodeReadOnly={false}
            showRequiredAsterisk={false}
            showLabel={false}
          />
        </section>

        {/* 저장 버튼 - 하단 고정 */}
        <div className={buttonStyles.save_button_container_fixed}>
          <button
            type="button"
            className={buttonStyles.save_button}
            onClick={handleSave}
            disabled={!isSaveButtonEnabled}
          >
            저장
          </button>
        </div>
      </main>
    </div>
  );
}
