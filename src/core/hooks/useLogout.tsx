import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useContext } from "react";
import { ModalStatusContext } from "@/context/modalStatusContext";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);
  const { resetLoginData } = useContext(ModalStatusContext)!;
  const handleLogout = () => {
    logout(); // 清 auth store
    resetLoginData(); // 清 input 狀態
    navigate("/login");
  };

  return { handleLogout };
};
