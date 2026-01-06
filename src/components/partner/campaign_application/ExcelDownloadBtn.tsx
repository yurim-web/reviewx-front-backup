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
 * - 데이터가 없을 때 안내 모달 표시
 */

"use client";

import { useState } from "react";
import styles from "@/styles/partner/campaign_application/excel_download_btn.module.css";
import BaseModal from "@/components/common/modal/BaseModal";

interface ExcelDownloadBtnProps {
  onDownloadApplicants: () => void;
  // 선택적: 선정자 목록 다운로드 버튼 핸들러 (제공 시 버튼 노출)
  onDownloadSelected?: () => void;
  // 선택적: 결과보고서 다운로드 버튼 핸들러 (제공 시 버튼 노출)
  onDownloadReport?: () => void;
  // 선택적: 신청자 데이터 존재 여부 (기본값: true, false일 때 다운로드 불가 모달 표시)
  hasApplicants?: boolean;
  // 선택적: 선정자 데이터 존재 여부 (기본값: true, false일 때 다운로드 불가 모달 표시)
  hasSelected?: boolean;
  // 선택적: 결과보고서 데이터 존재 여부 (기본값: true, false일 때 다운로드 불가 모달 표시)
  hasReport?: boolean;
  // 선택적: 신청자 목록 다운로드 버튼 표시 여부 (기본값: true)
  showApplicantsButton?: boolean;
}

export default function ExcelDownloadBtn({
  onDownloadApplicants,
  onDownloadSelected,
  onDownloadReport,
  hasApplicants = true,
  hasSelected = true,
  hasReport = true,
  showApplicantsButton = true,
}: ExcelDownloadBtnProps) {
  const [isNoDataModalOpen, setIsNoDataModalOpen] = useState(false);

  // 신청자 목록 다운로드 핸들러
  const handleDownloadApplicants = () => {
    if (!hasApplicants) {
      setIsNoDataModalOpen(true);
      return;
    }
    console.log("신청자 목록 다운로드 버튼 클릭");
    onDownloadApplicants();
  };

  // 선정자 목록 다운로드 핸들러
  const handleDownloadSelected = () => {
    if (!hasSelected) {
      setIsNoDataModalOpen(true);
      return;
    }
    console.log("선정자 목록 다운로드 버튼 클릭");
    if (onDownloadSelected) {
      onDownloadSelected();
    }
  };

  // 결과보고서 다운로드 핸들러
  const handleDownloadReport = () => {
    if (!hasReport) {
      setIsNoDataModalOpen(true);
      return;
    }
    console.log("결과보고서 다운로드 버튼 클릭");
    if (onDownloadReport) {
      onDownloadReport();
    }
  };

  return (
    <>
      <div className={styles.download_btn_group}>
        {/* 신청자 목록 다운로드 버튼 (옵션) */}
        {showApplicantsButton && (
          <button
            className={styles.download_button}
            onClick={handleDownloadApplicants}
          >
            <img src="/images/excel_icon.png" alt="다운로드" />
            신청자 목록 다운로드
          </button>
        )}

        {/* 선정자 목록 다운로드 버튼 (옵션) */}
        {onDownloadSelected ? (
          <button
            className={styles.download_button}
            onClick={handleDownloadSelected}
          >
            <img src="/images/excel_icon.png" alt="다운로드" />
            선정자 목록 다운로드
          </button>
        ) : null}

        {/* 결과보고서 다운로드 버튼 (옵션) */}
        {onDownloadReport ? (
          <button
            className={styles.download_button}
            onClick={handleDownloadReport}
          >
            <img src="/images/excel_icon.png" alt="다운로드" />
            결과보고서 다운로드
          </button>
        ) : null}
      </div>

      {/* 데이터 없음 안내 모달 */}
      <BaseModal
        is_open={isNoDataModalOpen}
        on_close={() => setIsNoDataModalOpen(false)}
        message="다운로드할 데이터가 없습니다."
        buttons={["닫기"]}
        type="center"
      />
    </>
  );
}
