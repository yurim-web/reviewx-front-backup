/**
 * 파트너 마이페이지 커스텀 훅
 * 프론트엔드 명세서 13, 13.1, 13.2 기준
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPartnerProfile,
  updatePartnerProfile,
  uploadProfileImage,
  deleteProfileImage,
  uploadBusinessDocument,
  changePassword,
  withdrawPartner,
} from "@/lib/api/partnerMypage";
import type {
  PartnerProfile,
  UpdatePartnerProfileRequest,
  ChangePasswordRequest,
  WithdrawRequest,
} from "@/types/api/partnerMypage";

export const partnerMypageKeys = {
  all: ["partnerMypage"] as const,
  profile: () => [...partnerMypageKeys.all, "profile"] as const,
};

const STATIC_PARTNER_PROFILE: PartnerProfile = {
  id: "partner_demo",
  email: "test@test.com",
  name: "이사장",
  phone: "010-1234-5678",
  profileImage: null,
  businessName: "마크엑스컴퍼니",
  representativeName: "이사장",
  businessNumber: "123-45-67890",
  businessType: "법인사업자",
  postalCode: "06236",
  address: "서울특별시 강남구 테헤란로 152",
  detailAddress: "7층 701호",
  joinDate: "2025-01-15",
};

/** 파트너 프로필 조회 */
export function usePartnerProfile() {
  return useQuery({
    queryKey: partnerMypageKeys.profile(),
    queryFn: getPartnerProfile,
    staleTime: 1000 * 60 * 5,
    placeholderData: STATIC_PARTNER_PROFILE,
  });
}

/** 내 정보 수정 뮤테이션 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdatePartnerProfileRequest) => updatePartnerProfile(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: partnerMypageKeys.profile() }),
  });
}

/** 프로필 사진 업로드 뮤테이션 */
export function useUploadProfileImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageFile: File) => uploadProfileImage(imageFile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: partnerMypageKeys.profile() }),
  });
}

/** 프로필 사진 삭제 뮤테이션 */
export function useDeleteProfileImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProfileImage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: partnerMypageKeys.profile() }),
  });
}

/** 사업자등록증 업로드 뮤테이션 */
export function useUploadBusinessDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentFile: File) => uploadBusinessDocument(documentFile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: partnerMypageKeys.profile() }),
  });
}

/** 비밀번호 변경 뮤테이션 */
export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) => changePassword(request),
  });
}

/** 회원 탈퇴 뮤테이션 */
export function useWithdrawMutation() {
  return useMutation({
    mutationFn: (request?: WithdrawRequest) => withdrawPartner(request),
  });
}
