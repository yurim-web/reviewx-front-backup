/* ========================================
   📥 엑셀 다운로드 버튼 컴포넌트
   ======================================== */

/**
 * 엑셀 다운로드 버튼 컴포넌트
 *
 * 목적: 캠페인 신청 내역 페이지에서 신청자/선정자 목록을 엑셀로 다운로드하는 버튼입니다.
 *
 * 사용 페이지:
 * - /partner/campaign_application/delivery (배송형 캠페인 신청내역)
 * - /partner/campaign_application/visit (방문형 캠페인 신청내역)
 * - /partner/campaign_application/review (리뷰형 캠페인 신청내역)
 * - /partner/campaign_application/reporter (기자단형 캠페인 신청내역)
 * - /partner/campaign_application/mission (미션형 캠페인 신청내역)
 *
 * 주요 기능:
 * - 신청자 목록 엑셀 다운로드
 * - 선정자 목록 엑셀 다운로드
 * - 정렬 옵션 선택 (최신순/오래된순)
 */

import styles from "@/styles/partner/campaign_application/excel_download_btn.module.css";

interface ExcelDownloadBtnProps {
  onDownloadApplicants: () => void;
  onDownloadSelected: () => void;
}

export default function ExcelDownloadBtn({
  onDownloadApplicants,
  onDownloadSelected,
}: ExcelDownloadBtnProps) {
  return (
    <div className={styles.download_btn_group}>
      {/* 신청자 목록 다운로드 버튼 */}
      <button className={styles.download_button} onClick={onDownloadApplicants}>
        <img src="/images/excel_icon.png" alt="다운로드" />
        신청자 목록 다운로드
      </button>

      {/* 선정자 목록 다운로드 버튼 */}
      <button className={styles.download_button} onClick={onDownloadSelected}>
        <img src="/images/excel_icon.png" alt="다운로드" />
        선정자 목록 다운로드
      </button>
    </div>
  );
}
