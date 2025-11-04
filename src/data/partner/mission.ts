/* ========================================
   🎯 미션형 캠페인 데이터 (캠페인 info + 신청 카드 + 콘텐츠)
   - sharedCampaigns.ts에서 타입별 데이터 분리
   ======================================== */
import type { CampaignWithApplicants } from "./campaign_application/delivery_applicants";
import type { CampaignWithContents } from "./sharedCampaigns";
import type { ContentByTab, ContentItem } from "./sharedCampaigns";
import { CampaignFormData } from "@/types/campaign";
import { calculateCampaignStatus, calculateDaysLeft } from "./delivery";

export const missionCampaigns: CampaignWithApplicants[] = [
  // 진행 탭(진행 중) - 기존 미션형 캠페인 (콘텐츠 있음)
  {
    campaignInfo: {
      id: "16",
      title: "화장품 브랜드 미션형 모집",
      image: "/images/main/campaign_img/eximg_4.png",
      status: "진행 중",
      campaignType: "미션형",
      category: "뷰티",
      brandName: "",
      recruitmentPeriod: "2024-01-12 ~ 2024-01-20",
      announcementDate: "2024-01-20",
      registrationPeriod: "2024-01-22 ~ 2024-01-30",
      recruitedCount: 8,
      totalCount: 10,
      daysLeft: 5,
      statusText: "캠페인 콘텐츠를 검수해 주세요.",
    },
    applicantData: {
      applicants: [
        {
          id: "app_16_1",
          Id: "reviewer_16_001",
          nickname: "미션리뷰어1",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "화장품 미션에 관심이 많습니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_16_2",
          Id: "reviewer_16_002",
          nickname: "뷰티미션러",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "뷰티 제품 미션을 자주 참여합니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_16_3",
          Id: "reviewer_16_003",
          nickname: "스킨케어전문가",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "스킨케어 제품 미션 전문가입니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_16_4",
          Id: "reviewer_16_004",
          nickname: "미션마스터",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          memo: "다양한 미션에 참여한 경험이 풍부합니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_16_5",
          Id: "reviewer_16_005",
          nickname: "제한된계정",
          userType: "리뷰어",
          profileImage: "",
          memberType: "이용 제한",
          memo: "이용 제한 계정입니다.",
          selectionStatus: "이용제한 계정",
          channel: "기본",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_16_1",
          Id: "selected_16_001",
          nickname: "선정된미션러1",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "이미 선정된 우수 미션 참여자입니다.",
          selectionStatus: "선정하기",
          channel: "기본",
        },
        {
          id: "sel_16_2",
          Id: "selected_16_002",
          nickname: "프로미션러",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          memo: "미션 수행 경험이 풍부한 전문가입니다.",
          selectionStatus: "선정하기",
          channel: "기본",
        },
      ],
    },
    // 콘텐츠 데이터: 각 캠페인 정보 아래에 콘텐츠 목록 포함
    // 설명: deliveryClosedCampaigns와 동일한 형태로, campaignInfo 아래에 contents를 포함합니다.
    // ID 16번 캠페인은 이미지+링크 확인 버튼 유형(actionType: 2)만 사용합니다.
    // - 검수 상태: missionType 1 (이미지+링크 확인)
    // - 반려 상태: missionType 4 (이미지+링크 확인, 반려됨)
    // - 완료 상태: missionType 7 (이미지+링크 확인, 완료됨)
    contents: {
      reviewing: [
        {
          id: "m-r-1",
          createdAt: "2025-01-15T16:00:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "미션리뷰어1",
          channelId: "mission_user_001",
          channel: "",
          actionType: "2",
          missionType: "1",
        },
        {
          id: "m-r-2",
          createdAt: "2025-01-15T16:30:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "미션인플루언서1",
          channelId: "mission_user_002",
          channel: "",
          actionType: "2",
          missionType: "1",
          updatedAt: "2025-01-15T17:00:00.000Z",
        },
        {
          id: "m-r-3",
          createdAt: "2025-01-15T17:15:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "미션리뷰어2",
          channelId: "mission_user_003",
          channel: "",
          actionType: "2",
          missionType: "4",
          isRejected: true,
        },
        {
          id: "m-r-4",
          createdAt: "2025-01-15T17:45:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "미션인플루언서2",
          channelId: "mission_user_004",
          channel: "",
          actionType: "2",
          missionType: "1",
          isLate: true,
        },
        {
          id: "m-r-5",
          createdAt: "2025-01-15T18:10:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "미션리뷰어3",
          channelId: "mission_user_005",
          channel: "",
          actionType: "2",
          missionType: "4",
          isRejected: true,
        },
        {
          id: "m-r-6",
          createdAt: "2025-01-15T18:30:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "미션인플루언서3",
          channelId: "mission_user_006",
          channel: "",
          actionType: "2",
          missionType: "4",
          isRejected: true,
        },
      ],
      completed: [
        {
          id: "m-c-1",
          createdAt: "2025-01-13T09:00:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "미션완료리뷰어1",
          channelId: "mission_user_005",
          channel: "",
          actionType: "2",
          missionType: "7",
        },
        {
          id: "m-c-2",
          createdAt: "2025-01-13T10:00:00.000Z",
          status: "완료",
          userType: "인플루언서",
          nickname: "미션완료인플루언서1",
          channelId: "mission_user_006",
          channel: "",
          actionType: "2",
          missionType: "7",
          updatedAt: "2025-01-13T11:00:00.000Z",
        },
        {
          id: "m-c-3",
          createdAt: "2025-01-13T11:30:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "미션완료리뷰어2",
          channelId: "mission_user_007",
          channel: "",
          actionType: "2",
          missionType: "7",
          isLate: true,
        },
      ],
    },
  },

  // 진행 탭(진행 중) - 콘텐츠 있음 (2버튼 표시)
  {
    campaignInfo: {
      id: "965",
      title: "[진행] 미션형 새 테스트 캠페인",
      image: "/images/main/campaign_img/eximg_4.png",
      status: "진행 중" as const,
      campaignType: "미션형",
      category: "뷰티",
      brandName: "",
      recruitmentPeriod: "2025-10-25 ~ 2025-11-05",
      announcementDate: "2025-11-05",
      registrationPeriod: "2025-11-06 ~ 2025-11-14",
      recruitedCount: 7,
      totalCount: 12,
      daysLeft: 5,
      statusText: "캠페인 콘텐츠를 검수해 주세요.",
    },
    applicantData: { applicants: [], selectedApplicants: [] },
    // 콘텐츠 데이터: 각 캠페인 정보 아래에 콘텐츠 목록 포함
    // 설명: deliveryClosedCampaigns와 동일한 형태로, campaignInfo 아래에 contents를 포함합니다.
    // ID 965번 캠페인도 이미지+링크 확인 버튼 유형(actionType: 2)만 사용합니다.
    contents: {
      reviewing: [
        {
          id: "965-r-1",
          createdAt: "2025-11-03T10:00:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "965-검수-이미지+링크",
          channelId: "ms_965_r_1",
          channel: "",
          actionType: "2",
          missionType: "1",
        },
        {
          id: "965-r-2",
          createdAt: "2025-11-03T10:20:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "965-검수-이미지+링크",
          channelId: "ms_965_r_2",
          channel: "",
          actionType: "2",
          missionType: "1",
          updatedAt: "2025-11-03T10:40:00.000Z",
        },
        {
          id: "965-r-3",
          createdAt: "2025-11-03T10:35:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "965-검수-이미지+링크",
          channelId: "ms_965_r_3",
          channel: "",
          actionType: "2",
          missionType: "1",
        },
        {
          id: "965-r-4",
          createdAt: "2025-11-03T11:00:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "965-반려처리-이미지+링크",
          channelId: "ms_965_r_4",
          channel: "",
          actionType: "2",
          missionType: "4",
          isRejected: true,
        },
        {
          id: "965-r-5",
          createdAt: "2025-11-03T11:15:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "965-반려처리-이미지+링크",
          channelId: "ms_965_r_5",
          channel: "",
          actionType: "2",
          missionType: "4",
          isRejected: true,
        },
      ],
      completed: [
        {
          id: "965-c-1",
          createdAt: "2025-11-02T18:40:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "965-완료-이미지+링크",
          channelId: "ms_965_c_1",
          channel: "",
          actionType: "2",
          missionType: "7",
        },
        {
          id: "965-c-2",
          createdAt: "2025-11-02T19:00:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "965-완료-이미지+링크",
          channelId: "ms_965_c_2",
          channel: "",
          actionType: "2",
          missionType: "7",
          updatedAt: "2025-11-02T19:20:00.000Z",
        },
        {
          id: "965-c-3",
          createdAt: "2025-11-02T19:30:00.000Z",
          status: "완료",
          userType: "인플루언서",
          nickname: "965-완료-이미지+링크",
          channelId: "ms_965_c_3",
          channel: "",
          actionType: "2",
          missionType: "7",
          isLate: true,
        },
      ],
    },
  },

  // 신청 탭(모집 중)
  {
    campaignInfo: {
      id: "975",
      title: "[신청] 미션형 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_4.png",
      status: "모집 중" as const,
      campaignType: "미션형",
      category: "뷰티",
      brandName: "",
      recruitmentPeriod: "2025-11-05 ~ 2025-11-15",
      announcementDate: "2025-11-15",
      registrationPeriod: "2025-11-17 ~ 2025-11-25",
      recruitedCount: 0,
      totalCount: 10,
      daysLeft: 13,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },

  // 예정 탭(대기 중)
  {
    campaignInfo: {
      id: "954",
      title: "[예정] 미션형 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_4.png",
      status: "대기 중" as const,
      campaignType: "미션형",
      category: "뷰티",
      brandName: "",
      recruitmentPeriod: "2025-11-06 ~ 2025-11-16",
      announcementDate: "2025-11-16",
      registrationPeriod: "2025-11-18 ~ 2025-11-26",
      recruitedCount: 0,
      totalCount: 10,
      daysLeft: 8,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
];

/* ========================================
   🎯 미션형 (종료/취소) 콘텐츠 데이터
   - closedCampaigns.ts 병합용
   ======================================== */
export const missionClosedCampaigns: CampaignWithContents[] = [
  {
    campaignInfo: {
      id: "904",
      title: "[취소] 미션형 캠페인 - 이미지/링크",
      image: "/images/main/campaign_img/eximg_4.png",
      status: "취소",
      campaignType: "미션형",
      category: "뷰티",
      brandName: "",
      recruitmentPeriod: "2024-04-10 ~ 2024-04-16",
      announcementDate: "2024-04-16",
      registrationPeriod: "2024-04-18 ~ 2024-04-24",
      recruitedCount: 0,
      totalCount: 10,
      daysLeft: -5,
      statusText: "캠페인을 취소하였습니다.",
    },
    contents: {
      reviewing: [
        {
          id: "904-r-1",
          createdAt: "2025-10-28T09:05:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "미션-1",
          channelId: "ms_904_r_1",
          channel: "",
          actionType: "2",
          missionType: "1",
          updatedAt: "2025-10-28T09:20:00.000Z",
        },
        {
          id: "904-r-2",
          createdAt: "2025-10-28T09:15:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "미션-2",
          channelId: "ms_904_r_2",
          channel: "",
          actionType: "2",
          missionType: "4",
          isRejected: true,
        },
        {
          id: "904-r-3",
          createdAt: "2025-10-28T09:25:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "미션-3",
          channelId: "ms_904_r_3",
          channel: "",
          actionType: "2",
          missionType: "1",
        },
        {
          id: "904-r-4",
          createdAt: "2025-10-28T09:35:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "미션-4",
          channelId: "ms_904_r_4",
          channel: "",
          actionType: "2",
          missionType: "1",
          isLate: true,
        },
      ],
      completed: [
        {
          id: "904-c-1",
          createdAt: "2025-10-27T17:30:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "미션-4",
          channelId: "ms_904_c_1",
          channel: "",
          actionType: "2",
          missionType: "7",
          updatedAt: "2025-10-27T17:50:00.000Z",
        },
        {
          id: "904-c-2",
          createdAt: "2025-10-27T17:45:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "미션-5",
          channelId: "ms_904_c_2",
          channel: "",
          actionType: "2",
          missionType: "7",
        },
        {
          id: "904-c-3",
          createdAt: "2025-10-27T18:00:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "미션-6",
          channelId: "ms_904_c_3",
          channel: "",
          actionType: "2",
          missionType: "7",
          isLate: true,
        },
        {
          id: "904-c-4",
          createdAt: "2025-10-27T18:15:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "미션-7",
          channelId: "ms_904_c_4",
          channel: "",
          actionType: "2",
          missionType: "7",
        },
        {
          id: "904-c-5",
          createdAt: "2025-10-27T18:30:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "미션-8",
          channelId: "ms_904_c_5",
          channel: "",
          actionType: "2",
          missionType: "7",
        },
      ],
    },
  },
];

/* ========================================
   🎯 미션형 콘텐츠 조회 함수
   - 진행 중인 캠페인의 콘텐츠 데이터를 조회합니다
   ======================================== */

/**
 * 미션형 캠페인의 콘텐츠 데이터를 조회하는 함수
 *
 * 설명:
 * - 캠페인 ID를 받아서 해당 캠페인의 콘텐츠(검수 중/완료)를 반환합니다.
 * - 종료/취소된 캠페인은 getClosedContentsById 함수를 사용합니다.
 * - 진행 중인 캠페인은 missionCampaigns 배열에서 해당 ID를 찾아 contents를 반환합니다.
 * - 각 캠페인 데이터가 campaignInfo 아래에 contents를 포함하는 구조입니다.
 *
 * 반환 타입: ContentByTab
 * - reviewing: 검수 중인 콘텐츠 배열
 * - completed: 완료된 콘텐츠 배열
 *
 * 학습 포인트:
 * - 함수 매개변수: campaignId (캠페인 ID)
 * - 조건부 반환: if 문으로 특정 ID에 대한 처리
 * - 배열 메서드: find() 메서드로 배열에서 특정 조건의 요소를 찾습니다.
 * - 옵셔널 체이닝: ?. 연산자로 안전하게 속성에 접근합니다.
 * - 널 병합 연산자: ?? 연산자로 기본값을 제공합니다.
 *
 * @param campaignId - 조회할 캠페인의 ID
 * @returns 검수 중/완료된 콘텐츠를 담은 객체
 */
export function getMissionContentsById(campaignId: string): ContentByTab {
  // 종료/취소 탭 데이터(미션형): 904 매핑
  // 설명: 종료/취소된 캠페인은 missionClosedCampaigns를 직접 참조 (순환 참조 방지)
  if (campaignId === "904") {
    const closedCampaign = missionClosedCampaigns.find(
      (c) => c.campaignInfo.id === campaignId
    );
    if (closedCampaign?.contents) {
      return closedCampaign.contents;
    }
    return { reviewing: [], completed: [] };
  }

  // 진행 중인 캠페인의 콘텐츠 조회
  // 설명: missionCampaigns 배열에서 해당 ID의 캠페인을 찾아서 contents를 반환합니다.
  // find() 메서드: 배열에서 조건에 맞는 첫 번째 요소를 반환합니다.
  const campaign = missionCampaigns.find(
    (c) => c.campaignInfo.id === campaignId
  );

  // 캠페인을 찾았고 contents가 있으면 반환
  // 옵셔널 체이닝(?.)과 널 병합 연산자(??)를 사용해 안전하게 값을 가져옵니다.
  if (campaign?.contents) {
    return campaign.contents;
  }

  // 콘텐츠가 없는 경우 빈 배열 반환
  // 설명: 진행 중이지만 아직 콘텐츠가 업로드되지 않은 경우입니다.
  return { reviewing: [], completed: [] };
}

/* ========================================
   🎯 미션형 캠페인 등록 함수
   - 폼 데이터를 CampaignWithApplicants 형태로 변환
   ======================================== */

/**
 * 새 미션형 캠페인 ID 생성
 *
 * @returns 새로운 캠페인 ID (기존 ID 중 최대값 + 1)
 */
function generateNewMissionCampaignId(): string {
  // 기존 캠페인 ID 중 최대값 찾기
  const existingIds = missionCampaigns
    .map((c) => parseInt(c.campaignInfo.id))
    .filter((id) => !isNaN(id));
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 15;

  return String(maxId + 1);
}

/**
 * 폼 데이터를 CampaignWithApplicants 형태로 변환하여 새 미션형 캠페인 생성
 *
 * 설명:
 * - 미션형 캠페인 등록 폼에서 입력한 데이터를 missionCampaigns 구조에 맞게 변환합니다.
 * - 새 캠페인 ID를 자동 생성합니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL (첫 번째 이미지 사용)
 * @returns 새로 생성된 CampaignWithApplicants 객체
 */
export function createMissionCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_4.png"
): CampaignWithApplicants {
  // 새 캠페인 ID 생성
  const newId = generateNewMissionCampaignId();

  // 선정 날짜까지 남은 일수 계산
  const daysLeft = formData.announcementDate
    ? calculateDaysLeft(formData.announcementDate.split(" ")[0])
    : 0;

  // 모집 인원을 숫자로 변환
  const totalCount = Number(formData.recruitmentCount) || 0;

  // 캠페인 상태 결정 함수 호출
  const campaignStatus = calculateCampaignStatus(
    formData.recruitmentPeriod,
    formData.announcementDate
  );

  // 미션형은 플랫폼이 없으므로 빈 문자열 사용
  const normalizedBrandName = "";

  return {
    campaignInfo: {
      id: newId,
      title: formData.title,
      image: imageUrl,
      status: campaignStatus,
      campaignType: "미션형",
      category: formData.category || "기타",
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod,
      announcementDate: formData.announcementDate,
      registrationPeriod: formData.registrationPeriod,
      recruitedCount: 0,
      totalCount: totalCount,
      daysLeft: daysLeft,
    },
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
  };
}

/**
 * 미션형 캠페인 수정
 *
 * 설명:
 * - 기존 미션형 캠페인을 수정합니다.
 * - 캠페인 ID는 유지하고, 나머지 정보만 업데이트합니다.
 * - 신청자 데이터는 유지합니다.
 *
 * @param campaignId - 수정할 캠페인 ID
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 수정된 CampaignWithApplicants 객체
 */
export function updateMissionCampaign(
  campaignId: string,
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_4.png"
): CampaignWithApplicants {
  // 기존 캠페인 데이터 찾기
  const existingCampaign = missionCampaigns.find(
    (c) => c.campaignInfo.id === campaignId
  );

  // 기존 신청자 데이터 유지
  const existingApplicantData = existingCampaign?.applicantData || {
    applicants: [],
    selectedApplicants: [],
  };

  // 선정 날짜까지 남은 일수 계산
  const daysLeft = formData.announcementDate
    ? calculateDaysLeft(formData.announcementDate.split(" ")[0])
    : 0;

  // 모집 인원을 숫자로 변환
  const totalCount = Number(formData.recruitmentCount) || 0;

  // 캠페인 상태 결정 함수 호출
  const campaignStatus = calculateCampaignStatus(
    formData.recruitmentPeriod,
    formData.announcementDate
  );

  // 미션형은 플랫폼이 없으므로 빈 문자열 사용
  const normalizedBrandName = "";

  return {
    campaignInfo: {
      id: campaignId, // 기존 ID 유지
      title: formData.title,
      image: imageUrl,
      status: campaignStatus,
      campaignType: "미션형",
      category: formData.category || "기타",
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod,
      announcementDate: formData.announcementDate,
      registrationPeriod: formData.registrationPeriod,
      recruitedCount: existingCampaign?.campaignInfo.recruitedCount || 0, // 기존 신청자 수 유지
      totalCount: totalCount,
      daysLeft: daysLeft,
    },
    applicantData: existingApplicantData, // 기존 신청자 데이터 유지
  };
}

/**
 * 새 미션형 캠페인을 missionCampaigns 배열에 추가
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 CampaignWithApplicants 객체
 */
export function addMissionCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_4.png"
): CampaignWithApplicants {
  return createMissionCampaign(formData, imageUrl);
}
