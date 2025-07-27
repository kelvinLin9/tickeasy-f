import { RouteView, ModuleConfig } from "@/core/types/router";
// 自動導入所有配置文件
const modules = import.meta.glob("./*/config.ts", { eager: true });

// 收集所有 config.ts 配置
export const pagesConfig = Object.entries(modules).reduce(
  (acc, [path, module]) => {
    const moduleName = path.match(/\.\/(.+)\/config\.ts/)?.[1] || "";

    const config = module as { default: ModuleConfig };

    // 檢查 config.default 是否存在
    if (!config?.default) {
      // console.warn(`警告: ${path} 沒有默認導出`);
      return acc;
    }

    return {
      ...acc,
      [moduleName]: config.default,
    };
  },
  {} as Record<string, ModuleConfig>
);

// 合併後的路由配置 最後會導入到 @/core/routers
export const routes = Object.values(pagesConfig).reduce<RouteView[]>((acc, config) => {
  // const moduleName = Object.keys(pagesConfig)[index];
  if (!config?.views) {
    // console.warn(`警告: ${moduleName} 模組的配置文件缺少 views 屬性`);
    return acc;
  }
  return [...acc, ...config.views];
}, []);
