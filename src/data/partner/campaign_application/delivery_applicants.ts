/* ========================================
   📦 배송형 캠페인 신청/선정 데이터 (채널 무관)
   ======================================== */

import { CampaignInfo } from "@/components/partner/campaign_details/CampaignInfoBox";

// 신청자 데이터 타입 정의
export interface Applicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한";
  dailyVisits: number;
  totalVisits: number;
  neighbors: number;
  memo: string;
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정" | "검수중" | "완료";
  channel: "네이버블로그" | "네이버클립" | "인스타그램" | "유튜브" | "기본";
  registrationDate?: string;
}

/** 네이버 클립 신청자 타입 (팔로워 수 보유) */
export interface NaverClipApplicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한";
  followers: number;
  memo: string;
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정" | "검수중" | "완료";
  channel: "네이버클립";
  registrationDate?: string;
}

/** 인스타그램 신청자 타입 (팔로워 수 보유) */
export interface InstagramApplicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한";
  followers: number;
  memo: string;
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정" | "검수중" | "완료";
  channel: "인스타그램";
  registrationDate?: string;
}

/** 유튜브 신청자 타입 (구독자 수 보유) */
export interface YoutubeApplicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한";
  subscribers: number; // 구독자 수
  memo: string;
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정" | "검수중" | "완료";
  channel: "유튜브";
  registrationDate?: string;
}

/** 캠페인 정보 */
export const mockCampaignInfo: CampaignInfo = {
  id: "1",
  title:
    "나만의 향수만들기 체험 [그리디센트] 나만의 향수만들기 체험 [그리디센트]나만의 향수만들기 체험 [그리디센트]나만의 향수만들기 체험 [그리디센트]나만의 향수만들기 체험 [그리디센트]나만의 향수만들기 체험 [그리디센트]나만의 향수만들기 체험 [그리디센트]",
  image: "/images/main/campaign_img/eximg_1.png",
  status: "모집 중",
  category: "배송형",
  brandName: "네이버클립",
  recruitmentPeriod: "2025-09-02 ~ 2025-09-14",
  announcementDate: "2025-09-16",
  registrationPeriod: "2025-09-22 ~ 2025-09-30",
  recruitedCount: 20,
  totalCount: 100,
  daysLeft: 30,
};

/* ========================================
   📋 신청 탭 데이터 (미선택 + 이용제한 신청자들)
   ======================================== */
export const mockApplicants: Applicant[] = [
  {
    id: "app1",
    Id: "reviewer001",
    nickname: "배송리뷰어1",
    userType: "리뷰어",
    profileImage: "",
    memberType: "모범 회원",
    dailyVisits: 135,
    totalVisits: 526000,
    neighbors: 1031,
    memo: "",
    selectionStatus: "미선택",
    channel: "네이버블로그",
  },
  {
    id: "app2",
    Id: "influencer001",
    nickname: "배송인플루언서1",
    userType: "인플루언서",
    profileImage: "",
    memberType: "주의 회원",
    dailyVisits: 200,
    totalVisits: 800000,
    neighbors: 2500,
    memo: "안녕하세요 :) 무상으로 서비스를 제공해주시는만큼 감사히 사용하겠습니다.",
    selectionStatus: "미선택",
    channel: "네이버블로그",
  },
  {
    id: "app3",
    Id: "reviewer002",
    nickname: "배송리뷰어2",
    userType: "리뷰어",
    profileImage: "",
    memberType: "경고 회원",
    dailyVisits: 50,
    totalVisits: 100000,
    neighbors: 200,
    memo: "배송형 제품에 대한 경험이 많습니다.",
    selectionStatus: "이용제한 계정",
    channel: "기본",
  },
  {
    id: "app4",
    Id: "reviewer003",
    nickname: "배송리뷰어3",
    userType: "리뷰어",
    profileImage: "",
    memberType: "모범 회원",
    dailyVisits: 180,
    totalVisits: 650000,
    neighbors: 1500,
    memo: "배송형 체험 리뷰를 꼼꼼하게 작성하겠습니다.",
    selectionStatus: "미선택",
    channel: "네이버클립",
  },
];

/* ========================================
   ✅ 선정 탭 데이터 (선정된 신청자들)
   ======================================== */
