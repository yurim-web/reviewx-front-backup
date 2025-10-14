// 메인 홈 페이지 (Next.js App Router)
// 이 파일은 Next.js 13+ App Router의 메인 페이지입니다
// src/app/page.tsx 파일은 자동으로 "/" 경로(루트 경로)에 매핑됩니다

import type { Metadata } from "next";

// 컴포넌트들을 import
// @/는 src/를 가리키는 별칭입니다 (tsconfig.json에서 설정됨)
import MainMenu from "@/components/main/MainMenu";
import CampaignBox from "@/components/main/CampaignBox";
import styles from "../styles/home/home.module.css";
import Titletext from "@/components/main/Titletext";

// 임시 캠페인 데이터를 별도 파일에서 import
import { mockCampaigns_1 } from "@/data/main/mainFirstCampaigns";
import { mockCampaigns_2 } from "@/data/main/mainSecondCampaigns";

// 페이지 메타데이터 설정
export const metadata: Metadata = {
  title: "ReviewX - 홈",
  description: "ReviewX 메인 페이지 - 다양한 리뷰 캠페인을 만나보세요",
};

// React 함수형 컴포넌트 (기본 export)
// Next.js에서는 이 컴포넌트가 페이지가 됩니다
export default function Home() {
  return (
    // React Fragment (<>...</>) 사용
    // 불필요한 div 래퍼 없이 여러 요소를 그룹화할 수 있습니다
    <>
      {/* 메인 메뉴 컴포넌트 - 헤더(80px) 밑에 고정 */}
      <MainMenu />

      {/* 
        레이아웃 시프트 방지를 위한 placeholder 
        - 헤더(80px) + MainMenu(약 69px) = 149px
        - fixed된 헤더와 메뉴가 콘텐츠를 가리지 않도록 공간 확보
      */}
      <div style={{ height: "149px" }}></div>

      {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 메인 콘텐츠 영역 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
      <article className={styles.container}>
        {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 상단 배너 부분 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
        <section className={styles.main_banner_container}>
          <div className={styles.main_banner}>
            {/* public 폴더의 이미지 사용 */}
            {/* /images/main/main_banner.png는 public/images/main/main_banner.png를 가리킵니다 */}
            <img src="/images/main/main_banner.png" alt="main_banner" />
          </div>
        </section>

        {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 선정 확률 높은 캠페인 영역 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
        <section className={styles.campaign_container}>
          {/* 제목 컴포넌트 */}
          <Titletext main_title="선정 확률 높은 캠페인" />

          {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 캠페인 그리드 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
          <div className={styles.campaign_grid}>
            {/* JavaScript의 map 함수를 사용한 리스트 렌더링 */}
            {/* mockCampaigns 배열의 각 요소를 CampaignBox 컴포넌트로 변환 */}
            {mockCampaigns_1.map((campaign) => (
              // key prop은 React에서 리스트 렌더링 시 필수입니다
              // 각 요소를 고유하게 식별하기 위해 사용됩니다
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 지금 인기 많은 캠페인 영역 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}

        <section className={styles.campaign_container}>
          {/* 제목 컴포넌트 */}
          <Titletext main_title="지금 인기 많은 캠페인" />

          {/* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ == 캠페인 그리드 == ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */}
          <div className={styles.campaign_grid}>
            {/* JavaScript의 map 함수를 사용한 리스트 렌더링 */}
            {/* mockCampaigns 배열의 각 요소를 CampaignBox 컴포넌트로 변환 */}
            {mockCampaigns_2.map((campaign) => (
              // key prop은 React에서 리스트 렌더링 시 필수입니다
              // 각 요소를 고유하게 식별하기 위해 사용됩니다
              <CampaignBox key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
