/* ========================================
   📍 방문형 캠페인 생성 페이지
   ======================================== */

/**
 * 방문형 캠페인 생성 페이지
 *
 * 목적: 파트너가 방문형 캠페인을 등록하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/create/visit
 *
 * 주요 기능:
 * - 방문형 캠페인 기본 정보 입력
 * - 썸네일/상세 이미지 업로드
 * - 방문형 캠페인 상세 정보 입력 (지역, 방문 주소 등)
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 * - 방문형 캠페인 등록 처리
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import VisitCampaignForm from "@/components/partner/campaign_create_form/VisitCampaignForm";
import { CampaignFormData } from "@/types/domain/user";
import { addVisitCampaign } from "@/data/campaign/visit/visitCampaigns";
// 분리된 CSS 모듈들 import
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import PageHeader from "@/components/partner/campaign_create_form/common/layout/PageHeader";
import BaseModal from "@/components/common/modal/BaseModal";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import { getPartnerName } from "@/utils/partner/partnerHelpers";

export default function VisitCampaignCreatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<CampaignFormData | null>(null);
  const [pendingIsUrgent, setPendingIsUrgent] = useState(false); // 확인 모달 열 때의 isUrgent 값 저장

  /**
   * 캠페인 등록 확인 모달 열기
   *
   * 설명:
   * - 폼 제출 시 먼저 확인 모달을 표시합니다.
   * - 사용자가 확인을 누르면 실제 등록이 진행됩니다.
   * - 현재 isUrgent 상태 값을 함께 저장하여 확인 모달이 열린 후에도 변경되지 않도록 합니다.
   */
  const handleSubmit = async (formData: CampaignFormData) => {
    // 디버깅: 폼 제출 시 isUrgent 상태 확인
    // console.log("=== 방문형 캠페인 폼 제출 ===");
    // console.log("현재 isUrgent 상태:", isUrgent);
    // console.log("폼 데이터:", formData);

    setPendingFormData(formData);
    setPendingIsUrgent(isUrgent); // 현재 isUrgent 값을 저장
    setIsConfirmModalOpen(true);
  };

  /**
   * 캠페인 등록 처리 (확인 모달에서 확인 버튼 클릭 시 실행)
   *
   * 설명:
   * - 폼에서 입력받은 데이터를 visit.ts 구조로 변환합니다.
   * - 실제 프로덕션 환경에서는 API를 통해 서버에 저장해야 합니다.
   * - 현재는 클라이언트 사이드 더미 데이터 구조이므로,
   *   localStorage를 사용하여 임시 저장합니다.
   */
  const handleConfirm = async () => {
    if (!pendingFormData || isSubmitting) return;

    setIsConfirmModalOpen(false);
    setIsSubmitting(true);

    try {
      // 긴급 상태를 폼 데이터에 추가
      // 폼 제출 시 저장한 pendingIsUrgent 값을 사용 (확인 모달이 열린 후 변경되지 않도록)
      const finalFormData = { ...pendingFormData, isUrgent: pendingIsUrgent };

      // 디버깅: isUrgent 값 확인
      // console.log("=== 방문형 캠페인 등록 - 긴급 상태 확인 ===");
      // console.log("pendingIsUrgent 값:", pendingIsUrgent);
      // console.log("현재 isUrgent 상태:", isUrgent);

      // 이미지 URL 처리
      // localStorage 용량 문제로 base64 이미지는 저장하지 않고 기본 이미지 사용
      // 실제 프로덕션에서는 이미지를 서버에 업로드하고 URL을 받아와야 합니다
      const imageUrl = "/images/main/campaign_img/eximg_2.png"; // 기본 이미지 사용

      // TODO: 실제 프로덕션에서는 이미지 업로드 API 호출
      // const imageUploadResponse = await uploadImages(formData.thumbnailImage, formData.detailImages);
      // imageUrl = imageUploadResponse.thumbnailUrl;

      /**
       * 지역명 변환 함수
       *
       * 설명:
       * - RegionFilter.tsx의 형식에 맞게 지역명을 변환합니다.
       * - "경기도" → "경기", "인천광역시" → "인천", "충청북도" → "충북" 등으로 변환합니다.
       * - 특정 지역명은 매핑 객체를 사용하여 정확한 축약형으로 변환합니다.
       *
       */
      const normalizeRegionName = (regionName: string): string => {
        if (!regionName) return "";

        // 특정 지역명 매핑 (RegionFilter.tsx 형식에 맞춤)
        const regionMapping: Record<string, string> = {
          서울특별시: "서울",
          인천광역시: "인천",
          경기도: "경기",
          강원특별자치도: "강원",
          대전광역시: "대전",
          세종특별자치시: "세종",
          충청북도: "충북",
          충청남도: "충남",
          전라북도: "전북",
          전라남도: "전남",
          광주광역시: "광주",
          대구광역시: "대구",
          경상북도: "경북",
          경상남도: "경남",
          부산광역시: "부산",
          울산광역시: "울산",
          제주특별자치도: "제주",
        };

        // 매핑 객체에 있으면 해당 값 반환, 없으면 접미사 제거
        return (
          regionMapping[regionName] ||
          regionName.replace(/특별시|광역시|특별자치시|도|특별자치도/g, "")
        );
      };

      // 지역 정보 변환
      const normalizedRegion = normalizeRegionName(finalFormData.region || "");
      const normalizedSubRegion = finalFormData.subRegion || "";

      // 디버깅: 지역 정보 확인
      // console.log("=== 방문형 캠페인 등록 - 지역 정보 확인 ===");
      // console.log("원본 region:", finalFormData.region);
      // console.log("변환된 region:", normalizedRegion);
      // console.log("subRegion:", normalizedSubRegion);

      // 변환된 지역 정보를 포함한 폼 데이터 생성
      const formDataWithNormalizedRegion = {
        ...finalFormData,
        region: normalizedRegion,
      };

      // 폼 데이터를 CampaignWithApplicants 형태로 변환
      const newCampaign = addVisitCampaign(formDataWithNormalizedRegion, imageUrl);

      // 디버깅: 생성된 캠페인 정보 확인
      // console.log(
      //   "newCampaign.campaignInfo.region:",
      //   (newCampaign.campaignInfo as any).region
      // );
      // console.log(
      //   "newCampaign.campaignInfo.subRegion:",
      //   (newCampaign.campaignInfo as any).subRegion
      // );

      // 상세 페이지에서 필요한 추가 정보를 포함한 확장 데이터 생성
      // 등록 시간 생성 (ISO 8601 형식: "2025-01-15T10:30:00")
      const registeredAt = new Date().toISOString();

      // 파트너명 가져오기 (partner_accounts에서)
      const partnerName = getPartnerName(user?.id || "partner_test_001");

      const extendedCampaign = {
        ...newCampaign,
        // 파트너 ID 추가
        partner_id: user?.id || "partner_test_001",
        // 파트너명 추가
        partnerName: partnerName,
        // campaignInfo에도 partnerName 추가
        campaignInfo: {
          ...newCampaign.campaignInfo,
          partnerName: partnerName,
        },
        // 긴급 캠페인 여부 (폼 제출 시 저장한 값 사용)
        isUrgent: pendingIsUrgent === true,
        // 등록 시간 (현재 시간)
        registeredAt: registeredAt,
        // 채널 정보 (최상위 레벨에도 추가)
        channel: finalFormData.platform || "",
        // 상세 페이지에서 필요한 추가 정보
        description: finalFormData.providedItems || "",
        visitAddress: finalFormData.visitAddress || "",
        addressGuide: finalFormData.addressDetail || "",
        visitLink: finalFormData.visitLink || "",
        keywords: finalFormData.keywords || "",
        guidelines: finalFormData.guidelines || "",
        // 지역 정보 (방문형 캠페인에서 지역 태그 표시용)
        // 변환된 지역명 저장 (경기도 → 경기, 인천광역시 → 인천)
        region: normalizedRegion,
        subRegion: normalizedSubRegion,
        // 상세 이미지 미리보기 URL 배열 (Data URL) - localStorage 저장 시 제외
        // Data URL은 매우 크기 때문에 localStorage 용량을 초과할 수 있습니다.
        // 상세 페이지에서는 썸네일 이미지를 사용하거나, 실제 서버 URL을 사용해야 합니다.
        // detailImagePreviews: finalFormData.detailImagePreviews || [], // 제외
        // requirements 생성용 필드들
        minTextLength: finalFormData.minTextLength,
        minImageCount: finalFormData.minImageCount,
        videoCount: finalFormData.videoCount,
        videoDuration: finalFormData.videoDuration,
        requireLinkAttachment: finalFormData.requireLinkAttachment,
        requireKeywordAttachment: finalFormData.requireKeywordAttachment,
        // points 계산용
        additionalPoints: finalFormData.additionalPoints,
      };

      // 디버깅: extendedCampaign에 저장되는 isUrgent 값 확인
      // console.log("=== 방문형 캠페인 extendedCampaign 생성 ===");
      // console.log("extendedCampaign.isUrgent:", extendedCampaign.isUrgent);
      // console.log("isUrgent 상태 값:", isUrgent);

      // TODO: 실제 프로덕션에서는 API 호출
      // await fetch('/api/campaigns', {
      //   method: 'POST',
      //   body: JSON.stringify(newCampaign),
      // });

      /**
       * localStorage 저장 시 용량 체크 및 오래된 데이터 정리
       *
       * 설명:
       * - Data URL은 매우 크기 때문에 localStorage 용량을 초과할 수 있습니다.
       * - 저장 전에 데이터 크기를 체크하고, 필요시 오래된 캠페인을 제거합니다.
       * - localStorage 용량 제한은 보통 5-10MB입니다.
       */
      try {
        // localStorage에서 기존 캠페인 불러오기
        const storedCampaigns = localStorage.getItem("visitCampaigns");
        let campaigns = storedCampaigns ? JSON.parse(storedCampaigns) : [];

        // 저장 시도
        campaigns.push(extendedCampaign);
        const allData = JSON.stringify(campaigns);
        const totalSize = new Blob([allData]).size;

        // localStorage 용량 제한 체크 (5MB = 5 * 1024 * 1024 바이트)
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (totalSize > maxSize) {
          // 오래된 캠페인 제거 (가장 오래된 것부터 제거)
          console.warn("localStorage 용량 초과. 오래된 캠페인 데이터를 정리합니다.");

          // 최근 10개만 유지 (가장 최근에 추가된 것부터)
          campaigns = campaigns.slice(-10);

          // 다시 저장 시도
          const cleanedData = JSON.stringify(campaigns);
          const cleanedSize = new Blob([cleanedData]).size;

          if (cleanedSize > maxSize) {
            // 여전히 용량 초과 시 경고
            console.error("localStorage 용량이 여전히 초과합니다. 일부 데이터를 제거하세요.");
            setIsErrorModalOpen(true);
            return;
          }
        }

        // localStorage에 저장
        localStorage.setItem("visitCampaigns", JSON.stringify(campaigns));
      } catch (error) {
        // QuotaExceededError 처리
        if (
          error instanceof Error &&
          (error.name === "QuotaExceededError" ||
            (error as unknown as { code: number }).code === 22)
        ) {
          console.error("localStorage 용량 초과:", error);

          // 오래된 캠페인 제거 후 재시도
          try {
            const storedCampaigns = localStorage.getItem("visitCampaigns");
            let campaigns = storedCampaigns ? JSON.parse(storedCampaigns) : [];

            // 최근 5개만 유지
            campaigns = campaigns.slice(-5);
            campaigns.push(extendedCampaign);

            localStorage.setItem("visitCampaigns", JSON.stringify(campaigns));
            // console.log("오래된 캠페인을 제거하고 저장했습니다.");
          } catch (retryError) {
            console.error("재시도 실패:", retryError);
            setIsErrorModalOpen(true);
            return;
          }
        } else {
          setIsErrorModalOpen(true);
          return;
        }
      }

      // console.log("방문형 캠페인 등록 완료:", newCampaign);

      // 등록 성공 시 캠페인 관리 전체 탭으로 이동
      router.replace("/partner/campaign_management");
    } catch (error) {
      console.error("방문형 캠페인 등록 실패:", error);
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
      setPendingFormData(null);
      setPendingIsUrgent(false); // 초기화
    }
  };

  return (
    <div className={layoutStyles.container}>
      {/* 파트너 서브헤더 */}
      <PartnerSubHeader />

      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 페이지 헤더 */}
        <PageHeader title="새 캠페인 등록" onUrgentChange={setIsUrgent} initialUrgent={isUrgent} />

        {/* 방문형 캠페인 등록 폼 */}
        <VisitCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onUrgentLoad={setIsUrgent}
          isUrgent={isUrgent}
        />

        {/* 확인 모달 */}
        <BaseModal
          is_open={isConfirmModalOpen}
          on_close={() => {
            setIsConfirmModalOpen(false);
            setPendingFormData(null);
          }}
          message="캠페인 진행 시에는 삭제/수정이 불가합니다.<br>캠페인을 등록하시겠습니까?"
          buttons={["취소", "확인"]}
          on_confirm={handleConfirm}
        />

        {/* 오류 모달 */}
        <BaseModal
          is_open={isErrorModalOpen}
          on_close={() => setIsErrorModalOpen(false)}
          message="오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
          buttons={["확인"]}
        />
      </div>
    </div>
  );
}
