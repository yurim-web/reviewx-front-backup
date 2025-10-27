/* ========================================
   📦 배송형 캠페인 신청내역 목업 데이터
   ======================================== */

/**
 * 목업(Mock) 데이터 파일
 *
 * 목적: 개발 및 테스트를 위한 임시 데이터를 관리하는 파일입니다.
 *
 * 📌 Mock Data란?
 * - 실제 API 서버 대신 사용하는 가짜 데이터
 * - 프론트엔드 개발 시 백엔드 작업을 기다리지 않고 개발 가능
 * - 예시로 사용할 데이터를 미리 만들어둠
 *
 * 📌 데이터 분리의 장점:
 * 1. 코드 정리: 페이지 컴포넌트에서 로직과 데이터 분리
 * 2. 재사용성: 여러 곳에서 같은 데이터 사용 가능
 * 3. 유지보수: 데이터만 수정하면 되므로 관리 용이
 * 4. 테스트: 테스트 데이터를 쉽게 교체 가능
 */

import { CampaignInfo } from "@/components/partner/campaign_application/CampaignInfoBox";

// 신청자 데이터 타입 정의
export interface Applicant {
  /** 신청자 고유 ID */
  id: string;
  /** 닉네임 */
  nickname: string;
  /** 사용자 타입 (리뷰어/인플루언서) */
  userType: "리뷰어" | "인플루언서";
  /** 프로필 이미지 경로 */
  profileImage: string;
  /** 회원 타입 (모범 회원/이용 제한) */
  memberType: "모범 회원" | "이용 제한";
  /** 일일 방문자 수 */
  dailyVisits: number;
  /** 총 방문자 수 */
  totalVisits: number;
  /** 이웃 수 */
  neighbors: number;
  /** 메모/자기소개 */
  memo: string;
  /** 선정 상태 */
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정";
  /** 채널 */
  channel:
    | "네이버"
    | "네이버블로그"
    | "네이버쇼핑"
    | "쿠팡"
    | "인스타"
    | "카카오선물하기"
    | "올리브영"
    | "오늘의집"
    | "유튜브";
}

/**
 * 배송형 캠페인 정보 목업 데이터
 *
 * 📌 데이터 구조 설명:
 * - id: 캠페인 고유 식별자
 * - title: 캠페인 제목
 * - image: 캠페인 대표 이미지 경로
 * - status: 캠페인 진행 상태
 * - category: 캠페인 카테고리 (배송형)
 * - brandName: 브랜드 이름 (로고 매핑에 사용)
 * - recruitmentPeriod: 모집 기간
 * - announcementDate: 선정 발표일
 * - registrationPeriod: 등록 기간
 * - recruitedCount: 현재 모집된 인원
 * - totalCount: 전체 모집 인원
 * - daysLeft: 선정 발표까지 남은 일수
 */
export const mockCampaignInfo: CampaignInfo = {
  id: "1",
  title:
    "나만의 향수만들기 체험 [그리디센트] 나만의 향수만들기 체험 [그리디센트]나만의 향수만들기 체험 [그리디센트]나만의 향수만들기 체험 [그리디센트]나만의 향수만들기 체험 [그리디센트]나만의 향수만들기 체험 [그리디센트]나만의 향수만들기 체험 [그리디센트]",
  image: "/images/main/campaign_img/eximg_1.png",
  status: "모집 중",
  category: "배송형",
  brandName: "네이버 쇼핑", // 브랜드 이름으로 매핑 (자동으로 로고 경로 가져옴)
  recruitmentPeriod: "2025-09-02 ~ 2025-09-14",
  announcementDate: "2025-09-16",
  registrationPeriod: "2025-09-22 ~ 2025-09-30",
  recruitedCount: 20,
  totalCount: 100,
  daysLeft: 30,
};

/**
 * 배송형 캠페인 신청자 목록 목업 데이터
 *
 * 📌 배열 데이터:
 * - Applicant 타입의 객체들로 구성된 배열
 * - 모든 신청자의 정보를 포함 (미선택, 선정하기, 이용제한 포함)
 * - "신청" 탭에서 사용
 *
 * 📌 실제 사용 예시:
 * - 신청자 목록을 화면에 표시
 * - 선정하기 버튼 클릭 시 신청자 ID 사용
 * - 통계 정보 계산 (전체 신청자 수)
 */

// 배송형 -> 신청 탭에 있는 데이터들
export const mockApplicants: Applicant[] = [
  {
    id: "1",
    nickname: "배송리뷰어1",
    userType: "리뷰어",
    profileImage: "",
    memberType: "모범 회원",
    dailyVisits: 135,
    totalVisits: 526000,
    neighbors: 1031,
    memo: "배송형 캠페인에 관심이 많습니다. 꼼꼼한 리뷰를 작성하겠습니다.",
    selectionStatus: "미선택",
    channel: "네이버블로그",
  },
  {
    id: "2",
    nickname: "배송인플루언서1",
    userType: "인플루언서",
    profileImage: "",
    memberType: "모범 회원",
    dailyVisits: 200,
    totalVisits: 800000,
    neighbors: 2500,
    memo: "안녕하세요 :) 무상으로 서비스를 제공해주시는만큼 감사히 사용하겠습니다.",
    selectionStatus: "미선택",
    channel: "쿠팡",
  },
  {
    id: "3",
    nickname: "배송리뷰어2",
    userType: "리뷰어",
    profileImage: "",
    memberType: "이용 제한",
    dailyVisits: 50,
    totalVisits: 100000,
    neighbors: 200,
    memo: "배송형 제품에 대한 경험이 많습니다.",
    selectionStatus: "이용제한 계정",
    channel: "올리브영",
  },
  {
    id: "4",
    nickname: "배송리뷰어3",
    userType: "리뷰어",
    profileImage: "",
    memberType: "모범 회원",
    dailyVisits: 180,
    totalVisits: 650000,
    neighbors: 1500,
    memo: "배송형 체험 리뷰를 꼼꼼하게 작성하겠습니다.",
    selectionStatus: "미선택",
    channel: "네이버쇼핑",
  },
];

/**
 * 배송형 캠페인 선정자 목록 목업 데이터
 *
 * 📌 배열 데이터:
 * - 선정된 신청자들의 정보만 포함
 * - "선정" 탭에서 사용
 * - selectionStatus가 "선정하기"인 신청자들
 *
 * 📌 실제 사용 예시:
 * - 선정자 목록 화면에 표시
 * - 선정된 인원 수 계산
 * - 선정자 관리 기능
 */

// 배송형 -> 선정 탭에 있는 데이터들

export const mockSelectedApplicants: Applicant[] = [
  {
    id: "5",
    nickname: "배송선정자1",
    userType: "리뷰어",
    profileImage: "/images/icons/phone_verified.svg",
    memberType: "모범 회원",
    dailyVisits: 250,
    totalVisits: 950000,
    neighbors: 2200,
    memo: "선정되어 기쁩니다! 좋은 리뷰 작성하겠습니다.",
    selectionStatus: "선정하기",
    channel: "네이버",
  },
  {
    id: "6",
    nickname: "배송선정자2",
    userType: "인플루언서",
    profileImage: "/images/icons/phone_verified.svg",
    memberType: "모범 회원",
    dailyVisits: 320,
    totalVisits: 1200000,
    neighbors: 3800,
    memo: "감사합니다. 홍보를 위해 최선을 다하겠습니다.",
    selectionStatus: "선정하기",
    channel: "네이버블로그",
  },
];
