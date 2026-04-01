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
  const { data } = await partnerApiClient.get<{
    result: "OK";
    generatedAt: string;
    data: Omit<PartnerNotificationsResponse, "result" | "generatedAt">;
  }>("/partner/notifications", { params });
  return { result: data.result, generatedAt: data.generatedAt, ...data.data };
}

/**
 * 파트너 알림 전체 삭제
 * DELETE /partner/notifications
 */
export async function deleteAllPartnerNotifications(): Promise<PartnerNotificationsDeleteResponse> {
  const { data } = await partnerApiClient.delete<{
    result: "OK";
    generatedAt: string;
    data: Omit<PartnerNotificationsDeleteResponse, "result" | "generatedAt">;
  }>("/partner/notifications");
  return { result: data.result, generatedAt: data.generatedAt, ...data.data };
}
