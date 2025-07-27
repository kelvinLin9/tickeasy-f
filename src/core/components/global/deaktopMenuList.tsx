import { useEffect, useState, RefObject, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/core/hooks/useLogout";
import { useAuthStore } from "@/store/authStore";
import { redirectToDashboard } from "@/utils/authUtils";

export default function DesktopMenuList({
  menuOpen,
  setMenuOpen,
  accountButtonRef,
  menuRef,
}: {
  menuOpen: boolean;
  setMenuOpen: (menuOpen: boolean) => void;
  accountButtonRef: RefObject<HTMLDivElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
}) {
  const [position, setPosition] = useState({ top: -1000, right: 0 });
  const { handleLogout } = useLogout();
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);

  const handleNavigation = useCallback(
    (path: string) => {
      setMenuOpen(false);
      navigate(path);
    },
    [setMenuOpen, navigate]
  );
  useEffect(() => {
    const updatePosition = () => {
      if (accountButtonRef.current) {
        const rect = accountButtonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom,
          right: window.innerWidth - rect.right,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [accountButtonRef]);
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);
  return (
    <div
      ref={menuRef}
      className={`fixed z-50 bg-white transition-opacity ${menuOpen ? "pointer-events-auto block opacity-100" : "hidden opacity-0"}`}
      style={{
        top: `${position.top + 10}px`,
        right: `${position.right}px`,
      }}
    >
      <ul className="flex flex-col gap-3 overflow-hidden rounded-md bg-white py-2 shadow-sm">
        <li
          className="cursor-pointer px-12 py-2 hover:bg-neutral-100"
          onClick={() => {
            handleNavigation("/user");
          }}
        >
          會員中心
        </li>
        <li
          className="cursor-pointer px-12 py-2 hover:bg-neutral-100"
          onClick={() => {
            handleNavigation("/company");
          }}
        >
          舉辦演唱會
        </li>
        <li
          className="cursor-pointer px-12 py-2 hover:bg-neutral-100"
          onClick={() => {
            handleNavigation("/user/about/history");
          }}
        >
          查看參與的演唱會
        </li>
        {(role === "admin" || role === "superuser") && (
          <li
            className="cursor-pointer px-12 py-2 hover:bg-neutral-100"
            onClick={() => {
              redirectToDashboard();
            }}
          >
            後台管理
          </li>
        )}
        <li
          className="cursor-pointer px-12 py-2 hover:bg-neutral-100"
          onClick={() => {
            handleLogout();
          }}
        >
          登出
        </li>
      </ul>
    </div>
  );
}
