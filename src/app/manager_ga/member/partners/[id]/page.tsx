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
 *
 * @returns 파트너 디테일 페이지 JSX
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Loading from '@/app/loading';
import styles from '@/styles/manager_ga/member/partners/detail_page.module.css';
import {
  get_partner_detail_by_id,
  type PartnerDetail,
} from '@/data/manager_ga/member/partners';
import CampaignHistoryModal from '@/components/manager_ga/member/partners/modal/CampaignHistoryModal';
import PenaltyHistoryModal from '@/components/manager_ga/member/partners/modal/PenaltyHistoryModal';

export default function PartnerDetailPage() {
  // useParams: Next.js에서 제공하는 훅으로, URL 파라미터를 가져옵니다
  // [id] 폴더 구조에서 id 값을 추출합니다
  const params = useParams();
  const router = useRouter();
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

  // 로딩 중일 때 로딩 컴포넌트를 표시합니다
  if (is_loading) {
    return <Loading />;
  }

  // 파트너 정보가 없을 때 에러 메시지를 표시합니다
  if (!partner_detail) {
    return (
      <div className={styles.container}>
        <div className={styles.error_message}>
          <p>파트너를 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push('/manager_ga/member/partners')}
            className={styles.back_button}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 숫자를 천 단위로 포맷팅하는 함수
  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  // 사업자등록증 다운로드 핸들러
  const handle_download_business_certificate = () => {
    // TODO: 실제 다운로드 기능 구현
  };

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 프로필 섹션 */}
        <div className={styles.profile_section}>
          {/* 프로필 이미지 */}
          <div className={styles.profile_image_wrapper}>
            <div className={styles.profile_image_placeholder} />
          </div>

          {/* 프로필 정보 */}
          <div className={styles.profile_info}>
            {/* 상호명 */}
            <h1 className={styles.business_name}>
              {partner_detail.business_name}
            </h1>

            {/* 상태 유형 태그 */}
            <div className={styles.status_type_tag}>
              {partner_detail.status_type}
            </div>

            {/* 기본 정보 */}
            <div className={styles.basic_info}>
              <span>파트너</span>
              <span>·</span>
              <span>{partner_detail.division}</span>
              <span>·</span>
              <span>{partner_detail.email}</span>
              <span>·</span>
              <span>{partner_detail.phone}</span>
              <span>·</span>
              <span>{partner_detail.address}</span>
            </div>
          </div>
        </div>

        {/* 활동 정보 섹션 */}
        <div className={styles.section}>
          <h2 className={styles.section_title}>활동 정보</h2>
          <div className={styles.info_grid}>
            {/* 캠페인 진행 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>캠페인 진행</div>
              <div className={styles.info_value_with_button}>
                <span>
                  {format_number(partner_detail.campaign_in_progress)}회
                </span>
                {/* 화살표 버튼: 캠페인 진행 내역 모달을 엽니다 */}
                <button
                  className={styles.arrow_button}
                  onClick={() => {
                    // 모달 열기: set_is_campaign_history_modal_open(true)로 모달 상태를 변경합니다
                    set_is_campaign_history_modal_open(true);
                  }}
                  aria-label="캠페인 진행 내역 보기"
                >
                  <img
                    src="/images/icons/arronw_btn.svg"
                    alt="화살표"
                    className={styles.arrow_icon}
                  />
                </button>
              </div>
            </div>

            {/* 캠페인 완료 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>캠페인 완료</div>
              <div className={styles.info_value}>
                {format_number(partner_detail.campaign_completed)}회
              </div>
            </div>

            {/* 패널티 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>패널티</div>
              <div className={styles.info_value_with_button}>
                <span>{format_number(partner_detail.penalty_count)}회</span>
                {/* 화살표 버튼: 패널티 내역 모달을 엽니다 */}
                <button
                  className={styles.arrow_button}
                  onClick={() => {
                    // 패널티 내역 모달 열기
                    set_is_penalty_history_modal_open(true);
                  }}
                  aria-label="패널티 내역 보기"
                >
                  <img
                    src="/images/icons/arronw_btn.svg"
                    alt="화살표"
                    className={styles.arrow_icon}
                  />
                </button>
              </div>
              {/* 모범 회원 배지: status_type이 '모범 회원'일 때만 표시 */}
              {partner_detail.status_type === '모범 회원' && (
                <div className={styles.status_type_badge}>모범 회원</div>
              )}
            </div>

            {/* 접속일 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>접속일</div>
              <div className={styles.info_value}>
                {partner_detail.last_access_date}
              </div>
            </div>

            {/* 가입일 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>가입일</div>
              <div className={styles.info_value}>
                {partner_detail.join_date}
              </div>
            </div>

            {/* 보유 포인트 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>보유 포인트</div>
              <div className={styles.info_value}>
                {format_number(partner_detail.current_points)}
              </div>
            </div>

            {/* 결제 포인트 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>결제 포인트</div>
              <div className={styles.info_value}>
                {format_number(partner_detail.payment_points)}
              </div>
            </div>
          </div>
        </div>

        {/* 사업자 정보 섹션 */}
        <div className={styles.section}>
          <h2 className={styles.section_title}>사업자 정보</h2>
          <div className={styles.business_grid}>
            <div className={styles.info_card}>
              <div className={styles.info_label}>상호명</div>
              <div className={styles.info_value}>
                {partner_detail.business_name}
              </div>
            </div>
            <div className={styles.info_card}>
              <div className={styles.info_label}>대표자명</div>
              <div className={styles.info_value}>
                {partner_detail.representative_name}
              </div>
            </div>
            <div className={styles.info_card}>
              <div className={styles.info_label}>사업자등록번호</div>
              <div className={styles.info_value}>
                {partner_detail.business_number}
              </div>
            </div>
            <div className={styles.info_card}>
              <div className={styles.info_label}>사업자등록증</div>
              <button
                onClick={handle_download_business_certificate}
                className={styles.download_button}
                aria-label="사업자등록증 다운로드"
              >
                <span>다운로드</span>
                <Image
                  src="/images/icons/table_download.svg"
                  alt="다운로드"
                  width={14}
                  height={14}
                  className={styles.download_icon}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 캠페인 진행 내역 모달 */}
      {/* 조건부 렌더링: 모달이 열려있을 때만 표시됩니다 */}
      <CampaignHistoryModal
        is_open={is_campaign_history_modal_open}
        on_close={() => {
          // 모달 닫기: set_is_campaign_history_modal_open(false)로 모달 상태를 변경합니다
          set_is_campaign_history_modal_open(false);
        }}
        campaigns={partner_detail.recent_campaigns}
      />

      {/* 패널티 내역 모달 */}
      {/* 조건부 렌더링: 모달이 열려있을 때만 표시됩니다 */}
      <PenaltyHistoryModal
        is_open={is_penalty_history_modal_open}
        on_close={() => {
          // 모달 닫기: set_is_penalty_history_modal_open(false)로 모달 상태를 변경합니다
          set_is_penalty_history_modal_open(false);
        }}
        penalty_history={partner_detail.penalty_history}
      />
    </div>
  );
}
