import { RouteRecordRaw } from "vue-router";

const accountRoutes: RouteRecordRaw[] = [
  {
    path: "/van/accounts/users/my",
    component: () => import("../pages/accounts/my.vue"),
  },
  {
    path: "/admin/accounts/users/my",
    component: () => import("../pages/accounts/my.vue"),
  },
  {
    path: "/admin/accounts/users",
    component: () => import("../pages/accounts/users.vue"),
  },
  {
    path: "/admin/accounts/users/registration",
    component: () => import("../pages/accounts/registration.vue"),
  },
  {
    path: "/login",
    component: () => import("../pages/login.vue"),
  },
];

export default accountRoutes;
