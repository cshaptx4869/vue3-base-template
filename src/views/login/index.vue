<script setup lang="ts">
import { useAuthStore } from "@/store";

defineOptions({
  name: "Login",
});

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

function parseRedirect(): {
  path: string;
  queryParams: Record<string, string>;
} {
  const query = route.query;
  const redirect = (query.redirect as string) ?? "/";

  const url = new URL(redirect, window.location.origin);
  const path = url.pathname;
  const queryParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return { path, queryParams };
}

async function handleRegister() {
  await authStore.signUp({
    username: "visitor",
    password: "123456",
  });
  setTimeout(() => {
    const { path, queryParams } = parseRedirect();
    router.push({ path: path, query: queryParams });
  }, 800);
}

async function handleLogin() {
  await authStore.signIn({
    username: "visitor",
    password: "123456",
  });
  setTimeout(() => {
    const { path, queryParams } = parseRedirect();
    router.push({ path: path, query: queryParams });
  }, 800);
}
</script>

<template>
  <div>
    <h2>Login</h2>
    <div>
      <button @click="handleRegister">注册</button>
    </div>
    <div>
      <button @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
