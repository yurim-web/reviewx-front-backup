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
  UpdatePartnerProfileRequest,
  ChangePasswordRequest,
  WithdrawRequest,
} from "@/types/api/partnerMypage";

export const partnerMypageKeys = {
  all: ["partnerMypage"] as const,
  profile: () => [...partnerMypageKeys.all, "profile"] as const,
};

/** 파트너 프로필 조회 */
export function usePartnerProfile() {
  return useQuery({
    queryKey: partnerMypageKeys.profile(),
    queryFn: getPartnerProfile,
    staleTime: 1000 * 60 * 5,
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
