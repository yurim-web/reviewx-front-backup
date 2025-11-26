/* ========================================
   📰 기자단 캠페인 데이터 타입 정의
   ======================================== */

/**
 * 기자단 캠페인 데이터 타입 정의
 *
 * 이 파일에서 사용하는 모든 기자단 캠페인 데이터의 타입을 정의합니다.
 * 공통 타입은 sharedCampaigns.ts에서 import하여 사용합니다.
 */

import type { CampaignWithApplicants } from "./campaign_application/delivery_applicants";
import type { ContentByTab } from "./sharedCampaigns";
import { CampaignFormData } from "@/types/user/user";
import { calculateCampaignStatus, calculateDaysLeft } from "./delivery";

/**
 * 기자단 캠페인 통합 데이터 구조
 *
 * 기자단 캠페인의 모든 상태(종료/취소/진행/예정/신청)를 하나의 구조로 통일합니다.
 * 진행/예정/신청 캠페인: campaignInfo + applicantData (필수) + contents (선택)
 */
export interface ReporterCampaignDataItem {
  campaignInfo: {
    id: string; // 캠페인 고유 식별자
    title: string; // 캠페인 제목
    image: string; // 메인 캠페인 이미지 경로
    status: "진행 중" | "대기 중" | "모집 중" | "종료" | "취소"; // 캠페인 상태 (모든 상태 포함)
    campaignType: "기자단"; // 캠페인 타입 (기자단 고정)
    category: string; // 캠페인 카테고리 (생활, 뷰티 등)
    brandName: string; // 브랜드명 (플랫폼명)
    recruitmentPeriod: string; // 모집 기간 (예: "2025-10-20 ~ 2025-11-02")
    announcementDate: string; // 선정 발표일 (예: "2025-11-03")
    registrationPeriod: string; // 등록 기간 (예: "2025-11-04 ~ 2025-11-12")
    recruitedCount: number; // 현재 모집된 인원 수 (자동 계산됨)
    totalCount: number; // 총 모집 인원 수
    daysLeft: number; // 남은 일수 (양수면 남은 일수, 음수면 지난 일수)
    statusText?: string; // 상태 텍스트 (예: "캠페인 콘텐츠를 검수해 주세요.", 선택사항)
    partnerName?: string; // 파트너명 (예: "(주)기자단커뮤니케이션")
  };
  // 신청자 데이터 (선택사항 - 진행/예정/신청 캠페인에만 있음)
  applicantData?: {
    applicants: Array<{
      id: string; // 신청자 고유 식별자
      Id: string; // 신청자 내부 ID
      nickname: string; // 신청자 닉네임
      userType: "리뷰어" | "인플루언서"; // 사용자 타입
      profileImage: string; // 프로필 이미지 경로
      memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한"; // 회원 타입
      followers: number; // 팔로워 수 (기자단 전용)
      memo: string; // 메모
      selectionStatus: "미선택" | "선정하기" | "이용제한 계정"; // 선정 상태
      channel: string; // 채널 정보 (인스타그램, 네이버블로그 등)
      registrationDate?: string; // 등록일 (선택사항)
    }>;
    selectedApplicants: Array<{
      id: string; // 선정된 신청자 고유 식별자
      Id: string; // 선정된 신청자 내부 ID
      nickname: string; // 신청자 닉네임
      userType: "리뷰어" | "인플루언서"; // 사용자 타입
      profileImage: string; // 프로필 이미지 경로
      memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한"; // 회원 타입
      followers: number; // 팔로워 수 (기자단 전용)
      memo: string; // 메모
      selectionStatus: "선정하기"; // 선정 상태 (선정된 신청자는 "선정하기" 고정)
      channel: string; // 채널 정보 (인스타그램, 네이버블로그 등)
      registrationDate?: string; // 등록일 (선택사항)
    }>;
  };
  // 콘텐츠 데이터 (선택사항 - 진행/예정/신청 캠페인에는 선택)
  contents?: {
    reviewing: Array<{
      id: string; // 콘텐츠 고유 식별자
      createdAt: string; // 생성일시 (ISO 8601 형식)
      status: "검수"; // 콘텐츠 상태
      userType: "리뷰어" | "인플루언서"; // 사용자 타입
      nickname: string; // 작성자 닉네임
      channelId: string; // 채널 식별자
      channel: string; // 채널명
      updatedAt?: string; // 수정일시 (선택사항)
      isRejected?: boolean; // 거절 여부 (선택사항)
      isLate?: boolean; // 지연 여부 (선택사항)
    }>;
    completed: Array<{
      id: string; // 콘텐츠 고유 식별자
      createdAt: string; // 생성일시 (ISO 8601 형식)
      status: "완료"; // 콘텐츠 상태
      userType: "리뷰어" | "인플루언서"; // 사용자 타입
      nickname: string; // 작성자 닉네임
      channelId: string; // 채널 식별자
      channel: string; // 채널명
      updatedAt?: string; // 수정일시 (선택사항)
      isLate?: boolean; // 지연 여부 (선택사항)
    }>;
  };
}

