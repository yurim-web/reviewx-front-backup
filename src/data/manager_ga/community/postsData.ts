/* ========================================
   📝 GA 관리자 게시글 목록 목업 데이터
   ======================================== */

/**
 * GA 관리자 게시글 목록 목업 데이터
 *
 * 목적: GA 관리자 게시글 목록 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/community/posts (게시글 목록 페이지)
 *
 * 주요 기능:
 * - 게시글 목록 데이터
 *
 */

// 공통 필터 옵션에서 import
import type { PostDivision } from '@/data/manager_ga/common/filterOptions';

// 타입 재export (기존 코드와의 호환성을 위해)
export type { PostDivision };

// 게시글 카테고리 타입 정의
export type PostCategory =
  | "전체"
  | "중요"
  | "공지사항"
  | "취소/환불"
  | "회원가입/로그인"
  | "주문/배송"
  | "교환/반품"
  | "자주 묻는 질문"
  | "이벤트";

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

// 게시글 목록 데이터
export const posts_data: PostItem[] = [
  {
    id: "1",
    number: "000001",
    division: "공지사항",
    category: "전체",
    target: "파트너",
    title: "[건강기능식품] 체험단 등록 유의 사항",
    view_count: 115000,
    registered_date: "2025-08-01 18:56",
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
    registered_date: "2025-08-01 18:56",
    registered_by: "관리자 A",
    is_pinned: false,
  },
  {
    id: "3",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "파트너",
    title:
      "내 브랜드에 참여한 인플루언서의 중복 당첨 이력을 확인 할 수 있습니다.",
    view_count: 0,
    registered_date: "2025-08-01 18:56",
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
    registered_date: "2025-08-01 18:56",
    registered_by: "관리자 A",
    is_pinned: false,
  },
  {
    id: "5",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "파트너",
    title: "구매평 체험단 메뉴 가 신설되었습니다.",
    view_count: 12000,
    registered_date: "2025-08-01 18:56",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "6",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "리뷰어",
    title:
      "[ 구매평 제한 사이트 안내 ] 카카오선물하기 / 톡딜(톡스토어) / 화해 의 구매평 체험단이 제한됩니다.",
    view_count: 999999999,
    registered_date: "2025-08-01 18:56",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "7",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "리뷰어",
    title: "정산 내역을 확인할 수 있는 시스템이 추가되었습니다.",
    view_count: 6828,
    registered_date: "2025-08-01 18:56",
    registered_by: "관리자 B",
    is_pinned: false,
  },
  {
    id: "8",
    number: "000001",
    division: "자주 묻는 질문",
    category: "취소/환불",
    target: "리뷰어",
    title: "*체험단 구독 중지 시 모든 서비스 활용이 불가합니다.*",
    view_count: 0,
    registered_date: "2025-08-01 18:56",
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
    registered_date: "2025-08-01 18:56",
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
    registered_date: "2025-08-01 18:56",
    registered_by: "admin",
    is_pinned: false,
  },
  {
    id: "11",
    number: "000001",
    division: "자주 묻는 질문",
    category: "주문/배송",
    target: "파트너",
    title: "스타일씨 공식 홈페이지에 나오는 체험단 필터링이 리뉴얼 되었습니다!",
    view_count: 0,
    registered_date: "2025-08-01 18:56",
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
    registered_date: "2025-08-01 18:56",
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
    registered_date: "2025-08-01 18:56",
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
    registered_date: "2025-08-01 18:56",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "15",
    number: "000001",
    division: "자주 묻는 질문",
    category: "교환/반품",
    target: "파트너",
    title: "체험단 등록 시 불러오기 기능이 추가 되었습니다!",
    view_count: 0,
    registered_date: "2025-08-01 18:56",
    registered_by: "관리자 C",
    is_pinned: false,
  },
  {
    id: "16",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "전체",
    title: "공정위문구 (대가성 표기) 안내",
    view_count: 250,
    registered_date: "2025-08-01 18:56",
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
    registered_date: "2025-08-01 18:56",
    registered_by: "관리자 C",
    is_pinned: false,
  },
];

