/* ========================================
   🚚 배송형 캠페인 데이터 (캠페인 info + 신청 카드 + 콘텐츠)
   - sharedCampaigns.ts에서 타입별 데이터 분리
   ======================================== */
import type { CampaignWithApplicants } from "./campaign_application/delivery_applicants";
import type { CampaignWithContents } from "./sharedCampaigns";
import type { ContentByTab, ContentItem } from "./sharedCampaigns";
import type { CampaignFormData } from "@/types/user/user";

export const deliveryCampaigns: CampaignWithApplicants[] = [
  // 진행 탭(진행 중) - 콘텐츠 있음 (2버튼 표시)
  {
    campaignInfo: {
      id: "961",
      title: "[진행+콘텐츠] 배송형 체험단 진행",
      image: "/images/main/campaign_img/eximg_1.png",
      status: "진행 중" as const,
      campaignType: "배송형",
      category: "뷰티",
      brandName: "네이버블로그",
      recruitmentPeriod: "2025-10-20 ~ 2025-10-30",
      announcementDate: "2025-10-30",
      registrationPeriod: "2025-11-01 ~ 2025-11-08",
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 10,
      daysLeft: 3,
      statusText: "캠페인 콘텐츠를 검수해 주세요.",
    },
    applicantData: {
      applicants: [
        {
          id: "app_961_blog_001",
          Id: "reviewer_961_001",
          nickname: "배송체험리뷰어A",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          dailyVisits: 150,
          totalVisits: 450000,
          neighbors: 1100,
          memo: "배송형 체험단 전문 리뷰어",
          selectionStatus: "미선택",
          channel: "네이버블로그",
          registrationDate: "2025-10-22",
        },
        {
          id: "app_961_blog_002",
          Id: "reviewer_961_002",
          nickname: "배송리뷰전문가B",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          dailyVisits: 180,
          totalVisits: 580000,
          neighbors: 1500,
          memo: "상세한 사용 후기 작성 능력",
          selectionStatus: "미선택",
          channel: "네이버블로그",
          registrationDate: "2025-10-23",
        },
        {
          id: "app_961_blog_003",
          Id: "reviewer_961_003",
          nickname: "체험단마스터C",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          dailyVisits: 95,
          totalVisits: 280000,
          neighbors: 700,
          memo: "체험 리뷰 전문",
          selectionStatus: "미선택",
          channel: "네이버블로그",
          registrationDate: "2025-10-24",
        },
        {
          id: "app_961_blog_004",
          Id: "reviewer_961_004",
          nickname: "리뷰퀸D",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          dailyVisits: 220,
          totalVisits: 720000,
          neighbors: 2000,
          memo: "고품질 리뷰 전문가",
          selectionStatus: "미선택",
          channel: "네이버블로그",
          registrationDate: "2025-10-25",
        },
      ],
      selectedApplicants: [],
    },
  },

  // 신청 탭(모집 중)
  {
    campaignInfo: {
      id: "971",
      title: "[신청] 배송형 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_4.png",
      status: "모집 중" as const,
      campaignType: "배송형",
      category: "식품",
      brandName: "네이버블로그",
      recruitmentPeriod: "2025-11-01 ~ 2025-11-10",
      announcementDate: "2025-11-10",
      registrationPeriod: "2025-11-12 ~ 2025-11-20",
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
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

  // 예정 탭(대기 중)
  {
    campaignInfo: {
      id: "951",
      title: "[예정] 배송형 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_1.png",
      status: "대기 중" as const,
      campaignType: "배송형",
      category: "뷰티",
      brandName: "네이버블로그",
      recruitmentPeriod: "2025-11-10 ~ 2025-11-20",
      announcementDate: "2025-11-20",
      registrationPeriod: "2025-11-22 ~ 2025-11-30",
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 10,
      daysLeft: 12,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },

  // 모집 탭(모집 중) - 일반 배송형 샘플
  {
    campaignInfo: {
      id: "6",
      title: "프리미엄 화장품 체험 [쿠팡]",
      image: "/images/main/campaign_img/eximg_4.png",
      status: "모집 중",
      campaignType: "배송형",
      category: "뷰티",
      brandName: "네이버블로그",
      recruitmentPeriod: "2025-09-20 ~ 2025-10-05",
      announcementDate: "2025-10-08",
      registrationPeriod: "2025-10-10 ~ 2025-10-20",
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
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
];

/* ========================================
   📊 신청자 수 자동 계산 로직
   - 각 캠페인의 recruitedCount를 applicantData.applicants 배열 길이로 자동 설정
   - 데이터 일관성을 유지하기 위해 배열 정의 직후 실행됩니다
   ======================================== */

/**
 * deliveryCampaigns 배열의 각 캠페인에 대해 recruitedCount를 자동 계산합니다
 *
 * 설명:
 * - 각 캠페인의 applicantData.applicants 배열의 길이를 계산하여
 *   campaignInfo.recruitedCount에 자동으로 설정합니다.
 * - 이렇게 하면 신청자 데이터를 추가/제거할 때마다 수동으로 숫자를 맞출 필요가 없습니다.
 */
deliveryCampaigns.forEach((campaign) => {
  // 각 캠페인의 신청자 배열 길이를 계산하여 recruitedCount에 설정
  // 설명: applicantData.applicants가 undefined일 수 있으므로 옵셔널 체이닝(?.)과 널 병합 연산자(??)를 사용
  // applicants가 없으면 빈 배열([])로 간주하고, 그 길이는 0이 됩니다
  campaign.campaignInfo.recruitedCount =
    campaign.applicantData?.applicants?.length ?? 0;
});

/* ========================================
   🚚 배송형 (종료/취소) 콘텐츠 데이터
   - closedCampaigns.ts 병합용
   ======================================== */
export const deliveryClosedCampaigns: CampaignWithContents[] = [
  {
    campaignInfo: {
      id: "902",
      title: "[취소] 제품 배송형 체험단",
      image: "/images/main/campaign_img/eximg_1.png",
      status: "취소",
      campaignType: "배송형",
      category: "가전",
      brandName: "인스타그램",
      recruitmentPeriod: "2024-02-01 ~ 2024-02-07",
      announcementDate: "2024-02-07",
      registrationPeriod: "2024-02-09 ~ 2024-02-15",
      recruitedCount: 0,
      totalCount: 12,
      daysLeft: -1,
      statusText: "캠페인을 취소하였습니다.",
    },
    contents: {
      reviewing: [
        {
          id: "902-r-1",
          createdAt: "2025-10-28T10:15:00.000Z",
          status: "검수",
          channel: "인스타그램",
          userType: "인플루언서",
          nickname: "참여자-1",
          channelId: "902-r-1",
          updatedAt: "2025-10-28T10:45:00.000Z",
        },
        {
          id: "902-r-2",
          createdAt: "2025-10-28T11:30:00.000Z",
          status: "검수",
          channel: "인스타그램",
          userType: "인플루언서",
          nickname: "참여자-2",
          channelId: "902-r-2",
          isRejected: true,
        },
      ],
      completed: [
        {
          id: "902-c-1",
          createdAt: "2025-10-27T18:45:00.000Z",
          status: "완료",
          channel: "인스타그램",
          userType: "인플루언서",
          nickname: "참여자-2",
          channelId: "902-c-1",
          updatedAt: "2025-10-27T19:10:00.000Z",
        },
        {
          id: "902-c-2",
          createdAt: "2025-10-27T20:00:00.000Z",
          status: "완료",
          channel: "인스타그램",
          userType: "인플루언서",
          nickname: "참여자-3",
          channelId: "902-c-2",
          isLate: true,
        },
        {
          id: "902-c-3",
          createdAt: "2025-10-27T21:10:00.000Z",
          status: "완료",
          channel: "인스타그램",
          userType: "인플루언서",
          nickname: "참여자-4",
          channelId: "902-c-3",
        },
      ],
    },
  },
];

/* ========================================
   🚚 배송형 캠페인 등록 함수
   - 폼 데이터를 CampaignWithApplicants 형태로 변환
   ======================================== */

/**
 * 날짜 문자열에서 남은 일수 계산
 *
 * 설명:
 * - 선정 날짜까지 남은 일수를 계산합니다.
 * - 오늘 날짜를 기준으로 타겟 날짜까지의 일수를 반환합니다.
 *
 * 학습 포인트:
 * - getTime(): 날짜를 밀리초로 변환하여 계산
 * - Math.ceil(): 올림 처리하여 하루 단위로 계산
 *
 * @param dateString - 날짜 문자열 (예: "2025-11-30")
 * @returns 오늘로부터 해당 날짜까지 남은 일수
 */
export function calculateDaysLeft(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 캠페인 상태 결정 (날짜 기반)
 *
 * 설명:
 * - 예정 탭: 캠페인 오픈 예정 (모집 시작일이 미래) → "대기 중"
 * - 신청 탭: 캠페인 오픈 후, 선정 전 (모집 시작일이 과거, 선정 날짜가 미래) → "모집 중"
 * - 진행 탭: 모집 시작일이 오늘이거나 선정 날짜가 지남 → "진행 중"
 *
 * 학습 포인트:
 * - Date 객체: 날짜 비교를 위해 사용
 * - setHours(0, 0, 0, 0): 시간을 00:00:00으로 설정하여 날짜만 비교
 * - 조건문 순서: 선정 날짜와 모집 시작일을 모두 체크하여 우선순위 결정
 *
 * @param recruitmentPeriod - 모집 기간 ("2025-11-01 ~ 2025-11-15" 형식)
 * @param announcementDate - 선정 날짜 ("2025-11-30" 형식)
 * @returns "대기 중" | "모집 중" | "진행 중"
 */
export function calculateCampaignStatus(
  recruitmentPeriod?: string,
  announcementDate?: string
): "대기 중" | "모집 중" | "진행 중" {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let campaignStatus: "대기 중" | "모집 중" | "진행 중" = "대기 중";

  // 모집 기간 체크
  if (recruitmentPeriod) {
    // "2025-11-01 ~ 2025-11-15" 또는 "2025-11-01~2025-11-15" 형식에서 시작일 추출
    // 두 형식 모두 지원: 공백 포함/미포함
    const separator = recruitmentPeriod.includes(" ~ ") ? " ~ " : "~";
    const startDateStr = recruitmentPeriod.split(separator)[0]?.trim();

    if (startDateStr) {
      const startDate = new Date(startDateStr);

      // 유효한 날짜인지 확인 (Invalid Date 체크)
      if (isNaN(startDate.getTime())) {
        console.error(`유효하지 않은 모집 시작일: ${startDateStr}`);
        return campaignStatus;
      }

      startDate.setHours(0, 0, 0, 0);

      // 디버깅: 날짜 비교 로그
      const daysDiff = Math.floor(
        (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      console.log(
        `[캠페인 상태 계산] 모집시작일: ${startDateStr}, 오늘: ${
          today.toISOString().split("T")[0]
        }, 차이: ${daysDiff}일`
      );

      // 모집 시작일이 오늘이면 "진행 중" (진행 탭)
      if (startDate.getTime() === today.getTime()) {
        console.log(`[캠페인 상태 계산] 모집 시작일 = 오늘 → "진행 중"`);
        return "진행 중";
      }

      // 모집 시작일이 과거면 "모집 중" (신청 탭) 또는 "진행 중" 체크 필요
      if (startDate < today) {
        console.log(`[캠페인 상태 계산] 모집 시작일 < 오늘 → "모집 중"`);
        campaignStatus = "모집 중";
      } else {
        // 모집 시작일이 미래면 "대기 중" (예정 탭)
        console.log(`[캠페인 상태 계산] 모집 시작일 > 오늘 → "대기 중"`);
        campaignStatus = "대기 중";
      }
    } else {
      console.error(
        `[캠페인 상태 계산] 모집 기간 파싱 실패: ${recruitmentPeriod}`
      );
    }
  }

  // 선정 날짜 체크 (진행 중 우선순위)
  if (announcementDate) {
    const announcementDateStr = announcementDate.split(" ")[0]?.trim();
    if (announcementDateStr) {
      const announcementDateObj = new Date(announcementDateStr);

      // 유효한 날짜인지 확인
      if (isNaN(announcementDateObj.getTime())) {
        console.error(`유효하지 않은 선정 날짜: ${announcementDateStr}`);
        return campaignStatus;
      }

      announcementDateObj.setHours(0, 0, 0, 0);

      // 선정 날짜가 오늘이거나 지났으면 "진행 중"
      if (announcementDateObj <= today) {
        console.log(`[캠페인 상태 계산] 선정 날짜 <= 오늘 → "진행 중"`);
        return "진행 중";
      } else {
        console.log(
          `[캠페인 상태 계산] 선정 날짜 > 오늘, 최종 상태: "${campaignStatus}"`
        );
      }
    }
  }

  console.log(`[캠페인 상태 계산] 최종 상태: "${campaignStatus}"`);
  return campaignStatus;
}

/**
 * 새 캠페인 ID 생성
 *
 * @returns 새로운 캠페인 ID (기존 ID 중 최대값 + 1)
 */
function generateNewCampaignId(): string {
  // 기존 캠페인 ID 중 최대값 찾기
  const existingIds = deliveryCampaigns
    .map((c) => parseInt(c.campaignInfo.id))
    .filter((id) => !isNaN(id));
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 960;

  return String(maxId + 1);
}

/**
 * 폼 데이터를 CampaignWithApplicants 형태로 변환하여 새 캠페인 생성
 *
 * 설명:
 * - 배송형 캠페인 등록 폼에서 입력한 데이터를 deliveryCampaigns 구조에 맞게 변환합니다.
 * - 새 캠페인 ID를 자동 생성합니다.
 * - 등록 시 상태는 "대기 중"으로 설정됩니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL (첫 번째 이미지 사용)
 * @returns 새로 생성된 CampaignWithApplicants 객체
 */
export function createDeliveryCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_1.png"
): CampaignWithApplicants {
  // 새 캠페인 ID 생성
  const newId = generateNewCampaignId();

  // 선정 날짜까지 남은 일수 계산
  const daysLeft = formData.announcementDate
    ? calculateDaysLeft(formData.announcementDate.split(" ")[0]) // "2025-11-30" 형식에서 날짜만 추출
    : 0;

  // 모집 인원을 숫자로 변환
  const totalCount = Number(formData.recruitmentCount) || 0;

  // 캠페인 상태 결정 함수 호출
  const campaignStatus = calculateCampaignStatus(
    formData.recruitmentPeriod,
    formData.announcementDate
  );

  // 플랫폼명 정규화 (공백 제거하여 로고 매핑 일치시키기)
  // 예: "네이버 블로그" → "네이버블로그"
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, "")
    : "기본";

  return {
    campaignInfo: {
      id: newId,
      title: formData.title,
      image: imageUrl,
      status: campaignStatus,
      campaignType: "배송형",
      category: formData.category || "기타",
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod,
      announcementDate: formData.announcementDate,
      registrationPeriod: formData.registrationPeriod,
      recruitedCount: 0, // 새로 등록된 캠페인은 신청자 0명
      totalCount: totalCount,
      daysLeft: daysLeft,
      // 상태 텍스트는 campaignHelpers의 getStatusMessage에서 자동 생성됨
    },
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
    // 새로 등록된 캠페인은 콘텐츠 없음
  };
}

/**
 * 배송형 캠페인 수정
 *
 * 설명:
 * - 기존 배송형 캠페인을 수정합니다.
 * - 캠페인 ID는 유지하고, 나머지 정보만 업데이트합니다.
 * - 신청자 데이터는 유지합니다.
 *
 * @param campaignId - 수정할 캠페인 ID
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 수정된 CampaignWithApplicants 객체
 */
export function updateDeliveryCampaign(
  campaignId: string,
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_1.png"
): CampaignWithApplicants {
  // 기존 캠페인 데이터 찾기
  const existingCampaign = deliveryCampaigns.find(
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
      campaignType: "배송형",
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
 * 새 배송형 캠페인을 deliveryCampaigns 배열에 추가
 *
 * 설명:
 * - 실제 프로덕션 환경에서는 API를 통해 서버에 저장해야 합니다.
 * - 현재는 클라이언트 사이드 더미 데이터 구조이므로,
 *   이 함수는 변환된 데이터를 반환만 합니다.
 * - 실제 저장은 localStorage나 API를 통해 처리해야 합니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 CampaignWithApplicants 객체
 */
export function addDeliveryCampaign(
  formData: CampaignFormData,
  imageUrl: string = "/images/main/campaign_img/eximg_1.png"
): CampaignWithApplicants {
  return createDeliveryCampaign(formData, imageUrl);
}

/* ========================================
   🚚 배송형 콘텐츠 조회 함수
   - 진행 중인 캠페인의 콘텐츠 데이터를 조회합니다
   ======================================== */

/**
 * 배송형 캠페인의 콘텐츠 데이터를 조회하는 함수
 *
 * 설명:
 * - 캠페인 ID를 받아서 해당 캠페인의 콘텐츠(검수 중/완료)를 반환합니다.
 * - 종료/취소된 캠페인은 getClosedContentsById 함수를 사용합니다.
 * - 진행 중인 캠페인은 deliveryCampaigns 배열에서 해당 ID를 찾아 contents를 반환합니다.
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
export function getDeliveryContentsById(campaignId: string): ContentByTab {
  // 종료/취소 탭 데이터(배송형): 902 매핑
  // 설명: 종료/취소된 캠페인은 deliveryClosedCampaigns에서 직접 가져옵니다.
  // 순환 참조를 피하기 위해 sharedCampaigns의 getClosedContentsById 대신 직접 접근합니다.
  if (campaignId === "902") {
    const closedCampaign = deliveryClosedCampaigns.find(
      (c) => c.campaignInfo.id === campaignId
    );
    if (closedCampaign?.contents) {
      return closedCampaign.contents;
    }
    return { reviewing: [], completed: [] };
  }

  // 진행 중인 캠페인의 콘텐츠 조회
  // 설명: deliveryCampaigns 배열에서 해당 ID의 캠페인을 찾아서 contents를 반환합니다.
  // find() 메서드: 배열에서 조건에 맞는 첫 번째 요소를 반환합니다.
  const campaign = deliveryCampaigns.find(
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
