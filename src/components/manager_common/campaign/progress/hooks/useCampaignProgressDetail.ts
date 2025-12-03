/* ========================================
   🎣 캠페인 진행현황 상세 페이지 공통 훅
   ======================================== */

/**
 * 캠페인 진행현황 상세 페이지 공통 로직 커스텀 훅
 *
 * 목적: 배송형, 미션형, 기자단, 구매평, 방문형 캠페인 상세 페이지에서
 *       공통으로 사용하는 상태 관리와 데이터 로딩 로직을 재사용 가능한 훅으로 추출합니다.
 *
 * 📍 사용 위치:
 * - src/app/manager_ga/campaign/progress/delivery/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/mission/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/reporter/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/review/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/visit/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/delivery/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/mission/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/reporter/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/review/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/visit/[id]/page.tsx
 *
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getCampaignById,
  type CampaignWithApplicants,
  type AllApplicant,
} from '@/data/partner/sharedCampaigns';

/**
 * 정렬 옵션 타입 정의
 * - latest: 최신순
 * - popular: 인기순
 * - deadline: 마감임박순
 * - point: 포인트순
 */
export type SortOption = 'latest' | 'popular' | 'deadline' | 'point';

/**
 * 탭 타입 정의
 * - applicants: 신청 탭
 * - selected: 선정 탭
 */
export type TabType = 'applicants' | 'selected';

/**
 * 커스텀 훅의 반환 타입 정의
 */
export interface UseCampaignProgressDetailReturn {
  // 캠페인 데이터
  campaign_data: CampaignWithApplicants | null;
  // 로딩 상태
  is_loading: boolean;
  // 에러 메시지
  error_message: string | null;
  // 활성 탭 (신청/선정)
  active_tab: TabType;
  set_active_tab: (tab: TabType) => void;
  // 정렬 옵션
  sort_order: SortOption;
  set_sort_order: (order: SortOption) => void;
  sort_options: Array<{ value: SortOption; label: string }>;
  // 신청자 목록 상태
  applicants_state: AllApplicant[];
  set_applicants_state: React.Dispatch<React.SetStateAction<AllApplicant[]>>;
  // 선정자 목록 상태
  selected_state: AllApplicant[];
  set_selected_state: React.Dispatch<React.SetStateAction<AllApplicant[]>>;
  // 카운트
  applicants_count: number;
  selected_count: number;
  // 현재 탭에 표시할 신청자 목록
  current_applicants: AllApplicant[];
  // 카드 이동 핸들러
  handle_select_applicant: (applicant_id: string) => void;
  handle_cancel_applicant: (applicant_id: string) => void;
  // 엑셀 다운로드 핸들러 (목업)
  handle_download_applicants: () => void;
  handle_download_selected: () => void;
}

/**
 * 캠페인 진행현황 상세 페이지 공통 로직 훅
 *
 * @param campaign_id - 캠페인 ID (URL 파라미터에서 추출)
 * @param error_log_prefix - 에러 로그에 사용할 접두사 (예: "GA 배송형", "SA 배송형")
 * @returns UseCampaignProgressDetailReturn - 상태와 핸들러 함수들
 */
