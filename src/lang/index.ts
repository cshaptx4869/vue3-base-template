import type { App } from "vue";
import { createI18n } from "vue-i18n";
import enLocale from "./package/en";
import zhCnLocale from "./package/zh-cn";
import zhTwLocale from "./package/zh-tw";

const i18n = createI18n({
  legacy: false, // 必须设置false才能使用Composition API
  globalInjection: true, // 为每个组件注入$为前缀的全局属性和函数
  locale: "zh-cn",
  messages: {
    en: enLocale,
    "zh-cn": zhCnLocale,
    "zh-tw": zhTwLocale,
  },
});

// 全局注册 i18n
export function setupI18n(app: App<Element>) {
  app.use(i18n);
}

export default i18n;
