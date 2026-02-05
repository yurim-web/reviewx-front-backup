/* ========================================
   🚚 배송형 캠페인 상세 페이지
   ======================================== */

/**
 * 배송형 캠페인 상세 페이지
 *
 * 페이지 경로:
 * - /delivery/[id] (기존 /user/delivery/[id]에서 변경)
 *
 * 사용 파일:
 * - 컴포넌트: CampaignDetailPage
 * - 훅: useCampaignDetailScroll
 * - 데이터: deliveryCampaigns
 * - CSS: campaign_detail.module.css
 */

"use client";

import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import CampaignDetailPage from "@/components/campaign/CampaignDetailPage";
import ApplicationModal from "@/components/user/campaign_detail/modal/ApplicationModal";
import DetailGuidelinesSectionDelivery from "@/components/user/campaign_detail/guidelines/DetailGuidelinesSectionDelivery";
import Toast from "@/components/common/toast/Toast";
import { deliveryCampaigns, deliveryClosedCampaignsExtended } from "@/data/campaign/delivery/deliveryCampaigns";
import type { CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import type { DeliveryCampaignData } from "@/data/campaign/delivery/deliveryCampaigns";

interface DeliveryDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * CampaignWithApplicants를 DeliveryCampaignData 형식으로 변환하는 함수
 *
 * 설명:
 * - localStorage에 저장된 CampaignWithApplicants 형식의 캠페인을
 *   상세페이지에서 사용하는 DeliveryCampaignData 형식으로 변환합니다.
 * - 일부 필드는 기본값으로 설정됩니다.
 */
/**
 * formData에서 requirements 배열을 생성하는 함수
 *
 * 설명:
 * - formData의 참여/제출 옵션 필드들을 requirements 배열 형식으로 변환합니다.
 * - 예: minTextLength: "2000" → "text_2000"
 * - 예: minImageCount: "15" → "photo_15"
 * - 예: videoCount: "1", videoDuration: "180" → "video_1_180"
 */
function generateRequirementsFromFormData(formData?: {
  minTextLength?: string | number;
  minImageCount?: string | number;
  videoCount?: string | number;
  videoDuration?: string | number;
  requireLinkAttachment?: boolean;
  requireKeywordAttachment?: boolean;
}): string[] {
  if (!formData) return [];

  const requirements: string[] = [];

  // 텍스트 길이 요구사항
  if (formData.minTextLength) {
    requirements.push(`text_${formData.minTextLength}`);
  }

  // 사진 개수 요구사항
  if (formData.minImageCount) {
    requirements.push(`photo_${formData.minImageCount}`);
  }

  // 동영상 요구사항
  if (formData.videoCount && formData.videoDuration) {
    requirements.push(`video_${formData.videoCount}_${formData.videoDuration}`);
  } else if (formData.videoDuration) {
    // videoCount가 없으면 기본값 1
    requirements.push(`video_1_${formData.videoDuration}`);
  }

  // 제품 링크 요구사항
  if (formData.requireLinkAttachment) {
    requirements.push("product_link");
  }

  // 키워드 요구사항
  if (formData.requireKeywordAttachment) {
    requirements.push("keyword");
  }

  return requirements;
}

function convertToDeliveryCampaignData(
  campaign: CampaignWithApplicants & {
    description?: string;
    promotionLink?: string;
    keywords?: string;
    guidelines?: string;
    detailImagePreviews?: string[]; // 상세 이미지 미리보기 URL 배열
    campaign_detail_images?: string[]; // localStorage에 저장된 상세 이미지 배열
    campaign_detail_image?: string; // localStorage에 저장된 단일 상세 이미지
    // formData 필드들 (requirements 생성용)
    minTextLength?: string | number;
    minImageCount?: string | number;
    videoCount?: string | number;
    videoDuration?: string | number;
    requireLinkAttachment?: boolean;
    requireKeywordAttachment?: boolean;
    // points 계산용
    additionalPoints?: string | number;
    isUrgent?: boolean; // 긴급 캠페인 여부
  }
): DeliveryCampaignData {
  const info = campaign.campaignInfo;

  // 모집기간에서 시작일과 종료일 추출
  const recruitmentPeriod = info.recruitmentPeriod || "";
  const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
  const [applicationStart = "", applicationEnd = ""] = recruitmentPeriod
    .split(separator)
    .map((s) => s.trim());

  // 등록기간 추출
  const registrationPeriod = info.registrationPeriod || "";

  // guidelines를 배열로 변환 (줄바꿈 기준)
  // 줄바꿈(\n)을 <br>로 변환하여 HTML로 표시
  // localStorage에 guidelineTexts 배열이 있으면 우선 사용
  const guidelineTexts = 
    (campaign as any).guidelineTexts && Array.isArray((campaign as any).guidelineTexts)
      ? (campaign as any).guidelineTexts.map((text: string) => 
          typeof text === 'string' ? text.replace(/\n/g, "<br>") : text
        )
      : campaign.guidelines
      ? campaign.guidelines
          .split("\n\n")
          .filter((text) => text.trim() !== "")
          .map((text) => text.replace(/\n/g, "<br>"))
      : [];

  // 상세 이미지 배열 결정: 
  // 1. campaign_detail_images가 있으면 사용 (localStorage 데이터)
  // 2. detailImagePreviews가 있으면 사용 (폼 데이터)
  // 3. campaign_detail_image가 있으면 단일 이미지로 배열 생성
  // 4. 없으면 썸네일 이미지 사용
  const detailImages =
    (campaign as any).campaign_detail_images && 
    Array.isArray((campaign as any).campaign_detail_images) && 
    (campaign as any).campaign_detail_images.length > 0
      ? (campaign as any).campaign_detail_images
      : campaign.detailImagePreviews && campaign.detailImagePreviews.length > 0
      ? campaign.detailImagePreviews
      : (campaign as any).campaign_detail_image
      ? [(campaign as any).campaign_detail_image]
      : [info.image];

  // requirements 배열 생성
  const requirements = generateRequirementsFromFormData({
    minTextLength: campaign.minTextLength,
    minImageCount: campaign.minImageCount,
    videoCount: campaign.videoCount,
    videoDuration: campaign.videoDuration,
    requireLinkAttachment: campaign.requireLinkAttachment,
    requireKeywordAttachment: campaign.requireKeywordAttachment,
  });

  // points 계산 
  // 1. localStorage에 저장된 points 필드 확인
  // 2. additionalPoints 필드 확인
  let points = 0;
  if ((campaign as any).points !== undefined && (campaign as any).points !== null) {
    points = Number((campaign as any).points) || 0;
  } else if (campaign.additionalPoints) {
    const pointsStr = String(campaign.additionalPoints).replace(/,/g, "");
    points = parseInt(pointsStr, 10) || 0;
  }

  /**
   * schedule 필드 생성 함수
   *
   * 설명:
   * - 모집 시작일(applicationStart)을 "1/15 (목) 10:00\n모집 오픈" 형식으로 포맷팅합니다.
   * - 오픈 예정일 때만 사용되며, 오픈 예정이 아닌 경우 빈 문자열을 반환합니다.
   *
   */
  const generateSchedule = (): string => {
    if (!applicationStart) {
      return "";
    }

    try {
      // 모집 시작일 파싱
      const startDate = new Date(applicationStart);

      // 오늘 날짜 (시간 정보 제거)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);

      // 오늘 < applicationStart → 오픈 예정일 때만 schedule 생성
      if (today < startDate) {
        // 모집 시작일 파싱
        const startDateTime = new Date(applicationStart);

        // 날짜를 "M/d (E)" 형식으로 포맷팅
        // M: 월 (1-12)
        // d: 일 (1-31)
        // E: 요일 약어 (월, 화, 수 등)
        const formattedDate = format(startDateTime, "M/d (E)", {
          locale: ko,
        });

        // "모집 오픈" 텍스트와 함께 반환
        return `${formattedDate}\n모집 오픈`;
      }
    } catch (error) {
      console.error("[generateSchedule] 날짜 포맷팅 실패:", error);
    }

    return "";
  };

  return {
    id: info.id,
    title: info.title,
    category: "배송형",
    image: info.image,
    subcategory: info.category || "기타",
    points: points,
    description: campaign.description || "",
    recruitment: {
      current: info.recruitedCount || 0,
      total: info.totalCount || 0,
    },
    schedule: generateSchedule(), // 오픈 예정일 때만 schedule 생성
    dayCount: info.daysLeft ? `D-${info.daysLeft}` : "",
    detailedSchedule: {
      applicationStart,
      applicationEnd,
      announcement: info.announcementDate || "",
      purchasePeriod: "", // 배송형은 purchasePeriod가 없을 수 있음
      registrationPeriod,
    },
    campaign_detail_image: detailImages[0] || info.image, // 첫 번째 상세 이미지 또는 썸네일 이미지
    campaign_detail_images: detailImages, // 여러 상세 이미지 배열
    channel: info.brandName || "",
    keyword: campaign.keywords || "",
    promotionLink: campaign.promotionLink || "",
    requirements: requirements.length > 0 ? requirements : [], // formData에서 생성한 requirements 사용
    guidelineTexts,
    // 긴급 캠페인 여부 (localStorage에서 불러온 값 사용)
    isUrgent: campaign.isUrgent === true,
  };
}

export default function DeliveryDetailPage({
  params,
}: DeliveryDetailPageProps) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<DeliveryCampaignData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // localStorage 데이터를 먼저 확인 (수정된 내용 우선 반영), 그 다음 정적 데이터 확인
  useEffect(() => {
    setIsLoading(true);
    // 디버깅: 받은 ID 로그
    console.log("[DeliveryDetailPage] 받은 ID:", id);
    
    // 1. localStorage에서 먼저 찾기 (수정된 데이터 우선)
    if (typeof window !== "undefined") {
      try {
        const storedCampaigns = localStorage.getItem("deliveryCampaigns");
        if (storedCampaigns) {
          const campaigns: CampaignWithApplicants[] =
            JSON.parse(storedCampaigns);
          console.log(
            "[DeliveryDetailPage] localStorage에서 찾기 시작, 저장된 캠페인 수:",
            campaigns.length
          );
          // URL의 ID가 "delivery_903" 형식이거나 "903" 형식일 수 있음
          // localStorage의 ID는 "delivery_13" 형식이므로 둘 다 확인
          const storedCampaign = campaigns.find((c) => {
            const campaignId = String(c.campaignInfo.id);
            // 정확히 일치하는 경우
            if (campaignId === id) {
              console.log(
                "[DeliveryDetailPage] localStorage에서 정확히 일치하는 캠페인 찾음:",
                campaignId
              );
              return true;
            }
            // ID 형식 변환 시도
            // URL이 "delivery_903" 형식이고 localStorage ID가 "903" 형식인 경우
            if (id.startsWith("delivery_")) {
              const idWithoutPrefix = id.replace(/^delivery_/, "");
              // URL에서 "delivery_"를 제거한 값과 localStorage ID 비교
              if (campaignId === idWithoutPrefix) {
                console.log(
                  "[DeliveryDetailPage] localStorage에서 delivery_ 제거 후 일치:",
                  campaignId,
                  "===",
                  idWithoutPrefix
                );
                return true;
              }
              // 둘 다 "delivery_903" 형식인 경우
              if (campaignId === id) {
                console.log(
                  "[DeliveryDetailPage] localStorage에서 delivery_ 형식으로 일치:",
                  campaignId
                );
                return true;
              }
            }
            // URL이 "903" 형식이고 localStorage ID도 "903" 형식인 경우
            if (
              !id.startsWith("delivery_") &&
              !campaignId.startsWith("delivery_")
            ) {
              const matches = campaignId === id;
              if (matches)
                console.log(
                  "[DeliveryDetailPage] localStorage에서 숫자만으로 일치:",
                  campaignId
                );
              return matches;
            }
            // localStorage ID가 "delivery_903" 형식이고 URL이 "903" 형식인 경우
            if (
              campaignId.startsWith("delivery_") &&
              !id.startsWith("delivery_")
            ) {
              const campaignIdWithoutPrefix = campaignId.replace(
                /^delivery_/,
                ""
              );
              const matches = campaignIdWithoutPrefix === id;
              if (matches)
                console.log(
                  "[DeliveryDetailPage] localStorage에서 delivery_ 제거 후 일치:",
                  campaignIdWithoutPrefix,
                  "===",
                  id
                );
              return matches;
            }
            return false;
          });
          if (storedCampaign) {
            console.log(
              "[DeliveryDetailPage] localStorage에서 캠페인 찾음:",
              storedCampaign.campaignInfo.id
            );
            // CampaignWithApplicants를 DeliveryCampaignData로 변환
            const convertedCampaign =
              convertToDeliveryCampaignData(storedCampaign);
            setCampaign(convertedCampaign);
            setIsLoading(false);
            return;
          }
          console.log(
            "[DeliveryDetailPage] localStorage에서 캠페인을 찾지 못함"
          );
        } else {
          console.log(
            "[DeliveryDetailPage] localStorage에 deliveryCampaigns가 없음"
          );
        }
      } catch (error) {
        console.error(
          "[DeliveryDetailPage] localStorage에서 캠페인 불러오기 실패:",
          error
        );
      }
    }

    // 2. localStorage에 없으면 정적 데이터에서 찾기
    console.log(
      "[DeliveryDetailPage] 정적 데이터에서 찾기 시작, 전체 캠페인 수:",
      deliveryCampaigns.length
    );
    const staticCampaign = deliveryCampaigns.find((c) => {
      const campaignId = String(c.id);
      // 정확히 일치하는 경우
      if (campaignId === id) {
        console.log(
          "[DeliveryDetailPage] 정적 데이터에서 정확히 일치하는 캠페인 찾음:",
          campaignId
        );
        return true;
      }
      // ID 형식 변환 시도
      // URL이 "delivery_903" 형식이고 정적 데이터 ID가 "delivery_1" 형식인 경우
      if (id.startsWith("delivery_")) {
        // 둘 다 "delivery_" 형식이면 그대로 비교
        if (campaignId === id) {
          console.log(
            "[DeliveryDetailPage] 정적 데이터에서 delivery_ 형식으로 일치:",
            campaignId
          );
          return true;
        }
        // URL에서 "delivery_"를 제거한 값과 정적 데이터 ID 비교 (정적 데이터는 보통 "delivery_1" 형식)
        const idWithoutPrefix = id.replace(/^delivery_/, "");
        if (campaignId === idWithoutPrefix) {
          console.log(
            "[DeliveryDetailPage] 정적 데이터에서 delivery_ 제거 후 일치:",
            campaignId,
            "===",
            idWithoutPrefix
          );
          return true;
        }
      }
      // URL이 "903" 형식이고 정적 데이터 ID도 "delivery_1" 형식이 아닌 경우
      if (!id.startsWith("delivery_") && !campaignId.startsWith("delivery_")) {
        const matches = campaignId === id;
        if (matches)
          console.log(
            "[DeliveryDetailPage] 정적 데이터에서 숫자만으로 일치:",
            campaignId
          );
        return matches;
      }
      // 정적 데이터 ID가 "delivery_1" 형식이고 URL이 "1" 형식인 경우
      if (campaignId.startsWith("delivery_") && !id.startsWith("delivery_")) {
        const campaignIdWithoutPrefix = campaignId.replace(/^delivery_/, "");
        const matches = campaignIdWithoutPrefix === id;
        if (matches)
          console.log(
            "[DeliveryDetailPage] 정적 데이터에서 delivery_ 제거 후 일치:",
            campaignIdWithoutPrefix,
            "===",
            id
          );
        return matches;
      }
      return false;
    });
    if (staticCampaign) {
      console.log(
        "[DeliveryDetailPage] 정적 데이터에서 캠페인 찾음:",
        staticCampaign.id
      );
      setCampaign(staticCampaign);
      setIsLoading(false);
      return;
    }
    console.log("[DeliveryDetailPage] 정적 데이터에서 캠페인을 찾지 못함");

    // 3. 정적 데이터에서 찾지 못했으면 취소된 캠페인에서 찾기
    console.log(
      "[DeliveryDetailPage] 취소된 캠페인에서 찾기 시작, 전체 캠페인 수:",
      deliveryClosedCampaignsExtended.length
    );
    const closedCampaign = deliveryClosedCampaignsExtended.find((c) => {
      const campaignId = String(c.id);
      // 정확히 일치하는 경우
      if (campaignId === id) {
        console.log(
          "[DeliveryDetailPage] 취소된 캠페인에서 정확히 일치하는 캠페인 찾음:",
          campaignId
        );
        return true;
      }
      // ID 형식 변환 시도
      if (id.startsWith("delivery_")) {
        // 둘 다 "delivery_" 형식이면 그대로 비교
        if (campaignId === id) {
          console.log(
            "[DeliveryDetailPage] 취소된 캠페인에서 delivery_ 형식으로 일치:",
            campaignId
          );
          return true;
        }
        // URL에서 "delivery_"를 제거한 값과 비교
        const idWithoutPrefix = id.replace(/^delivery_/, "");
        if (campaignId === idWithoutPrefix) {
          console.log(
            "[DeliveryDetailPage] 취소된 캠페인에서 delivery_ 제거 후 일치:",
            campaignId,
            "===",
            idWithoutPrefix
          );
          return true;
        }
      }
      // URL이 "902" 형식이고 캠페인 ID도 "902" 형식인 경우
      if (!id.startsWith("delivery_") && !campaignId.startsWith("delivery_")) {
        const matches = campaignId === id;
        if (matches)
          console.log(
            "[DeliveryDetailPage] 취소된 캠페인에서 숫자만으로 일치:",
            campaignId
          );
        return matches;
      }
      // 캠페인 ID가 "delivery_902" 형식이고 URL이 "902" 형식인 경우
      if (campaignId.startsWith("delivery_") && !id.startsWith("delivery_")) {
        const campaignIdWithoutPrefix = campaignId.replace(/^delivery_/, "");
        const matches = campaignIdWithoutPrefix === id;
        if (matches)
          console.log(
            "[DeliveryDetailPage] 취소된 캠페인에서 delivery_ 제거 후 일치:",
            campaignIdWithoutPrefix,
            "===",
            id
          );
        return matches;
      }
      return false;
    });
    if (closedCampaign) {
      console.log(
        "[DeliveryDetailPage] 취소된 캠페인에서 캠페인 찾음:",
        closedCampaign.id
      );
      // DeliveryCampaignDataExtended를 DeliveryCampaignData로 변환
      const convertedCampaign: DeliveryCampaignData = {
        ...closedCampaign,
        // 필요한 필드들이 이미 있으면 그대로 사용, 없으면 기본값 설정
        dayCount: closedCampaign.dayCount || "마감",
        isUrgent: closedCampaign.isUrgent || false,
      };
      setCampaign(convertedCampaign);
      setIsLoading(false);
      return;
    }
    console.log("[DeliveryDetailPage] 취소된 캠페인에서도 캠페인을 찾지 못함");

    // 4. 찾지 못한 경우
    console.warn("[DeliveryDetailPage] 캠페인을 찾을 수 없습니다. ID:", id);
    setCampaign(null);
    setIsLoading(false);
  }, [id]);

  // 로딩 중일 때는 아무것도 표시하지 않음 (또는 로딩 스피너 표시)
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 로딩이 완료되었는데 캠페인이 없으면 404
  if (!campaign) return notFound();

  return (
    <>
      <CampaignDetailPage
        campaign={campaign}
        altText="delivery_tag"
        additionalSchedules={[
          {
            label: "등록 기간",
            value: campaign.detailedSchedule.registrationPeriod,
          },
        ]}
        guidelinesComponent={
          <DetailGuidelinesSectionDelivery
            description={campaign.description}
            promotionLink={campaign.promotionLink}
            keyword={campaign.keyword}
            onCopyPromotionLink={async () => {
              if (campaign.promotionLink) {
                await navigator.clipboard.writeText(campaign.promotionLink);
                setToastMessage("복사되었습니다.");
                setShowToast(true);
              }
            }}
            onCopyKeyword={async () => {
              await navigator.clipboard.writeText(campaign.keyword);
              setToastMessage("복사되었습니다.");
              setShowToast(true);
            }}
            requirements={campaign.requirements}
            guidelineTexts={campaign.guidelineTexts}
          />
        }
        renderApplicationModal={(isOpen, onClose, campaign) => (
          <ApplicationModal
            isOpen={isOpen}
            onClose={onClose}
            type="delivery"
            campaignId={campaign.id}
            dayCount={campaign.dayCount}
            isUrgent={campaign.isUrgent}
            channelName={campaign.channel}
            channelUrl={undefined} // TODO: 사용자의 실제 연결된 채널 URL을 가져와야 함
          />
        )}
      />
      {/* 토스트 메시지 */}
      <Toast
        message={toastMessage}
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        duration={2000}
      />
    </>
  );
}
