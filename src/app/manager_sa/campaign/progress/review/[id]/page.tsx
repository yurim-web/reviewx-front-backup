/* ========================================
   🛒 GA 관리자 구매평 캠페인 상세 페이지 (동적)
   ======================================== */

/**
 * 구매평 캠페인 진행 현황 상세 페이지 (GA 관리자 버전)
 *
 * 목적: GA 관리자가 진행 현황 테이블에서 특정 구매평 캠페인을 클릭했을 때
 *       신청자/선정자 목록, 카드 이동, 엑셀 다운로드 등 상세 관리를 학습/체험할 수 있도록 구성합니다.
 *
 * 참고:
 * - 파트너 센터의 `/partner/campaign_application/review/[id]` 페이지 구조를 그대로 차용했습니다.
 * - GA 관리자 페이지에 맞게 주석과 용어를 재정비했습니다.
 * - 구매평은 basic 카드 타입만 사용합니다.
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Loading from '@/app/loading';
import styles from '@/styles/partner/campaign_application/campaign_application.module.css';
import detailStyles from '@/styles/manager_ga/campaign_detail.module.css';
import SortFilterControl from '@/components/partner/campaign_application/SortFilterControl';
import Campaignbanner from '@/components/partner/campaign_application/CampaignInfoBox';
import ExcelDownloadBtn from '@/components/partner/campaign_application/ExcelDownloadBtn';
import EmptyApplicantsList from '@/components/partner/campaign_application/EmptyApplicantsList';

// 구매평 전용 카드 컴포넌트들 (basic 타입만 사용)
import BasicCard from '@/components/partner/campaign_application/card_type/basic/BasicCard';
import BasicSelectedCard from '@/components/partner/campaign_application/card_type/basic/BasicSelectedCard';

// 공용 캠페인 데이터/타입
import {
  getCampaignById,
  type CampaignWithApplicants,
  type AllApplicant,
} from '@/data/partner/sharedCampaigns';
import { type BasicApplicant } from '@/data/partner/campaign_application/delivery_applicants';

/**
 * 구매평 캠페인 상세 컴포넌트
 *
 * - GA 관리자 맥락이지만, 컴포넌트 구조/로직은 파트너 센터 버전과 동일합니다.
 * - hook, 타입, props 설명을 세부 주석으로 담아 React/TypeScript 학습 자료로 활용합니다.
 */
export default function ManagerReviewProgressDetailPage() {
  /**
   * 1) URL 기반 상태
   * - `useParams` : /review/[id] 값 추출
   * - `useSearchParams` : ?tab=selected 같은 쿼리 처리
   * - `useRouter` : 페이지 이동을 위한 라우터 훅
   */
  const params = useParams();
  const search_params = useSearchParams();
  const router = useRouter();
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
        console.error('GA 구매평 진행현황 데이터 로딩 실패:', error);
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
   * - 구매평은 basic 카드 타입만 사용
   * - 채널별 특화 정보 없음 (팔로워, 구독자 수 등)
   * - 기본 프로필 정보와 메모만 표시
   */
  const render_card_component = (
    applicant: AllApplicant,
    is_selected: boolean = false,
  ) => {
    // 구매평은 항상 BasicApplicant 타입으로 처리
    const basic_applicant = applicant as BasicApplicant;

    if (is_selected) {
      return (
        <BasicSelectedCard
          applicant={basic_applicant}
          onCancel={handle_cancel_applicant}
        />
      );
    } else {
      return (
        <BasicCard
          applicant={basic_applicant}
          onSelect={handle_select_applicant}
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
    // TODO: 신청자 목록 다운로드 기능 구현
  };

  const handle_download_selected = () => {
    // TODO: 선정자 목록 다운로드 기능 구현
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
          {/* 
            페이지 헤더 영역
            - flex 레이아웃을 사용하여 좌우로 요소를 배치합니다
            - 왼쪽: 페이지 제목 ("캠페인 신청 내역")
            - 오른쪽: 캠페인 보기 버튼 (클릭 시 캠페인 상세 페이지로 이동)
          */}
          <div className={styles.page_header}>
            {/* 페이지 제목 - h1 태그는 페이지의 주요 제목을 나타내는 시맨틱 태그입니다 */}
            <h1 className={styles.page_title}>캠페인 신청 내역</h1>

            {/* 
              캠페인 보기 버튼
              - onClick: 버튼 클릭 시 실행될 함수를 정의합니다 (화살표 함수 사용)
              - aria-label: 스크린 리더를 위한 접근성 속성입니다
              - className: CSS 모듈에서 가져온 스타일 클래스를 적용합니다
            */}
            <button
              className={styles.view_campaign_button}
              onClick={() => {
                // TODO: 캠페인 상세 페이지로 이동하는 로직 구현
                // 예: router.push(`/manager_ga/campaign/${campaign_id}`);
              }}
              aria-label="캠페인 보기"
            >
              {/* 버튼 텍스트 */}
              <span>캠페인 보기</span>

              {/* 
                화살표 아이콘
                - Next.js의 Image 컴포넌트를 사용하여 이미지를 최적화합니다
                - width, height: 이미지 크기를 명시적으로 지정합니다
                - alt: 빈 문자열("")은 장식용 이미지임을 나타냅니다
              */}
              <span className={styles.view_campaign_button_icon}>
                <Image
                  src="/images/icons/chevron_right.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </span>
            </button>
          </div>

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

