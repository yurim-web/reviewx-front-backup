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
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import AddressInput from "@/components/common/mypage/AddressInput";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { patchReviewerProfile, fetchReviewerEdit } from "@/lib/api/reviewer";
import {
  useInvalidateReviewerProfile,
  getReviewerIdNum,
} from "@/hooks/user/mypage/useReviewerProfile";
import layoutStyles from "@/styles/user/mypage/edit_profile/edit_profile_layout.module.css";
import buttonStyles from "@/styles/user/mypage/edit_profile/profile_buttons.module.css";

export default function AddressPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { data: editData } = useQuery({
    queryKey: ["reviewerEdit"],
    queryFn: fetchReviewerEdit,
    enabled: !!user,
    staleTime: 30_000,
  });
  const invalidateProfile = useInvalidateReviewerProfile();

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

  // 서버 프로필에서 주소 데이터 로드
  useEffect(() => {
    if (!user) return;

    if (editData?.address) {
      setAddressData({
        postalCode: editData.address.zipCode || "",
        address: editData.address.address || "",
        detailAddress: editData.address.addressDetail || "",
      });
      return;
    }

    // 서버에 없으면 sessionStorage 폴백
    try {
      const savedAddress = sessionStorage.getItem("userAddress");
      if (savedAddress) {
        const parsedAddress = JSON.parse(savedAddress);
        setAddressData({
          postalCode: parsedAddress.postalCode || "",
          address: parsedAddress.address || "",
          detailAddress: parsedAddress.detailAddress || "",
        });
      }
    } catch (error) {
      console.error("Failed to load address data:", error);
    }
  }, [user, editData]);

  // 뒤로가기 시 모달 상태 복원
  useEffect(() => {
    const shouldOpen = sessionStorage.getItem("shouldOpenApplicationModal");
    if (shouldOpen === "true") {
      // 뒤로가기 시 모달이 열리도록 플래그 유지
    }
  }, [pathname]);

  const handlePostalSearch = () => {
    // TODO: 실제 우편번호 찾기 API 연동 필요
  };

  const handlePostalCodeChange = (value: string) => {
    setAddressData((prev) => ({ ...prev, postalCode: value }));
  };

  const handleAddressChange = (value: string) => {
    setAddressData((prev) => ({ ...prev, address: value }));
  };

  const handleDetailAddressChange = (value: string) => {
    setAddressData((prev) => ({ ...prev, detailAddress: value }));
  };

  // 저장하기 핸들러
  const handleSave = async () => {
    if (!isSaveButtonEnabled) return;

    const addressPart = `${addressData.address} ${addressData.detailAddress}`.trim();
    const postalCodePart = addressData.postalCode ? `우편번호 ${addressData.postalCode}` : "";
    const fullAddress = postalCodePart ? `${addressPart} | ${postalCodePart}` : addressPart;

    // 서버에 주소 저장
    const reviewerIdNum = getReviewerIdNum(user?.id);
    if (reviewerIdNum) {
      try {
        await patchReviewerProfile(reviewerIdNum, {
          postNumber: addressData.postalCode,
          address: addressData.address,
          addressDetail: addressData.detailAddress,
        });
        invalidateProfile(user?.id);
      } catch (_apiError) {
        console.error("주소 수정 API 호출 실패:", _apiError);
      }
    }

    // sessionStorage에 저장 (캠페인 신청 모달 연동용)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "userAddress",
        JSON.stringify({
          postalCode: addressData.postalCode,
          address: addressData.address,
          detailAddress: addressData.detailAddress,
          fullAddress,
        })
      );
    }

    router.back();
  };

  return (
    <div className={layoutStyles.edit_profile_container}>
      <SubHeader />

      <main className={`${layoutStyles.main_content} ${buttonStyles.address_page_main}`}>
        <PageTitle title="주소 등록" />

        <section className={layoutStyles.section_container}>
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
