/* ========================================
   🪟 Modal 관련 공통 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 모달 컴포넌트 관련 공통 타입 정의
 * - 확인/취소 모달, 알림 모달, 커스텀 모달 등 다양한 모달 타입 지원
 *
 * 📌 사용 위치:
 * - 캠페인 신청 모달
 * - 삭제 확인 모달
 * - 이미지 미리보기 모달
 * - 필터 선택 모달
 */

/**
 * 모달 크기
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * 모달 타입
 */
export type ModalType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

/**
 * 모달 기본 Props
 */
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

/**
 * 확인/취소 모달 Props
 */
export interface ConfirmModalProps extends BaseModalProps {
  type?: ModalType;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
}

/**
 * 알림 모달 Props
 */
export interface AlertModalProps extends BaseModalProps {
  type?: ModalType;
  message: string;
  confirmLabel?: string;
  onConfirm?: () => void;
}

/**
 * 폼 모달 Props
 */
export interface FormModalProps extends BaseModalProps {
  onSubmit: (data: any) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

/**
 * 이미지 미리보기 모달 Props
 */
export interface ImagePreviewModalProps extends BaseModalProps {
  imageUrl: string;
  alt?: string;
  caption?: string;
}

/**
 * 필터 모달 Props
 */
export interface FilterModalProps extends BaseModalProps {
  options: FilterOption[];
  selectedValue?: string | string[];
  multiSelect?: boolean;
  onApply: (selected: string | string[]) => void;
  onReset?: () => void;
}

/**
 * 필터 옵션
 */
export interface FilterOption {
  label: string;
  value: string;
  count?: number;
  disabled?: boolean;
}

/**
 * 모달 버튼
 */
export interface ModalButton {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * 커스텀 모달 Props
 */
export interface CustomModalProps extends BaseModalProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  buttons?: ModalButton[];
}

/**
 * 모달 상태 관리
 */
export interface ModalState {
  isOpen: boolean;
  data?: any;
}

/**
 * 모달 훅 반환값
 */
export interface UseModalReturn {
  isOpen: boolean;
  data?: any;
  open: (data?: any) => void;
  close: () => void;
  toggle: () => void;
}

/**
 * 드로어 Props (측면 모달)
 */
export interface DrawerProps extends BaseModalProps {
  position?: 'left' | 'right' | 'top' | 'bottom';
  children: React.ReactNode;
}

/**
 * 바텀시트 Props (모바일용)
 */
export interface BottomSheetProps extends BaseModalProps {
  snapPoints?: number[]; // 예: [0.3, 0.6, 0.9]
  initialSnapPoint?: number;
  children: React.ReactNode;
}
