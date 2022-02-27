// src/router.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import axios from "axios";

import adminRoutes from "~/routes/admin";
import vanRoutes from "~/routes/van";
import accountRoutes from "~/routes/accounts";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    redirect: "/van/devices/registrations",
  },
  ...vanRoutes,
  ...adminRoutes,
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/home'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = window.localStorage.getItem('token');
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
  next();
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401) {
      console.log('token expired',error.response)
      router.push('/')
      /* THIS WORKS BUT BREAKS THE LOGIN ERROR HANDLING */

  }
  return Promise.reject(error);
});
export default router;
