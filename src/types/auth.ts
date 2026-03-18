/**
 * 인증 관련 타입 정의
 */

export type UserRole = "user" | "partner" | "manager_ga" | "manager_sa";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  nickname?: string; // 닉네임 (리뷰어 전용, name과 별도로 관리)
  role: UserRole;
  status?: "ACTIVE" | "BLOCKED" | "BANNED";
  // 리뷰어 전용 필드
  grade?: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  channels?: Array<{
    platform: string;
    url: string;
    followers: number;
  }>;
  profile_image?: string; // 프로필 이미지 (리뷰어 전용)
  phone?: string;
  address?: string;
  detail_address?: string;
  postal_code?: string;
  // 파트너 전용 필드
  business_name?: string;
  business_number?: string;
  approval_status?: "pending" | "approved" | "rejected";
  representative_name?: string;
  contact_phone?: string;
  business_type?: string;
  // 관리자 전용 필드
  admin_level?: "GA" | "SA";
  permissions?: string[];
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
}
