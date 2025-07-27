import { lazy } from "react";
export default {
  name: "演唱會資訊",
  views: [
    {
      path: "/concerts",
      component: lazy(() => import("./views/allConcertsPage")),
      meta: { title: "演唱會搜尋" },
      needLogin: false,
    },
    {
      path: "/concert/verify-qrcode/:ticketId?",
      component: lazy(() => import("./views/verifyQRCodePage")),
      meta: { title: "票券 QRCode 驗證" },
      needLogin: true,
    },
    {
      path: "/concert/:concertId",
      component: lazy(() => import("./views/singleConcertPage")),
      meta: { title: "演唱會詳細資訊" },
      needLogin: false,
    },
    {
      path: "/concert/preview/:concertId",
      component: lazy(() => import("./views/previewConcertPage")),
      meta: { title: "演唱會預覽" },
      needLogin: true,
    },
    {
      path: "/concert/create/info",
      component: lazy(() => import("./views/createConInfoPage")),
      meta: { title: "建立演唱會-基本資料" },
      needLogin: true,
    },
    {
      path: "/concert/edit/:concertId/info",
      component: lazy(() => import("./views/createConInfoPage")),
      meta: { title: "編輯演唱會-基本資料" },
      needLogin: true,
    },
    {
      path: "/concert/create/sessions-and-tickets",
      component: lazy(() => import("./views/createConSessionsAndTicketsPage")),
      meta: { title: "建立演唱會-設定場次及票種" },
      needLogin: true,
    },
    {
      path: "/concert/edit/:concertId/sessions-and-tickets",
      component: lazy(() => import("./views/createConSessionsAndTicketsPage")),
      meta: { title: "編輯演唱會-設定場次及票種" },
      needLogin: true,
    },
    {
      path: "/concert/buyTicket/:concertId",
      component: lazy(() => import("./views/buyTickerPage")),
      meta: { title: "購買演唱會票券" },
      needLogin: true,
    },
    {
      path: "/concert/paymentResult",
      component: lazy(() => import("./views/paymentResultPage")),
      meta: { title: "購買演唱會票券結果" },
      needLogin: true,
    },
  ],
};
