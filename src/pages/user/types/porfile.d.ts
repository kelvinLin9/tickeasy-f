// OAuth提供者介面
interface OAuthProvider {
  provider: string;
  providerId: string;
  accessToken: string;
  tokenExpiresAt: string;
}

// 用戶介面
export interface T_Profile {
  userId?: string;
  email?: string;
  name?: string | null;
  nickname?: string | null;
  role?: "user" | "admin"; // 根據您的需求可以添加其他角色
  phone?: string | null;
  birthday?: string | null;
  gender?: string | null;
  preferredRegions?: string[];
  preferredEventTypes?: string[];
  country?: string | null;
  address?: string | null;
  avatar?: string | null;
  isEmailVerified?: boolean;
  oauthProviders?: OAuthProvider[];
  searchHistory?: string[];
}

// 完整的響應介面
export interface UserResponse {
  user: User;
}
