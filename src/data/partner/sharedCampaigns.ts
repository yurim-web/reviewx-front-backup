/* ========================================
   📊 공용 캠페인 데이터
   ======================================== */

/**
 * 공용 캠페인 데이터
 *
 * 목적: 관리 페이지와 신청내역 페이지에서 공통으로 사용하는 캠페인 데이터
 *
 * 사용 위치:
 * - /partner/campaign_management (관리 페이지)
 * - /partner/campaign_application (신청내역 페이지)
 *
 * 주요 기능:
 * - 캠페인 기본 정보와 신청자 데이터를 하나의 파일에서 관리
 * - 데이터 일관성 보장
 * - 중복 데이터 제거
 */

import type { PartnerCampaign } from "@/types/partner";
import type {
  CampaignWithApplicants,
  AllApplicant,
} from "./campaign_application/delivery_applicants";
// 방문형 샘플 신청자 데이터는 아래 sharedCampaigns 내부에 인라인합니다.

// 타입을 재export
export type { CampaignWithApplicants, AllApplicant };

/**
 * 공용 캠페인 데이터 (기본 정보 + 신청자 데이터)
 */
export const sharedCampaigns: CampaignWithApplicants[] = [
  // =====================
  // 기자단 캠페인
  // =====================
  {
    campaignInfo: {
      id: "201",
      title: "[기자단] 라이프스타일 브랜드 스토리 취재",
      image: "/images/main/campaign_img/eximg_8.png",
      status: "모집 중",
      category: "기자단",
      brandName: "인스타그램",
      recruitmentPeriod: "2025-10-20 ~ 2025-11-02",
      announcementDate: "2025-11-03",
      registrationPeriod: "2025-11-04 ~ 2025-11-12",
      recruitedCount: 6,
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
      category: "기자단",
      brandName: "릴스",
      recruitmentPeriod: "2025-11-01 ~ 2025-11-10",
      announcementDate: "2025-11-11",
      registrationPeriod: "2025-11-12 ~ 2025-11-20",
      recruitedCount: 0,
      totalCount: 8,
      daysLeft: 12,
    },
    applicantData: {
      applicants: [
        {
          id: "rep_insta_202_001",
          Id: "rep_insta_user_202_001",
          nickname: "테크릴서",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 26500,
          memo: "릴스 숏폼 리뷰 전문",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
        {
          id: "rep_blog_202_001",
          Id: "rep_blog_user_202_001",
          nickname: "테크칼럼",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          followers: 1300,
          memo: "심층 사용기/벤치마크 강점",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
        {
          id: "rep_yt_202_001",
          Id: "rep_yt_user_202_001",
          nickname: "디바이스튜버",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 74000,
          memo: "심층 리뷰/비교 콘텐츠",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
      ],
      selectedApplicants: [
        {
          id: "rep_sel_insta_202_001",
          Id: "rep_insta_user_202_002",
          nickname: "릴스선정자",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 31000,
          memo: "브랜드 톤 적합, 숏폼 연출 우수",
          selectionStatus: "선정하기",
          channel: "인스타그램",
        },
      ],
    },
  },
  // =====================
  // 방문형 캠페인
  // =====================
  {
    campaignInfo: {
      id: "1",
      title: "카페 체험 방문 캠페인 [스타벅스]",
      image: "/images/main/campaign_img/eximg_2.png",
      status: "모집 중",
      category: "방문형",
      brandName: "인스타그램",
      recruitmentPeriod: "2024-01-10 ~ 2024-01-20",
      announcementDate: "2024-01-20",
      registrationPeriod: "2024-01-22 ~ 2024-01-30",
      recruitedCount: 8,
      totalCount: 10,
      daysLeft: 5,
    },
    applicantData: {
      applicants: [
        {
          id: "visit_blog_001",
          Id: "visit_blog_user_001",
          nickname: "김블로거",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          followers: 1500,
          memo: "블로그 포스팅 경험 풍부",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
        {
          id: "visit_clip_001",
          Id: "visit_clip_user_001",
          nickname: "박클리퍼",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          followers: 15600,
          memo: "클립 제작 전문가",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
        {
          id: "visit_insta_001",
          Id: "visit_insta_user_001",
          nickname: "정인플루언서",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 45200,
          memo: "인스타그램 협찬 경험 다수",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
        {
          id: "visit_youtube_001",
          Id: "visit_youtube_user_001",
          nickname: "송유튜버",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 67800,
          memo: "유튜브 리뷰 콘텐츠 제작",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
      ],
      selectedApplicants: [
        {
          id: "visit_blog_sel_001",
          Id: "visit_blog_user_002",
          nickname: "선정된블로거",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          followers: 2200,
          memo: "콘텐츠 퀄리티 우수",
          selectionStatus: "선정하기",
          channel: "인스타그램",
        },
        {
          id: "visit_insta_sel_001",
          Id: "visit_insta_user_002",
          nickname: "인스타선정자",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 30000,
          memo: "브랜드 톤 앤 매너 적합",
          selectionStatus: "선정하기",
          channel: "인스타그램",
        },
      ],
    },
  },
  {
    campaignInfo: {
      id: "104",
      title: "릴스 협찬 방문 캠페인",
      image: "/images/main/campaign_img/eximg_5.png",
      status: "모집 중",
      category: "방문형",
      brandName: "릴스",
      recruitmentPeriod: "2025-01-10 ~ 2025-01-20",
      announcementDate: "2025-01-20",
      registrationPeriod: "2025-01-22 ~ 2025-01-30",
      recruitedCount: 3,
      totalCount: 10,
      daysLeft: 6,
    },
    applicantData: {
      applicants: [
        {
          id: "r_app_001",
          Id: "reels_user_001",
          nickname: "릴스인플루언서",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 28000,
          memo: "릴스 숏폼 제작 경험 풍부",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
      ],
      selectedApplicants: [
        {
          id: "r_sel_001",
          Id: "reels_user_sel_001",
          nickname: "릴스선정자",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 35000,
          memo: "브랜드 톤 적합",
          selectionStatus: "선정하기",
          channel: "인스타그램",
        },
      ],
    },
  },
  {
    campaignInfo: {
      id: "105",
      title: "네이버클립 숏폼 체험단",
      image: "/images/main/campaign_img/eximg_6.png",
      status: "모집 중",
      category: "방문형",
      brandName: "네이버클립",
      recruitmentPeriod: "2025-01-12 ~ 2025-01-22",
      announcementDate: "2025-01-22",
      registrationPeriod: "2025-01-24 ~ 2025-02-01",
      recruitedCount: 5,
      totalCount: 12,
      daysLeft: 8,
    },
    applicantData: {
      applicants: [
        {
          id: "nc_app_001",
          Id: "naverclip_user_001",
          nickname: "클립마스터",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 21000,
          memo: "네이버클립 숏폼 제작 고수",
          selectionStatus: "미선택",
          channel: "네이버클립",
        },
        {
          id: "nc_app_002",
          Id: "naverclip_user_002",
          nickname: "패션클립",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          followers: 14500,
          memo: "패션/잡화 숏폼 전문",
          selectionStatus: "미선택",
          channel: "네이버클립",
        },
      ],
      selectedApplicants: [
        {
          id: "nc_sel_001",
          Id: "naverclip_sel_001",
          nickname: "선정된클리퍼",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 32000,
          memo: "브랜드 톤 적합",
          selectionStatus: "선정하기",
          channel: "네이버클립",
        },
      ],
    },
  },
  {
    campaignInfo: {
      id: "106",
      title: "숏츠 영상 체험 캠페인",
      image: "/images/main/campaign_img/eximg_7.png",
      status: "진행 중",
      category: "방문형",
      brandName: "숏츠",
      recruitmentPeriod: "2025-01-05 ~ 2025-01-15",
      announcementDate: "2025-01-15",
      registrationPeriod: "2025-01-17 ~ 2025-01-25",
      recruitedCount: 9,
      totalCount: 15,
      daysLeft: 2,
    },
    applicantData: {
      applicants: [
        {
          id: "s_app_001",
          Id: "shorts_user_001",
          nickname: "숏츠크리에이터",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          subscribers: 62000,
          memo: "숏츠 영상 리뷰 다수",
          selectionStatus: "미선택",
          channel: "유튜브",
        },
      ],
      selectedApplicants: [
        {
          id: "s_sel_001",
          Id: "shorts_user_sel_001",
          nickname: "숏츠선정자",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          subscribers: 80000,
          memo: "브랜드 톤 적합",
          selectionStatus: "선정하기",
          channel: "유튜브",
        },
      ],
    },
  },
  // =====================
  // 배송형 캠페인
  // =====================
  {
    campaignInfo: {
      id: "6",
      title: "프리미엄 화장품 체험 [쿠팡]",
      image: "/images/main/campaign_img/eximg_4.png",
      status: "모집 중",
      category: "배송형",
      brandName: "네이버블로그",
      recruitmentPeriod: "2025-09-20 ~ 2025-10-05",
      announcementDate: "2025-10-08",
      registrationPeriod: "2025-10-10 ~ 2025-10-20",
      recruitedCount: 25,
      totalCount: 60,
      daysLeft: 15,
    },
    applicantData: {
      applicants: [
        {
          id: "app_6_1",
          Id: "reviewer_6_001",
          nickname: "화장품리뷰어1",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          dailyVisits: 150,
          totalVisits: 500000,
          neighbors: 1200,
          memo: "화장품 리뷰 전문가입니다.",
          selectionStatus: "미선택",
          channel: "네이버블로그",
        },
        {
          id: "app_6_2",
          Id: "reviewer_6_002",
          nickname: "뷰티블로거",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          dailyVisits: 80,
          totalVisits: 300000,
          neighbors: 800,
          memo: "뷰티 제품에 관심이 많습니다.",
          selectionStatus: "미선택",
          channel: "네이버블로그",
        },
        {
          id: "app_6_3",
          Id: "reviewer_6_003",
          nickname: "스킨케어전문가",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          dailyVisits: 200,
          totalVisits: 800000,
          neighbors: 2000,
          memo: "스킨케어 제품 리뷰를 많이 합니다.",
          selectionStatus: "미선택",
          channel: "네이버블로그",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_6_1",
          Id: "selected_6_001",
          nickname: "선정된리뷰어1",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          dailyVisits: 300,
          totalVisits: 1000000,
          neighbors: 3000,
          memo: "이미 선정된 우수 리뷰어입니다.",
          selectionStatus: "선정하기",
          channel: "네이버블로그",
        },
      ],
    },
  },
  // =====================
  // 미션형 캠페인
  // =====================
  {
    campaignInfo: {
      id: "16",
      title: "화장품 브랜드 미션형 모집",
      image: "/images/main/campaign_img/eximg_4.png",
      status: "진행 중",
      category: "미션형",
      brandName: "기본",
      recruitmentPeriod: "2024-01-12 ~ 2024-01-20",
      announcementDate: "2024-01-20",
      registrationPeriod: "2024-01-22 ~ 2024-01-30",
      recruitedCount: 8,
      totalCount: 10,
      daysLeft: 5,
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
  },
  // =====================
  // 구매평 캠페인
  // =====================
  {
    campaignInfo: {
      id: "18",
      title: "프리미엄 화장품 구매평 작성 캠페인",
      image: "/images/main/campaign_img/eximg_5.png",
      status: "진행 중",
      category: "구매평",
      brandName: "기본",
      recruitmentPeriod: "2024-01-15 ~ 2024-01-22",
      announcementDate: "2024-01-22",
      purchasePeriod: "2024-01-23 ~ 2024-01-25",
      registrationPeriod: "2024-01-24 ~ 2024-02-01",
      recruitedCount: 12,
      totalCount: 15,
      daysLeft: 3,
    },
    applicantData: {
      applicants: [
        {
          id: "app_18_1",
          Id: "reviewer_18_001",
          nickname: "구매평전문가1",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "화장품 구매평 작성에 특화된 리뷰어입니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_18_2",
          Id: "reviewer_18_002",
          nickname: "뷰티구매평러",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "뷰티 제품 구매평을 자주 작성합니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_18_3",
          Id: "reviewer_18_003",
          nickname: "스킨케어구매평전문가",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "스킨케어 제품 구매평 전문가입니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_18_4",
          Id: "reviewer_18_004",
          nickname: "구매평마스터",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          memo: "다양한 제품의 구매평 작성 경험이 풍부합니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_18_5",
          Id: "reviewer_18_005",
          nickname: "제한된구매평계정",
          userType: "리뷰어",
          profileImage: "",
          memberType: "이용 제한",
          memo: "이용 제한 계정입니다.",
          selectionStatus: "이용제한 계정",
          channel: "기본",
        },
        {
          id: "app_18_6",
          Id: "reviewer_18_006",
          nickname: "신규구매평러",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "구매평 작성이 처음이지만 열정이 넘칩니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_18_1",
          Id: "selected_18_001",
          nickname: "선정된구매평전문가1",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "이미 선정된 우수 구매평 작성자입니다.",
          selectionStatus: "선정하기",
          channel: "기본",
        },
        {
          id: "sel_18_2",
          Id: "selected_18_002",
          nickname: "프로구매평러",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          memo: "구매평 작성 경험이 풍부한 전문가입니다.",
          selectionStatus: "선정하기",
          channel: "기본",
        },
      ],
    },
  },
  // =====================
  // 종료/취소 탭 테스트 데이터
  // =====================
  {
    campaignInfo: {
      id: "901",
      title: "[종료] 카페 체험 방문 캠페인",
      image: "/images/main/campaign_img/eximg_2.png",
      status: "종료",
      category: "방문형",
      brandName: "네이버블로그",
      recruitmentPeriod: "2024-01-05 ~ 2024-01-10",
      announcementDate: "2024-01-10",
      registrationPeriod: "2024-01-12 ~ 2024-01-18",
      recruitedCount: 10,
      totalCount: 10,
      daysLeft: -10,
    },
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
  },
  {
    campaignInfo: {
      id: "902",
      title: "[취소] 제품 배송형 체험단",
      image: "/images/main/campaign_img/eximg_1.png",
      status: "마감",
      category: "배송형",
      brandName: "인스타그램",
      recruitmentPeriod: "2024-02-01 ~ 2024-02-07",
      announcementDate: "2024-02-07",
      registrationPeriod: "2024-02-09 ~ 2024-02-15",
      recruitedCount: 0,
      totalCount: 12,
      daysLeft: -1,
    },
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
  },
  // =====================
  // 예정 탭(대기 중) 전 카테고리 노출용 테스트
  // =====================
  {
    campaignInfo: {
      id: "951",
      title: "[예정] 배송형 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_1.png",
      status: "대기 중",
      category: "배송형",
      brandName: "네이버블로그",
      recruitmentPeriod: "2025-11-10 ~ 2025-11-20",
      announcementDate: "2025-11-20",
      registrationPeriod: "2025-11-22 ~ 2025-11-30",
      recruitedCount: 0,
      totalCount: 10,
      daysLeft: 12,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
  {
    campaignInfo: {
      id: "952",
      title: "[예정] 방문형 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_2.png",
      status: "대기 중",
      category: "방문형",
      brandName: "네이버클립",
      recruitmentPeriod: "2025-11-08 ~ 2025-11-18",
      announcementDate: "2025-11-18",
      registrationPeriod: "2025-11-20 ~ 2025-11-28",
      recruitedCount: 0,
      totalCount: 8,
      daysLeft: 10,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
  {
    campaignInfo: {
      id: "953",
      title: "[예정] 구매평 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_5.png",
      status: "대기 중",
      category: "구매평",
      brandName: "기본",
      recruitmentPeriod: "2025-11-05 ~ 2025-11-12",
      announcementDate: "2025-11-12",
      purchasePeriod: "2025-11-13 ~ 2025-11-15",
      registrationPeriod: "2025-11-14 ~ 2025-11-22",
      recruitedCount: 0,
      totalCount: 6,
      daysLeft: 7,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
  {
    campaignInfo: {
      id: "954",
      title: "[예정] 미션형 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_4.png",
      status: "대기 중",
      category: "미션형",
      brandName: "기본",
      recruitmentPeriod: "2025-11-06 ~ 2025-11-16",
      announcementDate: "2025-11-16",
      registrationPeriod: "2025-11-18 ~ 2025-11-26",
      recruitedCount: 0,
      totalCount: 10,
      daysLeft: 8,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
  // 기자단(예정)은 202가 이미 존재

  // =====================
  // 진행 탭(진행 중) 전 카테고리 노출용 테스트
  // =====================
  {
    campaignInfo: {
      id: "961",
      title: "[진행] 배송형 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_1.png",
      status: "진행 중",
      category: "배송형",
      brandName: "네이버블로그",
      recruitmentPeriod: "2025-10-20 ~ 2025-10-30",
      announcementDate: "2025-10-30",
      registrationPeriod: "2025-11-01 ~ 2025-11-08",
      recruitedCount: 4,
      totalCount: 10,
      daysLeft: 3,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
  {
    campaignInfo: {
      id: "962",
      title: "[진행] 기자단 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_8.png",
      status: "진행 중",
      category: "기자단",
      brandName: "인스타그램",
      recruitmentPeriod: "2025-10-18 ~ 2025-10-28",
      announcementDate: "2025-10-28",
      registrationPeriod: "2025-10-30 ~ 2025-11-06",
      recruitedCount: 5,
      totalCount: 10,
      daysLeft: 2,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
  // =====================
  // 신청 탭(모집 중) 전 카테고리 노출용 테스트
  // =====================
  {
    campaignInfo: {
      id: "971",
      title: "[신청] 배송형 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_4.png",
      status: "모집 중",
      category: "배송형",
      brandName: "네이버블로그",
      recruitmentPeriod: "2025-11-01 ~ 2025-11-10",
      announcementDate: "2025-11-10",
      registrationPeriod: "2025-11-12 ~ 2025-11-20",
      recruitedCount: 3,
      totalCount: 12,
      daysLeft: 9,
    },
    applicantData: {
      applicants: [
        {
          id: "app_971_blog_001",
          Id: "reviewer_971_001",
          nickname: "블로그리뷰어A",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          dailyVisits: 120,
          totalVisits: 420000,
          neighbors: 900,
          memo: "문장력 좋고 체험기 다수",
          selectionStatus: "미선택",
          channel: "네이버블로그",
        },
        {
          id: "app_971_blog_002",
          Id: "reviewer_971_002",
          nickname: "리뷰잘쓰는B",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          dailyVisits: 200,
          totalVisits: 680000,
          neighbors: 1600,
          memo: "사진 퀄리티 우수",
          selectionStatus: "미선택",
          channel: "네이버블로그",
        },
        {
          id: "app_971_blog_003",
          Id: "reviewer_971_003",
          nickname: "체험단프로C",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          dailyVisits: 90,
          totalVisits: 250000,
          neighbors: 600,
          memo: "가독성 좋은 후기",
          selectionStatus: "미선택",
          channel: "네이버블로그",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_971_blog_001",
          Id: "selected_971_001",
          nickname: "선정된블로그D",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          dailyVisits: 310,
          totalVisits: 900000,
          neighbors: 2400,
          memo: "콘텐츠 일관성 좋음",
          selectionStatus: "선정하기",
          channel: "네이버블로그",
        },
      ],
    },
  },
  {
    campaignInfo: {
      id: "972",
      title: "[신청] 방문형 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_2.png",
      status: "모집 중",
      category: "방문형",
      brandName: "인스타그램",
      recruitmentPeriod: "2025-11-02 ~ 2025-11-12",
      announcementDate: "2025-11-12",
      registrationPeriod: "2025-11-14 ~ 2025-11-22",
      recruitedCount: 2,
      totalCount: 10,
      daysLeft: 10,
    },
    applicantData: {
      applicants: [
        {
          id: "app_972_insta_001",
          Id: "insta_972_001",
          nickname: "인스타크리에이터A",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 28500,
          memo: "브랜디드 컨텐츠 경험 다수",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
        {
          id: "app_972_insta_002",
          Id: "insta_972_002",
          nickname: "리뷰그램B",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 15800,
          memo: "사진/릴스 균형형",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
        {
          id: "app_972_insta_003",
          Id: "insta_972_003",
          nickname: "무드샷C",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 40300,
          memo: "무드 촬영 강점",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_972_insta_001",
          Id: "insta_sel_972_001",
          nickname: "선정그램D",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 32000,
          memo: "브랜드 톤 적합",
          selectionStatus: "선정하기",
          channel: "인스타그램",
        },
      ],
    },
  },
  {
    campaignInfo: {
      id: "973",
      title: "[신청] 구매평 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_5.png",
      status: "모집 중",
      category: "구매평",
      brandName: "기본",
      recruitmentPeriod: "2025-11-03 ~ 2025-11-13",
      announcementDate: "2025-11-13",
      purchasePeriod: "2025-11-14 ~ 2025-11-16",
      registrationPeriod: "2025-11-15 ~ 2025-11-23",
      recruitedCount: 1,
      totalCount: 8,
      daysLeft: 11,
    },
    applicantData: {
      applicants: [
        {
          id: "app_973_basic_001",
          Id: "basic_973_001",
          nickname: "구매평러A",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "구매 후기 경험 다수",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_973_basic_002",
          Id: "basic_973_002",
          nickname: "성실리뷰B",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "사진 포함 상세 후기",
          selectionStatus: "미선택",
          channel: "기본",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_973_basic_001",
          Id: "basic_sel_973_001",
          nickname: "선정구매평C",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "브랜드 톤 적합",
          selectionStatus: "선정하기",
          channel: "기본",
        },
      ],
    },
  },
  {
    campaignInfo: {
      id: "974",
      title: "[신청] 기자단 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_8.png",
      status: "모집 중",
      category: "기자단",
      brandName: "인스타그램",
      recruitmentPeriod: "2025-11-04 ~ 2025-11-14",
      announcementDate: "2025-11-14",
      registrationPeriod: "2025-11-16 ~ 2025-11-24",
      recruitedCount: 4,
      totalCount: 10,
      daysLeft: 12,
    },
    applicantData: {
      applicants: [
        {
          id: "app_974_insta_001",
          Id: "insta_974_001",
          nickname: "스토리그램A",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 21000,
          memo: "브랜드 스토리 텔링",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
        {
          id: "app_974_insta_002",
          Id: "insta_974_002",
          nickname: "리뷰그램B",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 35500,
          memo: "무드샷/릴스 경험",
          selectionStatus: "미선택",
          channel: "인스타그램",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_974_insta_001",
          Id: "insta_sel_974_001",
          nickname: "선정스토리C",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          followers: 29000,
          memo: "브랜드 톤 적합",
          selectionStatus: "선정하기",
          channel: "인스타그램",
        },
      ],
    },
  },
  {
    campaignInfo: {
      id: "975",
      title: "[신청] 미션형 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_4.png",
      status: "모집 중",
      category: "미션형",
      brandName: "기본",
      recruitmentPeriod: "2025-11-05 ~ 2025-11-15",
      announcementDate: "2025-11-15",
      registrationPeriod: "2025-11-17 ~ 2025-11-25",
      recruitedCount: 0,
      totalCount: 10,
      daysLeft: 13,
    },
    applicantData: {
      applicants: [
        {
          id: "app_975_basic_001",
          Id: "basic_975_001",
          nickname: "미션러A",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "체크리스트 수행 성실",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_975_basic_002",
          Id: "basic_975_002",
          nickname: "미션장인B",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "과업 제출 기한 엄수",
          selectionStatus: "미선택",
          channel: "기본",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_975_basic_001",
          Id: "basic_sel_975_001",
          nickname: "선정미션C",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "브랜드 가이드 충실",
          selectionStatus: "선정하기",
          channel: "기본",
        },
      ],
    },
  },
];

/**
 * 관리 페이지용 PartnerCampaign 데이터로 변환하는 함수
 */
export const convertToPartnerCampaigns = (): PartnerCampaign[] => {
  return sharedCampaigns.map((campaign) => ({
    id: campaign.campaignInfo.id,
    title: campaign.campaignInfo.title,
    image: campaign.campaignInfo.image,
    type: campaign.campaignInfo.category as
      | "배송형"
      | "방문형"
      | "구매평"
      | "기자단"
      | "미션형",
    status:
      campaign.campaignInfo.status === "진행 중"
        ? "진행"
        : campaign.campaignInfo.status === "모집 중"
        ? "신청"
        : campaign.campaignInfo.status === "대기 중"
        ? "예정"
        : campaign.campaignInfo.status === "마감"
        ? "취소"
        : (campaign.campaignInfo.status as "예정" | "진행" | "종료" | "취소"),
    deadline: campaign.campaignInfo.announcementDate,
    remainingDays: campaign.campaignInfo.daysLeft,
    statusMessage: getStatusMessage(
      campaign.campaignInfo.status,
      campaign.campaignInfo.daysLeft
    ),
    applicants: campaign.applicantData.applicants.length,
    recruits: campaign.campaignInfo.totalCount,
    submissions: 0, // 필요시 추가
    selected: campaign.applicantData.selectedApplicants.length,
    brand: campaign.campaignInfo.brandName,
    brandLogo: getBrandLogo(
      campaign.campaignInfo.brandName || "기본",
      campaign.campaignInfo.category
    ),
    subStatus: getSubStatus(
      campaign.campaignInfo.status,
      campaign.applicantData.applicants.length,
      campaign.applicantData.selectedApplicants.length
    ),
  }));
};

/**
 * 상태에 따른 메시지 생성
 */
const getStatusMessage = (status: string, daysLeft: number): string => {
  switch (status) {
    case "예정":
      return `캠페인 오픈까지 ${daysLeft}일 남았습니다.`;
    case "모집 중":
    case "신청":
      return `캠페인 선정 발표까지 ${daysLeft}일 남았습니다.`;
    case "진행 중":
    case "진행":
      return "캠페인 당첨자를 선정해 주세요.";
    case "종료":
      return "캠페인이 마감되었습니다.";
    case "취소":
      return "캠페인을 취소하였습니다.";
    default:
      return `캠페인 선정 발표까지 ${daysLeft}일 남았습니다.`;
  }
};

/**
 * 브랜드에 따른 로고 경로 반환
 */
const getBrandLogo = (brandName: string, category?: string): string => {
  // 카테고리 우선 매핑: 구매평/미션형은 전용 아이콘 사용
  if (category === "구매평") {
    return "/images/brand_logo/review.svg";
  }
  if (category === "미션형") {
    return "/images/brand_logo/misssion.svg";
  }

  // 브랜드명 매핑
  switch (brandName) {
    case "쿠팡":
      return "/images/brand_logo/coupang.svg";
    case "네이버블로그":
      return "/images/brand_logo/naverblog.svg";
    case "네이버클립":
      return "/images/brand_logo/naverclip.svg";
    case "인스타그램":
      return "/images/brand_logo/insta.svg";
    case "릴스":
      return "/images/brand_logo/reels.svg";
    case "네이버쇼핑":
      return "/images/brand_logo/navershop.svg";
    case "숏츠":
      return "/images/brand_logo/shots.svg";
    case "11번가":
      return "/images/brand_logo/11st.svg";
    default:
      return "/images/icons/phone_verified.svg";
  }
};

/**
 * 캠페인 상태에 따른 서브 상태 반환
 */
const getSubStatus = (
  status: string,
  applicantsCount: number,
  selectedCount: number
): string => {
  switch (status) {
    case "예정":
      return "campaign_edit";
    case "모집 중":
    case "신청":
      return applicantsCount > 0
        ? "campaign_edit,applicant_management"
        : "campaign_edit";
    case "진행 중":
    case "진행":
      return "winner_selection";
    case "종료":
      return "content_review,content_approval";
    case "취소":
      return "penalty";
    default:
      return "campaign_edit";
  }
};

/**
 * 캠페인 ID로 데이터 조회 (신청내역 페이지용)
 */
export const getCampaignById = (id: string): CampaignWithApplicants | null => {
  return (
    sharedCampaigns.find((campaign) => campaign.campaignInfo.id === id) || null
  );
};

/**
 * 탭별 캠페인 필터링 (관리 페이지용)
 */
export const getCampaignsByTab = (tab: string): PartnerCampaign[] => {
  const partnerCampaigns = convertToPartnerCampaigns();

  switch (tab) {
    case "전체":
      return partnerCampaigns;
    case "예정":
      return partnerCampaigns.filter((campaign) => campaign.status === "예정");
    case "신청":
      return partnerCampaigns.filter((campaign) => campaign.status === "신청");
    case "진행":
      return partnerCampaigns.filter((campaign) => campaign.status === "진행");
    case "종료":
      return partnerCampaigns.filter((campaign) => campaign.status === "종료");
    case "취소":
      return partnerCampaigns.filter((campaign) => campaign.status === "취소");
    default:
      return partnerCampaigns;
  }
};

/**
 * 캠페인 통계 데이터
 */
export const getCampaignStats = () => {
  const partnerCampaigns = convertToPartnerCampaigns();

  return {
    전체: partnerCampaigns.length,
    예정: partnerCampaigns.filter((c) => c.status === "예정").length,
    신청: partnerCampaigns.filter((c) => c.status === "신청").length,
    진행: partnerCampaigns.filter((c) => c.status === "진행").length,
    종료: partnerCampaigns.filter((c) => c.status === "종료").length,
    취소: partnerCampaigns.filter((c) => c.status === "취소").length,
    패널티: 0,
  };
};