// 게시글 상세 데이터 (ID로 조회)
// 실제로는 API를 통해 가져오지만, 목업 데이터로 제공
export const get_post_detail = (id: string): PostDetail | null => {
  const post = posts_data.find((p) => p.id === id);
  if (!post) return null;

  // 목업 본문 내용 (Figma 디자인 기반)
  // 모든 게시글에 기본 내용을 제공합니다.
  const default_content = `<p>${
    post.title
  }에 대한 상세 내용입니다.</p><p>&nbsp;</p><p>이 게시글은 ${
    post.division
  } 카테고리로 분류되어 있으며, ${
    post.target
  } 대상으로 작성되었습니다.</p><p>&nbsp;</p><p>등록일: ${
    post.registered_date
  }</p><p>등록자: ${
    post.registered_by
  }</p><p>조회수: ${post.view_count.toLocaleString()}회</p><p>&nbsp;</p><p>추가 상세 내용은 추후 업데이트될 예정입니다.</p>`;

  // 특정 게시글(ID: "1")에 대한 상세 내용
  const mock_content: { [key: string]: string } = {
    "1": `<p>오픈리뷰 기능 업데이트 안내</p><p>안녕하세요, 오픈리뷰입니다.</p><p>서비스 기능이 업데이트되어 안내드립니다.</p><p>&nbsp;</p><p>&nbsp;</p><p><strong>[광고주 기능 업데이트]</strong></p><p>&nbsp;</p><p>1. 선정자 발표 확정 방식 변경</p><p>- 기존 수동 확정 기능을 선정발표일에 자동 확정되도록 변경하였습니다.</p><p>- 일부 광고주가 발표를 늦게 하는 경우가 많아, 오히려 진행에 문제가 발생해 원래 방식으로 되돌렸습니다.</p><p>- 선정발표일 이전까지 사전 선정인원으로만 자동 확정되며, 사전 선정을 하지 않을 경우 해당 캠페인은 진행되지 않습니다.</p><p>&nbsp;</p><p>2. 송장번호 업로드 기능 추가</p><p>- 리뷰어에게 제품 발송 후, 캠페인별 송장번호 등록이 가능합니다.</p><p>- 경로: 마이페이지 > 나의 캠페인 > 해당 캠페인 > 참가자 내역 > 선정 탭</p><p>&nbsp;</p><p>3. 캠페인 등록 시 CS문의 연락처 추가 (필수)</p><p>- 선정된 리뷰어와 원활히 소통할 수 있도록 CS 문의 연락처 입력란이 필수 항목으로 추가되었습니다.</p><p>&nbsp;</p><p>4. 캠페인 자동 종료 기능 추가</p><p>- 콘텐츠 등록 기간 이후에도 방치되는 캠페인 문제를 해결하기 위해 자동 종료 기능을 도입했습니다.</p><p>- 등록 기간 만료 후 약 10일 경과 시, 캠페인이 자동 종료 처리되며 진행 사항에 따라 아래와 같이 적용됩니다.</p><p>&nbsp;· 등록 기간 내 미션 완료 리뷰어 → 정상 종료</p><p>&nbsp;· 등록 기간 이후 미션 완료 리뷰어 → 부여된 페널티 자동 해제 후 종료</p><p>&nbsp;· 등록 기간 이후에도 미션 미진행 리뷰어 → 페널티 부여 상태로 종료 (이후 콘텐츠 업로드 불가)</p><p>- 자동 종료 처리 후 페널티, 콘텐츠 수정이 불가하며, 포인트 페이백 캠페인의 경우 자동 지급 처리 됩니다.</p><p>&nbsp;</p><p>&nbsp;</p><p><strong>[리뷰어 기능 업데이트]</strong></p><p>&nbsp;</p><p>1. 송장번호 확인 기능 추가</p><p>- 광고주가 업로드한 송장번호를 마이페이지 > 나의 캠페인 > 해당 캠페인 > 송장 조회에서 확인할 수 있습니다.</p><p>&nbsp;</p><p>2. 캠페인 문의 연락처 확인 기능 추가</p><p>- 광고주가 입력한 CS 문의 연락처가 노출됩니다.</p><p>- 경로: 마이페이지 > 나의 캠페인 > 해당 캠페인 > 캠페인 문의 연락처</p><p>&nbsp;</p><p>&nbsp;</p><p><strong>안내 사항</strong></p><p>오픈리뷰는 중개형 플랫폼으로, 광고주가 직접 캠페인을 등록·선정·관리하도록 운영됩니다.</p><p>따라서 캠페인 진행과 관련된 세부 협의는 광고주와 리뷰어 간에 직접 이루어져야 하며, 오픈리뷰는 이에 직접 개입하지 않습니다.</p><p>&nbsp;</p><p>캠페인 선정 취소, 등록기간 연장 등 분쟁 우려가 있어 기능화 되어 있지 않습니다.<br />부득이한경우 광고주와 협의 하여 페널티를 해제 받는 쪽으로 진행부탁드립니다.</p><p>&nbsp;</p><p>앞으로도 안정적인 캠페인 운영을 위해 지속적으로 개선해 나가겠습니다.</p><p>감사합니다.</p>`,
  };

  return {
    ...post,
    content: mock_content[id] || default_content,
    updated_date: "2025-09-12",
  };
};
