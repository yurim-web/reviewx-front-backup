/* ========================================
   🏠 메인 홈 페이지 컴포넌트 (공통)
   ======================================== */

/**
 * 메인 홈 페이지 컴포넌트 (공통)
 *
 * 목적: 루트, 유저, 파트너 메인 홈 페이지에서 공통으로 사용하는 컴포넌트입니다.
 *
 * 사용 위치:
 * - / (루트 메인 홈 페이지)
 * - /user (유저 메인 홈 페이지)
 * - /partner (파트너 메인 홈 페이지)
 *
 * 주요 기능:
 * - 메인 배너 표시
 * - 선정 확률 높은 캠페인 섹션 (신청자가 적은 캠페인 8개, 마감 제외)
 * - 지금 인기 많은 캠페인 섹션 (참여자가 많은 캠페인 8개, 마감 제외)
 * - 진행 중인 캠페인 섹션 (전체 캠페인 중 최대 32개, 마감 제외)
 * - 캠페인 상세 페이지로 이동
 * - 메인 메뉴 상단 고정
 */

// 컴포넌트들을 import
// @/는 src/를 가리키는 별칭입니다 (tsconfig.json에서 설정됨)
import { useMemo } from "react";
import MainMenu from "@/components/main/MainMenu";
import CampaignBox from "@/components/main/CampaignBox";
import styles from "@/styles/home/home.module.css";
import Titletext from "@/components/main/Titletext";

// 각 캠페인 타입별 실제 데이터를 import
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";

/**
 * 시드 기반 난수 생성기 (선형 합동 생성기)
 * 같은 시드 값이면 항상 같은 난수 시퀀스를 생성합니다
 *
 * @param seed - 시드 값
 * @returns 난수 생성 함수
 */
function seeded_random(seed: number) {
  // 선형 합동 생성기 (Linear Congruential Generator)
  // 같은 시드 값이면 항상 같은 난수 시퀀스를 생성합니다
  let current_seed = seed;
  return () => {
    // 선형 합동 생성기 공식: (a * seed + c) % m
    current_seed = (current_seed * 9301 + 49297) % 233280;
    return current_seed / 233280; // 0과 1 사이의 값으로 정규화
  };
}

/**
 * 배열을 무작위로 섞는 함수 (Fisher-Yates 알고리즘, 시드 기반)
 * 같은 시드 값이면 항상 같은 순서로 섞입니다
 *
 * @param array - 섞을 배열
 * @param seed - 시드 값 (선택적, 없으면 날짜 기반 시드 사용)
 * @returns 무작위로 섞인 새 배열
 */
function shuffle_array<T>(array: T[], seed?: number): T[] {
  // 배열을 복사하여 원본 배열을 변경하지 않습니다
  const shuffled = [...array];

  // 시드 값이 없으면 오늘 날짜를 시드로 사용 (같은 날에는 같은 순서)
  // Date 객체를 사용하여 오늘 날짜를 문자열로 변환하고 해시값을 생성합니다
  const date_string = new Date().toISOString().split("T")[0]; // "2025-01-15" 형식
  const date_seed =
    seed ||
    date_string.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // 시드 기반 난수 생성기 생성
  const random = seeded_random(date_seed);

  // Fisher-Yates 알고리즘: 배열의 끝에서부터 시작하여 무작위로 섞습니다
  for (let i = shuffled.length - 1; i > 0; i--) {
    // 시드 기반 난수 생성기를 사용하여 항상 같은 순서로 섞입니다
    const random_index = Math.floor(random() * (i + 1));

    // 배열의 두 요소를 교환합니다 (구조분해할당 사용)
    [shuffled[i], shuffled[random_index]] = [
      shuffled[random_index],
      shuffled[i],
    ];
  }

  return shuffled;
}

