// src/router.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import deviceStatusRoutes from "~/routes/device-status";
import deviceRoutes from "~/routes/devices";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("./../pages/index.vue"),
  },
  {
    path: "/devices-usage",
    name: "DeviceUsage",
    component: () => import("./../pages/devices-usage.vue"),
  },
  ...deviceRoutes,
  ...deviceStatusRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
