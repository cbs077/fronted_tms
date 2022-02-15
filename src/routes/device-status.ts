import { RouteRecordRaw } from "vue-router";

const deviceStatusRoutes: RouteRecordRaw[] = [
  {
    path: "/devices-status/vans",
    name: "DeviceStatusVan",
    component: () => import("../pages/device-status/vans.vue"),
  },
];

export default deviceStatusRoutes;