/**
 * 마감되지 않은 캠페인 필터링 함수
 *
 * 모집 기간이 진행 중인 캠페인만 반환합니다 (마감된 캠페인 제외)
 *
 * @param campaign - 필터링할 캠페인 객체
 * @param today - 오늘 날짜 (시간 정보 제거된 Date 객체)
 * @returns 마감되지 않은 캠페인인지 여부
 */
function isNotClosed(
  campaign: {
    detailedSchedule?: {
      applicationStart: string;
      applicationEnd: string;
    };
    recruitment: { current: number };
  },
  today: Date
): boolean {
  // detailedSchedule이 있는 경우 날짜 기반으로 필터링
  if (campaign.detailedSchedule) {
    const { applicationStart, applicationEnd } = campaign.detailedSchedule;

    // 날짜 파싱
    const startDate = new Date(applicationStart);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(applicationEnd);
    endDate.setHours(0, 0, 0, 0);

    // 모집 기간이 진행 중인 캠페인만 포함 (마감 제외)
    // applicationStart <= 오늘 <= applicationEnd
    return today >= startDate && today <= endDate;
  }

  // detailedSchedule이 없는 경우 기존 로직 유지 (하위 호환성)
  // 참여자가 있는 캠페인만 포함
  return campaign.recruitment.current > 0;
}

/**
 * 메인 홈 페이지 공통 컴포넌트
 *
 * @returns 메인 홈 페이지 JSX 요소
 */
