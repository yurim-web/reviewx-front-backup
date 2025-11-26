/* ========================================
   📋 GA 관리자 진행 현황 페이지
   ======================================== */

/**
 * GA 관리자 진행 현황 페이지
 *
 * 목적: GA 관리자가 캠페인 진행 현황을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/progress
 *
 * 주요 기능:
 * - 상단 통계 카드 (오픈 예정, 진행 중, 신청 중, 전체, 종료, 취소)
 * - 필터 섹션 (날짜, 검색, 상태, 유형, 채널, 정렬, 신고)
 * - 캠페인 목록 테이블 (체크박스, 번호, 파트너명, 캠페인명, 유형, 채널, 상태, 모집 수, 신청 수, 지급 포인트)
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '@/styles/manager_ga/progress.module.css';
import StatCard from '@/components/manager_ga/progress/StatCard';
import CampaignStatusTag from '@/components/manager_ga/progress/CampaignStatusTag';
import CampaignTypeTag from '@/components/manager_ga/progress/CampaignTypeTag';
import ChannelIcon from '@/components/manager_ga/progress/ChannelIcon';
import {
  stat_cards,
  campaign_list,
  type CampaignProgressItem,
  type CampaignType,
} from '@/data/manager_ga/progress';

const campaign_detail_map: Record<
  CampaignType,
  { slug: string; sample_id: string }
> = {
  배송형: { slug: 'delivery', sample_id: '961' },
  방문형: { slug: 'visit', sample_id: '1' },
  구매평: { slug: 'review', sample_id: '18' },
  기자단: { slug: 'reporter', sample_id: '201' },
  미션형: { slug: 'mission', sample_id: '16' },
};

export default function ProgressPage() {
  // 체크박스 선택 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [selected_campaigns, set_selected_campaigns] = useState<string[]>([]);

  // 체크박스 선택/해제 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  const handle_checkbox_change = (campaign_id: string) => {
    // 현재 선택된 캠페인 목록에 해당 ID가 있는지 확인
    if (selected_campaigns.includes(campaign_id)) {
      // 있으면 제거 (해제)
      set_selected_campaigns(
        selected_campaigns.filter((id) => id !== campaign_id),
      );
    } else {
      // 없으면 추가 (선택)
      set_selected_campaigns([...selected_campaigns, campaign_id]);
    }
  };

  // 전체 선택/해제 핸들러
  const handle_select_all = () => {
    // 현재 모든 캠페인이 선택되어 있으면 모두 해제, 아니면 모두 선택
    if (selected_campaigns.length === campaign_list.length) {
      set_selected_campaigns([]);
    } else {
      set_selected_campaigns(campaign_list.map((campaign) => campaign.id));
    }
  };

  // 숫자를 천 단위로 포맷팅하는 함수
  // 예: 115000 -> "115,000"
  const format_number = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  const get_detail_href = (campaign: CampaignProgressItem) => {
    const detail_info = campaign_detail_map[campaign.type];
    if (!detail_info) {
      return null;
    }
    const detail_id =
      (campaign.detail_campaign_id &&
        String(campaign.detail_campaign_id).trim()) ||
      detail_info.sample_id;
    return `/manager_ga/progress/${detail_info.slug}/${detail_id}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <h1 className={styles.page_title}>캠페인 진행 현황</h1>

        {/* 통계 카드 섹션 */}
        <div className={styles.stat_cards_section}>
          {/* 통계 카드들을 map 함수로 순회하며 렌더링 */}
          {stat_cards.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              value={card.value}
              color={card.color}
            />
          ))}
        </div>

        {/* 필터 섹션 */}
        <div className={styles.filter_section}>
          {/* 날짜 필터 */}
          <div className={styles.filter_item}>
            <div className={styles.filter_icon}></div>
            <span className={styles.filter_text}>2025-10-01 ~ 2025-10-31</span>
          </div>

          {/* 검색 필터 */}
          <div className={styles.filter_item}>
            <div className={styles.search_icon}></div>
            <span className={styles.filter_text}>검색</span>
          </div>

          {/* 상태 필터 */}
          <div className={styles.filter_item}>
            <div className={styles.checkbox_icon}></div>
            <span className={styles.filter_text}>상태</span>
            <div className={styles.dropdown_arrow}></div>
          </div>

          {/* 유형 필터 */}
          <div className={styles.filter_item}>
            <div className={styles.checkbox_icon}></div>
            <span className={styles.filter_text}>유형</span>
            <div className={styles.dropdown_arrow}></div>
          </div>

          {/* 채널 필터 */}
          <div className={styles.filter_item}>
            <div className={styles.checkbox_icon}></div>
            <span className={styles.filter_text}>채널</span>
            <div className={styles.dropdown_arrow}></div>
          </div>

          {/* 정렬 필터 */}
          <div className={styles.filter_item}>
            <span className={styles.filter_text}>최신순</span>
            <div className={styles.dropdown_arrow}></div>
          </div>

          {/* 신고 필터 */}
          <div className={styles.filter_item}>
            <span className={styles.filter_text}>신고</span>
            <div className={styles.report_icon}></div>
          </div>
        </div>

        {/* 테이블 섹션 */}
        <div className={styles.table_section}>
          {/* 테이블 헤더 */}
          <div className={styles.table_header}>
            <div className={styles.table_header_cell_checkbox}>
              <input
                type="checkbox"
                checked={selected_campaigns.length === campaign_list.length}
                onChange={handle_select_all}
                className={styles.checkbox}
              />
            </div>
            <div className={styles.table_header_cell}>캠페인 번호</div>
            <div className={styles.table_header_cell}>파트너명</div>
            <div className={styles.table_header_cell}>캠페인명</div>
            <div className={styles.table_header_cell}>유형</div>
            <div className={styles.table_header_cell}>채널</div>
            <div className={styles.table_header_cell}>상태</div>
            <div className={styles.table_header_cell}>모집 수</div>
            <div className={styles.table_header_cell}>신청 수</div>
            <div className={styles.table_header_cell}>지급 포인트</div>
          </div>

          {/* 테이블 바디 - 캠페인 목록을 map 함수로 순회하며 렌더링 */}
          {campaign_list.map((campaign) => {
            const detail_href = get_detail_href(campaign);
            return (
              <div key={campaign.id} className={styles.table_row}>
                {/* 체크박스 */}
                <div className={styles.table_cell_checkbox}>
                  <input
                    type="checkbox"
                    checked={selected_campaigns.includes(campaign.id)}
                    onChange={() => handle_checkbox_change(campaign.id)}
                    className={styles.checkbox}
                  />
                </div>

                {/* 캠페인 번호 */}
                <div className={styles.table_cell}>
                  {campaign.campaign_number}
                </div>

                {/* 파트너명 */}
                <div className={styles.table_cell}>{campaign.partner_name}</div>

                {/* 캠페인명 */}
                <div className={styles.table_cell_campaign_name}>
                  {detail_href ? (
                    <Link
                      href={detail_href}
                      className={styles.table_cell_link}
                      aria-label={`캠페인 상세로 이동: ${campaign.campaign_name}`}
                    >
                      {campaign.campaign_name}
                    </Link>
                  ) : (
                    campaign.campaign_name
                  )}
                </div>

                {/* 유형 */}
                <div className={styles.table_cell}>
                  <CampaignTypeTag type={campaign.type} />
                </div>

                {/* 채널 */}
                <div className={styles.table_cell}>
                  <ChannelIcon channel={campaign.channel} />
                </div>

                {/* 상태 */}
                <div className={styles.table_cell}>
                  <CampaignStatusTag status={campaign.status} />
                </div>

                {/* 모집 수 */}
                <div className={styles.table_cell}>
                  {format_number(campaign.recruit_count)}
                </div>

                {/* 신청 수 */}
                <div className={styles.table_cell}>
                  {format_number(campaign.apply_count)}
                </div>

                {/* 지급 포인트 */}
                <div className={styles.table_cell}>
                  {format_number(campaign.point)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
