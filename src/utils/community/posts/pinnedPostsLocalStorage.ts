/* ========================================
   📌 게시글 고정 상태 localStorage 유틸
   ======================================== */

/**
 * 게시글 고정 상태 localStorage 유틸
 *
 * 목적: 관리자 게시글 목록, FAQ, 공지사항 등에서
 *       공통으로 사용하는 게시글 고정(is_pinned) 상태를
 *       브라우저 localStorage에 저장/적용하기 위한 유틸입니다.
 *
 * 사용 위치 예시:
 * - 관리자 게시글 목록 페이지 (PostsPageCommon)
 * - 유저/파트너 FAQ 페이지 (FAQPageClient)
 * - 유저/파트너 공지사항 페이지 (NoticePageClient)
 *
 * 저장 방식:
 * - key: "community_posts_pinned_state"
 * - value: { [postId: string]: boolean } 형태의 JSON 문자열
 */

import type { PostItem } from "@/data/manager_ga/community/postsData";

// localStorage에 저장할 때 사용할 키 이름
const PINNED_POSTS_STORAGE_KEY = "community_posts_pinned_state";

// 게시글 ID를 key로, 고정 여부를 value로 가지는 타입
export type PinnedPostsState = Record<string, boolean>;

/**
 * SSR/빌드 환경 여부를 안전하게 체크하는 헬퍼
 * - Next.js 환경에서 window 객체가 없는 서버 사이드 렌더링 시
 *   localStorage에 접근하면 에러가 발생하므로 사전 체크가 필요합니다.
 */
function is_browser_environment(): boolean {
  return typeof window !== "undefined";
}

/**
 * localStorage에 저장된 게시글 고정 상태를 불러옵니다.
 *
 * 반환 형식:
 * - 정상: { [postId]: true } 형태의 객체
 * - 에러/미존재: 빈 객체({})
 */
export function load_pinned_posts_state(): PinnedPostsState {
  if (!is_browser_environment()) {
    // 서버 환경에서는 localStorage에 접근할 수 없으므로 빈 객체 반환
    return {};
  }

  try {
    const raw_value = window.localStorage.getItem(PINNED_POSTS_STORAGE_KEY);
    if (!raw_value) return {};

    const parsed = JSON.parse(raw_value);

    // 객체 형태인지 한 번 더 검증 (타입 안전성 확보)
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return parsed as PinnedPostsState;
  } catch {
    // JSON 파싱 에러 등 예외 상황에서는 안전하게 빈 객체 반환
    return {};
  }
}

/**
 * 게시글 고정 상태를 localStorage에 저장합니다.
 *
 * 저장 형식:
 * - { [postId]: true } 형태의 객체를 JSON 문자열로 변환하여 저장
 */
export function save_pinned_posts_state(state: PinnedPostsState): void {
  if (!is_browser_environment()) return;

  try {
    const serialized = JSON.stringify(state);
    window.localStorage.setItem(PINNED_POSTS_STORAGE_KEY, serialized);
  } catch {
    // localStorage 용량 초과, JSON 직렬화 에러 등은 조용히 무시
  }
}

/**
 * 게시글 목록에서 현재 고정 상태만 추출하여
 * localStorage에 저장할 수 있는 형태의 객체로 변환합니다.
 *
 * - is_pinned가 true인 게시글들만 저장하여
 *   localStorage 용량을 최소화합니다.
 */
export function extract_pinned_state_from_posts(
  posts: PostItem[]
): PinnedPostsState {
  return posts.reduce<PinnedPostsState>((accumulator, post) => {
    if (post.is_pinned) {
      accumulator[post.id] = true;
    }
    return accumulator;
  }, {});
}

/**
 * 게시글 목록에 localStorage에 저장된 고정 상태를 적용합니다.
 *
 * 적용 규칙:
 * - localStorage에 해당 ID가 존재하면 is_pinned를 그 값으로 덮어씁니다.
 * - 존재하지 않으면 기존 is_pinned 값을 유지합니다.
 *
 * 이렇게 하면:
 * - 초기 목업 데이터의 기본 고정 상태를 유지하면서
 * - 사용자가 변경한 고정 상태만 덮어쓸 수 있습니다.
 */
export function apply_pinned_state_to_posts(
  posts: PostItem[],
  pinned_state: PinnedPostsState
): PostItem[] {
  return posts.map((post) => {
    // localStorage에 값이 없으면 기존 is_pinned 유지
    if (pinned_state[post.id] === undefined) {
      return post;
    }

    // 존재하는 경우 localStorage 값을 우선 적용
    return {
      ...post,
      is_pinned: pinned_state[post.id],
    };
  });
}


