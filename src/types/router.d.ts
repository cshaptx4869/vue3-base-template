import "vue-router";

declare module "vue-router" {
  // https://router.vuejs.org/zh/guide/advanced/meta.html#typescript
  // 可以通过扩展 RouteMeta 接口来输入 meta 字段
  interface RouteMeta {
    /**
     * 是否鉴权
     * @default false
     */
    auth?: boolean;

    /**
     * 标题
     * @example 'Vue3 Base Template'
     */
    title?: string;

    /**
     * 是否缓存页面
     * @default false
     */
    keepAlive?: boolean;
  }
}
