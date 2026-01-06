/* ========================================
   📝 GA 관리자 카테고리 목록 목업 데이터
   ======================================== */

/**
 * GA 관리자 카테고리 목록 목업 데이터
 *
 * 목적: GA 관리자 카테고리 관리 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/community/categories (카테고리 관리 페이지)
 * - /manager_sa/community/categories (카테고리 관리 페이지)
 *
 * 주요 기능:
 * - 카테고리 목록 데이터
 *
 */

// 게시글 구분 타입 정의 (공지사항, 자주 묻는 질문, 이벤트)
export type CategoryDivision = "공지사항" | "자주 묻는 질문" | "이벤트";

// 카테고리 아이템 타입 정의
export interface CategoryItem {
  id: string; // 카테고리 ID
  number: string; // 번호 (예: 000001)
  division: CategoryDivision; // 구분 (공지사항/자주 묻는 질문/이벤트)
  category_name: string; // 카테고리명
}

// 카테고리 목록 데이터
// 학습 포인트: let으로 선언하여 배열을 수정할 수 있도록 합니다
// 실제 프로덕션에서는 API를 통해 데이터를 관리하지만, 현재는 목업 데이터를 사용합니다
export let categories_data: CategoryItem[] = [
  {
    id: "1",
    number: "000001",
    division: "공지사항",
    category_name: "이벤트",
  },
  {
    id: "2",
    number: "000001",
    division: "공지사항",
    category_name: "공지사항",
  },
  {
    id: "10",
    number: "000001",
    division: "공지사항",
    category_name: "중요",
  },
  {
    id: "3",
    number: "000001",
    division: "자주 묻는 질문",
    category_name: "캠페인",
  },
  {
    id: "4",
    number: "000001",
    division: "자주 묻는 질문",
    category_name: "기타",
  },
  {
    id: "5",
    number: "000001",
    division: "자주 묻는 질문",
    category_name: "포인트",
  },
  {
    id: "6",
    number: "000022",
    division: "자주 묻는 질문",
    category_name: "취소/환불",
  },
  {
    id: "7",
    number: "000001",
    division: "자주 묻는 질문",
    category_name: "회원가입/로그인",
  },
  {
    id: "8",
    number: "000001",
    division: "자주 묻는 질문",
    category_name: "교환/반품",
  },
  {
    id: "9",
    number: "000001",
    division: "자주 묻는 질문",
    category_name: "주문/배송",
  },
];

/**
 * 카테고리 등록 함수
 *
 * 목적: 목업 데이터에 새로운 카테고리를 추가합니다.
 *
 * @param division - 구분 (공지사항/자주 묻는 질문/이벤트)
 * @param category_name - 카테고리명
 *
 * 학습 포인트:
 * - push(): 배열의 끝에 새로운 요소를 추가합니다
 * - Math.max(): 여러 숫자 중 최대값을 반환합니다
 * - padStart(): 문자열의 앞쪽을 특정 문자로 채웁니다
 */
export function add_category(
  division: CategoryDivision,
  category_name: string
): void {
  // 새로운 ID 생성
  // 기존 카테고리들의 ID를 숫자로 변환하여 최대값을 찾습니다
  // 학습 포인트: map()은 배열의 각 요소를 변환하여 새로운 배열을 만듭니다
  // Number(): 문자열을 숫자로 변환합니다
  // Math.max(): 여러 숫자 중 최대값을 반환합니다
  // ... (스프레드 연산자): 배열을 개별 요소로 펼칩니다
  const max_id = Math.max(
    ...categories_data.map((item) => Number(item.id)),
    0
  );
  // 새로운 ID는 최대값 + 1
  const new_id = String(max_id + 1);

  // 새로운 번호 생성
  // 기존 카테고리들의 번호를 숫자로 변환하여 최대값을 찾습니다
  const max_number = Math.max(
    ...categories_data.map((item) => Number(item.number)),
    0
  );
  // 새로운 번호는 최대값 + 1을 6자리 문자열로 변환합니다
  // padStart(6, "0"): 문자열이 6자리가 되도록 앞쪽을 "0"으로 채웁니다
  // 예: 1 -> "000001", 22 -> "000022"
  const new_number = String(max_number + 1).padStart(6, "0");

  // 새로운 카테고리 객체 생성
  const new_category: CategoryItem = {
    id: new_id,
    number: new_number,
    division: division,
    category_name: category_name.trim(),
  };

  // 배열에 새로운 카테고리 추가
  // push(): 배열의 끝에 새로운 요소를 추가합니다
  // 학습 포인트: 이렇게 하면 categories_data 배열에 새로운 카테고리가 추가됩니다
  categories_data.push(new_category);
}

/**
 * 카테고리 수정 함수
 *
 * 목적: 목업 데이터에서 카테고리를 수정합니다.
 *
 * @param category_id - 수정할 카테고리의 ID
 * @param division - 새로운 구분
 * @param category_name - 새로운 카테고리명
 *
 * 학습 포인트:
 * - findIndex(): 배열에서 조건에 맞는 요소의 인덱스를 찾습니다
 * - 배열의 특정 요소를 직접 수정할 수 있습니다
 */
export function update_category(
  category_id: string,
  division: CategoryDivision,
  category_name: string
): void {
  // findIndex(): 배열에서 조건에 맞는 요소의 인덱스를 찾습니다
  // -1을 반환하면 해당 요소를 찾지 못한 것입니다
  const index = categories_data.findIndex((item) => item.id === category_id);

  if (index !== -1) {
    // 배열의 특정 인덱스에 있는 객체를 수정합니다
    // 학습 포인트: 배열의 요소는 객체이므로 직접 수정할 수 있습니다
    categories_data[index].division = division;
    categories_data[index].category_name = category_name;
  }
}

/**
 * 카테고리 삭제 함수
 *
 * 목적: 목업 데이터에서 선택된 카테고리들을 삭제합니다.
 *
 * @param category_ids - 삭제할 카테고리 ID 목록
 *
 * 학습 포인트:
 * - filter(): 배열에서 조건에 맞는 요소만 남긴 새로운 배열을 반환합니다
 * - 배열에서 특정 요소들을 제거할 때 filter를 사용합니다
 */
export function delete_categories(category_ids: string[]): void {
  // filter(): 배열에서 조건에 맞는 요소만 남긴 새로운 배열을 반환합니다
  // 학습 포인트: category_ids에 포함되지 않은 카테고리만 남깁니다
  // includes(): 배열에 특정 값이 포함되어 있는지 확인합니다
  categories_data = categories_data.filter(
    (item) => !category_ids.includes(item.id)
  );
}
