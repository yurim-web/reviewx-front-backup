"use client";

import React, { useState } from "react";
import styles from "../../../styles/user/mypage/store_connect_modal.module.css";

interface StoreConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  storeIcon?: string;
  onConnect: (accountInfo: { storeId: string; email: string }) => void;
}

export default function StoreConnectModal({
  isOpen,
  onClose,
  storeName,
  storeIcon,
  onConnect,
}: StoreConnectModalProps) {
  const [storeId, setStoreId] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConnect = () => {
    if (storeId.trim()) {
      onConnect({ storeId: storeId.trim(), email: "" });
      setStoreId("");
      onClose();
    }
  };

  const getStoreIdPlaceholder = () => {
    switch (storeName) {
      case "네이버 쇼핑":
        return "네이버 쇼핑 ID";
      case "쿠팡":
        return "쿠팡 계정 이메일";
      case "카카오 쇼핑":
        return "카카오 계정 이메일";
      case "카카오 선물하기":
        return "카카오 계정 이메일";
      case "오늘의집":
        return "오늘의집 ID";
      case "올리브영":
        return "올리브영 ID";
      case "컬리":
        return "컬리 계정 이메일";
      case "지그재그":
        return "지그재그 ID";
      default:
        return "스토어 ID";
    }
  };

  const getEmailPlaceholder = () => {
    switch (storeName) {
      case "쿠팡":
      case "카카오 쇼핑":
      case "카카오 선물하기":
      case "컬리":
        return "example@email.com";
      default:
        return "연결된 이메일 (선택사항)";
    }
  };

  const isEmailRequired = () => {
    return ["쿠팡", "카카오 쇼핑", "카카오 선물하기", "컬리"].includes(
      storeName
    );
  };

  return (
    <div className={styles.modal_overlay} onClick={handleBackdropClick}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className={styles.modal_header}>
          <h3 className={styles.modal_title}>{storeName} 연결</h3>
          <button className={styles.modal_close_button} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 모달 바디 */}
        <div className={styles.modal_body}>
          <div className={styles.input_section}>
            <div className={styles.input_group}>
              <input
                type="text"
                className={styles.input_field}
                placeholder={getStoreIdPlaceholder()}
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className={styles.modal_footer}>
          <button
            className={styles.connect_button}
            onClick={handleConnect}
            disabled={!storeId.trim()}
          >
            스토어 연결하기
          </button>
        </div>
      </div>
    </div>
  );
}
