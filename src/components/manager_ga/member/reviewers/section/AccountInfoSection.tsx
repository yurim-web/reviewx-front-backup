/* ========================================
   💳 계좌 정보 섹션 컴포넌트
   ======================================== */

/**
 * 계좌 정보 섹션 컴포넌트
 *
 * 목적: 리뷰어 디테일 페이지에서 계좌 정보를 표시하는 섹션입니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers/[id] (리뷰어 디테일 페이지)
 *
 * 주요 기능:
 * - 예금주 정보
 * - 은행 정보
 * - 계좌번호 정보
 * - 주민등록번호 정보
 *
 */

'use client';

import InfoCard from '@/components/manager_ga/member/member_detail/InfoCard';
import Section from '@/components/manager_ga/member/member_detail/Section';
import type { AccountInfo } from '@/data/manager_ga/member/reviewers';
import styles from '@/styles/manager_ga/member/member_detail/reviewers/account_info_section.module.css';

interface AccountInfoSectionProps {
  // 계좌 정보
  account_info: AccountInfo;
}

export default function AccountInfoSection({
  account_info,
}: AccountInfoSectionProps) {
  return (
    <Section title="계좌 정보">
      <div className={styles.account_grid}>
        {/* 예금주 정보 카드 */}
        <InfoCard label="예금주" value={account_info.account_holder} />

        {/* 은행 정보 카드 */}
        <InfoCard label="은행" value={account_info.bank} />

        {/* 계좌번호 정보 카드 */}
        <InfoCard label="계좌번호" value={account_info.account_number} />

        {/* 주민등록번호 정보 카드 */}
        <InfoCard label="주민등록번호" value={account_info.resident_number} />
      </div>
    </Section>
  );
}
