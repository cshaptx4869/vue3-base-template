import { fileURLToPath, URL } from "node:url";
import { defineConfig, ConfigEnv, UserConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      // 按需自动导入API
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue", "vue-router", "pinia"],
        // 在 vue 模板中自动导入
        vueTemplate: true,
        // 指定自动导入函数TS类型声明文件路径 (false:关闭自动生成)
        dts: "src/types/auto-imports.d.ts",
      }),
      // 按需自动导入组件
      Components({
        // 指定自定义组件位置(默认:src/components)
        dirs: ["src/components", "src/**/components"],
        // 指定自动导入组件TS类型声明文件路径 (false:关闭自动生成)
        dts: "src/types/components.d.ts",
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_APP_PORT),
      open: true,
      proxy: {
        [env.VITE_APP_PROXY_PREFIX]: {
          changeOrigin: true,
          target: env.VITE_APP_BASE_URL,
          rewrite: (path) =>
            path.replace(new RegExp("^" + env.VITE_APP_PROXY_PREFIX), ""),
        },
      },
    },
  };
});