export function useCampaignProgressDetail(
  campaign_id: string,
  error_log_prefix: string = 'GA',
): UseCampaignProgressDetailReturn {
  /**
   * 1) URL 쿼리 파라미터 처리
   * - useSearchParams: Next.js에서 URL 쿼리 파라미터를 읽는 Hook입니다
   * - ?tab=selected 같은 쿼리로 초기 탭을 설정할 수 있습니다
   */
  const search_params = useSearchParams();

  /**
   * 2) 캠페인 데이터 상태
   * - campaign_data: 캠페인 기본 정보와 신청자 데이터를 담는 상태
   * - is_loading: 데이터 로딩 중인지 여부를 나타내는 상태
   * - error_message: 에러 발생 시 사용자에게 보여줄 메시지
   */
  const [campaign_data, set_campaign_data] =
    useState<CampaignWithApplicants | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [error_message, set_error_message] = useState<string | null>(null);

  /**
   * 3) 탭 상태
   * - useState의 초기값을 함수로 전달: 초기 렌더링 시에만 실행됩니다
   * - URL 쿼리에 tab=selected가 있으면 선정 탭으로 시작합니다
   */
  const [active_tab, set_active_tab] = useState<TabType>(() => {
    const tab_param = search_params.get('tab');
    return tab_param === 'selected' ? 'selected' : 'applicants';
  });

  /**
   * 4) 정렬 상태
   * - sort_order: 현재 선택된 정렬 옵션
   * - sort_options: 정렬 옵션 목록 (드롭다운에 표시)
   */
  const [sort_order, set_sort_order] = useState<SortOption>('latest');
  const sort_options: Array<{ value: SortOption; label: string }> = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'deadline', label: '마감임박순' },
    { value: 'point', label: '포인트순' },
  ];

  /**
   * 5) 신청자/선정자 목록 상태
   * - applicants_state: 신청 탭에 표시할 신청자 목록
   * - selected_state: 선정 탭에 표시할 선정자 목록
   * - 카드 이동 시 이 두 상태를 업데이트합니다
   */
  const [applicants_state, set_applicants_state] = useState<AllApplicant[]>([]);
  const [selected_state, set_selected_state] = useState<AllApplicant[]>([]);

  // ============================================================
  // 6) 캠페인 데이터 로딩
  // ============================================================
  /**
   * - useEffect: 컴포넌트가 마운트되거나 campaign_id가 변경될 때 실행됩니다
   * - try/catch/finally: 에러 처리를 위한 패턴입니다
   */
  useEffect(() => {
    const load_campaign_data = async () => {
      try {
        // 로딩 시작
        set_is_loading(true);
        set_error_message(null);

        // 캠페인 데이터 가져오기
        const data = getCampaignById(campaign_id);
        if (!data) {
          set_error_message(`캠페인을 찾을 수 없습니다. (ID: ${campaign_id})`);
          return;
        }

        // 데이터 설정
        set_campaign_data(data);
        // 옵셔널 체이닝(?.)과 null 병합 연산자(??)를 사용하여 안전하게 데이터 설정
        // applicantData가 없을 수 있으므로 빈 배열을 기본값으로 사용합니다
        set_applicants_state(data.applicantData?.applicants ?? []);
        set_selected_state(data.applicantData?.selectedApplicants ?? []);
      } catch (error) {
        // 에러 발생 시 콘솔에 로그 출력 및 사용자에게 메시지 표시
        console.error(`${error_log_prefix} 진행현황 데이터 로딩 실패:`, error);
        set_error_message('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        // 성공/실패 여부와 관계없이 로딩 상태를 false로 설정
        set_is_loading(false);
      }
    };

    // campaign_id가 있을 때만 데이터 로딩
    if (campaign_id) {
      load_campaign_data();
    }
  }, [campaign_id, error_log_prefix]);

  // ============================================================
  // 7) 카운트 계산
  // ============================================================
  /**
   * - 배열의 length 속성을 사용하여 개수를 계산합니다
   */
  const applicants_count = applicants_state.length;
  const selected_count = selected_state.length;

  // ============================================================
  // 8) 현재 탭에 표시할 신청자 목록 계산
  // ============================================================
  /**
   * - active_tab에 따라 다른 배열을 반환합니다
   */
  const get_current_applicants = (): AllApplicant[] => {
    switch (active_tab) {
      case 'applicants':
        return applicants_state;
      case 'selected':
        return selected_state;
      default:
        return applicants_state;
    }
  };

  const current_applicants = get_current_applicants();

  // ============================================================
  // 9) 신청자 선정 핸들러
  // ============================================================
  /**
   * - 신청 탭에서 선정 탭으로 카드를 이동시킵니다
   * - 함수형 업데이트: setState에 함수를 전달하여 이전 상태를 기반으로 업데이트합니다
   */
  const handle_select_applicant = (applicant_id: string) => {
    set_applicants_state((prev) => {
      // 신청자 목록에서 해당 ID를 가진 신청자 찾기
      const target = prev.find((applicant) => applicant.id === applicant_id);
      if (!target) return prev; // 찾지 못하면 이전 상태 그대로 반환

      // 신청자 목록에서 해당 신청자 제거
      const next_applicants = prev.filter(
        (applicant) => applicant.id !== applicant_id,
      );

      // 선정 상태로 변경하여 선정자 목록에 추가
      const moved: AllApplicant = {
        ...target,
        selectionStatus: '선정하기',
      } as AllApplicant;

      // 선정자 목록에 추가 (중복 방지)
      set_selected_state((prev_selected) => {
        const already = prev_selected.some(
          (applicant) => applicant.id === applicant_id,
        );
        if (already) return prev_selected; // 이미 있으면 추가하지 않음
        return [moved, ...prev_selected]; // 맨 앞에 추가
      });

      // 업데이트된 신청자 목록 반환
      return next_applicants;
    });
  };

  // ============================================================
  // 10) 선정 취소 핸들러
  // ============================================================
  /**
   * - 선정 탭에서 신청 탭으로 카드를 이동시킵니다
   */
  const handle_cancel_applicant = (applicant_id: string) => {
    set_selected_state((prev_selected) => {
      // 선정자 목록에서 해당 ID를 가진 선정자 찾기
      const target = prev_selected.find(
        (applicant) => applicant.id === applicant_id,
      );
      if (!target) return prev_selected;

      // 선정자 목록에서 해당 선정자 제거
      const next_selected = prev_selected.filter(
        (applicant) => applicant.id !== applicant_id,
      );

      // 미선택 상태로 변경하여 신청자 목록에 추가
      const moved: AllApplicant = {
        ...target,
        selectionStatus: '미선택',
      } as AllApplicant;

      // 신청자 목록에 추가 (중복 방지)
      set_applicants_state((prev) => {
        const already = prev.some((applicant) => applicant.id === applicant_id);
        if (already) return prev;
        return [moved, ...prev]; // 맨 앞에 추가
      });

      // 업데이트된 선정자 목록 반환
      return next_selected;
    });
  };

  // ============================================================
  // 11) 엑셀 다운로드 핸들러 (목업)
  // ============================================================
  /**
   * - 현재는 빈 함수로, 추후 실제 다운로드 로직을 구현할 수 있습니다
   */
  const handle_download_applicants = () => {
    // TODO: 신청자 목록 다운로드 기능 구현
  };

  const handle_download_selected = () => {
    // TODO: 선정자 목록 다운로드 기능 구현
  };

  // ============================================================
  // 12) 훅 반환 값
  // ============================================================
  /**
   * - 모든 상태와 핸들러 함수를 객체로 반환합니다
   * - 이렇게 하면 사용하는 컴포넌트에서 필요한 것만 구조 분해 할당으로 가져올 수 있습니다
   */
  return {
    campaign_data,
    is_loading,
    error_message,
    active_tab,
    set_active_tab,
    sort_order,
    set_sort_order,
    sort_options,
    applicants_state,
    set_applicants_state,
    selected_state,
    set_selected_state,
    applicants_count,
    selected_count,
    current_applicants,
    handle_select_applicant,
    handle_cancel_applicant,
    handle_download_applicants,
    handle_download_selected,
  };
}
