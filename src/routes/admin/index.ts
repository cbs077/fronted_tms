import { RouteRecordRaw } from "vue-router";

import adminDeviceRoutes from "~/routes/admin/devices.route";
import adminMonitorRouters from "~/routes/admin/monitors.route";
import adminSwManagementRoutes from "~/routes/admin/sw-managements.route";
import adminVanRoutes from "~/routes/admin/vans.route";

const adminRoutes: RouteRecordRaw[] = [
  ...adminDeviceRoutes,
  ...adminMonitorRouters,
  ...adminSwManagementRoutes,
  ...adminVanRoutes,
];

export default adminRoutes;