export const mockSelectedApplicants: Applicant[] = [
  {
    id: "sel1",
    Id: "selected001",
    nickname: "배송선정자1",
    userType: "리뷰어",
    profileImage: "",
    memberType: "모범 회원",
    dailyVisits: 250,
    totalVisits: 950000,
    neighbors: 2200,
    memo: "선정되어 기쁩니다! 좋은 리뷰 작성하겠습니다.",
    selectionStatus: "선정하기",
    channel: "기본",
  },
  {
    id: "sel2",
    Id: "selected002",
    nickname: "배송선정자2",
    userType: "인플루언서",
    profileImage: "",
    memberType: "주의 회원",
    dailyVisits: 320,
    totalVisits: 1200000,
    neighbors: 3800,
    memo: "감사합니다. 홍보를 위해 최선을 다하겠습니다.",
    selectionStatus: "선정하기",
    channel: "네이버블로그",
  },
];

/* ========================================
   🎬 네이버 클립 신청/선정 데이터
   ======================================== */
export const mockNaverClipApplicants: NaverClipApplicant[] = [
  {
    id: "nc1",
    Id: "naverclip001",
    nickname: "클립리뷰어1",
    userType: "리뷰어",
    profileImage: "",
    memberType: "모범 회원",
    followers: 122838,
    memo: "이쁜 사진으로 보답 드리겠습니다!!",
    selectionStatus: "미선택",
    channel: "네이버클립",
  },
  {
    id: "nc2",
    Id: "naverclip002",
    nickname: "클립인플루언서1",
    userType: "인플루언서",
    profileImage: "",
    memberType: "주의 회원",
    followers: 450000,
    memo: "네이버 클립에서 활발하게 활동하고 있습니다. 좋은 콘텐츠로 보답하겠습니다!",
    selectionStatus: "미선택",
    channel: "네이버클립",
  },
  {
    id: "nc3",
    Id: "naverclip003",
    nickname: "클립리뷰어2",
    userType: "리뷰어",
    profileImage: "",
    memberType: "경고 회원",
    followers: 50000,
    memo: "클립 영상 제작 경험이 풍부합니다.",
    selectionStatus: "이용제한 계정",
    channel: "네이버클립",
  },
  {
    id: "nc4",
    Id: "naverclip004",
    nickname: "클립크리에이터",
    userType: "인플루언서",
    profileImage: "",
    memberType: "모범 회원",
    followers: 890000,
    memo: "감사합니다. 최고의 클립으로 보답하겠습니다!",
    selectionStatus: "미선택",
    channel: "네이버클립",
  },
  {
    id: "nc5",
    Id: "naverclip005",
    nickname: "클립리뷰어3",
    userType: "리뷰어",
    profileImage: "",
    memberType: "주의 회원",
    followers: 156000,
    memo: "정성스럽게 리뷰하겠습니다.",
    selectionStatus: "미선택",
    channel: "네이버클립",
  },
];

export const mockNaverClipSelectedApplicants: NaverClipApplicant[] = [
  {
    id: "ncs1",
    Id: "naverclip_selected001",
    nickname: "클립선정자1",
    userType: "인플루언서",
    profileImage: "",
    memberType: "모범 회원",
    followers: 320000,
    memo: "선정해주셔서 감사합니다! 최고의 클립으로 보답하겠습니다.",
    selectionStatus: "선정하기",
    channel: "네이버클립",
  },
  {
    id: "ncs2",
    Id: "naverclip_selected002",
    nickname: "클립선정자2",
    userType: "리뷰어",
    profileImage: "",
    memberType: "주의 회원",
    followers: 180000,
    memo: "감사합니다. 정성스럽게 리뷰하겠습니다.",
    selectionStatus: "선정하기",
    channel: "네이버클립",
  },
];

/* ========================================
   📸 인스타그램 신청/선정 데이터
   ======================================== */
