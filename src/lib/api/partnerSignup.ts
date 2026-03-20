import { partnerApiClient } from "@/lib/api/partnerClient";
import type {
  PartnerSignupPageResponse,
  PartnerSignupRequest,
  PartnerSignupResponse,
} from "@/types/api/partnerSignup";

/**
 * 파트너 회원가입 페이지 조회
 * GET /partner/signup
 * 약관 목록 + 은행 목록 반환
 */
export const getPartnerSignupPage = async (): Promise<PartnerSignupPageResponse> => {
  const { data } = await partnerApiClient.get<PartnerSignupPageResponse>("/partner/signup");
  return data;
};

/**
 * 파트너 회원가입
 * POST /partner/signup
 * Content-Type: multipart/form-data
 */
export const partnerSignup = async (req: PartnerSignupRequest): Promise<PartnerSignupResponse> => {
  const formData = new FormData();

  formData.append("email", req.email);
  formData.append("password", req.password);
  formData.append("name", req.name);
  formData.append("phoneNum", req.phoneNum);
  formData.append("businessName", req.businessName);
  formData.append("ceoName", req.ceoName);
  formData.append("businessNumber", req.businessNumber);
  formData.append("businessLicenseFile", req.businessLicenseFile);
  formData.append("postNumber", String(req.postNumber));
  formData.append("address", req.address);
  formData.append("addressDetail", req.addressDetail);
  formData.append("csNumber", req.csNumber);

  // agreements 객체 → flat keys
  formData.append(
    "agreements.termsServicePrivacyAgreed",
    String(req.agreements.termsServicePrivacyAgreed)
  );
  formData.append(
    "agreements.privacyThirdPartyAgreed",
    String(req.agreements.privacyThirdPartyAgreed)
  );
  formData.append(
    "agreements.marketingPrivacyAgreed",
    String(req.agreements.marketingPrivacyAgreed ?? false)
  );
  formData.append("agreements.termsServiceAgreed", String(req.agreements.termsServiceAgreed));
  formData.append(
    "agreements.termsAdPromoComplianceAgreed",
    String(req.agreements.termsAdPromoComplianceAgreed)
  );
  formData.append(
    "agreements.marketingThirdPartyProvisionAgreed",
    String(req.agreements.marketingThirdPartyProvisionAgreed ?? false)
  );

  const { data } = await partnerApiClient.post<PartnerSignupResponse>("/partner/signup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
