/* ========================================
   기자단 캠페인 수정 페이지
   ======================================== */

/**
 * 기자단 캠페인 수정 페이지
 *
 * 목적: 파트너가 기자단 캠페인을 수정하는 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/campaign/edit/reporter/[id]
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/loading";
import ReporterCampaignForm from "@/components/partner/campaign_create_form/ReporterCampaignForm";
import { CampaignFormData } from "@/types/domain/user";
import {
  updateReporterCampaign,
  reporterCampaignsExtended,
} from "@/data/campaign/reporter/reporterCampaigns";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import type { ReporterCampaignDataExtended } from "@/data/campaign/reporter/reporterCampaigns";
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import Toast from "@/components/common/toast/Toast";
import headerStyles from "@/styles/partner/campaign_create/campaign_header.module.css";
import checkboxStyles from "@/styles/partner/campaign_create/campaign_guide/checkboxes.module.css";
import Image from "next/image";
import { campaignToFormData } from "@/utils/partner/campaignEdit/campaignToFormData";

export default function ReporterCampaignEditPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

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
   */
  const isCampaignOpen = (recruitmentPeriod: string): boolean => {
    if (!recruitmentPeriod) return false;

    try {
      const parts = recruitmentPeriod.split("~").map((s) => s.trim());
      if (parts.length < 1) return false;

      const startDateStr = parts[0].split(" ")[0];
      const startDate = new Date(startDateStr);
      startDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return startDate <= today;
    } catch (_error) {
      return false;
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const campaign = getCampaignById(campaignId);
      if (!campaign) {
        setError("캠페인을 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      if (campaign.campaignInfo.campaignType !== "기자단") {
        setError("기자단 캠페인이 아닙니다.");
        setIsLoading(false);
        return;
      }

      // 원본 확장 데이터 찾기
      const originalData = reporterCampaignsExtended.find((c) => c.id === campaignId);

      // localStorage에서 저장된 캠페인 확인
      let storedOriginalData: ReporterCampaignDataExtended | undefined;
      if (typeof window !== "undefined") {
        const storedCampaigns = localStorage.getItem("reporterCampaigns");
        if (storedCampaigns) {
          const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
          const storedCampaign = campaigns.find((c) => c.campaignInfo.id === campaignId);
          if (storedCampaign) {
            storedOriginalData = originalData;
          }
        }
      }

      const dataToUse = storedOriginalData || originalData;

      const formData = campaignToFormData(campaign, dataToUse);
      setInitialData(formData);

      // isUrgent 상태 설정
      setIsUrgent(dataToUse?.isUrgent || false);

      // 캠페인 오픈 여부 확인
      const openStatus = isCampaignOpen(campaign.campaignInfo.recruitmentPeriod);
      setIsOpen(openStatus);

      setIsLoading(false);
    } catch (_err) {
      setError("캠페인을 불러오는 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  }, [campaignId]);

  const handleSubmit = async (formData: CampaignFormData) => {
    setIsSubmitting(true);
    try {
      const finalFormData = { ...formData, isUrgent };

      // 이미지 URL 처리
      // 폼에서 전달받은 thumbnailImageUrl을 우선 사용 (새로 업로드한 이미지)
      // 없으면 기존 이미지 URL 유지
      let imageUrl = formData.thumbnailImageUrl;

      // 새 이미지가 없으면 기존 이미지 URL 사용
      if (!imageUrl) {
        const existingCampaign = getCampaignById(campaignId);
        if (existingCampaign) {
          imageUrl = existingCampaign.campaignInfo.image;
        } else {
          imageUrl = "/images/main/campaign_img/eximg_8.png"; // 기본 이미지
        }
      }

      const updatedCampaign = updateReporterCampaign(campaignId, finalFormData, imageUrl);

      // 원본 확장 데이터에서 상세 이미지 등 확장 필드 가져오기
      const originalData = reporterCampaignsExtended.find((c) => c.id === campaignId);

      // 상세 이미지 URL 배열 변환
      const detailImageUrls =
        formData.detailImagePreviews && formData.detailImagePreviews.length > 0
          ? formData.detailImagePreviews
          : originalData?.campaign_detail_images && originalData.campaign_detail_images.length > 0
            ? originalData.campaign_detail_images
            : originalData?.campaign_detail_image
              ? [originalData.campaign_detail_image]
              : [];

      const storedCampaigns = localStorage.getItem("reporterCampaigns");
      if (storedCampaigns) {
        const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
        const index = campaigns.findIndex((c) => c.campaignInfo.id === campaignId);
        if (index !== -1) {
          const existingCampaign = campaigns[index];
          campaigns[index] = {
            ...updatedCampaign,
            applicantData: updatedCampaign.applicantData ||
              existingCampaign.applicantData || {
                applicants: [],
                selectedApplicants: [],
              },
            campaign_detail_images: detailImageUrls,
            campaign_detail_image: detailImageUrls[0] || originalData?.campaign_detail_image || "",
            isUrgent: isUrgent,
            registeredAt: originalData?.registeredAt || existingCampaign.registeredAt,
            description: formData.providedItems || originalData?.description || "",
            productLink: formData.promotionLink || originalData?.productLink || "",
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
              registrationPeriod: formData.registrationPeriod || "",
            },
            requirements: originalData?.requirements || [],
            guidelineTexts: formData.guidelines
              ? formData.guidelines.split("\n\n")
              : originalData?.guidelineTexts || [],
          } as unknown as CampaignWithApplicants;
          localStorage.setItem("reporterCampaigns", JSON.stringify(campaigns));
        } else {
          campaigns.push({
            ...updatedCampaign,
            applicantData: updatedCampaign.applicantData || {
              applicants: [],
              selectedApplicants: [],
            },
            campaign_detail_images: detailImageUrls,
            campaign_detail_image: detailImageUrls[0] || originalData?.campaign_detail_image || "",
            isUrgent: isUrgent,
            registeredAt: originalData?.registeredAt,
            description: formData.providedItems || originalData?.description || "",
            productLink: formData.promotionLink || originalData?.productLink || "",
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
              registrationPeriod: formData.registrationPeriod || "",
            },
            requirements: originalData?.requirements || [],
            guidelineTexts: formData.guidelines
              ? formData.guidelines.split("\n\n")
              : originalData?.guidelineTexts || [],
          } as unknown as CampaignWithApplicants);
          localStorage.setItem("reporterCampaigns", JSON.stringify(campaigns));
        }
      } else {
        localStorage.setItem(
          "reporterCampaigns",
          JSON.stringify([
            {
              ...updatedCampaign,
              applicantData: updatedCampaign.applicantData || {
                applicants: [],
                selectedApplicants: [],
              },
              campaign_detail_images: detailImageUrls,
              campaign_detail_image:
                detailImageUrls[0] || originalData?.campaign_detail_image || "",
              isUrgent: isUrgent,
              registeredAt: originalData?.registeredAt,
              description: formData.providedItems || originalData?.description || "",
              productLink: formData.promotionLink || originalData?.productLink || "",
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

      //      // 토스트 메시지 표시
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

      <div className={layoutStyles.main_content}>
        <ReporterCampaignForm
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
