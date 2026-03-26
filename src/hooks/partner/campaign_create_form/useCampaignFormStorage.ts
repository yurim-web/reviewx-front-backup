/* ========================================
   캠페인 폼 localStorage 관리 훅
   ======================================== */

/**
 * useCampaignFormStorage
 *
 * 목적: 캠페인 폼 임시 저장/불러오기 기능 (localStorage 기반)
 *
 * 사용 페이지:
 * - /partner/campaign/create/* (캠페인 등록 페이지)
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CampaignFormData } from "@/types/domain/user";
import { useAuth } from "@/hooks/useAuth";
import { getPartnerPointSummary } from "@/data/partner/point/pointData";
import { postCampaignDraft, getCampaignDraft } from "@/lib/api/partnerCampaign";
import type { CampaignType } from "./useCampaignForm";
import type { CampaignCreatePageData } from "./useCampaignCreatePage";

/** 임시저장 campaignId를 저장하는 localStorage 키 (유형별) */
const DRAFT_ID_KEYS: Record<CampaignType, string> = {
  방문형: "draft_id_visit",
  구매평: "draft_id_review",
  미션형: "draft_id_mission",
  배송형: "draft_id_delivery",
  기자단: "draft_id_reporter",
};

/**
 * 캠페인 타입별 localStorage 키
 */
const STORAGE_KEYS: Record<CampaignType, string> = {
  방문형: "temp_visit_campaign",
  구매평: "temp_review_campaign",
  미션형: "temp_mission_campaign",
  배송형: "temp_delivery_campaign",
  기자단: "temp_reporter_campaign",
};

interface UseCampaignFormStorageProps {
  /** 캠페인 타입 */
  campaignType: CampaignType;
  /** 폼 데이터 */
  formData: CampaignFormData;
  /** 폼 데이터 설정 함수 */
  setFormData: React.Dispatch<React.SetStateAction<CampaignFormData>>;
  /** 초기 데이터 */
  initialData?: CampaignFormData | null;
  /** 수정 모드 여부 */
  isEditMode: boolean;
  /** 불러오기 모달 열기 */
  setLoadConfirmModal: React.Dispatch<React.SetStateAction<{ is_open: boolean }>>;
  /** 토스트 메시지 설정 */
  setToast: React.Dispatch<React.SetStateAction<{ is_open: boolean; message: string }>>;
  /** 긴급 상태 부모 전달 콜백 */
  onUrgentLoad?: (isUrgent: boolean) => void;
  /** 불러오기 버튼 비활성화 설정 */
  setIsLoadDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  /** 제출 중 여부 */
  isSubmitting?: boolean;
  /** API 09 pageData (채널/카테고리/파트너 정보) */
  pageData?: CampaignCreatePageData | null;
  /** 썸네일 미리보기 URL */
  thumbnailPreview: string | null;
  /** 상세 이미지 미리보기 URL 배열 */
  detailPreviews: string[];
  /** 썸네일 미리보기 설정 함수 */
  setThumbnailPreview: React.Dispatch<React.SetStateAction<string | null>>;
  /** 상세 이미지 미리보기 설정 함수 */
  setDetailPreviews: React.Dispatch<React.SetStateAction<string[]>>;
  /** 체크박스 상태 */
  checkboxStates: {
    minTextLength: boolean;
    minImageCount: boolean;
    videoCount: boolean;
  };
  /** 체크박스 상태 업데이트 함수 */
  updateCheckboxState: (
    field: "minTextLength" | "minImageCount" | "videoCount",
    checked: boolean
  ) => void;
}

