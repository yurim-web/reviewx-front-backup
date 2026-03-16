/* ========================================
   GA 관리자 게시글 데이터
   ======================================== */

/**
 * GA 관리자 게시글 목록 목업 데이터
 *
 * 목적: GA 관리자 게시글 목록 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/community/posts (게시글 목록 페이지)
 *
 */

// 공통 필터 옵션에서 import
import type { PostDivision } from "@/data/manager_ga/common/filterOptions";
import { deleteAdminCommunityPost } from "@/lib/api/admin";

// 타입 재export (기존 코드와의 호환성을 위해)
export type { PostDivision };

// 게시글 카테고리 타입 정의
// 카테고리 관리 페이지(/manager_sa/community/categories)에서 등록한 카테고리를 사용하므로
// 동적으로 변경될 수 있는 값이므로 string 타입으로 정의합니다.
// 실제 카테고리 목록은 categories_data에서 관리됩니다.
export type PostCategory = string;

// 대상(유저 타입) 정의: 게시글 목록 전용. 기존 UserType + "전체" 확장.
export type PostTarget = "리뷰어" | "파트너" | "관리자" | "전체";

// 게시글 아이템 타입 정의
export interface PostItem {
  id: string; // 게시글 ID
  number: string; // 번호 (예: 000001)
  division: PostDivision; // 구분 (공지사항/자주 묻는 질문/이벤트)
  category: PostCategory; // 카테고리
  target: PostTarget; // 대상 (리뷰어/파트너/관리자/전체)
  title: string; // 제목
  view_count: number; // 조회수
  registered_date: string; // 등록일 (예: 2025-08-01 18:56)
  registered_by: string; // 등록자 (예: 관리자 A, 관리자 B, 관리자 C, admin 등)
  is_pinned: boolean; // 고정 여부
}

// 게시글 상세 정보 타입 정의 (PostItem을 확장)
export interface PostDetail extends PostItem {
  content: string; // 게시글 본문 내용 (HTML 형식)
  updated_date?: string; // 수정일 (예: 2025-09-12)
}

// localStorage 키
// 게시글 데이터를 localStorage에 저장할 때 사용하는 키입니다
const STORAGE_KEY_POSTS = "posts_data";
const STORAGE_KEY_POST_DETAILS = "post_details_data";

