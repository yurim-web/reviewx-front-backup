/* ========================================
🎴 Channel 카드 렌더러
======================================== */

/**
 * Channel 카드 렌더러
 *
 * 목적: delivery 캠페인에서 사용하는 channel 기반 카드 렌더링 로직
 *
 * 사용 페이지:
 * - /partner/campaign_application/delivery/[id]
 */

import React from "react";
import type { AllApplicant } from "@/data/partner/sharedCampaigns";
import {
  type Applicant,
  type NaverClipApplicant,
  type InstagramApplicant,
  type YoutubeApplicant,
} from "@/data/partner/campaign_application/delivery_applicants";

import NaverBlogCard from "@/components/partner/campaign_application/card_type/naverblog/NaverBlogCard";
import NaverClipCard from "@/components/partner/campaign_application/card_type/naverclip/NaverClipCard";
import NaverClipSelectedCard from "@/components/partner/campaign_application/card_type/naverclip/NaverClipSelectedCard";
import InstagramCard from "@/components/partner/campaign_application/card_type/instagram/InstagramCard";
import InstagramSelectedCard from "@/components/partner/campaign_application/card_type/instagram/InstagramSelectedCard";
import YoutubeCard from "@/components/partner/campaign_application/card_type/youtube/YoutubeCard";
import YoutubeSelectedCard from "@/components/partner/campaign_application/card_type/youtube/YoutubeSelectedCard";

/**
 * Channel 카드 렌더링 함수 (delivery 전용)
 */
export function renderChannelCard(
  handleSelectApplicant: (applicant: AllApplicant) => void,
  handleCancelApplicant: (applicant: AllApplicant) => void
) {
  // eslint-disable-next-line react/display-name
  return (applicant: AllApplicant, isSelected: boolean = false): React.ReactNode => {
    switch (applicant.channel) {
      case "네이버블로그":
        return (
          <NaverBlogCard
            applicant={applicant as Applicant}
            variant={isSelected ? "selected" : "applicant"}
            onSelect={handleSelectApplicant}
            onCancel={handleCancelApplicant}
          />
        );

      case "네이버클립":
        if (isSelected) {
          return (
            <NaverClipSelectedCard
              applicant={applicant as NaverClipApplicant}
              onCancel={handleCancelApplicant}
            />
          );
        } else {
          return (
            <NaverClipCard
              applicant={applicant as NaverClipApplicant}
              onSelect={handleSelectApplicant}
            />
          );
        }

      case "인스타그램":
        if (isSelected) {
          return (
            <InstagramSelectedCard
              applicant={applicant as InstagramApplicant}
              onCancel={handleCancelApplicant}
            />
          );
        } else {
          return (
            <InstagramCard
              applicant={applicant as InstagramApplicant}
              onSelect={handleSelectApplicant}
            />
          );
        }

      case "유튜브":
        if (isSelected) {
          return (
            <YoutubeSelectedCard
              applicant={applicant as YoutubeApplicant}
              onCancel={handleCancelApplicant}
            />
          );
        } else {
          return (
            <YoutubeCard
              applicant={applicant as YoutubeApplicant}
              onSelect={handleSelectApplicant}
            />
          );
        }

      default:
        return (
          <NaverBlogCard
            applicant={applicant as unknown as Applicant}
            variant={isSelected ? "selected" : "applicant"}
            onSelect={handleSelectApplicant}
            onCancel={handleCancelApplicant}
          />
        );
    }
  };
}
