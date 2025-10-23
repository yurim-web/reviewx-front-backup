"use client";

import { useRouter } from "next/navigation";
import styles from "../../styles/user/mypage/navigation.module.css";

interface PartnerSubTabNavigationProps {
  activeSubTab: "profile";
  setActiveSubTab: (tab: "profile") => void;
}

export default function PartnerSubTabNavigation({
  activeSubTab,
  setActiveSubTab,
}: PartnerSubTabNavigationProps) {
  const router = useRouter();

  const handleSubTabClick = (tab: "profile") => {
    router.push("/partner/mypage/profile");
  };

  return (
    <div className={styles.sub_tab_container}>
      <button
        className={`${styles.sub_tab_item} ${styles.active}`}
        onClick={() => handleSubTabClick("profile")}
      >
        프로필
      </button>
      <div className={styles.sub_tab_indicator} />
    </div>
  );
}
