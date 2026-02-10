/* ========================================
   📝 GA 관리자 템플릿 관리 페이지
   ======================================== */

/**
 * GA 관리자 템플릿 관리 페이지
 *
 * 목적: GA 관리자가 캠페인 템플릿을 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/campaign/templates
 *
 * 현재 상태:
 * - 준비중 페이지
 *
 */

'use client';

import styles from '@/styles/manager_ga/campaign/templates/templates_page.module.css';
import ManagerPageTitle from '@/components/manager/common/fragments/ManagerPageTitle';

export default function TemplatesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="템플릿 관리" />

        {/* 준비중 메시지 섹션 */}
        <div className={styles.coming_soon_section}>
          <div className={styles.coming_soon_icon}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="32"
                cy="32"
                r="30"
                stroke="#D9D9D9"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M32 20V32L40 40"
                stroke="#D9D9D9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className={styles.coming_soon_title}>준비중입니다</h2>
          <p className={styles.coming_soon_message}>
            템플릿 관리 기능을 준비하고 있습니다.
            <br />
            조금만 기다려주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
