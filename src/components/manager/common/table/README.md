# 범용 테이블 컴포넌트 (CommonTable)

## 개요

`CommonTable`은 여러 테이블 컴포넌트에서 공통으로 사용되는 테이블 구조를 제공하는 범용 컴포넌트입니다. Render Props 패턴을 사용하여 각 테이블의 특수한 요구사항을 유연하게 처리할 수 있습니다.

## 주요 기능

- ✅ 테이블 헤더와 바디 구조 자동 제공
- ✅ 커스텀 셀 렌더링 (Render Props 패턴)
- ✅ 체크박스 선택 기능 (선택사항)
- ✅ 호버 기능 (선택사항)
- ✅ 정렬 아이콘 표시 (선택사항)
- ✅ 빈 상태 메시지 표시
- ✅ 제네릭 타입 지원으로 타입 안정성 확보

## 사용 방법

### 기본 사용법

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

### 체크박스 기능 사용

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

### 호버 기능 사용

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

### 커스텀 셀 렌더링 (태그, 버튼 등)

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

### 커스텀 헤더 렌더링

```tsx
<CommonTable
  columns={columns}
  data={table_data}
  render_cell={(row, column) => <span>{row[column.key]}</span>}
  styles={my_table_styles}
  render_header={() => (
    <div className={styles.custom_header}>{/* 커스텀 헤더 내용 */}</div>
  )}
/>
```

### 커스텀 행 래퍼 사용

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

### 툴팁 기능이 필요한 경우

툴팁 기능이 필요한 경우 `CommonTableWithTooltip` 컴포넌트를 사용하세요. 이 컴포넌트는 `CommonTable`을 래핑하여 자동으로 텍스트 오버플로우를 감지하고 툴팁을 표시합니다.

```tsx
import CommonTableWithTooltip, {
  type TooltipConfig,
} from "@/components/manager/common/table/CommonTableWithTooltip";

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

## Props 상세 설명

### 필수 Props

- `columns`: 테이블 컬럼 정의 배열
- `data`: 테이블 데이터 배열 (각 항목은 `id` 필드를 가져야 함)
- `render_cell`: 각 셀을 렌더링하는 함수 `(row, column, index) => ReactNode`
- `styles`: CSS 모듈 스타일 객체

### 선택 Props

- `enable_checkbox`: 체크박스 활성화 여부 (기본값: `false`)
- `empty_message`: 데이터가 없을 때 표시할 메시지 (기본값: `"데이터가 없습니다."`)
- `container_class_name`: 컨테이너 추가 CSS 클래스명
- `header_class_name`: 헤더 추가 CSS 클래스명
- `body_class_name`: 바디 추가 CSS 클래스명
- `row_class_name`: 행 추가 CSS 클래스명

### 체크박스 관련 Props

- `selected_ids`: 선택된 행 ID 배열
- `on_select_change`: 선택 상태 변경 핸들러 `(selected_ids: string[]) => void`
- `on_select_all`: 전체 선택/해제 핸들러 `(is_all_selected: boolean) => void`

### 호버 기능 관련 Props

- `enable_hover`: 호버 효과 활성화 여부 (기본값: `false`)
- `on_row_hover`: 행 호버 이벤트 핸들러 `(row_id: string | null) => void`

### 커스텀 렌더링 Props

- `render_header`: 커스텀 헤더 렌더링 함수 `() => ReactNode`
- `render_row_wrapper`: 커스텀 행 래퍼 렌더링 함수 `(row, row_content, index) => ReactNode`
  - 주의: 툴팁 기능이 필요한 경우 `CommonTableWithTooltip` 컴포넌트를 사용하세요

## CSS 클래스 요구사항

범용 테이블 컴포넌트가 올바르게 작동하려면 CSS 모듈에 다음 클래스들이 정의되어 있어야 합니다:

### 필수 클래스

- `table_container` 또는 `table_section`: 테이블 컨테이너
- `table_header`: 테이블 헤더
- `table_header_cell`: 헤더 셀
- `table_body`: 테이블 바디
- `table_row`: 테이블 행
- `table_cell`: 테이블 셀

### 선택 클래스 (기능 사용 시 필요)

- `table_cell_checkbox`: 체크박스 셀 (체크박스 사용 시)
- `checkbox`: 체크박스 입력 요소 (체크박스 사용 시)
- `table_header_arrow` 또는 `sort_icon`: 정렬 아이콘 (정렬 사용 시)
- `empty_message`: 빈 상태 메시지

## 관련 컴포넌트

### CommonTableWithTooltip

툴팁 기능이 필요한 경우 `CommonTableWithTooltip` 컴포넌트를 사용하세요. 이 컴포넌트는 `CommonTable`을 래핑하여 자동으로 텍스트 오버플로우를 감지하고 툴팁을 표시합니다.

- 자동 텍스트 오버플로우 감지
- 툴팁 위치 자동 계산
- `CommonTable`의 모든 기능 포함

자세한 내용은 `CommonTableWithTooltip.tsx` 파일을 참고하세요.

## 학습 포인트

1. **Render Props 패턴**: 컴포넌트가 렌더링 로직을 함수로 받아서 재사용성을 높이는 패턴
2. **제네릭 타입**: `<T>`를 사용하여 다양한 데이터 타입을 지원
3. **조건부 렌더링**: 옵션 기능들을 props로 제어
4. **컴포지션**: 여러 작은 기능들을 조합하여 복잡한 컴포넌트 만들기
5. **컴포넌트 분리**: 기본 기능과 확장 기능을 분리하여 유지보수성 향상 (CommonTable vs CommonTableWithTooltip)
