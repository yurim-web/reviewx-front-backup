/* ========================================
   🏢 사업자 정보 섹션 컴포넌트
   ======================================== */

/**
 * 사업자 정보 섹션 컴포넌트
 *
 * 목적: 파트너 디테일 페이지에서 사업자 정보를 표시하는 섹션입니다.
 *
 * 사용 위치:
 * - /manager_ga/member/partners/[id] (파트너 디테일 페이지)
 *
 * 주요 기능:
 * - 상호명 정보
 * - 대표자명 정보
 * - 사업자등록번호 정보
 * - 사업자등록증 다운로드 버튼
 *
 */

'use client';

import Image from 'next/image';
import InfoCard from '@/components/manager_ga/member/member_detail/InfoCard';
import Section from '@/components/manager_ga/member/member_detail/Section';
import styles from '@/styles/manager_ga/member/member_detail/partners/business_info_section.module.css';

interface BusinessInfoSectionProps {
  // 상호명
  business_name: string;
  // 대표자명
  representative_name: string;
  // 사업자등록번호
  business_number: string;
  // 사업자등록증 다운로드 핸들러
  on_download: () => void;
}

export default function BusinessInfoSection({
  business_name,
  representative_name,
  business_number,
  on_download,
}: BusinessInfoSectionProps) {
  return (
    <Section title="사업자 정보">
      <div className={styles.business_grid}>
        {/* 상호명 정보 카드 */}
        <InfoCard label="상호명" value={business_name} />

        {/* 대표자명 정보 카드 */}
        <InfoCard label="대표자명" value={representative_name} />

        {/* 사업자등록번호 정보 카드 */}
        <InfoCard label="사업자등록번호" value={business_number} />

        {/* 사업자등록증 다운로드 카드 */}
        <div className={styles.info_card}>
          <div className={styles.info_label}>사업자등록증</div>
          <button
            onClick={on_download}
            className={styles.download_button}
            aria-label="사업자등록증 다운로드"
          >
            <span>다운로드</span>
            <Image
              src="/images/icons/table_download.svg"
              alt="다운로드"
              width={14}
              height={14}
              className={styles.download_icon}
            />
          </button>
        </div>
      </div>
    </Section>
  );
}
