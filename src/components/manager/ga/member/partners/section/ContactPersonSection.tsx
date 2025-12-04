/**
 * 담당자 정보 섹션 컴포넌트
 *
 * 파트너 상세 페이지에서 담당자 정보를 표시하는 섹션입니다.
 *
 * 사용 위치:
 * - /manager_ga/member/partners/[id] (파트너 상세 페이지)
 */

"use client";

import InfoCard from "@/components/manager/ga/member/member_detail/InfoCard";
import Section from "@/components/manager/ga/member/member_detail/Section";
import styles from "@/styles/manager_ga/member/member_detail/partners/contact_person_section.module.css";

interface ContactPersonSectionProps {
  /** 문의 담당자 휴대폰 번호 */
  contact_phone: string;
}

export default function ContactPersonSection({
  contact_phone,
}: ContactPersonSectionProps) {
  return (
    <Section title="담당자 정보">
      <div className={styles.contact_person_grid}>
        <InfoCard
          label="문의 담당자 휴대폰 번호"
          value={contact_phone || "-"}
        />
      </div>
    </Section>
  );
}
