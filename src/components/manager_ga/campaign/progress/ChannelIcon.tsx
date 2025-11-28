/* ========================================
   🎨 채널 아이콘 컴포넌트
   ======================================== */

/**
 * 채널 아이콘 컴포넌트
 *
 * 목적: 캠페인의 채널을 아이콘으로 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - Blog, Clip, Instagram, Mission, Reels, Shorts, Store, Youtube 채널 아이콘 표시
 * - 채널 이름에 따라 적절한 아이콘을 표시합니다
 *
 * 학습 포인트:
 * - 조건부 렌더링: 채널에 따라 다른 아이콘을 표시합니다
 * - 이미지 경로: public 폴더의 이미지를 사용합니다
 * - alt 속성: 접근성을 위한 대체 텍스트를 제공합니다
 */

import styles from '@/styles/manager_ga/campaign/progress/channel_icon.module.css';

// 채널 타입 정의
export type Channel =
  | 'Blog'
  | 'Clip'
  | 'Instagram'
  | 'Mission'
  | 'Reels'
  | 'Shorts'
  | 'Store'
  | 'Youtube';

// 채널 아이콘 props 타입 정의
interface ChannelIconProps {
  channel: Channel; // 채널 타입
}

// 채널별 아이콘 경로 매핑
const channel_icon_map: Record<Channel, string> = {
  Blog: '/images/brand_logo/naverblog.svg',
  Clip: '/images/brand_logo/naverclip.svg',
  Instagram: '/images/brand_logo/insta.svg',
  Youtube: '/images/brand_logo/youtube.svg',
  Reels: '/images/brand_logo/reels.svg',
  Shorts: '/images/brand_logo/shots.svg',
  Mission: '/images/brand_logo/misssion.svg',
  Store: '/images/brand_logo/navershop.svg',
};

/**
 * 채널 아이콘 컴포넌트
 *
 * @param channel - 채널 타입
 */
export default function ChannelIcon({ channel }: ChannelIconProps) {
  const icon_path = channel_icon_map[channel] || '/images/icons/phone_verified.svg';

  return (
    <div className={styles.channel_icon}>
      <img
        src={icon_path}
        alt={channel}
        className={styles.channel_icon_image}
      />
    </div>
  );
}

