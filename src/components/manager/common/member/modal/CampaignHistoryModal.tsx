/* ========================================
   📋 캠페인 진행 내역 모달 컴포넌트 (공통)
   ======================================== */

/**
 * 캠페인 진행 내역 모달 컴포넌트 (공통)
 *
 * 목적: 리뷰어/파트너 디테일 페이지에서 캠페인 진행 버튼을 클릭했을 때 나타나는 모달입니다.
 *
 * 📍 사용 위치:
 * - /manager_ga/member/reviewers/[id] (GA 관리자 리뷰어 디테일 페이지)
 * - /manager_sa/member/reviewers/[id] (SA 관리자 리뷰어 디테일 페이지)
 * - /manager_ga/member/partners/[id] (GA 관리자 파트너 디테일 페이지)
 * - /manager_sa/member/partners/[id] (SA 관리자 파트너 디테일 페이지)
 *
 * 주요 기능:
 * - 리뷰어/파트너의 캠페인 진행 내역을 테이블 형태로 표시합니다
 * - 캠페인 번호, 캠페인명, 상태, 유형, 채널, 지급 포인트 정보를 보여줍니다
 *
 */

"use client";

import Image from "next/image";
import CampaignStatusTag from "@/components/manager/common/tags/CampaignStatusTag";
import type { CampaignStatus } from "@/components/manager/common/tags/CampaignStatusTag";
import CampaignTypeTag from "@/components/manager/common/tags/CampaignTypeTag";
import type { CampaignType } from "@/components/manager/common/tags/CampaignTypeTag";
import tagStyles from "@/styles/common/tags.module.css";

// 캠페인 내역 아이템 타입 정의 (리뷰어와 파트너 모두에서 사용)
export interface CampaignHistoryItem {
  campaign_number: string; // 캠페인 번호
  campaign_name: string; // 캠페인명
  status: CampaignStatus; // 상태 (진행, 종료, 취소 등)
  type: string; // 유형 (예: '배송형', '구매평')
  channel: string; // 채널 (예: 'Blog', 'Clip', 'Instagram', 'Youtube', 'Store')
  points: number; // 지급 포인트
}

// 채널 타입 정의
export type Channel = "Blog" | "Clip" | "Instagram" | "Youtube" | "Store";

interface CampaignHistoryModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 캠페인 목록 데이터
  campaigns: CampaignHistoryItem[];
  // CSS 모듈 스타일 객체
  styles: Record<string, string> & {
    modal_overlay: string;
    modal_container: string;
    modal_content: string;
    modal_header: string;
    modal_title: string;
    close_button: string;
    close_icon: string;
    table_wrapper: string;
    table_header: string;
    table_body: string;
    table_row: string;
    table_cell: string;
    table_cell_campaign_name: string;
    channel_icon_wrapper: string;
    channel_icon: string;
    empty_state: string;
    empty_message: string;
  };
}

// 채널 아이콘 경로 매핑
const channel_icon_map: Record<Channel, string> = {
  Blog: "/images/brand_logo/naverblog.svg",
  Clip: "/images/brand_logo/naverclip.svg",
  Instagram: "/images/brand_logo/insta.svg",
  Youtube: "/images/brand_logo/youtube.svg",
  Store: "/images/brand_logo/navershop.svg",
};

export default function CampaignHistoryModal({
  is_open,
  on_close,
  campaigns,
  styles: cssStyles,
}: CampaignHistoryModalProps) {
  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  // 조건부 렌더링: is_open이 false이면 null을 반환
  if (!is_open) return null;

  // 숫자를 천 단위로 포맷팅하는 함수
  // 예: 19999 -> "19,999"
  const format_number = (num: number): string => {
    return num.toLocaleString("ko-KR");
  };

  // 오버레이 클릭 핸들러
  // 모달 배경을 클릭하면 모달이 닫히도록 합니다
  const handle_overlay_click = (e: React.MouseEvent) => {
    // 이벤트가 발생한 요소가 오버레이 자체일 때만 닫기
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  return (
    <div className={cssStyles.modal_overlay} onClick={handle_overlay_click}>
      <div
        className={cssStyles.modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더와 바디를 하나로 통합 */}
        <div className={cssStyles.modal_content}>
          {/* 모달 헤더 */}
          <div className={cssStyles.modal_header}>
            <h2 className={cssStyles.modal_title}>캠페인 진행 내역</h2>
            {/* 닫기 버튼 */}
            <button
              className={cssStyles.close_button}
              onClick={on_close}
              aria-label="닫기"
            >
              <img
                src="/images/icons/modal_x.svg"
                alt="닫기"
                className={cssStyles.close_icon}
              />
            </button>
          </div>

          {/* 테이블 */}
          <div className={cssStyles.table_wrapper}>
            {/* 테이블 헤더 */}
            <div className={cssStyles.table_header}>
              <div className={cssStyles.table_cell}>캠페인 번호</div>
              <div className={cssStyles.table_cell}>캠페인명</div>
              <div className={cssStyles.table_cell}>상태</div>
              <div className={cssStyles.table_cell}>유형</div>
              <div className={cssStyles.table_cell}>채널</div>
              <div className={cssStyles.table_cell}>지급 포인트</div>
            </div>

            {/* 테이블 바디: 항상 렌더링되며, 데이터가 없을 때는 빈 상태 메시지를 표시합니다 */}
            <div className={cssStyles.table_body}>
              {/* 조건부 렌더링: 데이터가 없을 때 빈 상태 메시지 표시 */}
              {campaigns.length === 0 ? (
                <div className={cssStyles.empty_state}>
                  <p className={cssStyles.empty_message}>
                    캠페인 진행 내역이 없습니다.
                  </p>
                </div>
              ) : (
                /* map 함수를 사용하여 campaigns 배열을 순회하며 테이블 행을 렌더링합니다 */
                /* map 함수: 배열의 각 요소를 순회하며 새로운 배열을 만듭니다 */
                /* key prop: React에서 리스트를 렌더링할 때 각 요소를 구분하기 위해 필요합니다 */
                campaigns.map((campaign, index) => (
                  <div key={index} className={cssStyles.table_row}>
                    {/* 캠페인 번호 */}
                    <div className={cssStyles.table_cell}>
                      {campaign.campaign_number}
                    </div>

                    {/* 캠페인명 */}
                    <div className={cssStyles.table_cell_campaign_name}>
                      {campaign.campaign_name}
                    </div>

                    {/* 상태 */}
                    <div className={cssStyles.table_cell}>
                      <CampaignStatusTag
                        status={campaign.status}
                        styles={tagStyles}
                      />
                    </div>

                    {/* 유형 */}
                    <div className={cssStyles.table_cell}>
                      <CampaignTypeTag
                        type={campaign.type as CampaignType}
                        styles={tagStyles}
                      />
                    </div>

                    {/* 채널 */}
                    <div className={cssStyles.table_cell}>
                      <div className={cssStyles.channel_icon_wrapper}>
                        <Image
                          src={
                            channel_icon_map[campaign.channel as Channel] ||
                            channel_icon_map.Blog
                          }
                          alt={campaign.channel}
                          width={20}
                          height={20}
                          className={cssStyles.channel_icon}
                        />
                      </div>
                    </div>

                    {/* 지급 포인트 */}
                    <div className={cssStyles.table_cell}>
                      {format_number(campaign.points)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
