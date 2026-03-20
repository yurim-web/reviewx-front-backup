/* ========================================
   🛒 SA 관리자 구매평 캠페인 상세 페이지 (동적)
   ======================================== */

/**
 * 구매평 캠페인 진행 현황 상세 페이지 (SA 관리자 버전)
 *
 * 목적: SA 관리자가 진행 현황 테이블에서 특정 구매평 캠페인을 클릭했을 때
 *       신청자/선정자 목록, 카드 이동, 엑셀 다운로드 등 상세 관리를 할 수 있도록 구성합니다.
 *
 * 참고:
 * - 공통 로직은 useCampaignProgressDetail 훅과 CampaignProgressDetailLayout 컴포넌트로 추출했습니다.
 * - GA 관리자와 동일한 구조를 사용하여 코드 중복을 제거했습니다.
 * - 구매평은 basic 카드 타입만 사용합니다.
 */

"use client";

import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import styles from "@/styles/partner/campaign_application/campaign_application.module.css";
import { useCampaignProgressDetail } from "@/hooks/manager/common/campaign/useCampaignProgressDetail";
import CampaignProgressDetailLayout, {
  type RenderCardFunction,
} from "@/components/manager/common/campaign/progress/CampaignProgressDetailLayout";

// 구매평 전용 카드 컴포넌트들 (basic 타입만 사용)
import BasicCard from "@/components/partner/campaign_application/card_type/basic/BasicCard";
import BasicSelectedCard from "@/components/partner/campaign_application/card_type/basic/BasicSelectedCard";

// 타입 정의
import type { AllApplicant, CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
import { type BasicApplicant } from "@/data/partner/campaign_application/delivery_applicants";

/**
 * 구매평 캠페인 상세 컴포넌트
 *
 * - 공통 로직은 useCampaignProgressDetail 훅을 사용합니다.
 * - 구매평 캠페인만의 카드 렌더링 로직을 render_card 함수로 정의합니다.
 * - BasicCard/BasicSelectedCard만 사용합니다.
 */
export default function ManagerReviewProgressDetailPage() {
  /**
   * URL 파라미터에서 캠페인 ID 추출
   */
  const params = useParams();
  const campaign_id = params.id as string;

  /**
   * 공통 로직 훅 사용
   */
  const {
    campaign_data,
    is_loading,
    error_message,
    active_tab,
    set_active_tab,
    sort_order,
    set_sort_order,
    sort_options,
    applicants_count,
    selected_count,
    current_applicants,
    handle_select_applicant,
    handle_cancel_applicant,
    handle_download_applicants,
    handle_download_selected,
  } = useCampaignProgressDetail(campaign_id, "SA 구매평");

  /**
   * 로딩 상태 처리
   */
  if (is_loading) {
    return <Loading />;
  }

  /**
   * 에러 상태 처리
   */
  if (error_message || !campaign_data) {
    return (
      <section className={styles.campaign_application_section}>
        <div className={styles.page_header}>
          <h1 className={styles.page_title}>캠페인 상세 보기</h1>
        </div>
        <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
          {error_message || "캠페인 데이터를 불러올 수 없습니다."}
        </div>
      </section>
    );
  }

  /**
   * 구매평 캠페인 카드 렌더링 함수
   * - 구매평은 basic 카드 타입만 사용
   * - 채널별 특화 정보 없음 (팔로워, 구독자 수 등)
   * - 기본 프로필 정보와 메모만 표시
   * - 📌 관리자 모드: 선정하기/선택 취소 버튼 비활성화 (빈 함수 전달)
   */
  const render_card: RenderCardFunction = (
    applicant: AllApplicant,
    is_selected: boolean,
    _campaign_data: CampaignWithApplicants | null,
    _handle_select: (id: string) => void,
    _handle_cancel: (id: string) => void
  ) => {
    // 관리자 모드: 버튼 비활성화를 위한 빈 함수
    const empty_handler = () => {};

    // 구매평은 항상 BasicApplicant 타입으로 처리
    const basic_applicant = applicant as BasicApplicant;

    if (is_selected) {
      return <BasicSelectedCard applicant={basic_applicant} onCancel={empty_handler} />;
    } else {
      return <BasicCard applicant={basic_applicant} onSelect={empty_handler} />;
    }
  };

  /**
   * 공통 레이아웃 컴포넌트 사용
   */
  return (
    <CampaignProgressDetailLayout
      campaign_data={campaign_data}
      active_tab={active_tab}
      set_active_tab={set_active_tab}
      sort_order={sort_order}
      set_sort_order={set_sort_order}
      sort_options={sort_options}
      applicants_count={applicants_count}
      selected_count={selected_count}
      current_applicants={current_applicants}
      handle_select_applicant={handle_select_applicant}
      handle_cancel_applicant={handle_cancel_applicant}
      handle_download_applicants={handle_download_applicants}
      handle_download_selected={handle_download_selected}
      render_card={render_card}
      campaign_id={campaign_id}
      manager_type="sa"
    />
  );
}
