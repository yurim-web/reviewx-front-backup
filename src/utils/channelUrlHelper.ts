/* ========================================
   🔗 채널 URL 생성 유틸리티
   ======================================== */

/**
 * 채널 타입과 채널 ID를 받아서 해당 채널의 URL을 생성하는 유틸리티 함수
 *
 * 📌 사용 목적:
 * - 신청자 카드에서 채널 아이디 클릭 시 해당 채널로 이동
 * - 채널별로 다른 URL 형식 처리
 *
 * 📌 지원 채널:
 * - 네이버블로그: https://blog.naver.com/{channelId}
 * - 네이버클립: {channelId} (이미 URL 형식일 수 있음)
 * - 인스타그램: https://www.instagram.com/{channelId}/
 * - 유튜브: https://www.youtube.com/@{channelId} 또는 https://www.youtube.com/channel/{channelId}
 */

/**
 * 채널 타입과 채널 ID로부터 해당 채널의 URL을 생성합니다.
 *
 * @param channel - 채널 타입 (예: "네이버블로그", "인스타그램", "유튜브", "네이버클립")
 * @param channelId - 채널 ID 또는 사용자명
 * @returns 해당 채널의 전체 URL
 *
 * @example
 * getChannelUrl("네이버블로그", "test123")
 * // => "https://blog.naver.com/test123"
 *
 * @example
 * getChannelUrl("인스타그램", "test_user")
 * // => "https://www.instagram.com/test_user/"
 *
 * @example
 * getChannelUrl("유튜브", "@testchannel")
 * // => "https://www.youtube.com/@testchannel"
 */
export function getChannelUrl(channel: string, channelId: string): string {
  if (!channelId || !channelId.trim()) {
    return "#";
  }

  // channelId에서 @ 기호 제거 (인스타그램, 유튜브)
  const cleanId = channelId.replace(/^@+/, "").trim();

  // 이미 URL 형식인 경우 그대로 반환 (네이버클립 등)
  if (cleanId.startsWith("http://") || cleanId.startsWith("https://")) {
    return cleanId;
  }

  // 채널별 URL 생성
  switch (channel) {
    case "네이버블로그":
      return `https://blog.naver.com/${cleanId}`;

    case "네이버클립":
      // 네이버클립은 이미 URL 형식이거나 클립 URL일 수 있음
      if (cleanId.startsWith("http://") || cleanId.startsWith("https://")) {
        return cleanId;
      }
      // 클립 ID만 있는 경우
      return cleanId;

    case "인스타그램":
      return `https://www.instagram.com/${cleanId}/`;

    case "유튜브":
      // @ 기호가 있으면 그대로 사용, 없으면 추가
      if (cleanId.startsWith("@")) {
        return `https://www.youtube.com/${cleanId}`;
      }
      // channel ID 형식인지 확인 (UC로 시작하는 경우)
      if (cleanId.startsWith("UC") && cleanId.length > 20) {
        return `https://www.youtube.com/channel/${cleanId}`;
      }
      // 일반 핸들인 경우
      return `https://www.youtube.com/@${cleanId}`;

    case "릴스":
    case "Reels":
      // 릴스는 인스타그램 릴스이므로 인스타그램 URL 사용
      return `https://www.instagram.com/${cleanId}/`;

    case "쇼츠":
    case "숏츠":
    case "Shorts":
      // 쇼츠는 유튜브 쇼츠이므로 유튜브 URL 사용
      if (cleanId.startsWith("@")) {
        return `https://www.youtube.com/${cleanId}`;
      }
      if (cleanId.startsWith("UC") && cleanId.length > 20) {
        return `https://www.youtube.com/channel/${cleanId}`;
      }
      return `https://www.youtube.com/@${cleanId}`;

    default:
      // 알 수 없는 채널 타입인 경우 # 반환
      return "#";
  }
}

