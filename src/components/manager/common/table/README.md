# 범용 테이블 컴포넌트 라이브러리

## 개요

이 디렉토리는 여러 테이블 컴포넌트에서 공통으로 사용되는 테이블 관련 컴포넌트들을 포함합니다. Render Props 패턴과 컴포지션 패턴을 사용하여 각 테이블의 특수한 요구사항을 유연하게 처리할 수 있습니다.

## 구성 컴포넌트

1. **CommonTable** - 기본 범용 테이블 컴포넌트
2. **CommonTableWithTooltip** - 툴팁 기능이 포함된 범용 테이블 컴포넌트
3. **EmptyTableState** - 빈 테이블 상태 메시지 컴포넌트
4. **SortableTableHeader** - 정렬 가능한 테이블 헤더 컴포넌트

---

## 1. CommonTable

### 개요

`CommonTable`은 여러 테이블 컴포넌트에서 공통으로 사용되는 테이블 구조를 제공하는 범용 컴포넌트입니다. Render Props 패턴을 사용하여 각 테이블의 특수한 요구사항을 유연하게 처리할 수 있습니다.

### 주요 기능

- ✅ 테이블 헤더와 바디 구조 자동 제공
- ✅ 커스텀 셀 렌더링 (Render Props 패턴)
- ✅ 체크박스 선택 기능 (선택사항)
- ✅ 호버 기능 (선택사항)
- ✅ 정렬 아이콘 표시 (선택사항)
- ✅ 빈 상태 메시지 표시 (EmptyTableState 사용)
- ✅ 제네릭 타입 지원으로 타입 안정성 확보

### 📍 사용 위치

#### 직접 사용 컴포넌트

- **CampaignTable** (캠페인 진행 상황 테이블)

  - 파일: `src/components/manager/common/campaign/progress/table/CampaignTable.tsx`
  - 사용 페이지:
    - `/manager_ga/campaign/progress` (GA 관리자 진행 현황 페이지)
    - `/manager_sa/campaign/progress` (SA 관리자 진행 현황 페이지)

- **PostTable** (게시글 목록 테이블)

  - 파일: `src/components/manager/common/community/posts/section/PostTable.tsx`
  - 사용 페이지:
    - `/manager_ga/community/posts` (GA 관리자 게시글 목록 페이지)
    - `/manager_sa/community/posts` (SA 관리자 게시글 목록 페이지)

- **BlacklistTable** (차단 내역 테이블)

  - 파일: `src/components/manager/common/member/blacklist/BlacklistTable.tsx`
  - 사용 페이지:
    - `/manager_ga/member/blacklist` (GA 관리자 차단 내역 페이지)
    - `/manager_sa/member/blacklist` (SA 관리자 차단 내역 페이지)

- **CategoryTable** (카테고리 테이블)

  - 파일: `src/components/manager/common/community/categories/section/CategoryTable.tsx`
  - 사용 페이지:
    - `/manager_ga/community/categories` (GA 관리자 카테고리 페이지)
    - `/manager_sa/community/categories` (SA 관리자 카테고리 페이지)

- **PaymentHistoryTable** (결제 내역 테이블)

  - 파일: `src/components/manager/sa/settlement/payment_history/section/PaymentHistoryTable.tsx`
  - 사용 페이지:
    - `/manager_sa/settlement/payment_history` (SA 관리자 결제 내역 페이지)

- **WithdrawalTable** (출금 현황 테이블)

  - 파일: `src/components/manager/sa/settlement/withdrawal/section/WithdrawalTable.tsx`
  - 사용 페이지:
    - `/manager_sa/settlement/withdrawal` (SA 관리자 출금 현황 페이지)

- **RequestTable** (출금 요청 테이블)

  - 파일: `src/components/manager/sa/settlement/withdrawal_request/section/RequestTable.tsx`
  - 사용 페이지:
    - `/manager_sa/settlement/withdrawal_request` (SA 관리자 출금 요청 페이지)

