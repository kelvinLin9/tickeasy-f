import { lazy } from "react";

export default {
  name: "會員中心",
  views: [
    {
      path: "/user",
      redirect: "/user/about/profile",
      needLogin: true,
    },
    {
      path: "/user/about",
      component: lazy(() => import("./views/page")),
      meta: { title: "會員中心" },
      needLogin: true,
      children: [
        {
          path: "profile",
          component: lazy(() => import("./views/profile")),
          meta: { title: "會員中心" },
          needLogin: true,
        },
        {
          path: "history",
          component: lazy(() => import("./views/history")),
          meta: { title: "查看演唱會及票券" },
          needLogin: true,
        },
        {
          path: "password",
          component: lazy(() => import("./views/password")),
          meta: { title: "修改密碼" },
          needLogin: true,
        },
      ],
    },
  ],
};
