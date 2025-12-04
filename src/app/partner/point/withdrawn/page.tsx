/* ========================================
   💰 파트너 포인트 사용 내역 페이지
   ======================================== */

/**
 * 파트너 포인트 사용 내역 페이지
 *
 * 목적: 파트너의 포인트 사용 내역만 보여주는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/point/withdrawn
 *
 * 주요 기능:
 * - 포인트 사용 내역만 표시 (type: "withdrawn")
 * - 보유 포인트 현황 표시
 * - 포인트 충전 기능
 */

'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TabNavigation from '@/components/partner/campaign_management/TabNavigation';
import PointTabNavigation from '@/components/common/point/PointTabNavigation';
import { PartnerMainTab, PartnerPointTab } from '@/types/partner/partner';
import {
  partnerPointHistoryData,
  partnerPointSummary,
} from '@/data/partner/point/pointData';
import styles from '@/styles/user/point/point.module.css';

/**
 * 파트너 포인트 사용 내역 페이지 컴포넌트
 */
export default function PartnerWithdrawnPointPage() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState<PartnerMainTab>('point');
  const [activePointTab, setActivePointTab] =
    useState<PartnerPointTab>('withdrawn');
  const tooltipRef = useRef<HTMLSpanElement>(null);

  /**
   * 포인트 탭 변경 핸들러
   * 각 탭 클릭 시 해당 페이지로 이동
   */
  const handlePointTabChange = (tab: PartnerPointTab) => {
    switch (tab) {
      case 'all':
        window.location.href = '/partner/point/all';
        break;
      case 'earned':
        window.location.href = '/partner/point/earned';
        break;
      case 'withdrawn':
        // 현재 페이지이므로 아무것도 하지 않음
        break;
    }
  };

  /**
   * 충전 버튼 클릭 핸들러
   * 포인트 충전 페이지로 이동
   */
  const handleChargeClick = () => {
    router.push('/partner/point/charge');
  };

  // 사용 내역만 필터링 (type: "withdrawn")
  const filteredHistoryData = partnerPointHistoryData.filter(
    (history) => history.type === 'withdrawn',
  );

  return (
    <div className={styles.point_page}>
      <main className={styles.main_content}>
        <div className={styles.container}>
          {/* 메인 탭 네비게이션 */}
          <TabNavigation
            activeTab={activeMainTab}
            setActiveTab={setActiveMainTab}
          />

          {/* 포인트 세부 탭 네비게이션 */}
          <PointTabNavigation
            activePointTab={activePointTab}
            setActivePointTab={handlePointTabChange}
            basePath="/partner/point"
            tabLabels={{ earned: '충전', withdrawn: '사용' }}
          />

          {/* 포인트 요약 정보 */}
          <article className={styles.point_summary_section}>
            <div className={styles.point_summary_info}>
              <span className={styles.point_label}>보유 포인트</span>
              <div className={styles.point_amount}>
                <span className={styles.amount_number}>
                  {partnerPointSummary.total_points.toLocaleString()}
                </span>
                <span className={styles.amount_unit}>P</span>
              </div>
            </div>

            <button
              className={styles.withdrawal_button}
              onClick={handleChargeClick}
            >
              포인트 충전하기
            </button>
          </article>

          {/* 포인트 사용 내역 리스트 */}
          <article className={styles.history_list}>
            {filteredHistoryData.map((history) => (
              <div key={history.id} className={styles.history_item}>
                {/* 상태 배지 */}
                <div className={styles.status_badge_container}>
                  <div
                    className={`${styles.status_badge} ${
                      history.type === 'earned'
                        ? styles.charged
                        : history.type === 'withdrawn' &&
                          history.status === 'completed'
                        ? styles.used
                        : history.status === 'earned'
                        ? styles.earned
                        : history.status === 'completed'
                        ? styles.completed
                        : history.status === 'pending'
                        ? styles.pending
                        : styles.cancelled
                    }`}
                  >
                    {history.type === 'earned'
                      ? '충전'
                      : history.type === 'withdrawn'
                      ? '사용'
                      : history.status === 'completed'
                      ? '완료'
                      : history.status === 'pending'
                      ? '신청'
                      : '취소'}
                  </div>
                </div>

                {/* 내역 정보 */}
                <div className={styles.history_info}>
                  <div className={styles.history_description}>
                    {history.description}
                  </div>
                  <div className={styles.history_date}>{history.date}</div>
                </div>

                {/* 포인트 정보 */}
                <div className={styles.point_info}>
                  <div
                    className={`${styles.point_change} ${
                      history.status === 'failed'
                        ? styles.cancelled_amount
                        : history.amount > 0
                        ? styles.positive
                        : styles.negative
                    }`}
                  >
                    {history.amount > 0
                      ? `+ ${history.amount.toLocaleString()}`
                      : `${history.amount.toLocaleString()}`}{' '}
                    P
                  </div>
                  <div className={styles.point_balance}>
                    {history.balance.toLocaleString()} P
                  </div>
                </div>
              </div>
            ))}
          </article>
        </div>
      </main>
    </div>
  );
}
