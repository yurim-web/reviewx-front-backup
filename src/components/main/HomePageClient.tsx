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

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import MainMenu from "@/components/main/MainMenu";
import CampaignBox from "@/components/main/CampaignBox";
import MainBannerSlider from "@/components/main/MainBannerSlider";
import Footer from "@/components/main/Footer";
import Titletext from "@/components/main/Titletext";
import BaseModal from "@/components/common/modal/BaseModal";
import styles from "@/styles/home/home.module.css";
import { useHomeAutoLogin } from "@/hooks/home/useHomeAutoLogin";
import { useHomeCampaigns } from "@/hooks/home/useHomeCampaigns";
import Loading from "@/app/loading";

export default function HomePageClient() {
  const pathname = usePathname();
  useHomeAutoLogin(pathname);

  const {
    banners,
    high_probability_campaigns,
    popular_campaigns,
    similar_campaigns,
    ongoing_campaigns,
    isError,
    isLoading,
  } = useHomeCampaigns();

  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (isError) setShowErrorModal(true);
  }, [isError]);

  if (isLoading) return <Loading />;

  return (
    <>
      <MainMenu />
      <div className={styles.header_spacer} aria-hidden />

      <article className={styles.container}>
        {banners.length > 0 && (
          <section className={styles.main_banner_container}>
            <MainBannerSlider banners={banners} autoSlideInterval={5000} />
          </section>
        )}

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

        {similar_campaigns.length > 0 && (
          <section className={styles.campaign_container}>
            <Titletext main_title="참여한 캠페인과 비슷한 캠페인" />
            <div className={styles.campaign_grid}>
              {similar_campaigns.map((campaign) => (
                <CampaignBox key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </section>
        )}

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

      <BaseModal
        is_open={showErrorModal}
        on_close={() => setShowErrorModal(false)}
        message={"오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."}
        buttons={["확인"]}
      />
    </>
  );
}
