import AuthAPI from "@/api/modules/auth";
import store from "@/store";
import { localCache } from "@/utils/cache";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { CacheEnum } from "@/enums/CacheEnum";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref(localCache.get(CacheEnum.ACCESS_TOKEN, ""));
  const refreshToken = ref(localCache.get(CacheEnum.REFRESH_TOKEN, ""));
  const isLoggedIn = computed(() => !!accessToken.value);

  watch(accessToken, (newValue) => {
    if (newValue) {
      localCache.set(CacheEnum.ACCESS_TOKEN, newValue);
    } else {
      localCache.delete(CacheEnum.ACCESS_TOKEN);
    }
  });
  watch(refreshToken, (newValue) => {
    if (newValue) {
      localCache.set(CacheEnum.REFRESH_TOKEN, newValue);
    } else {
      localCache.delete(CacheEnum.REFRESH_TOKEN);
    }
  });

  // 注册
  async function signUp(payload: Record<string, any>) {
    const response = await AuthAPI.signUp(payload);
    const prefix = response.tokenType ? `${response.tokenType} ` : "";
    accessToken.value = prefix + response.accessToken;
    refreshToken.value = prefix + response.refreshToken;
    return response;
  }

  // 登录
  async function signIn(payload: Record<string, any>) {
    const response = await AuthAPI.signIn(payload);
    const prefix = response.tokenType ? `${response.tokenType} ` : "";
    accessToken.value = prefix + response.accessToken;
    refreshToken.value = prefix + response.refreshToken;
    return response;
  }

  // 登出
  function signOut() {
    accessToken.value = "";
    refreshToken.value = "";
  }

  // 刷新token
  async function refresh(payload: Record<string, any>) {
    const response = await AuthAPI.refreshToken(payload);
    const prefix = response.tokenType ? `${response.tokenType} ` : "";
    accessToken.value = prefix + response.accessToken;
    return response;
  }

  return {
    accessToken,
    refreshToken,
    isLoggedIn,
    signUp,
    signIn,
    signOut,
    refresh,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useAuthStoreHook() {
  return useAuthStore(store);
}
