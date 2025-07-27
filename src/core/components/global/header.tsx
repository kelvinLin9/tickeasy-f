import Logo from "@/assets/images/logo.png";
import User from "@/assets/images/user.png";
import { Icon } from "@iconify-icon/react";
import { useState, useRef, useEffect } from "react";
import DesktopSearchBar from "./deaktopSearchBar";
import MobileMenuList from "./mobileMenuList";
import DesktopMenuList from "./deaktopMenuList";
import { useNavigate } from "react-router-dom";
import { useHeaderSearchBar } from "@/core/hooks/useHeaderSearchBar";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const [menu, setMenu] = useState(false);
  const { handleSearch } = useHeaderSearchBar(() => {
    setMenu(false);
  });
  //const [isLogin, setIsLogin] = useState(false);
  const [desktopSearchBlock, setDesktopSearchBlock] = useState(false);
  const [searchText, setSearchText] = useState("");
  const accountButtonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 從 store 中獲取登入狀態
  const isLogin = useAuthStore((state) => state.isLogin);

  // 新增處理互斥狀態的函數
  const toggleMenu = (value: boolean) => {
    setMenu(value);
    if (value && desktopSearchBlock) {
      setDesktopSearchBlock(false);
    }
  };

  const toggleDesktopSearch = (value: boolean) => {
    setDesktopSearchBlock(value);
    if (value && menu) {
      setMenu(false);
    }
  };

  // 添加點擊外部關閉 menu 的處理函數
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // 桌面版：檢查點擊是否在帳號按鈕或選單內部
      const isClickInsideAccountButton = accountButtonRef.current?.contains(target);
      const isClickInsideMenu = menuRef.current?.contains(target);

      // 手機版：檢查點擊是否在選單按鈕或選單內部
      const isClickInsideMobileMenuButton = mobileMenuButtonRef.current?.contains(target);
      const isClickInsideMobileMenu = mobileMenuRef.current?.contains(target);

      // 桌面版和手機版都需要檢查
      const isDesktopClickOutside = !isClickInsideAccountButton && !isClickInsideMenu;
      const isMobileClickOutside = !isClickInsideMobileMenuButton && !isClickInsideMobileMenu;

      // 只有當點擊在所有相關元素外部時才關閉選單
      if (menu && isDesktopClickOutside && isMobileClickOutside) {
        setMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menu]);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-white select-none">
        {/* 電腦版 */}
        <div className="hidden h-20 py-2 lg:block">
          <div className="flex h-full items-center justify-around px-4 md:px-10 lg:px-12 xl:px-20">
            <div className="flex w-[200px] items-center gap-4">
              <p className="cursor-pointer rounded-sm p-2 transition-all hover:bg-neutral-100" onClick={() => navigate("/concerts")}>
                探索頁面
              </p>
              {isLogin && (
                <p className="cursor-pointer rounded-sm p-2 transition-all hover:bg-neutral-100" onClick={() => navigate("/user/about/history")}>
                  查看票券
                </p>
              )}
            </div>
            <div onClick={() => navigate("/")} className="w-[300px] cursor-pointer">
              <img className="mx-auto" src={Logo} alt="Logo" draggable={false} />
            </div>
            <div className="flex w-[200px] items-center gap-6">
              <Icon onClick={() => toggleDesktopSearch(true)} icon="my-search" className="cursor-pointer text-2xl" />
              {isLogin ? (
                <div
                  ref={accountButtonRef}
                  onClick={() => toggleMenu(!menu)}
                  className="flex cursor-pointer items-center gap-2 rounded-sm p-2 transition-all duration-300 hover:bg-neutral-100"
                >
                  <img src={User} alt="User" className="h-6 w-6 rounded-full" draggable={false} />
                  <p>帳號</p>
                  <Icon icon="my-chevron-down" className="text-[8px]" />
                </div>
              ) : (
                <>
                  <p className="cursor-pointer rounded-sm p-2 transition-all hover:bg-neutral-100" onClick={() => navigate("/login")}>
                    登入
                  </p>
                  <p onClick={() => navigate("/signup")} className="cursor-pointer rounded-sm p-2 transition-all hover:bg-neutral-100">
                    註冊
                  </p>
                </>
              )}
            </div>
          </div>
          <DesktopSearchBar
            handleSearch={handleSearch}
            desktopSearchBlock={desktopSearchBlock}
            setDesktopSearchBlock={toggleDesktopSearch}
            searchText={searchText}
            setSearchText={setSearchText}
          />
          <DesktopMenuList menuOpen={menu} setMenuOpen={setMenu} accountButtonRef={accountButtonRef} menuRef={menuRef} />
        </div>

        {/* 手機版 */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between p-4">
            <img onClick={() => navigate("/")} src={Logo} alt="Logo" />
            <div ref={mobileMenuButtonRef}>
              {menu ? (
                <Icon icon="my-close" className="text-4xl transition-all duration-300" onClick={() => toggleMenu(!menu)} />
              ) : (
                <Icon icon="my-menu" className="text-2xl transition-all duration-300" onClick={() => toggleMenu(!menu)} />
              )}
            </div>
          </div>
          <div ref={mobileMenuRef}>
            <MobileMenuList
              menuOpen={menu}
              isLogin={isLogin}
              handleSearch={handleSearch}
              searchText={searchText}
              setSearchText={setSearchText}
              setMenuOpen={setMenu}
            />
          </div>
        </div>
      </header>
    </>
  );
}
