import type { App } from "vue";
import { setupRouter } from "@/router";
import { setupStore } from "@/store";

export default {
  install(app: App<Element>) {
    // 路由(router)
    setupRouter(app);
    // 状态管理(store)
    setupStore(app);
  },
};
