/* ========================================
   🔍 채널 필터 모달 컴포넌트
   ======================================== */

/**
 * 채널 필터 모달 컴포넌트
 *
 * 목적: GA/SA 관리자 진행 현황 페이지에서 캠페인 채널을 필터링하는 모달입니다.
 *
 * 📍 사용 위치:
 * - src/components/manager_ga/campaign/progress/section/FilterSection.tsx
 *   (GA 관리자 진행 현황 페이지의 필터 섹션)
 * - src/components/manager_sa/campaign/progress/section/FilterSection.tsx
 *   (SA 관리자 진행 현황 페이지의 필터 섹션)
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 채널 옵션: 네이버 블로그, 인스타그램, 유튜브, 클립, 릴스, 쇼츠
 * - 필터 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 *
 */

'use client';

import { createFilterModal } from './createFilterModal';

// 채널 타입 정의 (영문)
export type Channel =
  | 'Blog'
  | 'Clip'
  | 'Instagram'
  | 'Mission'
  | 'Reels'
  | 'Shorts'
  | 'Store'
  | 'Youtube';

// 채널 한글명 매핑 (export하여 다른 컴포넌트에서도 사용 가능)
export const channel_label_map: Record<Channel, string> = {
  Blog: '네이버 블로그',
  Instagram: '인스타그램',
  Youtube: '유튜브',
  Clip: '클립',
  Reels: '릴스',
  Shorts: '쇼츠',
  Mission: '미션',
  Store: '스토어',
};

interface ChannelFilterModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  selected_channels: Channel[]; // 현재 선택된 채널들
  on_apply: (channels: Channel[]) => void; // 필터 적용 함수
}

// 채널 필터 옵션
const channel_options: Channel[] = [
  'Blog',
  'Instagram',
  'Youtube',
  'Clip',
  'Reels',
  'Shorts',
];

// 팩토리 함수를 사용하여 필터 모달 생성
// - createFilterModal: 공통 패턴을 추출한 팩토리 함수입니다
// - label_map: 영문 채널명을 한글명으로 변환하기 위한 매핑 객체입니다
const ChannelFilterModalComponent = createFilterModal<Channel>({
  options: channel_options,
  section_title: '채널',
  label_map: channel_label_map,
});

// Props 이름을 ChannelFilterModalProps에 맞게 변환하는 래퍼 컴포넌트
export default function ChannelFilterModal({
  is_open,
  on_close,
  selected_channels,
  on_apply,
}: ChannelFilterModalProps) {
  return (
    <ChannelFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_channels}
      on_apply={on_apply}
    />
  );
}
