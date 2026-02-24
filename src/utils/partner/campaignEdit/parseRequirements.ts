/* ========================================
   📋 캠페인 요구사항 파싱 유틸리티
   ======================================== */

/**
 * requirements 배열을 파싱하여 폼 데이터로 변환하는 함수
 *
 * 설명:
 * - requirements 배열의 코드를 파싱하여 각 필드에 매핑합니다.
 * - 예: "text_2500" → minTextLength: "2500"
 * - 예: "photo_25" → minImageCount: "25"
 * - 예: "video_2_300" → videoCount: "2", videoDuration: "300"
 * - 예: "product_link" → requireLinkAttachment: true
 * - 예: "keyword" → requireKeywordAttachment: true
 *
 * 사용 위치:
 * - /partner/campaign/edit/delivery/[id]
 * - /partner/campaign/edit/visit/[id]
 * - /partner/campaign/edit/review/[id]
 * - /partner/campaign/edit/reporter/[id]
 * - /partner/campaign/edit/mission/[id]
 */
export function parseRequirements(requirements: string[]): {
  minTextLength: string;
  minImageCount: string;
  videoCount: string;
  videoDuration: string;
  requireLinkAttachment: boolean;
  requireKeywordAttachment: boolean;
} {
  let minTextLength = "";
  let minImageCount = "";
  let videoCount = "";
  let videoDuration = "";
  let requireLinkAttachment = false;
  let requireKeywordAttachment = false;

  requirements.forEach((req) => {
    if (req.startsWith("text_")) {
      const charCount = req.replace("text_", "");
      minTextLength = charCount;
    } else if (req.startsWith("photo_")) {
      const photoCount = req.replace("photo_", "");
      minImageCount = photoCount;
    } else if (req.startsWith("video_")) {
      const parts = req.replace("video_", "").split("_");
      if (parts.length === 2) {
        videoCount = parts[0];
        videoDuration = parts[1];
      } else if (parts.length === 1) {
        videoCount = "1";
        videoDuration = parts[0];
      }
    } else if (req === "product_link") {
      requireLinkAttachment = true;
    } else if (req === "keyword") {
      requireKeywordAttachment = true;
    }
  });

  return {
    minTextLength,
    minImageCount,
    videoCount,
    videoDuration,
    requireLinkAttachment,
    requireKeywordAttachment,
  };
}
