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
import { fetchDraftCampaign, postDraftCampaign, putDraftCampaign } from "@/lib/api/partner";
import type { CampaignType } from "./useCampaignForm";

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
}: UseCampaignFormStorageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const STORAGE_KEY = STORAGE_KEYS[campaignType];

  /**
   * 보유 포인트 가져오기 함수
   */
  const getAvailablePoints = (): string => {
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
   * 임시 저장 확인 처리
   * - 썸네일/상세 이미지는 Data URL로 저장하여 불러오기 시 복원
   */
  const handleSaveConfirm = () => {
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

      // mock DB에도 저장 (이미지 Data URL 제외, 폼 필드만)
      if (user?.id) {
        const { thumbnailImageUrl: _t, detailImagePreviews: _d, ...dbFields } = dataToSave;
        const dbPayload = {
          ...dbFields,
          partner_id: user.id,
          campaignType,
          updated_at: new Date().toISOString(),
        };
        // 기존 draft가 있으면 업데이트, 없으면 새로 생성
        fetchDraftCampaign(user.id, campaignType)
          .then((existing) => {
            if (existing?.id) {
              return putDraftCampaign(Number(existing.id), dbPayload);
            } else {
              return postDraftCampaign(dbPayload).then(() => undefined);
            }
          })
          .catch(() => {});
      }

      setToast({ is_open: true, message: "저장되었습니다." });
    } catch (_error) {
      alert("임시 저장에 실패했습니다.");
    }
  };

  /**
   * 불러오기 확인 처리
   */
  const handleLoadConfirm = () => {
    try {
      if (typeof window === "undefined") return;

      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const savedData = JSON.parse(saved) as CampaignFormData;

      // 불러온 데이터의 긴급 상태를 부모 컴포넌트로 먼저 전달
      if (onUrgentLoad) {
        if (savedData?.isUrgent === true) {
          onUrgentLoad(true);
        } else if (savedData?.isUrgent === false) {
          onUrgentLoad(false);
        }
      }

      // 저장된 데이터로 formData 업데이트
      setFormData(savedData);

      // 썸네일/상세 이미지 미리보기 복원 (Data URL)
      const savedWithImages = savedData as CampaignFormData & {
        thumbnailImageUrl?: string;
        detailImagePreviews?: string[];
      };
      if (savedWithImages.thumbnailImageUrl) {
        setThumbnailPreview(savedWithImages.thumbnailImageUrl);
      } else {
        setThumbnailPreview(null);
      }
      if (savedWithImages.detailImagePreviews?.length) {
        setDetailPreviews(savedWithImages.detailImagePreviews);
      } else {
        setDetailPreviews([]);
      }

      // 체크박스 상태 복원
      const savedDataWithCheckbox = savedData as CampaignFormData & {
        checkboxStates?: { minTextLength?: boolean; minImageCount?: boolean; videoCount?: boolean };
      };
      if (savedDataWithCheckbox.checkboxStates) {
        const savedCheckboxStates = savedDataWithCheckbox.checkboxStates;
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
