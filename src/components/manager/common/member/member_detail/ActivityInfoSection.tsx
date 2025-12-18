/* ========================================
   📊 활동 정보 섹션 컴포넌트
   ======================================== */

/**
 * 활동 정보 섹션 컴포넌트
 *
 * 목적: 리뷰어와 파트너 디테일 페이지에서 공통으로 사용되는 활동 정보 섹션입니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers/[id] (GA 관리자 리뷰어 디테일 페이지)
 * - /manager_sa/member/reviewers/[id] (SA 관리자 리뷰어 디테일 페이지)
 * - /manager_ga/member/partners/[id] (GA 관리자 파트너 디테일 페이지)
 * - /manager_sa/member/partners/[id] (SA 관리자 파트너 디테일 페이지)
 *
 * 주요 기능:
 * - 캠페인 진행/완료 정보
 * - 패널티 정보
 * - 접속일, 가입일
 * - 포인트 정보
 * - 추가 정보 카드 (채널 정보 등)
 *
 */

"use client";

import InfoCard from "./InfoCard";
import Section from "./Section";
import styles from "@/styles/manager_ga/member/member_detail/section.module.css";

// 활동 정보 아이템 타입 정의
export interface ActivityInfoItem {
  // 라벨
  label: string;
  // 값 (문자열 또는 커스텀 JSX)
  value: React.ReactNode;
  // 버튼 클릭 핸들러 (선택적)
  on_button_click?: () => void;
  // 버튼 aria-label (선택적)
  button_aria_label?: string;
  // 추가 요소 (배지 등, 선택적)
  additional_content?: React.ReactNode;
}

interface ActivityInfoSectionProps {
  // 활동 정보 아이템 배열
  items: ActivityInfoItem[];
  // 레이아웃 타입 (기본값: "default" - 4열 그리드, "partner" - 위 3개/아래 4개)
  layout_type?: "default" | "partner";
}

export default function ActivityInfoSection({
  items,
  layout_type = "default",
}: ActivityInfoSectionProps) {
  // 파트너 레이아웃인 경우 아이템을 두 그룹으로 나눔
  if (layout_type === "partner") {
    const top_items = items.slice(0, 3); // 위쪽 3개: 캠페인 진행, 캠페인 완료, 패널티
    const bottom_items = items.slice(3); // 아래쪽 4개: 접속일, 가입일, 보유 포인트, 결제 포인트

    return (
      <Section title="활동 정보">
        {/* 위쪽 행: 3개 카드 */}
        <div className={styles.member_detail_info_grid_partner_top}>
          {top_items.map((item, index) => (
            <InfoCard
              key={index}
              label={item.label}
              value={item.value}
              on_button_click={item.on_button_click}
              button_aria_label={item.button_aria_label}
              additional_content={item.additional_content}
            />
          ))}
        </div>
        {/* 아래쪽 행: 4개 카드 */}
        <div className={styles.member_detail_info_grid_partner_bottom}>
          {bottom_items.map((item, index) => (
            <InfoCard
              key={index + 3}
              label={item.label}
              value={item.value}
              on_button_click={item.on_button_click}
              button_aria_label={item.button_aria_label}
              additional_content={item.additional_content}
            />
          ))}
        </div>
      </Section>
    );
  }

  // 기본 레이아웃: 4열 그리드
  return (
    <Section title="활동 정보">
      <div className={styles.member_detail_info_grid}>
        {items.map((item, index) => (
          <InfoCard
            key={index}
            label={item.label}
            value={item.value}
            on_button_click={item.on_button_click}
            button_aria_label={item.button_aria_label}
            additional_content={item.additional_content}
          />
        ))}
      </div>
    </Section>
  );
}
