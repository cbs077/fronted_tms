import { RouteRecordRaw } from "vue-router";

const deviceRoutes: RouteRecordRaw[] = [
  {
    path: "/devices/registrations",
    name: "DeviceRegistration",
    component: () => import("../pages/devices/registrations.vue"),
  },
  {
    path: "/devices/logs",
    name: "DeviceRegistrationLogs",
    component: () => import("../pages/devices/logs.vue"),
  },
  {
    path: "/devices/un-registrations",
    name: "DeviceUnRegistrations",
    component: () => import("../pages/devices/un-registrations.vue"),
  },
];

export default deviceRoutes;
