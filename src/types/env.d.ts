/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/**
 * 响应数据
 */
interface ResponseData<T = any> {
  code: string;
  data: T;
  msg: string;
}

// TypeScript 类型提示都为 string： https://github.com/vitejs/vite/issues/6930
interface ImportMetaEnv {
  /** 应用端口 */
  VITE_APP_PORT: number;
  /** 代理前缀 */
  VITE_APP_PROXY_PREFIX: string;
  /** 接口地址 */
  VITE_APP_BASE_URL: string;
  /** Mock服务 */
  VITE_APP_MOCK: boolean;
  /** Debug服务 */
  VITE_APP_DEBUG: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * 平台的名称、版本、运行所需的`node`版本、依赖、构建时间的类型提示
 */
declare const __APP_INFO__: {
  pkg: {
    name: string;
    version: string;
    engines: {
      node: string;
    };
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  buildTimestamp: number;
};
