import { useAuthStore } from "@/store/authStore";

/**
 * 跳轉到 Dashboard 並傳遞認證資訊
 * 使用 URL 參數方式傳遞 token 和用戶資訊
 */
export const redirectToDashboard = () => {
  const token = useAuthStore.getState().getAuthToken();

  if (token) {
    // 創建 URL 參數
    const params = new URLSearchParams({
      token: token,
    });

    // 在新視窗開啟 Dashboard
    window.open(`https://tickeasy-dashboard.onrender.com/dashboard?${params}`, "_blank");
  } else {
    // 如果沒有 token，提示用戶重新登入
    // console.warn('未找到認證資訊，請重新登入');
    // 可以選擇導向登入頁面
    // window.location.href = '/login';
  }
};

/**
 * 檢查用戶是否有權限訪問 Dashboard
 * @returns boolean
 */
export const canAccessDashboard = (): boolean => {
  const role = useAuthStore.getState().role;
  const isLogin = useAuthStore.getState().isLogin;

  return isLogin && (role === "admin" || role === "superuser");
};
