/* ========================================
   푸터 컴포넌트
   ======================================== */
/* eslint-disable @next/next/no-img-element */

/**
 * Footer
 *
 * 목적: 앱 전체 하단 푸터 표시
 *
 * 사용 페이지:
 * - 전체 레이아웃 (홈, 캠페인 목록, 검색 결과 등 모든 페이지)
 */

"use client";

import { useState } from "react";
import styles from "@/styles/main/footer.module.css";

export default function Footer() {
  const [is_business_info_open, set_is_business_info_open] = useState(false);

  const handle_business_info_toggle = () => {
    set_is_business_info_open((prev) => !prev);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        {/* 상단 섹션: 로고, 링크, 저작권 */}
        <div className={styles.top_section}>
          {/* 로고와 링크 섹션을 묶은 그룹 */}
          <div className={styles.left_group}>
            {/* 로고 + 회사명 (모바일에서 회사명 표시) */}
            <div className={styles.logo_container}>
              <img src="/images/footer/footer_logo.svg" alt="Mark-X" className={styles.logo} />
              <span className={styles.company_name}>주식회사 마크엑스</span>
            </div>

            {/* 모바일 전용 구분선 (로고/회사명과 링크 사이) */}
            <div className={styles.mobile_divider} aria-hidden="true" />

            {/* 링크 섹션 */}
            <div className={styles.links_section}>
              <span className={styles.link}>개인정보처리방침</span>
              <span className={styles.link_separator}>|</span>
              <span className={styles.link}>이용약관</span>
              <span className={styles.link_separator}>|</span>
              <button
                type="button"
                className={`${styles.link} ${styles.business_info_toggle}`}
                onClick={handle_business_info_toggle}
              >
                사업자 정보
                <img
                  src="/images/footer/footer_arrow.svg"
                  alt=""
                  className={`${styles.arrow_icon} ${
                    is_business_info_open ? styles.arrow_icon_rotated : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 저작권 정보 */}
          <p className={styles.copyright}>© 2025 Mark-X Co., Ltd. All rights reserved.</p>
        </div>

        {is_business_info_open && (
          <>
            {/* 구분선 */}
            <div className={styles.divider}></div>

            {/* 회사 상세 정보 */}
            <div className={styles.company_info}>
              <div className={styles.info_row}>
                <span className={styles.info_group}>
                  <span className={styles.info_value}>주식회사 마크엑스</span>
                  <span className={styles.info_separator}>|</span>
                  <span className={styles.info_label}>대표자</span>
                  <span className={styles.info_value}>유기수</span>
                </span>
                <span className={styles.info_group}>
                  <span className={styles.info_label}>사업자등록번호</span>
                  <span className={styles.info_value}>246-87-04020</span>
                </span>
                <span className={styles.info_group}>
                  <span className={styles.info_label}>통신판매업신고번호</span>
                  <span className={styles.info_value}>제2025-인천남동-00000호</span>
                </span>
              </div>
              <div className={styles.info_row}>
                <span className={styles.info_group}>
                  <span className={styles.info_label}>주소</span>
                  <span className={styles.info_value}>
                    인천 남동구 장자로 14, 2층 201호 (장수동)
                  </span>
                </span>
                <span className={styles.info_group}>
                  <span className={styles.info_label}>메일</span>
                  <span className={styles.info_value}>contact@markx.dev</span>
                  <span className={styles.info_separator}>|</span>
                  <span className={styles.info_label}>전화</span>
                  <span className={styles.info_value}>1500-0000</span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}
