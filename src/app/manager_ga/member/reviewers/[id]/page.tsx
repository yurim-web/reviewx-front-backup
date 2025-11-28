/* ========================================
   👤 GA 관리자 리뷰어 디테일 페이지
   ======================================== */

/**
 * GA 관리자 리뷰어 디테일 페이지
 *
 * 목적: GA 관리자가 특정 리뷰어의 상세 정보를 확인할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/member/reviewers/[id] (동적 라우트)
 *
 * 주요 기능:
 * - 리뷰어 프로필 정보 (닉네임, 이름, 성별, 나이, 이메일, 전화번호, 주소)
 * - 활동 정보 (채널 정보, 캠페인 진행/완료, 패널티, 접속일, 가입일, 보유 포인트, 출금 포인트)
 * - 채널 상세 정보 (네이버 블로그, 네이버 클립, 인스타그램, 유튜브)
 * - 계좌 정보 (예금주, 은행, 계좌번호, 주민등록번호)
 * - 최근 진행 캠페인 정보 테이블
 *
 * 학습 포인트:
 * - 동적 라우트: Next.js의 [id] 폴더 구조를 사용하여 동적 경로를 생성합니다
 * - useParams: URL 파라미터에서 id 값을 추출합니다
 * - 조건부 렌더링: 데이터가 없을 때 에러 메시지를 표시합니다
 * - 컴포넌트 분리: 큰 컴포넌트를 작은 섹션으로 나누어 관리합니다
 *
 * @returns 리뷰어 디테일 페이지 JSX
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Loading from '@/app/loading';
import styles from '@/styles/manager_ga/member/reviewers/detail_page.module.css';
import {
  get_reviewer_detail_by_id,
  type ReviewerDetail,
  type Channel,
} from '@/data/manager_ga/member/reviewers';
import CampaignHistoryModal from '@/components/manager_ga/member/reviewers/modal/CampaignHistoryModal';
import PenaltyHistoryModal from '@/components/manager_ga/member/reviewers/modal/PenaltyHistoryModal';

// 채널 아이콘 경로 매핑
const channel_icon_map: Record<Channel, string> = {
  Blog: '/images/brand_logo/naverblog.svg',
  Clip: '/images/brand_logo/naverclip.svg',
  Instagram: '/images/brand_logo/insta.svg',
  Youtube: '/images/brand_logo/youtube.svg',
  Store: '/images/brand_logo/navershop.svg',
};

export default function ReviewerDetailPage() {
  // useParams: Next.js에서 제공하는 훅으로, URL 파라미터를 가져옵니다
  // [id] 폴더 구조에서 id 값을 추출합니다
  const params = useParams();
  const router = useRouter();
  const reviewer_id = params.id as string;

  // 리뷰어 디테일 정보 상태 관리
  const [reviewer_detail, set_reviewer_detail] =
    useState<ReviewerDetail | null>(null);
  const [is_loading, set_is_loading] = useState(true);

  // 캠페인 진행 내역 모달 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  const [is_campaign_history_modal_open, set_is_campaign_history_modal_open] =
    useState(false);

  // 패널티 내역 모달 상태 관리
  const [is_penalty_history_modal_open, set_is_penalty_history_modal_open] =
    useState(false);

  // 컴포넌트가 마운트될 때 리뷰어 정보를 가져옵니다
  // useEffect: React의 Hook으로, 컴포넌트가 렌더링된 후에 실행됩니다
  useEffect(() => {
    // 비동기 함수를 정의합니다
    const fetch_reviewer_detail = async () => {
      set_is_loading(true);
      // 실제 프로젝트에서는 API 호출로 대체됩니다
      const detail = get_reviewer_detail_by_id(reviewer_id);
      set_reviewer_detail(detail);
      set_is_loading(false);
    };

    fetch_reviewer_detail();
  }, [reviewer_id]);

  // 로딩 중일 때 로딩 컴포넌트를 표시합니다
  if (is_loading) {
    return <Loading />;
  }

  // 리뷰어 정보가 없을 때 에러 메시지를 표시합니다
  if (!reviewer_detail) {
    return (
      <div className={styles.container}>
        <div className={styles.error_message}>
          <p>리뷰어를 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push('/manager_ga/member/reviewers')}
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
            {/* 닉네임 */}
            <h1 className={styles.nickname}>{reviewer_detail.nickname}</h1>

            {/* 상태 유형 태그 */}
            <div className={styles.status_type_tag}>
              {reviewer_detail.status_type}
            </div>

            {/* 기본 정보 */}
            <div className={styles.basic_info}>
              <span>리뷰어</span>
              <span>·</span>
              <span>{reviewer_detail.name}</span>
              <span>·</span>
              <span>{reviewer_detail.gender}</span>
              <span>·</span>
              <span>만 {reviewer_detail.age}세</span>
              <span>·</span>
              <span>{reviewer_detail.email}</span>
              <span>·</span>
              <span>{reviewer_detail.phone}</span>
              <span>·</span>
              <span>{reviewer_detail.address}</span>
            </div>
          </div>
        </div>

        {/* 활동 정보 섹션 */}
        <div className={styles.section}>
          <h2 className={styles.section_title}>활동 정보</h2>
          <div className={styles.info_grid}>
            {/* 채널 정보 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>채널 정보</div>
              <div className={styles.channel_icons}>
                {reviewer_detail.channels.map((channel, index) => (
                  <div key={index} className={styles.channel_icon_wrapper}>
                    <Image
                      src={channel_icon_map[channel]}
                      alt={channel}
                      width={16}
                      height={16}
                      className={styles.channel_icon}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 캠페인 진행 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>캠페인 진행</div>
              <div className={styles.info_value_with_button}>
                <span>
                  {format_number(reviewer_detail.campaign_participated)}회
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
                {format_number(reviewer_detail.campaign_completed)}회
              </div>
            </div>

            {/* 패널티 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>패널티</div>
              <div className={styles.info_value_with_button}>
                <span>{format_number(reviewer_detail.penalty_count)}회</span>
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
              {reviewer_detail.status_type === '모범 회원' && (
                <div className={styles.status_type_badge}>모범 회원</div>
              )}
            </div>

            {/* 접속일 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>접속일</div>
              <div className={styles.info_value}>
                {reviewer_detail.last_access_date}
              </div>
            </div>

            {/* 가입일 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>가입일</div>
              <div className={styles.info_value}>
                {reviewer_detail.join_date}
              </div>
            </div>

            {/* 보유 포인트 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>보유 포인트</div>
              <div className={styles.info_value}>
                {format_number(reviewer_detail.current_points)}
              </div>
            </div>

            {/* 출금 포인트 */}
            <div className={styles.info_card}>
              <div className={styles.info_label}>출금 포인트</div>
              <div className={styles.info_value}>
                {format_number(reviewer_detail.withdrawn_points)}
              </div>
            </div>
          </div>
        </div>

        {/* 채널 정보 섹션 */}
        <div className={styles.section}>
          <h2 className={styles.section_title}>채널 정보</h2>
          <div className={styles.channel_grid}>
            {reviewer_detail.channel_details.map((channel_detail, index) => (
              <div key={index} className={styles.channel_card}>
                <div className={styles.channel_name}>
                  {channel_detail.channel === 'Blog' && '네이버 블로그'}
                  {channel_detail.channel === 'Clip' && '네이버 클립'}
                  {channel_detail.channel === 'Instagram' && '인스타그램'}
                  {channel_detail.channel === 'Youtube' && '유튜브'}
                </div>
                {channel_detail.is_connected ? (
                  <div className={styles.channel_stats}>
                    {channel_detail.channel === 'Blog' && (
                      <>
                        <div className={styles.channel_stat_row}>
                          <span>일방문</span>
                          <span>
                            {format_number(channel_detail.daily_visits || 0)}
                          </span>
                        </div>
                        <div className={styles.channel_stat_row}>
                          <span>총방문</span>
                          <span>
                            {format_number(channel_detail.total_visits || 0)}
                          </span>
                        </div>
                        <div className={styles.channel_stat_row}>
                          <span>이웃수</span>
                          <span>
                            {format_number(channel_detail.neighbors || 0)}
                          </span>
                        </div>
                      </>
                    )}
                    {channel_detail.channel === 'Clip' && (
                      <div className={styles.channel_stat_row}>
                        <span>팔로워</span>
                        <span>
                          {format_number(channel_detail.followers || 0)}
                        </span>
                      </div>
                    )}
                    {channel_detail.channel === 'Instagram' && (
                      <div className={styles.channel_stat_row}>
                        <span>팔로워</span>
                        <span>
                          {format_number(channel_detail.followers || 0)}
                        </span>
                      </div>
                    )}
                    {channel_detail.channel === 'Youtube' && (
                      <>
                        <div className={styles.channel_stat_row}>
                          <span>구독자</span>
                          <span>
                            {format_number(channel_detail.subscribers || 0)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className={styles.channel_not_connected}>연결 필요</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 계좌 정보 섹션 */}
        <div className={styles.section}>
          <h2 className={styles.section_title}>계좌 정보</h2>
          <div className={styles.account_grid}>
            <div className={styles.info_card}>
              <div className={styles.info_label}>예금주</div>
              <div className={styles.info_value}>
                {reviewer_detail.account_info.account_holder}
              </div>
            </div>
            <div className={styles.info_card}>
              <div className={styles.info_label}>은행</div>
              <div className={styles.info_value}>
                {reviewer_detail.account_info.bank}
              </div>
            </div>
            <div className={styles.info_card}>
              <div className={styles.info_label}>계좌번호</div>
              <div className={styles.info_value}>
                {reviewer_detail.account_info.account_number}
              </div>
            </div>
            <div className={styles.info_card}>
              <div className={styles.info_label}>주민등록번호</div>
              <div className={styles.info_value}>
                {reviewer_detail.account_info.resident_number}
              </div>
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
        campaigns={reviewer_detail.recent_campaigns}
      />

      {/* 패널티 내역 모달 */}
      {/* 조건부 렌더링: 모달이 열려있을 때만 표시됩니다 */}
      <PenaltyHistoryModal
        is_open={is_penalty_history_modal_open}
        on_close={() => {
          // 모달 닫기: set_is_penalty_history_modal_open(false)로 모달 상태를 변경합니다
          set_is_penalty_history_modal_open(false);
        }}
        penalty_history={reviewer_detail.penalty_history}
      />
    </div>
  );
}
