/* ========================================
   📋 캠페인 테이블 컴포넌트
   ======================================== */

/**
 * 캠페인 테이블 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지의 캠페인 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - 체크박스로 캠페인 선택/해제
 * - 전체 선택/해제 기능
 * - 캠페인 상세 페이지로 이동하는 링크
 * - 캠페인 정보 표시 (번호, 파트너명, 캠페인명, 유형, 채널, 상태, 모집 수, 신청 수, 지급 포인트)
 *
 * 학습 포인트:
 * - useState: 컴포넌트의 상태를 관리하는 React Hook입니다
 * - 이벤트 핸들러: 사용자 상호작용에 반응하는 함수입니다
 * - 조건부 렌더링: 조건에 따라 다른 내용을 렌더링합니다
 * - Link 컴포넌트: Next.js의 클라이언트 사이드 네비게이션 컴포넌트입니다
 * - map 함수: 배열을 순회하며 컴포넌트를 렌더링합니다
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '@/styles/manager_ga/campaign/progress/table.module.css';
import CampaignStatusTag from '../CampaignStatusTag';
import CampaignTypeTag from '../CampaignTypeTag';
import ChannelIcon from '../ChannelIcon';
import {
  campaign_list,
  type CampaignProgressItem,
  type CampaignType,
} from '@/data/manager_ga/progress';

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

interface CampaignTableProps {
  // Props는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 방법입니다
  // 현재는 props가 없지만, 추후 필터링된 데이터를 받을 수 있도록 구조를 유지합니다
}

export default function CampaignTable({}: CampaignTableProps) {
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
      // filter 함수: 조건에 맞는 요소만 남긴 새로운 배열을 반환합니다
      set_selected_campaigns(
        selected_campaigns.filter((id) => id !== campaign_id),
      );
    } else {
      // 없으면 추가 (선택)
      // 스프레드 연산자(...): 배열이나 객체를 펼쳐서 새로운 배열/객체를 만듭니다
      set_selected_campaigns([...selected_campaigns, campaign_id]);
    }
  };

  // 전체 선택/해제 핸들러
  const handle_select_all = () => {
    // 현재 모든 캠페인이 선택되어 있으면 모두 해제, 아니면 모두 선택
    if (selected_campaigns.length === campaign_list.length) {
      set_selected_campaigns([]);
    } else {
      // map 함수: 배열의 각 요소를 변환하여 새로운 배열을 반환합니다
      set_selected_campaigns(campaign_list.map((campaign) => campaign.id));
    }
  };

  // 숫자를 천 단위로 포맷팅하는 함수
  // 예: 115000 -> "115,000"
  // toLocaleString: 숫자를 지역화된 문자열로 변환합니다
  const format_number = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  // 캠페인 상세 페이지 경로를 생성하는 함수
  // 조건부로 경로를 반환할 수 있도록 null도 가능한 타입으로 정의합니다
  const get_detail_href = (campaign: CampaignProgressItem): string | null => {
    const detail_info = campaign_detail_map[campaign.type];
    if (!detail_info) {
      return null;
    }
    // 옵셔널 체이닝(?.)과 널 병합 연산자(??)를 사용하여 안전하게 값을 가져옵니다
    const detail_id =
      (campaign.detail_campaign_id &&
        String(campaign.detail_campaign_id).trim()) ||
      detail_info.sample_id;
    return `/manager_ga/progress/${detail_info.slug}/${detail_id}`;
  };

  return (
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
            <div className={styles.table_cell}>{campaign.campaign_number}</div>

            {/* 파트너명 */}
            <div className={styles.table_cell}>{campaign.partner_name}</div>

            {/* 캠페인명 */}
            <div className={styles.table_cell_campaign_name}>
              {/* 조건부 렌더링: detail_href가 있으면 Link 컴포넌트를, 없으면 일반 텍스트를 렌더링합니다 */}
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
  );
}
