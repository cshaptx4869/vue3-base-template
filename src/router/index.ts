import type { App } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/404",
    },
    {
      path: "/404",
      component: () => import("@/views/error-page/404.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/error-page/404.vue"),
    },
  ],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
