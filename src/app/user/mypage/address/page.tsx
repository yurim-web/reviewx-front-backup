/* ========================================
   📍 주소 등록 페이지
   ======================================== */

/**
 * 주소 등록 페이지
 *
 * 목적: 사용자의 주소 정보를 등록/수정할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /user/mypage/address
 *
 * 주요 기능:
 * - 우편번호 검색
 * - 기본 주소 입력
 * - 상세 주소 입력
 * - 주소 정보 저장
 *
 * 사용 위치:
 * - 캠페인 신청 모달에서 주소 수정 버튼 클릭 시 이동
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import AddressInput from "@/components/common/mypage/AddressInput";
import styles from "@/styles/user/mypage/edit_profile.module.css";

export default function AddressPage() {
  const router = useRouter();
  const pathname = usePathname();

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
    // 임시로 콘솔 로그 출력
    console.log("우편번호 찾기");
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
   * - 저장 완료 후 이전 페이지로 돌아갑니다.
   *
   * TODO: 실제 API 연동 필요
   */
  const handleSave = () => {
    if (!isSaveButtonEnabled) return;

    // 주소 정보 저장 로직
    console.log("주소 저장:", addressData);

    // 임시: 저장 후 뒤로가기
    router.back();
  };

  return (
    <div className={styles.edit_profile_container}>
      {/* 서브헤더: 항상 상단에 고정 */}
      <SubHeader />

      {/* 메인 컨텐츠 영역 */}
      <main className={`${styles.main_content} ${styles.address_page_main}`}>
        {/* 페이지 제목 */}
        <PageTitle title="주소 등록" />

        {/* 폼 영역 */}
        <section className={styles.section_container}>
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
        <div className={styles.save_button_container_fixed}>
          <button
            type="button"
            className={styles.save_button}
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
