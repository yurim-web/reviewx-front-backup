// 메인 -> 캠페인 박스 컴포넌트
// 이 컴포넌트는 메인페이지에서 각 캠페인을 카드 형태로 보여주는 역할을 합니다

// Next.js의 Link 컴포넌트를 import
// Link는 페이지 간 이동을 위한 Next.js의 내장 컴포넌트입니다
// 일반 <a> 태그와 달리 클라이언트 사이드 라우팅을 지원합니다
import Link from "next/link";

// CSS 모듈을 import
// Next.js에서는 CSS 모듈을 사용하여 스타일을 컴포넌트별로 격리할 수 있습니다
// 파일명.module.css 형태로 작성하면 됩니다
import styles from "../../styles/user/campaign/campaign_box.module.css";

// TypeScript 인터페이스 정의
// 컴포넌트가 받을 props의 타입을 정의합니다
// 이렇게 하면 타입 안정성을 보장할 수 있습니다
interface CampaignBoxProps {
  campaign: {
    id: string; // 캠페인 고유 ID (라우팅에 사용됨)
    title: string; // 캠페인 제목
    category: string; // 캠페인 카테고리 (기자단, 구매평 등)
    categoryIcon?: string; // 카테고리 아이콘 이미지 경로 (선택적)
    image: string; // 제품 이미지 경로
    dayCount?: string; // D-숫자 (선택적, 기본값: 6)
    recruitment: {
      current: number; // 현재 신청자 수
      total: number; // 총 모집 인원
    };
    schedule?: string; // 스케줄 정보 (선택적)
  };
  basePath?: string; // 링크 기본 경로 (기본값: /user/delivery)
}

// React 함수형 컴포넌트

// props로 campaign 데이터를 받아서 UI를 렌더링합니다
export default function CampaignBox({
  campaign,
  basePath = "/user/delivery",
}: CampaignBoxProps) {
  // 캠페인 타입에 따른 올바른 경로 결정
  const getCampaignPath = (campaign: any) => {
    switch (campaign.category) {
      case "배송형":
        return `/user/delivery/${campaign.id}`;
      case "방문형":
        return `/user/visit/${campaign.id}`;
      case "구매평":
        return `/user/review/${campaign.id}`;
      case "미션형":
        return `/user/mission/${campaign.id}`;
      case "기자단":
        return `/user/reporter/${campaign.id}`;
      default:
        return `${basePath}/${campaign.id}`;
    }
  };

  return (
    // Next.js Link 컴포넌트 사용
    // href에 동적 경로를 설정: 캠페인 타입에 따라 올바른 경로로 이동
    <Link href={getCampaignPath(campaign)} className={styles.campaign_link}>
      <div className={styles.campaign_box}>
        {/* 상단 라벨 - D-숫자 동적 표시 (dayCount가 있을 때만) */}
        {campaign.dayCount && (
          <div className={styles.campaign_label}>{campaign.dayCount}</div>
        )}

        {/* 제품 이미지 영역 */}
        <div className={styles.product_image_container}>
          <img
            src={campaign.image}
            alt={campaign.title}
            className={styles.product_image}
          />

          {/* 조건부 렌더링: campaign.schedule이 있을 때만 표시 (이미지 위에만) */}
          {campaign.schedule && (
            <div className={styles.schedule_overlay}>
              <span className={styles.schedule_overlay_text}>
                {campaign.schedule}
              </span>
            </div>
          )}
        </div>

        {/* 제품 정보 영역 */}
        <div className={styles.product_info}>
          <div className={styles.category}>
            {campaign.categoryIcon && (
              <img
                src={campaign.categoryIcon}
                alt="카테고리 아이콘"
                className={styles.category_icon}
              />
            )}
            <span>{campaign.category}</span>
          </div>
          <h3 className={styles.product_title}>{campaign.title}</h3>
          <div className={styles.recruitment_status}>
            <span className={styles.recruitment_total}>
              신청 {campaign.recruitment.current}명
            </span>
            <span className={styles.recruitment_separator}>|</span>
            <span className={styles.recruitment_current}>
              모집 {campaign.recruitment.total}명
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
