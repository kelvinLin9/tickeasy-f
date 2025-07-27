import axios from "axios";
import { useAuthStore } from "@/store/authStore";
// 創建 axios 實例
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 獲取 token
    const token = useAuthStore.getState().getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 統一錯誤處理
    if (error.response?.status === 401) {
      // 處理未授權情況
      // Token 過期
      const store = useAuthStore.getState();
      store.logout();
      throw new Error("Token expired");
    }
    return Promise.reject(error);
  }
);
