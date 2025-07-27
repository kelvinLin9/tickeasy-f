import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  email: string;
  role: string;
  isLogin: boolean;
  setAuth: (email: string, role: string) => void;
  logout: () => void;
  setCookie: (token: string) => void;
  removeCookie: () => void;
  getAuthToken: () => string | null;
}

const initialState = {
  email: "",
  role: "",
  isLogin: false,
};

// 處理 Cookie 的輔助函數
const setCookie = (token: string) => {
  // 設定 cookie 過期時間為 7 天
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
};
const removeCookie = () => {
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

const getAuthToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1];
};
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (email, role) => set({ email, role, isLogin: true }),
      logout: () => {
        set({ email: "", role: "", isLogin: false });
        // 清除 cookie
        removeCookie();
      },
      setCookie,
      removeCookie,
      getAuthToken: () => getAuthToken() || null,
    }),
    {
      name: "auth-storage",
      // 指定只持久化這些欄位
      partialize: (state) => ({
        email: state.email,
        role: state.role,
        isLogin: state.isLogin,
      }),
    }
  )
);
