/* ========================================
   📊 Table 관련 공통 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 테이블 컴포넌트, 정렬, 페이지네이션 등 테이블 관련 공통 타입 정의
 * - 관리자 페이지와 일반 사용자 페이지의 테이블에서 재사용
 *
 * 📌 사용 위치:
 * - 캠페인 목록 테이블
 * - 신청자 목록 테이블
 * - 포인트 내역 테이블
 * - 관리자 회원 관리 테이블
 */

/**
 * 정렬 방향
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 정렬 옵션
 */
export interface SortOption {
  field: string;
  direction: SortDirection;
}

/**
 * 테이블 컬럼 정의
 */
export interface TableColumn<T = any> {
  key: string;
  label: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
}

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
}

/**
 * 페이지네이션 Props
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalCount?: number;
}

/**
 * 테이블 필터
 */
export interface TableFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

/**
 * 테이블 액션 버튼
 */
export interface TableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean | ((row: T) => boolean);
  visible?: boolean | ((row: T) => boolean);
}

/**
 * 테이블 Props
 */
export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  sortOption?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  actions?: TableAction<T>[];
  rowKey?: keyof T | ((row: T) => string | number);
  onRowClick?: (row: T) => void;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

/**
 * 테이블 상태
 */
export interface TableState {
  sort?: SortOption;
  filters: TableFilter[];
  pagination: {
    page: number;
    pageSize: number;
  };
  selectedRows: (string | number)[];
}

/**
 * 빈 상태 Props
 */
export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 로딩 상태 Props
 */
export interface LoadingStateProps {
  rows?: number;
  columns?: number;
}

/**
 * 테이블 검색 옵션
 */
export interface TableSearchOption {
  field: string;
  label: string;
  placeholder?: string;
}

/**
 * 테이블 검색 Props
 */
export interface TableSearchProps {
  searchOptions: TableSearchOption[];
  onSearch: (field: string, value: string) => void;
  placeholder?: string;
}
