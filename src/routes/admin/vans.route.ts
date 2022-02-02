import { RouteRecordRaw } from "vue-router";

const adminVanRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/vans/registrations",
    component: () => import("../../pages/admin/vans/registration.vue"),
  },
  {
    path: "/admin/vans",
    component: () => import("../../pages/admin/vans/list.vue"),
  },
];

export default adminVanRoutes;
