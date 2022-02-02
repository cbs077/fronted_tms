import { RouteRecordRaw } from "vue-router";

const adminMonitorRouters: RouteRecordRaw[] = [
  {
    path: "/admin/monitors/transactions",
    component: () => import("../../pages/admin/monitors/transactions.vue"),
  },
];

export default adminMonitorRouters;
