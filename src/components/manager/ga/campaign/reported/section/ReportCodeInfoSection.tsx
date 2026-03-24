/* ========================================
   
   ======================================== */

/**
 * 신고 코드 안내 섹션 컴포넌트
 *
 * 목적: GA 관리자 신고내역 페이지의 신고 코드 안내 섹션을 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/reported (신고내역 페이지)
 *
 */

import styles from "@/styles/manager_ga/campaign/campaign_common.module.css";
import { report_code_info, type ReportCodeInfo } from "@/data/manager_ga/reported";

interface ReportCodeInfoSectionProps {
  reportCodes?: ReportCodeInfo[];
}

export default function ReportCodeInfoSection({ reportCodes }: ReportCodeInfoSectionProps) {
  // API 데이터가 있으면 사용, 없으면 정적 데이터 fallback
  const codes = reportCodes && reportCodes.length > 0 ? reportCodes : report_code_info;

  return (
    <section className={styles.report_code_info_section}>
      <h2 className={styles.section_title}>신고 코드 안내</h2>

      <div className={styles.section_box}>
        <div className={styles.report_code_grid}>
          {codes.map((item) => (
            <div key={item.code} className={styles.report_code_item}>
              <span className={styles.report_code}>{item.code}</span>
              <span className={styles.text}>{item.category}</span>
              <span className={styles.text}>{item.reason}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