- **AdminTable** (관리자 테이블)
  - 파일: `src/components/manager/sa/member/admins/section/AdminTable.tsx`
  - 사용 페이지:
    - `/manager_sa/member/admins` (SA 관리자 관리자 목록 페이지)

#### CommonTableWithTooltip을 통해 간접 사용

- **RejectedCampaignTable** (반려 내역 캠페인 테이블)

  - 파일: `src/components/manager/ga/campaign/rejected/section/RejectedCampaignTable.tsx`
  - 사용 페이지:
    - `/manager_ga/campaign/rejected` (GA 관리자 반려 내역 페이지)
  - 참고: CommonTableWithTooltip 컴포넌트를 통해 사용됨

- **ReportedCampaignTable** (신고 내역 캠페인 테이블)
  - 파일: `src/components/manager/ga/campaign/reported/section/ReportedCampaignTable.tsx`
  - 사용 페이지:
    - `/manager_ga/campaign/reported` (GA 관리자 신고 내역 페이지)
  - 참고: CommonTableWithTooltip 컴포넌트를 통해 사용됨

#### 타입만 사용 (TableColumn, TableRowData)

- **ReviewerTable** (리뷰어 목록 테이블)

  - 파일: `src/components/manager/common/member/table/ReviewerTable.tsx`
  - 사용 페이지:
    - `/manager_ga/member/reviewers` (GA 관리자 리뷰어 목록 페이지)
    - `/manager_sa/member/reviewers` (SA 관리자 리뷰어 목록 페이지)
  - 참고: CommonTable 직접 사용하지 않음, 독립적인 테이블 구조 사용 (TableColumn 타입만 사용)

- **PartnerTable** (파트너 목록 테이블)
  - 파일: `src/components/manager/common/member/table/PartnerTable.tsx`
  - 사용 페이지:
    - `/manager_ga/member/partners` (GA 관리자 파트너 목록 페이지)
    - `/manager_sa/member/partners` (SA 관리자 파트너 목록 페이지)
  - 참고: CommonTable 직접 사용하지 않음, 독립적인 테이블 구조 사용 (TableColumn 타입만 사용)

### 사용 방법

#### 기본 사용법

```tsx
import CommonTable, {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";

// 1. 테이블 행 데이터 타입 정의
interface MyTableData extends TableRowData {
  id: string;
  name: string;
  age: number;
  email: string;
}

// 2. 컬럼 정의
const columns: TableColumn[] = [
  { key: "name", label: "이름", sortable: true },
  { key: "age", label: "나이", sortable: true },
  { key: "email", label: "이메일" },
];

// 3. 테이블 데이터
const table_data: MyTableData[] = [
  { id: "1", name: "홍길동", age: 25, email: "hong@example.com" },
  { id: "2", name: "김철수", age: 30, email: "kim@example.com" },
];

// 4. 컴포넌트 사용
<CommonTable
  columns={columns}
  data={table_data}
  render_cell={(row, column) => {
    // 각 셀을 렌더링하는 함수
    return <span>{row[column.key]}</span>;
  }}
  styles={my_table_styles}
  empty_message="데이터가 없습니다."
/>;
```

#### 체크박스 기능 사용

```tsx
const [selected_ids, set_selected_ids] = useState<string[]>([]);

<CommonTable
  columns={columns}
  data={table_data}
  render_cell={(row, column) => <span>{row[column.key]}</span>}
  styles={my_table_styles}
  enable_checkbox={true}
  selected_ids={selected_ids}
  on_select_change={set_selected_ids}
  on_select_all={(is_all_selected) => {
    console.log("전체 선택:", is_all_selected);
  }}
/>;
```

#### 호버 기능 사용

```tsx
<CommonTable
  columns={columns}
  data={table_data}
  render_cell={(row, column) => <span>{row[column.key]}</span>}
  styles={my_table_styles}
  enable_hover={true}
  on_row_hover={(row_id) => {
    console.log("호버된 행:", row_id);
  }}
/>
```