// 기본 게시글 목록 데이터 (초기값)
const default_posts_data: PostItem[] = [
  {
    id: "1",
    number: "0000123",
    division: "공지사항",
    category: "전체",
    target: "파트너",
    title: "[건강기능식품] 체험단 등록 유의 사항",
    view_count: 115000,
    registered_date: "2026-03-01 10:15",
    registered_by: "관리자 A",
    is_pinned: false,
  },
  {
    id: "2",
    number: "000001",
    division: "공지사항",
    category: "중요",
    target: "파트너",
    title: "[의료기기] 체험단 진행 불가 공지",
    view_count: 0,
    registered_date: "2026-03-02 14:20",
    registered_by: "관리자 A",
    is_pinned: true,
  },
  {
    id: "3",
    number: "0000222",
    division: "공지사항",
    category: "공지사항",
    target: "파트너",
    title: "내 브랜드에 참여한 인플루언서의 중복 당첨 이력을 확인 할 수 있습니다.",
    view_count: 0,
    registered_date: "2026-03-03 09:30",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "4",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "파트너",
    title: `스타일씨 무제한 체험단 (추천할인코드) 를 사용해서 '할인'을 받아보세요`,
    view_count: 1100000,
    registered_date: "2026-03-04 16:45",
    registered_by: "관리자 A",
    is_pinned: false,
  },
  {
    id: "5",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "파트너",
    title: "구매평 체험단 메뉴 가 신설되었습니니다.",
    view_count: 12000,
    registered_date: "2026-03-05 11:20",
    registered_by: "관리자 C",
    is_pinned: true,
  },
  {
    id: "6",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "리뷰어",
    title:
      "[ 구매평 제한 사이트 안내 ] 카카오선물하기 / 톡딜(톡스토어) / 화해 의 구매평 체험단이 제한됩니다.텥테ㅔ테텥스스스트ㅡㅌ테스트트텥테ㅔ테텥스스스트ㅡㅌ테스트트텥테ㅔ테텥스스스트ㅡㅌ테스트트텥테ㅔ테텥스스스트ㅡㅌ테스트트",
    view_count: 999999999,
    registered_date: "2026-03-06 13:40",
    registered_by: "관리자 C",
    is_pinned: true,
  },
  {
    id: "7",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "리뷰어",
    title:
      "정산 내역을 확인할 수 있는 시스템이 추가되었습니다.텥테ㅔ테텥스스스트ㅡㅌ테스트트텥테ㅔ테텥스스스트ㅡㅌ테스트트텥테ㅔ테텥스스스트ㅡㅌ테스트트텥테ㅔ테텥스스스트ㅡㅌ테스트트텥테ㅔ테텥스스스트ㅡㅌ테스트트",
    view_count: 6828,
    registered_date: "2026-03-07 10:25",
    registered_by: "관리자 B",
    is_pinned: false,
  },
  {
    id: "8",
    number: "000001",
    division: "자주 묻는 질문",
    category: "취소/환불",
    target: "리뷰어",
    title:
      "*체험단 구독 중지 시 모든 서비스 활용이 불가합니다.일이삼사오육칠팔구십일이삼사오육칠팔구십",
    view_count: 0,
    registered_date: "2026-03-08 15:10",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "9",
    number: "000001",
    division: "자주 묻는 질문",
    category: "회원가입/로그인",
    target: "리뷰어",
    title: "인플루언서 신청사유 추가 선정 시 참고/ 확인해주세요.",
    view_count: 0,
    registered_date: "2026-03-09 09:45",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "10",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "리뷰어",
    title: "(중요) 체험단 광고주 (구독/환불) 관련 재공지",
    view_count: 0,
    registered_date: "2026-03-10 14:27",
    registered_by: "admin",
    is_pinned: false,
  },
  {
    id: "11",
    number: "000008",
    division: "자주 묻는 질문",
    category: "주문/배송",
    target: "파트너",
    title: "스타일씨 공식 홈페이지에 나오는 체험단 필터링이 리뉴얼 되었습니다!",
    view_count: 0,
    registered_date: "2026-03-11 16:10",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "12",
    number: "000001",
    division: "이벤트",
    category: "이벤트",
    target: "파트너",
    title: "* 인스타릴스 (영상) 공식 오픈 *",
    view_count: 144,
    registered_date: "2026-03-12 11:33",
    registered_by: "관리자 A",
    is_pinned: false,
  },
  {
    id: "13",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "파트너",
    title: `체험단 등록 실시간 '미리보기' 기능 추가`,
    view_count: 0,
    registered_date: "2026-03-13 10:48",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "14",
    number: "000001",
    division: "자주 묻는 질문",
    category: "자주 묻는 질문",
    target: "파트너",
    title: "*중요* 블로그 리뷰 콘텐츠 스폰서 배너 표시 지침이 변경됩니다.",
    view_count: 0,
    registered_date: "2026-03-14 15:22",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "15",
    number: "000002",
    division: "자주 묻는 질문",
    category: "교환/반품",
    target: "파트너",
    title: "체험단 등록 시 불러오기 기능이 추가 되었습니다!",
    view_count: 0,
    registered_date: "2026-03-15 09:15",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "16",
    number: "000003",
    division: "공지사항",
    category: "중요",
    target: "전체",
    title: "공정위문구 (대가성 표기) 안내",
    view_count: 250,
    registered_date: "2026-03-16 13:40",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "17",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "전체",
    title: "송장 일괄 업로드 기능이 추가 되었습니다.",
    view_count: 0,
    registered_date: "2026-03-17 17:25",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  // ==== [임시] 유저 FAQ 캠페인 카테고리 더미 데이터 ====
  {
    id: "18",
    number: "000101",
    division: "자주 묻는 질문",
    category: "캠페인",
    target: "리뷰어",
    title: "[캠페인] 캠페인 신청은 어떻게 하나요?",
    view_count: 0,
    registered_date: "2026-03-18 09:00",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "19",
    number: "000102",
    division: "자주 묻는 질문",
    category: "캠페인",
    target: "리뷰어",
    title: "[캠페인] 캠페인 당첨 결과는 언제 확인할 수 있나요?",
    view_count: 0,
    registered_date: "2026-03-18 09:10",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "20",
    number: "000103",
    division: "자주 묻는 질문",
    category: "캠페인",
    target: "리뷰어",
    title: "[캠페인] 캠페인별로 신청 가능한 횟수에 제한이 있나요?",
    view_count: 0,
    registered_date: "2026-03-18 09:20",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "21",
    number: "000104",
    division: "자주 묻는 질문",
    category: "캠페인",
    target: "리뷰어",
    title: "[캠페인] 이미 신청한 캠페인을 취소하고 다시 신청할 수 있나요?",
    view_count: 0,
    registered_date: "2026-03-18 09:30",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "22",
    number: "000105",
    division: "자주 묻는 질문",
    category: "캠페인",
    target: "리뷰어",
    title: "[캠페인] 캠페인별 콘텐츠 제출 기한은 어디서 확인하나요?",
    view_count: 0,
    registered_date: "2026-03-18 09:40",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "23",
    number: "000106",
    division: "자주 묻는 질문",
    category: "캠페인",
    target: "리뷰어",
    title: "[캠페인] 캠페인 선정 기준이 궁금해요.",
    view_count: 0,
    registered_date: "2026-03-18 09:50",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "24",
    number: "000107",
    division: "자주 묻는 질문",
    category: "캠페인",
    target: "리뷰어",
    title: "[캠페인] 캠페인별 제공 혜택은 어디에서 확인하나요?",
    view_count: 0,
    registered_date: "2026-03-18 10:00",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "25",
    number: "000108",
    division: "자주 묻는 질문",
    category: "캠페인",
    target: "리뷰어",
    title: "[캠페인] 캠페인 참여 후 콘텐츠 수정이 필요한 경우 어떻게 하나요?",
    view_count: 0,
    registered_date: "2026-03-18 10:10",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "26",
    number: "000109",
    division: "자주 묻는 질문",
    category: "캠페인",
    target: "리뷰어",
    title: "[캠페인] 캠페인별 필수 가이드는 어디에서 확인할 수 있나요?",
    view_count: 0,
    registered_date: "2026-03-18 10:20",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "27",
    number: "000110",
    division: "자주 묻는 질문",
    category: "캠페인",
    target: "리뷰어",
    title: "[캠페인] 캠페인 심사 중 상태에서 변경되는 사항이 있나요?",
    view_count: 0,
    registered_date: "2026-03-18 10:30",
    registered_by: "관리자 C",
    is_pinned: false,
  },
];

/**
 * localStorage에서 게시글 목록 데이터를 불러오는 함수
 *
 * 목적: 페이지 로드 시 localStorage에 저장된 게시글 목록 데이터를 불러옵니다.
 * FIXED: Mock data FIRST, then merge/update with localStorage data
 * - Mock data should always be displayed
 * - localStorage data is merged with mock data (updates existing, adds new)
 *
 * @returns 게시글 목록 배열
 */
function load_posts_from_storage(): PostItem[] {
  // 서버 사이드에서는 localStorage에 접근할 수 없으므로 기본 데이터 반환
  if (typeof window === "undefined") {
    return default_posts_data;
  }

  try {
    // localStorage에서 게시글 목록 데이터 불러오기
    const stored = localStorage.getItem(STORAGE_KEY_POSTS);
    if (!stored) {
      // localStorage에 데이터가 없으면 기본 데이터 반환
      return default_posts_data;
    }

    // JSON 문자열을 객체 배열로 변환
    const parsed_data: PostItem[] = JSON.parse(stored);

    // 배열인지 확인 (타입 안전성 확보)
    if (!Array.isArray(parsed_data)) {
      return default_posts_data;
    }

    // FIXED: Merge mock data with localStorage data
    // 1. Start with default mock data
    // 2. Update existing posts from localStorage (by ID)
    // 3. Add new posts from localStorage that don't exist in mock data

    const mock_data_map = new Map(default_posts_data.map((post) => [post.id, post]));
    const storage_data_map = new Map(parsed_data.map((post) => [post.id, post]));

    // Update mock data with localStorage changes and add new localStorage posts
    const merged_data: PostItem[] = [];

    // First add all mock data (updated with localStorage if exists)
    for (const mock_post of default_posts_data) {
      const storage_post = storage_data_map.get(mock_post.id);
      merged_data.push(storage_post || mock_post);
    }

    // Then add new posts from localStorage that don't exist in mock data
    for (const storage_post of parsed_data) {
      if (!mock_data_map.has(storage_post.id)) {
        merged_data.push(storage_post);
      }
    }

    return merged_data;
  } catch (_error) {
    // JSON 파싱 에러 등 예외 상황에서는 기본 데이터 반환
    return default_posts_data;
  }
}

/**
 * localStorage에 게시글 목록 데이터를 저장하는 함수
 *
 * 목적: 게시글 목록 데이터가 변경될 때마다 localStorage에 저장합니다.
 *
 * @param posts - 저장할 게시글 목록 배열
 */
function save_posts_to_storage(posts: PostItem[]): void {
  // 서버 사이드에서는 localStorage에 접근할 수 없으므로 종료
  if (typeof window === "undefined") {
    return;
  }

  try {
    // 배열을 JSON 문자열로 변환하여 localStorage에 저장
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  } catch (_error) {
    // 저장 실패 시 에러 로그 출력
  }
}

/**
 * localStorage에서 게시글 상세 데이터를 불러오는 함수
 *
 * @returns 게시글 상세 데이터 객체 (ID를 키로 하는 객체)
 */
function load_post_details_from_storage(): Record<string, PostDetail> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY_POST_DETAILS);
    if (!stored) {
      return {};
    }

    const parsed_data: Record<string, PostDetail> = JSON.parse(stored);
    if (!parsed_data || typeof parsed_data !== "object") {
      return {};
    }

    return parsed_data;
  } catch (_error) {
    return {};
  }
}

