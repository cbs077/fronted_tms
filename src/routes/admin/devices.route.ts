import { RouteRecordRaw } from "vue-router";

const adminDeviceRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/devices/registrations",
    component: () => import("../../pages/admin/devices/registrations.vue"),
  },
  {
    path: "/admin/devices/vans",
    component: () => import("../../pages/admin/devices/vans.vue"),
  },
  {
    path: "/admin/devices/usages",
    component: () => import("../../pages/admin/devices/usage.vue"),
  },
  {
    path: "/admin/devices/models",
    component: () => import("../../pages/admin/devices/models.vue"),
  },
  {
    path: "/admin/devices/vans-usage",
    component: () => import("../../pages/admin/devices/van-usage.vue"),
  },
  {
    path: "/admin/devices/vans-usage-daily",
    component: () => import("../../pages/admin/devices/van-usage-daily.vue"),
  },
  {
    path: "/admin/devices/devices-usage-daily",
    component: () => import("../../pages/admin/devices/device-usage-daily.vue"),
  },
];

export default adminDeviceRoutes;