/**
 * 기자단 캠페인 진행/예정/신청 데이터 타입
 *
 * 진행 중, 예정, 신청 중인 기자단 캠페인의 데이터 구조입니다.
 * ReporterCampaignDataItem[] 타입을 사용하여 통일된 구조로 관리합니다.
 */
export type ReporterCampaignData = ReporterCampaignDataItem[];

/* ========================================
   📰 기자단 캠페인 데이터 (캠페인 info + 신청 카드 + 콘텐츠)
   - sharedCampaigns.ts에서 타입별 데이터 분리
   - ReporterCampaignDataItem 인터페이스로 통일된 구조 사용
   ======================================== */

export const reporterCampaigns: ReporterCampaignDataItem[] = [
  // 기자단 캠페인 (모집/대기)
  {
    campaignInfo: {
      id: "201",
      title: "[기자단] 라이프스타일 브랜드 스토리 취재",
      image: "/images/main/campaign_img/eximg_8.png",
      status: "모집 중",
      campaignType: "기자단",
      category: "생활",
      brandName: "인스타그램",
      partnerName: "(주)기자단커뮤니케이션",
      recruitmentPeriod: "2025-10-20 ~ 2025-11-02",
      announcementDate: "2025-11-03",
      registrationPeriod: "2025-11-04 ~ 2025-11-12",
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 10,
      daysLeft: 4,
    },
    applicantData: {
      applicants: [
        {
          id: "rep_blog_201_001",
          Id: "rep_blog_user_201_001",
          nickname: "스토리블로거",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          followers: 1700,
          memo: "브랜드 스토리텔링 특화",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
        {
          id: "rep_clip_201_001",
          Id: "rep_clip_user_201_001",
          nickname: "클립저널",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          followers: 17500,
          memo: "하이라이트 클립 제작",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
        {
          id: "rep_insta_201_001",
          Id: "rep_insta_user_201_001",
          nickname: "라이프스타그",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 38000,
          memo: "브랜드 무드 촬영 강점",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
        {
          id: "rep_yt_201_001",
          Id: "rep_yt_user_201_001",
          nickname: "저널튜버",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 52000,
          memo: "브랜드 인터뷰 형식 콘텐츠",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
      ],
      selectedApplicants: [
        {
          id: "rep_sel_blog_201_001",
          Id: "rep_blog_user_201_002",
          nickname: "선정블로거",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          followers: 2400,
          memo: "문장력과 사진 퀄리티 우수",
          selectionStatus: "선정하기",
          channel: "인스타그램",
        },
      ],
    },
  },
  {
    campaignInfo: {
      id: "202",
      title: "[기자단] 테크 기기 심층 리뷰 스토리",
      image: "/images/main/campaign_img/eximg_9.png",
      status: "대기 중",
      campaignType: "기자단",
      category: "생활",
      brandName: "릴스",
      partnerName: "(주)기자단커뮤니케이션",
      recruitmentPeriod: "2025-11-01 ~ 2025-11-10",
      announcementDate: "2025-11-11",
      registrationPeriod: "2025-11-12 ~ 2025-11-20",
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 8,
      daysLeft: 12,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },

  // 진행 탭(진행 중) - 콘텐츠 있음 (2버튼 표시)
  {
    campaignInfo: {
      id: "962",
      title: "[진행+콘텐츠] 기자단 진행 중",
      image: "/images/main/campaign_img/eximg_8.png",
      status: "진행 중" as const,
      campaignType: "기자단",
      category: "생활",
      brandName: "인스타그램",
      partnerName: "(주)기자단커뮤니케이션",
      recruitmentPeriod: "2025-10-18 ~ 2025-10-28",
      announcementDate: "2025-10-28",
      registrationPeriod: "2025-10-30 ~ 2025-11-06",
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 10,
      daysLeft: 2,
      statusText: "캠페인 콘텐츠를 검수해 주세요.",
    },
    applicantData: {
      applicants: [
        {
          id: "rep_962_insta_001",
          Id: "rep_962_user_001",
          nickname: "라이프스타일리뷰어",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          followers: 18500,
          memo: "라이프스타일 브랜드 스토리 전문",
          selectionStatus: "미선택",
          channel: "인스타그램",
          registrationDate: "2025-10-20",
        },
        {
          id: "rep_962_insta_002",
          Id: "rep_962_user_002",
          nickname: "브랜드스토리러버",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 42000,
          memo: "브랜드 스토리 취재 전문",
          selectionStatus: "미선택",
          channel: "인스타그램",
          registrationDate: "2025-10-21",
        },
        {
          id: "rep_962_insta_003",
          Id: "rep_962_user_003",
          nickname: "스토리텔러",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          followers: 12500,
          memo: "스토리텔링 전문 리뷰어",
          selectionStatus: "미선택",
          channel: "인스타그램",
          registrationDate: "2025-10-22",
        },
        {
          id: "rep_962_insta_004",
          Id: "rep_962_user_004",
          nickname: "브랜드스토리인플루언서",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 68000,
          memo: "라이프스타일 브랜드 콘텐츠 전문",
          selectionStatus: "미선택",
          channel: "인스타그램",
          registrationDate: "2025-10-23",
        },
        {
          id: "rep_962_insta_005",
          Id: "rep_962_user_005",
          nickname: "스토리컬렉터",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          followers: 21000,
          memo: "브랜드 스토리 수집 및 리뷰",
          selectionStatus: "미선택",
          channel: "인스타그램",
          registrationDate: "2025-10-24",
        },
      ],
      selectedApplicants: [
        {
          id: "rep_962_sel_insta_001",
          Id: "rep_962_user_002",
          nickname: "브랜드스토리러버",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 42000,
          memo: "브랜드 스토리 취재 전문, 선정 완료",
          selectionStatus: "선정하기",
          channel: "인스타그램",
          registrationDate: "2025-10-21",
        },
        {
          id: "rep_962_sel_insta_002",
          Id: "rep_962_user_004",
          nickname: "브랜드스토리인플루언서",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 68000,
          memo: "라이프스타일 브랜드 콘텐츠 전문, 선정 완료",
          selectionStatus: "선정하기",
          channel: "인스타그램",
          registrationDate: "2025-10-23",
        },
        {
          id: "rep_962_sel_insta_003",
          Id: "rep_962_user_001",
          nickname: "라이프스타일리뷰어",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          followers: 18500,
          memo: "라이프스타일 브랜드 스토리 전문, 선정 완료",
          selectionStatus: "선정하기",
          channel: "인스타그램",
          registrationDate: "2025-10-20",
        },
      ],
    },
    // 콘텐츠 데이터: 각 캠페인 정보 아래에 콘텐츠 목록 포함
    // 설명: deliveryClosedCampaigns와 동일한 형태로, campaignInfo 아래에 contents를 포함합니다.
    contents: {
      reviewing: [
        {
          id: "rp-r-1",
          createdAt: "2025-01-15T13:00:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "기자단리뷰어1",
          channelId: "reporter_001",
          channel: "네이버블로그",
        },
        {
          id: "rp-r-2",
          createdAt: "2025-01-15T13:40:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "기자단인플루언서1",
          channelId: "reporter_002",
          channel: "인스타그램",
          updatedAt: "2025-01-15T14:10:00.000Z",
        },
        {
          id: "rp-r-3",
          createdAt: "2025-01-15T14:50:00.000Z",
          status: "검수",
          userType: "리뷰어",
          nickname: "기자단리뷰어2",
          channelId: "reporter_003",
          channel: "네이버블로그",
          isRejected: true,
        },
        {
          id: "rp-r-4",
          createdAt: "2025-01-15T15:30:00.000Z",
          status: "검수",
          userType: "인플루언서",
          nickname: "기자단인플루언서2",
          channelId: "reporter_004",
          channel: "인스타그램",
          isLate: true,
        },
      ],
      completed: [
        {
          id: "rp-c-1",
          createdAt: "2025-01-11T09:00:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "기자단완료리뷰어1",
          channelId: "reporter_005",
          channel: "네이버블로그",
        },
        {
          id: "rp-c-2",
          createdAt: "2025-01-11T10:30:00.000Z",
          status: "완료",
          userType: "인플루언서",
          nickname: "기자단완료인플루언서1",
          channelId: "reporter_006",
          channel: "인스타그램",
          updatedAt: "2025-01-11T11:00:00.000Z",
        },
        {
          id: "rp-c-3",
          createdAt: "2025-01-11T11:45:00.000Z",
          status: "완료",
          userType: "리뷰어",
          nickname: "기자단완료리뷰어2",
          channelId: "reporter_007",
          channel: "네이버블로그",
          isLate: true,
        },
      ],
    },
  },

  // 신청 탭(모집 중)
  {
    campaignInfo: {
      id: "974",
      title: "[신청] 기자단 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_8.png",
      status: "모집 중" as const,
      campaignType: "기자단",
      category: "생활",
      brandName: "인스타그램",
      partnerName: "(주)기자단커뮤니케이션",
      recruitmentPeriod: "2025-11-04 ~ 2025-11-14",
      announcementDate: "2025-11-14",
      registrationPeriod: "2025-11-16 ~ 2025-11-24",
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 10,
      daysLeft: 12,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
];

/* ========================================
   📊 신청자 수 자동 계산 로직
   - 각 캠페인의 recruitedCount를 applicantData.applicants 배열 길이로 자동 설정
   - 데이터 일관성을 유지하기 위해 배열 정의 직후 실행됩니다
   ======================================== */

/**
 * reporterCampaigns 배열의 각 캠페인에 대해 recruitedCount를 자동 계산합니다
 *
 * 설명:
 * - 각 캠페인의 applicantData.applicants 배열의 길이를 계산하여
 *   campaignInfo.recruitedCount에 자동으로 설정합니다.
 * - 이렇게 하면 신청자 데이터를 추가/제거할 때마다 수동으로 숫자를 맞출 필요가 없습니다.
 */
reporterCampaigns.forEach((campaign) => {
  // 각 캠페인의 신청자 배열 길이를 계산하여 recruitedCount에 설정
  // 설명: applicantData.applicants가 undefined일 수 있으므로 옵셔널 체이닝(?.)과 널 병합 연산자(??)를 사용
  // applicants가 없으면 빈 배열([])로 간주하고, 그 길이는 0이 됩니다
  campaign.campaignInfo.recruitedCount =
    campaign.applicantData?.applicants?.length ?? 0;
});

/* ========================================
   📰 기자단 콘텐츠 조회 함수
   - 진행 중인 캠페인의 콘텐츠 데이터를 조회합니다
   ======================================== */

/**
 * 기자단 캠페인의 콘텐츠 데이터를 조회하는 함수
 *
 * 설명:
 * - 캠페인 ID를 받아서 해당 캠페인의 콘텐츠(검수 중/완료)를 반환합니다.
 * - 진행 중인 캠페인은 reporterCampaigns 배열에서 해당 ID를 찾아 contents를 반환합니다.
 * - 각 캠페인 데이터가 campaignInfo 아래에 contents를 포함하는 구조입니다.
 *
 * 반환 타입: ContentByTab
 * - reviewing: 검수 중인 콘텐츠 배열
 * - completed: 완료된 콘텐츠 배열
 *
 * 학습 포인트:
 * - 함수 매개변수: campaignId (캠페인 ID)
 * - 배열 메서드: find() 메서드로 배열에서 특정 조건의 요소를 찾습니다.
 * - 옵셔널 체이닝: ?. 연산자로 안전하게 속성에 접근합니다.
 *
 * @param campaignId - 조회할 캠페인의 ID
 * @returns 검수 중/완료된 콘텐츠를 담은 객체
 */
export function getReporterContentsById(campaignId: string): ContentByTab {
  // 진행 중인 캠페인의 콘텐츠 조회
  // 설명: reporterCampaigns 배열에서 해당 ID의 캠페인을 찾아서 contents를 반환합니다.
  // find() 메서드: 배열에서 조건에 맞는 첫 번째 요소를 반환합니다.
  const campaign = reporterCampaigns.find(
    (c) => c.campaignInfo.id === campaignId
  );

  // 캠페인을 찾았고 contents가 있으면 반환
  // 옵셔널 체이닝(?.)을 사용해 안전하게 값을 가져옵니다.
  if (campaign?.contents) {
    return campaign.contents;
  }

  // 콘텐츠가 없는 경우 빈 배열 반환
  // 설명: 진행 중이지만 아직 콘텐츠가 업로드되지 않은 경우입니다.
  return { reviewing: [], completed: [] };
}

/* ========================================
   📰 기자단 캠페인 등록 함수
   - 폼 데이터를 CampaignWithApplicants 형태로 변환
   ======================================== */

/**
 * 새 기자단 캠페인 ID 생성
 *
 * @returns 새로운 캠페인 ID (기존 ID 중 최대값 + 1)
 */
function generateNewReporterCampaignId(): string {
  // 기존 캠페인 ID 중 최대값 찾기
  const existingIds = reporterCampaigns
    .map((c) => parseInt(c.campaignInfo.id))
    .filter((id) => !isNaN(id));
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 200;

  return String(maxId + 1);
}

/**
 * 폼 데이터를 ReporterCampaignDataItem 형태로 변환하여 새 기자단 캠페인 생성
 *
 * 설명:
 * - 기자단 캠페인 등록 폼에서 입력한 데이터를 reporterCampaigns 구조에 맞게 변환합니다.
 * - 새 캠페인 ID를 자동 생성합니다.
 * - ReporterCampaignDataItem 인터페이스를 사용하여 통일된 구조로 생성합니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL (첫 번째 이미지 사용)
 * @returns 새로 생성된 ReporterCampaignDataItem 객체 (CampaignWithApplicants와 호환됨)
 */
export function createReporterCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_8.png"
): ReporterCampaignDataItem {
  // 새 캠페인 ID 생성
  const newId = generateNewReporterCampaignId();

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

  // 플랫폼명 정규화 (공백 제거하여 로고 매핑 일치시키기)
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, "")
    : "기본";

  return {
    campaignInfo: {
      id: newId,
      title: formData.title,
      image: imageUrl,
      status: campaignStatus,
      campaignType: "기자단",
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
 * 기자단 캠페인 수정
 *
 * 설명:
 * - 기존 기자단 캠페인을 수정합니다.
 * - 캠페인 ID는 유지하고, 나머지 정보만 업데이트합니다.
 * - 신청자 데이터는 유지합니다.
 * - ReporterCampaignDataItem 인터페이스를 사용하여 통일된 구조로 반환합니다.
 *
 * @param campaignId - 수정할 캠페인 ID
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 수정된 ReporterCampaignDataItem 객체 (CampaignWithApplicants와 호환됨)
 */
export function updateReporterCampaign(
  campaignId: string,
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_8.png"
): ReporterCampaignDataItem {
  // 기존 캠페인 데이터 찾기
  const existingCampaign = reporterCampaigns.find(
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

  // 플랫폼명 정규화 (공백 제거하여 로고 매핑 일치시키기)
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, "")
    : "기본";

  return {
    campaignInfo: {
      id: campaignId, // 기존 ID 유지
      title: formData.title,
      image: imageUrl,
      status: campaignStatus,
      campaignType: "기자단",
      category: formData.category || "기타",
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod,
      announcementDate: formData.announcementDate,
      registrationPeriod: formData.registrationPeriod,
      recruitedCount: existingApplicantData?.applicants?.length ?? 0, // 자동 계산 (applicantData.applicants.length)
      totalCount: totalCount,
      daysLeft: daysLeft,
    },
    applicantData: existingApplicantData, // 기존 신청자 데이터 유지
  };
}

/**
 * 새 기자단 캠페인을 reporterCampaigns 배열에 추가
 *
 * 설명:
 * - ReporterCampaignDataItem 인터페이스를 사용하여 통일된 구조로 캠페인을 생성합니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 ReporterCampaignDataItem 객체 (CampaignWithApplicants와 호환됨)
 */
export function addReporterCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_8.png"
): ReporterCampaignDataItem {
  return createReporterCampaign(formData, imageUrl);
}
