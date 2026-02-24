/* ========================================
   📥 콘텐츠 내역 엑셀 다운로드 버튼 컴포넌트
   ======================================== */

/**
 * 콘텐츠 내역 엑셀 다운로드 버튼 컴포넌트
 *
 * 목적: 캠페인 콘텐츠 내역 페이지에서 검수/완료 콘텐츠 목록을 엑셀로 다운로드하는 버튼입니다.
 *
 * 사용 페이지:
 * - /partner/campaign_content/delivery (배송형 캠페인 콘텐츠 내역)
 * - /partner/campaign_content/visit (방문형 캠페인 콘텐츠 내역)
 * - /partner/campaign_content/review (리뷰형 캠페인 콘텐츠 내역)
 * - /partner/campaign_content/reporter (기자단형 캠페인 콘텐츠 내역)
 * - /partner/campaign_content/mission (미션형 캠페인 콘텐츠 내역)
 *
 */

import styles from "@/styles/partner/campaign_application/excel_download_btn.module.css";

interface ContentExcelDownloadBtnProps {
  /** 검수 중인 콘텐츠 목록 다운로드 핸들러 */
  onDownloadReview: () => void;
  /** 완료된 콘텐츠 목록 다운로드 핸들러 */
  onDownloadCompleted: () => void;
  /** 결과 보고서 다운로드 핸들러 */
  onDownloadReport: () => void;
}

/**
 * 콘텐츠 내역 엑셀 다운로드 버튼 컴포넌트
 *
 * 📌 React 함수형 컴포넌트:
 * - props를 매개변수로 받음
 * - 구조분해할당으로 필요한 속성만 추출
 * - JSX를 반환하여 UI 렌더링
 *
 * 📌 콘텐츠 내역 특화 기능:
 * - 검수 중인 콘텐츠 목록 다운로드
 * - 완료된 콘텐츠 목록 다운로드
 * - 결과 보고서 다운로드
 *
 * @param props - ContentExcelDownloadBtnProps 타입의 props
 * @returns JSX 요소
 */
export default function ContentExcelDownloadBtn({
  onDownloadReview,
  onDownloadCompleted,
  onDownloadReport,
}: ContentExcelDownloadBtnProps) {
  return (
    <div className={styles.download_btn_group}>
      {/* 검수 중인 콘텐츠 목록 다운로드 버튼 */}
      <button className={styles.download_button} onClick={onDownloadReview}>
        <img src="/images/excel_icon.png" alt="다운로드" />
        검수 중인 콘텐츠 다운로드
      </button>

      {/* 완료된 콘텐츠 목록 다운로드 버튼 */}
      <button className={styles.download_button} onClick={onDownloadCompleted}>
        <img src="/images/excel_icon.png" alt="다운로드" />
        완료된 콘텐츠 다운로드
      </button>

      {/* 결과 보고서 다운로드 버튼 */}
      <button className={styles.download_button} onClick={onDownloadReport}>
        <img src="/images/excel_icon.png" alt="다운로드" />
        결과 보고서 다운로드
      </button>
    </div>
  );
}
