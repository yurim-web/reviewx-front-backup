"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PartnerTabNavigation from "@/components/partner/TabNavigation";
import PartnerSubTabNavigation from "@/components/partner/SubTabNavigation";
import layoutStyles from "../../../../styles/partner/layout.module.css";
import styles from "../../../../styles/user/mypage/profile.module.css";
import type { MainTab } from "@/types/campaignManagement";

export default function PartnerProfilePage() {
  const router = useRouter();
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
        <div className={styles.profile_section}>
          <div className={styles.profile_info}>
            <div className={styles.profile_image} />
            <div className={styles.profile_details}>
              <div className={styles.profile_role}>파트너</div>
              <div className={styles.profile_nickname_container}>
                <div className={styles.profile_nickname}>브랜드_파트너</div>
                <Image
                  className={styles.edit_icon}
                  src="/images/icons/chevron_right.svg"
                  alt="프로필 편집 이동"
                  width={16}
                  height={16}
                  onClick={() => router.push("/partner/mypage/edit")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.menu_list}>
          <button
            className={styles.menu_item}
            onClick={() =>
              window.open("https://markx.dev/guide_book", "_blank")
            }
          >
            <div className={styles.menu_icon} />
            <div className={styles.menu_text}>이용 가이드</div>
          </button>
          <button
            className={styles.menu_item}
            onClick={() => router.push("/partner/campaign_management")}
          >
            <div className={styles.menu_icon} />
            <div className={styles.menu_text}>캠페인 관리</div>
          </button>
          <button
            className={styles.menu_item}
            onClick={() => router.push("/partner/campaign_application")}
          >
            <div className={styles.menu_icon} />
            <div className={styles.menu_text}>캠페인 신청 현황</div>
          </button>
        </div>
      </main>
    </div>
  );
}
