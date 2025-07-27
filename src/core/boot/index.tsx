// import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { routers } from "@/core/routers";
import { RouteView } from "@/core/types/router";
import { useRouterMiddleWare } from "@/core/hooks/useRouterMiddleWare";

const Boot = () => {
  useRouterMiddleWare();

  const renderRoutes = (routes: RouteView[]) => {
    return routes.map((route: RouteView) => {
      if (route.redirect) {
        return <Route key={route.path} path={route.path} element={<Navigate to={route.redirect} replace />} />;
      }
      const { component: Component, children } = route;
      return (
        <Route key={route.path} path={route.path} element={Component ? <Component /> : null}>
          {children && renderRoutes(children)}
        </Route>
      );
    });
  };

  return (
    <div className="h-[100vh] w-[100vw]">
      {/* <Suspense fallback={<div>Loading...</div>}>
        <Routes>{renderRoutes(routers)}</Routes>
      </Suspense> */}
      <Routes>{renderRoutes(routers)}</Routes>
    </div>
  );
};

export default Boot;