/**
 * localStorage에 게시글 상세 데이터를 저장하는 함수
 *
 * @param post_details - 저장할 게시글 상세 데이터 객체
 */
function save_post_details_to_storage(post_details: Record<string, PostDetail>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY_POST_DETAILS, JSON.stringify(post_details));
  } catch (_error) {}
}

// 게시글 목록 데이터
// localStorage에서 불러온 데이터를 사용하고, 없으면 기본 데이터를 사용합니다
export let posts_data: PostItem[] = load_posts_from_storage();

/**
 * 게시글 데이터 초기화 함수
 *
 * 목적: 클라이언트에서만 실행되어 localStorage에서 게시글 데이터를 불러옵니다.
 * - 서버 사이드에서는 실행하지 않아 Hydration 오류를 방지합니다.
 * - 이 함수는 클라이언트 컴포넌트에서 useEffect 내에서 호출해야 합니다.
 */
export function initialize_posts_data(): void {
  if (typeof window === "undefined") {
    return;
  }
  posts_data = load_posts_from_storage();
}

/**
 * 게시글 등록 함수
 *
 * 목적: 새로운 게시글을 등록하고 localStorage에 저장합니다.
 *
 * @param post - 등록할 게시글 데이터 (PostItem)
 * @param content - 게시글 본문 내용 (HTML 형식)
 */