#### 커스텀 셀 렌더링 (태그, 버튼 등)

```tsx
<CommonTable
  columns={columns}
  data={table_data}
  render_cell={(row, column) => {
    if (column.key === "status") {
      // 상태 태그 렌더링
      return (
        <span className={`${styles.tag} ${styles[`tag_${row.status}`]}`}>
          {row.status}
        </span>
      );
    }

    if (column.key === "action") {
      // 액션 버튼 렌더링
      return <button onClick={() => handle_action(row.id)}>액션</button>;
    }

    // 기본 텍스트 렌더링
    return <span>{row[column.key]}</span>;
  }}
  styles={my_table_styles}
/>
```

#### 커스텀 헤더 렌더링 (SortableTableHeader 사용)

```tsx
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";

// 커스텀 헤더 렌더링 함수
const render_table_header = () => {
  return (
    <SortableTableHeader
      columns={columns}
      sort_state={sort_state}
      handle_sort={handle_sort}
      handle_select_all={handle_select_all}
      is_all_selected={is_all_selected}
      styles={my_table_styles}
    />
  );
};

<CommonTable
  columns={columns}
  data={table_data}
  render_cell={(row, column) => <span>{row[column.key]}</span>}
  styles={my_table_styles}
  render_header={render_table_header}
/>;
```

#### 커스텀 행 래퍼 사용

```tsx
<CommonTable
  columns={columns}
  data={table_data}
  render_cell={(row, column) => <span>{row[column.key]}</span>}
  styles={my_table_styles}
  render_row_wrapper={(row, row_content, index) => (
    <div className={styles.row_wrapper}>
      {row_content}
      {/* 추가 요소 (툴팁이 필요한 경우 CommonTableWithTooltip 사용 권장) */}
    </div>
  )}
/>
```

### Props 상세 설명

#### 필수 Props

- `columns`: 테이블 컬럼 정의 배열 (`TableColumn[]`)
- `data`: 테이블 데이터 배열 (각 항목은 `id` 필드를 가져야 함, `TableRowData`를 확장)
- `render_cell`: 각 셀을 렌더링하는 함수 `(row, column, index) => ReactNode`
- `styles`: CSS 모듈 스타일 객체

#### 선택 Props

- `enable_checkbox`: 체크박스 활성화 여부 (기본값: `false`)
- `empty_message`: 데이터가 없을 때 표시할 메시지 (기본값: `"데이터가 없습니다."`)
- `container_class_name`: 컨테이너 추가 CSS 클래스명
- `header_class_name`: 헤더 추가 CSS 클래스명
- `body_class_name`: 바디 추가 CSS 클래스명
- `row_class_name`: 행 추가 CSS 클래스명

#### 체크박스 관련 Props

- `selected_ids`: 선택된 행 ID 배열 (`string[]`)
- `on_select_change`: 선택 상태 변경 핸들러 `(selected_ids: string[]) => void`
- `on_select_all`: 전체 선택/해제 핸들러 `(is_all_selected: boolean) => void`

#### 호버 기능 관련 Props

- `enable_hover`: 호버 효과 활성화 여부 (기본값: `false`)
- `on_row_hover`: 행 호버 이벤트 핸들러 `(row_id: string | null) => void`

#### 커스텀 렌더링 Props

- `render_header`: 커스텀 헤더 렌더링 함수 `() => ReactNode`
  - SortableTableHeader를 사용하여 정렬 기능이 포함된 헤더를 렌더링할 수 있습니다
- `render_row_wrapper`: 커스텀 행 래퍼 렌더링 함수 `(row, row_content, index) => ReactNode`
  - 주의: 툴팁 기능이 필요한 경우 `CommonTableWithTooltip` 컴포넌트를 사용하세요

### CSS 클래스 요구사항

범용 테이블 컴포넌트가 올바르게 작동하려면 CSS 모듈에 다음 클래스들이 정의되어 있어야 합니다:

#### 필수 클래스

