# vue3-base-template

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

## Integrated UI Framework

### Element Plus

Install element plus

```sh
pnpm install element-plus
```

Automatically import components

```sh
pnpm add unplugin-vue-components unplugin-auto-import -D
```

```typescript
// vite.config.ts
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default {
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
};
```

Usage

```vue
<template>
  <el-button>Default</el-button>
</template>
<script setup>
  ElMessage.error('No need to import ElMessage');
</script>
```

### Vant

Install vant

```sh
pnpm add vant
```

Automatically import components

```sh
pnpm add @vant/auto-import-resolver unplugin-vue-components unplugin-auto-import -D
```

```typescript
// vite.config.ts
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';

export default {
  plugins: [
    vue(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
};
```

Viewport layout

```sh
pnpm add postcss-px-to-viewport-8-plugin -D
```

```typescript
// vite.config.ts
import vue from "@vitejs/plugin-vue";
import postcsspxtoviewport8plugin from "postcss-px-to-viewport-8-plugin";

export default {
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport8plugin({
          unitToConvert: "px",
          viewportWidth: (file) => {
            // Design draft width
            let num = 750;
            if (file.indexOf("vant") !== -1) {
              // console.log(file);
              num = 375;
            }
            return num;
          },
        }),
      ],
    },
  },
};
```

Usage

```vue
<template>
  <van-button type="primary" />
</template>
<script setup>
  showToast('No need to import showToast');
</script>
```