export function add_post(post: PostItem, content: string): void {
  // 게시글 목록에 추가
  posts_data.push(post);

  // localStorage에서 기존 상세 데이터 불러오기
  const current_post_details = load_post_details_from_storage();

  // 게시글 상세 데이터 저장
  const post_detail: PostDetail = {
    ...post,
    content: content,
    updated_date: post.registered_date.split(" ")[0],
  };
  current_post_details[post.id] = post_detail;

  // localStorage에 저장
  save_posts_to_storage(posts_data);
  save_post_details_to_storage(current_post_details);
}

/**
 * 게시글 수정 함수
 *
 * 목적: 기존 게시글을 수정하고 localStorage에 저장합니다.
 *
 * @param post_id - 수정할 게시글 ID
 * @param updated_post - 수정된 게시글 데이터
 * @param content - 수정된 게시글 본문 내용 (HTML 형식)
 */
export function update_post(post_id: string, updated_post: PostItem, content: string): void {
  // 게시글 목록에서 찾아서 수정
  const index = posts_data.findIndex((p) => p.id === post_id);
  if (index !== -1) {
    posts_data[index] = updated_post;
  }

  // localStorage에서 기존 상세 데이터 불러오기
  const current_post_details = load_post_details_from_storage();

  // 게시글 상세 데이터 수정
  const post_detail: PostDetail = {
    ...updated_post,
    content: content,
    updated_date: new Date().toISOString().split("T")[0],
  };
  current_post_details[post_id] = post_detail;

  // localStorage에 저장
  save_posts_to_storage(posts_data);
  save_post_details_to_storage(current_post_details);
}

