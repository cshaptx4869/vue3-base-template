import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import mockDevServerPlugin from "vite-plugin-mock-dev-server";
import VueDevTools from "vite-plugin-vue-devtools";
import packageJson from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  return {
    build: {
      chunkSizeWarningLimit: 2000, // 消除打包大小超过500kb警告
      minify: "terser", // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
      terserOptions: {
        compress: {
          keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          drop_console: true, // 生产环境去除 console
          drop_debugger: true, // 生产环境去除 debugger
        },
        format: {
          comments: false, // 删除注释
        },
      },
      rollupOptions: {
        output: {
          // manualChunks: {
          //   "vue-i18n": ["vue-i18n"],
          // },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: "js/[name].[hash].js",
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: "js/[name].[hash].js",
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo: any) => {
            const info = assetInfo.name.split(".");
            let extType = info[info.length - 1];
            // console.log('文件信息', assetInfo.name)
            if (
              /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)
            ) {
              extType = "media";
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = "img";
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "fonts";
            }
            return `${extType}/[name].[hash].[ext]`;
          },
        },
      },
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        // 定义全局 SCSS 变量
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `,
        },
      },
    },
    define: {
      /** 平台的名称、版本、运行所需的`node`版本、依赖、构建时间的类型提示 */
      __APP_INFO__: JSON.stringify({
        pkg: {
          name: packageJson.name,
          version: packageJson.version,
          engines: packageJson.engines,
          dependencies: packageJson.dependencies,
          devDependencies: packageJson.devDependencies,
        },
        buildTimestamp: Date.now(),
      }),
    },
    // 预加载项目必需的组件
    optimizeDeps: {
      include: ["vue", "vue-router", "pinia", "axios", "vue-i18n"],
    },
    plugins: [
      vue(),
      // 按需自动导入API
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue", "vue-router", "pinia", "vue-i18n"],
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
      // MOCK服务
      env.VITE_APP_MOCK === "true" ? mockDevServerPlugin() : null,
      // Debug服务
      env.VITE_APP_DEBUG === "true"
        ? VueDevTools({
            openInEditorHost: `http://localhost:${env.VITE_APP_PORT}`,
          })
        : null,
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
