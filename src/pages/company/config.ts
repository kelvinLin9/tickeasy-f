import { lazy } from "react";

export default {
  name: "公司資訊",
  views: [
    {
      path: "/company",
      component: lazy(() => import("./views/company")),
      meta: { title: "公司資訊" },
      needLogin: true,
    },
    {
      path: "/companyDetail",
      component: lazy(() => import("./views/companyDetail")),
      meta: { title: "公司詳細資訊" },
      needLogin: true,
    },
    {
      path: "/company/concert/status/:concertId",
      component: lazy(() => import("./views/concertStatus")),
      meta: { title: "演唱會販售統計" },
      needLogin: true,
    },
  ],
};