- `table_container` 또는 `table_section`: 테이블 컨테이너
- `table_header`: 테이블 헤더
- `table_header_cell`: 헤더 셀
- `table_body`: 테이블 바디
- `table_row`: 테이블 행
- `table_cell`: 테이블 셀

#### 선택 클래스 (기능 사용 시 필요)

- `table_cell_checkbox`: 체크박스 셀 (체크박스 사용 시)
- `checkbox`: 체크박스 입력 요소 (체크박스 사용 시)
- `table_header_arrow` 또는 `sort_icon`: 정렬 아이콘 (정렬 사용 시)

---

## 2. CommonTableWithTooltip

### 개요

`CommonTableWithTooltip`은 툴팁 기능이 필요한 테이블 컴포넌트에서 사용하는 범용 테이블 컴포넌트입니다. `CommonTable`을 래핑하여 자동으로 텍스트 오버플로우를 감지하고 툴팁을 표시합니다.

### 주요 기능

- ✅ CommonTable의 모든 기능 포함
- ✅ 텍스트 오버플로우 자동 감지
- ✅ 툴팁 자동 표시 (텍스트가 잘린 경우에만)
- ✅ 툴팁 위치 자동 계산
- ✅ 커스텀 툴팁 내용 지원

### 📍 사용 위치

- **RejectedCampaignTable** (반려 내역 캠페인 테이블)

  - 파일: `src/components/manager/ga/campaign/rejected/section/RejectedCampaignTable.tsx`
  - 사용 페이지:
    - `/manager_ga/campaign/rejected` (GA 관리자 반려 내역 페이지)
  - 사용 이유: 캠페인명이 길어서 잘릴 수 있어 툴팁 필요

- **ReportedCampaignTable** (신고 내역 캠페인 테이블)
  - 파일: `src/components/manager/ga/campaign/reported/section/ReportedCampaignTable.tsx`
  - 사용 페이지:
    - `/manager_ga/campaign/reported` (GA 관리자 신고 내역 페이지)
  - 사용 이유: 캠페인명이 길어서 잘릴 수 있어 툴팁 필요

### 사용 방법

```tsx
import CommonTableWithTooltip, {
  type TooltipConfig,
} from "@/components/manager/common/table/CommonTableWithTooltip";

// 툴팁 설정
const tooltip_config: TooltipConfig = {
  column_key: "campaign_name", // 툴팁을 표시할 컬럼 키
  tooltip_content: (row) => row.campaign_name, // 커스텀 툴팁 내용 (선택사항)
  tooltip_class_name: styles.tooltip_box, // 툴팁 CSS 클래스명 (선택사항)
  text_class_name: styles.campaign_name_text, // 텍스트 span CSS 클래스명 (선택사항)
};

<CommonTableWithTooltip
  columns={columns}
  data={table_data}
  render_cell={(row, column) => <span>{row[column.key]}</span>}
  styles={my_table_styles}
  tooltip_config={tooltip_config}
/>;
```

### Props 상세 설명

`CommonTable`의 모든 props를 상속받으며, 추가로 다음 props를 제공합니다:

- `tooltip_config`: 툴팁 설정 객체 (선택사항)
  - `column_key`: 툴팁을 표시할 컬럼 키 (`string`)
  - `tooltip_content`: 커스텀 툴팁 내용 함수 (선택사항) `(row) => ReactNode`
  - `tooltip_class_name`: 툴팁 CSS 클래스명 (선택사항)
  - `text_class_name`: 텍스트 span CSS 클래스명 (선택사항)
- `on_row_wrapper_hover`: row_wrapper 호버 이벤트 핸들러 (선택사항) `(row_id: string | null) => void`

### 동작 원리

1. 지정된 컬럼의 텍스트 요소에 `onMouseEnter` 이벤트 리스너를 추가
2. 텍스트가 잘렸는지 확인 (`scrollWidth > clientWidth`)
3. 텍스트가 잘린 경우에만 툴팁 표시
4. 텍스트 셀의 위치를 기준으로 툴팁 위치 자동 계산
5. 마우스가 벗어나면 툴팁 숨김

