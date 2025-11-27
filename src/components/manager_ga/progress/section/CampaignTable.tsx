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
 * - flex 레이아웃: display: flex와 gap을 사용하여 요소들을 나란히 배치하고 간격을 조절합니다
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
  /* ========================================
     📌 상태 관리 (State Management)
     ======================================== */

  // 체크박스 선택 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [selected_campaigns, set_selected_campaigns] = useState<string[]>([]);

  /* ========================================
     🎯 이벤트 핸들러 (Event Handlers)
     ======================================== */

  /**
   * 개별 체크박스 선택/해제 핸들러
   *
   * 설명:
   * - 사용자가 특정 캠페인의 체크박스를 클릭했을 때 호출됩니다.
   * - 이미 선택된 캠페인이면 목록에서 제거하고, 선택되지 않은 캠페인이면 목록에 추가합니다.
   *
   * 학습 포인트:
   * - includes(): 배열에 특정 요소가 있는지 확인합니다
   * - filter(): 조건에 맞는 요소만 남긴 새로운 배열을 반환합니다
   * - 스프레드 연산자(...): 배열이나 객체를 펼쳐서 새로운 배열/객체를 만듭니다
   *
   * @param campaign_id - 선택/해제할 캠페인 ID
   */
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

  /**
   * 전체 선택/해제 핸들러
   *
   * 설명:
   * - 테이블 헤더의 체크박스를 클릭했을 때 호출됩니다.
   * - 현재 모든 캠페인이 선택되어 있으면 모두 해제하고,
   *   그렇지 않으면 모든 캠페인을 선택합니다.
   *
   * 학습 포인트:
   * - length 속성: 배열의 길이를 반환합니다
   * - map 함수: 배열의 각 요소를 변환하여 새로운 배열을 반환합니다
   *
   * 사용 위치:
   * - 테이블 헤더의 전체 선택 체크박스 (line 123)
   */
  const handle_select_all = () => {
    // 현재 모든 캠페인이 선택되어 있으면 모두 해제, 아니면 모두 선택
    if (selected_campaigns.length === campaign_list.length) {
      set_selected_campaigns([]);
    } else {
      // map 함수: 배열의 각 요소를 변환하여 새로운 배열을 반환합니다
      set_selected_campaigns(campaign_list.map((campaign) => campaign.id));
    }
  };

  /* ========================================
     🛠️ 유틸리티 함수 (Utility Functions)
     ======================================== */

  /**
   * 숫자를 천 단위로 포맷팅하는 함수
   *
   * 설명:
   * - 숫자를 한국어 형식으로 천 단위 구분자를 추가하여 반환합니다.
   * - 예: 115000 -> "115,000"
   *
   * 학습 포인트:
   * - toLocaleString: 숫자를 지역화된 문자열로 변환합니다
   * - 'ko-KR': 한국어 로케일 설정
   *
   * 사용 위치:
   * - 모집 수 표시 (line 192)
   * - 신청 수 표시 (line 197)
   * - 지급 포인트 표시 (line 202)
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
   * 설명:
   * - 캠페인 타입과 ID를 기반으로 상세 페이지 경로를 생성합니다.
   * - 캠페인 타입에 따라 다른 slug를 사용합니다 (delivery, visit, review 등).
   * - detail_campaign_id가 있으면 사용하고, 없으면 sample_id를 사용합니다.
   *
   * 학습 포인트:
   * - Record 타입: 키-값 쌍의 객체 타입을 정의합니다
   * - 옵셔널 체이닝(?.)과 널 병합 연산자(??): 안전하게 값을 가져옵니다
   * - trim(): 문자열의 앞뒤 공백을 제거합니다
   *
   * 사용 위치:
   * - 캠페인명 링크 생성 (line 140, 164)
   *
   * @param campaign - 캠페인 정보 객체
   * @returns 상세 페이지 경로 문자열 또는 null (경로를 생성할 수 없는 경우)
   */
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
    return `/manager_ga/campaign/progress/${detail_info.slug}/${detail_id}`;
  };

  /* ========================================
     🎨 렌더링 (Rendering)
     ======================================== */

  return (
    <div className={styles.table_section}>
      {/* ========================================
          📋 테이블 헤더
          ======================================== */}
      <div className={styles.table_header}>
        <div className={styles.table_header_cell_checkbox}>
          <input
            type="checkbox"
            checked={selected_campaigns.length === campaign_list.length}
            onChange={handle_select_all}
            className={styles.checkbox}
          />
        </div>
        {/* 캠페인 번호 - 화살표 아이콘 포함 */}
        <div className={styles.table_header_cell}>
          <span>캠페인 번호</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.table_header_arrow}
          />
        </div>
        {/* 파트너명 - 텍스트 정렬을 위해 span으로 감싸기 */}
        <div className={styles.table_header_cell}>
          <span>파트너명</span>
        </div>
        {/* 캠페인명 - 텍스트 정렬을 위해 span으로 감싸기 */}
        <div className={styles.table_header_cell}>
          <span>캠페인명</span>
        </div>
        {/* 상태 - 텍스트 정렬을 위해 span으로 감싸기 */}
        <div className={styles.table_header_cell}>
          <span>상태</span>
        </div>
        {/* 유형 - 텍스트 정렬을 위해 span으로 감싸기 */}
        <div className={styles.table_header_cell}>
          <span>유형</span>
        </div>
        {/* 채널 - 텍스트 정렬을 위해 span으로 감싸기 */}
        <div className={styles.table_header_cell}>
          <span>채널</span>
        </div>
        {/* 신청 수 - 화살표 아이콘 포함 */}
        <div className={styles.table_header_cell}>
          <span>신청 수</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.table_header_arrow}
          />
        </div>
        {/* 모집 수 - 화살표 아이콘 포함 */}
        <div className={styles.table_header_cell}>
          <span>모집 수</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.table_header_arrow}
          />
        </div>
        {/* 지급 포인트 - 화살표 아이콘 포함 */}
        <div className={styles.table_header_cell}>
          <span>지급 포인트</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.table_header_arrow}
          />
        </div>
      </div>

      {/* ========================================
          📋 테이블 바디 - 캠페인 목록 렌더링
          ======================================== */}
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

            {/* 상태 */}
            <div className={styles.table_cell}>
              <CampaignStatusTag status={campaign.status} />
            </div>

            {/* 유형 */}
            <div className={styles.table_cell}>
              <CampaignTypeTag type={campaign.type} />
            </div>

            {/* 채널 */}
            <div className={styles.table_cell}>
              <ChannelIcon channel={campaign.channel} />
            </div>

            {/* 신청 수 */}
            <div className={styles.table_cell}>
              {format_number(campaign.apply_count)}
            </div>

            {/* 모집 수 */}
            <div className={styles.table_cell}>
              {format_number(campaign.recruit_count)}
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
