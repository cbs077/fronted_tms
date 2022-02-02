import { RouteRecordRaw } from "vue-router";

const vanSwManagementRoutes: RouteRecordRaw[] = [
  {
    path: "/van/sw-managements/groups/registrations",
    component: () =>
      import("../../pages/van/sw-managements/groups/registrations.vue"),
  },
  {
    path: "/van/sw-managements/productions/registrations",
    component: () =>
      import("../../pages/van/sw-managements/productions/registrations.vue"),
  },
  {
    path: "/van/sw-managements/productions/sw-upgrades",
    component: () =>
      import("../../pages/van/sw-managements/productions/sw-upgrades.vue"),
  },
  {
    path: "/van/sw-managements/productions/device-updates",
    component: () =>
      import("../../pages/van/sw-managements/productions/device-update.vue"),
  },
  {
    path: "/van/sw-managements/sandboxes/registrations",
    component: () =>
      import("../../pages/van/sw-managements/sandboxes/registrations.vue"),
  },
  {
    path: "/van/sw-managements/sandboxes/sw-upgrades",
    component: () =>
      import("../../pages/van/sw-managements/productions/sw-upgrades.vue"),
  },
  {
    path: "/van/sw-managements/sandboxes/device-updates",
    component: () =>
      import("../../pages/van/sw-managements/productions/device-update.vue"),
  },
];

export default vanSwManagementRoutes;
