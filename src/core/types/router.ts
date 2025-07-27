import { LazyExoticComponent, ComponentType } from "react";

export interface RouteView {
  path: string; // 路由路徑
  component: LazyExoticComponent<ComponentType>; // 路由組件
  redirect?: string; // 重定向路徑
  meta: {
    title: string; // 路由標題
  };
  needLogin: boolean; // 是否需要登入
  children?: RouteView[];
}

export interface ModuleConfig {
  name: string; // 模組名稱
  views: RouteView[]; // 模組路由
}
