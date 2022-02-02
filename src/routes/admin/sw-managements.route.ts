import { RouteRecordRaw } from "vue-router";

const adminSwManagementRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/sw-managements/groups/registrations",
    component: () =>
      import("../../pages/admin/sw-managements/groups/registrations.vue"),
  },
  {
    path: "/admin/sw-managements/productions/registrations",
    component: () =>
      import("../../pages/admin/sw-managements/productions/registrations.vue"),
  },
  {
    path: "/admin/sw-managements/productions/sw-upgrades",
    component: () =>
      import("../../pages/admin/sw-managements/productions/sw-upgrades.vue"),
  },
  {
    path: "/admin/sw-managements/productions/device-updates",
    component: () =>
      import("../../pages/admin/sw-managements/productions/device-update.vue"),
  },
  {
    path: "/admin/sw-managements/sandboxes/registrations",
    component: () =>
      import("../../pages/admin/sw-managements/sandboxes/registrations.vue"),
  },
  {
    path: "/admin/sw-managements/sandboxes/sw-upgrades",
    component: () =>
      import("../../pages/admin/sw-managements/productions/sw-upgrades.vue"),
  },
  {
    path: "/admin/sw-managements/sandboxes/device-updates",
    component: () =>
      import("../../pages/admin/sw-managements/productions/device-update.vue"),
  },
];

export default adminSwManagementRoutes;
