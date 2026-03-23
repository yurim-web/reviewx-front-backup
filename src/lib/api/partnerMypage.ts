/**
 * 파트너 마이페이지 API 함수
 * 프론트엔드 명세서 13, 13.1, 13.2 기준
 */

import { partnerApiClient } from "@/lib/api/partnerClient";
import type {
  PartnerProfile,
  UpdatePartnerProfileRequest,
  ProfileImageUploadResponse,
  BusinessDocumentUploadResponse,
  ChangePasswordRequest,
  WithdrawRequest,
} from "@/types/api/partnerMypage";

/** GET /partner/mypage — 파트너 프로필 조회 */
export const getPartnerProfile = async (): Promise<PartnerProfile> => {
  const { data } = await partnerApiClient.get("/partner/mypage");
  return data;
};

/** PUT /partner/mypage — 내 정보 수정 */
export const updatePartnerProfile = async (
  request: UpdatePartnerProfileRequest
): Promise<PartnerProfile> => {
  const { data } = await partnerApiClient.put("/partner/mypage", request);
  return data;
};

/** POST /partner/mypage/profile-image — 프로필 사진 업로드 */
export const uploadProfileImage = async (imageFile: File): Promise<ProfileImageUploadResponse> => {
  const formData = new FormData();
  formData.append("image", imageFile);
  const { data } = await partnerApiClient.post("/partner/mypage/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/** DELETE /partner/mypage/profile-image — 프로필 사진 삭제 */
export const deleteProfileImage = async (): Promise<void> => {
  await partnerApiClient.delete("/partner/mypage/profile-image");
};

/** POST /partner/mypage/business-document — 사업자등록증 업로드 */
export const uploadBusinessDocument = async (
  documentFile: File
): Promise<BusinessDocumentUploadResponse> => {
  const formData = new FormData();
  formData.append("document", documentFile);
  const { data } = await partnerApiClient.post("/partner/mypage/business-document", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/** PUT /partner/mypage/password — 비밀번호 변경 */
export const changePassword = async (request: ChangePasswordRequest): Promise<void> => {
  await partnerApiClient.put("/partner/mypage/password", request);
};

/** DELETE /partner/mypage — 회원 탈퇴 */
export const withdrawPartner = async (request?: WithdrawRequest): Promise<void> => {
  await partnerApiClient.delete("/partner/mypage", { data: request });
};
