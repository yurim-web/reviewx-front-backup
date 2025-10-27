"use client";

import { useState } from "react";
import PartnerTabNavigation from "@/components/partner/campaign_management/TabNavigation";
import PartnerSubTabNavigation from "@/components/partner/SubTabNavigation";
import layoutStyles from "../../../../styles/partner/layout.module.css";
import styles from "../../../../styles/user/mypage/channel.module.css";
import type { MainTab } from "@/types/campaignManagement";

export default function PartnerChannelPage() {
  const [activeTopTab, setActiveTopTab] = useState<MainTab>("account");
  const [activeSubTab, setActiveSubTab] = useState<"profile">("profile");

  return (
    <div className={layoutStyles.partner_dashboard_container}>
      <main className={layoutStyles.partner_main_content}>
        <PartnerTabNavigation
          activeTab={activeTopTab}
          setActiveTab={setActiveTopTab}
        />
        <PartnerSubTabNavigation
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
        />
        <section className={styles.channel_section}>
          <div className={styles.channel_card}>
            <div className={styles.channel_header}>스토어/채널 연결</div>
            <div className={styles.channel_body}>
              파트너 스토어/채널 연결 UI (추후 구현)
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
