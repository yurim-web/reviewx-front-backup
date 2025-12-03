/* ========================================
   📋 캠페인 테이블 컴포넌트 (공통)
   ======================================== */

/**
 * 캠페인 테이블 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 캠페인 테이블 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 *
 * 주요 기능:
 * - 캠페인 상세 페이지로 이동하는 링크
 * - 캠페인 정보 표시 (번호, 파트너명, 캠페인명, 유형, 채널, 상태, 모집 수, 신청 수, 지급 포인트)
 * - 신고 기능
 *
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import CampaignStatusTag from '../tags/CampaignStatusTag';
import CampaignTypeTag from '../tags/CampaignTypeTag';
import ChannelIcon from '../icons/ChannelIcon';
import type { CampaignStatus } from '../tags/CampaignStatusTag';
import type { CampaignType } from '../tags/CampaignTypeTag';
import type { Channel } from '../icons/ChannelIcon';

// 캠페인 진행 아이템 타입 정의
export interface CampaignProgressItem {
  id: string; // 캠페인 ID
  campaign_number: string; // 캠페인 번호
  partner_name: string; // 파트너명
  campaign_name: string; // 캠페인명
  type: CampaignType; // 캠페인 유형
  channel: Channel; // 채널
  status: CampaignStatus; // 상태
  recruit_count: number; // 모집 수
  apply_count: number; // 신청 수
  point: number; // 지급 포인트
  detail_campaign_id?: string; // 상세 페이지에서 사용할 공용 캠페인 ID (옵션)
}

// 신고 모달 컴포넌트 타입 (props로 받음)
interface ReportModalComponent {
  is_open: boolean;
  on_close: () => void;
  campaign_id?: string;
  on_report?: (report_code: string) => void;
}

interface CampaignTableProps {
  campaign_list: CampaignProgressItem[]; // 캠페인 목록 데이터
  base_path: string; // 상세 페이지 기본 경로 (예: '/manager_ga/campaign/progress' 또는 '/manager_sa/campaign/progress')
  ReportModal: React.ComponentType<ReportModalComponent>; // 신고 모달 컴포넌트
  styles: Record<string, string>; // CSS 모듈 스타일 객체 (유연한 타입)
  tagStyles: Record<string, string> & { type_tag: string }; // 태그 스타일 객체 (type_tag 포함)
  channelIconStyles: Record<string, string> & {
    channel_icon: string;
    channel_icon_image: string;
  }; // 채널 아이콘 스타일 객체 (channel_icon, channel_icon_image 포함)
}

// 캠페인 타입별 상세 페이지 경로 매핑
// Record 타입: 키-값 쌍의 객체 타입을 정의합니다
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

export default function CampaignTable({
  campaign_list,
  base_path,
  ReportModal,
  styles: cssStyles,
  tagStyles,
  channelIconStyles,
}: CampaignTableProps) {
  /* ========================================
     📌 상태 관리 (State Management)
     ======================================== */

  // 호버된 행의 ID를 관리하는 상태
  const [hovered_row_id, set_hovered_row_id] = useState<string | null>(null);

  // 신고 모달 상태 관리
  const [report_modal_state, set_report_modal_state] = useState<{
    is_open: boolean;
    campaign_id: string | null;
  }>({
    is_open: false,
    campaign_id: null,
  });

  /* ========================================
     🛠️ 유틸리티 함수 (Utility Functions)
     ======================================== */

  // 신고 아이콘 클릭 핸들러
  const handle_report_click = (campaign_id: string) => {
    set_report_modal_state({
      is_open: true,
      campaign_id,
    });
  };

  // 신고 모달 닫기 핸들러
  const handle_report_modal_close = () => {
    set_report_modal_state({
      is_open: false,
      campaign_id: null,
    });
  };

  // 신고 완료 핸들러
  const handle_report_submit = (report_code: string) => {
    // TODO: 실제 신고 로직 구현
    handle_report_modal_close();
  };

  /**
   * 숫자를 천 단위로 포맷팅하는 함수
   *
   * @param num - 포맷팅할 숫자
   * @returns 천 단위 구분자가 포함된 문자열
   */
  const format_number = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  /**
   * 캠페인 상세 페이지 경로를 생성하는 함수
   *
   * @param campaign - 캠페인 정보 객체
   * @returns 상세 페이지 경로 문자열 또는 null (경로를 생성할 수 없는 경우)
   */
  const get_detail_href = (campaign: CampaignProgressItem): string | null => {
    const detail_info = campaign_detail_map[campaign.type];
    if (!detail_info) {
      return null;
    }
    const detail_id =
      (campaign.detail_campaign_id &&
        String(campaign.detail_campaign_id).trim()) ||
      detail_info.sample_id;
    return `${base_path}/${detail_info.slug}/${detail_id}`;
  };

  /* ========================================
     🎨 렌더링 (Rendering)
     ======================================== */

  return (
    <div className={cssStyles.table_section}>
      {/* ========================================
          📋 테이블 헤더
          ======================================== */}
      <div className={cssStyles.table_header}>
        {/* 캠페인 번호 - 화살표 아이콘 포함 */}
        <div className={cssStyles.table_header_cell}>
          <span>캠페인 번호</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={cssStyles.table_header_arrow}
          />
        </div>
        {/* 파트너명 */}
        <div className={cssStyles.table_header_cell}>
          <span>파트너명</span>
        </div>
        {/* 캠페인명 */}
        <div className={cssStyles.table_header_cell}>
          <span>캠페인명</span>
        </div>
        {/* 상태 */}
        <div className={cssStyles.table_header_cell}>
          <span>상태</span>
        </div>
        {/* 유형 */}
        <div className={cssStyles.table_header_cell}>
          <span>유형</span>
        </div>
        {/* 채널 */}
        <div className={cssStyles.table_header_cell}>
          <span>채널</span>
        </div>
        {/* 신청 수 - 화살표 아이콘 포함 */}
        <div className={cssStyles.table_header_cell}>
          <span>신청 수</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={cssStyles.table_header_arrow}
          />
        </div>
        {/* 모집 수 - 화살표 아이콘 포함 */}
        <div className={cssStyles.table_header_cell}>
          <span>모집 수</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={cssStyles.table_header_arrow}
          />
        </div>
        {/* 지급 포인트 - 화살표 아이콘 포함 */}
        <div className={cssStyles.table_header_cell}>
          <span>지급 포인트</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={cssStyles.table_header_arrow}
          />
        </div>
        {/* 신고 아이콘 칸 - 헤더는 빈 칸으로 표시 */}
        <div className={cssStyles.table_header_cell_report}></div>
      </div>

      {/* ========================================
          📋 테이블 바디 - 캠페인 목록 렌더링
          ======================================== */}
      {campaign_list.map((campaign) => {
        const detail_href = get_detail_href(campaign);
        const is_hovered = hovered_row_id === campaign.id;
        return (
          <div
            key={campaign.id}
            className={cssStyles.table_row}
            onMouseEnter={() => set_hovered_row_id(campaign.id)}
            onMouseLeave={() => set_hovered_row_id(null)}
          >
            {/* 캠페인 번호 */}
            <div className={cssStyles.table_cell}>
              {campaign.campaign_number}
            </div>

            {/* 파트너명 */}
            <div className={cssStyles.table_cell}>{campaign.partner_name}</div>

            {/* 캠페인명 */}
            <div className={cssStyles.table_cell_campaign_name}>
              {/* 조건부 렌더링: detail_href가 있으면 Link 컴포넌트를, 없으면 일반 텍스트를 렌더링합니다 */}
              {detail_href ? (
                <Link
                  href={detail_href}
                  className={cssStyles.table_cell_link}
                  aria-label={`캠페인 상세로 이동: ${campaign.campaign_name}`}
                >
                  {campaign.campaign_name}
                </Link>
              ) : (
                campaign.campaign_name
              )}
            </div>

            {/* 상태 */}
            <div className={cssStyles.table_cell}>
              <CampaignStatusTag status={campaign.status} styles={tagStyles} />
            </div>

            {/* 유형 */}
            <div className={cssStyles.table_cell}>
              <CampaignTypeTag type={campaign.type} styles={tagStyles} />
            </div>

            {/* 채널 */}
            <div className={cssStyles.table_cell}>
              <ChannelIcon
                channel={campaign.channel}
                styles={channelIconStyles}
              />
            </div>

            {/* 신청 수 */}
            <div className={cssStyles.table_cell}>
              {format_number(campaign.apply_count)}
            </div>

            {/* 모집 수 */}
            <div className={cssStyles.table_cell}>
              {format_number(campaign.recruit_count)}
            </div>

            {/* 지급 포인트 */}
            <div className={cssStyles.table_cell}>
              {format_number(campaign.point)}
            </div>

            {/* 신고 아이콘 칸 - 호버 시에만 표시 */}
            <div className={cssStyles.table_cell_report}>
              {is_hovered && (
                <button
                  onClick={() => handle_report_click(campaign.id)}
                  className={cssStyles.report_button}
                  aria-label={`${campaign.campaign_name} 신고`}
                >
                  <img
                    src="/images/icons/table_report.svg"
                    alt="신고"
                    className={cssStyles.report_icon}
                  />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* 신고 모달 */}
      <ReportModal
        is_open={report_modal_state.is_open}
        on_close={handle_report_modal_close}
        campaign_id={report_modal_state.campaign_id || undefined}
        on_report={handle_report_submit}
      />
    </div>
  );
}
