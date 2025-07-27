import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/core/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { axiosInstance } from "@/core/lib/axios";

export default function GoogleAuthCallbackPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setCookie = useAuthStore((state) => state.setCookie);
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const fetchUserProfile = async (token: string) => {
      setCookie(token);
      const userData = await axiosInstance.get("/api/v1/users/profile");
      return userData;
    };

    // 從 URL 中獲取授權碼
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      toast({
        variant: "destructive",
        title: "發生錯誤",
        description: "請重新嘗試登入",
      });
      navigate("/login");
      return;
    }

    if (token) {
      // 使用 token 獲取用戶資料
      fetchUserProfile(token)
        .then((userData) => {
          // 設置用戶資訊，與一般登入保持一致
          setAuth(userData.data?.user?.email || "", userData.data?.user?.role || "");

          toast({
            title: "登入成功",
            description: "導向首頁",
          });
          navigate("/");
        })
        .catch(() => {
          // console.error("Failed to get user profile:", error);
          toast({
            variant: "destructive",
            title: "登入失敗",
            description: "無法獲取用戶資訊，請重新嘗試登入",
          });
          navigate("/login");
        });
    } else {
      toast({
        variant: "destructive",
        title: "沒有取得權限",
        description: "請重新嘗試登入",
      });
    }
  }, [navigate, setCookie, setAuth, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-xl font-semibold">正在處理登入...</h2>
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
}
