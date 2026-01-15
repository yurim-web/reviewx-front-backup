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
import type { PostDivision } from "@/data/manager_ga/common/filterOptions";

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

// 게시글 목록 데이터
export const posts_data: PostItem[] = [
  {
    id: "1",
    number: "0000123",
    division: "공지사항",
    category: "전체",
    target: "파트너",
    title: "[건강기능식품] 체험단 등록 유의 사항",
    view_count: 115000,
    registered_date: "2026-01-02 10:15",
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
    registered_date: "2026-01-05 14:20",
    registered_by: "관리자 A",
    is_pinned: true,
  },
  {
    id: "3",
    number: "0000222",
    division: "공지사항",
    category: "공지사항",
    target: "파트너",
    title:
      "내 브랜드에 참여한 인플루언서의 중복 당첨 이력을 확인 할 수 있습니다.",
    view_count: 0,
    registered_date: "2026-01-08 09:30",
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
    registered_date: "2026-01-10 16:45",
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
    registered_date: "2026-01-12 11:20",
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
      "[ 구매평 제한 사이트 안내 ] 카카오선물하기 / 톡딜(톡스토어) / 화해 의 구매평 체험단이 제한됩니다.",
    view_count: 999999999,
    registered_date: "2026-01-15 13:40",
    registered_by: "관리자 C",
    is_pinned: true,
  },
  {
    id: "7",
    number: "000001",
    division: "공지사항",
    category: "공지사항",
    target: "리뷰어",
    title: "정산 내역을 확인할 수 있는 시스템이 추가되었습니다.",
    view_count: 6828,
    registered_date: "2026-01-18 10:25",
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
    registered_date: "2026-01-20 15:10",
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
    registered_date: "2026-01-22 09:45",
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
    registered_date: "2026-01-03 14:27",
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
    registered_date: "2026-01-08 16:10",
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
    registered_date: "2026-01-12 11:33",
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
    registered_date: "2026-01-15 10:48",
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
    registered_date: "2026-01-18 15:22",
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
    registered_date: "2026-01-20 09:15",
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
    registered_date: "2026-01-25 13:40",
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
    registered_date: "2026-01-28 17:25",
    registered_by: "관리자 C",
    is_pinned: false,
  },
];

