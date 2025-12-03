/* ========================================
   🏢 GA 관리자 파트너 디테일 페이지
   ======================================== */

/**
 * GA 관리자 파트너 디테일 페이지
 *
 * 목적: GA 관리자가 특정 파트너의 상세 정보를 확인할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/member/partners/[id] (동적 라우트)
 *
 * 주요 기능:
 * - 파트너 프로필 정보 (상호명, 구분, 이메일, 전화번호, 주소)
 * - 활동 정보 (캠페인 진행, 캠페인 완료, 패널티, 접속일, 가입일, 보유 포인트, 결제 포인트)
 * - 사업자 정보 (상호명, 대표자명, 사업자등록번호, 사업자등록증 다운로드)
 * - 최근 진행 캠페인 정보 테이블
 *
 * 학습 포인트:
 * - 동적 라우트: Next.js의 [id] 폴더 구조를 사용하여 동적 경로를 생성합니다
 * - useParams: URL 파라미터에서 id 값을 추출합니다
 * - 조건부 렌더링: 데이터가 없을 때 에러 메시지를 표시합니다
 * - 컴포넌트 분리: 큰 컴포넌트를 작은 섹션으로 나누어 관리합니다
 * - 재사용 컴포넌트: 공통 컴포넌트를 사용하여 코드 중복을 줄입니다
 *
 * @returns 파트너 디테일 페이지 JSX
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  get_partner_detail_by_id,
  type PartnerDetail,
} from '@/data/manager_ga/member/partners';
import CampaignHistoryModal from '@/components/manager_ga/member/partners/modal/CampaignHistoryModal';
import PenaltyHistoryModal from '@/components/manager_ga/member/partners/modal/PenaltyHistoryModal';
import MemberDetailLayout from '@/components/manager_ga/member/member_detail/MemberDetailLayout';
import ProfileSection from '@/components/manager_ga/member/member_detail/ProfileSection';
import ActivityInfoSection, {
  type ActivityInfoItem,
} from '@/components/manager_ga/member/member_detail/ActivityInfoSection';
import BusinessInfoSection from '@/components/manager_ga/member/partners/section/BusinessInfoSection';
import styles from '@/styles/manager_ga/member/member_detail/detail_page.module.css';

export default function PartnerDetailPage() {
  // useParams: Next.js에서 제공하는 훅으로, URL 파라미터를 가져옵니다
  // [id] 폴더 구조에서 id 값을 추출합니다
  const params = useParams();
  const partner_id = params.id as string;

  // 파트너 디테일 정보 상태 관리
  const [partner_detail, set_partner_detail] = useState<PartnerDetail | null>(
    null,
  );
  const [is_loading, set_is_loading] = useState(true);

  // 캠페인 진행 내역 모달 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  const [is_campaign_history_modal_open, set_is_campaign_history_modal_open] =
    useState(false);

  // 패널티 내역 모달 상태 관리
  const [is_penalty_history_modal_open, set_is_penalty_history_modal_open] =
    useState(false);

  // 컴포넌트가 마운트될 때 파트너 정보를 가져옵니다
  // useEffect: React의 Hook으로, 컴포넌트가 렌더링된 후에 실행됩니다
  useEffect(() => {
    // 비동기 함수를 정의합니다
    const fetch_partner_detail = async () => {
      set_is_loading(true);
      // 실제 프로젝트에서는 API 호출로 대체됩니다
      const detail = get_partner_detail_by_id(partner_id);
      set_partner_detail(detail);
      set_is_loading(false);
    };

    fetch_partner_detail();
  }, [partner_id]);

  // 숫자를 천 단위로 포맷팅하는 함수
  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  // 사업자등록증 다운로드 핸들러
  const handle_download_business_certificate = () => {
    // TODO: 실제 다운로드 기능 구현
  };

  // 활동 정보 아이템 배열 생성
  // ActivityInfoSection 컴포넌트에 전달할 데이터를 준비합니다
  const activity_info_items: ActivityInfoItem[] = [
    // 캠페인 진행
    {
      label: '캠페인 진행',
      value: partner_detail
        ? `${format_number(partner_detail.campaign_in_progress)}회`
        : '0회',
      on_button_click: () => set_is_campaign_history_modal_open(true),
      button_aria_label: '캠페인 진행 내역 보기',
    },
    // 캠페인 완료
    {
      label: '캠페인 완료',
      value: partner_detail
        ? `${format_number(partner_detail.campaign_completed)}회`
        : '0회',
    },
    // 패널티
    {
      label: '패널티',
      value: partner_detail
        ? `${format_number(partner_detail.penalty_count)}회`
        : '0회',
      on_button_click: () => set_is_penalty_history_modal_open(true),
      button_aria_label: '패널티 내역 보기',
      additional_content:
        partner_detail?.status_type === '모범 회원' ? (
          <div className={styles.status_type_badge}>모범 회원</div>
        ) : undefined,
    },
    // 접속일
    {
      label: '접속일',
      value: partner_detail?.last_access_date || '-',
    },
    // 가입일
    {
      label: '가입일',
      value: partner_detail?.join_date || '-',
    },
    // 보유 포인트
    {
      label: '보유 포인트',
      value: partner_detail
        ? format_number(partner_detail.current_points)
        : '0',
    },
    // 결제 포인트
    {
      label: '결제 포인트',
      value: partner_detail
        ? format_number(partner_detail.payment_points)
        : '0',
    },
  ];

  return (
    <MemberDetailLayout
      is_loading={is_loading}
      is_error={!partner_detail}
      error_message="파트너를 찾을 수 없습니다."
      back_path="/manager_ga/member/partners"
    >
      <div className={styles.main_content}>
        {/* 프로필 섹션 */}
        {partner_detail && (
          <ProfileSection
            name={partner_detail.business_name}
            status_type={partner_detail.status_type}
            basic_info_items={[
              '파트너',
              partner_detail.division,
              partner_detail.email,
              partner_detail.phone,
              partner_detail.address,
            ]}
          />
        )}

        {/* 활동 정보 섹션 */}
        <ActivityInfoSection items={activity_info_items} />

        {/* 사업자 정보 섹션 */}
        {partner_detail && (
          <BusinessInfoSection
            business_name={partner_detail.business_name}
            representative_name={partner_detail.representative_name}
            business_number={partner_detail.business_number}
            on_download={handle_download_business_certificate}
          />
        )}
      </div>

      {/* 캠페인 진행 내역 모달 */}
      {/* 조건부 렌더링: 모달이 열려있을 때만 표시됩니다 */}
      {partner_detail && (
        <CampaignHistoryModal
          is_open={is_campaign_history_modal_open}
          on_close={() => {
            // 모달 닫기: set_is_campaign_history_modal_open(false)로 모달 상태를 변경합니다
            set_is_campaign_history_modal_open(false);
          }}
          campaigns={partner_detail.recent_campaigns}
        />
      )}

      {/* 패널티 내역 모달 */}
      {/* 조건부 렌더링: 모달이 열려있을 때만 표시됩니다 */}
      {partner_detail && (
        <PenaltyHistoryModal
          is_open={is_penalty_history_modal_open}
          on_close={() => {
            // 모달 닫기: set_is_penalty_history_modal_open(false)로 모달 상태를 변경합니다
            set_is_penalty_history_modal_open(false);
          }}
          penalty_history={partner_detail.penalty_history}
        />
      )}
    </MemberDetailLayout>
  );
}
