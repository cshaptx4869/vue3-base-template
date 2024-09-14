<script setup lang="ts">
defineOptions({
  name: "Demo",
});
</script>

<template>
  <div>
    <h2>Demo</h2>
    <div>Query: {{ $route.query }}</div>
  </div>
</template>

<style lang="scss" scoped></style>
