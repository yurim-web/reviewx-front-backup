/* ========================================
   🚚 GA 관리자 배송형 캠페인 상세 페이지 (동적)
   ======================================== */

/**
 * 배송형 캠페인 진행 현황 상세 페이지 (GA 관리자 버전)
 *
 * 목적: GA 관리자가 진행 현황 테이블에서 특정 배송형 캠페인을 클릭했을 때
 *       신청자/선정자 목록, 카드 이동, 엑셀 다운로드 등 상세 관리를 학습/체험할 수 있도록 구성합니다.
 *
 * 참고:
 * - 파트너 센터의 `/partner/campaign_application/delivery/[id]` 페이지 구조를 그대로 차용했습니다.
 * - GA 관리자 페이지에 맞게 주석과 용어를 재정비했습니다.
 * - 공통 로직은 useCampaignProgressDetail 훅과 CampaignProgressDetailLayout 컴포넌트로 추출했습니다.
 *
 */

'use client';

import { useParams } from 'next/navigation';
import Loading from '@/app/loading';
import styles from '@/styles/partner/campaign_application/campaign_application.module.css';
import { useCampaignProgressDetail } from '@/hooks/manager/common/campaign/useCampaignProgressDetail';
import CampaignProgressDetailLayout, {
  type RenderCardFunction,
} from '@/components/manager/ga/campaign/progress/CampaignProgressDetailLayout';

// 배송형 카드 컴포넌트 (채널별 렌더링)
import NaverBlogCard from '@/components/partner/campaign_application/card_type/naverblog/NaverBlogCard';
import NaverClipCard from '@/components/partner/campaign_application/card_type/naverclip/NaverClipCard';
import NaverClipSelectedCard from '@/components/partner/campaign_application/card_type/naverclip/NaverClipSelectedCard';
import InstagramCard from '@/components/partner/campaign_application/card_type/instagram/InstagramCard';
import InstagramSelectedCard from '@/components/partner/campaign_application/card_type/instagram/InstagramSelectedCard';
import YoutubeCard from '@/components/partner/campaign_application/card_type/youtube/YoutubeCard';
import YoutubeSelectedCard from '@/components/partner/campaign_application/card_type/youtube/YoutubeSelectedCard';

// 타입 정의
import type {
  AllApplicant,
  CampaignWithApplicants,
} from '@/data/partner/sharedCampaigns';
import {
  type Applicant,
  type NaverClipApplicant,
  type InstagramApplicant,
  type YoutubeApplicant,
} from '@/data/partner/campaign_application/delivery_applicants';

/**
 * 배송형 캠페인 상세 컴포넌트
 *
 * - 공통 로직은 useCampaignProgressDetail 훅을 사용합니다.
 * - 배송형 캠페인만의 카드 렌더링 로직을 render_card 함수로 정의합니다.
 * - 공통 레이아웃은 CampaignProgressDetailLayout 컴포넌트를 사용합니다.
 */
export default function ManagerDeliveryProgressDetailPage() {
  /**
   * URL 파라미터에서 캠페인 ID 추출
   * - useParams: Next.js에서 동적 라우트 파라미터를 읽는 Hook입니다
   */
  const params = useParams();
  const campaign_id = params.id as string;

  /**
   * 공통 로직 훅 사용
   * - useCampaignProgressDetail: 상태 관리, 데이터 로딩, 핸들러 함수들을 제공합니다
   * - error_log_prefix: 에러 로그에 표시할 접두사입니다
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
  } = useCampaignProgressDetail(campaign_id, 'GA 배송형');

  /**
   * 로딩 상태 처리
   * - is_loading이 true이면 로딩 컴포넌트를 반환합니다
   */
  if (is_loading) {
    return <Loading />;
  }

  /**
   * 에러 상태 처리
   * - error_message가 있거나 campaign_data가 없으면 에러 메시지를 표시합니다
   */
  if (error_message || !campaign_data) {
    return (
      <section className={styles.campaign_application_section}>
        <div className={styles.page_header}>
          <h1 className={styles.page_title}>캠페인 상세 보기</h1>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
          {error_message}
        </div>
      </section>
    );
  }

  /**
   * 배송형 캠페인 카드 렌더링 함수
   * - 채널별로 다른 카드 컴포넌트를 렌더링합니다
   * - 네이버블로그, 네이버클립, 인스타그램, 유튜브 채널을 지원합니다
   * - RenderCardFunction 타입: 공통 레이아웃 컴포넌트에서 요구하는 함수 시그니처입니다
   */
  const render_card: RenderCardFunction = (
    applicant: AllApplicant,
    is_selected: boolean,
    campaign_data: CampaignWithApplicants | null,
    handle_select: (id: string) => void,
    handle_cancel: (id: string) => void,
  ) => {
    // 채널별로 다른 카드 컴포넌트를 렌더링합니다
    switch (applicant.channel) {
      case '네이버블로그':
        return (
          <NaverBlogCard
            applicant={applicant as Applicant}
            variant={is_selected ? 'selected' : 'applicant'}
            onSelect={handle_select}
            onCancel={handle_cancel}
          />
        );
      case '네이버클립':
        return is_selected ? (
          <NaverClipSelectedCard
            applicant={applicant as NaverClipApplicant}
            onCancel={handle_cancel}
          />
        ) : (
          <NaverClipCard
            applicant={applicant as NaverClipApplicant}
            onSelect={handle_select}
          />
        );
      case '인스타그램':
        return is_selected ? (
          <InstagramSelectedCard
            applicant={applicant as InstagramApplicant}
            onCancel={handle_cancel}
          />
        ) : (
          <InstagramCard
            applicant={applicant as InstagramApplicant}
            onSelect={handle_select}
          />
        );
      case '유튜브':
        return is_selected ? (
          <YoutubeSelectedCard
            applicant={applicant as YoutubeApplicant}
            onCancel={handle_cancel}
          />
        ) : (
          <YoutubeCard
            applicant={applicant as YoutubeApplicant}
            onSelect={handle_select}
          />
        );
      default:
        // 기본값: 네이버블로그 카드 사용
        return (
          <NaverBlogCard
            applicant={applicant as unknown as Applicant}
            variant={is_selected ? 'selected' : 'applicant'}
            onSelect={handle_select}
            onCancel={handle_cancel}
          />
        );
    }
  };

  /**
   * 공통 레이아웃 컴포넌트 사용
   * - CampaignProgressDetailLayout: 페이지의 공통 구조를 제공합니다
   * - render_card: 배송형 캠페인만의 카드 렌더링 로직을 전달합니다
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
    />
  );
}
