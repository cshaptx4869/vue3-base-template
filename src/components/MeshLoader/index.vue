<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  zIndex: {
    type: [String, Number],
    default: 1001,
  },
  background: {
    type: String,
    default: "rgba(255, 255, 255, 0.9)",
  },
  color: {
    type: String,
    default: "#409eff",
  },
});
</script>

<template>
  <div v-if="show" class="mesh-loader">
    <div class="set">
      <div class="circle"></div>
      <div class="circle"></div>
    </div>
    <div class="set">
      <div class="circle"></div>
      <div class="circle"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mesh-loader {
  position: fixed;
  inset: 0;
  /* stylelint-disable-next-line */
  z-index: v-bind(zIndex);
  background-color: v-bind(background);

  .set {
    position: absolute;
    top: 50%;
    left: 50%;

    &:last-child {
      transform: rotate(90deg);
    }

    .circle {
      position: absolute;
      width: 25px;
      height: 25px;
      margin: -12.5px 0 0 -12.5px;
      background-color: v-bind(color);
      border-radius: 50%;
      animation: mesh 3s ease-in-out infinite -1.5s;

      &:last-child {
        animation-delay: 0s;
      }
    }
  }
}

@keyframes mesh {
  0% {
    transform: rotate(0);
    transform-origin: 50% -100%;
  }

  50% {
    transform: rotate(360deg);
    transform-origin: 50% -100%;
  }

  50.00001% {
    transform: rotate(0deg);
    transform-origin: 50% 200%;
  }

  100% {
    transform: rotate(360deg);
    transform-origin: 50% 200%;
  }
}
</style>
