/* ========================================
   배송형 캠페인 수정 페이지
   ======================================== */

/**
 * 배송형 캠페인 수정 페이지
 *
 * 목적: 파트너가 배송형 캠페인을 수정하는 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/campaign/edit/delivery/[id]
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/loading";
import DeliveryCampaignForm from "@/components/partner/campaign_create_form/DeliveryCampaignForm";
import { CampaignFormData } from "@/types/domain/user";
import {
  updateDeliveryCampaign,
  deliveryCampaignsExtended,
} from "@/data/campaign/delivery/deliveryCampaigns";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
// 분리된 CSS 모듈들 import
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import Toast from "@/components/common/toast/Toast";
import headerStyles from "@/styles/partner/campaign_create/campaign_header.module.css";
import checkboxStyles from "@/styles/partner/campaign_create/campaign_guide/checkboxes.module.css";
import { patchCampaign, fetchCampaignById } from "@/lib/api/partner";
import { apiCampaignToFormData } from "@/utils/partner/campaignEdit/apiToFormData";

type StoredCampaignRaw = { campaignInfo?: { id?: string }; id?: string };

export default function DeliveryCampaignEditPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [initialData, setInitialData] = useState<CampaignFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 토스트 메시지 상태
  const [toast, setToast] = useState({
    is_open: false,
    message: "",
  });

  /**
   * 캠페인 오픈 여부 확인
   *
   * 설명:
   * - 모집 기간 시작일을 기준으로 캠페인 오픈 여부를 판단합니다.
   * - 모집 기간 시작일이 오늘보다 미래면 오픈 전 (false)
   * - 모집 기간 시작일이 오늘보다 과거거나 같으면 오픈 후 (true)
   */
  const isCampaignOpen = (recruitmentPeriod: string): boolean => {
    if (!recruitmentPeriod) return false;

    try {
      // 모집 기간 문자열 파싱 (예: "2025-01-01 ~ 2025-01-30")
      const parts = recruitmentPeriod.split("~").map((s) => s.trim());
      if (parts.length < 1) return false;

      // 시작일 추출 (날짜 부분만, 시간 제거)
      const startDateStr = parts[0].split(" ")[0];
      const startDate = new Date(startDateStr);
      startDate.setHours(0, 0, 0, 0);

      // 오늘 날짜 (시간을 00:00:00으로 설정)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 시작일이 오늘보다 과거거나 같으면 오픈 후
      return startDate <= today;
    } catch (_error) {
      return false;
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  // 서버 API에서 캠페인 데이터 로드
  useEffect(() => {
    fetchCampaignById(campaignId)
      .then((apiItem) => {
        if (apiItem) {
          const formData = apiCampaignToFormData(apiItem);
          setInitialData(formData);
          setIsUrgent(formData.isUrgent ?? false);
          setIsOpen(isCampaignOpen(formData.recruitmentPeriod));
        } else {
          setError("캠페인을 찾을 수 없습니다.");
        }
        setIsLoading(false);
      })
      .catch((_err) => {
        setError("캠페인을 불러오는 중 오류가 발생했습니다.");
        setIsLoading(false);
      });
  }, [campaignId]);

  /**
   * 캠페인 수정 처리
   *
   * 설명:
   * - 폼에서 입력받은 데이터를 delivery.ts 구조로 변환합니다.
   * - 실제 프로덕션 환경에서는 API를 통해 서버에 저장해야 합니다.
   * - 현재는 클라이언트 사이드 더미 데이터 구조이므로,
   *   localStorage를 사용하여 임시 저장합니다.
   */
  const handleSubmit = async (formData: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      // 긴급 상태를 폼 데이터에 추가
      const finalFormData = { ...formData, isUrgent };

      // 이미지 URL 처리
      // 폼에서 전달받은 thumbnailImageUrl을 우선 사용 (새로 업로드한 이미지)
      // 없으면 기존 이미지 URL 유지
      // 실제 프로덕션에서는 이미지를 서버에 업로드하고 URL을 받아와야 합니다
      let imageUrl = formData.thumbnailImageUrl; // 새로 업로드한 이미지 URL

      // 새 이미지가 없으면 기존 이미지 URL 사용
      if (!imageUrl) {
        const existingCampaign = getCampaignById(campaignId);
        if (existingCampaign) {
          imageUrl = existingCampaign.campaignInfo.image;
        } else {
          imageUrl = "/images/main/campaign_img/eximg_1.png"; // 기본 이미지
        }
      }

      // TODO: 실제 프로덕션에서는 이미지 업로드 API 호출
      // if (formData.thumbnailImage) {
      //   const imageUploadResponse = await uploadImages(formData.thumbnailImage, formData.detailImages);
      //   imageUrl = imageUploadResponse.thumbnailUrl;
      // }

      // 폼 데이터를 CampaignWithApplicants 형태로 변환하여 수정
      const updatedCampaign = updateDeliveryCampaign(campaignId, finalFormData, imageUrl);

      // TODO: 실제 프로덕션에서는 API 호출
      // await fetch(`/api/campaigns/${campaignId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(updatedCampaign),
      // });

      // 현재는 localStorage에 임시 저장 (실제 프로덕션에서는 API 사용)
      const storedCampaigns = localStorage.getItem("deliveryCampaigns");

      // 원본 확장 데이터에서 상세 이미지 등 확장 필드 가져오기
      const originalData = deliveryCampaignsExtended.find((c) => c.id === campaignId);

      // 상세 이미지 URL 배열 변환 (formData에서 가져오거나 원본 데이터 사용)
      const detailImageUrls =
        formData.detailImagePreviews && formData.detailImagePreviews.length > 0
          ? formData.detailImagePreviews
          : originalData?.campaign_detail_images && originalData.campaign_detail_images.length > 0
            ? originalData.campaign_detail_images
            : originalData?.campaign_detail_image
              ? [originalData.campaign_detail_image]
              : [];

      if (storedCampaigns) {
        const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
        const index = campaigns.findIndex((c) => c.campaignInfo.id === campaignId);
        if (index !== -1) {
          // 기존 캠페인 업데이트 (확장 데이터 병합)
          const existingCampaign = campaigns[index];
          campaigns[index] = {
            ...updatedCampaign,
            applicantData: updatedCampaign.applicantData ||
              existingCampaign.applicantData || {
                applicants: [],
                selectedApplicants: [],
              },
            // 확장 데이터 병합 (상세 이미지, isUrgent 등)
            campaign_detail_images: detailImageUrls,
            campaign_detail_image: detailImageUrls[0] || originalData?.campaign_detail_image || "",
            isUrgent: isUrgent,
            registeredAt:
              originalData?.registeredAt ||
              ((existingCampaign as unknown as Record<string, unknown>).registeredAt as
                | string
                | undefined),
            description: formData.providedItems || originalData?.description || "",
            promotionLink: formData.promotionLink || originalData?.promotionLink || "",
            keyword: formData.keywords || originalData?.keyword || "",
            subcategory: formData.category || originalData?.subcategory || "",
            channel: originalData?.channel || "",
            points:
              Number(String(formData.additionalPoints || "").replace(/,/g, "")) ||
              originalData?.points ||
              0,
            adultOnly: formData.adultOnly ?? originalData?.adultOnly ?? false,
            allowReParticipation:
              formData.allowReParticipation ?? originalData?.allowReParticipation ?? false,
            allowLateSubmission:
              formData.allowLateSubmission ?? originalData?.allowLateSubmission ?? false,
            contactPhone: formData.contactPhone || originalData?.contactPhone || "",
            detailedSchedule: originalData?.detailedSchedule || {
              applicationStart: formData.recruitmentPeriod.split("~")[0]?.trim() || "",
              applicationEnd: formData.recruitmentPeriod.split("~")[1]?.trim() || "",
              announcement: formData.announcementDate || "",
              purchasePeriod: "",
              registrationPeriod: formData.registrationPeriod || "",
            },
            requirements: originalData?.requirements || [],
            guidelineTexts: formData.guidelines
              ? formData.guidelines.split("\n\n")
              : originalData?.guidelineTexts || [],
          } as unknown as CampaignWithApplicants;
          localStorage.setItem("deliveryCampaigns", JSON.stringify(campaigns));
        } else {
          // localStorage에 없으면 추가 (확장 데이터 포함)
          campaigns.push({
            ...updatedCampaign,
            applicantData: updatedCampaign.applicantData || {
              applicants: [],
              selectedApplicants: [],
            },
            // 확장 데이터 추가
            campaign_detail_images: detailImageUrls,
            campaign_detail_image: detailImageUrls[0] || originalData?.campaign_detail_image || "",
            isUrgent: isUrgent,
            registeredAt: originalData?.registeredAt,
            description: formData.providedItems || originalData?.description || "",
            promotionLink: formData.promotionLink || originalData?.promotionLink || "",
            keyword: formData.keywords || originalData?.keyword || "",
            subcategory: formData.category || originalData?.subcategory || "",
            channel: originalData?.channel || "",
            points:
              Number(String(formData.additionalPoints || "").replace(/,/g, "")) ||
              originalData?.points ||
              0,
            adultOnly: formData.adultOnly ?? originalData?.adultOnly ?? false,
            allowReParticipation:
              formData.allowReParticipation ?? originalData?.allowReParticipation ?? false,
            allowLateSubmission:
              formData.allowLateSubmission ?? originalData?.allowLateSubmission ?? false,
            contactPhone: formData.contactPhone || originalData?.contactPhone || "",
            detailedSchedule: originalData?.detailedSchedule || {
              applicationStart: formData.recruitmentPeriod.split("~")[0]?.trim() || "",
              applicationEnd: formData.recruitmentPeriod.split("~")[1]?.trim() || "",
              announcement: formData.announcementDate || "",
              purchasePeriod: "",
              registrationPeriod: formData.registrationPeriod || "",
            },
            requirements: originalData?.requirements || [],
            guidelineTexts: formData.guidelines
              ? formData.guidelines.split("\n\n")
              : originalData?.guidelineTexts || [],
          } as unknown as CampaignWithApplicants);
          localStorage.setItem("deliveryCampaigns", JSON.stringify(campaigns));
        }
      } else {
        // localStorage에 없으면 새로 생성 (확장 데이터 포함)
        localStorage.setItem(
          "deliveryCampaigns",
          JSON.stringify([
            {
              ...updatedCampaign,
              applicantData: updatedCampaign.applicantData || {
                applicants: [],
                selectedApplicants: [],
              },
              // 확장 데이터 추가
              campaign_detail_images: detailImageUrls,
              campaign_detail_image:
                detailImageUrls[0] || originalData?.campaign_detail_image || "",
              isUrgent: isUrgent,
              registeredAt: originalData?.registeredAt,
              description: formData.providedItems || originalData?.description || "",
              promotionLink: formData.promotionLink || originalData?.promotionLink || "",
              keyword: formData.keywords || originalData?.keyword || "",
              subcategory: formData.category || originalData?.subcategory || "",
              channel: originalData?.channel || "",
              points:
                Number(String(formData.additionalPoints || "").replace(/,/g, "")) ||
                originalData?.points ||
                0,
              adultOnly: formData.adultOnly ?? originalData?.adultOnly ?? false,
              allowReParticipation:
                formData.allowReParticipation ?? originalData?.allowReParticipation ?? false,
              allowLateSubmission:
                formData.allowLateSubmission ?? originalData?.allowLateSubmission ?? false,
              contactPhone: formData.contactPhone || originalData?.contactPhone || "",
              detailedSchedule: originalData?.detailedSchedule || {
                applicationStart: formData.recruitmentPeriod.split("~")[0]?.trim() || "",
                applicationEnd: formData.recruitmentPeriod.split("~")[1]?.trim() || "",
                announcement: formData.announcementDate || "",
                purchasePeriod: "",
                registrationPeriod: formData.registrationPeriod || "",
              },
              requirements: originalData?.requirements || [],
              guidelineTexts: formData.guidelines
                ? formData.guidelines.split("\n\n")
                : originalData?.guidelineTexts || [],
            } as unknown as CampaignWithApplicants,
          ])
        );
      }

      // mock DB에 캠페인 수정 저장
      patchCampaign(campaignId, {
        title: formData.title,
        description: formData.providedItems,
      }).catch((_apiError) => {
        console.error("캠페인 수정 API 호출 실패:", _apiError);
      });

      setToast({ is_open: true, message: "저장되었습니다." });

      // 페이지 새로고침
      router.refresh();
    } catch (_error) {
      alert("캠페인 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !initialData) {
    return (
      <div className={layoutStyles.container}>
        <div className={layoutStyles.main_content}>
          <p>{error || "캠페인 데이터를 불러올 수 없습니다."}</p>
          <button onClick={() => router.back()}>돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className={layoutStyles.container}>
      {/* 파트너 서브헤더 */}
      <PartnerSubHeader />

      {/* 페이지 헤더 - 타이틀과 긴급 체크박스 */}
      <div className={headerStyles.page_header}>
        {/* 뒤로가기 버튼 */}
        <button
          className={headerStyles.mobile_back_button}
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <Image src="/images/header/header_arrow_back.svg" alt="뒤로가기" width={16} height={16} />
        </button>

        <h1 className={headerStyles.page_title}>캠페인 수정</h1>

        {/* 긴급 체크박스 - 캠페인 오픈 후에는 선택/해제 불가 (긴급이면 체크된 상태 유지) */}
        <div className={headerStyles.header_urgent_checkbox}>
          <label
            className={`${checkboxStyles.checkbox_label} ${
              isUrgent ? headerStyles.urgent_checked : ""
            } ${isOpen ? headerStyles.urgent_checkbox_disabled : ""}`}
            style={!isOpen && isUrgent ? { color: "#ff2626" } : {}}
          >
            <span>긴급</span>
            <input
              type="checkbox"
              className={headerStyles.urgent_checkbox}
              checked={isUrgent}
              onChange={(e) => !isOpen && setIsUrgent(e.target.checked)}
              disabled={isOpen}
              aria-label="긴급"
            />
          </label>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 배송형 캠페인 수정 폼 */}
        <DeliveryCampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          initialData={initialData}
          mode="edit"
          isOpen={isOpen}
        />
      </div>

      {/* 토스트 메시지 */}
      <Toast
        message={toast.message}
        isOpen={toast.is_open}
        onClose={() => setToast({ is_open: false, message: "" })}
      />
    </div>
  );
}
