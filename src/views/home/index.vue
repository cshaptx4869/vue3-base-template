<script setup lang="ts">
import { UserAPI } from "@/api";
import { useAuthStore } from "@/store";

defineOptions({
  name: "Home",
});

// 请求数据
const userList = ref();
async function handleRequest() {
  const response = await UserAPI.getList();
  console.log("获取用户数据", response);
  userList.value = response;
}

// 路由跳转
const router = useRouter();
function handleJump() {
  router.push({
    path: "/demo",
    query: {
      keywords: "你好啊",
    },
  });
}

// 注销
const authStore = useAuthStore();
function handleLogout() {
  authStore.signOut();
}
</script>

<template>
  <div>
    <h2>Home</h2>
    <div>
      <IconFont name="uniapp" color="#2A9838" />
      {{ $t("locale.en") }}
    </div>
    <div>
      <button @click="handleJump">路由跳转(拦截)</button>
    </div>
    <div>
      <button @click="handleRequest">请求数据</button>
      <div v-if="userList">{{ userList }}</div>
    </div>
    <div v-if="authStore.isLoggedIn">
      <button @click="handleLogout">注销</button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
