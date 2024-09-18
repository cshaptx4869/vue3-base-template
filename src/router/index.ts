import { useAuthStore } from "@/store";
import NProgress from "@/utils/nprogress";
import type { App } from "vue";
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/:pathMatch(.*)",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      title: "404",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "Login",
    },
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: "Home",
    },
  },
  {
    path: "/demo",
    name: "Demo",
    component: () => import("@/views/demo/index.vue"),
    meta: {
      auth: true,
      title: "Demo",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

router.beforeEach((to) => {
  NProgress.start();
  if (!useAuthStore().isLoggedIn) {
    if (to.meta.auth) {
      return {
        path: "/login",
        query: {
          redirect: to.fullPath,
        },
      };
    }
  } else {
    if (to.path === "/login") {
      return "/";
    }
  }
});

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  NProgress.done();
});

export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
