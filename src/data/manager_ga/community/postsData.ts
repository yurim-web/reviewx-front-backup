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

// 게시글 구분 타입 정의 (공지사항, 자주 묻는 질문, 이벤트)
export type PostDivision = '공지사항' | '자주 묻는 질문' | '이벤트';

// 게시글 카테고리 타입 정의
export type PostCategory =
  | '전체'
  | '중요'
  | '공지사항'
  | '취소/환불'
  | '회원가입/로그인'
  | '주문/배송'
  | '교환/반품'
  | '자주 묻는 질문'
  | '이벤트';

// 게시글 아이템 타입 정의
export interface PostItem {
  id: string; // 게시글 ID
  number: string; // 번호 (예: 000001)
  division: PostDivision; // 구분 (공지사항/자주 묻는 질문/이벤트)
  category: PostCategory; // 카테고리
  title: string; // 제목
  view_count: number; // 조회수
  registered_date: string; // 등록일 (예: 2025-08-01 18:56)
  registered_by: string; // 등록자 (예: 관리자 A, 관리자 B, 관리자 C, admin 등)
  is_pinned: boolean; // 고정 여부
}

// 게시글 목록 데이터
export const posts_data: PostItem[] = [
  {
    id: '1',
    number: '000001',
    division: '공지사항',
    category: '전체',
    title: '[건강기능식품] 체험단 등록 유의 사항',
    view_count: 115000,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 A',
    is_pinned: false,
  },
  {
    id: '2',
    number: '000001',
    division: '공지사항',
    category: '중요',
    title: '[의료기기] 체험단 진행 불가 공지',
    view_count: 0,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 A',
    is_pinned: false,
  },
  {
    id: '3',
    number: '000001',
    division: '공지사항',
    category: '공지사항',
    title: '내 브랜드에 참여한 인플루언서의 중복 당첨 이력을 확인 할 수 있습니다.',
    view_count: 0,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
    is_pinned: false,
  },
  {
    id: '4',
    number: '000001',
    division: '공지사항',
    category: '공지사항',
    title: `스타일씨 무제한 체험단 (추천할인코드) 를 사용해서 '할인'을 받아보세요`,
    view_count: 1100000,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 A',
    is_pinned: false,
  },
  {
    id: '5',
    number: '000001',
    division: '공지사항',
    category: '공지사항',
    title: '구매평 체험단 메뉴 가 신설되었습니다.',
    view_count: 12000,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
    is_pinned: false,
  },
  {
    id: '6',
    number: '000001',
    division: '공지사항',
    category: '공지사항',
    title: '[ 구매평 제한 사이트 안내 ] 카카오선물하기 / 톡딜(톡스토어) / 화해 의 구매평 체험단이 제한됩니다.',
    view_count: 999999999,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
    is_pinned: false,
  },
  {
    id: '7',
    number: '000001',
    division: '공지사항',
    category: '공지사항',
    title: '정산 내역을 확인할 수 있는 시스템이 추가되었습니다.',
    view_count: 6828,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 B',
    is_pinned: false,
  },
  {
    id: '8',
    number: '000001',
    division: '자주 묻는 질문',
    category: '취소/환불',
    title: '*체험단 구독 중지 시 모든 서비스 활용이 불가합니다.*',
    view_count: 0,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
    is_pinned: false,
  },
  {
    id: '9',
    number: '000001',
    division: '자주 묻는 질문',
    category: '회원가입/로그인',
    title: '인플루언서 신청사유 추가 선정 시 참고/ 확인해주세요.',
    view_count: 0,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
    is_pinned: false,
  },
  {
    id: '10',
    number: '000001',
    division: '공지사항',
    category: '공지사항',
    title: '(중요) 체험단 광고주 (구독/환불) 관련 재공지',
    view_count: 0,
    registered_date: '2025-08-01 18:56',
    registered_by: 'admin',
    is_pinned: false,
  },
  {
    id: '11',
    number: '000001',
    division: '자주 묻는 질문',
    category: '주문/배송',
    title: '스타일씨 공식 홈페이지에 나오는 체험단 필터링이 리뉴얼 되었습니다!',
    view_count: 0,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
    is_pinned: false,
  },
  {
    id: '12',
    number: '000001',
    division: '이벤트',
    category: '이벤트',
    title: '* 인스타릴스 (영상) 공식 오픈 *',
    view_count: 144,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 A',
    is_pinned: false,
  },
  {
    id: '13',
    number: '000001',
    division: '공지사항',
    category: '공지사항',
    title: `체험단 등록 실시간 '미리보기' 기능 추가`,
    view_count: 0,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
    is_pinned: false,
  },
  {
    id: '14',
    number: '000001',
    division: '자주 묻는 질문',
    category: '자주 묻는 질문',
    title: '*중요* 블로그 리뷰 콘텐츠 스폰서 배너 표시 지침이 변경됩니다.',
    view_count: 0,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
    is_pinned: false,
  },
  {
    id: '15',
    number: '000001',
    division: '자주 묻는 질문',
    category: '교환/반품',
    title: '체험단 등록 시 불러오기 기능이 추가 되었습니다!',
    view_count: 0,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
    is_pinned: false,
  },
  {
    id: '16',
    number: '000001',
    division: '공지사항',
    category: '공지사항',
    title: '공정위문구 (대가성 표기) 안내',
    view_count: 250,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
    is_pinned: false,
  },
  {
    id: '17',
    number: '000001',
    division: '공지사항',
    category: '공지사항',
    title: '송장 일괄 업로드 기능이 추가 되었습니다.',
    view_count: 0,
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
    is_pinned: false,
  },
];

