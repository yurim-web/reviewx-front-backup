import type { Channel } from "@/data/manager_ga/member/reviewers";

export const API_CHANNEL_MAP: Record<string, Channel> = {
  NAVER_BLOG: "Blog",
  INSTAGRAM: "Instagram",
  YOUTUBE: "Youtube",
  NAVER_CLIP: "Clip",
  REELS: "Instagram",
};

export const CAMPAIGN_TYPE_MAP: Record<string, "배송형" | "구매평"> = {
  DELIVERY: "배송형",
  PURCHASE_REVIEW: "구매평",
  MISSION: "배송형",
  VISIT: "배송형",
  REPORTER: "배송형",
};
