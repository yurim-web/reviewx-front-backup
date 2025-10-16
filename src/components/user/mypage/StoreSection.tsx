"use client";

import React, { useState } from "react";
import StoreConnectModal from "./StoreConnectModal";
import styles from "../../../styles/user/mypage/mypage.module.css";

interface StoreInfo {
  name: string;
  storeId?: string;
  email?: string;
  status: "connected" | "disconnected";
}

interface StoreSectionProps {
  stores: StoreInfo[];
  onStoreUpdate: (
    storeName: string,
    storeInfo: { storeId: string; email: string }
  ) => void;
}

export default function StoreSection({
  stores,
  onStoreUpdate,
}: StoreSectionProps) {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStoreClick = (storeName: string) => {
    setSelectedStore(storeName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  const handleConnect = (storeInfo: { storeId: string; email: string }) => {
    if (selectedStore) {
      onStoreUpdate(selectedStore, storeInfo);
    }
  };

  const getStoreIcon = (storeName: string) => {
    // 실제로는 각 스토어별 아이콘을 반환
    return `/images/brand_logo/${storeName
      .toLowerCase()
      .replace(/\s+/g, "")}.svg`;
  };

  return (
    <>
      <div className={styles.store_section}>
        <div className={styles.section_title}>스토어</div>

        <div className={styles.store_grid}>
          {stores.map((store) => (
            <div key={store.name} className={styles.store_item}>
              <div className={styles.store_icon}>
                <img
                  src={getStoreIcon(store.name)}
                  alt={store.name}
                  onError={(e) => {
                    // 아이콘이 없을 경우 기본 아이콘 표시
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className={styles.store_info}>
                <div className={styles.store_name}>{store.name}</div>
                {store.status === "connected" ? (
                  <div className={styles.store_id}>
                    {store.storeId || store.email}
                  </div>
                ) : (
                  <div className={styles.store_status}>
                    계정을 연결해 주세요.
                  </div>
                )}
              </div>
              <button
                className={styles.store_more_button}
                onClick={() => handleStoreClick(store.name)}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M14 8V20M8 14H20"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <StoreConnectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        storeName={selectedStore || ""}
        onConnect={handleConnect}
      />
    </>
  );
}
