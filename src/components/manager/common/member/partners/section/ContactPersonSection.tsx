/* ========================================
   📌 담당자 정보 섹션 컴포넌트 (공통)
   ======================================== */

/**
 * 담당자 정보 섹션 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 파트너 상세 페이지에서 담당자 정보를 표시하는 섹션입니다.
 *
 * 사용 위치:
 * - /manager_ga/member/partners/[id] (GA 관리자 파트너 상세 페이지)
 * - /manager_sa/member/partners/[id] (SA 관리자 파트너 상세 페이지)
 *
 * 주요 기능:
 * - 문의 담당자 휴대폰 번호 표시
 */

"use client";

import InfoCard from "@/components/manager/common/member/member_detail/InfoCard";
import Section from "@/components/manager/common/member/member_detail/Section";
import styles from "@/styles/manager/common/member/member_detail/partners/contact_person_section.module.css";

interface ContactPersonSectionProps {
  // 담당자 이름
  contact_name: string;
  // 문의 담당자 휴대폰 번호
  contact_phone: string;
}

export default function ContactPersonSection({
  contact_name,
  contact_phone,
}: ContactPersonSectionProps) {
  return (
    <Section title="담당자 정보">
      <div className={styles.contact_person_grid}>
        {/* 담당자 이름 정보 카드 */}
        {/* null 병합 연산자(||): contact_name이 없거나 빈 문자열일 경우 "-"를 표시합니다 */}
        <InfoCard label="담당자 이름" value={contact_name || "-"} />
        {/* 문의 담당자 휴대폰 번호 정보 카드 */}
        {/* null 병합 연산자(||): contact_phone이 없거나 빈 문자열일 경우 "-"를 표시합니다 */}
        <InfoCard
          label="문의 담당자 휴대폰 번호"
          value={contact_phone || "-"}
        />
      </div>
    </Section>
  );
}
