// src/router.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import adminRoutes from "~/routes/admin";
import vanRoutes from "~/routes/van";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    redirect: "/van/devices/registrations",
  },
  ...vanRoutes,
  ...adminRoutes,
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
