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
 *
 * 학습 포인트:
 * 1. Next.js 동적 라우팅 (`/manager_ga/progress/delivery/[id]`)
 * 2. `useParams`, `useSearchParams`로 URL, 쿼리 파라미터 읽기
 * 3. `useState`, `useEffect` Hook으로 비동기 데이터 로딩/상태 전환
 * 4. 카드 형식 조건부 렌더링 (채널별 전용 카드)
 * 5. 정렬 컨트롤과 탭 전환 로직
 * 6. React에서 리스트 렌더링 시 `key` 구성
 * 7. GA 관리자가 클릭해서 학습할 수 있도록 상세 주석 포함
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Loading from '@/app/loading';
import styles from '@/styles/partner/campaign_application/campaign_application.module.css';
import detailStyles from '@/styles/manager_ga/campaign_detail.module.css';
import SortFilterControl from '@/components/partner/campaign_application/SortFilterControl';
import Campaignbanner from '@/components/partner/campaign_application/CampaignInfoBox';
import ExcelDownloadBtn from '@/components/partner/campaign_application/ExcelDownloadBtn';
import EmptyApplicantsList from '@/components/partner/campaign_application/EmptyApplicantsList';

// 배송형 카드 컴포넌트 (채널별 렌더링)
import NaverBlogCard from '@/components/partner/campaign_application/card_type/naverblog/NaverBlogCard';
import NaverClipCard from '@/components/partner/campaign_application/card_type/naverclip/NaverClipCard';
import NaverClipSelectedCard from '@/components/partner/campaign_application/card_type/naverclip/NaverClipSelectedCard';
import InstagramCard from '@/components/partner/campaign_application/card_type/instagram/InstagramCard';
import InstagramSelectedCard from '@/components/partner/campaign_application/card_type/instagram/InstagramSelectedCard';
import YoutubeCard from '@/components/partner/campaign_application/card_type/youtube/YoutubeCard';
import YoutubeSelectedCard from '@/components/partner/campaign_application/card_type/youtube/YoutubeSelectedCard';

