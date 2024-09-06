import { setupRouter } from "@/router";
import type { App } from "vue";

export default {
  install(app: App<Element>) {
    // 路由(router)
    setupRouter(app);
  },
};