// 게시글 상세 데이터 (ID로 조회)
// 실제로는 API를 통해 가져오지만, 목업 데이터로 제공
// 각 게시글마다 실제 내용을 직접 정의합니다.
export const get_post_detail = (id: string): PostDetail | null => {
  const post = posts_data.find((p) => p.id === id);
  if (!post) return null;

  // 각 게시글별 실제 내용 정의
  // 공지사항: 공지 형식의 글
  // 자주 묻는 질문: Q&A 형식의 답변
  const post_contents: { [key: string]: string } = {
    // 공지사항
    "1": `<p>안녕하세요, 리뷰X입니다.</p><p>&nbsp;</p><p>건강기능식품 체험단 등록 시 다음과 같은 유의사항을 확인해 주시기 바랍니다.</p><p>&nbsp;</p><p><strong>1. 건강기능식품 표시·광고 관련 법규 준수</strong></p><p>- 건강기능식품의 효능·효과를 과장하거나 허위로 표시·광고할 수 없습니다.</p><p>- 의약품으로 오인·혼동할 수 있는 표현을 사용할 수 없습니다.</p><p>&nbsp;</p><p><strong>2. 체험단 등록 시 필수 정보</strong></p><p>- 제품의 기능성 원료 및 함량 정보를 정확히 기재해 주세요.</p><p>- 체험 기간 및 인원 수를 명확히 설정해 주세요.</p><p>&nbsp;</p><p>문의사항이 있으시면 고객센터로 연락 주시기 바랍니다.</p><p>감사합니다.</p>`,

    "2": `<p>안녕하세요, 리뷰X입니다.</p><p>&nbsp;</p><p>의료기기 체험단은 관련 법규로 인해 진행이 불가능합니다.</p><p>&nbsp;</p><p><strong>관련 법규</strong></p><p>- 의료기기법 제2조에 따라 의료기기는 체험단 형태로 진행할 수 없습니다.</p><p>- 의료기기는 반드시 의료기기 판매업 허가를 받은 업체를 통해서만 판매 가능합니다.</p><p>&nbsp;</p><p>이와 관련하여 문의사항이 있으시면 고객센터로 연락 주시기 바랍니다.</p><p>감사합니다.</p>`,

    "3": `<p>안녕하세요, 리뷰X입니다.</p><p>&nbsp;</p><p>파트너님께서 등록하신 캠페인에 참여한 인플루언서의 중복 당첨 이력을 확인할 수 있는 기능이 추가되었습니다.</p><p>&nbsp;</p><p><strong>확인 방법</strong></p><p>1. 캠페인 관리 페이지로 이동</p><p>2. 해당 캠페인 선택</p><p>3. 참가자 내역 > 중복 당첨 이력 탭에서 확인</p><p>&nbsp;</p><p>이 기능을 통해 더욱 공정한 체험단 운영이 가능합니다.</p><p>감사합니다.</p>`,

    "4": `<p>안녕하세요, 리뷰X입니다.</p><p>&nbsp;</p><p>스타일씨 무제한 체험단에서 추천할인코드를 사용하여 할인을 받을 수 있습니다.</p><p>&nbsp;</p><p><strong>할인코드 사용 방법</strong></p><p>1. 체험단 신청 시 추천할인코드 입력란에 코드 입력</p><p>2. 결제 시 자동으로 할인 적용</p><p>&nbsp;</p><p>자세한 내용은 스타일씨 공식 홈페이지를 참고해 주세요.</p><p>감사합니다.</p>`,

    "5": `<p>안녕하세요, 리뷰X입니다.</p><p>&nbsp;</p><p>구매평 체험단 메뉴가 신설되었습니다.</p><p>&nbsp;</p><p><strong>구매평 체험단이란?</strong></p><p>- 온라인 쇼핑몰에서 구매평을 작성하는 체험단입니다.</p><p>- 제품을 체험하고 구매평을 작성하면 포인트를 지급받을 수 있습니다.</p><p>&nbsp;</p><p><strong>이용 방법</strong></p><p>1. 구매평 체험단 메뉴에서 원하는 체험단 선택</p><p>2. 신청 및 선정 대기</p><p>3. 제품 수령 후 구매평 작성</p><p>&nbsp;</p><p>많은 이용 부탁드립니다.</p>`,

    "6": `<p>안녕하세요, 리뷰X입니다.</p><p>&nbsp;</p><p>구매평 제한 사이트 안내입니다.</p><p>&nbsp;</p><p><strong>구매평 체험단이 제한되는 사이트</strong></p><p>- 카카오선물하기</p><p>- 톡딜(톡스토어)</p><p>- 화해</p><p>&nbsp;</p><p>위 사이트들은 구매평 체험단 진행이 불가능합니다.</p><p>이용에 참고 부탁드립니다.</p>`,

    "7": `<p>안녕하세요, 리뷰X입니다.</p><p>&nbsp;</p><p>정산 내역을 확인할 수 있는 시스템이 추가되었습니다.</p><p>&nbsp;</p><p><strong>확인 방법</strong></p><p>1. 마이페이지 > 정산 내역 메뉴로 이동</p><p>2. 월별, 캠페인별로 정산 내역 확인 가능</p><p>3. 정산 상태 및 지급 예정일 확인</p><p>&nbsp;</p><p>더욱 편리한 정산 관리가 가능합니다.</p>`,

    "10": `<p>안녕하세요, 리뷰X입니다.</p><p>&nbsp;</p><p>체험단 광고주 구독 및 환불 관련 재공지입니다.</p><p>&nbsp;</p><p><strong>구독 관련</strong></p><p>- 체험단 광고주 구독은 월 단위로 자동 갱신됩니다.</p><p>- 구독 해지는 구독 기간 만료 전까지 가능합니다.</p><p>&nbsp;</p><p><strong>환불 정책</strong></p><p>- 구독 해지 시 남은 기간에 대한 환불이 가능합니다.</p><p>- 환불 신청은 고객센터로 문의해 주세요.</p><p>&nbsp;</p><p>자세한 내용은 이용약관을 참고해 주시기 바랍니다.</p>`,

    "13": `<p>안녕하세요, 리뷰X입니다.</p><p>&nbsp;</p><p>체험단 등록 시 실시간 미리보기 기능이 추가되었습니다.</p><p>&nbsp;</p><p><strong>미리보기 기능</strong></p><p>- 체험단 등록 중에도 실시간으로 미리보기를 확인할 수 있습니다.</p><p>- 등록 완료 전에 레이아웃 및 내용을 확인하고 수정할 수 있습니다.</p><p>&nbsp;</p><p>더욱 편리한 체험단 등록이 가능합니다.</p>`,

    "16": `<p>안녕하세요, 리뷰X입니다.</p><p>&nbsp;</p><p>공정위문구(대가성 표기) 안내입니다.</p><p>&nbsp;</p><p><strong>대가성 표기란?</strong></p><p>- 체험단 참여 시 제품을 무료로 제공받는 대가로 리뷰를 작성하는 경우, 이를 명시해야 합니다.</p><p>- 공정거래위원회의 표시·광고 심의 규정에 따라 대가성 표기가 필수입니다.</p><p>&nbsp;</p><p><strong>표기 방법</strong></p><p>- 리뷰 작성 시 "체험단을 통해 무료로 제공받아 작성한 리뷰입니다" 문구를 포함해 주세요.</p><p>&nbsp;</p><p>공정한 거래를 위해 협조 부탁드립니다.</p>`,

    "17": `<p>안녕하세요, 리뷰X입니다.</p><p>&nbsp;</p><p>송장 일괄 업로드 기능이 추가되었습니다.</p><p>&nbsp;</p><p><strong>기능 설명</strong></p><p>- 여러 체험단의 송장을 한 번에 업로드할 수 있습니다.</p><p>- 엑셀 파일 형식으로 일괄 업로드 가능</p><p>&nbsp;</p><p><strong>사용 방법</strong></p><p>1. 캠페인 관리 > 송장 업로드 메뉴로 이동</p><p>2. 엑셀 템플릿 다운로드</p><p>3. 송장 정보 입력 후 업로드</p><p>&nbsp;</p><p>더욱 편리한 송장 관리가 가능합니다.</p>`,

    // 자주 묻는 질문
    "8": `<p>체험단 구독을 중지하면 모든 서비스 활용이 불가능합니다.</p><p>&nbsp;</p><p><strong>구독 중지 시 제한 사항</strong></p><p>- 체험단 등록 불가</p><p>- 체험단 관리 기능 사용 불가</p><p>- 기존 체험단 데이터 조회 제한</p><p>&nbsp;</p><p>서비스를 계속 이용하시려면 구독을 유지해 주시기 바랍니다.</p>`,

    "9": `<p>인플루언서 신청 시 신청사유를 추가로 작성해 주시면 선정 시 참고 자료로 활용됩니다.</p><p>&nbsp;</p><p><strong>신청사유 작성 팁</strong></p><p>- 해당 제품/서비스에 대한 관심도와 경험을 구체적으로 작성</p><p>- 콘텐츠 제작 계획 및 아이디어 포함</p><p>- 기존 리뷰 경험 및 성과 간단히 소개</p><p>&nbsp;</p><p>신청사유가 구체적일수록 선정 확률이 높아집니다.</p>`,

    "11": `<p>스타일씨 공식 홈페이지에 나오는 체험단 필터링이 리뉴얼되었습니다.</p><p>&nbsp;</p><p><strong>리뉴얼 내용</strong></p><p>- 카테고리별 필터링 기능 개선</p><p>- 검색 기능 강화</p><p>- 체험단 목록 UI 개선</p><p>&nbsp;</p><p>더욱 편리하게 원하는 체험단을 찾을 수 있습니다.</p>`,

    "14": `<p>블로그 리뷰 콘텐츠에 스폰서 배너 표시 지침이 변경되었습니다.</p><p>&nbsp;</p><p><strong>변경 사항</strong></p><p>- 스폰서 배너는 리뷰 상단에 명확하게 표시해야 합니다.</p><p>- 배너 크기 및 위치에 대한 가이드라인이 업데이트되었습니다.</p><p>&nbsp;</p><p><strong>주의사항</strong></p><p>- 스폰서 배너 미표시 시 페널티가 부과될 수 있습니다.</p><p>- 자세한 가이드라인은 공지사항을 참고해 주세요.</p>`,

    "15": `<p>체험단 등록 시 불러오기 기능이 추가되었습니다.</p><p>&nbsp;</p><p><strong>불러오기 기능이란?</strong></p><p>- 이전에 등록한 체험단 정보를 불러와서 재사용할 수 있는 기능입니다.</p><p>- 유사한 체험단을 등록할 때 시간을 절약할 수 있습니다.</p><p>&nbsp;</p><p><strong>사용 방법</strong></p><p>1. 체험단 등록 페이지에서 "불러오기" 버튼 클릭</p><p>2. 이전에 등록한 체험단 목록에서 선택</p><p>3. 필요한 정보만 수정하여 등록</p><p>&nbsp;</p><p>더욱 편리한 체험단 등록이 가능합니다.</p>`,

    // 이벤트
    "12": `<p>안녕하세요, 리뷰X입니다.</p><p>&nbsp;</p><p>인스타릴스(영상) 공식 오픈을 알려드립니다.</p><p>&nbsp;</p><p><strong>인스타릴스 체험단</strong></p><p>- 인스타그램 릴스 형식의 영상 콘텐츠를 제작하는 체험단입니다.</p><p>- 영상 길이: 15초 ~ 60초</p><p>- 제품 소개 및 체험 후기를 영상으로 제작</p><p>&nbsp;</p><p><strong>참여 방법</strong></p><p>1. 인스타릴스 체험단 메뉴에서 원하는 체험단 선택</p><p>2. 신청 및 선정 대기</p><p>3. 제품 수령 후 릴스 영상 제작 및 업로드</p><p>&nbsp;</p><p>많은 참여 부탁드립니다!</p>`,
  };

  // 게시글 ID에 해당하는 내용이 있으면 사용하고, 없으면 기본 내용 반환
  const content =
    post_contents[id] || `<p>${post.title}에 대한 내용입니다.</p>`;

  return {
    ...post,
    content: content,
    updated_date: post.registered_date.split(" ")[0], // 등록일을 수정일로 사용
  };
};
