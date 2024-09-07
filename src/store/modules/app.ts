import store from "@/store";

export const useAppStore = defineStore("app", () => {
  const settings = ref({
    title: "vue3-scaffold",
    version: "0.0.0",
  });

  return {
    settings,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useAppStoreHook() {
  return useAppStore(store);
}
