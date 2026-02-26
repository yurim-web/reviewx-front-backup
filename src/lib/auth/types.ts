/* ========================================
   인증 내부 타입 정의
   ======================================== */

/**
 * auth/types
 *
 * 목적: LocalStorage 계정 데이터 파싱에 사용하는 내부 인터페이스 정의
 *
 * 사용 페이지:
 * - src/lib/auth/ (auth 하위 모듈 전용)
 */

export interface StoredUserAccount {
  id?: string;
  email?: string;
  name?: string;
  nickname?: string;
  phone?: string;
  address?: string;
  detail_address?: string;
  postal_code?: string;
  profile_image?: string;
  channels?: string[];
  channel_details?: StoredChannelDetail[];
  grade?: string;
  daily_visits?: number;
  total_visits?: number;
  neighbors?: number;
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
