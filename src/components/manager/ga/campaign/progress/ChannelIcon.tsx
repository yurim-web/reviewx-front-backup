/* ========================================
   📱 채널 아이콘 컴포넌트
   ======================================== */

/**
 * 채널 아이콘 컴포넌트
 *
 * 목적: 캠페인의 채널을 아이콘으로 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/progress (진행 상황 페이지)
 *
 * 주요 기능:
 * - Blog, Clip, Instagram, Mission, Reels, Shorts, Store, Youtube 채널 아이콘 표시
 * - 채널 이름에 따라 적절한 아이콘을 표시합니다.
 *
 */

import ChannelIconCommon, {
  type Channel,
} from '@/components/manager/common/campaign/progress/icons/ChannelIcon';
import styles from '@/styles/manager_ga/campaign/progress/channel_icon.module.css';

// 채널 아이콘 props 타입 정의
interface ChannelIconProps {
  channel: Channel; // 채널 타입
}

// 타입도 export (재사용을 위해)
export type { Channel };

/**
 * 채널 아이콘 컴포넌트
 *
 * 목적: 공통 컴포넌트를 사용하여 중복 코드를 제거합니다.
 *
 * @param channel - 채널 타입
 */
export default function ChannelIcon({ channel }: ChannelIconProps) {
  return <ChannelIconCommon channel={channel} styles={styles} />;
}
