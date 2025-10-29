/* ========================================
   🔍 검수/완료 데이터 (배송형)
   ======================================== */

// 검수 전용 타입
export interface ReviewApplicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  selectionStatus: "검수중";
  channel: "네이버블로그" | "네이버클립" | "인스타그램" | "유튜브" | "기본";
  registrationDate: string;
}

// 완료 전용 타입
export interface CompletedApplicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  selectionStatus: "완료";
  channel: "네이버블로그" | "네이버클립" | "인스타그램" | "유튜브" | "기본";
  completionDate: string;
}

/* ========================================
   🔍 검수 탭 데이터 (검수 중인 신청자들)
   ======================================== */
export const mockReviewApplicants: ReviewApplicant[] = [
  {
    id: "7",
    Id: "review001",
    nickname: "배송검수자1",
    userType: "리뷰어",
    profileImage: "",
    selectionStatus: "검수중",
    channel: "네이버블로그",
    registrationDate: "2025-11-02 17:37",
  },
  {
    id: "8",
    Id: "review002",
    nickname: "배송검수자2",
    userType: "인플루언서",
    profileImage: "",
    selectionStatus: "검수중",
    channel: "기본",
    registrationDate: "2025-11-01 14:22",
  },
  {
    id: "9",
    Id: "review003",
    nickname: "배송검수자3",
    userType: "리뷰어",
    profileImage: "",
    selectionStatus: "검수중",
    channel: "기본",
    registrationDate: "2025-10-31 09:15",
  },
];

/* ========================================
   ✅ 완료 탭 데이터 (완료된 신청자들)
   ======================================== */
export const mockCompletedApplicants: CompletedApplicant[] = [
  {
    id: "10",
    Id: "completed001",
    nickname: "배송완료자1",
    userType: "리뷰어",
    profileImage: "",
    selectionStatus: "완료",
    channel: "기본",
    completionDate: "2025-11-06 22:24",
  },
  {
    id: "11",
    Id: "completed002",
    nickname: "배송완료자2",
    userType: "인플루언서",
    profileImage: "",
    selectionStatus: "완료",
    channel: "인스타그램",
    completionDate: "2025-11-05 18:30",
  },
  {
    id: "12",
    Id: "completed003",
    nickname: "배송완료자3",
    userType: "리뷰어",
    profileImage: "",
    selectionStatus: "완료",
    channel: "기본",
    completionDate: "2025-11-04 15:45",
  },
];