export default function HomePageClient() {
  // 오늘 날짜 (시간 정보 제거) - 모든 필터링에서 공통으로 사용
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  /**
   * 선정 확률 높은 캠페인 - 신청자가 적은 캠페인을 무작위로 선택 (무조건 8개 노출)
   *
   * 로직:
   * 1. 모든 캠페인을 수집
   * 2. 마감되지 않은 캠페인만 필터링
   * 3. 신청자 수가 적은 캠페인만 필터링 (신청자 수 100명 이하)
   * 4. 신청자 수가 적은 순서로 정렬
   * 5. 무작위로 섞어서 최대 8개 선택
   * 6. 8개 미만이면 신청자가 적은 순서대로 추가로 채우기
   *
   * useMemo: 의존성 배열에 today를 포함하여 날짜가 바뀔 때마다 재계산됩니다
   */
  const high_probability_campaigns = useMemo(() => {
    // 모든 캠페인을 하나의 배열로 합칩니다
    // 스프레드 연산자(...): 배열을 펼쳐서 새 배열에 추가합니다
    const all_campaigns = [
      ...deliveryCampaigns,
      ...reviewCampaigns,
      ...visitCampaigns,
      ...missionCampaigns,
      ...reporterCampaigns,
    ];

    // 마감되지 않은 캠페인만 필터링
    const not_closed_campaigns = all_campaigns.filter((campaign) =>
      isNotClosed(campaign, today)
    );

    // 신청자가 적은 캠페인만 필터링 (신청자 수 100명 이하)
    // filter: 조건에 맞는 요소만 추출합니다
    // recruitment.current: 현재 신청자 수
    // 신청자 수가 100명 이하인 캠페인만 선택합니다
    const low_applicant_campaigns = not_closed_campaigns.filter(
      (campaign) => campaign.recruitment.current <= 100
    );

    // 신청자가 적은 순서로 정렬
    // sort: 배열을 정렬합니다
    // 신청자 수가 적을수록 앞에 오도록 정렬합니다
    const sorted_by_applicants = [...low_applicant_campaigns].sort((a, b) => {
      // 신청자 수가 적은 순서대로 정렬 (신청자가 적은 캠페인이 우선)
      return a.recruitment.current - b.recruitment.current;
    });

    // 신청자 수가 가장 적은 캠페인들(5명 이하)을 우선 선택
    const very_low_applicant_campaigns = sorted_by_applicants.filter(
      (campaign) => campaign.recruitment.current <= 5
    );

    // 나머지 캠페인들
    const other_campaigns = sorted_by_applicants.filter(
      (campaign) => campaign.recruitment.current > 5
    );

    // 신청자 수가 매우 적은 캠페인들을 우선적으로 선택 (최대 8개)
    let selected = very_low_applicant_campaigns.slice(0, 8);

    // 8개 미만이면 나머지 캠페인에서 추가로 채우기
    if (selected.length < 8) {
      // 이미 선택된 캠페인 ID를 Set으로 저장 (중복 방지)
      const selected_ids = new Set(selected.map((c) => c.id));

      // 나머지 캠페인에서 추가로 선택
      for (const campaign of other_campaigns) {
        if (selected.length >= 8) break; // 8개가 되면 중단
        if (!selected_ids.has(campaign.id)) {
          // 중복되지 않은 캠페인만 추가
          selected.push(campaign);
          selected_ids.add(campaign.id);
        }
      }
    }

    // 최종적으로 무작위로 섞어서 반환 (8개)
    return shuffle_array(selected).slice(0, 8);
  }, [today]);

  /**
   * 지금 인기 많은 캠페인 - 참여자가 많은 캠페인을 무작위로 선택
   *
   * 로직:
   * 1. 모든 캠페인을 수집
   * 2. 마감되지 않은 캠페인만 필터링
   * 3. 참여자 수가 많은 캠페인 필터링 (현재 참여자 수가 전체 모집 인원의 50% 이상)
   * 4. 무작위로 섞어서 각 타입별로 1-2개씩 선택
   *
   * useMemo: 의존성 배열에 today를 포함하여 날짜가 바뀔 때마다 재계산됩니다
   */
  const popular_campaigns = useMemo(() => {
    // 모든 캠페인을 하나의 배열로 합칩니다
    const all_campaigns = [
      ...deliveryCampaigns,
      ...reviewCampaigns,
      ...visitCampaigns,
      ...missionCampaigns,
      ...reporterCampaigns,
    ];

    // 마감되지 않은 캠페인만 필터링
    const not_closed_campaigns = all_campaigns.filter((campaign) =>
      isNotClosed(campaign, today)
    );

    // 참여자가 많은 캠페인 필터링
    // 참여율이 50% 이상인 캠페인만 선택합니다
    const high_participation_campaigns = not_closed_campaigns.filter(
      (campaign) => {
        const participation_rate =
          campaign.recruitment.total > 0
            ? campaign.recruitment.current / campaign.recruitment.total
            : 0;
        return participation_rate >= 0.5; // 참여율 50% 이상
      }
    );

    // 무작위로 섞기
    const shuffled = shuffle_array(high_participation_campaigns);

    // 각 타입별로 1-2개씩 선택
    const selected_by_type: Record<string, (typeof shuffled)[0][]> = {
      배송형: [],
      구매평: [],
      방문형: [],
      미션형: [],
      기자단: [],
    };

    // 무작위로 섞인 캠페인을 순회하며 각 타입별로 최대 2개씩 선택
    for (const campaign of shuffled) {
      const category = campaign.category as keyof typeof selected_by_type;
      if (
        category in selected_by_type &&
        selected_by_type[category].length < 2
      ) {
        selected_by_type[category].push(campaign);
      }
    }

    // 각 타입별로 선택된 캠페인을 합칩니다
    const selected = [
      ...selected_by_type.배송형,
      ...selected_by_type.구매평,
      ...selected_by_type.방문형,
      ...selected_by_type.미션형.slice(0, 1), // 미션형은 1개만
      ...selected_by_type.기자단.slice(0, 1), // 기자단은 1개만
    ];

    // 최대 8개까지 선택
    return selected.slice(0, 8);
  }, [today]);

  /**
   * 진행 중인 캠페인 - 현재 진행 중인 캠페인 32개를 무작위로 선택
   *
   * 로직:
   * 1. 모든 캠페인을 수집
   * 2. 마감되지 않은 캠페인만 필터링
   * 3. 무작위로 섞어서 최대 32개 선택
   *
   * useMemo: 의존성 배열에 today를 포함하여 날짜가 바뀔 때마다 재계산됩니다
   */
  const ongoing_campaigns = useMemo(() => {
    // 모든 캠페인을 하나의 배열로 합칩니다
    const all_campaigns = [
      ...deliveryCampaigns,
      ...reviewCampaigns,
      ...visitCampaigns,
      ...missionCampaigns,
      ...reporterCampaigns,
    ];

    // 마감되지 않은 캠페인만 필터링
    const active_campaigns = all_campaigns.filter((campaign) =>
      isNotClosed(campaign, today)
    );

    // 무작위로 섞기
    const shuffled = shuffle_array(active_campaigns);

    // 최대 32개만 선택
    return shuffled.slice(0, 32);
  }, [today]);

  return (
    // React Fragment (<>...</>) 사용
    // 불필요한 div 래퍼 없이 여러 요소를 그룹화할 수 있습니다
    <>
      {/* 메인 메뉴 컴포넌트 - 헤더(80px) 밑에 고정 */}
      <MainMenu />

      {/* 
        레이아웃 시프트 방지를 위한 placeholder 
        - 헤더(80px) + MainMenu(약 69px) = 149px
        - fixed된 헤더와 메뉴가 콘텐츠를 가리지 않도록 공간 확보
      */}
      <div style={{ height: "149px" }}></div>

      {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 메인 콘텐츠 영역 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
      <article className={styles.container}>
        {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 상단 배너 부분 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
        <section className={styles.main_banner_container}>
          <div className={styles.main_banner}>
            {/* public 폴더의 이미지 사용 */}
            {/* /images/main/main_banner.png는 public/images/main/main_banner.png를 가리킵니다 */}
            <img src="/images/main/main_banner.png" alt="main_banner" />
          </div>
        </section>

        {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 선정 확률 높은 캠페인 영역 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
        <section className={styles.campaign_container}>
          {/* 제목 컴포넌트 */}
          <Titletext main_title="선정 확률 높은 캠페인" />

          {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 캠페인 그리드 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
          <div className={styles.campaign_grid}>
            {/* JavaScript의 map 함수를 사용한 리스트 렌더링 */}
            {/* 각 캠페인 타입에서 가져온 데이터를 CampaignBox 컴포넌트로 변환 */}
            {/* map: 배열의 각 요소를 순회하며 새로운 요소를 생성합니다 */}
            {high_probability_campaigns.map((campaign) => (
              // key prop은 React에서 리스트 렌더링 시 필수입니다
              // 각 요소를 고유하게 식별하기 위해 사용됩니다
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 지금 인기 많은 캠페인 영역 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
        <section className={styles.campaign_container}>
          {/* 제목 컴포넌트 */}
          <Titletext main_title="지금 인기 많은 캠페인" />

          {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 캠페인 그리드 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
          <div className={styles.campaign_grid}>
            {/* JavaScript의 map 함수를 사용한 리스트 렌더링 */}
            {/* 각 캠페인 타입에서 가져온 데이터를 CampaignBox 컴포넌트로 변환 */}
            {popular_campaigns.map((campaign) => (
              // key prop은 React에서 리스트 렌더링 시 필수입니다
              // 각 요소를 고유하게 식별하기 위해 사용됩니다
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 진행 중인 캠페인 영역 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
        <section className={styles.campaign_container}>
          {/* 제목 컴포넌트 */}
          <Titletext main_title="진행 중인 캠페인" />

          {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 캠페인 그리드 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
          <div className={styles.campaign_grid}>
            {/* JavaScript의 map 함수를 사용한 리스트 렌더링 */}
            {/* 전체 캠페인 중 최대 32개까지 진행 중인 캠페인 노출 */}
            {ongoing_campaigns.map((campaign) => (
              // key prop은 React에서 리스트 렌더링 시 필수입니다
              // 각 요소를 고유하게 식별하기 위해 사용됩니다
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
