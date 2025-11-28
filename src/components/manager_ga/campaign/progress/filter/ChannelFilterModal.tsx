/* ========================================
   🔍 채널 필터 모달 컴포넌트
   ======================================== */

/**
 * 채널 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지에서 캠페인 채널을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - FilterSection 컴포넌트의 채널 필터에서 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 채널 옵션: 네이버 블로그, 인스타그램, 유튜브, 클립, 릴스, 쇼츠
 * - 필터 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 *
 * 학습 포인트:
 * - 컴포넌트 재사용: BaseFilterModal 공통 컴포넌트를 사용하여 중복 코드를 제거합니다
 * - 데이터 변환: channel_options를 FilterOption 형태로 변환하여 공통 컴포넌트에 전달합니다
 * - 컴포지션(Composition): 작은 컴포넌트들을 조합하여 더 큰 컴포넌트를 만드는 패턴입니다
 */

'use client';

import BaseFilterModal, {
  type FilterOption,
} from '@/components/manager_ga/common/filter/BaseFilterModal';

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

// 채널 옵션을 FilterOption 형태로 변환하는 함수
// map 함수: 배열을 순회하며 새로운 형태의 배열을 만듭니다
const get_channel_options = (): FilterOption<Channel>[] => {
  return channel_options.map((channel) => ({
    value: channel,
    label: channel_label_map[channel],
  }));
};

export default function ChannelFilterModal({
  is_open,
  on_close,
  selected_channels,
  on_apply,
}: ChannelFilterModalProps) {
  // 채널 옵션을 FilterOption 형태로 변환
  const options = get_channel_options();

  // BaseFilterModal 공통 컴포넌트를 사용하여 중복 코드 제거
  return (
    <BaseFilterModal<Channel>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_channels}
      on_apply={on_apply}
      options={options}
      section_title="채널"
    />
  );
}
