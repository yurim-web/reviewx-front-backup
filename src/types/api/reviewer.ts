/* ========================================
   리뷰어 프로필 API 타입
   ======================================== */

/**
 * 리뷰어 프로필 API 타입
 *
 * 목적: 리뷰어 프로필 GET/PATCH API의 요청·응답 타입 정의
 *
 * 사용 위치:
 * - src/lib/api/reviewer.ts
 * - src/hooks/user/mypage/useReviewerProfile.ts
 * - src/hooks/user/mypage/useEditProfile.ts
 */

/**
 * GET /user/mypage/profile 응답 타입 (R-28)
 */
export interface ReviewerProfileResponse {
  result: string;
  generatedAt: string;
  user: {
    userId: number;
    role: string;
    name: string;
    email: string;
    phoneNum: string;
    address: string;
    postNumber: number;
    status: string;
    profileImage: {
      attachmentId: number;
      fileId: number;
      originalName: string;
      storedName: string;
      filePath: string;
      fileType: string;
    } | null;
    lastLoginAt: string;
  };
  reviewerProfile: {
    reviewerId: number;
    grade: string;
    sex: string;
    birthDate: string;
    channel: {
      channelId: number;
      channelName: string;
      userChannelId: number;
      externalId: string;
      channelUrl: string;
    } | null;
  };
}

/**
 * GET /user/mypage/edit 응답 타입 (R-31)
 */
export interface ReviewerEditResponse {
  result: string;
  generatedAt: string;
  user: {
    userId: number;
    name: string;
    email: string;
    phoneNum: string;
    status: string;
    createdAt: string;
    lastLoginAt: string;
    profileImageUrl: string | null;
  };
  address: {
    zipCode: string;
    address: string;
    addressDetail: string;
  } | null;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  } | null;
  reviewerProfile: {
    reviewerId: number;
    grade: string;
    sex: string;
    birthDate: string;
  };
  social: {
    kakaoId: string | null;
    naverAccountId: string | null;
  };
}

/**
 * GET /user/mypage/channel 응답 내 채널 아이템 (R-29)
 */
export interface ReviewerChannelItem {
  userChannelId: number;
  channelId: number;
  channelName: string;
  isConnected: boolean;
  externalId: string | null;
  channelUrl: string | null;
  connectedAt: string | null;
}

/**
 * GET /user/mypage/channel 응답 타입 (R-29)
 */
export interface ReviewerChannelResponse {
  result: string;
  generatedAt: string;
  user: {
    userId: number;
    role: string;
    name: string;
    email: string;
    phoneNum: string;
    address: string;
    postNumber: string;
    status: string;
    profileImage: string | null;
  };
  reviewerProfile: {
    reviewerId: number;
    grade: string;
    sex: string;
    birthDay: string;
    channel: ReviewerChannelItem[];
  };
}

export interface ReviewerProfilePatchBody {
  name?: string;
  nickname?: string;
  phone?: string;
  postNumber?: string;
  address?: string;
  addressDetail?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  residentRegNo?: string;
  profile_image?: string;
  channel_details?: Array<{
    name: string;
    url: string;
    status: "connected" | "disconnected";
  }>;
}