// 공용 캠페인 데이터/타입
import {
  getCampaignById,
  type CampaignWithApplicants,
  type AllApplicant,
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
 * - GA 관리자 맥락이지만, 컴포넌트 구조/로직은 파트너 센터 버전과 동일합니다.
 * - hook, 타입, props 설명을 세부 주석으로 담아 React/TypeScript 학습 자료로 활용합니다.
 */
export default function ManagerDeliveryProgressDetailPage() {
  /**
   * 1) URL 기반 상태
   * - `useParams` : /delivery/[id] 값 추출
   * - `useSearchParams` : ?tab=selected 같은 쿼리 처리
   */
  const params = useParams();
  const search_params = useSearchParams();
  const campaign_id = params.id as string;

  /**
   * 2) 데이터 상태
   * - `campaign_data`: 캠페인 기본/신청자 정보
   * - `is_loading`: 비동기 로딩 스피너 제어
   * - `error_message`: 실패 시 사용자 안내
   */
  const [campaign_data, set_campaign_data] =
    useState<CampaignWithApplicants | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [error_message, set_error_message] = useState<string | null>(null);

  /**
   * 3) 탭 상태
   * - 기본값: 신청 탭
   * - 쿼리에 tab=selected가 오면 선정 탭으로 진입 (북마크/공유 시 편리)
   */
  const [active_tab, set_active_tab] = useState<'applicants' | 'selected'>(
    () => {
      const tab_param = search_params.get('tab');
      return tab_param === 'selected' ? 'selected' : 'applicants';
    },
  );

  /**
   * 4) 정렬 상태 및 옵션 타입
   * - SortFilterControl 컴포넌트와 연동
   */
  type SortOption = 'latest' | 'popular' | 'deadline' | 'point';
  const [sort_order, set_sort_order] = useState<SortOption>('latest');
  const sort_options = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'deadline', label: '마감임박순' },
    { value: 'point', label: '포인트순' },
  ];

  /**
   * 5) 신청/선정 카드 상태
   * - `applicants_state`: 신청 탭에 보여줄 카드 목록
   * - `selected_state`: 선정 탭에 보여줄 카드 목록
   * - 카드 이동 시 상태를 직접 옮겨 React 상태 관리 학습 가능
   */
  const [applicants_state, set_applicants_state] = useState<AllApplicant[]>([]);
  const [selected_state, set_selected_state] = useState<AllApplicant[]>([]);

  /**
   * 6) useEffect로 캠페인 데이터 로딩
   * - mount 시점 또는 campaign_id 변경 시 재실행
   * - try/catch + finally 패턴
   */
  useEffect(() => {
    const load_campaign_data = async () => {
      try {
        set_is_loading(true);
        set_error_message(null);

        const data = getCampaignById(campaign_id);
        if (!data) {
          set_error_message(`캠페인을 찾을 수 없습니다. (ID: ${campaign_id})`);
          return;
        }

        set_campaign_data(data);
        set_applicants_state(data.applicantData.applicants);
        set_selected_state(data.applicantData.selectedApplicants);
      } catch (error) {
        console.error('GA 배송형 진행현황 데이터 로딩 실패:', error);
        set_error_message('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        set_is_loading(false);
      }
    };

    if (campaign_id) {
      load_campaign_data();
    }
  }, [campaign_id]);

  /**
   * 7) 로딩/에러 처리
   */
  if (is_loading) {
    return <Loading />;
  }

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
   * 8) 카운트/렌더링 유틸
   */
  const applicants_count = applicants_state.length;
  const selected_count = selected_state.length;

  const get_current_applicants = () => {
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

  /**
   * 9) 카드 렌더링 함수
   * - 채널별 컴포넌트 분기 (네이버블로그/클립/인스타/유튜브)
   * - GA 관리자도 동일한 컴포넌트 재사용
   */
  const render_card_component = (
    applicant: AllApplicant,
    is_selected: boolean = false,
  ) => {
    switch (applicant.channel) {
      case '네이버블로그':
        return (
          <NaverBlogCard
            applicant={applicant as Applicant}
            variant={is_selected ? 'selected' : 'applicant'}
            onSelect={handle_select_applicant}
            onCancel={handle_cancel_applicant}
          />
        );
      case '네이버클립':
        return is_selected ? (
          <NaverClipSelectedCard
            applicant={applicant as NaverClipApplicant}
            onCancel={handle_cancel_applicant}
          />
        ) : (
          <NaverClipCard
            applicant={applicant as NaverClipApplicant}
            onSelect={handle_select_applicant}
          />
        );
      case '인스타그램':
        return is_selected ? (
          <InstagramSelectedCard
            applicant={applicant as InstagramApplicant}
            onCancel={handle_cancel_applicant}
          />
        ) : (
          <InstagramCard
            applicant={applicant as InstagramApplicant}
            onSelect={handle_select_applicant}
          />
        );
      case '유튜브':
        return is_selected ? (
          <YoutubeSelectedCard
            applicant={applicant as YoutubeApplicant}
            onCancel={handle_cancel_applicant}
          />
        ) : (
          <YoutubeCard
            applicant={applicant as YoutubeApplicant}
            onSelect={handle_select_applicant}
          />
        );
      default:
        return (
          <NaverBlogCard
            applicant={applicant as unknown as Applicant}
            variant={is_selected ? 'selected' : 'applicant'}
            onSelect={handle_select_applicant}
            onCancel={handle_cancel_applicant}
          />
        );
    }
  };

  /**
   * 10) 카드 이동 핸들러
   */
  const handle_select_applicant = (applicant_id: string) => {
    set_applicants_state((prev) => {
      const target = prev.find((applicant) => applicant.id === applicant_id);
      if (!target) return prev;

      const next_applicants = prev.filter(
        (applicant) => applicant.id !== applicant_id,
      );
      const moved: AllApplicant = {
        ...target,
        selectionStatus: '선정하기',
      } as AllApplicant;

      set_selected_state((prev_selected) => {
        const already = prev_selected.some(
          (applicant) => applicant.id === applicant_id,
        );
        if (already) return prev_selected;
        return [moved, ...prev_selected];
      });

      return next_applicants;
    });
  };

  const handle_cancel_applicant = (applicant_id: string) => {
    set_selected_state((prev_selected) => {
      const target = prev_selected.find(
        (applicant) => applicant.id === applicant_id,
      );
      if (!target) return prev_selected;

      const next_selected = prev_selected.filter(
        (applicant) => applicant.id !== applicant_id,
      );
      const moved: AllApplicant = {
        ...target,
        selectionStatus: '미선택',
      } as AllApplicant;

      set_applicants_state((prev) => {
        const already = prev.some((applicant) => applicant.id === applicant_id);
        if (already) return prev;
        return [moved, ...prev];
      });

      return next_selected;
    });
  };

  /**
   * 11) 엑셀 다운로드 (목업)
   */
  const handle_download_applicants = () => {
    console.log('[GA 배송형] 신청자 목록 다운로드');
  };

  const handle_download_selected = () => {
    console.log('[GA 배송형] 선정자 목록 다운로드');
  };

  /**
   * 12) JSX 구성
   * - Page Header
   * - 캠페인 정보 + 정렬/다운로드 + 탭 + 신청자 그리드
   */
  return (
    <div className={detailStyles.detail_page_wrapper}>
      <div className={detailStyles.content_container}>
        <div className={detailStyles.content_inner}>
          <div className={styles.page_header}>
            <h1 className={styles.page_title}>캠페인 신청 내역</h1>
          </div>

          <section className={styles.campaign_application_section}>
            <Campaignbanner campaignInfo={campaign_data.campaignInfo} />

            <article className={styles.download_section}>
              <ExcelDownloadBtn
                onDownloadApplicants={handle_download_applicants}
                onDownloadSelected={handle_download_selected}
              />
              <SortFilterControl
                options={sort_options}
                value={sort_order}
                onChange={(option) =>
                  set_sort_order(option.value as SortOption)
                }
                defaultSort="latest"
              />
            </article>

            <article className={styles.tab_navigation}>
              <button
                className={`${styles.tab_button} ${
                  active_tab === 'applicants' ? styles.active : ''
                }`}
                onClick={() => set_active_tab('applicants')}
              >
                신청{' '}
                <span className={styles.tab_count}>{applicants_count}</span>
              </button>
              <button
                className={`${styles.tab_button} ${
                  active_tab === 'selected' ? styles.active : ''
                }`}
                onClick={() => set_active_tab('selected')}
              >
                선정 <span className={styles.tab_count}>{selected_count}</span>
              </button>
            </article>

            <article className={styles.applicants_grid}>
              {current_applicants.length === 0 ? (
                <EmptyApplicantsList />
              ) : (
                current_applicants.map((applicant, index) => (
                  <div key={`${active_tab}-${applicant.id}-${index}`}>
                    {render_card_component(
                      applicant,
                      active_tab === 'selected',
                    )}
                  </div>
                ))
              )}
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}