/**
 * 게시글 삭제 함수
 *
 * 목적: 선택된 게시글들을 삭제하고 localStorage에 저장합니다.
 *
 * @param post_ids - 삭제할 게시글 ID 배열
 */
export function delete_posts(post_ids: string[]): void {
  // 게시글 목록에서 삭제
  posts_data = posts_data.filter((post) => !post_ids.includes(post.id));

  // localStorage에서 기존 상세 데이터 불러오기
  const current_post_details = load_post_details_from_storage();

  // 선택된 게시글들의 상세 데이터도 삭제
  post_ids.forEach((post_id) => {
    delete current_post_details[post_id];
  });

  // localStorage에 저장
  save_posts_to_storage(posts_data);
  save_post_details_to_storage(current_post_details);

  // mock DB(json-server)에서도 게시글 삭제 (비동기, 실패해도 UI는 유지)
  try {
    post_ids.forEach((post_id) => {
      const numericId = Number(post_id);
      void deleteAdminCommunityPost(Number.isNaN(numericId) ? post_id : numericId);
    });
  } catch (_apiError) {
    // 목업 서버 오류는 UI에 영향을 주지 않음
  }
}

/**
 * 게시글 상세 데이터 조회 함수
 *
 * 목적: 게시글 ID로 상세 정보를 조회합니다.
 * - localStorage에 저장된 상세 데이터를 우선 사용합니다.
 * - 없으면 기본 목업 데이터를 사용합니다.
 *
 * @param id - 게시글 ID
 * @returns 게시글 상세 데이터 (PostDetail) 또는 null
 */