---

## 3. EmptyTableState

### 개요

`EmptyTableState`는 테이블에 데이터가 없을 때 표시되는 빈 상태 메시지 컴포넌트입니다. 모든 테이블에서 일관된 스타일을 제공합니다.

### 주요 기능

- ✅ 일관된 빈 상태 메시지 스타일
- ✅ 그리드 레이아웃에서 전체 컬럼 영역 사용 (`grid-column: 1 / -1`)
- ✅ 커스터마이징 가능한 메시지
- ✅ 중앙 정렬된 텍스트

### 📍 사용 위치

- **CommonTable** 컴포넌트 내부에서 자동으로 사용
  - 파일: `src/components/manager/common/table/CommonTable.tsx`
  - 모든 CommonTable을 사용하는 테이블에서 데이터가 없을 때 자동으로 표시됨

#### 간접 사용 위치 (CommonTable을 통해)

- CampaignTable
- PostTable
- BlacklistTable
- CategoryTable
- PaymentHistoryTable
- WithdrawalTable
- RequestTable
- AdminTable
- RejectedCampaignTable (CommonTableWithTooltip을 통해)
- ReportedCampaignTable (CommonTableWithTooltip을 통해)

### 사용 방법

일반적으로 직접 사용하지 않고, `CommonTable`의 `empty_message` prop을 통해 사용됩니다:

```tsx
<CommonTable
  columns={columns}
  data={table_data}
  render_cell={(row, column) => <span>{row[column.key]}</span>}
  styles={my_table_styles}
  empty_message="데이터가 없습니다." // 이 메시지가 EmptyTableState로 표시됨
/>
```

### Props

- `message`: 표시할 메시지 (`string`, 필수)
- `className`: 추가 CSS 클래스명 (`string`, 선택사항)

### 스타일

- 위치: `src/components/manager/common/table/EmptyTableState.module.css`
- 주요 스타일:
  - `grid-column: 1 / -1`: 그리드 레이아웃에서 전체 컬럼 영역 사용
  - `padding: 40px`: 적절한 여백
  - `text-align: center`: 중앙 정렬
  - `color: #848484`: 회색 텍스트
  - `font-size: 16px`, `font-weight: 500`: 폰트 스타일

---

## 4. SortableTableHeader

### 개요

`SortableTableHeader`는 여러 테이블에서 공통으로 사용되는 정렬 기능이 포함된 헤더 렌더링을 제공하는 컴포넌트입니다. 정렬 상태에 따른 화살표 회전 애니메이션과 체크박스 전체 선택/해제 기능을 제공합니다.

### 주요 기능

- ✅ 정렬 가능한 컬럼에 정렬 버튼 표시
- ✅ 정렬 상태에 따른 화살표 회전 애니메이션
- ✅ 체크박스 전체 선택/해제 기능
- ✅ 커스텀 헤더 셀 스타일 지원
- ✅ `table_header_row` 사용 여부 선택 가능 (`use_header_row` prop)

### 📍 사용 위치

- **CampaignTable** (캠페인 진행 현황 테이블)

  - 파일: `src/components/manager/common/campaign/progress/table/CampaignTable.tsx`
  - 사용 페이지: `/manager_ga/campaign/progress`, `/manager_sa/campaign/progress`

- **PostTable** (게시글 목록 테이블)

  - 파일: `src/components/manager/common/community/posts/section/PostTable.tsx`
  - 사용 페이지: `/manager_ga/community/posts`, `/manager_sa/community/posts`

- **BlacklistTable** (차단 내역 테이블)

  - 파일: `src/components/manager/common/member/blacklist/BlacklistTable.tsx`
  - 사용 페이지: `/manager_ga/member/blacklist`, `/manager_sa/member/blacklist`

