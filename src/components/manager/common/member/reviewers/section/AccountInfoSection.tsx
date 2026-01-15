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

/* ========================================
   🧩 주민등록번호 마스킹 유틸
   ======================================== */

/**
 * 주민등록번호를 "앞 6자리 - 뒤 1자리 •••••••" 형태로 변환합니다.
 * - 예: "821201-2123456" -> "821201 - 2 •••••••"
 */
const format_resident_number = (resident_number: string) => {
  const bullet = "•";
  const masked_tail = bullet.repeat(7);

  if (resident_number.includes("-")) {
    const [front, back] = resident_number.split("-");
    const first_digit = back?.[0] ?? "";
    return `${front} - ${first_digit} ${masked_tail}`;
  }

  // 구분자가 없으면 뒤 7자리를 마스킹 처리
  if (resident_number.length > 7) {
    const visible = resident_number.slice(0, -7);
    return `${visible}${masked_tail}`;
  }

  return resident_number;
};

export default function AccountInfoSection({
  account_info,
}: AccountInfoSectionProps) {
  // 주민등록번호 마스킹 처리
  const masked_resident_number = format_resident_number(
    account_info.resident_number
  );

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
        <InfoCard label="주민등록번호" value={masked_resident_number} />
      </div>
    </Section>
  );
}
