/* ========================================
   🏠 메인 홈 페이지 컴포넌트 (공통)
   ======================================== */

/**
 * 메인 홈 페이지 컴포넌트 (공통)
 *
 * 사용 위치: /, /user, /partner
 * 기능: 배너, 선정 확률 높은 캠페인, 인기 캠페인, 참여한 캠페인과 비슷한 캠페인, 진행 중인 캠페인
 */

"use client";

import { usePathname } from "next/navigation";
import MainMenu from "@/components/main/MainMenu";
import CampaignBox from "@/components/main/CampaignBox";
import MainBannerSlider from "@/components/main/MainBannerSlider";
import Footer from "@/components/main/Footer";
import Titletext from "@/components/main/Titletext";
import styles from "@/styles/home/home.module.css";
import { useHomeAutoLogin } from "@/hooks/home/useHomeAutoLogin";
import { useHomeCampaigns } from "@/hooks/home/useHomeCampaigns";

const MAIN_BANNERS = [
  "/images/main/main_banner.png",
  "/images/main/main_banner2.png",
  "/images/main/main_banner.png",
  "/images/main/main_banner.png",
  "/images/main/main_banner.png",
];

export default function HomePageClient() {
  const pathname = usePathname();
  useHomeAutoLogin(pathname);

  const {
    high_probability_campaigns,
    popular_campaigns,
    similar_campaigns,
    ongoing_campaigns,
  } = useHomeCampaigns();

  return (
    <>
      <MainMenu />
      <div className={styles.header_spacer} aria-hidden />

      <article className={styles.container}>
        <section className={styles.main_banner_container}>
          <MainBannerSlider
            banners={MAIN_BANNERS}
            autoSlideInterval={5000}
          />
        </section>

        <section className={styles.campaign_container}>
          <Titletext main_title="선정 확률 높은 캠페인" />
          <div className={styles.campaign_grid}>
            {high_probability_campaigns.map((campaign) => (
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        <section className={styles.campaign_container}>
          <Titletext main_title="지금 인기 많은 캠페인" />
          <div className={styles.campaign_grid}>
            {popular_campaigns.map((campaign) => (
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        <section className={styles.campaign_container}>
          <Titletext main_title="참여한 캠페인과 비슷한 캠페인" />
          <div className={styles.campaign_grid}>
            {similar_campaigns.map((campaign) => (
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        <section className={styles.campaign_container}>
          <Titletext main_title="진행 중인 캠페인" />
          <div className={styles.campaign_grid}>
            {ongoing_campaigns.map((campaign) => (
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </>
  );
}
