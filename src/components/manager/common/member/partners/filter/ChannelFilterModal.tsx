/* ========================================
   🔍 채널 필터 모달 컴포넌트 (공통)
   ======================================== */

/**
 * 채널 필터 모달 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 파트너 목록 페이지에서 채널을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - PartnerFilterSection 컴포넌트에서 채널 필터로 사용
 * - /manager_ga/member/partners (GA 관리자 파트너 목록 페이지)
 * - /manager_sa/member/partners (SA 관리자 파트너 목록 페이지)
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 채널 옵션: Blog, Clip, Instagram, Youtube, Store
 * - 필터 적용/초기화 기능
 * - 모달 외부 클릭으로 닫기
 */

'use client';

import BaseFilterModal, {
  type FilterOption,
} from '@/components/manager/ga/common/filter/BaseFilterModal';
import type { Channel } from '@/data/manager_ga/member/partners';

interface ChannelFilterModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 채널들
  selected_channels: Channel[];
  // 필터 적용 함수 (선택된 채널들을 부모 컴포넌트로 전달)
  on_apply: (channels: Channel[]) => void;
}

// 채널 필터 옵션 배열
const channel_options: { value: Channel; label: string }[] = [
  { value: 'Blog', label: '네이버 블로그' },
  { value: 'Clip', label: '네이버 클립' },
  { value: 'Instagram', label: '인스타그램' },
  { value: 'Youtube', label: '유튜브' },
];

// 채널 옵션을 FilterOption 형태로 변환하는 함수
const get_channel_options = (): FilterOption<Channel>[] => {
  return channel_options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
};

export default function ChannelFilterModal({
  is_open,
  on_close,
  selected_channels,
  on_apply,
}: ChannelFilterModalProps) {
  const options = get_channel_options();

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