export const mockInstagramApplicants: InstagramApplicant[] = [
  {
    id: "ig1",
    Id: "insta001",
    nickname: "인스타리뷰어인데닉네임이너무길어",
    userType: "리뷰어",
    profileImage: "",
    memberType: "모범 회원",
    followers: 122838,
    memo: "이쁜 사진으로 보답 드리겠습니다!!",
    selectionStatus: "미선택",
    channel: "인스타그램",
  },
  {
    id: "ig2",
    Id: "insta002",
    nickname: "인스타인플루언서1",
    userType: "인플루언서",
    profileImage: "",
    memberType: "주의 회원",
    followers: 450000,
    memo: "인스타그램에서 활발하게 활동 중입니다!",
    selectionStatus: "미선택",
    channel: "인스타그램",
  },
  {
    id: "ig3",
    Id: "insta003",
    nickname: "인스타리뷰어2",
    userType: "리뷰어",
    profileImage: "",
    memberType: "경고 회원",
    followers: 50000,
    memo: "사진 촬영 경험이 풍부합니다.",
    selectionStatus: "이용제한 계정",
    channel: "인스타그램",
  },
];

export const mockInstagramSelectedApplicants: InstagramApplicant[] = [
  {
    id: "igs1",
    Id: "insta_selected001",
    nickname: "인스타선정자1",
    userType: "인플루언서",
    profileImage: "",
    memberType: "모범 회원",
    followers: 320000,
    memo: "선정 감사합니다! 최고의 피드로 보답하겠습니다.",
    selectionStatus: "선정하기",
    channel: "인스타그램",
  },
  {
    id: "igs2",
    Id: "insta_selected002",
    nickname: "인스타선정자2",
    userType: "리뷰어",
    profileImage: "",
    memberType: "주의 회원",
    followers: 180000,
    memo: "정성스럽게 리뷰하겠습니다.",
    selectionStatus: "선정하기",
    channel: "인스타그램",
  },
];

/* ========================================
   ▶️ 유튜브 신청/선정 데이터 (구독자)
   ======================================== */
export const mockYoutubeApplicants: YoutubeApplicant[] = [
  {
    id: "yt1",
    Id: "youtube001",
    nickname: "유튜버1은닉네임이너무길어서아파요",
    userType: "리뷰어",
    profileImage: "",
    memberType: "모범 회원",
    subscribers: 11200,
    memo: "프로 유튜버 믿고 맡겨주세요. 여행 전문",
    selectionStatus: "미선택",
    channel: "유튜브",
  },
  {
    id: "yt2",
    Id: "youtube002",
    nickname: "유튜브인플루언서",
    userType: "인플루언서",
    profileImage: "",
    memberType: "주의 회원",
    subscribers: 532000,
    memo: "영화/리뷰 콘텐츠 제작 중입니다.",
    selectionStatus: "미선택",
    channel: "유튜브",
  },
  {
    id: "yt3",
    Id: "youtube003",
    nickname: "유튜버3",
    userType: "리뷰어",
    profileImage: "",
    memberType: "경고 회원",
    subscribers: 9800,
    memo: "제품 언박싱 경험 다수",
    selectionStatus: "이용제한 계정",
    channel: "유튜브",
  },
];

export const mockYoutubeSelectedApplicants: YoutubeApplicant[] = [
  {
    id: "yts1",
    Id: "youtube_selected001",
    nickname: "유튜브선정자1닉네임이너무길어서어어어어",
    userType: "인플루언서",
    profileImage: "",
    memberType: "모범 회원",
    subscribers: 245000,
    memo: "선정 감사합니다! 트렌디한 영상으로 보답하겠습니다.",
    selectionStatus: "선정하기",
    channel: "유튜브",
  },
  {
    id: "yts2",
    Id: "youtube_selected002",
    nickname: "유튜브선정자2",
    userType: "리뷰어",
    profileImage: "",
    memberType: "주의 회원",
    subscribers: 41200,
    memo: "상세 사용기 영상으로 소개하겠습니다.",
    selectionStatus: "선정하기",
    channel: "유튜브",
  },
];

/* ========================================
   📦 신청 탭 통합 데이터 (채널 무관 전체)
   ======================================== */
export const mockAllApplicants: Array<
  Applicant | NaverClipApplicant | InstagramApplicant | YoutubeApplicant
> = [
  ...mockApplicants,
  ...mockNaverClipApplicants,
  ...mockInstagramApplicants,
  ...mockYoutubeApplicants,
];
