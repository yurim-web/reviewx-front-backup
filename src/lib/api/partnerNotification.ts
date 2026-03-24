import { partnerApiClient } from "@/lib/api/partnerClient";
import type {
  PartnerNotificationsResponse,
  PartnerNotificationsParams,
  PartnerNotificationsDeleteResponse,
} from "@/types/api/partnerNotification";

/**
 * 파트너 알림 목록 조회 (커서 기반 무한 스크롤)
 * GET /partner/notifications
 */
export async function getPartnerNotifications(
  params?: PartnerNotificationsParams
): Promise<PartnerNotificationsResponse> {
  const { data } = await partnerApiClient.get<PartnerNotificationsResponse>(
    "/partner/notifications",
    { params }
  );
  return data;
}

/**
 * 파트너 알림 전체 삭제
 * DELETE /partner/notifications
 */
export async function deleteAllPartnerNotifications(): Promise<PartnerNotificationsDeleteResponse> {
  const { data } =
    await partnerApiClient.delete<PartnerNotificationsDeleteResponse>("/partner/notifications");
  return data;
}
