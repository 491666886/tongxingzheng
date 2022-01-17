import Layout from "../layout";
import KLayout from "../layout/k-index";
import Empty from "../layout/empty";
import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter);
const constantRoutes = [
  {
    path: "/login",
    component: () => import("../pages/login"),
  },
  {
    path: "/home",
    component: () => import("../pages/video-management"),
  },
  {
    path: "/victory",
    component: () => import("../pages/k-class-management"),
  },
];
export const teacherEndRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/video-management/auditing-management",
    children: [
      {
        path: "video-management",
        component: () => import("../pages/video-management"),
      },
      {
        path: "video-management/auditing-management",
        component: () => import("../pages/video-management/auditing-management"),
      },
      {
        path: "class-management",
        component: Empty,
        redirect: "/class-management/student-info-management",
        children: [
          {
            path: "student-info-management",
            component: () =>
              import("../pages/class-management/student-info-management"),
          },
          {
            path: "time-table-management",
            component: () =>
              import("../pages/class-management/time-table-management"),
          },
        ],
      },
    ],
  },
];
export const kindergartenEndRoutes = [
  {
    path: "/",
    component: KLayout,
    redirect: "/class-management",
    children: [
      {
        path: "teacher-management",
        component: () => import("../pages/teacher-management"),
      },
      {
        path: "class-management",
        component: () => import("../pages/k-class-management"),
      },
      ,
      // {
      //   path: "video-monitor-management",
      //   component: () => import("../pages/video-monitor-management"),
      // }
      {
        path: "account-authority-management",
        component: Empty,
        redirect: "/video-monitor-management",
        children: [
          {
            path: "/video-monitor-management",
            component: () => import("../pages/video-monitor-management"),
          },
          {
            path: "/highlight-management",
            component: () =>
              import("../pages/highlight-management"),
          },
        ],
      },
    ],
  },
];

const createRouter = () =>
  new VueRouter({
    routes: constantRoutes,
  });
const router = createRouter();
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}
export default router;
