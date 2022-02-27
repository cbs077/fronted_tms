// src/router.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import adminRoutes from "~/routes/admin";
import vanRoutes from "~/routes/van";
import accountRoutes from "~/routes/accounts";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    redirect: "/login",
  },
  ...vanRoutes,
  ...adminRoutes,
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
