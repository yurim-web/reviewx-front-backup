import { partnerApiClient } from "@/lib/api/partnerClient";
import type {
  NoticeListResponse,
  NoticeListParams,
  NoticeDetailResponse,
} from "@/types/api/partnerNotice";

/**
 * 파트너 공지사항 목록 조회
 * GET /partner/boards/notices
 */
export async function getPartnerNoticeList(params?: NoticeListParams): Promise<NoticeListResponse> {
  const { data } = await partnerApiClient.get<NoticeListResponse>("/partner/boards/notices", {
    params,
  });
  return data;
}

/**
 * 파트너 공지사항 상세 조회
 * GET /partner/boards/notices/{boardId}
 */
export async function getPartnerNoticeDetail(boardId: number): Promise<NoticeDetailResponse> {
  const { data } = await partnerApiClient.get<NoticeDetailResponse>(
    `/partner/boards/notices/${boardId}`
  );
  return data;
}
