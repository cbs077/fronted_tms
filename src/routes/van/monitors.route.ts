import { RouteRecordRaw } from "vue-router";

const vanMonitorRouters: RouteRecordRaw[] = [
  {
    path: "/van/monitors/transactions",
    component: () => import("../../pages/van/monitors/transactions.vue"),
  },
];

export default vanMonitorRouters;
