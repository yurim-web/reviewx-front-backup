/* ========================================
   📌 계좌 정보 섹션 컴포넌트 (공통)
   ======================================== */

/**
 * 계좌 정보 섹션 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 리뷰어 상세 페이지에서 계좌 정보를 표시하는 섹션입니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers/[id] (GA 관리자 리뷰어 상세 페이지)
 * - /manager_sa/member/reviewers/[id] (SA 관리자 리뷰어 상세 페이지)
 *
 * 주요 기능:
 * - 예금주 정보
 * - 은행 정보
 * - 계좌번호 정보
 * - 주민등록번호 정보
 */

"use client";

import InfoCard from "@/components/manager/common/member/member_detail/InfoCard";
import Section from "@/components/manager/common/member/member_detail/Section";
import type { AccountInfo } from "@/data/manager_ga/member/reviewers";
import styles from "@/styles/manager/common/member/member_detail/reviewers/account_info_section.module.css";

interface AccountInfoSectionProps {
  // 계좌 정보 객체
  account_info: AccountInfo;
}

export default function AccountInfoSection({
  account_info,
}: AccountInfoSectionProps) {
  return (
    <Section title="계좌 정보">
      <div className={styles.account_grid}>
        {/* 예금주 정보 카드 */}
        {/* InfoCard 컴포넌트에 label과 value를 props로 전달합니다 */}
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
