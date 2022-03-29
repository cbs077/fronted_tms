import { RouteRecordRaw } from "vue-router";

const adminVanRoutes: RouteRecordRaw[] = [
  {
    path: "/van/vans/registrations",
    component: () => import("../../pages/van/vans/registration.vue"),
  },
  {
    path: "/van/vans",
    component: () => import("../../pages/van/vans/list.vue"),
  },
];

export default adminVanRoutes;
