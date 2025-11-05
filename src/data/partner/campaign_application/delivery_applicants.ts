/* ========================================
   📦 배송형 캠페인 신청자 타입 정의
   ======================================== */

/**
 * 배송형 캠페인 신청자 타입 정의
 *
 * 목적: 배송형 캠페인의 신청자 데이터 타입을 정의
 *
 * 사용 위치:
 * - /partner/campaign_application/delivery (배송형 캠페인 신청내역 페이지)
 * - 신청자 카드 컴포넌트들
 *
 * 주요 기능:
 * - 다양한 채널별 신청자 타입 정의
 * - 통합 신청자 타입 제공
 * - 캠페인과 신청자 데이터 통합 타입 제공
 */

import { CampaignInfo } from "@/components/partner/campaign_application/CampaignInfoBox";
import type { ContentByTab } from "../sharedCampaigns";

// 기본 신청자 데이터 타입 정의
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
  channel: "네이버블로그";
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
  subscribers: number;
  memo: string;
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정" | "검수중" | "완료";
  channel: "유튜브";
  registrationDate?: string;
}

/** 기본 신청자 타입 (미션형/구매평용 - 채널 정보 없음) */
export interface BasicApplicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한";
  memo: string;
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정" | "검수중" | "완료";
  channel: "기본";
  registrationDate?: string;
}

// 통합 신청자 타입
export type AllApplicant =
  | Applicant
  | NaverClipApplicant
  | InstagramApplicant
  | YoutubeApplicant
  | BasicApplicant;

// 캠페인과 신청자 데이터를 포함한 통합 타입
export interface CampaignWithApplicants {
  campaignInfo: CampaignInfo;
  applicantData: {
    applicants: AllApplicant[];
    selectedApplicants: AllApplicant[];
  };
  /** 선택: 진행/검수 상세에서 바로 사용할 콘텐츠 데이터 */
  contents?: ContentByTab;
}