- **CategoryTable** (카테고리 테이블)

  - 파일: `src/components/manager/common/community/categories/section/CategoryTable.tsx`
  - 사용 페이지: `/manager_ga/community/categories`, `/manager_sa/community/categories`

- **ReviewerTable** (리뷰어 목록 테이블)

  - 파일: `src/components/manager/common/member/table/ReviewerTable.tsx`
  - 사용 페이지: `/manager_ga/member/reviewers`, `/manager_sa/member/reviewers`

- **PartnerTable** (파트너 목록 테이블)

  - 파일: `src/components/manager/common/member/table/PartnerTable.tsx`
  - 사용 페이지: `/manager_ga/member/partners`, `/manager_sa/member/partners`

- **PaymentHistoryTable** (결제 내역 테이블)

  - 파일: `src/components/manager/sa/settlement/payment_history/section/PaymentHistoryTable.tsx`
  - 사용 페이지: `/manager_sa/settlement/payment_history`

- **WithdrawalTable** (출금 현황 테이블)

  - 파일: `src/components/manager/sa/settlement/withdrawal/section/WithdrawalTable.tsx`
  - 사용 페이지: `/manager_sa/settlement/withdrawal`

- **RequestTable** (출금 요청 테이블)

  - 파일: `src/components/manager/sa/settlement/withdrawal_request/section/RequestTable.tsx`
  - 사용 페이지: `/manager_sa/settlement/withdrawal_request`

- **RejectedCampaignTable** (반려 내역 캠페인 테이블)

  - 파일: `src/components/manager/ga/campaign/rejected/section/RejectedCampaignTable.tsx`
  - 사용 페이지: `/manager_ga/campaign/rejected`

- **ReportedCampaignTable** (신고 내역 캠페인 테이블)

  - 파일: `src/components/manager/ga/campaign/reported/section/ReportedCampaignTable.tsx`
  - 사용 페이지: `/manager_ga/campaign/reported`

- **AdminTable** (관리자 테이블)
  - 파일: `src/components/manager/sa/member/admins/section/AdminTable.tsx`
  - 사용 페이지: `/manager_sa/member/admins`

### 사용 방법

#### 기본 사용법

```tsx
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { TableColumn } from "@/components/manager/common/table/CommonTable";

// 정렬 훅 사용
const { sort_state, handle_sort, sorted_data } = useTableSort({
  data: table_data,
  initial_column_key: "name",
  initial_direction: "asc",
  column_config,
});

// 컬럼 정의
const columns: TableColumn[] = [
  { key: "name", label: "이름", sortable: true },
  { key: "age", label: "나이", sortable: true },
  { key: "email", label: "이메일" }, // sortable이 없으면 정렬 버튼 표시 안 함
];

// 헤더 렌더링 함수
const render_table_header = () => {
  return (
    <SortableTableHeader
      columns={columns}
      sort_state={sort_state}
      handle_sort={handle_sort}
      handle_select_all={handle_select_all}
      is_all_selected={is_all_selected}
      styles={my_table_styles}
    />
  );
};

// CommonTable에서 사용
<CommonTable
  columns={columns}
  data={sorted_data}
  render_cell={(row, column) => <span>{row[column.key]}</span>}
  styles={my_table_styles}
  render_header={render_table_header}
/>;
```

#### table_header_row 사용하지 않는 경우

일부 테이블은 `table_header_row`를 사용하지 않고 헤더 셀을 직접 `table_header`에 배치합니다:

```tsx
<SortableTableHeader
  columns={columns}
  sort_state={sort_state}
  handle_sort={handle_sort}
  handle_select_all={handle_select_all}
  is_all_selected={is_all_selected}
  styles={my_table_styles}
  use_header_row={false} // table_header_row 사용하지 않음
/>
```

#### 커스텀 헤더 셀 렌더링

특정 컬럼에 커스텀 헤더 셀을 렌더링할 수 있습니다 (예: 빈 셀, 정렬 불가능하지만 화살표 표시):

