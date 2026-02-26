/* ========================================
   🎨 채널 아이콘 컴포넌트 (공통)
   ======================================== */
/* eslint-disable @next/next/no-img-element */

/**
 * 채널 아이콘 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 채널 아이콘 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 *
 * 주요 기능:
 * - Blog, Clip, Instagram, Mission, Reels, Review, Shorts, Store, Youtube 채널 아이콘 표시
 * - 채널 이름에 따라 적절한 아이콘을 표시합니다
 *
 */

// 채널 타입 정의
export type Channel =
  | "Blog"
  | "Clip"
  | "Instagram"
  | "Mission"
  | "Reels"
  | "Review"
  | "Shorts"
  | "Store"
  | "Youtube";

// 채널 아이콘 props 타입 정의
interface ChannelIconProps {
  channel: Channel; // 채널 타입
  styles: {
    channel_icon: string;
    channel_icon_image: string;
  }; // CSS 모듈 스타일 객체
}

// 채널별 아이콘 경로 매핑
const channel_icon_map: Record<Channel, string> = {
  Blog: "/images/brand_logo/naverblog.svg",
  Clip: "/images/brand_logo/naverclip.svg",
  Instagram: "/images/brand_logo/insta.svg",
  Youtube: "/images/brand_logo/youtube.svg",
  Reels: "/images/brand_logo/reels.svg",
  Review: "/images/brand_logo/review.svg",
  Shorts: "/images/brand_logo/shots.svg",
  Mission: "/images/brand_logo/misssion.svg",
  Store: "/images/brand_logo/navershop.svg",
};

/**
 * 채널 아이콘 컴포넌트
 *
 * @param channel - 채널 타입
 * @param styles - CSS 모듈 스타일 객체
 */
export default function ChannelIcon({ channel, styles: cssStyles }: ChannelIconProps) {
  const icon_path = channel_icon_map[channel] || "/images/icons/phone_verified.svg";

  return (
    <div className={cssStyles.channel_icon}>
      <img src={icon_path} alt={channel} className={cssStyles.channel_icon_image} />
    </div>
  );
}
