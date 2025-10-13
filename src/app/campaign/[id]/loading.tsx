// 캠페인 상세 페이지 로딩 상태 (Next.js 특수 파일)
// 이 파일은 Next.js App Router의 특수 파일 중 하나입니다
// loading.tsx 파일이 있으면 해당 경로의 페이지가 로딩 중일 때 자동으로 표시됩니다
// 사용자가 /campaign/1에 접근하면, 페이지가 로딩되는 동안 이 컴포넌트가 보입니다

// React 함수형 컴포넌트 (기본 export)
// Next.js에서 자동으로 인식하여 로딩 상태로 사용합니다
export default function Loading() {
  return (
    // 로딩 스켈레톤 UI
    // 실제 콘텐츠가 로딩되는 동안 보여줄 스켈레톤 화면입니다
    <div className="campaign_detail_loading">
      <div className="loading_skeleton">
        {/* 상단 그라데이션 바 스켈레톤 */}
        <div className="gradient_bar_skeleton"></div>

        {/* 태그 섹션 스켈레톤 */}
        <div className="tags_skeleton">
          <div className="tag_skeleton"></div>
          <div className="tag_skeleton"></div>
          <div className="points_skeleton"></div>
        </div>

        {/* 제품 정보 스켈레톤 */}
        <div className="product_info_skeleton">
          <div className="title_skeleton"></div>
          <div className="description_skeleton"></div>
          <div className="image_skeleton"></div>

          {/* 캠페인 정보 스켈레톤 */}
          <div className="campaign_info_skeleton">
            <div className="info_item_skeleton"></div>
            <div className="info_item_skeleton"></div>
            <div className="info_item_skeleton"></div>
            <div className="info_item_skeleton"></div>
          </div>

          <div className="button_skeleton"></div>
        </div>

        {/* 리뷰 가이드라인 스켈레톤 */}
        <div className="review_guidelines_skeleton">
          <div className="section_title_skeleton"></div>
          <div className="content_skeleton"></div>
          <div className="content_skeleton"></div>
          <div className="content_skeleton"></div>
        </div>
      </div>
    </div>
  );
}
