import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { routes } from "@/pages";
import { RouteView } from "@/core/types/router";
import { useAuthStore } from "@/store/authStore";
export const useRouterMiddleWare = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = useAuthStore((state) => state.isLogin);
  useEffect(() => {
    // 檢查是否應該跳過自動滾動（例如從客服聊天中點擊內部連結）
    const shouldSkipScroll = location.state?.skipAutoScroll === true;

    if (!shouldSkipScroll) {
      window.scrollTo(0, 0);
    }

    const currentPath = location.pathname;

    // 修改路由查找邏輯，加入遞歸搜索子路由
    const findRoute = (routes: RouteView[], parentPath: string = ""): RouteView | undefined => {
      for (const route of routes) {
        // 組合完整路徑，確保路徑格式正確
        const fullPath = `${parentPath}${route.path.startsWith("/") ? route.path : `/${route.path}`}`;
        // 創建更精確的路由匹配正則表達式
        const routeRegex = new RegExp("^" + fullPath.replace(/:[^\s/]+/g, "([^/]+)").replace(/\/$/, "") + "/?$");

        const match = currentPath.match(routeRegex);

        // 檢查是否匹配當前路徑
        if (fullPath === currentPath || match) {
          if (route.redirect) {
            if (match) {
              const params = match.slice(1);
              const dynamicParams = route.path.match(/:[^\s/]+/g) || [];
              let redirectPath = route.redirect;
              dynamicParams.forEach((param, index) => {
                redirectPath = redirectPath.replace(param, params[index]);
              });
              navigate(redirectPath, { replace: true });
            }
          }
          return route;
        }

        // 檢查子路由
        if (route.children) {
          const childRoute = findRoute(route.children, fullPath);
          if (childRoute) return childRoute;
        }
      }
      return undefined;
    };

    const currentRoute = findRoute(routes.flatMap((route) => route || []));

    // 如果路徑無效且不是404頁面，重定向到404
    if (!currentRoute && currentPath !== "/404") {
      navigate("/404");
      return;
    }

    // 檢查登入狀態
    if (currentRoute?.needLogin && !isLogin) {
      // 檢查是否是從登入頁面返回
      if (location.state?.from === "/login") {
        // 如果是從登入頁面返回，導向首頁或其他適當的頁面
        navigate("/", { replace: true });
      } else {
        // 正常導向登入頁面
        navigate("/login", {
          state: { from: location.pathname },
          replace: true, // 使用 replace 而不是 push，這樣不會在歷史記錄中新增條目
        });
      }
      return;
    }
  }, [location.pathname, location.state?.from, navigate, isLogin]);
};
