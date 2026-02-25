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
 * - 캠페인 번호 기준 내림차순 정렬 (큰 번호가 먼저 표시됩니다)
 *
 */

"use client";

import Image from "next/image";
import CampaignStatusTag from "@/components/manager/common/tags/CampaignStatusTag";
import type { CampaignStatus } from "@/components/manager/common/tags/CampaignStatusTag";
import CampaignTypeTag from "@/components/manager/common/tags/CampaignTypeTag";
import type { CampaignType } from "@/components/manager/common/tags/CampaignTypeTag";

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
export type Channel =
  | "Blog"
  | "Clip"
  | "Instagram"
  | "Youtube"
  | "Store"
  | "Mission"
  | "Reels"
  | "Shorts";

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
  Mission: "/images/brand_logo/misssion.svg",
  Reels: "/images/brand_logo/reels.svg",
  Shorts: "/images/brand_logo/shots.svg",
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
  // num이 undefined나 null인 경우 0으로 처리합니다
  const format_number = (num: number | undefined | null): string => {
    // num이 undefined, null, 또는 숫자가 아닌 경우 0으로 처리
    const safe_num = num ?? 0;
    return safe_num.toLocaleString("ko-KR");
  };

  // 오버레이 클릭 핸들러
  // 모달 배경을 클릭하면 모달이 닫히도록 합니다
  const handle_overlay_click = (e: React.MouseEvent) => {
    // 이벤트가 발생한 요소가 오버레이 자체일 때만 닫기
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  // 캠페인 번호 기준 내림차순 정렬된 캠페인 목록
  // sort 함수: 배열의 요소를 정렬합니다
  // localeCompare: 문자열을 비교하여 정렬 순서를 결정합니다
  // 내림차순 정렬: b를 먼저 비교하여 큰 번호가 앞에 오도록 합니다
  // campaign_number는 문자열이므로 문자열 비교로 정렬됩니다
  const sorted_campaigns = [...campaigns].sort((a, b) => {
    // campaign_number가 없는 경우를 처리
    // undefined나 null인 경우 빈 문자열로 처리하여 맨 뒤로 보냅니다
    const a_number = a.campaign_number || "";
    const b_number = b.campaign_number || "";

    // 둘 다 빈 문자열이면 순서 유지
    if (!a_number && !b_number) return 0;
    // a만 빈 문자열이면 b를 앞으로
    if (!a_number) return 1;
    // b만 빈 문자열이면 a를 앞으로
    if (!b_number) return -1;

    // 내림차순: b가 a보다 크면 음수 반환 (b가 앞으로)
    return b_number.localeCompare(a_number);
  });

  return (
    <div className={cssStyles.modal_overlay} onClick={handle_overlay_click}>
      <div className={cssStyles.modal_container} onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더와 바디를 하나로 통합 */}
        <div className={cssStyles.modal_content}>
          {/* 모달 헤더 */}
          <div className={cssStyles.modal_header}>
            <h2 className={cssStyles.modal_title}>캠페인 진행 내역</h2>
            {/* 닫기 버튼 */}
            <button className={cssStyles.close_button} onClick={on_close} aria-label="닫기">
              <img src="/images/icons/modal_x.svg" alt="닫기" className={cssStyles.close_icon} />
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
              {sorted_campaigns.length === 0 ? (
                <div className={cssStyles.empty_state}>
                  <p className={cssStyles.empty_message}>캠페인 진행 내역이 없습니다.</p>
                </div>
              ) : (
                /* map 함수를 사용하여 campaigns 배열을 순회하며 테이블 행을 렌더링합니다 */
                /* map 함수: 배열의 각 요소를 순회하며 새로운 배열을 만듭니다 */
                /* key prop: React에서 리스트를 렌더링할 때 각 요소를 구분하기 위해 필요합니다 */
                /* 정렬된 배열(sorted_campaigns)을 사용하여 큰 캠페인 번호가 먼저 표시됩니다 */
                sorted_campaigns.map((campaign, index) => (
                  <div key={index} className={cssStyles.table_row}>
                    {/* 캠페인 번호 */}
                    <div className={cssStyles.table_cell}>{campaign.campaign_number}</div>

                    {/* 캠페인명 */}
                    <div className={cssStyles.table_cell_campaign_name}>
                      {campaign.campaign_name}
                    </div>

                    {/* 상태 */}
                    <div className={cssStyles.table_cell}>
                      <CampaignStatusTag status={campaign.status} />
                    </div>

                    {/* 유형 */}
                    <div className={cssStyles.table_cell}>
                      <CampaignTypeTag type={campaign.type as CampaignType} />
                    </div>

                    {/* 채널 */}
                    <div className={cssStyles.table_cell}>
                      <div className={cssStyles.channel_icon_wrapper}>
                        <Image
                          src={
                            channel_icon_map[campaign.channel as Channel] || channel_icon_map.Blog
                          }
                          alt={campaign.channel || "채널"}
                          width={20}
                          height={20}
                          className={cssStyles.channel_icon}
                        />
                      </div>
                    </div>

                    {/* 지급 포인트 */}
                    <div className={cssStyles.table_cell}>{format_number(campaign.points)}</div>
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