```tsx
const render_custom_cell = (column: TableColumn) => {
  if (column.key === "channel") {
    // 채널 컬럼: 정렬 불가능하지만 화살표 아이콘만 표시
    return (
      <div className={styles.table_cell_channel}>
        <span>채널</span>
        <img
          src="/images/icons/table_arrow.svg"
          alt="정렬"
          className={styles.sort_icon}
        />
      </div>
    );
  }
  return null; // null 반환 시 기본 렌더링 사용
};

<SortableTableHeader
  columns={columns}
  sort_state={sort_state}
  handle_sort={handle_sort}
  handle_select_all={handle_select_all}
  is_all_selected={is_all_selected}
  styles={my_table_styles}
  render_custom_cell={render_custom_cell}
/>;
```

#### 커스텀 헤더 클래스

특정 컬럼에 커스텀 CSS 클래스를 추가할 수 있습니다:

```tsx
const get_custom_header_class = (column_key: string) => {
  if (column_key === "chargedPoints") {
    return styles.table_header_cell_charged_points;
  }
  return "";
};

<SortableTableHeader
  columns={columns}
  sort_state={sort_state}
  handle_sort={handle_sort}
  handle_select_all={handle_select_all}
  is_all_selected={is_all_selected}
  styles={my_table_styles}
  get_custom_header_class={get_custom_header_class}
/>;
```

### Props 상세 설명

#### 필수 Props

- `columns`: 테이블 컬럼 정의 배열 (`TableColumn[]`)
- `sort_state`: 현재 정렬 상태 (`SortState`)
- `handle_sort`: 정렬을 처리하는 함수 `(column_key: string) => void`
- `handle_select_all`: 전체 선택/해제 핸들러 `() => void`
- `is_all_selected`: 전체 선택 상태 여부 (`boolean`)
- `styles`: CSS 모듈 스타일 객체

#### 선택 Props

- `render_checkbox`: 체크박스 커스텀 렌더링 함수 (선택사항) `() => ReactNode`
- `get_custom_header_class`: 특정 컬럼에 커스텀 클래스를 추가하는 함수 (선택사항) `(column_key: string) => string`
- `render_custom_cell`: 특정 컬럼에 커스텀 헤더 셀을 렌더링하는 함수 (선택사항) `(column: TableColumn) => ReactNode | null`
- `enable_checkbox`: 체크박스 표시 여부 (기본값: `true`)
- `container_style`: 헤더 컨테이너에 적용할 인라인 스타일 (선택사항) `React.CSSProperties`
- `use_header_row`: `table_header_row` 사용 여부 (기본값: `true`)

### CSS 클래스 요구사항

- `table_header`: 테이블 헤더 컨테이너
- `table_header_row`: 헤더 행 (use_header_row가 true일 때)
- `table_cell_checkbox`: 체크박스 셀 (체크박스 사용 시)
- `checkbox`: 체크박스 입력 요소 (체크박스 사용 시)
- `table_header_cell`: 헤더 셀
- `header_text`: 헤더 텍스트 (선택사항, 일부 테이블만 사용)
- `table_header_sort_button`: 정렬 버튼 (선택사항)
- `sort_icon` 또는 `table_header_arrow`: 정렬 아이콘

### 정렬 애니메이션

정렬 상태에 따라 화살표 아이콘이 자동으로 회전합니다:

- 정렬 안 됨: 기본 방향
- 오름차순: 위쪽 방향 (180도 회전)
- 내림차순: 아래쪽 방향 (0도)
- 전환 애니메이션: `transition: transform 0.2s`

---

## 컴포넌트 관계도

```
┌─────────────────────────────────────────┐
│         테이블 컴포넌트들                │
│  (CampaignTable, PostTable, etc.)       │
└─────────────┬───────────────────────────┘
              │
              ├───> CommonTable ───> EmptyTableState
              │           │
              │           └───> render_header ───> SortableTableHeader
              │
              └───> CommonTableWithTooltip ───> CommonTable
                                │
                                └───> EmptyTableState
```
