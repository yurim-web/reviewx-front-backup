/* ========================================
   미션형 캠페인 수정 페이지
   ======================================== */

/**
 * 미션형 캠페인 수정 페이지
 *
 * 목적: 파트너가 미션형 캠페인을 수정하는 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/campaign/edit/mission/[id]
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/loading";
import MissionCampaignForm from "@/components/partner/campaign_create_form/MissionCampaignForm";
import { CampaignFormData } from "@/types/domain/user";
import {
  updateMissionCampaign,
  missionCampaignsExtended,
} from "@/data/campaign/mission/missionCampaigns";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import type { MissionCampaignDataExtended } from "@/data/campaign/mission/missionCampaigns";
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import Toast from "@/components/common/toast/Toast";
import headerStyles from "@/styles/partner/campaign_create/campaign_header.module.css";
import checkboxStyles from "@/styles/partner/campaign_create/campaign_guide/checkboxes.module.css";
import Image from "next/image";
import { campaignToFormData } from "@/utils/partner/campaignEdit/campaignToFormData";
import { patchCampaign, fetchCampaignById } from "@/lib/api/partner";
import { apiCampaignToFormData } from "@/utils/partner/campaignEdit/apiToFormData";

type StoredCampaignRaw = {
  campaignInfo?: { id?: string };
  id?: string;
  contentType?: string;
  isUrgent?: boolean;
  registeredAt?: string;
  description?: string;
  productLink?: string;
  keywords?: string;
  guidelines?: string;
  minTextLength?: number | string;
  minImageCount?: number | string;
  videoCount?: number | string;
  videoDuration?: number | string;
  requireLinkAttachment?: boolean;
  requireKeywordAttachment?: boolean;
  contactPhone?: string;
};

export default function MissionCampaignEditPage() {
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
        fetchCampaignById(campaignId).then((apiItem) => {
          if (apiItem) {
            const formData = apiCampaignToFormData(apiItem);
            setInitialData(formData);
            setIsOpen(isCampaignOpen(formData.recruitmentPeriod));
          } else {
            setError("캠페인을 찾을 수 없습니다.");
          }
          setIsLoading(false);
        });
        return;
      }

      if (campaign.campaignInfo.campaignType !== "미션형") {
        setError("미션형 캠페인이 아닙니다.");
        setIsLoading(false);
        return;
      }

      // 원본 확장 데이터 찾기
      const originalData = missionCampaignsExtended.find((c) => c.id === campaignId);

      // localStorage에서 저장된 캠페인 확인 (최신 데이터 우선)
      let storedOriginalData: MissionCampaignDataExtended | undefined;
      if (typeof window !== "undefined") {
        const storedCampaigns = localStorage.getItem("missionCampaigns");
        if (storedCampaigns) {
          const campaigns: StoredCampaignRaw[] = JSON.parse(storedCampaigns);
          const storedCampaign = campaigns.find((c) => c.campaignInfo?.id === campaignId);
          if (storedCampaign) {
            // localStorage에 저장된 캠페인에서 확장 데이터 재구성
            // contentType 등 확장 필드를 포함하여 원본 데이터와 병합
            storedOriginalData = {
              ...(originalData || {}),
              contentType: storedCampaign.contentType || originalData?.contentType,
              isUrgent: storedCampaign.isUrgent ?? originalData?.isUrgent,
              registeredAt: storedCampaign.registeredAt || originalData?.registeredAt,
              description: storedCampaign.description || originalData?.description,
              productLink: storedCampaign.productLink || originalData?.productLink,
              keywords: storedCampaign.keywords || originalData?.keyword,
              guidelineTexts: storedCampaign.guidelines
                ? [storedCampaign.guidelines]
                : originalData?.guidelineTexts,
              minTextLength: storedCampaign.minTextLength,
              minImageCount: storedCampaign.minImageCount,
              videoCount: storedCampaign.videoCount,
              videoDuration: storedCampaign.videoDuration,
              requireLinkAttachment: storedCampaign.requireLinkAttachment,
              requireKeywordAttachment: storedCampaign.requireKeywordAttachment,
              contactPhone: storedCampaign.contactPhone || originalData?.contactPhone,
            } as MissionCampaignDataExtended;
          }
        }
      }

      // 원본 확장 데이터 우선 사용 (localStorage에 저장된 것이 있으면 그것 사용)
      const dataToUse = storedOriginalData || originalData;

      const formData = campaignToFormData(campaign, dataToUse);
      setInitialData(formData);

      // isUrgent 상태 설정
      setIsUrgent(dataToUse?.isUrgent || false);

      // 상세 이미지 URL을 formData에 추가 (MissionCampaignForm에서 사용)
      if (dataToUse?.campaign_detail_image) {
        // formData에 detailImageUrl 추가 (임시로 thumbnailImageUrl에 저장하거나 별도 처리)
        // 실제로는 MissionCampaignForm에서 원본 데이터를 직접 가져와야 함
      }

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
          imageUrl = "/images/main/campaign_img/eximg_4.png"; // 기본 이미지
        }
      }

      const updatedCampaign = updateMissionCampaign(campaignId, finalFormData, imageUrl);

      // contentType 결정: requireContentLink와 requireContentImage 체크박스에 따라 결정
      // - requireContentLink만 true → "link"
      // - requireContentImage만 true → "image"
      // - 둘 다 true → "both"
      let contentType: "link" | "image" | "both" | undefined = undefined;
      if (finalFormData.requireContentLink && finalFormData.requireContentImage) {
        contentType = "both";
      } else if (finalFormData.requireContentLink) {
        contentType = "link";
      } else if (finalFormData.requireContentImage) {
        contentType = "image";
      }

      // 원본 확장 데이터에서 상세 이미지 등 확장 필드 가져오기
      const originalData = missionCampaignsExtended.find((c) => c.id === campaignId);

      // 상세 이미지 URL 배열 변환
      const detailImageUrls =
        formData.detailImagePreviews && formData.detailImagePreviews.length > 0
          ? formData.detailImagePreviews
          : originalData?.campaign_detail_images && originalData.campaign_detail_images.length > 0
            ? originalData.campaign_detail_images
            : originalData?.campaign_detail_image
              ? [originalData.campaign_detail_image]
              : [];

      // 확장 데이터에 contentType 추가
      const extendedCampaign = {
        ...updatedCampaign,
        contentType: contentType,
        campaign_detail_images: detailImageUrls,
        campaign_detail_image: detailImageUrls[0] || originalData?.campaign_detail_image || "",
        isUrgent: isUrgent,
        registeredAt: originalData?.registeredAt,
        description: formData.providedItems || originalData?.description || "",
        productLink: formData.promotionLink || originalData?.productLink || "",
        keywords: formData.keywords || originalData?.keyword || "",
        subcategory: formData.category || originalData?.subcategory || "",
        channel: (originalData as { channel?: string } | undefined)?.channel || "",
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
        // 기존 localStorage 데이터에서 추가 필드 유지
        ...(typeof window !== "undefined" &&
          (() => {
            try {
              const storedCampaigns = localStorage.getItem("missionCampaigns");
              if (storedCampaigns) {
                const campaigns: StoredCampaignRaw[] = JSON.parse(storedCampaigns);
                const existing = campaigns.find((c) => c.campaignInfo?.id === campaignId);
                if (existing) {
                  return {
                    minTextLength: existing.minTextLength,
                    minImageCount: existing.minImageCount,
                    videoCount: existing.videoCount,
                    videoDuration: existing.videoDuration,
                    requireLinkAttachment: existing.requireLinkAttachment,
                    requireKeywordAttachment: existing.requireKeywordAttachment,
                  };
                }
              }
            } catch (_error) {}
            return {};
          })()),
      };

      const storedCampaigns = localStorage.getItem("missionCampaigns");
      if (storedCampaigns) {
        const campaigns: CampaignWithApplicants[] = JSON.parse(storedCampaigns);
        const index = campaigns.findIndex((c) => c.campaignInfo.id === campaignId);
        if (index !== -1) {
          campaigns[index] = extendedCampaign as unknown as CampaignWithApplicants;
          localStorage.setItem("missionCampaigns", JSON.stringify(campaigns));
        } else {
          campaigns.push(extendedCampaign as unknown as CampaignWithApplicants);
          localStorage.setItem("missionCampaigns", JSON.stringify(campaigns));
        }
      } else {
        localStorage.setItem("missionCampaigns", JSON.stringify([extendedCampaign]));
      }

      // mock DB에 캠페인 수정 저장 (best-effort)
      patchCampaign(campaignId, {
        title: formData.title,
        description: formData.providedItems,
      }).catch(() => {});

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
        <MissionCampaignForm
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