export const get_post_detail = (id: string): PostDetail | null => {
  const post = posts_data.find((p) => p.id === id);
  if (!post) return null;

  // localStorage에 저장된 상세 데이터가 있으면 우선 사용
  const current_post_details = load_post_details_from_storage();
  if (current_post_details[id]) {
    return current_post_details[id];
  }

  // 기본 목업 데이터 사용
  // 각 게시글별 실제 내용 정의
  // 공지사항: 공지 형식의 글
  // 자주 묻는 질문: Q&A 형식의 답변
  const post_contents: { [key: string]: string } = {
    // 공지사항
    "1": `<p>안녕하세요, 리뷰X입니다.</p><p>건강기능식품 체험단 등록 시 다음과 같은 유의사항을 확인해 주시기 바랍니다.</p><p><strong>1. 건강기능식품 표시·광고 관련 법규 준수</strong></p><p>- 건강기능식품의 효능·효과를 과장하거나 허위로 표시·광고할 수 없습니다.</p><p>- 의약품으로 오인·혼동할 수 있는 표현을 사용할 수 없습니다.</p><p><strong>2. 체험단 등록 시 필수 정보</strong></p><p>- 제품의 기능성 원료 및 함량 정보를 정확히 기재해 주세요.</p><p>- 체험 기간 및 인원 수를 명확히 설정해 주세요.</p><p>문의사항이 있으시면 고객센터로 연락 주시기 바랍니다.</p><p>감사합니다.</p>`,

    "2": `<p>안녕하세요, 리뷰X입니다.</p><p>의료기기 체험단은 관련 법규로 인해 진행이 불가능합니다.</p><p><strong>관련 법규</strong></p><p>- 의료기기법 제2조에 따라 의료기기는 체험단 형태로 진행할 수 없습니다.</p><p>- 의료기기는 반드시 의료기기 판매업 허가를 받은 업체를 통해서만 판매 가능합니다.</p><p>이와 관련하여 문의사항이 있으시면 고객센터로 연락 주시기 바랍니다.</p><p>감사합니다.</p>`,

    "3": `<p>안녕하세요, 리뷰X입니다.</p><p>파트너님께서 등록하신 캠페인에 참여한 인플루언서의 중복 당첨 이력을 확인할 수 있는 기능이 추가되었습니다.</p><p><strong>확인 방법</strong></p><p>1. 캠페인 관리 페이지로 이동</p><p>2. 해당 캠페인 선택</p><p>3. 참가자 내역 > 중복 당첨 이력 탭에서 확인</p><p>이 기능을 통해 더욱 공정한 체험단 운영이 가능합니다.</p><p>감사합니다.</p><p>본 공지는 테스트를 위해 아래에 긴 내용을 추가한 것입니다. 중복 당첨 이력 확인 기능은 파트너님께서 운영하시는 캠페인의 공정성을 높이는 데 중요한 도구입니다. 동일한 인플루언서가 짧은 기간 내 여러 캠페인에 중복으로 당첨되는 경우, 이를 파악하여 체험단 운영 정책을 조정하실 수 있습니다.</p><p><strong>중복 당첨 이력 확인의 장점</strong></p><p>캠페인 관리 페이지에서 참가자 내역을 조회하시면 해당 캠페인에 참여 신청한 인플루언서 목록을 확인할 수 있으며, 중복 당첨 이력 탭을 선택하시면 최근 다른 캠페인에서 당첨된 이력을 한눈에 보실 수 있습니다. 이를 통해 공정한 기회 제공과 체험단 품질 관리에 도움이 됩니다. 리뷰X는 지속적으로 파트너님과 인플루언서 모두에게 유익한 기능을 추가하고자 노력하고 있습니다.</p><p><strong>추가 안내 사항</strong></p><p>중복 당첨 이력은 최근 6개월 이내의 당첨 건수를 기준으로 집계됩니다. 당첨 이력이 많은 인플루언서의 경우 선정 시 참고 자료로 활용하시거나, 캠페인별로 당첨 제한 정책을 적용하실 수 있습니다. 문의사항이 있으시면 고객센터 또는 1:1 문의를 이용해 주시기 바랍니다. 항상 리뷰X를 이용해 주셔서 감사합니다.</p><p>이번 기능 추가와 함께 앞으로도 다양한 개선 사항을 지속적으로 반영하여 더 나은 서비스를 제공하겠습니다. 파트너님의 소중한 의견을 기다리고 있으며, 불편 사항이나 개선 제안이 있으시면 언제든지 전달해 주시기 바랍니다. 다시 한번 감사드립니다.</p><p>가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하 가나다라마바사아자차카타파하.</p><p>테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다. 테스트용 반복 문장입니다.</p><p>리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠 리뷰X 공지사항 테스트 콘텐츠.</p><p>캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능 캠페인 관리 중복 당첨 이력 확인 기능.</p><p>마지막으로 다시 한번 안내드립니다. 중복 당첨 이력은 캠페인 관리 페이지 > 해당 캠페인 선택 > 참가자 내역 > 중복 당첨 이력 탭에서 확인하실 수 있습니다. 긴 글 읽어 주셔서 감사합니다. 테스트를 위한 긴 문단이었습니다. 감사합니다.</p>`,

    "4": `<p>안녕하세요, 리뷰X입니다.</p><p>스타일씨 무제한 체험단에서 추천할인코드를 사용하여 할인을 받을 수 있습니다.</p><p><strong>할인코드 사용 방법</strong></p><p>1. 체험단 신청 시 추천할인코드 입력란에 코드 입력</p><p>2. 결제 시 자동으로 할인 적용</p><p>자세한 내용은 스타일씨 공식 홈페이지를 참고해 주세요.</p><p>감사합니다.</p>`,

    "5": `<p>안녕하세요, 리뷰X입니다.</p><p>구매평 체험단 메뉴가 신설되었습니다.</p><p><strong>구매평 체험단이란?</strong></p><p>- 온라인 쇼핑몰에서 구매평을 작성하는 체험단입니다.</p><p>- 제품을 체험하고 구매평을 작성하면 포인트를 지급받을 수 있습니다.</p><p><strong>이용 방법</strong></p><p>1. 구매평 체험단 메뉴에서 원하는 체험단 선택</p><p>2. 신청 및 선정 대기</p><p>3. 제품 수령 후 구매평 작성</p><p>많은 이용 부탁드립니다.</p>`,

    "6": `<p>안녕하세요, 리뷰X입니다.</p><p>구매평 제한 사이트 안내입니다.</p><p><strong>구매평 체험단이 제한되는 사이트</strong></p><p>- 카카오선물하기</p><p>- 톡딜(톡스토어)</p><p>- 화해</p><p>위 사이트들은 구매평 체험단 진행이 불가능합니다.</p><p>이용에 참고 부탁드립니다.</p>`,

    "7": `<p>안녕하세요, 리뷰X입니다.</p><p>정산 내역을 확인할 수 있는 시스템이 추가되었습니다.</p><p><strong>확인 방법</strong></p><p>1. 마이페이지 > 정산 내역 메뉴로 이동</p><p>2. 월별, 캠페인별로 정산 내역 확인 가능</p><p>3. 정산 상태 및 지급 예정일 확인</p><p>더욱 편리한 정산 관리가 가능합니다.</p>`,

    "10": `<p>안녕하세요, 리뷰X입니다.</p><p>체험단 광고주 구독 및 환불 관련 재공지입니다.</p><p><strong>구독 관련</strong></p><p>- 체험단 광고주 구독은 월 단위로 자동 갱신됩니다.</p><p>- 구독 해지는 구독 기간 만료 전까지 가능합니다.</p><p><strong>환불 정책</strong></p><p>- 구독 해지 시 남은 기간에 대한 환불이 가능합니다.</p><p>- 환불 신청은 고객센터로 문의해 주세요.</p><p>자세한 내용은 이용약관을 참고해 주시기 바랍니다.</p>`,

    "13": `<p>안녕하세요, 리뷰X입니다.</p><p>체험단 등록 시 실시간 미리보기 기능이 추가되었습니다.</p><p><strong>미리보기 기능</strong></p><p>- 체험단 등록 중에도 실시간으로 미리보기를 확인할 수 있습니다.</p><p>- 등록 완료 전에 레이아웃 및 내용을 확인하고 수정할 수 있습니다.</p><p>더욱 편리한 체험단 등록이 가능합니다.</p>`,

    "16": `<p>안녕하세요, 리뷰X입니다.</p><p>공정위문구(대가성 표기) 안내입니다.</p><p><strong>대가성 표기란?</strong></p><p>- 체험단 참여 시 제품을 무료로 제공받는 대가로 리뷰를 작성하는 경우, 이를 명시해야 합니다.</p><p>- 공정거래위원회의 표시·광고 심의 규정에 따라 대가성 표기가 필수입니다.</p><p><strong>표기 방법</strong></p><p>- 리뷰 작성 시 "체험단을 통해 무료로 제공받아 작성한 리뷰입니다" 문구를 포함해 주세요.</p><p>공정한 거래를 위해 협조 부탁드립니다.</p>`,

    "17": `<p>안녕하세요, 리뷰X입니다.</p><p>송장 일괄 업로드 기능이 추가되었습니다.</p><p><strong>기능 설명</strong></p><p>- 여러 체험단의 송장을 한 번에 업로드할 수 있습니다.</p><p>- 엑셀 파일 형식으로 일괄 업로드 가능</p><p><strong>사용 방법</strong></p><p>1. 캠페인 관리 > 송장 업로드 메뉴로 이동</p><p>2. 엑셀 템플릿 다운로드</p><p>3. 송장 정보 입력 후 업로드</p><p>더욱 편리한 송장 관리가 가능합니다.</p>`,

    // 자주 묻는 질문
    "8": `<p>체험단 구독을 중지하면 모든 서비스 활용이 불가능합니다.</p><p><strong>구독 중지 시 제한 사항</strong></p><p>- 체험단 등록 불가</p><p>- 체험단 관리 기능 사용 불가</p><p>- 기존 체험단 데이터 조회 제한</p><p>서비스를 계속 이용하시려면 구독을 유지해 주시기 바랍니다.</p>`,

    "9": `<p>인플루언서 신청 시 신청사유를 추가로 작성해 주시면 선정 시 참고 자료로 활용됩니다.</p><p><strong>신청사유 작성 팁</strong></p><p>- 해당 제품/서비스에 대한 관심도와 경험을 구체적으로 작성</p><p>- 콘텐츠 제작 계획 및 아이디어 포함</p><p>- 기존 리뷰 경험 및 성과 간단히 소개</p><p>신청사유가 구체적일수록 선정 확률이 높아집니다.</p>`,

    "11": `<p>스타일씨 공식 홈페이지에 나오는 체험단 필터링이 리뉴얼되었습니다.</p><p><strong>리뉴얼 내용</strong></p><p>- 카테고리별 필터링 기능 개선</p><p>- 검색 기능 강화</p><p>- 체험단 목록 UI 개선</p><p>더욱 편리하게 원하는 체험단을 찾을 수 있습니다.</p>`,

    "14": `<p>블로그 리뷰 콘텐츠에 스폰서 배너 표시 지침이 변경되었습니다.</p><p><strong>변경 사항</strong></p><p>- 스폰서 배너는 리뷰 상단에 명확하게 표시해야 합니다.</p><p>- 배너 크기 및 위치에 대한 가이드라인이 업데이트되었습니다.</p><p><strong>주의사항</strong></p><p>- 스폰서 배너 미표시 시 페널티가 부과될 수 있습니다.</p><p>- 자세한 가이드라인은 공지사항을 참고해 주세요.</p>`,

    "15": `<p>체험단 등록 시 불러오기 기능이 추가되었습니다.</p><p><strong>불러오기 기능이란?</strong></p><p>- 이전에 등록한 체험단 정보를 불러와서 재사용할 수 있는 기능입니다.</p><p>- 유사한 체험단을 등록할 때 시간을 절약할 수 있습니다.</p><p><strong>사용 방법</strong></p><p>1. 체험단 등록 페이지에서 "불러오기" 버튼 클릭</p><p>2. 이전에 등록한 체험단 목록에서 선택</p><p>3. 필요한 정보만 수정하여 등록</p><p>더욱 편리한 체험단 등록이 가능합니다.</p>`,

    // 이벤트
    "12": `<p>안녕하세요, 리뷰X입니다.</p><p>인스타릴스(영상) 공식 오픈을 알려드립니다.</p><p><strong>인스타릴스 체험단</strong></p><p>- 인스타그램 릴스 형식의 영상 콘텐츠를 제작하는 체험단입니다.</p><p>- 영상 길이: 15초 ~ 60초</p><p>- 제품 소개 및 체험 후기를 영상으로 제작</p><p><strong>참여 방법</strong></p><p>1. 인스타릴스 체험단 메뉴에서 원하는 체험단 선택</p><p>2. 신청 및 선정 대기</p><p>3. 제품 수령 후 릴스 영상 제작 및 업로드</p><p>많은 참여 부탁드립니다!</p>`,
  };

  // 게시글 ID에 해당하는 내용이 있으면 사용하고, 없으면 기본 내용 반환
  const content = post_contents[id] || `<p>${post.title}에 대한 내용입니다.</p>`;

  return {
    ...post,
    content: content,
    updated_date: post.registered_date.split(" ")[0], // 등록일을 수정일로 사용
  };
};
