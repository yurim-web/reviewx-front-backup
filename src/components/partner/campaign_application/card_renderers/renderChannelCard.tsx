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
import type { AllApplicant, CampaignWithApplicants } from "@/data/partner/sharedCampaigns";
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
import ReelsCard from "@/components/partner/campaign_application/card_type/reels/ReelsCard";
import ReelsSelectedCard from "@/components/partner/campaign_application/card_type/reels/ReelsSelectedCard";
import ShortsCard from "@/components/partner/campaign_application/card_type/shorts/ShortsCard";
import ShortsSelectedCard from "@/components/partner/campaign_application/card_type/shorts/ShortsSelectedCard";

/**
 * Channel 카드 렌더링 함수 (delivery 전용)
 */
export function renderChannelCard(
  handleSelectApplicant: (applicantId: string) => void,
  handleCancelApplicant: (applicantId: string) => void,
  campaignData: CampaignWithApplicants | null = null
) {
  // eslint-disable-next-line react/display-name
  return (applicant: AllApplicant, isSelected: boolean = false): React.ReactNode => {
    const channel = applicant.channel as string;

    // channel이 "릴스"인 경우
    if (channel === "릴스") {
      return isSelected ? (
        <ReelsSelectedCard
          applicant={applicant as InstagramApplicant}
          onCancel={handleCancelApplicant}
        />
      ) : (
        <ReelsCard applicant={applicant as InstagramApplicant} onSelect={handleSelectApplicant} />
      );
    }

    switch (channel) {
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
        return isSelected ? (
          <NaverClipSelectedCard
            applicant={applicant as NaverClipApplicant}
            onCancel={handleCancelApplicant}
          />
        ) : (
          <NaverClipCard
            applicant={applicant as NaverClipApplicant}
            onSelect={handleSelectApplicant}
          />
        );

      case "인스타그램":
        // 브랜드가 릴스인 경우 전용 카드 사용
        if (campaignData?.campaignInfo.brandName === "릴스") {
          return isSelected ? (
            <ReelsSelectedCard
              applicant={applicant as InstagramApplicant}
              onCancel={handleCancelApplicant}
            />
          ) : (
            <ReelsCard
              applicant={applicant as InstagramApplicant}
              onSelect={handleSelectApplicant}
            />
          );
        }
        return isSelected ? (
          <InstagramSelectedCard
            applicant={applicant as InstagramApplicant}
            onCancel={handleCancelApplicant}
          />
        ) : (
          <InstagramCard
            applicant={applicant as InstagramApplicant}
            onSelect={handleSelectApplicant}
          />
        );

      case "유튜브":
        // 브랜드가 숏츠/쇼츠인 경우 전용 카드 사용
        if (
          campaignData?.campaignInfo.brandName === "숏츠" ||
          campaignData?.campaignInfo.brandName === "쇼츠"
        ) {
          return isSelected ? (
            <ShortsSelectedCard
              applicant={applicant as YoutubeApplicant}
              onCancel={handleCancelApplicant}
            />
          ) : (
            <ShortsCard
              applicant={applicant as YoutubeApplicant}
              onSelect={handleSelectApplicant}
            />
          );
        }
        return isSelected ? (
          <YoutubeSelectedCard
            applicant={applicant as YoutubeApplicant}
            onCancel={handleCancelApplicant}
          />
        ) : (
          <YoutubeCard applicant={applicant as YoutubeApplicant} onSelect={handleSelectApplicant} />
        );

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