export function useCampaignFormStorage({
  campaignType,
  formData,
  setFormData,
  initialData,
  isEditMode,
  setLoadConfirmModal,
  setToast,
  onUrgentLoad,
  setIsLoadDisabled,
  isSubmitting,
  thumbnailPreview,
  detailPreviews,
  setThumbnailPreview,
  setDetailPreviews,
  checkboxStates,
  updateCheckboxState,
  pageData,
}: UseCampaignFormStorageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const STORAGE_KEY = STORAGE_KEYS[campaignType];
  const DRAFT_ID_KEY = DRAFT_ID_KEYS[campaignType];

  /**
   * 보유 포인트 가져오기 함수
   * API 09 pageData 우선, 없으면 localStorage mock 데이터 사용
   */
  const getAvailablePoints = (): string => {
    if (pageData?.partner?.currentPoint != null) {
      return String(pageData.partner.currentPoint);
    }
    if (typeof window === "undefined" || !user?.id) return "0";
    try {
      const summary = getPartnerPointSummary(user.id);
      return String(summary.available_points || 0);
    } catch (_error) {
      return "0";
    }
  };

  /**
   * 포인트 충전 버튼 클릭 처리
   */
  const handleChargeClick = () => {
    if (typeof window !== "undefined") {
      // 포인트 충전 페이지에서 돌아왔을 때 플래그 저장
      sessionStorage.setItem("from_campaign_create", "true");

      // 현재 폼 데이터 자동 저장 (이미지 Data URL 포함)
      try {
        const { thumbnailImage: _tImg, detailImages: _dImg, ...restFormData } = formData;
        const dataToSave = {
          ...restFormData,
          thumbnailImageUrl: thumbnailPreview || undefined,
          detailImagePreviews: detailPreviews.length > 0 ? detailPreviews : undefined,
          hasThumbnailImage: thumbnailPreview !== null,
          hasDetailImages: detailPreviews.length > 0,
          checkboxStates: checkboxStates,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (_error) {}
    }
    router.push("/partner/point/charge");
  };

  /**
   * 임시 저장 확인 처리 (API 11: POST /partner/campaign/draft)
   * - 실제 API 호출 → campaignId를 localStorage에 저장
   * - 썸네일/상세 이미지 Data URL도 localStorage에 보관 (불러오기 시 복원)
   */
  const handleSaveConfirm = async () => {
    try {
      if (typeof window === "undefined") return;

      // File 객체는 JSON 직렬화 불가 → 제외하고, 이미지 미리보기 Data URL 저장
      const { thumbnailImage: _tImg2, detailImages: _dImg2, ...restFormData } = formData;
      const dataToSave = {
        ...restFormData,
        thumbnailImageUrl: thumbnailPreview || undefined,
        detailImagePreviews: detailPreviews.length > 0 ? detailPreviews : undefined,
        hasThumbnailImage: thumbnailPreview !== null,
        hasDetailImages: detailPreviews.length > 0,
        checkboxStates: checkboxStates,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

      // API 11: POST /partner/campaign/draft 호출
      const CAMPAIGN_TYPE_MAP: Record<string, string> = {
        배송형: "DELIVERY",
        방문형: "VISIT",
        구매평: "PURCHASE",
        기자단: "REPORTER",
        미션형: "MISSION",
      };
      const parseDateRange = (period: string) => {
        const parts = period?.split(" ~ ");
        return parts?.length === 2
          ? { start: parts[0].trim(), end: parts[1].trim() }
          : { start: "", end: "" };
      };
      const recruitRange = parseDateRange(formData.recruitmentPeriod);
      const contentRange = parseDateRange(formData.registrationPeriod);

      const draftPayload: Parameters<typeof postCampaignDraft>[0] = {
        type: CAMPAIGN_TYPE_MAP[campaignType] as Parameters<typeof postCampaignDraft>[0]["type"],
        title: formData.title || undefined,
        description: formData.providedItems || undefined,
        recruitLimit: Number(formData.recruitmentCount) || undefined,
        recruitStartAt: recruitRange.start || undefined,
        recruitEndAt: recruitRange.end || undefined,
        selectedAt: formData.announcementDate || undefined,
        contentStartAt: contentRange.start || undefined,
        contentEndAt: contentRange.end || undefined,
        promotionUrl: formData.promotionLink || undefined,
        keyword: formData.keywords || undefined,
        notification: formData.guidelines || undefined,
      };

      const response = await postCampaignDraft(draftPayload);
      // 반환된 campaignId 저장 (API 12 불러오기용)
      if (response.campaign?.campaignId) {
        localStorage.setItem(DRAFT_ID_KEY, String(response.campaign.campaignId));
      }

      setIsLoadDisabled(false);
      setToast({ is_open: true, message: "저장되었습니다." });
    } catch (_error) {
      alert("임시 저장에 실패했습니다.");
    }
  };

  /**
   * 불러오기 확인 처리 (API 12: GET /partner/campaign/draft/{campaignId})
   * - 저장된 campaignId로 API 호출 → 폼 데이터 복원
   * - API 실패 시 localStorage fallback
   */
  const handleLoadConfirm = async () => {
    try {
      if (typeof window === "undefined") return;

      // API 12 시도: localStorage에서 campaignId 읽기
      const storedDraftId = localStorage.getItem(DRAFT_ID_KEY);
      if (storedDraftId) {
        const campaignId = Number(storedDraftId);
        const response = await getCampaignDraft(campaignId);
        const draft = response.campaign;

        // 카테고리명/채널명 역매핑 (ID → 이름)
        const CHANNEL_LABELS: Record<string, string> = {
          NAVER_BLOG: "네이버 블로그",
          NAVER_CLIP: "네이버 클립",
          INSTAGRAM: "인스타그램",
          INSTAGRAM_REELS: "릴스",
          REELS: "릴스",
          YOUTUBE: "유튜브",
          YOUTUBE_SHORTS: "쇼츠",
        };
        const TYPE_KR: Record<string, string> = {
          DELIVERY: "배송형",
          VISIT: "방문형",
          PURCHASE: "구매평",
          REPORTER: "기자단",
          MISSION: "미션형",
        };
        const toDateRange = (start?: string, end?: string) =>
          start && end ? `${start.slice(0, 10)} ~ ${end.slice(0, 10)}` : "";

        const restored: Partial<CampaignFormData> = {
          campaignType: (TYPE_KR[draft.type] as CampaignFormData["campaignType"]) || campaignType,
          title: draft.title || "",
          category: draft.category?.categoryName || "",
          platform: draft.requiredPlatform
            ? ((CHANNEL_LABELS[draft.requiredPlatform.channelName] ??
                draft.requiredPlatform.channelName) as CampaignFormData["platform"])
            : "",
          providedItems: draft.description || "",
          recruitmentCount: String(draft.recruit?.recruitLimit || ""),
          ...(toDateRange(draft.recruit?.recruitStartAt, draft.recruit?.recruitEndAt) && {
            recruitmentPeriod: toDateRange(
              draft.recruit?.recruitStartAt,
              draft.recruit?.recruitEndAt
            ),
          }),
          ...(draft.recruit?.selectedAt && {
            announcementDate: draft.recruit.selectedAt.slice(0, 10),
          }),
          ...(toDateRange(draft.recruit?.contentStartAt, draft.recruit?.contentEndAt) && {
            registrationPeriod: toDateRange(
              draft.recruit?.contentStartAt,
              draft.recruit?.contentEndAt
            ),
          }),
          additionalPoints: String(draft.reward?.extraRewardPoint || ""),
          purchasePoints: String(draft.reward?.paymentRewardPoint || ""),
          promotionLink: draft.promotionUrl || "",
          keywords: draft.keyword || "",
          guidelines: draft.notification || "",
          visitAddress: draft.visitAddress || "",
        };

        setFormData((prev) => ({ ...prev, ...restored }));
        setThumbnailPreview(draft.thumbnail?.url || null);
        setDetailPreviews(draft.detailImages?.map((i) => i.url) || []);
        setLoadConfirmModal({ is_open: false });
        setToast({ is_open: true, message: "불러오기 완료" });
        return;
      }

      // API 12 campaignId 없음 → localStorage fallback
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setLoadConfirmModal({ is_open: false });
        return;
      }
      const savedData = JSON.parse(saved) as CampaignFormData;

      if (onUrgentLoad) {
        if (savedData?.isUrgent === true) onUrgentLoad(true);
        else if (savedData?.isUrgent === false) onUrgentLoad(false);
      }
      setFormData(savedData);
      const savedWithImages = savedData as CampaignFormData & {
        thumbnailImageUrl?: string;
        detailImagePreviews?: string[];
      };
      setThumbnailPreview(savedWithImages.thumbnailImageUrl || null);
      setDetailPreviews(savedWithImages.detailImagePreviews || []);
      const savedDataWithCheckbox = savedData as CampaignFormData & {
        checkboxStates?: { minTextLength?: boolean; minImageCount?: boolean; videoCount?: boolean };
      };
      if (savedDataWithCheckbox.checkboxStates) {
        const s = savedDataWithCheckbox.checkboxStates;
        if (s.minTextLength !== undefined) updateCheckboxState("minTextLength", s.minTextLength);
        if (s.minImageCount !== undefined) updateCheckboxState("minImageCount", s.minImageCount);
        if (s.videoCount !== undefined) updateCheckboxState("videoCount", s.videoCount);
      }
      setLoadConfirmModal({ is_open: false });
      setToast({ is_open: true, message: "불러오기 완료" });
    } catch (_error) {
      alert("임시 저장 데이터를 불러오는데 실패했습니다.");
      setLoadConfirmModal({ is_open: false });
    }
  };

  /**
   * 컴포넌트 마운트 시 보유 포인트 초기화 및 저장된 임시 데이터 확인
   */
  useEffect(() => {
    if (isEditMode || initialData) return;

    if (typeof window === "undefined") return;

    // 보유 포인트 초기화
    const availablePoints = getAvailablePoints();

    // 포인트 충전 페이지에서 돌아왔는지 확인
    const fromCampaignCreate = sessionStorage.getItem("from_campaign_create");

    // 포인트 업데이트
    if (availablePoints && (fromCampaignCreate === "true" || formData.currentPoints === "")) {
      setFormData((prev) => ({
        ...prev,
        currentPoints: availablePoints,
      }));
    }

    // 저장된 임시 데이터 확인
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        if (fromCampaignCreate) {
          sessionStorage.removeItem("from_campaign_create");
        }
        return;
      }

      const savedData = JSON.parse(saved);

      if (savedData && typeof savedData === "object" && Object.keys(savedData).length > 0) {
        // 포인트 충전 페이지에서 돌아왔다면 자동으로 불러오기
        if (fromCampaignCreate === "true") {
          // 긴급 상태를 먼저 복원
          if (onUrgentLoad) {
            if (savedData?.isUrgent === true) {
              onUrgentLoad(true);
            } else if (savedData?.isUrgent === false) {
              onUrgentLoad(false);
            }
          }

          const updatedData = {
            ...savedData,
            currentPoints: availablePoints,
          };
          setFormData(updatedData);

          // 썸네일/상세 이미지 미리보기 복원 (Data URL)
          const savedWithImages2 = savedData as CampaignFormData & {
            thumbnailImageUrl?: string;
            detailImagePreviews?: string[];
          };
          if (savedWithImages2.thumbnailImageUrl) {
            setThumbnailPreview(savedWithImages2.thumbnailImageUrl);
          } else {
            setThumbnailPreview(null);
          }
          if (savedWithImages2.detailImagePreviews?.length) {
            setDetailPreviews(savedWithImages2.detailImagePreviews);
          } else {
            setDetailPreviews([]);
          }

          // 체크박스 상태 복원
          const savedDataWithCheckbox2 = savedData as CampaignFormData & {
            checkboxStates?: {
              minTextLength?: boolean;
              minImageCount?: boolean;
              videoCount?: boolean;
            };
          };
          if (savedDataWithCheckbox2.checkboxStates) {
            const savedCheckboxStates = savedDataWithCheckbox2.checkboxStates;
            if (savedCheckboxStates.minTextLength !== undefined) {
              updateCheckboxState("minTextLength", savedCheckboxStates.minTextLength);
            }
            if (savedCheckboxStates.minImageCount !== undefined) {
              updateCheckboxState("minImageCount", savedCheckboxStates.minImageCount);
            }
            if (savedCheckboxStates.videoCount !== undefined) {
              updateCheckboxState("videoCount", savedCheckboxStates.videoCount);
            }
          }

          sessionStorage.removeItem("from_campaign_create");
        } else {
          // 포인트 충전에서 돌아오지 않았다면 불러오기 모달 표시
          setLoadConfirmModal({ is_open: true });
        }
      }
    } catch (_error) {
      if (fromCampaignCreate) {
        sessionStorage.removeItem("from_campaign_create");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, initialData, user?.id]);

  /**
   * 포인트 충전 후 돌아왔을 때 보유 포인트 업데이트
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleFocus = () => {
      const availablePoints = getAvailablePoints();
      if (availablePoints) {
        setFormData((prev) => ({
          ...prev,
          currentPoints: availablePoints,
        }));
      }
    };

    window.addEventListener("focus", handleFocus);
    handleFocus();

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 불러오기 버튼 비활성화 여부 업데이트
   */
  useEffect(() => {
    if (isSubmitting) {
      setIsLoadDisabled(true);
      return;
    }
    if (isEditMode || initialData) {
      setIsLoadDisabled(true);
      return;
    }

    if (typeof window === "undefined") {
      setIsLoadDisabled(true);
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setIsLoadDisabled(!saved);
    } catch {
      setIsLoadDisabled(true);
    }
  }, [isSubmitting, isEditMode, initialData, STORAGE_KEY, setIsLoadDisabled]);

  return {
    handleChargeClick,
    handleSaveConfirm,
    handleLoadConfirm,
  };
}
