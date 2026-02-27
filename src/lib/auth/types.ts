/* ========================================
   인증 내부 타입 정의
   ======================================== */

/**
 * auth/types
 *
 * 목적: LocalStorage 계정 데이터 파싱에 사용하는 공통 인터페이스 정의
 *
 * 사용 페이지:
 * - src/lib/auth/, src/hooks/, src/components/, src/app/ 전역
 */

export interface StoredUserAccount {
  id?: string | number;
  number?: string;
  email?: string;
  name?: string;
  nickname?: string;
  phone?: string;
  address?: string;
  detail_address?: string;
  postal_code?: string;
  address_details?: {
    address?: string;
    detailAddress?: string;
    postalCode?: string;
  };
  profile_image?: string | null;
  gender?: string;
  age?: number;
  withdrawn_points?: number;
  last_access_date?: string;
  join_date?: string;
  channels?: string[];
  channel_details?: StoredChannelDetail[];
  grade?: string;
  user_type?: string;
  member_type?: string;
  daily_visits?: number | string;
  total_visits?: number | string;
  neighbors?: number | string;
  available_points?: number;
  pending_points?: number;
  current_points?: number;
  account_holder?: string | null;
  bank?: string | null;
  account_number?: string | null;
  ssn_front?: string;
  ssn_back?: string;
  [key: string]: unknown;
}

export interface StoredPartnerAccount {
  id?: string;
  email?: string;
  name?: string;
  representative_name?: string;
  phone?: string;
  business_name?: string;
  business_number?: string;
  approval_status?: string;
  address?: string;
  detail_address?: string;
  postal_code?: string;
  contact_phone?: string;
  business_type?: string;
  [key: string]: unknown;
}

export interface StoredChannelDetail {
  name: string;
  url?: string;
  status?: string;
  daily_visits?: number;
  total_visits?: number;
  neighbors?: number;
  followers?: number;
  subscribers?: number;
  [key: string]: unknown;
}
