/* ========================================
   🎯 GA 관리자 미션형 캠페인 상세 페이지 (동적)
   ======================================== */

'use client';

/**
 * 미션형 캠페인 진행 현황 상세 페이지 (GA 관리자 버전)
 *
 * - 경로: /manager_ga/campaign/progress/mission/[id]
 * - 파트너 신청내역 페이지 로직을 재사용해 GA 관리자도 동일한 학습 경험 제공
 * - BasicCard/BasicSelectedCard만 사용 (채널 구분 없음)
 */

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Loading from '@/app/loading';
import styles from '@/styles/partner/campaign_application/campaign_application.module.css';
import SortFilterControl from '@/components/partner/campaign_application/SortFilterControl';
import Campaignbanner from '@/components/partner/campaign_application/CampaignInfoBox';
import PageHeader from '@/components/partner/campaign_application/PageHeader';
import ExcelDownloadBtn from '@/components/partner/campaign_application/ExcelDownloadBtn';
import EmptyApplicantsList from '@/components/partner/campaign_application/EmptyApplicantsList';
import BasicCard from '@/components/partner/campaign_application/card_type/basic/BasicCard';
import BasicSelectedCard from '@/components/partner/campaign_application/card_type/basic/BasicSelectedCard';

import {
  getCampaignById,
  type CampaignWithApplicants,
  type AllApplicant,
} from '@/data/partner/sharedCampaigns';
import { type BasicApplicant } from '@/data/partner/campaign_application/delivery_applicants';
import detailStyles from '@/styles/manager_ga/campaign_detail.module.css';

export default function ManagerMissionProgressDetailPage() {
  const params = useParams();
  const search_params = useSearchParams();
  const campaign_id = params.id as string;

  const [campaign_data, set_campaign_data] =
    useState<CampaignWithApplicants | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [error_message, set_error_message] = useState<string | null>(null);

  const [active_tab, set_active_tab] = useState<'applicants' | 'selected'>(
    () => {
      const tab_param = search_params.get('tab');
      return tab_param === 'selected' ? 'selected' : 'applicants';
    },
  );

  type SortOption = 'latest' | 'popular' | 'deadline' | 'point';
  const [sort_order, set_sort_order] = useState<SortOption>('latest');
  const sort_options = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'deadline', label: '마감임박순' },
    { value: 'point', label: '포인트순' },
  ];

  const [applicants_state, set_applicants_state] = useState<AllApplicant[]>([]);
  const [selected_state, set_selected_state] = useState<AllApplicant[]>([]);

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
        console.error('GA 미션형 상세 데이터 로딩 실패:', error);
        set_error_message('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        set_is_loading(false);
      }
    };

    if (campaign_id) {
      load_campaign_data();
    }
  }, [campaign_id]);

  if (is_loading) {
    return <Loading />;
  }

  if (error_message || !campaign_data) {
    return (
      <section className={styles.campaign_application_section}>
        <PageHeader title="캠페인 진행 현황" />
        <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
          {error_message}
        </div>
      </section>
    );
  }

  const applicants_count = applicants_state.length;
  const selected_count = selected_state.length;
  const current_applicants =
    active_tab === 'selected' ? selected_state : applicants_state;

  const render_card_component = (
    applicant: AllApplicant,
    is_selected: boolean = false,
  ) => {
    const basic_applicant = applicant as BasicApplicant;
    return is_selected ? (
      <BasicSelectedCard
        applicant={basic_applicant}
        onCancel={handle_cancel_applicant}
      />
    ) : (
      <BasicCard
        applicant={basic_applicant}
        onSelect={handle_select_applicant}
      />
    );
  };

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

  const handle_download_applicants = () => {
    console.log('[GA 미션형] 신청자 목록 다운로드');
  };

  const handle_download_selected = () => {
    console.log('[GA 미션형] 선정자 목록 다운로드');
  };

  return (
    <div className={detailStyles.detail_page_wrapper}>
      <div className={detailStyles.content_container}>
        <div className={detailStyles.content_inner}>
          <PageHeader title="캠페인 진행 현황" />

          <section className={styles.campaign_application_section}>
            <Campaignbanner campaignInfo={campaign_data.campaignInfo} />

            <article className={styles.download_section}>
              <ExcelDownloadBtn
                onDownloadApplicants={handle_download_applicants}
                onDownloadSelected={handle_download_selected}
              />
              <div
                style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
              >
                {/* 신고 버튼 */}
                <button
                  type="button"
                  className={styles.report_button}
                  onClick={() => {
                    // TODO: 신고 기능 구현
                    console.log('신고 버튼 클릭됨');
                  }}
                  aria-label="신고"
                >
                  <img
                    src="/images/icons/rerport_icon.svg"
                    alt="신고"
                    className={styles.report_button_icon}
                  />
                  <span className={styles.report_button_text}>신고</span>
                </button>
                {/* 정렬 필터 컨트롤 */}
                <SortFilterControl
                  options={sort_options}
                  value={sort_order}
                  onChange={(option) =>
                    set_sort_order(option.value as SortOption)
                  }
                  defaultSort="latest"
                />
              </div>
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

