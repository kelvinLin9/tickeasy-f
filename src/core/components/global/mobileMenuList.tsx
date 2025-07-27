import User from "@/assets/images/user.png";
import MobileSearchBar from "./mobileSearchBar";
import { useLogout } from "@/core/hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { redirectToDashboard } from "@/utils/authUtils";
export default function MobileMenuList({
  menuOpen,
  isLogin,
  handleSearch,
  searchText,
  setSearchText,
  setMenuOpen,
}: {
  menuOpen: boolean;
  isLogin: boolean;
  handleSearch: (text: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  setMenuOpen: (menuOpen: boolean) => void;
}) {
  const { handleLogout } = useLogout();
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);

  // 處理導航並關閉選單
  const handleNavigateAndClose = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  // 處理登出並關閉選單
  const handleLogoutAndClose = () => {
    handleLogout();
    setMenuOpen(false);
  };

  return (
    <div
      className={`fixed top-18 left-0 z-99 h-screen w-full transition-all duration-100 ease-in-out lg:hidden ${
        menuOpen ? "pointer-events-auto bg-[#eaf2f9] opacity-100" : "pointer-events-none bg-white opacity-0"
      }`}
    >
      <nav className="p-4 text-xl">
        {isLogin ? (
          /* 已登入 */
          <ul className="flex flex-col space-y-4">
            <li className="cursor-pointer rounded-md p-2 hover:bg-blue-100" onClick={() => handleNavigateAndClose("/user/about/history")}>
              查看票券
            </li>
            <li className="cursor-pointer rounded-md p-2 hover:bg-blue-100" onClick={() => handleNavigateAndClose("/concerts")}>
              探索頁面
            </li>
            <li className="p-2">
              <div className="flex items-center gap-2">
                <img src={User} alt="User" className="h-6 w-6" />
                <span>帳號</span>
              </div>
              <ul className="mt-4 ml-8 flex flex-col space-y-4">
                <li className="cursor-pointer rounded-md p-2 hover:bg-blue-100" onClick={() => handleNavigateAndClose("/user")}>
                  會員中心
                </li>
                <li className="cursor-pointer p-2 hover:bg-neutral-100" onClick={() => handleNavigateAndClose("/company")}>
                  舉辦演唱會
                </li>
                <li
                  className="cursor-pointer rounded-md p-2 text-start hover:bg-blue-100"
                  onClick={() => handleNavigateAndClose("/user/about/history")}
                >
                  查看參與的演唱會
                </li>
                {(role === "admin" || role === "superuser") && (
                  <li
                    className="cursor-pointer p-2 hover:bg-neutral-100"
                    onClick={() => {
                      redirectToDashboard();
                      setMenuOpen(false);
                    }}
                  >
                    後台管理
                  </li>
                )}
                <li className="cursor-pointer rounded-md p-2 hover:bg-blue-100" onClick={handleLogoutAndClose}>
                  登出
                </li>
              </ul>
            </li>
          </ul>
        ) : (
          /* 未登入 */
          <ul className="flex flex-col space-y-4">
            <li className="cursor-pointer rounded-md p-2 hover:bg-blue-100" onClick={() => handleNavigateAndClose("/concerts")}>
              探索頁面
            </li>
            <li className="cursor-pointer rounded-md p-2 hover:bg-blue-100" onClick={() => handleNavigateAndClose("/login")}>
              登入
            </li>
            <li className="cursor-pointer rounded-md p-2 hover:bg-blue-100" onClick={() => handleNavigateAndClose("/signup")}>
              註冊
            </li>
          </ul>
        )}
      </nav>
      <MobileSearchBar handleSearch={handleSearch} searchText={searchText} setSearchText={setSearchText} />
    </div>
  );
}
