import { RouteRecordRaw } from "vue-router";

import accountRoutes from "~/routes/accounts";
import vanDeviceRoutes from "~/routes/van/devices.route";
import vanMonitorRouters from "~/routes/van/monitors.route";
import vanSwManagementRoutes from "~/routes/van/sw-managements.route";
import adminVanRoutes from "~/routes/van/vans.route";


const vanRoutes: RouteRecordRaw[] = [
  ...vanDeviceRoutes,
  ...accountRoutes,
  ...vanMonitorRouters,
  ...vanSwManagementRoutes,
  ...adminVanRoutes
];

export default vanRoutes;
