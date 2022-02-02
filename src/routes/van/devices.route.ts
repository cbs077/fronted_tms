import { RouteRecordRaw } from "vue-router";

const vanDeviceRoutes: RouteRecordRaw[] = [
  {
    path: "/van/devices/registrations",
    component: () => import("../../pages/van/devices/registrations.vue"),
  },
  {
    path: "/van/devices/logs",
    component: () => import("../../pages/van/devices/logs.vue"),
  },
  {
    path: "/van/devices/un-registrations",
    component: () => import("../../pages/van/devices/un-registrations.vue"),
  },
  {
    path: "/van/devices/vans",
    component: () => import("../../pages/van/devices/vans.vue"),
  },
  {
    path: "/van/devices/usages",
    component: () => import("../../pages/van/devices/usage.vue"),
  },
  {
    path: "/van/devices/models",
    component: () => import("../../pages/van/devices/models.vue"),
  },
];

export default vanDeviceRoutes;
